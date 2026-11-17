import React, { useState } from "react";
import {
    AppBar, Toolbar, Typography, Button, Box, Stack, Container, IconButton,
    Drawer, List, ListItem, ListItemButton, ListItemText, Chip, Tooltip
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import RadarRoundedIcon from "@mui/icons-material/RadarRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import { useNavigate } from "react-router-dom";
import { triggerConfetti } from "../../utils/confetti";
import { sounds } from "../../utils/soundEffects";

export default function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [mobileOpen, setMobileOpen] = useState(false);
    const [soundOn, setSoundOn] = useState(sounds.enabled);

    const navItems = [
        { label: "Home", target: "hero", code: "01" },
        { label: "Destinations", target: "destinations", code: "02" },
        { label: "Experience", target: "experience", code: "03" },
        { label: "Reviews", target: "testimonials", code: "04" },
        { label: "Interactive Map", path: "/map", code: "05" },
    ];

    const handleScroll = (id) => {
        sounds.playClick();
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
        setMobileOpen(false);
    };

    const handleLaunchDashboard = () => {
        sounds.playClick();
        navigate("/login");
    };

    const handleMapClick = () => {
        sounds.playClick();
        if (!localStorage.getItem("token")) {
            navigate("/login");
            return;
        }
        sounds.playWarp();
        navigate("/map");
    };

    const toggleAudio = () => {
        const next = sounds.toggle();
        setSoundOn(next);
        if (next) sounds.playClick();
    };

    return (
        <Box sx={{ position: "sticky", top: 0, zIndex: 1100 }}>
            {/* Top Mission Control Telemetry Ribbon */}
            <Box
                sx={{
                    bgcolor: "#0B0F17",
                    color: "rgba(255, 255, 255, 0.8)",
                    py: 0.6,
                    px: { xs: 2, sm: 4 },
                    fontSize: "0.72rem",
                    borderBottom: "1px solid rgba(16, 185, 129, 0.25)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    overflow: "hidden",
                }}
            >
                <Stack direction="row" spacing={2} alignItems="center">
                    <Stack direction="row" spacing={0.8} alignItems="center">
                        <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#10B981", boxShadow: "0 0 8px #10B981" }} />
                        <Typography className="telemetry-code" sx={{ color: "#34D399", fontSize: "0.7rem" }}>
                            AEROSPACE ORBIT: LOCKED
                        </Typography>
                    </Stack>
                    <Typography className="telemetry-code" sx={{ color: "rgba(255, 255, 255, 0.6)", display: { xs: "none", md: "inline" } }}>
                        CORRIDORS: <span style={{ color: "#00F5D4" }}>480 ACTIVE</span>
                    </Typography>
                    <Typography className="telemetry-code" sx={{ color: "rgba(255, 255, 255, 0.6)", display: { xs: "none", lg: "inline" } }}>
                        SHIELD: <span style={{ color: "#38BDF8" }}>100% NOMINAL</span>
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                    {/* Audio Feedback Controller */}
                    <Tooltip title={soundOn ? "Mute Aerospace Sound FX" : "Enable Aerospace Sound FX"}>
                        <Button
                            size="small"
                            onClick={toggleAudio}
                            sx={{
                                color: soundOn ? "#10B981" : "#64748B",
                                py: 0.2,
                                px: 1,
                                minWidth: 0,
                                textTransform: "none",
                                fontSize: "0.68rem",
                                fontWeight: 750,
                                gap: 0.8,
                            }}
                        >
                            {soundOn ? (
                                <>
                                    <Box className="sound-bars-container">
                                        <Box className="sound-bar" />
                                        <Box className="sound-bar" />
                                        <Box className="sound-bar" />
                                        <Box className="sound-bar" />
                                    </Box>
                                    <span>SFX ON</span>
                                </>
                            ) : (
                                <>
                                    <VolumeOffRoundedIcon sx={{ fontSize: 13 }} />
                                    <span>SFX OFF</span>
                                </>
                            )}
                        </Button>
                    </Tooltip>

                    <Typography className="telemetry-code" sx={{ color: "#10B981", display: { xs: "none", sm: "inline" } }}>
                        V2.6 NEURAL CO-PILOT
                    </Typography>
                </Stack>
            </Box>

            {/* Main Navigation Bar */}
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    bgcolor: "rgba(255, 255, 255, 0.94)",
                    backdropFilter: "blur(20px)",
                    borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ height: 72, display: "flex", justifyContent: "space-between" }}>
                        {/* Brand Logo with Aerospace Mark */}
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.2}
                            sx={{ cursor: "pointer" }}
                            onClick={() => { sounds.playClick(); navigate("/"); }}
                        >
                            <Box
                                sx={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: "14px",
                                    bgcolor: "#10B981",
                                    display: "grid",
                                    placeItems: "center",
                                    color: "#FFFFFF",
                                    boxShadow: "0 4px 16px rgba(16, 185, 129, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.3)",
                                    position: "relative",
                                }}
                            >
                                <ExploreRoundedIcon sx={{ fontSize: 24 }} />
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: -3,
                                        right: -3,
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        bgcolor: "#00F5D4",
                                        boxShadow: "0 0 8px #00F5D4",
                                    }}
                                />
                            </Box>
                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 900,
                                        color: "#0F172A",
                                        letterSpacing: "-0.6px",
                                        fontSize: "1.32rem",
                                        lineHeight: 1.1,
                                    }}
                                >
                                    VoyagePilot<span style={{ color: "#10B981" }}>.</span>
                                </Typography>
                                <Typography
                                    className="telemetry-code"
                                    sx={{ color: "#64748B", fontSize: "0.6rem !important", letterSpacing: "1.5px !important" }}
                                >
                                    AUTONOMOUS INTELLIGENCE
                                </Typography>
                            </Box>
                        </Stack>

                        {/* Desktop Navigation Links */}
                        <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" } }}>
                            {navItems.map((item) => (
                                <Button
                                    key={item.label}
                                    onMouseEnter={() => sounds.playHover()}
                                    onClick={() => item.path ? handleMapClick() : handleScroll(item.target)}
                                    sx={{
                                        color: "#475569",
                                        fontWeight: 650,
                                        textTransform: "none",
                                        fontSize: "0.92rem",
                                        borderRadius: "12px",
                                        px: 2,
                                        gap: 0.8,
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            color: "#10B981",
                                            bgcolor: "rgba(16, 185, 129, 0.08)",
                                            transform: "translateY(-1px)",
                                        },
                                    }}
                                >
                                    <span style={{ fontSize: "0.7rem", color: "#94A3B8", fontFamily: "monospace" }}>{item.code}</span>
                                    {item.label}
                                </Button>
                            ))}
                        </Stack>

                        {/* Action Buttons */}
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Button
                                variant="contained"
                                onClick={handleLaunchDashboard}
                                onMouseEnter={() => sounds.playHover()}
                                startIcon={<RocketLaunchRoundedIcon sx={{ fontSize: "18px !important" }} />}
                                className="neon-border-glow"
                                sx={{
                                    bgcolor: "#10B981",
                                    color: "#FFFFFF",
                                    px: { xs: 2, sm: 3 },
                                    py: 1.1,
                                    borderRadius: "14px",
                                    textTransform: "none",
                                    fontWeight: 800,
                                    fontSize: "0.92rem",
                                    boxShadow: "0 8px 24px rgba(16, 185, 129, 0.35)",
                                    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                                    "&:hover": {
                                        bgcolor: "#059669",
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 12px 30px rgba(16, 185, 129, 0.45)",
                                    },
                                }}
                            >
                                Launch Mission Control
                            </Button>

                            {!token && (
                                <Button
                                    onClick={() => { sounds.playClick(); navigate("/login"); }}
                                    onMouseEnter={() => sounds.playHover()}
                                    sx={{
                                        color: "#334155",
                                        fontWeight: 700,
                                        textTransform: "none",
                                        fontSize: "0.9rem",
                                        px: 1.8,
                                        display: { xs: "none", sm: "inline-flex" },
                                        "&:hover": { color: "#10B981", bgcolor: "transparent" },
                                    }}
                                >
                                    Sign In
                                </Button>
                            )}

                            {/* Mobile Menu Icon */}
                            <IconButton
                                onClick={() => { sounds.playClick(); setMobileOpen(true); }}
                                sx={{ display: { xs: "flex", md: "none" }, color: "#334155" }}
                            >
                                <MenuRoundedIcon />
                            </IconButton>
                        </Stack>
                    </Toolbar>
                </Container>

                {/* Mobile Drawer */}
                <Drawer
                    anchor="right"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    PaperProps={{
                        sx: { width: 300, p: 3, bgcolor: "#FFFFFF" },
                    }}
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                        <Typography variant="h6" fontWeight={850} color="#0F172A">
                            VoyagePilot<span style={{ color: "#10B981" }}>.</span>
                        </Typography>
                        <IconButton onClick={() => setMobileOpen(false)} size="small">
                            <CloseRoundedIcon />
                        </IconButton>
                    </Stack>

                    <List sx={{ pt: 1 }}>
                        {navItems.map((item) => (
                            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                                <ListItemButton
                                    onClick={() => item.path ? handleMapClick() : handleScroll(item.target)}
                                    sx={{ borderRadius: "10px", "&:hover": { bgcolor: "#ECFDF5", color: "#10B981" } }}
                                >
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{ fontWeight: 650, fontSize: "0.95rem" }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>

                    <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #E2E8F0" }}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleLaunchDashboard}
                            startIcon={<RocketLaunchRoundedIcon />}
                            sx={{
                                bgcolor: "#10B981",
                                color: "#FFFFFF",
                                py: 1.2,
                                borderRadius: "12px",
                                textTransform: "none",
                                fontWeight: 750,
                                mb: 1.5,
                                "&:hover": { bgcolor: "#059669" },
                            }}
                        >
                            Launch Mission Control
                        </Button>
                    </Box>
                </Drawer>
            </AppBar>
        </Box>
    );
}
