import React, { useState } from "react";
import {
    Box, Typography, Container, Paper, TextField, Button, Stack, Alert, Chip
} from "@mui/material";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import RadarRoundedIcon from "@mui/icons-material/RadarRounded";
import { triggerConfetti } from "../../utils/confetti";
import { sounds } from "../../utils/soundEffects";

export default function NewsletterSection() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !email.includes("@")) return;
        sounds.playSuccess();
        triggerConfetti();
        setSubscribed(true);
        setEmail("");
    };

    return (
        <Box sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 3, md: 4 } }}>
            <Container maxWidth="xl">
                <Paper
                    elevation={0}
                    className="neon-border-glow"
                    sx={{
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: { xs: "28px", md: "38px" },
                        p: { xs: 4, sm: 6, md: 8 },
                        background: "linear-gradient(135deg, #0F766E 0%, #059669 50%, #10B981 100%)",
                        color: "#FFFFFF",
                        boxShadow: "0 25px 60px rgba(16, 185, 129, 0.3)",
                    }}
                >
                    {/* Background Decorative Landmark Watermark */}
                    <Box
                        sx={{
                            position: "absolute",
                            right: { xs: -40, md: 50 },
                            bottom: -30,
                            opacity: 0.12,
                            pointerEvents: "none",
                            fontSize: { xs: 160, md: 250 },
                            lineHeight: 1,
                        }}
                    >
                        🏰
                    </Box>

                    <Box sx={{ maxWidth: 660, position: "relative", zIndex: 1 }}>
                        <Chip
                            icon={<RadarRoundedIcon sx={{ fontSize: "14px !important", color: "#A7F3D0" }} />}
                            label="VOYAGE TELEMETRY DISPATCH"
                            size="small"
                            className="telemetry-code"
                            sx={{
                                bgcolor: "rgba(255, 255, 255, 0.15)",
                                color: "#FFFFFF",
                                fontWeight: 800,
                                mb: 2,
                                border: "1px solid rgba(255, 255, 255, 0.3)",
                            }}
                        />

                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 900,
                                fontSize: { xs: "1.9rem", sm: "2.5rem", md: "3rem" },
                                letterSpacing: "-1px",
                                lineHeight: 1.15,
                                mb: 1.5,
                            }}
                        >
                            Subscribe to our Newsletter
                        </Typography>

                        <Typography
                            sx={{
                                color: "rgba(255, 255, 255, 0.9)",
                                fontSize: { xs: "0.95rem", md: "1.08rem" },
                                lineHeight: 1.6,
                                mb: 4,
                                fontWeight: 450,
                            }}
                        >
                            Receive real-time air corridor fare drops, quantum delay predictions, and exclusive secret
                            travel packages directly to your communicator inbox.
                        </Typography>

                        {subscribed ? (
                            <Alert
                                icon={<MarkEmailReadRoundedIcon sx={{ color: "#10B981" }} />}
                                sx={{
                                    bgcolor: "#FFFFFF",
                                    color: "#0F172A",
                                    borderRadius: "16px",
                                    fontWeight: 750,
                                    fontSize: "0.95rem",
                                }}
                            >
                                Satellite frequency linked! You will receive our next quantum flight intelligence dispatch.
                            </Alert>
                        ) : (
                            <Box component="form" onSubmit={handleSubmit}>
                                <Stack
                                    direction={{ xs: "column", sm: "row" }}
                                    spacing={1.5}
                                    sx={{
                                        p: 0.8,
                                        bgcolor: "rgba(255, 255, 255, 0.2)",
                                        backdropFilter: "blur(12px)",
                                        borderRadius: "18px",
                                        border: "1px solid rgba(255, 255, 255, 0.3)",
                                        maxWidth: 540,
                                    }}
                                >
                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        placeholder="Enter your personal or crew email..."
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        InputProps={{
                                            disableUnderline: true,
                                            sx: {
                                                color: "#FFFFFF",
                                                px: 2,
                                                py: 0.8,
                                                fontSize: "0.95rem",
                                                "& input::placeholder": {
                                                    color: "rgba(255, 255, 255, 0.75)",
                                                    opacity: 1,
                                                },
                                            },
                                        }}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        onMouseEnter={() => sounds.playHover()}
                                        endIcon={<SendRoundedIcon sx={{ fontSize: "16px !important" }} />}
                                        sx={{
                                            bgcolor: "#0F172A",
                                            color: "#FFFFFF",
                                            px: 3.5,
                                            py: 1.2,
                                            borderRadius: "14px",
                                            fontWeight: 800,
                                            fontSize: "0.9rem",
                                            textTransform: "none",
                                            whiteSpace: "nowrap",
                                            boxShadow: "0 4px 14px rgba(15, 23, 42, 0.35)",
                                            "&:hover": {
                                                bgcolor: "#1E293B",
                                            },
                                        }}
                                    >
                                        Subscribe Now
                                    </Button>
                                </Stack>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
