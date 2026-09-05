import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { Edit, Save, Cancel, Map } from "@mui/icons-material";
import PreviewField from "./PreviewField";

import "../SectionCard.css";
import "../SurveyPreview.css";

export default function GISCard({ data, surveyInfo, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data || {});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  console.log("GIS DATA:", data);
  console.log("SURVEY INFO:", surveyInfo);

  // Don't return immediately without checking
  if (!data) {
    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography>No GIS information available</Typography>
      </Paper>
    );
  }

  const openMap = () => {
    const lat = surveyInfo?.gps_latitude;
    const lng = surveyInfo?.gps_longitude;

    if (lat !== undefined && lng !== undefined) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
    }
  };

  const handleFieldChange = (fieldKey, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  const handleEdit = () => {
    setFormData(data || {});
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate("gis_information", formData);
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
  };

  const fields = [
    {
      key: "gis_property_polygon_available",
      label: "GIS Property Polygon",
      type: "text",
    },
    {
      key: "property_boundary_verified",
      label: "Boundary Verified",
      type: "text",
    },
    {
      key: "geo_tag_completed",
      label: "Geo Tag Completed",
      type: "text",
    },
    {
      key: "property_photo_captured",
      label: "Property Photo Captured",
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

    "&:hover": {
      backgroundColor: "#7A1453",
      color: "#ffffff",
      borderColor: "#ffffff",
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
          gap: isMobile ? "12px" : 0,
          backgroundColor: "#7A1453",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#ffffff",
          }}
        >
          GIS Information
        </Typography>

        {!isEditing ? (
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={handleEdit}
            sx={buttonStyles}
          >
            Edit Section
          </Button>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<Cancel />}
              onClick={handleCancel}
              sx={buttonStyles}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              sx={buttonStyles}
            >
              Save Section
            </Button>
          </Box>
        )}
      </Box>

      {/* Body */}
      <Box sx={{ padding: "20px 24px" }}>
        {/* Fields */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: getGridColumns(),
            gap: "16px 32px",
            mb: 3,
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

        {/* Images */}
        {(data.front_elevation_photo_path ||
          data.name_plate_photo_path ||
          data.property_photo_path) && (
          <Box sx={{ mt: 3, mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: "#0b2b4a",
                mb: 2,
              }}
            >
              Property Images
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 2,
              }}
            >
              {data.front_elevation_photo_path && (
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="caption">Front Elevation</Typography>

                  <img
                    src={data.front_elevation_photo_path}
                    alt="Front Elevation"
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </Paper>
              )}

              {data.name_plate_photo_path && (
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="caption">Name Plate</Typography>

                  <img
                    src={data.name_plate_photo_path}
                    alt="Name Plate"
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </Paper>
              )}

              {data.property_photo_path && (
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="caption">Property Photo</Typography>

                  <img
                    src={data.property_photo_path}
                    alt="Property"
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </Paper>
              )}
            </Box>
          </Box>
        )}

        {/* Map */}
        {surveyInfo?.gps_latitude !== undefined &&
          surveyInfo?.gps_longitude !== undefined && (
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                startIcon={<Map />}
                onClick={openMap}
                sx={{
                  backgroundColor: "#7A1453",
                  textTransform: "none",
                }}
              >
                Open in Google Maps
              </Button>
            </Box>
          )}
      </Box>
    </Paper>
  );
}
