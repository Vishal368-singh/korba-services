import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Button,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Add, Delete, Edit, Save, Cancel } from '@mui/icons-material';
import "../SurveyPreview.css";

export default function FloorDetailsTable({ 
  floors = [], 
  isEditing = false, 
  onFloorUpdate 
}) {
  const [floorData, setFloorData] = useState([]);
  const [editingRow, setEditingRow] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Initialize floor data
  useEffect(() => {
    debugger
    if (floors && floors.length > 0) {
      setFloorData(floors);
    } else {
      setFloorData([{ 
        floor: '', 
        area: '', 
        usage_factor: '', 
        usage_type: '', 
        construction_type: '', 
        roof_type: '', 
        tenant_name: '', 
        tenant_mobile: '', 
        shops_count: '' 
      }]);
    }
  }, [floors]);

  if (!floors || floors.length === 0) {
    return (
      <Box sx={{ mt: 2, p: 2, textAlign: 'center', border: '1px dashed #e2e8f0', borderRadius: '8px' }}>
        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
          No floor details available
        </Typography>
        {isEditing && (
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => {
              const newRow = { 
                floor: '', 
                area: '', 
                usage_factor: '', 
                usage_type: '', 
                construction_type: '', 
                roof_type: '', 
                tenant_name: '', 
                tenant_mobile: '', 
                shops_count: '' 
              };
              const updatedData = [...floorData, newRow];
              setFloorData(updatedData);
              if (onFloorUpdate) onFloorUpdate(updatedData);
            }}
            sx={{
              mt: 2,
              borderColor: '#7A1453',
              color: '#7A1453',
              textTransform: 'none',
              borderRadius: '8px',
              '&:hover': {
                borderColor: '#7A1453',
                backgroundColor: 'rgba(122, 20, 83, 0.04)',
              },
            }}
          >
            Add Floor
          </Button>
        )}
      </Box>
    );
  }

  const handleAddRow = () => {
    const newRow = { 
      floor: '', 
      area: '', 
      usage_factor: '', 
      usage_type: '', 
      construction_type: '', 
      roof_type: '', 
      tenant_name: '', 
      tenant_mobile: '', 
      shops_count: '' 
    };
    const updatedData = [...floorData, newRow];
    setFloorData(updatedData);
    if (onFloorUpdate) {
      onFloorUpdate(updatedData);
    }
  };

  const handleDeleteRow = (index) => {
    const updatedData = floorData.filter((_, i) => i !== index);
    setFloorData(updatedData);
    if (onFloorUpdate) {
      onFloorUpdate(updatedData);
    }
  };

  const handleFieldChange = (index, field, value) => {
    const updatedData = floorData.map((row, i) => {
      if (i === index) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setFloorData(updatedData);
    if (onFloorUpdate) {
      onFloorUpdate(updatedData);
    }
  };

  // Table cell styles
  const cellStyles = {
    head: {
      fontWeight: 600,
      color: '#0b2b4a',
      fontSize: isMobile ? '10px' : isTablet ? '11px' : '12px',
      whiteSpace: 'nowrap',
      padding: isMobile ? '8px 4px' : '12px 8px',
      backgroundColor: '#f8fafc',
      borderBottom: '2px solid #7A1453',
    },
    body: {
      padding: isMobile ? '4px' : '8px',
      fontSize: isMobile ? '12px' : '13px',
    },
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          color: '#0b2b4a',
          fontSize: isMobile ? '13px' : '14px',
          mb: 2,
        }}
      >
        Floor Details
      </Typography>

      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: '12px', 
          border: '1px solid #e2e8f0',
          overflow: 'auto',
        }}
      >
        <Table size={isMobile ? "small" : "medium"} sx={{ minWidth: isMobile ? '600px' : '900px' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={cellStyles.head}>Floor</TableCell>
              <TableCell sx={cellStyles.head}>Area</TableCell>
              <TableCell sx={cellStyles.head}>Usage Factor</TableCell>
              <TableCell sx={cellStyles.head}>Usage Type</TableCell>
              <TableCell sx={cellStyles.head}>Construction</TableCell>
              <TableCell sx={cellStyles.head}>Roof</TableCell>
              <TableCell sx={cellStyles.head}>Tenant</TableCell>
              <TableCell sx={cellStyles.head}>Mobile</TableCell>
              <TableCell sx={cellStyles.head}>Shops</TableCell>
              {isEditing && (
                <TableCell sx={{ ...cellStyles.head, textAlign: 'center' }}>Action</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {floorData.map((row, index) => (
              <TableRow 
                key={index} 
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: isEditing ? 'rgba(122, 20, 83, 0.02)' : 'transparent',
                  },
                }}
              >
                <TableCell sx={cellStyles.body}>
                  {isEditing ? (
                    <TextField
                      size="small"
                      value={row.floor || ''}
                      onChange={(e) => handleFieldChange(index, 'floor', e.target.value)}
                      placeholder="e.g., Ground"
                      variant="outlined"
                      sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#e2e8f0',
                            borderWidth: '1px',
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
                          padding: isMobile ? '4px 8px' : '6px 12px',
                          fontSize: isMobile ? '12px' : '13px',
                        },
                      }}
                    />
                  ) : (
                    <Typography variant="body2" sx={{ color: '#0b2b4a', fontWeight: 500 }}>
                      {row.floor || '—'}
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={cellStyles.body}>
                  {isEditing ? (
                    <TextField
                      size="small"
                      type="number"
                      value={row.area || ''}
                      onChange={(e) => handleFieldChange(index, 'area', e.target.value)}
                      placeholder="0"
                      variant="outlined"
                      sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#e2e8f0',
                            borderWidth: '1px',
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
                          padding: isMobile ? '4px 8px' : '6px 12px',
                          fontSize: isMobile ? '12px' : '13px',
                        },
                      }}
                    />
                  ) : (
                    <Typography variant="body2" sx={{ color: '#0b2b4a' }}>
                      {row.area || '—'}
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={cellStyles.body}>
                  {isEditing ? (
                    <TextField
                      size="small"
                      value={row.usage_factor || ''}
                      onChange={(e) => handleFieldChange(index, 'usage_factor', e.target.value)}
                      placeholder="e.g., 1.0"
                      variant="outlined"
                      sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#e2e8f0',
                            borderWidth: '1px',
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
                          padding: isMobile ? '4px 8px' : '6px 12px',
                          fontSize: isMobile ? '12px' : '13px',
                        },
                      }}
                    />
                  ) : (
                    <Typography variant="body2" sx={{ color: '#0b2b4a' }}>
                      {row.usage_factor || '—'}
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={cellStyles.body}>
                  {isEditing ? (
                    <TextField
                      size="small"
                      value={row.usage_type || ''}
                      onChange={(e) => handleFieldChange(index, 'usage_type', e.target.value)}
                      placeholder="e.g., Residential"
                      variant="outlined"
                      sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#e2e8f0',
                            borderWidth: '1px',
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
                          padding: isMobile ? '4px 8px' : '6px 12px',
                          fontSize: isMobile ? '12px' : '13px',
                        },
                      }}
                    />
                  ) : (
                    <Typography variant="body2" sx={{ color: '#0b2b4a' }}>
                      {row.usage_type || '—'}
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={cellStyles.body}>
                  {isEditing ? (
                    <TextField
                      size="small"
                      value={row.construction_type || ''}
                      onChange={(e) => handleFieldChange(index, 'construction_type', e.target.value)}
                      placeholder="e.g., RCC"
                      variant="outlined"
                      sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#e2e8f0',
                            borderWidth: '1px',
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
                          padding: isMobile ? '4px 8px' : '6px 12px',
                          fontSize: isMobile ? '12px' : '13px',
                        },
                      }}
                    />
                  ) : (
                    <Typography variant="body2" sx={{ color: '#0b2b4a' }}>
                      {row.construction_type || '—'}
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={cellStyles.body}>
                  {isEditing ? (
                    <TextField
                      size="small"
                      value={row.roof_type || ''}
                      onChange={(e) => handleFieldChange(index, 'roof_type', e.target.value)}
                      placeholder="e.g., Tiled"
                      variant="outlined"
                      sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#e2e8f0',
                            borderWidth: '1px',
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
                          padding: isMobile ? '4px 8px' : '6px 12px',
                          fontSize: isMobile ? '12px' : '13px',
                        },
                      }}
                    />
                  ) : (
                    <Typography variant="body2" sx={{ color: '#0b2b4a' }}>
                      {row.roof_type || '—'}
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={cellStyles.body}>
                  {isEditing ? (
                    <TextField
                      size="small"
                      value={row.tenant_name || ''}
                      onChange={(e) => handleFieldChange(index, 'tenant_name', e.target.value)}
                      placeholder="Tenant name"
                      variant="outlined"
                      sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#e2e8f0',
                            borderWidth: '1px',
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
                          padding: isMobile ? '4px 8px' : '6px 12px',
                          fontSize: isMobile ? '12px' : '13px',
                        },
                      }}
                    />
                  ) : (
                    <Typography variant="body2" sx={{ color: '#0b2b4a' }}>
                      {row.tenant_name || '-'}
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={cellStyles.body}>
                  {isEditing ? (
                    <TextField
                      size="small"
                      type="tel"
                      value={row.tenant_mobile || ''}
                      onChange={(e) => handleFieldChange(index, 'tenant_mobile', e.target.value)}
                      placeholder="Phone no."
                      variant="outlined"
                      sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#e2e8f0',
                            borderWidth: '1px',
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
                          padding: isMobile ? '4px 8px' : '6px 12px',
                          fontSize: isMobile ? '12px' : '13px',
                        },
                      }}
                    />
                  ) : (
                    <Typography variant="body2" sx={{ color: '#0b2b4a' }}>
                      {row.tenant_mobile || '-'}
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={cellStyles.body}>
                  {isEditing ? (
                    <TextField
                      size="small"
                      type="number"
                      value={row.shops_count || ''}
                      onChange={(e) => handleFieldChange(index, 'shops_count', e.target.value)}
                      placeholder="0"
                      variant="outlined"
                      sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#e2e8f0',
                            borderWidth: '1px',
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
                          padding: isMobile ? '4px 8px' : '6px 12px',
                          fontSize: isMobile ? '12px' : '13px',
                        },
                      }}
                    />
                  ) : (
                    <Typography variant="body2" sx={{ color: '#0b2b4a' }}>
                      {row.shops_count || '—'}
                    </Typography>
                  )}
                </TableCell>
                {isEditing && (
                  <TableCell sx={{ ...cellStyles.body, textAlign: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteRow(index)}
                      sx={{
                        color: '#ef4444',
                        '&:hover': {
                          backgroundColor: 'rgba(239, 68, 68, 0.08)',
                        },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {isEditing && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleAddRow}
            sx={{
              borderColor: '#7A1453',
              color: '#7A1453',
              textTransform: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              '&:hover': {
                borderColor: '#7A1453',
                backgroundColor: 'rgba(122, 20, 83, 0.04)',
              },
            }}
          >
            Add Floor
          </Button>
        </Box>
      )}
    </Box>
  );
}