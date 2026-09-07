import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
  TextField,
} from "@mui/material";
import { Add, Delete, Edit, Save, Cancel } from "@mui/icons-material";

import DropdownField from "../../../common/DropdownField";

import {
  FLOOR_OPTIONS,
  USAGE_FACTORS,
  USAGE_TYPES,
  CONSTRUCTION_TYPES,
  ROOF_TYPES,
} from "../../../utils/constants";

import "../SectionCard.css";

export default function FloorDetailsTable({
  floors = [],
  isEditing = false,
  onFloorUpdate,
}) {
  const [floorData, setFloorData] = useState(floors || []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Bind API floor_detail data
  useEffect(() => {
    if (Array.isArray(floors)) {
      setFloorData(floors);
    } else {
      setFloorData([]);
    }
  }, [floors]);

  // Handle field change
  const handleFieldChange = (index, field, value) => {
    const updatedData = floorData.map((row, i) => {
      if (i === index) {
        return {
          ...row,
          [field]: value,
        };
      }

      return row;
    });

    setFloorData(updatedData);

    if (onFloorUpdate) {
      onFloorUpdate(updatedData);
    }
  };

  // Add new floor
  const handleAddFloor = () => {
    const newRow = {
      floor: "",
      area: "",
      usage_factor: "",
      usage_type: "",
      construction_type: "",
      roof_type: "",
      tenant_name: "",
      tenant_mobile: "",
      tenant_since: "",
      shops_count: 0,
    };

    const updatedData = [...floorData, newRow];

    setFloorData(updatedData);

    if (onFloorUpdate) {
      onFloorUpdate(updatedData);
    }
  };

  // Delete floor
  const handleDeleteFloor = (index) => {
    const updatedData = floorData.filter((_, i) => i !== index);

    setFloorData(updatedData);

    if (onFloorUpdate) {
      onFloorUpdate(updatedData);
    }
  };

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
      boxShadow: "0px 0px 2px #fff",
    },
  };

  // Field configuration
  const fields = [
    {
      key: "floor",
      label: "Floor",
      type: "select",
      options: FLOOR_OPTIONS,
    },
    {
      key: "area",
      label: "Area",
      type: "text",
    },
    {
      key: "usage_factor",
      label: "Usage Factor",
      type: "select",
      options: USAGE_FACTORS,
    },
    {
      key: "usage_type",
      label: "Usage Type",
      type: "select",
      options: USAGE_TYPES,
    },
    {
      key: "construction_type",
      label: "Construction",
      type: "select",
      options: CONSTRUCTION_TYPES,
    },
    {
      key: "roof_type",
      label: "Roof",
      type: "select",
      options: ROOF_TYPES,
    },
    {
      key: "tenant_name",
      label: "Tenant Name",
      type: "text",
    },
    {
      key: "tenant_mobile",
      label: "Tenant Mobile",
      type: "tel",
    },
    {
      key: "tenant_since",
      label: "Tenant Since",
      type: "text",
    },
    {
      key: "shops_count",
      label: "Shops",
      type: "number",
    },
  ];

  if (!floorData.length) {
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
            Floor Details
          </Typography>

          {isEditing && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddFloor}
              sx={{
                ...buttonStyles,
                width: isMobile ? "100%" : "auto",
              }}
            >
              Add Floor
            </Button>
          )}
        </Box>

        {/* Empty state */}
        <Box
          sx={{
            padding: isMobile ? "20px 12px" : "24px",
            textAlign: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <Typography color="text.secondary">
            No floor details available
          </Typography>
        </Box>
      </Paper>
    );
  }

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
          Floor Details
        </Typography>

        {isEditing && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddFloor}
            sx={{
              ...buttonStyles,
              width: isMobile ? "100%" : "auto",
            }}
          >
            Add Floor
          </Button>
        )}
      </Box>

      {/* Table */}
      <Box
        sx={{
          padding: isMobile ? "12px" : isTablet ? "16px 20px" : "20px 24px",
          backgroundColor: "#ffffff",
          overflowX: "auto",
        }}
      >
        <Box
          component="table"
          sx={{
            width: "100%",
            minWidth: "1200px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              {fields.map((field) => (
                <th
                  key={field.key}
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #e2e8f0",
                    whiteSpace: "nowrap",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {field.label}
                </th>
              ))}

              {isEditing && (
                <th
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    borderBottom: "1px solid #e2e8f0",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  Action
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {floorData.map((row, index) => (
              <tr key={index}>
                {fields.map((field) => (
                  <td
                    key={field.key}
                    style={{
                      padding: "10px 12px",
                      borderBottom: "1px solid #e2e8f0",
                      verticalAlign: "middle",
                    }}
                  >
                    {field.type === "select" ? (
                      isEditing ? (
                        <DropdownField
                          label=""
                          options={field.options}
                          selected={row[field.key] || ""}
                          onSelect={(value) =>
                            handleFieldChange(index, field.key, value)
                          }
                        />
                      ) : (
                        <Typography
                          sx={{
                            fontSize: "14px",
                            color: "#374151",
                          }}
                        >
                          {row[field.key] || "—"}
                        </Typography>
                      )
                    ) : isEditing ? (
                      <TextField
                        fullWidth
                        size="small"
                        type={field.type}
                        value={row[field.key] ?? ""}
                        onChange={(e) =>
                          handleFieldChange(index, field.key, e.target.value)
                        }
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-input": {
                            fontSize: "14px",
                            padding: "9px 12px",
                          },
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: "#374151",
                        }}
                      >
                        {row[field.key] ?? "—"}
                      </Typography>
                    )}
                  </td>
                ))}

                {isEditing && (
                  <td
                    style={{
                      padding: "10px 12px",
                      borderBottom: "1px solid #e2e8f0",
                      textAlign: "center",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDeleteFloor(index)}
                      sx={{
                        textTransform: "none",
                        borderRadius: "8px",
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Box>
      </Box>
    </Paper>
  );
}
