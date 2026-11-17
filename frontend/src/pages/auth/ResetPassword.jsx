import React, { useState, useEffect } from "react";
import {
    Box, Paper, Typography, TextField, Button, Alert, Stack, CircularProgress,
    InputAdornment, IconButton
} from "@mui/material";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../api/authApi";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', message }

    useEffect(() => {
        const queryToken = searchParams.get("token");
        if (queryToken) {
            setToken(queryToken);
        }
    }, [searchParams]);

    const handleReset = async (e) => {
        e.preventDefault();
        if (!token.trim()) {
            setStatus({ type: "error", message: "Reset token is required." });
            return;
        }
        if (newPassword.length < 6) {
            setStatus({ type: "error", message: "Password must be at least 6 characters long." });
            return;
        }
        if (newPassword !== confirmPassword) {
            setStatus({ type: "error", message: "Passwords do not match." });
            return;
        }

        setLoading(true);
        setStatus(null);

        try {
            const data = await resetPassword(token.trim(), newPassword);
            setStatus({
                type: "success",
                message: data.message || "Password successfully reset! You can now log in.",
            });
            setTimeout(() => {
                navigate("/login");
            }, 2500);
        } catch (err) {
            console.error("Reset password error:", err);
            const msg = err.response?.data?.message || "Failed to reset password. Token may be invalid or expired.";
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
                    "radial-gradient(circle at 15% 15%, rgba(37, 99, 235, 0.08) 0%, transparent 40%), radial-gradient(circle at 85% 85%, rgba(14, 165, 233, 0.08) 0%, transparent 40%)",
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
                        Set New Password
                    </Typography>
                    <Typography variant="body2" color="#64748B" sx={{ mt: 1 }}>
                        Enter your reset token and your new password to regain access.
                    </Typography>
                </Box>

                {status && (
                    <Alert
                        severity={status.type}
                        icon={status.type === "success" ? <CheckCircleRoundedIcon fontSize="inherit" /> : undefined}
                        sx={{ mb: 3, borderRadius: "12px", fontSize: "0.85rem" }}
                    >
                        {status.message}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleReset}>
                    <TextField
                        fullWidth
                        label="Reset Token"
                        required
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Paste reset token here"
                        disabled={loading || Boolean(searchParams.get("token"))}
                        sx={{
                            mb: 2.5,
                            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                        }}
                    />

                    <TextField
                        fullWidth
                        label="New Password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={loading}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        size="small"
                                    >
                                        {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            mb: 2.5,
                            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Confirm New Password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={loading}
                        sx={{
                            mb: 3,
                            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading || !token || !newPassword || !confirmPassword}
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
                        {loading ? <CircularProgress size={22} color="inherit" /> : "Update Password"}
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
