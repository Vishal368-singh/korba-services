import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

const DropdownField = ({
  label,
  options = [],
  selected = "",
  onSelect,
  error,
  disabled = false,
  required = false,
}) => {
  return (
    <FormControl
      fullWidth
      size="small"
      error={!!error}
      disabled={disabled}
      required={required}
    >
      <InputLabel>{label}</InputLabel>

      <Select
        value={selected || ""}
        label={label}
        onChange={(e) => onSelect(e.target.value)}
        MenuProps={{
          disableScrollLock: true,
          PaperProps: {
            sx: {
              maxHeight: 300,
              borderRadius: "8px",
              marginTop: "4px",
            },
          },
        }}
        sx={{
          backgroundColor: "#fff",

          "& .MuiSelect-select": {
            // color: disabled ? "#374151" : "#374151",
            fontSize: "14px",
            padding: "9px 12px",
          },

          "&.Mui-disabled": {
            backgroundColor: "#fff",
          },

          "&.Mui-disabled .MuiSelect-select": {
            WebkitTextFillColor: "#374151",
            color: "#374151",
          },

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#d1d5db",
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9ca3af",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#7A1453",
          },
        }}
      >
        {options.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>

      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default DropdownField;
