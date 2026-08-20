import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, TextField, useMediaQuery, useTheme } from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import "../SectionCard.css";
import "../SurveyPreview.css";

export default function RemarksCard({ data, onUpdate }) {
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
      onUpdate('surveyor_remarks', formData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
  };

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
          Surveyor Remarks
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
        {isEditing ? (
          <TextField
            fullWidth
            multiline
            rows={1}
            value={formData.surveyor_remarks || ''}
            onChange={(e) => handleFieldChange('surveyor_remarks', e.target.value)}
            placeholder="Enter surveyor remarks..."
            variant="outlined"
            autoFocus
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#ffffff',
                '& fieldset': {
                  borderColor: '#e2e8f0',
                  borderWidth: '2px',
                  borderRadius: '12px',
                },
                '&:hover fieldset': {
                  borderColor: '#7A1453',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#7A1453',
                  borderWidth: '2px',
                  boxShadow: '0 0 0 4px rgba(122, 20, 83, 0.08)',
                },
              },
              '& .MuiInputBase-input': {
                fontSize: isMobile ? '14px' : '15px',
                color: '#0b2b4a',
                padding: isMobile ? '12px 14px' : '14px 16px',
                lineHeight: 1,
                minHeight: isMobile ? '120px' : '160px',
              },
            }}
          />
        ) : (
          <Paper
            sx={{
              p: isMobile ? 2 : 3,
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              minHeight: isMobile ? '120px' : '160px',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#0b2b4a',
                fontSize: isMobile ? '14px' : '15px',
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {formData.surveyor_remarks || (
                <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                  No remarks added yet
                </span>
              )}
            </Typography>
          </Paper>
        )}
      </Box>
    </Paper>
  );
}