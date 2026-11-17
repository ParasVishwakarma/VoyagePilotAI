import React, { useState, useRef } from "react";
import {
    Box, Typography, Paper, Stack, Chip, Button, IconButton, Tooltip
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import CasinoRoundedIcon from "@mui/icons-material/CasinoRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import { useNavigate } from "react-router-dom";
import { triggerConfetti } from "../../utils/confetti";
import { sounds } from "../../utils/soundEffects";

const DESTINATIONS = [
    {
        id: "japan",
        country: "JAPAN",
        title: "Fushimi Inari Taisha",
        location: "Kyoto, Japan",
        category: "culture",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
        price: 48500,
        rating: 4.9,
        tag: "🔥 Most Visited",
        days: "5 Days",
        weather: "16°C 🌸 Clear",
        telemetry: "ALT 36K · MACH 0.84",
    },
    {
        id: "sydney",
        country: "SYDNEY",
        title: "Sydney Opera & Harbour",
        location: "Sydney, Australia",
        category: "city",
        image: "https://images.unsplash.com/photo-1506973035172-1b7415f21820?auto=format&fit=crop&w=800&q=80",
        price: 62000,
        rating: 4.8,
        tag: "⚡ 15% Airfare Drop",
        days: "7 Days",
        weather: "23°C ☀️ Coastal",
        telemetry: "ALT 38K · MACH 0.82",
    },
    {
        id: "malaysia",
        country: "MALAYSIA",
        title: "Batu Caves & Selangor",
        location: "Kuala Lumpur, Malaysia",
        category: "culture",
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80",
        price: 32000,
        rating: 4.7,
        tag: "🌿 Eco-Heritage",
        days: "4 Days",
        weather: "31°C ⛅ Tropical",
        telemetry: "ALT 34K · MACH 0.80",
    },
    {
        id: "indonesia",
        country: "INDONESIA",
        title: "Banyuwangi & Ijen Crater",
        location: "East Java, Indonesia",
        category: "beach",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
        price: 38000,
        rating: 4.9,
        tag: "🌊 Tropical Escape",
        days: "6 Days",
        weather: "29°C 🌊 Breeze",
        telemetry: "ALT 35K · MACH 0.81",
    },
    {
        id: "switzerland",
        country: "SWITZERLAND",
        title: "Matterhorn & Zermatt",
        location: "Valais, Switzerland",
        category: "mountain",
        image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
        price: 85000,
        rating: 5.0,
        tag: "❄️ Alpine Luxury",
        days: "8 Days",
        weather: "6°C ❄️ Alpine",
        telemetry: "ALT 39K · MACH 0.85",
    },
    {
        id: "france",
        country: "FRANCE",
        title: "Paris & Seine Valley",
        location: "Paris, France",
        category: "city",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
        price: 68000,
        rating: 4.9,
        tag: "✨ Romantic Classic",
        days: "6 Days",
        weather: "17°C ⛅ Mild",
        telemetry: "ALT 37K · MACH 0.83",
    },
];

const CATEGORIES = [
    { id: "all", label: "🔥 All Trending" },
    { id: "beach", label: "🏝️ Tropical & Beach" },
    { id: "culture", label: "⛩️ Culture & Heritage" },
    { id: "mountain", label: "🏔️ Mountain & Scenic" },
    { id: "city", label: "🏙️ Metropolises" },
];

export default function DashboardPopularDestinations() {
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [highlightedId, setHighlightedId] = useState(null);
    const [spinning, setSpinning] = useState(false);

    const filtered = selectedCategory === "all"
        ? DESTINATIONS
        : DESTINATIONS.filter((d) => d.category === selectedCategory);

    // Movable scroll controls
    const handleScroll = (direction) => {
        sounds.playClick();
        if (!scrollContainerRef.current) return;
        const scrollAmount = direction === "left" ? -340 : 340;
        scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    };

    // Fun "Surprise Me" Random Destination Spinner with Confetti
    const handleSurpriseMe = () => {
        sounds.playWarp();
        setSpinning(true);
        let count = 0;
        const interval = setInterval(() => {
            const randomDest = DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)];
            setHighlightedId(randomDest.id);
            count++;
            if (count > 8) {
                clearInterval(interval);
                setSpinning(false);
                sounds.playSuccess();
                triggerConfetti();
            }
        }, 120);
    };

    const handlePlanTrip = (item) => {
        sounds.playSuccess();
        triggerConfetti();
        navigate(`/trips?new=true&dest=${encodeURIComponent(item.location)}&budget=${item.price}`);
    };

    return (
        <Paper
            elevation={0}
            className="cyber-card"
            sx={{
                mt: 3.5,
                p: { xs: 2.5, md: 3.2 },
                borderRadius: "24px",
                border: "1px solid #E2E8F0",
                bgcolor: "#FFFFFF",
                boxShadow: "0 8px 30px rgba(15, 23, 42, 0.04)",
            }}
        >
            {/* Header & Movable Controls */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
                sx={{ mb: 2.5 }}
            >
                <Box>
                    <Stack direction="row" alignItems="center" spacing={1.2}>
                        <Box sx={{ width: 34, height: 34, borderRadius: "10px", bgcolor: "#ECFDF5", color: "#10B981", display: "grid", placeItems: "center" }}>
                            <ExploreRoundedIcon fontSize="small" />
                        </Box>
                        <Typography sx={{ fontWeight: 850, fontSize: { xs: 19, md: 22 }, color: "#0F172A", letterSpacing: "-.5px" }}>
                            Popular & Quantum Destinations
                        </Typography>
                        <Chip
                            label="Movable Holodeck"
                            size="small"
                            className="holographic-pill"
                            sx={{ height: 22, fontSize: "0.68rem" }}
                        />
                    </Stack>
                    <Typography sx={{ color: "#64748B", fontSize: 13, mt: 0.4 }}>
                        Live aviation corridors, simulated local telemetry, and 1-click quantum itinerary builder.
                    </Typography>
                </Box>

                {/* Fun Action Buttons & Movable Controls */}
                <Stack direction="row" spacing={1.2} alignItems="center">
                    <Tooltip title="Spin quantum slot machine for a random destination!">
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleSurpriseMe}
                            disabled={spinning}
                            startIcon={<CasinoRoundedIcon />}
                            sx={{
                                borderRadius: "12px",
                                bgcolor: "#10B981",
                                color: "#FFFFFF",
                                fontWeight: 800,
                                fontSize: "0.82rem",
                                textTransform: "none",
                                px: 2,
                                py: 0.8,
                                boxShadow: "0 6px 18px rgba(16, 185, 129, 0.35)",
                                "&:hover": { bgcolor: "#059669" },
                            }}
                        >
                            {spinning ? "Spinning Quantum Wheel..." : "🎲 Surprise Me!"}
                        </Button>
                    </Tooltip>

                    {/* Left & Right Movable Arrow Buttons */}
                    <IconButton
                        size="small"
                        onClick={() => handleScroll("left")}
                        sx={{
                            width: 36,
                            height: 36,
                            border: "1px solid #E2E8F0",
                            borderRadius: "10px",
                            "&:hover": { bgcolor: "#ECFDF5", borderColor: "#10B981", color: "#10B981" },
                        }}
                    >
                        <ArrowBackIosNewRoundedIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => handleScroll("right")}
                        sx={{
                            width: 36,
                            height: 36,
                            border: "1px solid #E2E8F0",
                            borderRadius: "10px",
                            "&:hover": { bgcolor: "#ECFDF5", borderColor: "#10B981", color: "#10B981" },
                        }}
                    >
                        <ArrowForwardIosRoundedIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                </Stack>
            </Stack>

            {/* Category Filter Pills */}
            <Stack direction="row" spacing={1} sx={{ mb: 2.5, overflowX: "auto", pb: 0.5 }}>
                {CATEGORIES.map((cat) => (
                    <Chip
                        key={cat.id}
                        label={cat.label}
                        onClick={() => setSelectedCategory(cat.id)}
                        sx={{
                            fontWeight: 750,
                            fontSize: "0.8rem",
                            borderRadius: "10px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            bgcolor: selectedCategory === cat.id ? "#10B981" : "#F8FAFC",
                            color: selectedCategory === cat.id ? "#FFFFFF" : "#475569",
                            border: `1px solid ${selectedCategory === cat.id ? "#10B981" : "#E2E8F0"}`,
                            "&:hover": {
                                bgcolor: selectedCategory === cat.id ? "#059669" : "#F1F5F9",
                            },
                        }}
                    />
                ))}
            </Stack>

            {/* Movable Horizontal Carousel */}
            <Box
                ref={scrollContainerRef}
                sx={{
                    display: "flex",
                    gap: 2.4,
                    overflowX: "auto",
                    scrollBehavior: "smooth",
                    py: 1.5,
                    px: 0.5,
                    "&::-webkit-scrollbar": { height: 6 },
                    "&::-webkit-scrollbar-thumb": { bgcolor: "#CBD5E1", borderRadius: 4 },
                }}
            >
                {filtered.map((item) => {
                    const isSelected = highlightedId === item.id;
                    return (
                        <Box
                            key={item.id}
                            className="cyber-card"
                            sx={{
                                minWidth: { xs: 270, sm: 290, md: 310 },
                                maxWidth: 310,
                                flex: "0 0 auto",
                                borderRadius: "20px",
                                overflow: "hidden",
                                border: isSelected ? "2px solid #10B981 !important" : "1px solid #E2E8F0",
                                bgcolor: "#FFFFFF",
                                boxShadow: isSelected
                                    ? "0 16px 40px rgba(16, 185, 129, 0.35) !important"
                                    : "0 4px 18px rgba(15, 23, 42, 0.04)",
                                transform: isSelected ? "scale(1.04) translateY(-6px) !important" : "none",
                                transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                            }}
                        >
                            {/* Destination Photo */}
                            <Box
                                sx={{
                                    height: 170,
                                    position: "relative",
                                    backgroundImage: `url(${item.image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <Chip
                                    label={item.tag}
                                    size="small"
                                    sx={{
                                        position: "absolute",
                                        top: 10,
                                        left: 10,
                                        bgcolor: "rgba(15, 23, 42, 0.75)",
                                        backdropFilter: "blur(8px)",
                                        color: "#FFFFFF",
                                        fontWeight: 800,
                                        fontSize: "0.68rem",
                                        borderRadius: "6px",
                                        border: "1px solid rgba(255,255,255,0.2)",
                                    }}
                                />
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={0.3}
                                    sx={{
                                        position: "absolute",
                                        bottom: 10,
                                        right: 10,
                                        bgcolor: "rgba(255, 255, 255, 0.95)",
                                        px: 0.8,
                                        py: 0.2,
                                        borderRadius: "6px",
                                    }}
                                >
                                    <StarRoundedIcon sx={{ fontSize: 14, color: "#F59E0B" }} />
                                    <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, color: "#0F172A" }}>
                                        {item.rating}
                                    </Typography>
                                </Stack>
                            </Box>

                            {/* Card Details & Simulated Telemetry */}
                            <Box sx={{ p: 2.2 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, color: "#10B981", letterSpacing: ".6px" }}>
                                        {item.country} · {item.days}
                                    </Typography>
                                    <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748B" }}>
                                        {item.weather}
                                    </Typography>
                                </Stack>

                                <Typography sx={{ fontWeight: 850, fontSize: 16, color: "#0F172A", mt: 0.4, lineHeight: 1.3 }} noWrap>
                                    {item.title}
                                </Typography>
                                <Typography sx={{ color: "#64748B", fontSize: 12, mt: 0.3 }} noWrap>
                                    {item.location}
                                </Typography>

                                {/* Micro-Telemetry Pill */}
                                <Box sx={{ mt: 1.2, p: 0.8, borderRadius: "8px", bgcolor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                                    <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, color: "#475569" }}>
                                        ✈️ Corridor: <b style={{ color: "#10B981" }}>{item.telemetry}</b>
                                    </Typography>
                                </Box>

                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2, pt: 1.5, borderTop: "1px solid #F1F5F9" }}>
                                    <Box>
                                        <Typography sx={{ fontSize: "0.68rem", color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>
                                            Starts from
                                        </Typography>
                                        <Typography sx={{ fontSize: "1.1rem", fontWeight: 850, color: "#0F172A" }}>
                                            ₹{item.price.toLocaleString("en-IN")}
                                        </Typography>
                                    </Box>

                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handlePlanTrip(item)}
                                        sx={{
                                            bgcolor: "#10B981",
                                            color: "#FFFFFF",
                                            borderRadius: "10px",
                                            fontWeight: 800,
                                            fontSize: "0.8rem",
                                            textTransform: "none",
                                            px: 1.8,
                                            py: 0.7,
                                            boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
                                            "&:hover": { bgcolor: "#059669" },
                                        }}
                                    >
                                        Plan Journey
                                    </Button>
                                </Stack>
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Paper>
    );
}
