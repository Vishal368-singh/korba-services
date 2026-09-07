import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Edit, Save, Cancel } from "@mui/icons-material";
import PreviewField from "./PreviewField";
import DropdownField from "../../../common/DropdownField";
import { YES_NO_OPTIONS, SEWERAGE_TYPES } from "../../../utils/constants";
import { validateSectionH } from "../..//../utils/validation";
import "../SectionCard.css";

export default function UtilityCard({ data, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data || {});
  const [validationErrors, setValidationErrors] = useState({});

  // Responsive hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Update local state when data prop changes
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  if (!data) return null;

  const getBoolean = (value) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      return value.toLowerCase() === "true";
    }
    return false;
  };

  const handleFieldChange = (fieldKey, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  const handleEdit = () => {
    setValidationErrors({});
    setIsEditing(true);
  };

  const handleSave = () => {
    const errors = validateSectionH(formData);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});

    if (onUpdate) {
      onUpdate("utility_connections", formData);
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
  };

  // Define fields for the card
  const fields = [
    {
      key: "water_connection_no",
      label: "Water Connection No.",
      type: "text",
    },
    {
      key: "sewerage_type",
      label: "Sewerage Type",
      type: "select",
      options: SEWERAGE_TYPES,
    },
    {
      key: "sewer_connection",
      label: "Sewer Connection",
      type: "select",
      options: YES_NO_OPTIONS,
    },
    {
      key: "is_electricity_connection",
      label: "Electricity Connection",
      type: "select",
      options: YES_NO_OPTIONS,
    },
    {
      key: "electricity_consumer_no",
      label: "Electricity Consumer No.",
      type: "text",
    },
    {
      key: "gas_connection",
      label: "Gas Connection",
      type: "select",
      options: YES_NO_OPTIONS,
    },
    {
      key: "gas_connection_no",
      label: "Gas Connection No.",
      type: "text",
    },
  ];

  // Button styles with color scheme
  const buttonStyles = {
    backgroundColor: "#ffffff",
    color: "#7A1453",
    borderColor: "#ffffff",
    textTransform: "none",
    borderRadius: "8px",
    fontSize: isMobile ? "12px" : "13px",
    fontWeight: 500,
    padding: isMobile ? "6px 12px" : "8px 16px",
    minWidth: isMobile ? "auto" : "64px",
    "&:hover": {
      backgroundColor: "#7A1453",
      color: "#ffffff",
      borderColor: "#ffffff",
      boxShadow: "0px 0px 2px #fff",
    },
  };

  const getGridColumns = () => {
    if (isMobile) return "1fr";
    if (isTablet) return "repeat(2, 1fr)";
    return "repeat(auto-fill, minmax(300px, 1fr))";
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
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          padding: isMobile ? "12px 16px" : "16px 24px",
          gap: isMobile ? "12px" : "0",
          borderBottom: "1px solid rgba(255,255,255,0.15)",
          backgroundColor: "#7A1453",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#ffffff",
            fontSize: isMobile ? "15px" : "16px",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          Utility Connections
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexDirection: isMobile ? "column" : "row",
            width: isMobile ? "100%" : "auto",
          }}
        >
          {!isEditing ? (
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
          ) : (
            <>
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

      {/* Body */}
      <Box
        sx={{
          padding: isMobile
            ? "12px 12px"
            : isTablet
              ? "16px 20px"
              : "20px 24px",
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
          {fields.map((field) => {
            const isRequired =
              (field.key === "sewerage_type" &&
                getBoolean(formData.sewer_connection)) ||
              (field.key === "electricity_consumer_no" &&
                getBoolean(formData.is_electricity_connection)) ||
              (field.key === "gas_connection_no" &&
                getBoolean(formData.gas_connection));
            if (
              field.key === "sewerage_type" &&
              !getBoolean(formData.sewer_connection)
            ) {
              return null;
            }
            if (field.type === "select") {
              if (isEditing) {
                return (
                  <DropdownField
                    key={field.key}
                    label={field.label}
                    options={field.options}
                    required={isRequired}
                    selected={
                      field.key === "sewerage_type"
                        ? formData[field.key] || ""
                        : formData[field.key] === true ||
                            String(formData[field.key]).toLowerCase() === "true"
                          ? "Yes"
                          : formData[field.key] === false ||
                              String(formData[field.key]).toLowerCase() ===
                                "false"
                            ? "No"
                            : ""
                    }
                    onSelect={(value) =>
                      handleFieldChange(
                        field.key,
                        field.key === "sewerage_type"
                          ? value
                          : value === "Yes"
                            ? true
                            : value === "No"
                              ? false
                              : value,
                      )
                    }
                    error={validationErrors[field.key] || ""}
                  />
                );
              }

              return (
                <PreviewField
                  key={field.key}
                  label={field.label}
                  value={
                    field.key === "sewerage_type"
                      ? formData[field.key] || ""
                      : formData[field.key] === true ||
                          String(formData[field.key]).toLowerCase() === "true"
                        ? "Yes"
                        : formData[field.key] === false ||
                            String(formData[field.key]).toLowerCase() ===
                              "false"
                          ? "No"
                          : ""
                  }
                  onChange={handleFieldChange}
                  fieldKey={field.key}
                  type="text"
                  disabled
                  isMobile={isMobile}
                  error={validationErrors[field.key] || ""}
                />
              );
            }

            return (
              <PreviewField
                key={field.key}
                label={field.label}
                value={formData[field.key] ?? ""}
                onChange={handleFieldChange}
                fieldKey={field.key}
                type={field.type}
                disabled={!isEditing}
                isMobile={isMobile}
                required={isRequired}
                error={validationErrors[field.key] || ""}
              />
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
}
