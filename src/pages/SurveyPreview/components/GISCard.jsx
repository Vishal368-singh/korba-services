import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, useMediaQuery, useTheme, Grid } from '@mui/material';
import { Edit, Save, Cancel, Map, Image } from '@mui/icons-material';
import PreviewField from "./PreviewField";
import "../SectionCard.css";
import "../SurveyPreview.css";

export default function GISCard({ data, surveyInfo, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data || {});

  // Responsive hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Update local state when data prop changes
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  if (!data) return null;

  const getBoolean = (value) => value === true;

  const openMap = () => {
    if (surveyInfo?.gps_latitude && surveyInfo?.gps_longitude) {
      window.open(
        `https://www.google.com/maps?q=${surveyInfo.gps_latitude},${surveyInfo.gps_longitude}`,
        "_blank"
      );
    }
  };

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
      onUpdate('gis_information', formData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
  };

  // Define fields for the card
  const fields = [
    { key: 'gis_property_polygon_available', label: 'GIS Property Polygon', type: 'text' },
    { key: 'property_boundary_verified', label: 'Boundary Verified', type: 'text' },
    { key: 'geo_tag_completed', label: 'Geo Tag Completed', type: 'text' },
    { key: 'property_photo_captured', label: 'Property Photo Captured', type: 'text' },
  ];

  // Button styles with color scheme
  const buttonStyles = {
    backgroundColor: '#ffffff',
    color: '#7A1453',
    borderColor: '#ffffff',
    textTransform: 'none',
    borderRadius: '8px',
    fontSize: isMobile ? '12px' : '13px',
    fontWeight: 500,
    padding: isMobile ? '6px 12px' : '8px 16px',
    minWidth: isMobile ? 'auto' : '64px',
    '&:hover': {
      backgroundColor: '#7A1453',
      color: '#ffffff',
      borderColor: '#ffffff',
      boxShadow: '0px 0px 2px #fff',
    },
  };

  const getGridColumns = () => {
    if (isMobile) return '1fr';
    if (isTablet) return 'repeat(2, 1fr)';
    return 'repeat(auto-fill, minmax(300px, 1fr))';
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: isMobile ? '12px' : '16px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        mb: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          padding: isMobile ? '12px 16px' : '16px 24px',
          gap: isMobile ? '12px' : '0',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          backgroundColor: '#7A1453',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#ffffff',
            fontSize: isMobile ? '15px' : '16px',
            textAlign: isMobile ? 'center' : 'left',
          }}
        >
          GIS Information
        </Typography>

        <Box 
          sx={{ 
            display: 'flex', 
            gap: 1, 
            flexDirection: isMobile ? 'column' : 'row',
            width: isMobile ? '100%' : 'auto',
          }}
        >
          {!isEditing ? (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEdit}
              sx={{
                ...buttonStyles,
                width: isMobile ? '100%' : 'auto',
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
                  width: isMobile ? '100%' : 'auto',
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
                  width: isMobile ? '100%' : 'auto',
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
          padding: isMobile ? '12px 12px' : isTablet ? '16px 20px' : '20px 24px',
          backgroundColor: '#ffffff',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: getGridColumns(),
            gap: isMobile ? '8px 12px' : isTablet ? '12px 20px' : '16px 32px',
            mb: 3,
          }}
        >
          {fields.map((field) => (
            <PreviewField
              key={field.key}
              label={field.label}
              value={formData[field.key] !== undefined && formData[field.key] !== null ? formData[field.key] : ''}
              onChange={handleFieldChange}
              fieldKey={field.key}
              type={field.type}
              disabled={!isEditing}
              isMobile={isMobile}
            />
          ))}
        </Box>

        {/* Images Section */}
        {(data.front_elevation_photo_path || data.name_plate_photo_path) && (
          <Box sx={{ mt: 3, mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: '#0b2b4a',
                fontSize: '14px',
                mb: 2,
              }}
            >
              Property Images
            </Typography>
            
            <Grid container spacing={2}>
              {data.front_elevation_photo_path && (
                <Grid item xs={12} sm={6}>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        color: '#64748b',
                        fontWeight: 500,
                        mb: 1,
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px',
                      }}
                    >
                      Front Elevation
                    </Typography>
                    <img
                      src={data.front_elevation_photo_path}
                      alt="Front Elevation"
                      style={{
                        width: '100%',
                        maxHeight: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                      }}
                    />
                  </Paper>
                </Grid>
              )}

              {data.name_plate_photo_path && (
                <Grid item xs={12} sm={6}>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        color: '#64748b',
                        fontWeight: 500,
                        mb: 1,
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px',
                      }}
                    >
                      Name Plate
                    </Typography>
                    <img
                      src={data.name_plate_photo_path}
                      alt="Name Plate"
                      style={{
                        width: '100%',
                        maxHeight: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                      }}
                    />
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Map Button */}
        {surveyInfo?.gps_latitude && surveyInfo?.gps_longitude && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<Map />}
              onClick={openMap}
              sx={{
                backgroundColor: '#7A1453',
                color: '#ffffff',
                textTransform: 'none',
                borderRadius: '8px',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: 500,
                padding: isMobile ? '8px 20px' : '10px 30px',
                '&:hover': {
                  backgroundColor: '#5c0f3f',
                  boxShadow: '0px 0px 12px rgba(122, 20, 83, 0.3)',
                },
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