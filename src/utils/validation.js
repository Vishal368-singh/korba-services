const isEmpty = (value) => {
  return value === undefined || value === null || String(value).trim() === "";
};

const isValidLatitude = (value) => {
  const latitude = Number(value);

  return !Number.isNaN(latitude) && latitude >= -90 && latitude <= 90;
};

const isValidLongitude = (value) => {
  const longitude = Number(value);

  return !Number.isNaN(longitude) && longitude >= -180 && longitude <= 180;
};
export const validateSectionA = (data) => {
  const errors = {};

  // Parcel Number
  if (isEmpty(data.parcel_no)) {
    errors.parcel_no = "Parcel Number is required";
  } else if (!/^\d{5}$/.test(data.parcel_no)) {
    errors.parcel_no = "Parcel Number must be 5 digits";
  }

  // Ward Number
  if (isEmpty(data.ward_no)) {
    errors.ward_no = "Ward Number is required";
  } else if (
    !/^\d{1,3}$/.test(data.ward_no) ||
    parseInt(data.ward_no, 10) < 1 ||
    parseInt(data.ward_no, 10) > 999
  ) {
    errors.ward_no = "Invalid Ward Number";
  }

  // Zone
  if (isEmpty(data.zone)) {
    errors.zone = "Zone is required";
  } else if (data.zone.length > 50) {
    errors.zone = "Zone must be at most 50 characters";
  }

  // Colony / Locality
  if (isEmpty(data.colony_locality)) {
    errors.colony_locality = "Colony / Locality is required";
  } else if (data.colony_locality.length > 150) {
    errors.colony_locality = "Colony / Locality must be at most 150 characters";
  }

  // Property ID
  if (isEmpty(data.property_id)) {
    errors.property_id = "Property ID is required";
  } else if (!/^\d{3}$/.test(data.property_id)) {
    errors.property_id = "Property ID must be 3 digits";
  }
  // Surveyor Name
  if (isEmpty(data.surveyor_name)) {
    errors.surveyor_name = "Surveyor Name is required";
  } else if (data.surveyor_name.length > 100) {
    errors.surveyor_name = "Surveyor Name must be at most 100 characters";
  }
if (isEmpty(data.survey_id)) {
  errors.survey_id = "Survey ID is required";
}

  // Existing Property ID
  if (isEmpty(data.existing_property_id)) {
    errors.existing_property_id = "Existing Property ID is required";
  } else if (!/^\d{6}$/.test(data.existing_property_id)) {
    errors.existing_property_id = "Existing Property ID must be 6 digits";
  }

  // Surveyor ID
  // Surveyor ID
  if (isEmpty(data.surveyor_id)) {
    errors.surveyor_id = "Surveyor ID is required";
  }
  // Existing Property ID - optional
  if (data.existing_property_id && !/^\d{6}$/.test(data.existing_property_id)) {
    errors.existing_property_id = "Existing Property ID must be 6 digits";
  }

  // GPS Latitude
  if (isEmpty(data.gps_latitude)) {
    errors.gps_latitude = "GPS Latitude is required";
  } else if (!isValidLatitude(data.gps_latitude)) {
    errors.gps_latitude = "Invalid GPS Latitude";
  }

  // GPS Longitude
  if (isEmpty(data.gps_longitude)) {
    errors.gps_longitude = "GPS Longitude is required";
  } else if (!isValidLongitude(data.gps_longitude)) {
    errors.gps_longitude = "Invalid GPS Longitude";
  }

  // Tax Rate Zone
  if (isEmpty(data.tax_rate_zone)) {
    errors.tax_rate_zone = "Tax Rate Zone is required";
  } else if (data.tax_rate_zone.length > 50) {
    errors.tax_rate_zone = "Tax Rate Zone must be at most 50 characters";
  }

  // Property Location
  if (isEmpty(data.property_location)) {
    errors.property_location = "Property Location is required";
  } else if (data.property_location.length > 250) {
    errors.property_location =
      "Property Location must be at most 250 characters";
  }

  // Property Location Other
  if (
    data.property_location === "Other" &&
    isEmpty(data.property_location_other)
  ) {
    errors.property_location_other = "Property Location Other is required";
  }

  return errors;
};
export const validateLandBuilding = (data) => {
  const errors = {};

  // Plot Area
  if (isEmpty(data.plot_area)) {
    errors.plot_area = "Plot Area is required";
  } else if (isNaN(Number(data.plot_area))) {
    errors.plot_area = "Plot Area must be a number";
  } else if (Number(data.plot_area) <= 0) {
    errors.plot_area = "Plot Area must be greater than 0";
  }

  // Plinth Area
  if (isEmpty(data.plinth_area)) {
    errors.plinth_area = "Plinth Area is required";
  } else if (isNaN(Number(data.plinth_area))) {
    errors.plinth_area = "Plinth Area must be a number";
  } else if (Number(data.plinth_area) <= 0) {
    errors.plinth_area = "Plinth Area must be greater than 0";
  }
  // Year of Construction - Mandatory
  if (isEmpty(data.year_of_construction)) {
    errors.year_of_construction = "Year of Construction is required";
  } else if (!/^\d{4}$/.test(String(data.year_of_construction))) {
    errors.year_of_construction = "Year of Construction must be a 4-digit year";
  } else {
    const year = Number(data.year_of_construction);
    const currentYear = new Date().getFullYear();

    if (year > currentYear) {
      errors.year_of_construction =
        "Year of Construction cannot be in the future";
    }
  }
  // Total Built-up Area
  if (isEmpty(data.total_builtup_area)) {
    errors.total_builtup_area = "Total Built-up Area is required";
  } else if (isNaN(Number(data.total_builtup_area))) {
    errors.total_builtup_area = "Total Built-up Area must be a number";
  } else if (Number(data.total_builtup_area) <= 0) {
    errors.total_builtup_area = "Total Built-up Area must be greater than 0";
  }

  // Building Age
  // This is calculated automatically, so only validate
  // if a value exists.
  if (
    data.building_age !== undefined &&
    data.building_age !== "" &&
    (isNaN(Number(data.building_age)) || Number(data.building_age) < 0)
  ) {
    errors.building_age = "Building Age must be a valid number";
  }

  return errors;
};
export const validateOwnerDetails = (data) => {
  const errors = {};

  if (!data["Name of Respondent"]?.trim()) {
    errors["Name of Respondent"] = "Name of Respondent is required";
  }

  if (!data["Relationship of Respondent with Property Owner"]?.trim()) {
    errors["Relationship of Respondent with Property Owner"] =
      "Relationship is required";
  }

  if (!data.owner_name?.trim()) {
    errors.owner_name = "Owner Name is required";
  }

  if (!data.father_husband_name?.trim()) {
    errors.father_husband_name = "Father's / Husband Name is required";
  }

  if (!data.mobile_number) {
    errors.mobile_number = "Mobile number is required";
  } else if (!/^[6-9]\d{9}$/.test(data.mobile_number)) {
    errors.mobile_number = "Invalid mobile number";
  }

  if (!data.correspondence_address?.trim()) {
    errors.correspondence_address = "Correspondence Address is required";
  }

  if (!data.Pincode?.trim()) {
    errors.Pincode = "Pincode is required";
  }

  return errors;
};
export const validatePropertyDetails = (data) => {
  const errors = {};

  if (!data.property_status) {
    errors.property_status = "Property Status is required";
  }

  if (
    data.building_permission_available === undefined ||
    data.building_permission_available === null ||
    data.building_permission_available === ""
  ) {
    errors.building_permission_available =
      "Building Permission Available is required";
  }

  if (!data.property_ownership) {
    errors.property_ownership = "Property Ownership is required";
  }

  return errors;
};
// export const validateSectionH = (data) => {
//   const errors = {};

//   // Sewerage Type is mandatory when Sewer Connection is Yes
// if (
//   (data.sewer_connection === true ||
//     String(data.sewer_connection).toLowerCase() === "true") &&
//   (!data.sewerage_type || String(data.sewerage_type).trim() === "")
// ) {
//   errors.sewerage_type = "Sewerage Type is required";
// }

//   // Electricity Consumer No. is mandatory when Electricity Connection is Yes
//   if (
//     data.is_electricity_connection === true &&
//     (!data.electricity_consumer_no ||
//       String(data.electricity_consumer_no).trim() === "")
//   ) {
//     errors.electricity_consumer_no = "Electricity Consumer No. is required";
//   }

//   // Gas Connection No. is mandatory when Gas Connection is Yes
//   if (
//     data.gas_connection === true &&
//     (!data.gas_connection_no || String(data.gas_connection_no).trim() === "")
//   ) {
//     errors.gas_connection_no = "Gas Connection No. is required";
//   }

//   // Maximum 30 characters
//   if (
//     data.electricity_consumer_no &&
//     String(data.electricity_consumer_no).length > 30
//   ) {
//     errors.electricity_consumer_no =
//       "Electricity Consumer No. cannot exceed 30 characters";
//   }

//   if (
//     data.water_connection_no &&
//     String(data.water_connection_no).length > 30
//   ) {
//     errors.water_connection_no =
//       "Water Connection No. cannot exceed 30 characters";
//   }

//   if (data.gas_connection_no && String(data.gas_connection_no).length > 30) {
//     errors.gas_connection_no = "Gas Connection No. cannot exceed 30 characters";
//   }

//   return errors;
// };
export const validateSectionH = (data) => {
  const errors = {};

  const isTrue = (value) =>
    value === true || String(value).toLowerCase() === "true";

  // Sewerage Type
  if (
    isTrue(data.sewer_connection) &&
    (!data.sewerage_type || String(data.sewerage_type).trim() === "")
  ) {
    errors.sewerage_type = "Sewerage Type is required";
  }

  // Electricity Consumer No.
  if (
    isTrue(data.is_electricity_connection) &&
    (!data.electricity_consumer_no ||
      String(data.electricity_consumer_no).trim() === "")
  ) {
    errors.electricity_consumer_no = "Electricity Consumer No. is required";
  }

  // Gas Connection No.
  if (
    isTrue(data.gas_connection) &&
    (!data.gas_connection_no || String(data.gas_connection_no).trim() === "")
  ) {
    errors.gas_connection_no = "Gas Connection No. is required";
  }

  // Maximum 30 characters
  if (
    data.electricity_consumer_no &&
    String(data.electricity_consumer_no).length > 30
  ) {
    errors.electricity_consumer_no =
      "Electricity Consumer No. cannot exceed 30 characters";
  }

  if (
    data.water_connection_no &&
    String(data.water_connection_no).length > 30
  ) {
    errors.water_connection_no =
      "Water Connection No. cannot exceed 30 characters";
  }

  if (data.gas_connection_no && String(data.gas_connection_no).length > 30) {
    errors.gas_connection_no = "Gas Connection No. cannot exceed 30 characters";
  }

  return errors;
};
export const validateTaxRelatedInformation = (data) => {
  const errors = {};

  // Exemption Category is required when Exempted Property is Yes
  if (
    data.exempted_property === true &&
    (!data.exemption_category || String(data.exemption_category).trim() === "")
  ) {
    errors.exemption_category = "Exemption Category is required";
  }

  return errors;
};
