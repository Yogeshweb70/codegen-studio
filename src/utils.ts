import { EmailTemplateModel } from './types';
import { designSystem } from './designSystem';

interface FigmaLinkParts {
  fileKey: string;
  nodeId?: string;
}

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  characters?: string;
  visible?: boolean;
  fills?: Array<{
    type: string;
    visible?: boolean;
    opacity?: number;
    color?: { r: number; g: number; b: number; a: number };
  }>;
  style?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: number;
    lineHeightPx?: number;
  };
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  cornerRadius?: number;
}

interface FigmaFileResponse {
  name: string;
  document: FigmaNode;
}

interface FigmaTemplateAnalysis {
  sourceName: string;
  maxWidth: number;
  backgroundColor: string;
  contentColor: string;
  headingColor: string;
  textColor: string;
  mutedTextColor: string;
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  borderRadius: number;
  heading?: string;
  subtitle?: string;
  ctaText?: string;
  textBlocks: string[];
  previewImageUrl?: string;
}

interface FigmaGenerationResult {
  html: string;
  message: string;
  sourceName: string;
}

export function sanitizeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function sanitizeAttribute(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatDocContent(text: string): string {
  let content = text;

  // Remove unwanted inline style spans but keep content
  content = content.replace(/<span[^>]*style="[^"]*background-color[^"]*"[^>]*>(.*?)<\/span>/gi, '$1');
  content = content.replace(/<span[^>]*style="[^"]*color:\s*rgb\([^)]*\)[^"]*"[^>]*>(.*?)<\/span>/gi, '$1');
  content = content.replace(/<span[^>]*class="[^"]*"[^>]*>(.*?)<\/span>/gi, '$1');
  
  const linkUrls: string[] = [];
  content = content.replace(/\r\n|\r|\n/g, '[[BR]]');

  content = content.replace(/<a\s+[^>]*?href=(['"])(.*?)\1[^>]*>/gi, (_, __, href) => {
    linkUrls.push(href);
    return `[[LINKOPEN_${linkUrls.length - 1}]]`;
  });
  content = content.replace(/<\/a>/gi, '[[LINKCLOSE]]');
  content = content.replace(/\*\*(.*?)\*\*/g, '[[BOLDOPEN]]$1[[BOLDCLOSE]]');
  content = content.replace(/<(strong|b)>/gi, '[[BOLDOPEN]]');
  content = content.replace(/<\/(strong|b)>/gi, '[[BOLDCLOSE]]');
  content = content.replace(/<p[^>]*>/gi, '[[POPEN]]');
  content = content.replace(/<\/p>/gi, '[[PCLOSE]]');
  content = content.replace(/<br\s*\/?>/gi, '[[BR]]');
  content = content.replace(/<(em|i)>/gi, '[[ITALICOPEN]]');
  content = content.replace(/<\/(em|i)>/gi, '[[ITALICCLOSE]]');
  content = content.replace(/<(u)>/gi, '[[UNDERLINEOPEN]]');
  content = content.replace(/<\/(u)>/gi, '[[UNDERLINECLOSE]]');
  content = content.replace(/<h[1-6][^>]*>/gi, '[[HEADINGOPEN]]');
  content = content.replace(/<\/h[1-6]>/gi, '[[HEADINGCLOSE]]');
  content = content.replace(/<li[^>]*>/gi, '[[LIOPEN]]');
  content = content.replace(/<\/li>/gi, '[[LICLOSE]]');
  content = content.replace(/<ol[^>]*>/gi, '[[OLOPEN]]');
  content = content.replace(/<\/ol>/gi, '[[OLCLOSE]]');
  content = content.replace(/<ul[^>]*>/gi, '[[ULOPEN]]');
  content = content.replace(/<\/ul>/gi, '[[ULCLOSE]]');
  content = content.replace(/<img[^>]*src=['"]([^'"]*)[^>]*>/gi, '[[IMAGE:$1]]');

  // Remove any other remaining HTML tags
  content = content.replace(/<[^>]+>/g, '');
  
  content = sanitizeHtml(content);

  content = content
    .replace(/\[\[LINKOPEN_(\d+)\]\]/g, (_match, index) => {
      const href = sanitizeAttribute(linkUrls[Number(index)] ?? '');
      return `<a href="${href}" style="color: #404040; text-decoration: underline;">`;
    })
    .replace(/\[\[LINKCLOSE\]\]/g, '</a>')
    .replace(/\[\[BOLDOPEN\]\]/g, '<strong style="color: #404040; font-weight: 600;">')
    .replace(/\[\[BOLDCLOSE\]\]/g, '</strong>')
    .replace(/\[\[ITALICOPEN\]\]/g, '<em style="color: #404040;">')
    .replace(/\[\[ITALICCLOSE\]\]/g, '</em>')
    .replace(/\[\[UNDERLINEOPEN\]\]/g, '<u style="color: #404040;">')
    .replace(/\[\[UNDERLINECLOSE\]\]/g, '</u>')
    .replace(/\[\[HEADINGOPEN\]\]/g, '<h3 style="margin: 20px 0 12px; font-family:\'Inter\', Arial, sans-serif; font-size: 20px; font-weight: 600; color: #111111;">')
    .replace(/\[\[HEADINGCLOSE\]\]/g, '</h3>')
    .replace(/\[\[LIOPEN\]\]/g, '<li style="margin: 8px 0; color: #404040;">')
    .replace(/\[\[LICLOSE\]\]/g, '</li>')
    .replace(/\[\[OLOPEN\]\]/g, '<ol style="margin: 16px 0; padding-left: 24px; color: #404040;">')
    .replace(/\[\[OLCLOSE\]\]/g, '</ol>')
    .replace(/\[\[ULOPEN\]\]/g, '<ul style="margin: 16px 0; padding-left: 24px; color: #404040;">')
    .replace(/\[\[ULCLOSE\]\]/g, '</ul>')
    .replace(/\[\[IMAGE:([^\]]+)\]\]/g, '<img src="$1" style="display: block; width: 100%; height: auto; margin: 16px 0; border-radius: 8px;" />')
    .replace(/\[\[POPEN\]\]/g, '<p style="margin: 0 0 20px; font-family:\'Inter\', Arial, sans-serif; font-size: 18px; line-height: 23px; color: #404040;">')
    .replace(/\[\[PCLOSE\]\]/g, '</p>')
    .replace(/\[\[BR\]\]/g, '<br />');

  const wrapped = content.startsWith('<p') ? content : `<div style="font-family:'Inter', Arial, sans-serif; color:#404040; font-size:18px; line-height:23px;">${content}</div>`;
  return wrapped;
}

export function defaultTemplate(): EmailTemplateModel {
  return {
    subject: 'Your Campaign Subject',
    preheader: 'This is the email preview text.',
    logoUrl: 'https://myoperator.s3.ap-southeast-1.amazonaws.com/emailers/myoperator-logo.png',
    logoLink: '',
    headerButtonText: 'Login',
    headerButtonUrl: 'https://example.com/login',
    footerText: '© 2026 Company. All rights reserved.',
    footerBrandLine: 'Your Brand helps every customer conversation feel effortless.',
    footerAddress: '123 Business Street, City, Country',
    footerUnsubscribeUrl: '#',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Welcome to our product update',
        subtitle: 'A short, engaging intro that fits the Figma layout.',
        body: 'Use this space to summarize the campaign and explain the value in a concise way.',
        buttonText: 'View Update',
        buttonUrl: 'https://example.com',
        align: 'center',
        buttonColor: '#0F172A',
      },
      {
        id: 'content-1',
        type: 'content',
        title: 'What you need to know',
        body: 'Highlight the main benefits, features, or next steps with a clean paragraph.',
      },
      {
        id: 'feature-1',
        type: 'feature',
        title: 'Security-first design',
        subtitle: 'Designed for modern inboxes and accessibility.',
        imageUrl: 'https://via.placeholder.com/560x280?text=Feature+Image',
        imageAlt: 'Feature preview',
      },
    ],
    docContent: '<p style="margin-top:0;">{{month_label}} Edition</p><h1>What’s new in May 2026</h1><p>Discover product updates, feature improvements, and integration launches designed to help your team move faster.</p><img src="{{hero_image}}" alt="Hero image" /><p><a href="{{cta_link}}">Explore the product update</a></p><h2>Feature highlights</h2><ul><li><strong>Faster onboarding:</strong> New setup workflow reduces time to value.</li><li><strong>Improved analytics:</strong> Real-time dashboards for every team.</li><li><strong>Better automation:</strong> Smarter triggers for easier follow-up.</li></ul><h2>Integration spotlight</h2><p><strong>CRM sync</strong> – Keep contacts updated in real time across systems.</p><p><a href="{{integration_link}}">See integration details</a></p><h2>Ready to launch?</h2><p>Build better product experiences with one platform. Tap below to get started.</p><p><a href="{{cta_link}}">Book your update</a></p><p><img src="{{qr_image}}" alt="Scan to connect" width="176" style="display:block; margin:16px auto 0 auto; border-radius:8px;" /></p>',
  };
}

export function parseFigmaTemplateLink(link: string): FigmaLinkParts | null {
  const trimmed = link.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(trimmed);
    const fileMatch = url.pathname.match(/\/(?:design|file|proto)\/([^/]+)/);
    const branchMatch = url.pathname.match(/\/design\/[^/]+\/branch\/([^/]+)/);
    const fileKey = branchMatch?.[1] ?? fileMatch?.[1];

    if (!fileKey) {
      return null;
    }

    const nodeId = url.searchParams.get('node-id')?.replace('-', ':');
    return { fileKey, nodeId: nodeId || undefined };
  } catch {
    return null;
  }
}

function colorChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value * 255)));
}

function figmaColorToHex(color: { r: number; g: number; b: number }): string {
  return `#${[color.r, color.g, color.b].map((channel) => colorChannel(channel).toString(16).padStart(2, '0')).join('')}`;
}

function luminance(hex: string): number {
  const normalized = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((index) => parseInt(normalized.slice(index, index + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function colorDistance(hexA: string, hexB: string): number {
  const a = hexA.replace('#', '');
  const b = hexB.replace('#', '');
  return [0, 2, 4].reduce((total, index) => total + Math.abs(parseInt(a.slice(index, index + 2), 16) - parseInt(b.slice(index, index + 2), 16)), 0);
}

function getSolidFill(node?: FigmaNode): string | undefined {
  const fill = node?.fills?.find((item) => item.type === 'SOLID' && item.visible !== false && item.color);
  return fill?.color ? figmaColorToHex(fill.color) : undefined;
}

function walkFigmaNodes(node: FigmaNode, visit: (node: FigmaNode) => void) {
  visit(node);
  node.children?.forEach((child) => walkFigmaNodes(child, visit));
}

function findFigmaNode(node: FigmaNode, id: string): FigmaNode | undefined {
  if (node.id === id) {
    return node;
  }

  for (const child of node.children ?? []) {
    const match = findFigmaNode(child, id);
    if (match) {
      return match;
    }
  }

  return undefined;
}

function findFirstFrame(node: FigmaNode): FigmaNode {
  if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    return node;
  }

  for (const child of node.children ?? []) {
    const match = findFirstFrame(child);
    if (match) {
      return match;
    }
  }

  return node;
}

function analyzeFigmaTemplate(root: FigmaNode, sourceName: string, previewImageUrl?: string): FigmaTemplateAnalysis {
  const textNodes: FigmaNode[] = [];
  const colors: string[] = [];
  const fontFamilies: string[] = [];
  const radii: number[] = [];

  walkFigmaNodes(root, (node) => {
    const fill = getSolidFill(node);
    if (fill) {
      colors.push(fill);
    }

    if (node.type === 'TEXT' && node.characters?.trim()) {
      textNodes.push(node);
      if (node.style?.fontFamily) {
        fontFamilies.push(node.style.fontFamily);
      }
    }

    if (typeof node.cornerRadius === 'number' && node.cornerRadius > 0) {
      radii.push(node.cornerRadius);
    }
  });

  const sortedText = [...textNodes].sort((a, b) => {
    const sizeDiff = (b.style?.fontSize ?? 0) - (a.style?.fontSize ?? 0);
    if (Math.abs(sizeDiff) > 4) {
      return sizeDiff;
    }
    return (a.absoluteBoundingBox?.y ?? 0) - (b.absoluteBoundingBox?.y ?? 0);
  });

  const lightColors = colors.filter((color) => luminance(color) > 0.86);
  const darkColors = colors.filter((color) => luminance(color) < 0.32);
  const saturatedColors = colors.filter((color) => luminance(color) >= 0.32 && luminance(color) <= 0.86);
  const headingFill = getSolidFill(sortedText[0]);
  const bodyFill = getSolidFill(sortedText.find((node) => node !== sortedText[0]));
  const rootFill = getSolidFill(root);
  const textBlocks = textNodes
    .sort((a, b) => (a.absoluteBoundingBox?.y ?? 0) - (b.absoluteBoundingBox?.y ?? 0))
    .map((node) => node.characters?.replace(/\s+/g, ' ').trim())
    .filter((text): text is string => Boolean(text && text.length > 2));

  const ctaText = textBlocks.find((text) => text.length <= 32 && /learn|view|start|book|get|try|login|sign|explore|buy|shop|download/i.test(text));
  const width = root.absoluteBoundingBox?.width ? Math.round(root.absoluteBoundingBox.width) : 680;
  const fontFamily = fontFamilies[0] ? `'${fontFamilies[0]}', Arial, sans-serif` : designSystem.typography.body.fontFamily;

  return {
    sourceName,
    maxWidth: Math.max(320, Math.min(720, width)),
    backgroundColor: rootFill && luminance(rootFill) > 0.75 ? rootFill : lightColors[0] ?? designSystem.colors.brand.light,
    contentColor: lightColors.find((color) => colorDistance(color, rootFill ?? '') > 16) ?? '#ffffff',
    headingColor: headingFill ?? darkColors[0] ?? designSystem.colors.text.primary,
    textColor: bodyFill ?? darkColors[1] ?? designSystem.colors.text.secondary,
    mutedTextColor: darkColors[2] ?? '#6b7280',
    primaryColor: saturatedColors[0] ?? darkColors[0] ?? designSystem.colors.primary,
    accentColor: saturatedColors[1] ?? saturatedColors[0] ?? designSystem.colors.accent,
    fontFamily,
    borderRadius: Math.min(28, Math.max(8, Math.round(radii[0] ?? 18))),
    heading: sortedText[0]?.characters?.replace(/\s+/g, ' ').trim(),
    subtitle: sortedText[1]?.characters?.replace(/\s+/g, ' ').trim(),
    ctaText,
    textBlocks: textBlocks.slice(0, 8),
    previewImageUrl,
  };
}

async function fetchFigmaPreviewImage(fileKey: string, nodeId: string, token: string): Promise<string | undefined> {
  const imageUrl = new URL(`/figma-api/v1/images/${fileKey}`, window.location.origin);
  imageUrl.searchParams.set('ids', nodeId);
  imageUrl.searchParams.set('format', 'png');
  imageUrl.searchParams.set('scale', '2');

  const response = await fetch(imageUrl, {
    headers: {
      'X-Figma-Token': token,
    },
  });

  if (!response.ok) {
    return undefined;
  }

  const payload = (await response.json()) as { images?: Record<string, string> };
  return payload.images?.[nodeId];
}

function generateFigmaResponsiveEmailHtml(model: EmailTemplateModel, analysis: FigmaTemplateAnalysis): string {
  const heading = sanitizeHtml(analysis.heading || model.sections[0]?.title || model.subject);
  const subtitle = sanitizeHtml(analysis.subtitle || model.sections[0]?.subtitle || model.preheader);
  const ctaText = sanitizeHtml(analysis.ctaText || model.headerButtonText || model.sections[0]?.buttonText || 'Learn more');
  const ctaUrl = sanitizeHtml(model.headerButtonUrl || model.sections[0]?.buttonUrl || '#');
  const supportingBlocks = analysis.textBlocks
    .filter((text) => text !== analysis.heading && text !== analysis.subtitle && text !== analysis.ctaText)
    .slice(0, 4);
  const fallbackBlocks = model.sections
    .filter((section) => section.body || section.title)
    .map((section) => [section.title, section.body].filter(Boolean).join(': '));
  const bodyBlocks = supportingBlocks.length > 0 ? supportingBlocks : fallbackBlocks;
  const docContentHtml = model.docContent ? formatDocContent(model.docContent) : '';

  const bodyRows = bodyBlocks
    .map((text) => `
                <tr>
                  <td class="figma-card" style="padding:18px 20px; border:1px solid rgba(15,23,42,0.08); border-radius:${analysis.borderRadius}px; background-color:${analysis.contentColor};">
                    <p style="margin:0; font-family:${analysis.fontFamily}; font-size:16px; line-height:24px; color:${analysis.textColor};">${sanitizeHtml(text)}</p>
                  </td>
                </tr>
                <tr><td height="14" style="height:14px; line-height:14px;">&nbsp;</td></tr>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin:0; padding:0; min-width:100% !important; background-color:${analysis.backgroundColor}; }
    table { border-collapse:collapse; }
    img { border:0; height:auto; line-height:100%; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; display:block; }
    .figma-container { width:100%; max-width:${analysis.maxWidth}px; }
    .figma-pad { padding-left:32px !important; padding-right:32px !important; }
    .figma-button { display:inline-block !important; text-align:center; box-sizing:border-box; }
    .figma-hide { display:none; font-size:1px; color:${analysis.backgroundColor}; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; }
    @media screen and (max-width:600px) {
      .figma-pad { padding-left:20px !important; padding-right:20px !important; }
      .figma-button { width:100% !important; }
      .figma-heading { font-size:30px !important; line-height:38px !important; }
      .figma-card { display:block !important; width:100% !important; box-sizing:border-box !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; min-width:100% !important; background-color:${analysis.backgroundColor};">
  <div class="figma-hide">${sanitizeHtml(model.preheader)}</div>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:${analysis.backgroundColor};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" class="figma-container" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:${analysis.maxWidth}px; margin:0 auto; background-color:${analysis.contentColor}; border-radius:${analysis.borderRadius}px; overflow:hidden;">
          <tr>
            <td class="figma-pad" style="padding:28px 32px 0 32px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left" valign="middle" style="width:50%; padding:0;">
                    ${model.logoLink ? `<a href="${sanitizeHtml(model.logoLink)}" target="_blank" style="text-decoration:none;"><img src="${sanitizeHtml(model.logoUrl)}" alt="Logo" width="125" style="display:block; border:0; width:125px; max-width:125px; height:auto;"></a>` : `<img src="${sanitizeHtml(model.logoUrl)}" alt="Logo" width="125" style="display:block; border:0; width:125px; max-width:125px; height:auto;">`}
                  </td>
                  <td align="right" valign="middle" style="width:50%; padding:0;">
                    <a href="${ctaUrl}" target="_blank" style="display:inline-block; background-color:${analysis.primaryColor}; color:#ffffff; font-family:${analysis.fontFamily}; font-size:14px; font-weight:600; line-height:22px; text-decoration:none; padding:10px 18px; border-radius:${Math.max(8, Math.round(analysis.borderRadius / 2))}px;">${ctaText}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="figma-pad" style="padding:34px 32px 0 32px; text-align:left;">
              <p style="margin:0 0 12px; font-family:${analysis.fontFamily}; font-size:13px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:${analysis.accentColor};">${sanitizeHtml(analysis.sourceName)}</p>
              <h1 class="figma-heading" style="margin:0 0 16px; font-family:${analysis.fontFamily}; font-size:40px; line-height:48px; font-weight:700; color:${analysis.headingColor};">${heading}</h1>
              <p style="margin:0 0 24px; font-family:${analysis.fontFamily}; font-size:18px; line-height:28px; color:${analysis.textColor};">${subtitle}</p>
              <a class="figma-button" href="${ctaUrl}" target="_blank" style="display:inline-block; background-color:${analysis.primaryColor}; color:#ffffff; font-family:${analysis.fontFamily}; font-size:16px; font-weight:700; line-height:24px; text-align:center; text-decoration:none; padding:14px 24px; border-radius:${Math.max(10, Math.round(analysis.borderRadius / 1.5))}px;">${ctaText}</a>
            </td>
          </tr>
          ${analysis.previewImageUrl ? `
          <tr>
            <td class="figma-pad" style="padding:30px 32px 0 32px;">
              <img src="${sanitizeHtml(analysis.previewImageUrl)}" alt="${sanitizeHtml(analysis.sourceName)} preview" width="100%" style="display:block; width:100%; max-width:100%; height:auto; border-radius:${analysis.borderRadius}px;" />
            </td>
          </tr>` : ''}
          ${docContentHtml ? `
          <tr>
            <td class="figma-pad" style="padding:28px 32px 0 32px; font-family:${analysis.fontFamily}; color:${analysis.textColor};">
              ${docContentHtml}
            </td>
          </tr>` : ''}
          <tr>
            <td class="figma-pad" style="padding:30px 32px 20px 32px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                ${bodyRows}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:26px 32px; background-color:${analysis.primaryColor}; text-align:center;">
              <p style="margin:0 0 8px; font-family:${analysis.fontFamily}; font-size:16px; line-height:24px; color:#ffffff;">${sanitizeHtml(model.footerBrandLine || model.footerText || 'Thanks for reading.')}</p>
              <p style="margin:0; font-family:${analysis.fontFamily}; font-size:13px; line-height:20px; color:rgba(255,255,255,0.76);">${sanitizeHtml(model.footerAddress || '123 Business Street, City, Country')}</p>
              <p style="margin:12px 0 0; font-family:${analysis.fontFamily}; font-size:12px; line-height:18px; color:rgba(255,255,255,0.76);">Unsubscribe <a href="${sanitizeHtml(model.footerUnsubscribeUrl || '#')}" style="color:#ffffff; text-decoration:underline;">here</a>.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function generateEmailHtmlFromFigmaLink(model: EmailTemplateModel, figmaLink: string, accessToken: string): Promise<FigmaGenerationResult> {
  const parsedLink = parseFigmaTemplateLink(figmaLink);

  if (!parsedLink) {
    throw new Error('Paste a valid Figma design, file, or prototype link before generating.');
  }

  if (!accessToken.trim()) {
    throw new Error('Add a Figma personal access token so the app can read the design file.');
  }

  const response = await fetch(`/figma-api/v1/files/${parsedLink.fileKey}`, {
    headers: {
      'X-Figma-Token': accessToken.trim(),
    },
  });

  if (!response.ok) {
    throw new Error(`Figma could not be loaded (${response.status}). Check the link, file access, and token permissions.`);
  }

  const file = (await response.json()) as FigmaFileResponse;
  const linkedNode = parsedLink.nodeId ? findFigmaNode(file.document, parsedLink.nodeId) : undefined;
  const designRoot = linkedNode ?? findFirstFrame(file.document);
  const previewImageUrl = designRoot.id ? await fetchFigmaPreviewImage(parsedLink.fileKey, designRoot.id, accessToken.trim()) : undefined;
  const analysis = analyzeFigmaTemplate(designRoot, file.name, previewImageUrl);

  return {
    html: generateFigmaResponsiveEmailHtml(model, analysis),
    message: `Generated a responsive email template from "${file.name}".`,
    sourceName: file.name,
  };
}

export function generateEmailHtml(model: EmailTemplateModel): string {
  const sectionsHtml = model.sections
    .map((section) => {
      switch (section.type) {
        case 'hero':
          return `
            <tr>
              <td class="mo-pad" style="padding: 24px 25px 0 25px; text-align: ${section.align || 'center'};">
                ${section.imageUrl ? `<img class="mo-hero-img" src="${sanitizeHtml(section.imageUrl)}" alt="${sanitizeHtml(section.imageAlt ?? '')}" width="100%" style="display:block; border:0; width:100%; max-width:100%; height:auto; margin:0 auto; border-radius:22px;" />` : ''}
                <h1 style="margin: 20px 0 12px; font-family:'Inter', Arial, sans-serif; font-size: 32px; line-height: 40px; font-weight: 700; color: #111111;">${sanitizeHtml(section.title ?? '')}</h1>
                <p style="margin: 0 0 20px; font-family:'Inter', Arial, sans-serif; font-size: 18px; line-height: 26px; color: #404040;">${sanitizeHtml(section.subtitle ?? '')}</p>
                <p style="margin: 0 0 24px; font-family:'Inter', Arial, sans-serif; font-size: 18px; line-height: 26px; color: #404040;">${sanitizeHtml(section.body ?? '')}</p>
                ${section.buttonText ? `<a href="${sanitizeHtml(section.buttonUrl ?? '#')}" class="mo-button" style="display:inline-block; padding: 14px 22px; background-color: ${section.buttonColor ?? '#0f172a'}; color:#ffffff; text-decoration:none; border-radius:11px; font-family:'Inter', Arial, sans-serif; font-size:16px; font-weight:600;">${sanitizeHtml(section.buttonText)}</a>` : ''}
              </td>
            </tr>
          `;
        case 'content':
          return `
            <tr>
              <td class="mo-pad" style="padding: 0 25px 0 25px;">
                ${section.title ? `<p style="margin: 0 0 12px; font-family:'Inter', Arial, sans-serif; font-size: 18px; font-weight: 600; line-height: 23px; color: #000000;">${sanitizeHtml(section.title)}</p>` : ''}
                <p style="margin: 0 0 20px; font-family:'Inter', Arial, sans-serif; font-size: 18px; line-height: 23px; color: #404040;">${sanitizeHtml(section.body ?? '')}</p>
              </td>
            </tr>
          `;
        case 'feature':
          return `
            <tr>
              <td class="mo-pad" style="padding: 0 25px 15px 25px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff; border-radius:9px;">
                  <tr>
                    <td class="mo-card-inner" style="padding:25px 20px;">
                      ${section.imageUrl ? `<img src="${sanitizeHtml(section.imageUrl)}" alt="${sanitizeHtml(section.imageAlt ?? '')}" width="100%" style="display:block; border:0; width:100%; max-width:100%; height:auto; margin-bottom:18px; border-radius:9px;" />` : ''}
                      <p style="margin:0 0 8px; font-family:'Inter', Arial, sans-serif; font-size:18px; font-weight:600; line-height:23px; color:#000000;">${sanitizeHtml(section.title ?? '')}</p>
                      <p style="margin:0; font-family:'Inter', Arial, sans-serif; font-size:16px; font-weight:400; line-height:20px; color:#4b4b4b;">${sanitizeHtml(section.subtitle ?? '')}</p>
                      ${section.buttonText ? `<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top:18px;"><tr><td align="center" style="background-color:#0f172a; border-radius:11.601px;"><a href="${sanitizeHtml(section.buttonUrl ?? '#')}" target="_blank" style="display:block; background-color:#0f172a; color:#ffffff; font-family:'Inter', Arial, sans-serif; font-size:18px; font-weight:500; line-height:26px; text-align:center; text-decoration:none; padding:10px 12px; border-radius:11.601px;">${sanitizeHtml(section.buttonText)}</a></td></tr></table>` : ''}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          `;
        case 'cta':
          return `
            <tr>
              <td class="mo-pad" style="padding: 0 25px 24px 25px; text-align: center;">
                <a href="${sanitizeHtml(section.buttonUrl ?? '#')}" class="mo-button" style="display:inline-block; padding: 14px 22px; background-color: ${section.buttonColor ?? '#0f172a'}; color:#ffffff; text-decoration:none; border-radius:11px; font-family:'Inter', Arial, sans-serif; font-size:18px; font-weight:600;">${sanitizeHtml(section.buttonText ?? 'Take action')}</a>
              </td>
            </tr>
          `;
        default:
          return '';
      }
    })
    .join('');

  const headerButtonText = sanitizeHtml(model.headerButtonText || 'Login');
  const headerButtonUrl = sanitizeHtml(model.headerButtonUrl || '#');
  const footerBrandLine = sanitizeHtml(model.footerBrandLine || model.footerText || 'Your brand helps every customer conversation feel effortless.');
  const footerAddress = sanitizeHtml(model.footerAddress || '123 Business Street, City, Country');
  const footerUnsubscribeUrl = model.footerUnsubscribeUrl ? sanitizeHtml(model.footerUnsubscribeUrl) : '#';
  const docContentHtml = model.docContent ? `
            <tr>
              <td class="mo-pad" style="padding: 24px 25px 0 25px; text-align: left;">
                ${formatDocContent(model.docContent)}
              </td>
            </tr>
          ` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin: 0; padding: 0; min-width: 100% !important; background-color: #DFF2FE; }
    table { border-collapse: collapse; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; display: block; }
    p { margin: 0; display: block; }
    .mo-font { font-family: 'Inter', Arial, sans-serif; }
    .mo-container { width: 100%; max-width: 680px; }
    .mo-content { max-width: 680px; background-color: #ffffff; }
    .mo-pad { padding-left: 25px !important; padding-right: 25px !important; }
    .mo-button { display: inline-block !important; text-align: center; box-sizing: border-box; background-color: #0F172A; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 11px; font-weight: 600; }
    .mo-hero-img { width: 100% !important; max-width: 100% !important; height: auto !important; }
    .mo-card-inner { padding: 25px 20px; }
    .mo-footer-pad { padding-left: 24px !important; padding-right: 24px !important; }
    .mo-hide-mobile { display:none; font-size:1px; color:#fefefe; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; }
    @media screen and (max-width:600px) {
      .mo-pad { padding-left: 20px !important; padding-right: 20px !important; }
      .stack-col { display: block !important; width: 100% !important; max-width: 100% !important; }
      .mo-button { width: 100% !important; }
    }
  </style>
</head>
<body class="mo-font" style="margin:0; padding:0; min-width:100% !important; background-color:#DFF2FE;">
  <div class="mo-hide-mobile">${sanitizeHtml(model.preheader)}</div>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#DFF2FE;">
    <tr>
      <td align="center" style="padding: 0;">
        <table role="presentation" class="mo-container" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:680px; margin:0 auto; background-color:#ffffff;">
          <tr>
            <td class="mo-content" style="padding:0; background-color:#ffffff; overflow:hidden;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td class="mo-pad" style="padding:26px 25px 0 25px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="left" valign="middle" style="width:50%; padding:0;">
                          ${model.logoLink ? `<a href="${sanitizeHtml(model.logoLink)}" target="_blank" style="text-decoration:none;"><img src="${sanitizeHtml(model.logoUrl)}" alt="Logo" width="125" style="display:block; border:0; width:125px; max-width:125px; height:auto;"></a>` : `<img src="${sanitizeHtml(model.logoUrl)}" alt="Logo" width="125" style="display:block; border:0; width:125px; max-width:125px; height:auto;">`}
                        </td>
                        <td align="right" valign="middle" style="width:50%; padding:0;">
                          <a class="mo-button" href="${headerButtonUrl}" target="_blank" style="display:inline-block; background-color:#0F172A; color:#ffffff; font-family:'Inter', Arial, sans-serif; font-size:14px; font-weight:500; line-height:24px; text-decoration:none; padding:10px 20px; border-radius:8px;">${headerButtonText}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              ${docContentHtml}
              ${sectionsHtml}
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="content" style="background-color: #0F172A; padding-top: 20px;">
                <tbody>
                  <tr>
                    <td align="center" class="pb-0" style="padding-top: 10px;">
                      <a href="https://myo.bz/myopfb" style="text-decoration: none; display: inline-block;" target="_blank">
                        <img class="social-icons" src="https://myoperator.s3.ap-southeast-1.amazonaws.com/emailers/facebook-socal-white-strock-icon.png" alt="facebook">
                      </a>
                      <a href="https://myo.bz/twt" style="text-decoration: none; display: inline-block;" target="_blank">
                        <img class="social-icons" src="https://myoperator.s3.ap-southeast-1.amazonaws.com/emailers/x-socal-white-strock-icon.png" alt="Twitter">
                      </a>
                      <a href="https://myo.bz/lin" style="text-decoration: none; display: inline-block;" target="_blank">
                        <img class="social-icons" src="https://myoperator.s3.ap-southeast-1.amazonaws.com/emailers/linkedin-socal-white-strock-icon.png" alt="Linkedin">
                      </a>
                      <a href="https://myo.bz/ytbsub" style="text-decoration: none; display: inline-block;" target="_blank">
                        <img class="social-icons" src="https://myoperator.s3.ap-southeast-1.amazonaws.com/emailers/youtube-socal-white-strock-icon.png" alt="Youtube">
                      </a>
                      <a href="https://myo.bz/insta" style="text-decoration: none; display: inline-block;" target="_blank">
                        <img class="social-icons" src="https://myoperator.s3.ap-southeast-1.amazonaws.com/emailers/instagram-socal-white-strock-icon.png" alt="Instagram">
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td class="p-20-10 py-0" style="padding: 20px; padding-bottom: 0px;">
                      <div style="display: block; margin-bottom: 10px; text-align: center;">
                        <p style="margin: 0; font-size: 16px; color: #ffffff; font-family: 'Roboto', sans-serif; text-align: center; line-height: 28px; margin-top: 10px; padding: 8px 20px; background-color: #1a2234; border-radius: 100px; display: inline-block; font-weight: 600;">WhatsApp • Calls • Al Bots</p>
                      </div>
                      <p style="margin: 0; font-size: 16px; color: #ffffff; font-family: 'Roboto', sans-serif; text-align: center; line-height: 28px; margin-bottom: 10px; margin-top: 10px;">
                        © VoiceTree Technologies Private Limited. All rights reserved.<br>
                        <a href="#" style="cursor: text; text-decoration: none; color: #ffffff;">MyOperator, 91Springboard, Plot No. D-107, Sector 2, Noida, Uttar Pradesh, India – 201301</a><br>
                      </p>
                      <p style="margin: 0; font-size: 13px; color: #ffffff; font-family: 'Roboto', sans-serif; text-align: center; line-height: 18px; margin-bottom: 10px;">Hate growth-driven communications for your business? Unsubscribe <a href="$[LI:SUB_PREF]$" style="color: #ffffff; text-decoration: none;">here</a>.<br></p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
