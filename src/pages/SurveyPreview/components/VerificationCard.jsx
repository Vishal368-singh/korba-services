import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  Edit,
  Save,
  Cancel,
  CheckCircle,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import "../SectionCard.css";
import "../SurveyPreview.css";

export default function VerificationCard({ data, onUpdate }) {
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
      onUpdate("verification", formData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
  };

  const verificationItems = [
    { key: "unassessed_property", label: "Unassessed Property" },
    { key: "under_assessed_property", label: "Under Assessed Property" },
    { key: "property_use_changed", label: "Property Use Changed" },
    {
      key: "additional_floor_constructed",
      label: "Additional Floor Constructed",
    },
    { key: "boundary_changed", label: "Boundary Changed" },
    { key: "ownership_changed", label: "Ownership Changed" },
    { key: "demolished_property", label: "Demolished Property" },
    { key: "new_property", label: "New Property" },
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
    return "repeat(auto-fill, minmax(280px, 1fr))";
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
          Verification
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
        {isEditing ? (
          // Edit Mode - Checkboxes
          <Grid container spacing={2}>
            {verificationItems.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.key}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#fafafa",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "#7A1453",
                      backgroundColor: "#f5f0f3",
                    },
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData[item.key] === true}
                        onChange={(e) =>
                          handleFieldChange(item.key, e.target.checked)
                        }
                        sx={{
                          color: "#7A1453",
                          "&.Mui-checked": {
                            color: "#7A1453",
                          },
                          "& .MuiSvgIcon-root": {
                            fontSize: 24,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "#0b2b4a",
                          fontSize: "13px",
                        }}
                      >
                        {item.label}
                      </Typography>
                    }
                    sx={{
                      margin: 0,
                      width: "100%",
                      "& .MuiFormControlLabel-label": {
                        width: "100%",
                      },
                    }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          // View Mode - Status Icons
          <Grid container spacing={2}>
            {verificationItems.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.key}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#fafafa",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {formData[item.key] === true ? (
                    <CheckCircle sx={{ color: "#22c55e", fontSize: 24 }} />
                  ) : (
                    <CancelIcon sx={{ color: "#ef4444", fontSize: 24 }} />
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: "#0b2b4a",
                      fontSize: "13px",
                    }}
                  >
                    {item.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Paper>
  );
}
