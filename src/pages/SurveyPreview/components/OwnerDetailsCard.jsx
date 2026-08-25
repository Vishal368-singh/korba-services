import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import RoleBased from "../../../components/RoleBased";

import { Edit, Save, Cancel } from "@mui/icons-material";

import PreviewField from "./PreviewField";
import "../SectionCard.css";

export default function OwnerDetailsCard({ data, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data || {});
  const [validationErrors, setValidationErrors] = useState({});
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  if (!data) return null;

  // ----------------------------------
  // FIELD CHANGE
  // ----------------------------------
  const handleFieldChange = (fieldKey, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  // ----------------------------------
  // EDIT SECTION
  // ----------------------------------
  const handleEdit = () => {
    setFormData(data);
    setValidationErrors({});
    setIsEditing(true);
  };

  // ----------------------------------
  // SAVE SECTION
  // ----------------------------------
  const handleSave = () => {
    const errors = {};

    const mobileNumber = formData.mobile_number || "";

    if (!mobileNumber) {
      errors.mobile_number = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      errors.mobile_number = "Please enter a valid 10-digit mobile number";
    }

    // If validation fails
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Clear previous errors
    setValidationErrors({});

    // Save data
    if (onUpdate) {
      onUpdate("owner_details", formData);
    }

    setIsEditing(false);
  };

  // ----------------------------------
  // CANCEL SECTION
  // ----------------------------------
  const handleCancel = () => {
    // Restore original data
    setFormData(data);
    setValidationErrors({});
    setIsEditing(false);
  };

  // ----------------------------------
  // FIELDS
  // ----------------------------------
  const fields = [
    {
      key: "Name of Respondent",
      label: "Enter Name of Respondent",
      type: "text",
    },
    {
      key: "Relationship of Respondent with Property Owner",
      label: "Relationship of Respondent with Property Owner Selected",
      type: "DROPDOWN",
    },
    {
      key: "owner_name",
      label: "Owner Name",
      type: "text",
    },
    {
      key: "father_husband_name",
      label: "Father / Husband Name",
      type: "text",
    },
    {
      key: "mobile_number",
      label: "Mobile Number",
      type: "tel",
    },
    {
      key: "Alternate Mobile Number",
      label: "Alternate Mobile Number",
      type: "tel",
    },
    {
      key: "Adhar Number",
      label: "Adhar Number",
      type: "tel",
    },
    {
      key: "Email ID",
      label: "Email ID",
      type: "email",
    },
    {
      key: "correspondence_address",
      label: "Correspondence Address",
      type: "text",
    },
    {
      key: "Pincode",
      label: "Pincode",
      type: "text",
    },

    // New fields
    {
      key: "owner_type",
      label: "Owner Type",
      type: "DROPDOWN",
    },
    {
      key: "gender",
      label: "Gender",
      type: "DROPDOWN",
    },
    {
      key: "occupation",
      label: "Occupation",
      type: "text",
    },
    {
      key: "pan_number",
      label: "PAN Number",
      type: "text",
    },
    {
      key: "village",
      label: "Village",
      type: "text",
    },
    {
      key: "district",
      label: "District",
      type: "text",
    },
    {
      key: "state",
      label: "State",
      type: "text",
    },
  ];

  // ----------------------------------
  // GRID
  // ----------------------------------
  const getGridColumns = () => {
    if (isMobile) {
      return "1fr";
    }

    if (isTablet) {
      return "repeat(2, 1fr)";
    }

    return "repeat(auto-fill, minmax(300px, 1fr))";
  };

  // ----------------------------------
  // BUTTON STYLE
  // ----------------------------------
  const buttonStyles = {
    backgroundColor: "#ffffff",
    color: "#7A1453",
    borderColor: "#ffffff",
    textTransform: "none",
    borderRadius: "8px",
    fontSize: isMobile ? "12px" : "13px",
    fontWeight: 500,
    padding: isMobile ? "6px 12px" : "8px 16px",

    "&:hover": {
      backgroundColor: "#7A1453",
      color: "#ffffff",
      borderColor: "#ffffff",
      boxShadow: "0px 0px 2px #fff",
    },
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: isMobile ? "12px" : "16px",

        border: "1px solid #e2e8f0",
        overflow: "hidden",
        mb: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* =========================
          HEADER
      ========================== */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",

          justifyContent: "space-between",

          alignItems: isMobile ? "stretch" : "center",

          padding: isMobile ? "12px 16px" : "16px 24px",

          gap: isMobile ? "12px" : "0",

          backgroundColor: "#7A1453",
        }}
      >
        {/* TITLE */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#ffffff",
            fontSize: isMobile ? "15px" : "16px",

            textAlign: isMobile ? "center" : "left",
          }}
        >
          Owner Details
        </Typography>

        {/* BUTTONS */}
        <Box
          sx={{
            display: "flex",
            gap: 1,

            flexDirection: isMobile ? "column" : "row",

            width: isMobile ? "100%" : "auto",
          }}
        >
          {/* EDIT */}
          {!isEditing ? (
            <RoleBased allowedRoles={["MLAdmin", "admin"]}>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEdit}
                sx={{
                  ...buttonStyles,
                  width: isMobile ? "100%" : "auto",
                }}
              >
                Edit Section
              </Button>
            </RoleBased>
          ) : (
            <>
              {/* CANCEL */}
              <Button
                variant="contained"
                startIcon={<Cancel />}
                onClick={handleCancel}
                sx={{
                  ...buttonStyles,
                  width: isMobile ? "100%" : "auto",
                }}
              >
                Cancel
              </Button>

              {/* SAVE */}
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{
                  ...buttonStyles,
                  width: isMobile ? "100%" : "auto",
                }}
              >
                Save Section
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* =========================
          BODY
      ========================== */}
      <Box
        sx={{
          padding: isMobile ? "12px" : isTablet ? "16px 20px" : "20px 24px",

          backgroundColor: "#ffffff",
        }}
      >
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: getGridColumns(),

            gap: isMobile ? "8px 12px" : isTablet ? "12px 20px" : "16px 32px",
          }}
        >
          {fields.map((field) => (
            <PreviewField
              key={field.key}
              label={field.label}
              value={formData[field.key] || ""}
              onChange={handleFieldChange}
              fieldKey={field.key}
              type={field.type}
              disabled={!isEditing}
              isMobile={isMobile}
              error={validationErrors[field.key] || ""}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
}
