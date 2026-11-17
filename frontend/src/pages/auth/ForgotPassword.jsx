import React, { useState } from "react";
import {
    Box, Paper, Typography, TextField, Button, Alert, Stack, CircularProgress, Link
} from "@mui/material";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api/authApi";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', message, token }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        setStatus(null);

        try {
            const data = await forgotPassword(email.trim());
            setStatus({
                type: "success",
                message: data.message || "Password reset instructions sent! Check your inbox or proceed below.",
                token: data.resetToken || null,
            });
        } catch (err) {
            console.error("Forgot password error:", err);
            const msg = err.response?.data?.message || "Failed to initiate password reset. Please try again.";
            setStatus({ type: "error", message: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                p: 2,
                bgcolor: "#F8FAFC",
                backgroundImage:
                    "radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(14, 165, 233, 0.08) 0%, transparent 40%)",
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 440,
                    p: { xs: 3, sm: 5 },
                    borderRadius: "24px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 20px 40px rgba(15, 23, 42, 0.06)",
                    bgcolor: "#FFFFFF",
                }}
            >
                <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            mx: "auto",
                            mb: 2,
                            display: "grid",
                            placeItems: "center",
                            borderRadius: "18px",
                            color: "#2563EB",
                            bgcolor: "rgba(37, 99, 235, 0.1)",
                        }}
                    >
                        <LockResetRoundedIcon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h5" fontWeight={800} color="#0F172A">
                        Forgot Password?
                    </Typography>
                    <Typography variant="body2" color="#64748B" sx={{ mt: 1 }}>
                        Enter the email associated with your VoyagePilot account and we will send you a reset link.
                    </Typography>
                </Box>

                {status && (
                    <Alert
                        severity={status.type}
                        sx={{ mb: 3, borderRadius: "12px", fontSize: "0.85rem" }}
                    >
                        {status.message}
                        {status.token && (
                            <Box sx={{ mt: 1.5 }}>
                                <Typography variant="caption" display="block" color="#475569" fontWeight={700}>
                                    Development Reset Token:
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        wordBreak: "break-all",
                                        fontFamily: "monospace",
                                        bgcolor: "rgba(0,0,0,0.06)",
                                        p: 0.5,
                                        borderRadius: 1,
                                        display: "block",
                                        mt: 0.5,
                                    }}
                                >
                                    {status.token}
                                </Typography>
                                <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<KeyRoundedIcon />}
                                    onClick={() => navigate(`/reset-password?token=${encodeURIComponent(status.token)}`)}
                                    sx={{
                                        mt: 1.5,
                                        borderRadius: "10px",
                                        bgcolor: "#2563EB",
                                        textTransform: "none",
                                        fontWeight: 700,
                                    }}
                                >
                                    Reset Password Now
                                </Button>
                            </Box>
                        )}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        disabled={loading}
                        sx={{
                            mb: 3,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                            },
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading || !email}
                        sx={{
                            py: 1.4,
                            borderRadius: "12px",
                            bgcolor: "#2563EB",
                            fontWeight: 700,
                            textTransform: "none",
                            fontSize: "0.95rem",
                            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.25)",
                            "&:hover": { bgcolor: "#1D4ED8" },
                        }}
                    >
                        {loading ? <CircularProgress size={22} color="inherit" /> : "Send Reset Link"}
                    </Button>
                </Box>

                <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                    <Button
                        startIcon={<ArrowBackRoundedIcon />}
                        onClick={() => navigate("/login")}
                        sx={{
                            color: "#64748B",
                            textTransform: "none",
                            fontWeight: 600,
                            "&:hover": { color: "#0F172A" },
                        }}
                    >
                        Back to Sign In
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}
