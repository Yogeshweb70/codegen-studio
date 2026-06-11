export type EmailSectionType =
  | 'hero'
  | 'content'
  | 'feature'
  | 'cta'
  | 'footer';

export interface EmailContentItem {
  id: string;
  type: EmailSectionType;
  title?: string;
  subtitle?: string;
  body?: string;
  buttonText?: string;
  buttonUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  align?: 'left' | 'center' | 'right';
  buttonColor?: string;
}

export interface EmailTemplateModel {
  subject: string;
  preheader: string;
  logoUrl: string;
  logoLink?: string;
  headerButtonText?: string;
  headerButtonUrl?: string;
  footerText: string;
  footerBrandLine?: string;
  footerAddress?: string;
  footerUnsubscribeUrl?: string;
  docContent?: string;
  sections: EmailContentItem[];
}
