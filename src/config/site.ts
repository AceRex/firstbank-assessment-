export const site = {
  bankName: "Logic Bank",
  portalName: "Account Management Portal",
  openAccountUrl: "#",
  helpUrl: "#",
  assistantName: "Logi",
  assistantUrl: "#",
  copyright: `© ${new Date().getFullYear()} Logic Bank Ltd. Licensed by the Central Bank of Nigeria`,
} as const;

export type FooterLink = { label: string; href: string };
export type FooterColumn = { heading: string; links: FooterLink[] };

const link = (label: string): FooterLink => ({ label, href: "#" });

export const footerColumns: FooterColumn[] = [
  {
    heading: "Banking",
    links: [
      "Corporate Information",
      "Personal Banking",
      "Business Banking",
      "Private Banking",
      "Loan Calculator",
      "Vendor Portal",
      "Download Forms",
      "USSD",
      "Update BVN/NIN",
    ].map(link),
  },
  {
    heading: "Security",
    links: ["BVN", "Anti-Fraud", "Security Tips", "Secure Code"].map(link),
  },
  {
    heading: "Contact Us",
    links: [
      "Feedback and Complaints",
      "Whistleblowing",
      "Find a Branch",
      "Contact Form",
      "Find an Agent",
      "Agent Network",
    ].map(link),
  },
  {
    heading: "Legal",
    links: [
      "Sitemap",
      "Terms of Use",
      "Privacy Policy",
      "Cookies Policy",
      "Communications Policy",
      "Information and Cybersecurity Policy",
      "Delete Mobile Profile",
    ].map(link),
  },
];

export const languages = [{ code: "en", label: "English" }] as const;
