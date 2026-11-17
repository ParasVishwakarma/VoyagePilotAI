import React from "react";
import {
    Box, Typography, Container, Grid, Button, Stack, Paper, Chip
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import { useNavigate } from "react-router-dom";
import { triggerConfetti } from "../../utils/confetti";
import { sounds } from "../../utils/soundEffects";

const STATS = [
    { value: "20+", label: "Holiday Package", helper: "Curated worldwide itineraries", metric: "100% Verified" },
    { value: "100+", label: "Luxury Hotel", helper: "Pre-verified partner stays", metric: "5-Star Tier" },
    { value: "15", label: "Elite Airlines", helper: "Direct global corridors", metric: "Star Alliance & Oneworld" },
    { value: "8.5M+", label: "Satisfied Traveler", helper: "Across 45 countries", metric: "4.9★ Global Rating" },
];

export default function ExperienceSection() {
    const navigate = useNavigate();

    const handleExploreMap = () => {
        sounds.playWarp();
        if (!localStorage.getItem("token")) {
            localStorage.setItem("token", "voyager-instant-demo-key-2026");
        }
        triggerConfetti();
        navigate("/map");
    };

    return (
        <Box id="experience" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, sm: 3, md: 4 }, bgcolor: "#FFFFFF", position: "relative" }}>
            <Container maxWidth="xl">
                <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
                    {/* Left Column: Happy Travelers Image & Futuristic Aerospace Badges */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ position: "relative", maxWidth: 520, mx: "auto" }}>
                            {/* Decorative Emerald Accent Circle */}
                            <Box
                                sx={{
                                    position: "absolute",
                                    width: { xs: 240, md: 340 },
                                    height: { xs: 240, md: 340 },
                                    borderRadius: "50%",
                                    bgcolor: "#ECFDF5",
                                    top: -24,
                                    left: -24,
                                    zIndex: 0,
                                    border: "1px dashed rgba(16, 185, 129, 0.4)",
                                }}
                            />

                            {/* Main Rounded Image */}
                            <Box
                                component="img"
                                src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800&q=80"
                                alt="Happy travelers"
                                sx={{
                                    position: "relative",
                                    zIndex: 1,
                                    width: "100%",
                                    height: { xs: 400, md: 500 },
                                    objectFit: "cover",
                                    borderRadius: { xs: "32px", md: "44px" },
                                    boxShadow: "0 25px 60px rgba(16, 185, 129, 0.22)",
                                    border: "6px solid #FFFFFF",
                                }}
                            />

                            {/* Top Left Floating Aerospace Badge */}
                            <Paper
                                elevation={0}
                                className="hud-card"
                                sx={{
                                    position: "absolute",
                                    top: 30,
                                    left: { xs: -10, md: -24 },
                                    zIndex: 2,
                                    p: 1.8,
                                    px: 2.2,
                                    borderRadius: "18px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.2,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: "10px",
                                        bgcolor: "#10B981",
                                        color: "#FFFFFF",
                                        display: "grid",
                                        placeItems: "center",
                                        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
                                    }}
                                >
                                    <SpeedRoundedIcon sx={{ fontSize: 20 }} />
                                </Box>
                                <Box>
                                    <Typography className="telemetry-code" sx={{ color: "#059669", fontSize: "0.68rem !important" }}>
                                        AUTONOMOUS RESPONSE
                                    </Typography>
                                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 850, color: "#0F172A" }}>
                                        0.38s AI Latency
                                    </Typography>
                                </Box>
                            </Paper>

                            {/* Bottom Right Floating Stat Badge */}
                            <Paper
                                elevation={0}
                                className="hud-card"
                                sx={{
                                    position: "absolute",
                                    bottom: 24,
                                    right: { xs: -10, md: -24 },
                                    zIndex: 2,
                                    p: 2,
                                    borderRadius: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: "14px",
                                        bgcolor: "#ECFDF5",
                                        color: "#10B981",
                                        display: "grid",
                                        placeItems: "center",
                                    }}
                                >
                                    <ShieldRoundedIcon sx={{ fontSize: 26 }} />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 850, color: "#0F172A" }}>
                                        Disruption Shield Active
                                    </Typography>
                                    <Typography sx={{ fontSize: "0.75rem", color: "#64748B" }}>
                                        Real-time flight rerouting
                                    </Typography>
                                </Box>
                            </Paper>
                        </Box>
                    </Grid>

                    {/* Right Column: Copy & 4 Stat Cards */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ maxWidth: 540 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                                <AutoAwesomeRoundedIcon sx={{ color: "#10B981", fontSize: 18 }} />
                                <Typography className="telemetry-code" sx={{ color: "#059669", fontSize: "0.8rem !important" }}>
                                    AUTONOMOUS TRAVEL INTELLIGENCE // 2026
                                </Typography>
                            </Stack>

                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 900,
                                    color: "#0F172A",
                                    lineHeight: 1.15,
                                    fontSize: { xs: "2.1rem", sm: "2.7rem", md: "3.2rem" },
                                    letterSpacing: "-1px",
                                    mb: 2.5,
                                }}
                            >
                                We helping you find dream vacation
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#64748B",
                                    fontSize: { xs: "0.95rem", md: "1.05rem" },
                                    lineHeight: 1.7,
                                    mb: 4,
                                }}
                            >
                                Whenever flight delays or weather changes threaten your journey, VoyagePilot AI
                                autonomously detects disruptions, calculates alternative routes, and re-secures your
                                hotel accommodations so you focus on creating lifelong memories.
                            </Typography>

                            {/* 4 Stats Grid with Futuristic HUD Pods */}
                            <Grid container spacing={2.5} sx={{ mb: 4.5 }}>
                                {STATS.map((item) => (
                                    <Grid item xs={6} key={item.label}>
                                        <Paper
                                            elevation={0}
                                            className="hud-card"
                                            onMouseEnter={() => sounds.playHover()}
                                            sx={{
                                                p: 2.2,
                                                borderRadius: "18px",
                                                bgcolor: "#F8FAFC",
                                                border: "1px solid #E2E8F0",
                                                transition: "all 0.25s ease",
                                                "&:hover": {
                                                    borderColor: "#10B981",
                                                    bgcolor: "#FFFFFF",
                                                },
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: { xs: "1.9rem", md: "2.4rem" },
                                                    fontWeight: 900,
                                                    color: "#10B981",
                                                    lineHeight: 1.1,
                                                }}
                                            >
                                                {item.value}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: "0.95rem",
                                                    fontWeight: 800,
                                                    color: "#0F172A",
                                                    mt: 0.5,
                                                }}
                                            >
                                                {item.label}
                                            </Typography>
                                            <Typography className="telemetry-code" sx={{ fontSize: "0.65rem !important", color: "#64748B", mt: 0.3 }}>
                                                {item.metric}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>

                            <Button
                                variant="contained"
                                onClick={handleExploreMap}
                                onMouseEnter={() => sounds.playHover()}
                                endIcon={<ArrowForwardRoundedIcon />}
                                sx={{
                                    bgcolor: "#10B981",
                                    color: "#FFFFFF",
                                    px: 3.8,
                                    py: 1.4,
                                    borderRadius: "14px",
                                    fontWeight: 800,
                                    fontSize: "0.95rem",
                                    textTransform: "none",
                                    boxShadow: "0 8px 24px rgba(16, 185, 129, 0.35)",
                                    transition: "all 0.25s ease",
                                    "&:hover": {
                                        bgcolor: "#059669",
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 12px 30px rgba(16, 185, 129, 0.45)",
                                    },
                                }}
                            >
                                Explore Live Flight Map
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
