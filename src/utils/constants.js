// Domain Values for Dropdowns
export const ZONES = ["1", "2", "3", "4", "5", "6", "7"];

export const PROPERTY_TYPES = [
  "Residential",
  "Commercial",
  "Mixed",
  "Industrial",
  "Institutional",
  "Government",
  "Vacant Land",
  "Firm/Trust",
  "Religious",
];
export const PROPERTY_LOCATIONS = ["Main Road", "Market", "Other"];

export const getStatusIcon = (status) => {
  switch (status) {
    case "synced":
      return "✅";
    case "pending":
      return "⏳";
    case "failed":
      return "❌";
    default:
      return "⚪";
  }
};

export const TAX_RATE_ZONES = [
  "Zone 1",
  "Zone 2",
  "Zone 3",
  "Zone 4",
  "Zone 5",
];
export const PROPERTY_STATUS = [
  "Existing",
  "New Construction",
  "Under Construction",
];

export const OWNERSHIP_TYPES = [
  "Individual (Single/Joint)",
  "Limited Company",
  "Firm/Trust/Society",
  "Central Government",
  "State Government",
  "Urban Local Body",
  "Leasehold (Patta)",
];

export const CONSTRUCTION_TYPES = ["RCC", "Pucca", "Tin", "Vacant", "Kachha"];

export const ROOF_TYPES = ["RCC", "Tin", "Tile", "Kachcha", "N/A", "Other"];

export const PRIMARY_USES = [
  "Residential",
  "Commercial",
  "Industrial",
  "Institutional",
];

export const COMMERCIAL_ACTIVITIES = [
  "Shop",
  "Office",
  "Hotel",
  "Clinic",
  "School",
  "Other",
];

export const OCCUPANCY_STATUS = ["Owner Occupied", "Tenant", "Vacant"];

export const OCCUPANCY_TYPES = ["Self", "Tenant", "Vacant"];

export const EXEMPTION_CATEGORIES = [
  "Government",
  "Religious",
  "Educational",
  "Other",
];
export const FLOOR_OPTIONS = [
  "Basement",
  "Basement Level 1",
  "Basement Level 2",
  "Basement Level 3",
  "Ground Floor",
  "First Floor",
  "Second Floor",
  "Third Floor",
  "Fourth Floor",
  "Fifth Floor",
  "Sixth Floor",
  "Seventh Floor",
  "Eighth Floor",
  "Ninth Floor",
  "Tenth Floor",
  "Eleventh Floor",
  "Twelfth Floor",
];

export const USAGE_TYPES = [
  "Residential",
  "Restaurant/Lodging House",
  "Shop/Office/Bank",
  "Commercial",
  "Clinic/Nursing Home/Health Centre",
  "Diagnostic Centre/Care Institution",
  "Educational Institution",
  "Industrial",
  "Religious Place",
  "Government Office",
  "Others (Specify)",
];
export const RESPONDENT_STATUS_OPTIONS = [
  "Owner",
  "Tenant",
  "Employee",
  "Other",
];
export const SEWERAGE_TYPES = [
  "ULB Sewer Network",
  "Septic Tank",
  "Open Drains",
  "Flush Toilet with Pit Latrine",
  "Dry / Bucket Toilet",
];
export const DOOR_COLLECTION_TYPES = [
  "Urban Local Body",
  "Colonizer / Developer",
  "RWA / Neighborhood Committee",
  "Others",
];
export const USAGE_FACTORS = ["Self Occupied", "Rented", "Vacant"];
export const YES_NO_OPTIONS = ["Yes", "No"];

// Step Configuration
export const TOTAL_STEPS = 10;

export const getStepNames = (t) => [
  t("survey_steps.survey_info"),
  t("survey_steps.owner_details"),
  t("form_titles.property_details"),
  t("survey_steps.land_building"),
  t("form_titles.tax_related_information"),
  t("form_titles.utility_connections"),
  t("form_titles.smart_addressing"),
  t("form_titles.verification_checklist"),
  t("form_titles.documents"),
  t("form_titles.remarks"),
];
