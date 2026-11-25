import {
  CalendarDays,
  Contact,
  FingerprintPattern,
  IdCard,
  MailPlus,
  MapPinHouse,
  RefreshCcwDot,
  Smartphone,
  UserRoundCog,
  type LucideIcon,
} from "lucide-react";

export type ServiceSlug =
  | "account-conversion"
  | "account-upgrade"
  | "address-update"
  | "date-of-birth-update"
  | "dormant-account-reactivation"
  | "email-update"
  | "identity-document-update"
  | "phone-number-update"
  | "bvn-update";

export type AccountService = {
  slug: ServiceSlug;
  title: string;
  requirements: string[];
  ctaLabel: string;
  icon: LucideIcon;
  /** Whether the service flow is implemented in this portal. */
  available: boolean;
};

const BVN = "BVN";
const NIN = "NIN";
const PROOF_OF_IDENTITY = "Proof of Identity";

export const accountServices: AccountService[] = [
  {
    slug: "account-conversion",
    title: "Account Conversion/ Migration",
    requirements: [
      BVN,
      NIN,
      "Proof of Identity (Notarized if applicable)",
      "Proof of Address (Notarized if applicable)",
    ],
    ctaLabel: "Convert your account",
    icon: RefreshCcwDot,
    available: false,
  },
  {
    slug: "account-upgrade",
    title: "Account Upgrade (Tier 1 and 2)",
    requirements: [BVN, NIN, PROOF_OF_IDENTITY],
    ctaLabel: "Upgrade Tier 1 or Tier 2 account",
    icon: UserRoundCog,
    available: false,
  },
  {
    slug: "address-update",
    title: "Address Update",
    requirements: [BVN, NIN, PROOF_OF_IDENTITY, "Proof of Address"],
    ctaLabel: "Update address",
    icon: MapPinHouse,
    available: false,
  },
  {
    slug: "date-of-birth-update",
    title: "Date of Birth Update",
    requirements: [BVN, "Valid ID Card", "Proof of Identity or Court Affidavit"],
    ctaLabel: "Update your date of birth",
    icon: CalendarDays,
    available: false,
  },
  {
    slug: "dormant-account-reactivation",
    title: "Dormant Account Reactivation",
    requirements: [
      BVN,
      NIN,
      "Proof of Identity (Notarized if applicable)",
      "Proof of Address (Notarized if applicable)",
    ],
    ctaLabel: "Reactivate an account",
    icon: Contact,
    available: false,
  },
  {
    slug: "email-update",
    title: "Email Update",
    requirements: [BVN, NIN],
    ctaLabel: "Update your email address",
    icon: MailPlus,
    available: false,
  },
  {
    slug: "identity-document-update",
    title: "Identity Document Update",
    requirements: [BVN, NIN, PROOF_OF_IDENTITY],
    ctaLabel: "Update identification document",
    icon: IdCard,
    available: true,
  },
  {
    slug: "phone-number-update",
    title: "Phone Number Update",
    requirements: [BVN, NIN],
    ctaLabel: "Update your phone number",
    icon: Smartphone,
    available: false,
  },
  {
    slug: "bvn-update",
    title: "BVN Update",
    requirements: ["Proof of identity", "Affidavit"],
    ctaLabel: "Update your BVN",
    icon: FingerprintPattern,
    available: false,
  },
];

export const findService = (slug: string | undefined) =>
  accountServices.find((service) => service.slug === slug);
