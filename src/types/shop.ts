export interface Shop {
  id: string;
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website: string;
  phone: string;
  email: string;
  dateAdded: string;
  dateUpdated: string;
  hasCBD: boolean;
  businessType: BusinessType;
  hasMarijuana: boolean;
  hasKratom: boolean;
  buyerName: string;
  title: string;
  claimed: boolean;
  latitude: number;
  longitude: number;
}

export enum BusinessType {
  Tobacco = "T",
  Vape = "V",
  Smoke = "S",
  Hookah = "H",
  CBD = "C",
  Lounge = "L",
  Other = "O"
}

export const businessTypeLabels: Record<BusinessType, string> = {
  [BusinessType.Tobacco]: "Tobacco Shop",
  [BusinessType.Vape]: "Vape Shop",
  [BusinessType.Smoke]: "Smoke Shop",
  [BusinessType.Hookah]: "Hookah Shop",
  [BusinessType.CBD]: "CBD Dispensary",
  [BusinessType.Lounge]: "Lounge",
  [BusinessType.Other]: "Other"
};