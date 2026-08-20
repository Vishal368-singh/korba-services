import React, { useState, useEffect } from 'react';
import { TextField, IconButton, Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';

export default function PreviewField({ 
  label, 
  value, 
  onChange, 
  fieldKey,
  type = 'text',
  disabled = true,
  multiline = false,
  rows = 1,
  required = false,
  isMobile = false,
  suffix = '' // Add this prop
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');

  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  // Reset editing state when disabled prop changes
  useEffect(() => {
    if (disabled) {
      setIsEditing(false);
    }
  }, [disabled]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onChange && fieldKey) {
      onChange(fieldKey, localValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalValue(value || '');
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setLocalValue(e.target.value);
  };

  const showEditButton = !disabled && !isEditing;

  return (
    <Box className="preview-field" sx={{ mb: isMobile ? 1 : 2 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isSmallMobile ? 'column' : 'row',
        alignItems: isSmallMobile ? 'stretch' : 'flex-start', 
        gap: isSmallMobile ? 1 : 2 
      }}>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: '#64748b',
              fontWeight: 500,
              mb: 0.5,
              fontSize: isMobile ? '10px' : '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
            }}
          >
            {label}
            {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
          </Typography>

          {isEditing ? (
            <TextField
              fullWidth
              value={localValue}
              onChange={handleChange}
              type={type}
              multiline={multiline}
              rows={multiline ? rows : 1}
              size={isSmallMobile ? "small" : "small"}
              variant="outlined"
              autoFocus
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff',
                  '& fieldset': {
                    borderColor: '#7A1453',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#7A1453',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#7A1453',
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputBase-input': {
                  fontSize: isMobile ? '13px' : '14px',
                  color: '#0b2b4a',
                  padding: isSmallMobile ? '8px 12px' : '10px 14px',
                },
              }}
            />
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: '#0b2b4a',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: 500,
                padding: isSmallMobile ? '6px 8px' : '8px 12px',
                minHeight: isSmallMobile ? '32px' : '36px',
                backgroundColor: '#f8fafc',
                borderRadius: '4px',
                wordBreak: 'break-word',
                border: '1px solid transparent',
              }}
            >
              {value || '—'} {suffix}
            </Typography>
          )}
        </Box>

        <Box sx={{ 
          display: 'flex', 
          gap: 0.5, 
          mt: isSmallMobile ? 0 : 2.5,
          alignSelf: isSmallMobile ? 'flex-end' : 'flex-start',
        }}>
          {isEditing ? (
            <>
              <IconButton
                size={isSmallMobile ? "small" : "small"}
                onClick={handleSave}
                sx={{
                  color: '#22c55e',
                  padding: isSmallMobile ? '4px' : '8px',
                  '&:hover': {
                    backgroundColor: 'rgba(34, 197, 94, 0.08)',
                  },
                }}
              >
                <Save fontSize={isSmallMobile ? "small" : "small"} />
              </IconButton>
              <IconButton
                size={isSmallMobile ? "small" : "small"}
                onClick={handleCancel}
                sx={{
                  color: '#ef4444',
                  padding: isSmallMobile ? '4px' : '8px',
                  '&:hover': {
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  },
                }}
              >
                <Cancel fontSize={isSmallMobile ? "small" : "small"} />
              </IconButton>
            </>
          ) : (
            showEditButton && (
              <IconButton
                size={isSmallMobile ? "small" : "small"}
                onClick={handleEdit}
                sx={{
                  color: '#7A1453',
                  padding: isSmallMobile ? '4px' : '8px',
                  '&:hover': {
                    backgroundColor: 'rgba(122, 20, 83, 0.08)',
                  },
                }}
              >
                <Edit fontSize={isSmallMobile ? "small" : "small"} />
              </IconButton>
            )
          )}
        </Box>
      </Box>
    </Box>
  );
}