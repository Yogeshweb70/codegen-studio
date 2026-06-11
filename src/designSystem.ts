/**
 * Design System Guide
 * Reference guide for creating consistent emails and UI components
 * Based on typography, colors, and spacing guidelines
 * 
 * Usage: Import and reference when generating email templates
 */

export const designSystem = {
  // ============================================
  // TYPOGRAPHY SYSTEM
  // ============================================
  typography: {
    // Heading Styles
    h1: {
      fontSize: '32px',
      fontWeight: 700,
      lineHeight: '40px',
      letterSpacing: '0px',
      color: '#111111',
      fontFamily: "'Inter', Arial, sans-serif",
      marginBottom: '18px',
    },
    h2: {
      fontSize: '24px',
      fontWeight: 700,
      lineHeight: '32px',
      letterSpacing: '0px',
      color: '#111111',
      fontFamily: "'Inter', Arial, sans-serif",
      marginBottom: '16px',
    },
    h3: {
      fontSize: '20px',
      fontWeight: 700,
      lineHeight: '28px',
      letterSpacing: '0px',
      color: '#111111',
      fontFamily: "'Inter', Arial, sans-serif",
      marginBottom: '14px',
    },
    h4: {
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: '26px',
      letterSpacing: '0px',
      color: '#111111',
      fontFamily: "'Inter', Arial, sans-serif",
      marginBottom: '12px',
    },
    // Body Text Styles
    body: {
      fontSize: '18px',
      fontWeight: 400,
      lineHeight: '26px',
      letterSpacing: '0px',
      color: '#404040',
      fontFamily: "'Inter', Arial, sans-serif",
      marginBottom: '20px',
    },
    bodySmall: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '24px',
      letterSpacing: '0px',
      color: '#4b4b4b',
      fontFamily: "'Inter', Arial, sans-serif",
      marginBottom: '16px',
    },
    // Caption/Small Text
    caption: {
      fontSize: '13px',
      fontWeight: 400,
      lineHeight: '18px',
      letterSpacing: '0px',
      color: '#6b7280',
      fontFamily: "'Inter', Arial, sans-serif",
    },
    // Bold/Strong Text
    strong: {
      fontWeight: 600,
      color: '#404040',
    },
    // Link Styles
    link: {
      color: '#404040',
      textDecoration: 'underline',
      fontWeight: 400,
    },
  },

  // ============================================
  // COLOR PALETTE
  // ============================================
  colors: {
    // Semantic Colors
    primary: '#0F172A',
    secondary: '#6B7280',
    accent: '#28C7D9',

    // Neutral/Grayscale
    neutrals: {
      darkest: '#111111',
      dark: '#404040',
      medium: '#6b7280',
      light: '#d1d5db',
      lighter: '#f3f6fb',
      lightest: '#ffffff',
    },

    // Status Colors
    status: {
      error: '#dc2626',
      warning: '#f59e0b',
      success: '#10b981',
      info: '#3b82f6',
    },

    // Brand Colors
    brand: {
      dark: '#0F172A',
      light: '#DFF2FE',
    },

    // Background Colors
    backgrounds: {
      primary: '#ffffff',
      secondary: '#f3f6fb',
      tertiary: '#f4f0ec',
      dark: '#0F172A',
    },

    // Text Colors
    text: {
      primary: '#111111',
      secondary: '#404040',
      tertiary: '#6b7280',
      inverse: '#ffffff',
    },

    // Border Colors
    borders: {
      light: '#dbdbdb',
      medium: '#d1d5db',
      dark: '#6b7280',
    },
  },

  // ============================================
  // SPACING SYSTEM
  // ============================================
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
  },

  // ============================================
  // COMPONENT STYLES
  // ============================================
  components: {
    // Button Styles
    button: {
      primary: {
        backgroundColor: '#0F172A',
        color: '#ffffff',
        padding: '14px 22px',
        fontSize: '16px',
        fontWeight: 600,
        borderRadius: '11px',
        textDecoration: 'none',
        display: 'inline-block',
        fontFamily: "'Inter', Arial, sans-serif",
      },
      secondary: {
        backgroundColor: '#ffffff',
        color: '#0F172A',
        padding: '14px 22px',
        fontSize: '16px',
        fontWeight: 600,
        borderRadius: '11px',
        border: '1px solid #0F172A',
        textDecoration: 'none',
        display: 'inline-block',
        fontFamily: "'Inter', Arial, sans-serif",
      },
      small: {
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: 500,
        borderRadius: '8px',
      },
      large: {
        padding: '18px 28px',
        fontSize: '18px',
        fontWeight: 600,
        borderRadius: '12px',
      },
    },

    // Card Styles
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '9px',
      padding: '25px 20px',
      boxShadow: 'none',
      border: '1px solid #e5e7eb',
    },

    // Hero Section
    hero: {
      padding: '24px 25px',
      textAlign: 'center',
      imageUrl: '{{hero_image}}',
      imageRadius: '22px',
    },

    // Feature Card
    featureCard: {
      backgroundColor: '#ffffff',
      borderRadius: '9px',
      padding: '25px 20px',
      imageRadius: '9px',
      marginBottom: '15px',
    },

    // Badge/Pill
    badge: {
      backgroundColor: '#1a2234',
      color: '#ffffff',
      borderRadius: '100px',
      padding: '8px 20px',
      fontSize: '16px',
      fontWeight: 600,
      display: 'inline-block',
    },

    // Footer
    footer: {
      backgroundColor: '#0F172A',
      color: '#ffffff',
      padding: '32px 24px',
      fontSize: '16px',
      lineHeight: '28px',
    },
  },

  // ============================================
  // EMAIL-SPECIFIC STYLES
  // ============================================
  email: {
    // Container Settings
    container: {
      maxWidth: '680px',
      backgroundColor: '#ffffff',
    },

    // Email Body
    body: {
      backgroundColor: '#DFF2FE',
      margin: '0',
      padding: '0',
      minWidth: '100%',
      fontFamily: "'Inter', Arial, sans-serif",
    },

    // Responsive Settings
    responsive: {
      mobileMaxWidth: '600px',
      mobilePadding: '20px',
      desktopPadding: '25px',
    },

    // Section Spacing
    sectionPadding: {
      default: '24px 25px',
      hero: '24px 25px 0 25px',
      footer: '32px 24px',
    },

    // CSS Classes for Email
    classes: {
      moFont: "font-family: 'Inter', Arial, sans-serif;",
      moContainer: 'width: 100%; max-width: 680px;',
      moContent: 'max-width: 680px; background-color: #ffffff;',
      moPad: 'padding-left: 25px !important; padding-right: 25px !important;',
      moButton: 'display: inline-block !important; text-align: center; background-color: #0F172A; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 11px; font-weight: 600;',
      moHeroImg: 'width: 100% !important; max-width: 100% !important; height: auto !important;',
      moCardInner: 'padding: 25px 20px;',
      moHideMobile: 'display: none !important; font-size: 0; line-height: 0; max-height: 0; overflow: hidden;',
    },
  },

  // ============================================
  // MEDIA QUERIES / RESPONSIVE RULES
  // ============================================
  responsive: {
    mobileBreakpoint: '600px',
    tabletBreakpoint: '768px',
    desktopBreakpoint: '1024px',

    // Mobile adjustments
    mobile: {
      padding: '20px',
      buttonFullWidth: true,
      stackColumns: true,
      imageScale: '100%',
    },

    // Tablet adjustments
    tablet: {
      padding: '20px',
      buttonFullWidth: false,
      stackColumns: false,
      imageScale: '100%',
    },

    // Desktop adjustments
    desktop: {
      padding: '25px',
      buttonFullWidth: false,
      stackColumns: false,
      imageScale: '100%',
    },
  },

  // ============================================
  // SOCIAL ICONS / LINKS
  // ============================================
  socialIcons: {
    facebook: {
      url: 'https://myo.bz/myopfb',
      icon: 'https://myoperator.s3.ap-southeast-1.amazonaws.com/emailers/facebook-socal-white-strock-icon.png',
      alt: 'Facebook',
      width: '31px',
      height: '31px',
    },
    twitter: {
      url: 'https://myo.bz/twt',
      icon: 'https://myoperator.s3.ap-southeast-1.amazonaws.com/emailers/x-socal-white-strock-icon.png',
      alt: 'Twitter',
      width: '31px',
      height: '31px',
    },
    linkedin: {
      url: 'https://myo.bz/lin',
      icon: 'https://myoperator.s3.ap-southeast-1.amazonaws.com/emailers/linkedin-socal-white-strock-icon.png',
      alt: 'LinkedIn',
      width: '31px',
      height: '31px',
    },
    youtube: {
      url: 'https://myo.bz/ytbsub',
      icon: 'https://myoperator.s3.ap-southeast-1.amazonaws.com/emailers/youtube-socal-white-strock-icon.png',
      alt: 'YouTube',
      width: '31px',
      height: '31px',
    },
    instagram: {
      url: 'https://myo.bz/insta',
      icon: 'https://myoperator.s3.ap-southeast-1.amazonaws.com/emailers/instagram-socal-white-strock-icon.png',
      alt: 'Instagram',
      width: '31px',
      height: '31px',
    },
  },

  // ============================================
  // USAGE EXAMPLES
  // ============================================
  examples: {
    // Example: Creating a hero section
    heroSection: `
      <tr>
        <td class="mo-pad" style="padding: 24px 25px 0 25px; text-align: center;">
          <img class="mo-hero-img" src="{{hero_image}}" alt="Hero" width="100%" style="display:block; border:0; border-radius:22px;" />
          <h1 style="margin: 20px 0 12px; font-family:'Inter', Arial, sans-serif; font-size: 32px; font-weight: 700; color: #111111;">Headline Here</h1>
          <p style="margin: 0 0 20px; font-family:'Inter', Arial, sans-serif; font-size: 18px; color: #404040;">Supporting text here</p>
          <a href="#" class="mo-button" style="display:inline-block; padding: 14px 22px; background-color: #0f172a; color:#ffffff; text-decoration:none; border-radius:11px; font-weight:600;">CTA Button</a>
        </td>
      </tr>
    `,

    // Example: Creating a feature card
    featureCard: `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff; border-radius:9px;">
        <tr>
          <td class="mo-card-inner" style="padding:25px 20px;">
            <img src="{{feature_image}}" alt="Feature" width="100%" style="display:block; border-radius:9px; margin-bottom:18px;" />
            <p style="margin:0 0 8px; font-size:18px; font-weight:600; color:#000000;">Feature Title</p>
            <p style="margin:0; font-size:16px; color:#4b4b4b;">Feature description here</p>
          </td>
        </tr>
      </table>
    `,

    // Example: Creating footer
    footer: `
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0F172A;">
        <tr>
          <td align="center" style="padding:32px 24px;">
            <p style="margin: 0; color: #ffffff; font-family:'Inter', Arial, sans-serif; font-size: 16px; line-height: 28px;">
              © VoiceTree Technologies Private Limited
            </p>
          </td>
        </tr>
      </table>
    `,
  },
};

/**
 * Helper function to get a specific design token value
 * Usage: getDesignToken('colors.primary') returns '#0F172A'
 */
export function getDesignToken(path: string): any {
  return path.split('.').reduce((obj: any, key: string) => obj?.[key], designSystem);
}

/**
 * Helper function to merge design system styles with custom overrides
 * Usage: mergeStyles(designSystem.typography.h1, { color: '#ff0000' })
 */
export function mergeStyles(baseStyle: Record<string, any>, overrides?: Record<string, any>): Record<string, any> {
  return { ...baseStyle, ...overrides };
}

export default designSystem;
