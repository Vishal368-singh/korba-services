import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export default function PreviewField({
  label,
  value,
  onChange,
  fieldKey,
  type = "text",
  disabled = true,
  multiline = false,
  rows = 1,
  required = false,
  isMobile = false,
  suffix = "",
  error = "",
}) {
  const [localValue, setLocalValue] = useState(value || "");
  const [localError, setLocalError] = useState("");

  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setLocalValue(value || "");
    setLocalError("");
  }, [value]);

  const handleChange = (e) => {
    let newValue = e.target.value;

    // Mobile number
    if (fieldKey === "mobile_number") {
      // Only numbers
      newValue = newValue.replace(/\D/g, "");

      // Maximum 10 digits
      newValue = newValue.slice(0, 10);

      setLocalValue(newValue);

      // Clear error while user is entering
      if (newValue.length === 10) {
        if (!/^[6-9]\d{9}$/.test(newValue)) {
          setLocalError("Enter a valid 10-digit mobile number");
        } else {
          setLocalError("");
        }
      } else {
        setLocalError("");
      }

      onChange(fieldKey, newValue);
      return;
    }

    const result = onChange(fieldKey, newValue);

    if (result !== false) {
      setLocalValue(newValue);
    }

    if (required && !newValue.trim()) {
      setLocalError(`${label} is required`);
    } else {
      setLocalError("");
    }
  };

  return (
    <Box
      className="preview-field"
      sx={{
        mb: isMobile ? 1 : 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallMobile ? "column" : "row",
          alignItems: isSmallMobile ? "stretch" : "flex-start",
          gap: isSmallMobile ? 1 : 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          {/* Label */}
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: "#64748b",
              fontWeight: 500,
              mb: 0.5,
              fontSize: isMobile ? "10px" : "12px",
              textTransform: "uppercase",
              letterSpacing: "0.3px",
            }}
          >
            {label}

            {required && (
              <span
                style={{
                  color: "#ef4444",
                  marginLeft: "4px",
                }}
              >
                *
              </span>
            )}
          </Typography>

          {/* EDIT MODE */}
          {!disabled ? (
            <TextField
              fullWidth
              value={localValue}
              onChange={handleChange}
              type={fieldKey === "mobile_number" ? "tel" : type}
              multiline={multiline}
              rows={multiline ? rows : 1}
              size="small"
              variant="outlined"
              error={!!(error || localError)}
              helperText={error || localError}
              slotProps={
                fieldKey === "mobile_number"
                  ? {
                      maxLength: 10,
                      inputMode: "numeric",
                    }
                  : {}
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#ffffff",

                  "& fieldset": {
                    borderColor: "#7A1453",
                  },

                  "&:hover fieldset": {
                    borderColor: "#7A1453",
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: "#7A1453",
                    borderWidth: "2px",
                  },
                },

                "& .MuiInputBase-input": {
                  fontSize: isMobile ? "13px" : "14px",
                  color: "#0b2b4a",
                  padding: isSmallMobile ? "8px 12px" : "10px 14px",
                },
              }}
            />
          ) : (
            /* VIEW MODE */
            <Typography
              variant="body2"
              sx={{
                color: "#0b2b4a",
                fontSize: isMobile ? "13px" : "14px",
                fontWeight: 500,
                padding: isSmallMobile ? "6px 8px" : "8px 12px",
                minHeight: isSmallMobile ? "32px" : "36px",
                backgroundColor: "#f8fafc",
                borderRadius: "4px",
                wordBreak: "break-word",
                border: "1px solid transparent",
              }}
            >
              {value || "—"} {suffix}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
