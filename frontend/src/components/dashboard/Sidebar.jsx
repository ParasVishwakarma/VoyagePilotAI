import { useEffect, useState } from "react";
import {
    Avatar, Box, Chip, Divider, Drawer, IconButton, List, ListItemButton,
    ListItemIcon, ListItemText, Stack, Tooltip, Typography, useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import FlightRoundedIcon from "@mui/icons-material/FlightRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import api from "../../api/axios";
import { sounds } from "../../utils/soundEffects";

const menuItems = [
    { text: "Mission Overview", icon: <DashboardRoundedIcon />, path: "/dashboard", code: "SYS.01" },
    { text: "Journey Itineraries", icon: <LuggageRoundedIcon />, path: "/trips", code: "SYS.02" },
    { text: "Air Corridors", icon: <FlightRoundedIcon />, path: "/flights", code: "SYS.03" },
    { text: "Luxury Stays", icon: <HotelRoundedIcon />, path: "/hotels", code: "SYS.04" },
    { text: "Interactive 3D Map", icon: <MapRoundedIcon />, path: "/map", badge: "60 FPS", code: "SYS.05" },
    { text: "Disruption Shield", icon: <WarningAmberRoundedIcon />, path: "/disruptions", badge: "Shield", code: "SYS.06" },
    { text: "AI Recommendations", icon: <AutoAwesomeRoundedIcon />, path: "/recommendations", badge: "Neural", code: "SYS.07" },
    { text: "Flight Analytics", icon: <BarChartRoundedIcon />, path: "/analytics", code: "SYS.08" },
    { text: "Pilot Settings", icon: <SettingsRoundedIcon />, path: "/settings", code: "SYS.09" },
];

function SidebarContent({ user, location, navigate, onNavigate, onLogout }) {
    return (
        <Box
            sx={{
                width: 270,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                px: 2,
                py: 2.5,
                bgcolor: "#FFFFFF",
                borderRight: "1px solid #E2E8F0",
            }}
        >
            {/* Brand Logo Header */}
            <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{ px: 1, mb: 3.5, cursor: "pointer" }}
                onClick={() => navigate("/dashboard")}
            >
                <Box
                    sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "14px",
                        display: "grid",
                        placeItems: "center",
                        color: "#FFFFFF",
                        bgcolor: "#10B981",
                        boxShadow: "0 6px 18px rgba(16, 185, 129, 0.28)",
                    }}
                >
                    <ExploreRoundedIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontWeight: 850,
                            letterSpacing: "-0.5px",
                            fontSize: 17,
                            color: "#0F172A",
                            lineHeight: 1.2,
                        }}
                    >
                        VoyagePilot<span style={{ color: "#10B981" }}>.AI</span>
                    </Typography>
                    <Typography
                        sx={{
                            color: "#64748B",
                            fontSize: 10.5,
                            mt: 0.3,
                            letterSpacing: "0.5px",
                            fontWeight: 700,
                        }}
                    >
                        TRAVEL INTELLIGENCE
                    </Typography>
                </Box>
            </Stack>

            {/* Navigation Section Label */}
            <Box sx={{ px: 1.2, mb: 1 }}>
                <Typography
                    sx={{
                        color: "#94A3B8",
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                    }}
                >
                    Platform Console
                </Typography>
            </Box>

            {/* Navigation Links */}
            <List disablePadding sx={{ flex: 1, overflowY: "auto", pr: 0.5 }}>
                {menuItems.map((item) => {
                    const selected = location.pathname === item.path;
                    return (
                        <ListItemButton
                            key={item.path}
                            selected={selected}
                            onMouseEnter={() => sounds.playHover()}
                            onClick={() => {
                                sounds.playClick();
                                navigate(item.path);
                                onNavigate?.();
                            }}
                            sx={{
                                minHeight: 44,
                                mb: 0.6,
                                px: 1.6,
                                borderRadius: "12px",
                                color: selected ? "#059669" : "#475569",
                                bgcolor: selected ? "#ECFDF5" : "transparent",
                                borderLeft: selected ? "3px solid #10B981" : "3px solid transparent",
                                boxShadow: selected ? "0 4px 14px rgba(16, 185, 129, 0.12)" : "none",
                                transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
                                "&:hover": {
                                    bgcolor: selected ? "#ECFDF5" : "#F8FAFC",
                                    color: selected ? "#059669" : "#0F172A",
                                    transform: "translateX(3px)",
                                },
                                "& .MuiListItemIcon-root": {
                                    minWidth: 36,
                                    color: selected ? "#10B981" : "#64748B",
                                },
                                "& .MuiSvgIcon-root": { fontSize: 20 },
                                "& .MuiListItemText-primary": {
                                    fontSize: 13,
                                    fontWeight: selected ? 750 : 600,
                                },
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{ fontSize: 13, fontWeight: selected ? 800 : 600, color: selected ? "#059669" : "#334155" }}>
                                    {item.text}
                                </Typography>
                                <Typography sx={{ fontSize: "0.62rem", fontFamily: "monospace", color: selected ? "#10B981" : "#94A3B8" }}>
                                    {item.code}
                                </Typography>
                            </Box>
                            {item.badge && (
                                <Chip
                                    label={item.badge}
                                    size="small"
                                    sx={{
                                        height: 19,
                                        fontSize: "0.65rem",
                                        fontWeight: 800,
                                        bgcolor: selected ? "#10B981" : "#ECFDF5",
                                        color: selected ? "#FFFFFF" : "#059669",
                                        borderRadius: "6px",
                                    }}
                                />
                            )}
                        </ListItemButton>
                    );
                })}
            </List>

            {/* Bottom Aerospace Telemetry Pod */}
            <Box
                sx={{
                    my: 1.5,
                    p: 1.5,
                    borderRadius: "14px",
                    bgcolor: "#0F172A",
                    color: "#FFFFFF",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                }}
            >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#10B981", boxShadow: "0 0 6px #10B981" }} />
                    <Typography className="telemetry-code" sx={{ color: "#34D399", fontSize: "0.68rem !important" }}>
                        QUANTUM RADAR: NOMINAL
                    </Typography>
                </Stack>
                <Typography sx={{ color: "#94A3B8", fontSize: 10 }}>
                    450+ Active corridors monitored 24/7
                </Typography>
            </Box>

            <Divider sx={{ my: 1, borderColor: "#F1F5F9" }} />

            {/* User Profile Card at Bottom */}
            <Box
                sx={{
                    p: 1.4,
                    borderRadius: "16px",
                    bgcolor: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1.2,
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1.2} sx={{ minWidth: 0, flex: 1 }}>
                    <Avatar
                        sx={{
                            width: 36,
                            height: 36,
                            bgcolor: "#2563EB",
                            color: "#FFFFFF",
                            fontSize: 13,
                            fontWeight: 750,
                        }}
                    >
                        {user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}` : "U"}
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            sx={{
                                color: "#0F172A",
                                fontSize: 12.5,
                                fontWeight: 750,
                                lineHeight: 1.2,
                            }}
                            noWrap
                        >
                            {user ? `${user.firstName} ${user.lastName}` : "Authenticated User"}
                        </Typography>
                        <Typography sx={{ color: "#64748B", fontSize: 10.5 }} noWrap>
                            {user?.email || "user@voyagepilot.ai"}
                        </Typography>
                    </Box>
                </Stack>

                <Tooltip title="Sign Out">
                    <IconButton
                        size="small"
                        onClick={onLogout}
                        sx={{
                            color: "#64748B",
                            borderRadius: "10px",
                            "&:hover": { color: "#DC2626", bgcolor: "#FEF2F2" },
                        }}
                    >
                        <LogoutRoundedIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
}

export default function Sidebar({ mobileOpen, onMobileClose, onMobileToggle }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        let active = true;
        api.get("/users/me")
            .then((res) => {
                if (active) setUser(res.data);
            })
            .catch(() => {});
        return () => {
            active = false;
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    };

    return (
        <>
            {/* Mobile Hamburger Toggle */}
            {isMobile && (
                <IconButton
                    onClick={onMobileToggle}
                    sx={{
                        position: "fixed",
                        top: 14,
                        left: 14,
                        zIndex: 1300,
                        bgcolor: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        boxShadow: "0 4px 14px rgba(15, 23, 42, 0.08)",
                        color: "#0F172A",
                        "&:hover": { bgcolor: "#F8FAFC" },
                    }}
                >
                    {mobileOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
                </IconButton>
            )}

            {/* Desktop Persistent Sidebar */}
            {!isMobile && (
                <Box
                    component="nav"
                    sx={{
                        width: 270,
                        flexShrink: 0,
                        position: "sticky",
                        top: 0,
                        height: "100vh",
                    }}
                >
                    <SidebarContent
                        user={user}
                        location={location}
                        navigate={navigate}
                        onLogout={handleLogout}
                    />
                </Box>
            )}

            {/* Mobile Temporary Drawer */}
            {isMobile && (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={onMobileClose}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        "& .MuiDrawer-paper": {
                            width: 270,
                            boxSizing: "border-box",
                            border: "none",
                        },
                    }}
                >
                    <SidebarContent
                        user={user}
                        location={location}
                        navigate={navigate}
                        onNavigate={onMobileClose}
                        onLogout={handleLogout}
                    />
                </Drawer>
            )}
        </>
    );
}
