import { useEffect, useState } from "react";
import {
    AppBar, Avatar, Badge, Box, Button, Divider, IconButton, InputAdornment,
    Menu, MenuItem, Stack, TextField, Toolbar, Tooltip, Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import FlightRoundedIcon from "@mui/icons-material/FlightRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { getNotifications, markAllNotificationsRead } from "../../api/notificationApi";
import api from "../../api/axios";
import { sounds } from "../../utils/soundEffects";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import RadarRoundedIcon from "@mui/icons-material/RadarRounded";

export default function Topbar() {
    const navigate = useNavigate();
    const { search, setSearch } = useSearch();

    const [user, setUser] = useState({ firstName: "Traveler" });
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [soundOn, setSoundOn] = useState(sounds.enabled);

    const toggleAudio = () => {
        const next = sounds.toggle();
        setSoundOn(next);
        if (next) sounds.playClick();
    };

    useEffect(() => {
        let active = true;
        api.get("/users/me")
            .then((res) => { if (active) setUser(res.data); })
            .catch(() => {});

        getNotifications()
            .then((data) => { if (active) setNotifications(Array.isArray(data) ? data : []); })
            .catch(() => {});

        return () => { active = false; };
    }, []);

    const handleOpenNotifications = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseNotifications = () => {
        setAnchorEl(null);
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        } catch (e) {
            console.error(e);
        }
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    const getIconForType = (type) => {
        switch (type) {
            case "FLIGHT_DELAY":
            case "FLIGHT_CANCELLED":
                return <FlightRoundedIcon sx={{ fontSize: 18, color: "#EF4444" }} />;
            case "UPCOMING_TRIP":
                return <LuggageRoundedIcon sx={{ fontSize: 18, color: "#2563EB" }} />;
            default:
                return <AutoAwesomeRoundedIcon sx={{ fontSize: 18, color: "#0EA5E9" }} />;
        }
    };

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                mb: { xs: 2.5, md: 3.5 }, color: "#0F172A", bgcolor: "rgba(255,255,255,.95)",
                border: "1px solid #E2E8F0", borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(15,23,42,.03)", backdropFilter: "blur(12px)",
            }}
        >
            <Toolbar sx={{ minHeight: "64px !important", px: { xs: 2, md: 2.5 } }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
                    <AutoAwesomeRoundedIcon sx={{ color: "#10B981", fontSize: 22 }} />
                    <Typography sx={{ fontWeight: 800, fontSize: 14.5, letterSpacing: "-.2px", color: "#0F172A" }}>
                        VoyagePilot <Box component="span" sx={{ color: "#10B981" }}>AI</Box>
                    </Typography>
                </Box>

                <TextField
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search trips, flights, stays..."
                    sx={{
                        width: { xs: 150, sm: 240, md: 300 }, mr: { xs: .5, md: 1.5 },
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "10px", bgcolor: "#F8FAFC", fontSize: 12.5,
                            "& fieldset": { borderColor: "#E2E8F0" },
                            "&:hover fieldset": { borderColor: "#93C5FD" },
                            "&.Mui-focused fieldset": { borderColor: "#2563EB" },
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchRoundedIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
                            </InputAdornment>
                        ),
                    }}
                />

                <Tooltip title="Notifications">
                    <IconButton onClick={handleOpenNotifications} sx={{ color: "#64748B" }}>
                        <Badge badgeContent={unreadCount} color="error" sx={{ "& .MuiBadge-badge": { fontSize: 9.5, minWidth: 16, height: 16 } }}>
                            <NotificationsNoneRoundedIcon />
                        </Badge>
                    </IconButton>
                </Tooltip>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseNotifications}
                    PaperProps={{
                        sx: {
                            width: 360,
                            maxHeight: 460,
                            borderRadius: "16px",
                            mt: 1.5,
                            boxShadow: "0 12px 36px rgba(15,23,42,.12)",
                            border: "1px solid #E2E8F0",
                        },
                    }}
                >
                    <Box sx={{ px: 2, py: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ fontWeight: 750, fontSize: 13.5, color: "#0F172A" }}>
                            Notifications {unreadCount > 0 && `(${unreadCount})`}
                        </Typography>
                        {notifications.length > 0 && (
                            <Button
                                size="small"
                                onClick={handleMarkAllRead}
                                startIcon={<DoneAllRoundedIcon sx={{ fontSize: 14 }} />}
                                sx={{ fontSize: 11, fontWeight: 700, p: 0, minWidth: "auto", color: "#2563EB" }}
                            >
                                Mark all read
                            </Button>
                        )}
                    </Box>
                    <Divider />

                    {notifications.length === 0 ? (
                        <Box sx={{ py: 4, textAlign: "center", color: "#94A3B8" }}>
                            <Typography fontSize={13}>All caught up! No active travel alerts.</Typography>
                        </Box>
                    ) : (
                        notifications.map((item) => (
                            <MenuItem
                                key={item.id}
                                onClick={() => {
                                    handleCloseNotifications();
                                    if (item.targetUrl) navigate(item.targetUrl);
                                }}
                                sx={{
                                    py: 1.2, px: 2,
                                    bgcolor: item.read ? "transparent" : "#F0F7FF",
                                    "&:hover": { bgcolor: "#F1F5F9" },
                                    borderBottom: "1px solid #F1F5F9",
                                }}
                            >
                                <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ width: "100%" }}>
                                    <Box sx={{ mt: .3 }}>{getIconForType(item.type)}</Box>
                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                        <Typography sx={{ fontSize: 12.5, fontWeight: item.read ? 600 : 750, color: "#0F172A" }}>
                                            {item.title}
                                        </Typography>
                                        <Typography sx={{ fontSize: 11, color: "#64748B", mt: .3, lineHeight: 1.4 }}>
                                            {item.message}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </MenuItem>
                        ))
                    )}
                </Menu>

                {/* SFX Audio Controller */}
                <Tooltip title={soundOn ? "Mute Aerospace Sound FX" : "Enable Aerospace Sound FX"}>
                    <Button
                        size="small"
                        onClick={toggleAudio}
                        sx={{
                            color: soundOn ? "#10B981" : "#64748B",
                            ml: 1,
                            py: 0.4,
                            px: 1.2,
                            minWidth: 0,
                            borderRadius: "10px",
                            bgcolor: soundOn ? "rgba(16, 185, 129, 0.08)" : "#F8FAFC",
                            border: "1px solid",
                            borderColor: soundOn ? "rgba(16, 185, 129, 0.3)" : "#E2E8F0",
                            textTransform: "none",
                            fontSize: "0.7rem",
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
                                <span style={{ display: "none", sm: "inline" }}>SFX</span>
                            </>
                        ) : (
                            <VolumeOffRoundedIcon sx={{ fontSize: 15 }} />
                        )}
                    </Button>
                </Tooltip>

                <Tooltip title="Settings">
                    <IconButton onClick={() => navigate("/settings")} sx={{ color: "#64748B", ml: .3 }}>
                        <SettingsOutlinedIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title={user?.email || "Account"}>
                    <Avatar
                        onClick={() => navigate("/settings")}
                        sx={{
                            ml: 1.2, width: 34, height: 34, bgcolor: "#2563EB", color: "#FFFFFF",
                            fontSize: 12.5, fontWeight: 800, cursor: "pointer",
                        }}
                    >
                        {(user?.firstName || "T").charAt(0).toUpperCase()}
                    </Avatar>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
}
