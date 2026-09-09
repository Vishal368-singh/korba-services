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
import "../SectionCard.css";

export default function UsageDetailsCard({ data, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data || {});

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

  const handleFieldChange = (fieldKey, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate("usage_details", formData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
  };

  // Define fields for the card
  const fields = [
    { key: "primary_use", label: "Primary Use", type: "text" },
    { key: "mixed_use", label: "Mixed Use", type: "text" },
    { key: "occupancy", label: "Occupancy", type: "text" },
    { key: "number_of_families", label: "Number of Families", type: "number" },
    { key: "number_of_shops", label: "Number of Shops", type: "number" },
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
          Usage Details
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
          {fields.map((field) => (
            <PreviewField
              key={field.key}
              label={field.label}
              value={
                formData[field.key] !== undefined &&
                formData[field.key] !== null
                  ? formData[field.key]
                  : ""
              }
              onChange={handleFieldChange}
              fieldKey={field.key}
              type={field.type}
              disabled={!isEditing}
              isMobile={isMobile}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
}
