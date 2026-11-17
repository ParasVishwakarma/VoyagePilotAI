import React, { useState } from "react";
import {
    Box, Typography, Button, Stack, Container, Paper, Grid, MenuItem,
    Select, FormControl, TextField, InputAdornment, Chip, Tooltip
} from "@mui/material";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import RadarRoundedIcon from "@mui/icons-material/RadarRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { useNavigate } from "react-router-dom";
import { triggerConfetti } from "../../utils/confetti";
import { sounds } from "../../utils/soundEffects";

const DESTINATION_TELEMETRY = {
    Indonesia: {
        coords: "8.4095° S, 115.1889° E",
        airports: "DPS / SUB / BWX",
        subsonicTime: "4h 15m",
        supersonicTime: "1h 45m",
        weather: "29°C ☀️ Tropical Breeze",
        corridor: "CORRIDOR-IND-04"
    },
    Japan: {
        coords: "35.0116° N, 135.7681° E",
        airports: "HND / NRT / KIX",
        subsonicTime: "5h 40m",
        supersonicTime: "2h 10m",
        weather: "16°C 🌸 Sakura Clear",
        corridor: "CORRIDOR-TYO-09"
    },
    Australia: {
        coords: "33.8688° S, 151.2093° E",
        airports: "SYD / MEL / BNE",
        subsonicTime: "9h 20m",
        supersonicTime: "3h 40m",
        weather: "23°C 🌊 Coastal Calm",
        corridor: "CORRIDOR-SYD-12"
    },
    Malaysia: {
        coords: "3.1390° N, 101.6869° E",
        airports: "KUL / PEN / BKI",
        subsonicTime: "3h 50m",
        supersonicTime: "1h 30m",
        weather: "31°C ⛅ Warm Breeze",
        corridor: "CORRIDOR-KUL-02"
    },
    Switzerland: {
        coords: "46.8182° N, 8.2275° E",
        airports: "ZRH / GVA / BSL",
        subsonicTime: "7h 50m",
        supersonicTime: "3h 05m",
        weather: "8°C ❄️ Alpine Fresh",
        corridor: "CORRIDOR-ZRH-16"
    },
    France: {
        coords: "48.8566° N, 2.3522° E",
        airports: "CDG / ORY / NCE",
        subsonicTime: "8h 15m",
        supersonicTime: "3h 15m",
        weather: "18°C ⛅ Mild",
        corridor: "CORRIDOR-PAR-18"
    }
};

export default function Hero() {
    const navigate = useNavigate();
    const [location, setLocation] = useState("Indonesia");
    const [persons, setPersons] = useState("2 Persons");
    const [checkIn, setCheckIn] = useState("2026-12-04");
    const [checkOut, setCheckOut] = useState("2026-12-11");
    const [speedMode, setSpeedMode] = useState("supersonic"); // subsonic | supersonic | hypersonic

    const telemetry = DESTINATION_TELEMETRY[location] || DESTINATION_TELEMETRY.Indonesia;

    const handleSearch = () => {
        sounds.playClick();
        if (!localStorage.getItem("token")) {
            navigate("/login");
            return;
        }
        sounds.playWarp();
        triggerConfetti();
        navigate(`/flights?destination=${encodeURIComponent(location)}`);
    };

    const handleLocationChange = (e) => {
        sounds.playClick();
        setLocation(e.target.value);
    };

    return (
        <Box id="hero" sx={{ pt: { xs: 2, md: 3 }, pb: { xs: 8, md: 12 }, px: { xs: 2, sm: 3, md: 4 } }}>
            <Container maxWidth="xl" disableGutters>
                {/* Hero Scenic Banner Container with Aerospace HUD */}
                <Box
                    sx={{
                        position: "relative",
                        borderRadius: { xs: "28px", md: "40px" },
                        overflow: "hidden",
                        minHeight: { xs: 460, sm: 520, md: 560 },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        px: { xs: 2, sm: 4, md: 6 },
                        pb: { xs: 13, md: 15 },
                        pt: { xs: 9, md: 11 },
                        backgroundImage: `linear-gradient(180deg, rgba(11, 15, 23, 0.5) 0%, rgba(15, 23, 42, 0.72) 100%), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=85')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center 42%",
                        boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(16, 185, 129, 0.2)",
                    }}
                >
                    {/* Laser Scanning Line Animation */}
                    <Box className="laser-scanner-overlay" />

                    {/* HUD Monospace Telemetry Stamp */}
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{
                            mb: 2.5,
                            bgcolor: "rgba(11, 15, 23, 0.75)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(16, 185, 129, 0.35)",
                            borderRadius: "100px",
                            px: 2.5,
                            py: 0.6,
                        }}
                    >
                        <RadarRoundedIcon sx={{ fontSize: 16, color: "#10B981" }} />
                        <Typography className="telemetry-code" sx={{ color: "#34D399", fontSize: "0.72rem" }}>
                            SECTOR {telemetry.corridor} · LAT/LON: {telemetry.coords} · ALT: 38,000 FT
                        </Typography>
                    </Stack>

                    {/* Hero Title */}
                    <Typography
                        variant="h1"
                        sx={{
                            color: "#FFFFFF",
                            fontWeight: 900,
                            letterSpacing: "-1.5px",
                            lineHeight: 1.15,
                            fontSize: { xs: "2.4rem", sm: "3.4rem", md: "4.4rem" },
                            maxWidth: 950,
                            textShadow: "0 4px 24px rgba(0, 0, 0, 0.45)",
                        }}
                    >
                        Discover and Enjoy Trip
                        <br />
                        <span style={{
                            background: "linear-gradient(90deg, #FFFFFF 0%, #34D399 50%, #00F5D4 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}>
                            Make it More Memorable
                        </span>
                    </Typography>

                    {/* Hero Subtitle */}
                    <Typography
                        sx={{
                            color: "rgba(255, 255, 255, 0.92)",
                            fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.2rem" },
                            maxWidth: 720,
                            mt: 2.5,
                            lineHeight: 1.6,
                            fontWeight: 450,
                            textShadow: "0 2px 12px rgba(0, 0, 0, 0.4)",
                        }}
                    >
                        Travel makes you realize that no matter how much you know,
                        there's always more to learn. Powered by autonomous journey intelligence.
                    </Typography>

                    {/* Hypersonic Speed Mode Selector */}
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                            mt: 3,
                            p: 0.5,
                            borderRadius: "100px",
                            bgcolor: "rgba(15, 23, 42, 0.65)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                        }}
                    >
                        <Typography className="telemetry-code" sx={{ color: "rgba(255, 255, 255, 0.7)", px: 1.5, fontSize: "0.68rem" }}>
                            PROPULSION:
                        </Typography>
                        {[
                            { id: "subsonic", label: "Jet 0.82M", time: telemetry.subsonicTime },
                            { id: "supersonic", label: "Concorde 1.8M", time: telemetry.supersonicTime },
                            { id: "hypersonic", label: "Quantum 4.5M", time: "48m" },
                        ].map((m) => (
                            <Chip
                                key={m.id}
                                label={`${m.label} (${m.time})`}
                                size="small"
                                onClick={() => { sounds.playClick(); setSpeedMode(m.id); }}
                                sx={{
                                    cursor: "pointer",
                                    fontSize: "0.72rem",
                                    fontWeight: 750,
                                    bgcolor: speedMode === m.id ? "#10B981" : "transparent",
                                    color: speedMode === m.id ? "#FFFFFF" : "rgba(255, 255, 255, 0.75)",
                                    border: speedMode === m.id ? "1px solid #34D399" : "none",
                                    transition: "all 0.2s ease",
                                    "&:hover": { bgcolor: speedMode === m.id ? "#10B981" : "rgba(255, 255, 255, 0.1)" },
                                }}
                            />
                        ))}
                    </Stack>
                </Box>

                {/* Floating Search & Booking Filter Bar */}
                <Box
                    sx={{
                        maxWidth: 1140,
                        mx: "auto",
                        mt: { xs: -9, md: -8 },
                        position: "relative",
                        zIndex: 10,
                        px: { xs: 2, sm: 3 },
                    }}
                >
                    <Paper
                        elevation={0}
                        className="hud-card neon-border-glow"
                        sx={{
                            p: { xs: 2.5, md: 3.5 },
                            borderRadius: { xs: "24px", md: "28px" },
                            boxShadow: "0 25px 60px -12px rgba(15, 23, 42, 0.12)",
                        }}
                    >
                        {/* Live Telemetry Preview Pill Header */}
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ mb: 2.5, pb: 1.5, borderBottom: "1px solid #F1F5F9", flexWrap: "wrap", gap: 1 }}
                        >
                            <Stack direction="row" spacing={1} alignItems="center">
                                <AutoAwesomeRoundedIcon sx={{ color: "#10B981", fontSize: 18 }} />
                                <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: "#0F172A" }}>
                                    AUTONOMOUS CORRIDOR LOCATOR
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Chip
                                    label={`Corridor: ${telemetry.airports}`}
                                    size="small"
                                    className="telemetry-code"
                                    sx={{ bgcolor: "#ECFDF5", color: "#059669", fontWeight: 750 }}
                                />
                                <Chip
                                    label={telemetry.weather}
                                    size="small"
                                    sx={{ bgcolor: "#F8FAFC", color: "#334155", fontWeight: 700, fontSize: "0.72rem" }}
                                />
                            </Stack>
                        </Stack>

                        <Grid container spacing={2.5} alignItems="center">
                            {/* Location Filter */}
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography sx={{ fontSize: "0.75rem", fontWeight: 750, color: "#64748B", mb: 0.8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                    // Location Sector
                                </Typography>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={location}
                                        onChange={handleLocationChange}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <PlaceRoundedIcon sx={{ color: "#10B981", fontSize: 22 }} />
                                            </InputAdornment>
                                        }
                                        sx={{
                                            borderRadius: "14px",
                                            fontWeight: 750,
                                            color: "#0F172A",
                                            bgcolor: "#F8FAFC",
                                            "& fieldset": { borderColor: "#E2E8F0" },
                                            "&:hover fieldset": { borderColor: "#10B981 !important" },
                                        }}
                                    >
                                        <MenuItem value="Indonesia">Indonesia (Banyuwangi & Bali)</MenuItem>
                                        <MenuItem value="Japan">Japan (Kyoto & Tokyo)</MenuItem>
                                        <MenuItem value="Australia">Australia (Sydney Harbour)</MenuItem>
                                        <MenuItem value="Malaysia">Malaysia (Batu Caves & KL)</MenuItem>
                                        <MenuItem value="Switzerland">Switzerland (Matterhorn)</MenuItem>
                                        <MenuItem value="France">France (Paris & Seine)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Persons Filter */}
                            <Grid item xs={12} sm={6} md={2.5}>
                                <Typography sx={{ fontSize: "0.75rem", fontWeight: 750, color: "#64748B", mb: 0.8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                    // Crew & Travelers
                                </Typography>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={persons}
                                        onChange={(e) => { sounds.playClick(); setPersons(e.target.value); }}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <PeopleRoundedIcon sx={{ color: "#10B981", fontSize: 22 }} />
                                            </InputAdornment>
                                        }
                                        sx={{
                                            borderRadius: "14px",
                                            fontWeight: 750,
                                            color: "#0F172A",
                                            bgcolor: "#F8FAFC",
                                            "& fieldset": { borderColor: "#E2E8F0" },
                                            "&:hover fieldset": { borderColor: "#10B981 !important" },
                                        }}
                                    >
                                        <MenuItem value="1 Person">1 Solo Voyager</MenuItem>
                                        <MenuItem value="2 Persons">2 Travelers (Partner)</MenuItem>
                                        <MenuItem value="3 Persons">3 Crew Members</MenuItem>
                                        <MenuItem value="4+ Persons">4+ Expedition Group</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Check-in Date */}
                            <Grid item xs={12} sm={6} md={2.2}>
                                <Typography sx={{ fontSize: "0.75rem", fontWeight: 750, color: "#64748B", mb: 0.8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                    // Departure Vector
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="date"
                                    value={checkIn}
                                    onChange={(e) => { sounds.playClick(); setCheckIn(e.target.value); }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CalendarMonthRoundedIcon sx={{ color: "#10B981", fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        bgcolor: "#F8FAFC",
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "14px",
                                            fontWeight: 650,
                                            "& fieldset": { borderColor: "#E2E8F0" },
                                            "&:hover fieldset": { borderColor: "#10B981 !important" },
                                        },
                                    }}
                                />
                            </Grid>

                            {/* Check-out Date */}
                            <Grid item xs={12} sm={6} md={2.2}>
                                <Typography sx={{ fontSize: "0.75rem", fontWeight: 750, color: "#64748B", mb: 0.8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                    // Return Corridor
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="date"
                                    value={checkOut}
                                    onChange={(e) => { sounds.playClick(); setCheckOut(e.target.value); }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CalendarMonthRoundedIcon sx={{ color: "#10B981", fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        bgcolor: "#F8FAFC",
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "14px",
                                            fontWeight: 650,
                                            "& fieldset": { borderColor: "#E2E8F0" },
                                            "&:hover fieldset": { borderColor: "#10B981 !important" },
                                        },
                                    }}
                                />
                            </Grid>

                            {/* Search Button */}
                            <Grid item xs={12} md={2.1}>
                                <Box sx={{ pt: { xs: 0, md: 2.8 } }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={handleSearch}
                                        onMouseEnter={() => sounds.playHover()}
                                        startIcon={<FlightTakeoffRoundedIcon />}
                                        sx={{
                                            py: 1.4,
                                            borderRadius: "14px",
                                            bgcolor: "#10B981",
                                            fontWeight: 800,
                                            fontSize: "0.95rem",
                                            textTransform: "none",
                                            boxShadow: "0 8px 24px rgba(16, 185, 129, 0.35)",
                                            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                                            "&:hover": {
                                                bgcolor: "#059669",
                                                transform: "translateY(-2px)",
                                                boxShadow: "0 12px 30px rgba(16, 185, 129, 0.45)",
                                            },
                                        }}
                                    >
                                        Search Flight
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
}
