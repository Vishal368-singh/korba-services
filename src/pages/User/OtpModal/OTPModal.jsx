import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Paper,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  TextField,
  Grid,
  Divider,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

function OTPModal({ open, onClose, onVerify, email, otp, setOtp}) {
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);

  // Responsive hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Auto-focus first input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 100);
      setTimer(60);
      setResendEnabled(false);
      setOtp(["", "", "", "", "", ""]);
      setError("");
    }
  }, [open]);

  // Countdown timer
  useEffect(() => {
    let interval;
    if (timer > 0 && !resendEnabled) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendEnabled(true);
    }
    return () => clearInterval(interval);
  }, [timer, resendEnabled]);

  const handleChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    // Submit on Enter
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    const digits = pastedData.replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < digits.length; i++) {
      if (i < 6) {
        newOtp[i] = digits[i];
      }
    }
    setOtp(newOtp);
    // Focus last filled input
    const lastIndex = Math.min(digits.length - 1, 5);
    if (inputRefs.current[lastIndex + 1]) {
      inputRefs.current[lastIndex + 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    try {
      // Call your verify API here
      // await verifyOTP(otpString);
      console.log("Verifying OTP:", otpString);
      onVerify(otpString);
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setTimer(60);
    setResendEnabled(false);
    setError("");
    // Call your resend API here
    console.log("Resending OTP");
  };

  // Calculate OTP input size based on screen
  const getOtpSize = () => {
    if (isMobile) return "40px";
    if (isTablet) return "44px";
    return "48px";
  };

  const getOtpFontSize = () => {
    if (isMobile) return "20px";
    if (isTablet) return "22px";
    return "24px";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: isMobile ? "16px" : "20px",
          padding: isMobile ? "4px 0 12px 0" : "8px 0 16px 0",
          margin: isMobile ? "16px" : "0",
          boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "12px 16px 8px 16px" : "16px 24px 8px 24px",
          borderBottom: "2px solid #f1f5f9",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <VerifiedUserIcon
            sx={{ color: "#7A1453", fontSize: isMobile ? 24 : 28 }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#0b2b4a",
              fontSize: isMobile ? "18px" : "20px",
            }}
          >
            Verify OTP
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: "#7A1453",
            padding: isMobile ? "4px" : "8px",
            "&:hover": {
              backgroundColor: "#f1f5f9",
              color: "#7A1453",
            },
          }}
        >
          <CloseIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          padding: isMobile ? "16px 16px 12px 16px" : "24px 24px 16px 24px",
        }}
      >
        {/* Body */}
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              textAlign: "center",
              marginBottom: "4px",
              fontSize: isMobile ? "13px" : "14px",
            }}
          >
            Enter the 6-digit OTP sent to
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#0b2b4a",
              textAlign: "center",
              fontWeight: 600,
              fontSize: isMobile ? "14px" : "16px",
              marginBottom: isMobile ? "16px" : "20px",
              wordBreak: "break-all",
            }}
          >
            {email || "your registered email"}
          </Typography>

          {/* OTP Inputs */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: isMobile ? "6px" : isTablet ? "8px" : "10px",
              marginBottom: isMobile ? "16px" : "20px",
              flexWrap: "wrap",
            }}
          >
            {otp.map((digit, index) => (
              <TextField
                key={index}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                inputRef={(el) => (inputRefs.current[index] = el)}
                variant="outlined"
                sx={{
                  width: getOtpSize(),
                  "& .MuiOutlinedInput-root": {
                    height: isMobile ? "48px" : "56px",
                    "& input": {
                      textAlign: "center",
                      fontSize: getOtpFontSize(),
                      fontWeight: 600,
                      padding: "0",
                      color: "#7A1453",
                    },
                    "& fieldset": {
                      borderColor: "#e2e8f0",
                      borderWidth: "2px",
                      borderRadius: isMobile ? "10px" : "12px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#7A1453",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#7A1453",
                      borderWidth: "2px",
                      boxShadow: "0 0 0 4px rgba(26, 115, 232, 0.12)",
                    },
                  },
                }}
                inputProps={{
                  maxLength: 1,
                  type: "text",
                  pattern: "[0-9]*",
                }}
              />
            ))}
          </Box>

          {/* Error Message */}
          {error && (
            <Alert
              severity="error"
              sx={{
                borderRadius: "10px",
                marginBottom: "16px",
                backgroundColor: "#fee2e2",
                color: "#b91c1c",
                fontSize: isMobile ? "13px" : "14px",
                "& .MuiAlert-icon": {
                  color: "#b91c1c",
                  fontSize: isMobile ? "18px" : "20px",
                },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Resend / Timer */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              marginBottom: isMobile ? "16px" : "20px",
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontSize: isMobile ? "13px" : "14px",
              }}
            >
              Didn't receive OTP?
            </Typography>
            {resendEnabled ? (
              <Button
                onClick={handleResend}
                sx={{
                  color: "#7A1453",
                  fontWeight: 600,
                  fontSize: isMobile ? "13px" : "14px",
                  textTransform: "none",
                  padding: isMobile ? "2px 6px" : "4px 8px",
                  minWidth: "auto",
                  "&:hover": {
                    backgroundColor: "rgba(26, 115, 232, 0.08)",
                  },
                }}
              >
                Resend
              </Button>
            ) : (
              <Typography
                variant="body2"
                sx={{
                  color: "#94a3b8",
                  fontSize: isMobile ? "13px" : "14px",
                  fontWeight: 500,
                }}
              >
                {`00:${timer.toString().padStart(2, "0")}`}
              </Typography>
            )}
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: isMobile ? "8px" : "12px",
              marginTop: "4px",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              onClick={onClose}
              sx={{
                borderColor: "#e2e8f0",
                color: "#475569",
                borderRadius: isMobile ? "10px" : "12px",
                padding: isMobile ? "10px" : "12px",
                fontWeight: 600,
                textTransform: "none",
                fontSize: isMobile ? "14px" : "15px",
                order: isMobile ? 2 : 1,
                "&:hover": {
                  borderColor: "#cbd5e1",
                  backgroundColor: "#f8fafc",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleVerify}
              disabled={loading || otp.join("").length !== 6}
              sx={{
                backgroundColor: "#7A1453",
                borderRadius: isMobile ? "10px" : "12px",
                padding: isMobile ? "10px" : "12px",
                fontWeight: 600,
                textTransform: "none",
                fontSize: isMobile ? "14px" : "15px",
                order: isMobile ? 1 : 2,
                boxShadow: "0 4px 12px rgba(26, 115, 232, 0.25)",
                "&:hover": {
                  backgroundColor: "#5B0F3E",
                  boxShadow: "0 6px 20px rgba(26, 115, 232, 0.30)",
                },
                "&:disabled": {
                  backgroundColor: "#e2e8f0",
                  color: "#94a3b8",
                },
              }}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default OTPModal;
