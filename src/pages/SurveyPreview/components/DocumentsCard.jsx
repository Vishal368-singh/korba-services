import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
  Grid,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Edit,
  Save,
  Cancel,
  CheckCircle,
  Cancel as CancelIcon,
  OpenInNew,
  CloudUpload,
  Delete,
} from "@mui/icons-material";
import "../SectionCard.css";
import "../SurveyPreview.css";

export default function DocumentsCard({ data, onUpdate }) {
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
      onUpdate("documents_collected", formData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
  };

  const documents = [
    {
      key: "aadhaar_copy",
      title: "Aadhaar Copy",
      filesKey: "aadhaar_copy_files",
    },
    {
      key: "electricity_bill",
      title: "Electricity Bill",
      filesKey: "electricity_bill_files",
    },
    { key: "water_bill", title: "Water Bill", filesKey: "water_bill_files" },
    { key: "sale_deed", title: "Sale Deed", filesKey: "sale_deed_files" },
    {
      key: "property_tax_receipt",
      title: "Property Tax Receipt",
      filesKey: "property_tax_receipt_files",
    },
    {
      key: "building_permission",
      title: "Building Permission",
      filesKey: "building_permission_files",
    },
    {
      key: "other_documents",
      title: "Other Documents",
      filesKey: "other_documents_files",
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
          Documents
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
        <Grid container spacing={2}>
          {documents.map((doc) => {
            const isAvailable = formData[doc.key] === true;
            const files = formData[doc.filesKey] || [];

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={doc.key}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#fafafa",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: isEditing ? "#7A1453" : "#e2e8f0",
                      boxShadow: isEditing
                        ? "0 2px 8px rgba(122, 20, 83, 0.1)"
                        : "none",
                    },
                  }}
                >
                  {/* Document Header */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: "#0b2b4a",
                        fontSize: isMobile ? "13px" : "14px",
                      }}
                    >
                      {doc.title}
                    </Typography>

                    {isEditing ? (
                      <Chip
                        label={isAvailable ? "Uploaded" : "Not Uploaded"}
                        size="small"
                        sx={{
                          backgroundColor: isAvailable ? "#dcfce7" : "#fee2e2",
                          color: isAvailable ? "#15803d" : "#b91c1c",
                          fontWeight: 500,
                          fontSize: "11px",
                        }}
                      />
                    ) : isAvailable ? (
                      <CheckCircle sx={{ color: "#22c55e", fontSize: 20 }} />
                    ) : (
                      <CancelIcon sx={{ color: "#ef4444", fontSize: 20 }} />
                    )}
                  </Box>

                  {/* Document Status / Edit Controls */}
                  {isEditing ? (
                    <Box sx={{ mt: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<CloudUpload />}
                        fullWidth
                        sx={{
                          borderColor: "#7A1453",
                          color: "#7A1453",
                          textTransform: "none",
                          borderRadius: "8px",
                          fontSize: "12px",
                          "&:hover": {
                            borderColor: "#7A1453",
                            backgroundColor: "rgba(122, 20, 83, 0.04)",
                          },
                        }}
                      >
                        Upload File
                      </Button>
                      {files.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          {files.map((file, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                p: 1,
                                backgroundColor: "#f1f5f9",
                                borderRadius: "6px",
                                mb: 0.5,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "#64748b",
                                  fontSize: "11px",
                                  flex: 1,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                File {index + 1}
                              </Typography>
                              <IconButton
                                size="small"
                                sx={{
                                  color: "#ef4444",
                                  "&:hover": {
                                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                                  },
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  ) : (
                    // View Mode
                    <>
                      {files.length > 0 ? (
                        <>
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns:
                                "repeat(auto-fill, minmax(60px, 1fr))",
                              gap: 1,
                              mb: 1.5,
                            }}
                          >
                            {files.slice(0, 3).map((file, index) => (
                              <Box
                                key={index}
                                sx={{
                                  width: "100%",
                                  height: "60px",
                                  borderRadius: "6px",
                                  overflow: "hidden",
                                  border: "1px solid #e2e8f0",
                                  backgroundColor: "#f1f5f9",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <img
                                  src={file}
                                  alt={`${doc.title} ${index + 1}`}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </Box>
                            ))}
                            {files.length > 3 && (
                              <Box
                                sx={{
                                  width: "100%",
                                  height: "60px",
                                  borderRadius: "6px",
                                  backgroundColor: "#e2e8f0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  color: "#64748b",
                                }}
                              >
                                +{files.length - 3}
                              </Box>
                            )}
                          </Box>

                          <Button
                            variant="contained"
                            startIcon={<OpenInNew />}
                            onClick={() => window.open(files[0], "_blank")}
                            sx={{
                              backgroundColor: "#7A1453",
                              color: "#ffffff",
                              textTransform: "none",
                              borderRadius: "8px",
                              fontSize: "12px",
                              padding: "6px 16px",
                              "&:hover": {
                                backgroundColor: "#5c0f3f",
                              },
                            }}
                          >
                            View Document
                          </Button>
                        </>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#94a3b8",
                            textAlign: "center",
                            py: 3,
                            fontStyle: "italic",
                            fontSize: "13px",
                          }}
                        >
                          Not Uploaded
                        </Typography>
                      )}
                    </>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Paper>
  );
}
