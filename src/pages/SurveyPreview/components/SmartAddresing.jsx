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
import "../SectionCard.css";
import DropdownField from "../../../common/DropdownField";
import PreviewField from "./PreviewField";
import { YES_NO_OPTIONS } from "../../../utils/constants";

export default function SmartAddresing({ data, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data || {});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

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
      onUpdate("smart_addressing", formData);
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
  };

  const fields = [
    {
      key: "ddn_generated",
      label: "DDN Generated",
      type: "select",
      options: YES_NO_OPTIONS,
    },
    {
      key: "ddn_sticker_affixed",
      label: "DDN Sticker Affixed",
      type: "select",
      options: YES_NO_OPTIONS,
    },
    {
      key: "qr_code_affixed",
      label: "QR Code Affixed",
      type: "select",
      options: YES_NO_OPTIONS,
    },
    {
      key: "street_code",
      label: "Street Code",
      type: "text",
    },
    {
      key: "building_sequence_no",
      label: "Building Sequence No.",
      type: "text",
    },
  ];

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
          Smart Addressing
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
          {/* {fields.map((field) => {
            // Select fields
            if (field.type === "select") {
              if (isEditing) {
                return (
                  <DropdownField
                    key={field.key}
                    label={field.label}
                    options={field.options}
                    selected={
                      formData[field.key] === true
                        ? "Yes"
                        : formData[field.key] === false
                          ? "No"
                          : ""
                    }
                    onSelect={(value) =>
                      handleFieldChange(
                        field.key,
                        value === "Yes" ? true : value === "No" ? false : value,
                      )
                    }
                  />
                );
              }

              // View mode: directly show Yes / No
              return (
                <PreviewField
                  key={field.key}
                  label={field.label}
                  value={
                    formData[field.key] === true
                      ? "Yes"
                      : formData[field.key] === false
                        ? "No"
                        : ""
                  }
                  onChange={handleFieldChange}
                  fieldKey={field.key}
                  type="text"
                  disabled
                  isMobile={isMobile}
                />
              );
            }

            // Text / Number fields
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
              />
            );
          })} */}
          {fields.map((field) => {
            // Select fields
            if (field.type === "select") {
              if (isEditing) {
                return (
                  <DropdownField
                    key={field.key}
                    label={field.label}
                    options={field.options}
                    selected={
                      formData[field.key] === true
                        ? "Yes"
                        : formData[field.key] === false
                          ? "No"
                          : (formData[field.key] ?? "")
                    }
                    onSelect={(value) =>
                      handleFieldChange(
                        field.key,
                        value === "Yes" ? true : value === "No" ? false : value,
                      )
                    }
                  />
                );
              }

              // View mode
              return (
                <PreviewField
                  key={field.key}
                  label={field.label}
                  value={
                    formData[field.key] === true
                      ? "Yes"
                      : formData[field.key] === false
                        ? "No"
                        : (formData[field.key] ?? "")
                  }
                  onChange={handleFieldChange}
                  fieldKey={field.key}
                  type="text"
                  disabled
                  isMobile={isMobile}
                />
              );
            }

            // Text / Number fields
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
              />
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
}
