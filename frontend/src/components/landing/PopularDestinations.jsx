import React, { useState } from "react";
import {
    Box, Typography, Container, Grid, Paper, Chip, Button, Stack,
    Dialog, DialogTitle, DialogContent, DialogActions, Divider
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import RadarRoundedIcon from "@mui/icons-material/RadarRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import { useNavigate } from "react-router-dom";
import { triggerConfetti } from "../../utils/confetti";
import { sounds } from "../../utils/soundEffects";

const DESTINATIONS = [
    {
        id: "japan",
        country: "JAPAN",
        sector: "SECTOR-TYO-09",
        coords: "35.0116° N, 135.7681° E",
        title: "Fushimi Inari Taisha",
        location: "Kyoto, Japan",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
        price: "₹48,500",
        duration: "5 Days / 4 Nights",
        rating: 4.9,
        weather: "16°C 🌸 Clear",
        telemetry: "ALT 36K · MACH 0.84",
        description: "Wander through thousands of vermilion torii gates straddling the forested sacred Mount Inari in ancient Kyoto.",
        airports: "KIX / ITM / HND",
        stays: "Kyoto Traditional Ryokan & Luxury Machiya",
    },
    {
        id: "sydney",
        country: "SYDNEY",
        sector: "SECTOR-SYD-12",
        coords: "33.8688° S, 151.2093° E",
        title: "Sydney Opera",
        location: "Sydney, Australia",
        image: "https://images.unsplash.com/photo-1506973035172-1b7415f21820?auto=format&fit=crop&w=800&q=80",
        price: "₹62,000",
        duration: "7 Days / 6 Nights",
        rating: 4.8,
        weather: "23°C ☀️ Coastal",
        telemetry: "ALT 38K · MACH 0.82",
        description: "Experience iconic architectural grandeur along Sydney Harbour, vibrant arts, coastal walks from Bondi to Coogee.",
        airports: "SYD (Kingsford Smith)",
        stays: "Four Seasons Harbour View & Park Hyatt",
    },
    {
        id: "malaysia",
        country: "MALAYSIA",
        sector: "SECTOR-KUL-02",
        coords: "3.1390° N, 101.6869° E",
        title: "Batu Caves",
        location: "Selangor, Malaysia",
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80",
        price: "₹32,000",
        duration: "4 Days / 3 Nights",
        rating: 4.7,
        weather: "31°C ⛅ Tropical",
        telemetry: "ALT 34K · MACH 0.80",
        description: "Climb the 272 vibrant colorful steps guarded by the towering golden Lord Murugan statue into limestone cavern temples.",
        airports: "KUL (Kuala Lumpur Intl)",
        stays: "Mandarin Oriental KL & The RuMa Hotel",
    },
    {
        id: "indonesia",
        country: "INDONESIA",
        sector: "SECTOR-IND-04",
        coords: "8.2192° S, 114.3691° E",
        title: "Banyuwangi Java",
        location: "East Java, Indonesia",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
        price: "₹38,000",
        duration: "6 Days / 5 Nights",
        rating: 4.9,
        weather: "29°C 🌊 Breeze",
        telemetry: "ALT 35K · MACH 0.81",
        description: "Witness the mystical electric-blue flames of Kawah Ijen crater and untouched volcanic nature reserves in Java.",
        airports: "BWX / DPS (Bali)",
        stays: "Dialoog Banyuwangi & Ijen Resort and Villas",
    },
];

export default function PopularDestinations() {
    const navigate = useNavigate();
    const [selectedDest, setSelectedDest] = useState(null);

    return (
        <Box id="destinations" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, sm: 3, md: 4 } }}>
            <Container maxWidth="xl">
                {/* Header Section with Aerospace Badge */}
                <Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 } }}>
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 1.5 }}>
                        <RadarRoundedIcon sx={{ color: "#10B981", fontSize: 20 }} />
                        <Typography className="telemetry-code" sx={{ color: "#059669", fontSize: "0.8rem !important" }}>
                            GLOBAL TRAVEL CORRIDORS // 2026 EDITION
                        </Typography>
                    </Stack>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 900,
                            color: "#0F172A",
                            fontSize: { xs: "2.1rem", sm: "2.7rem", md: "3.2rem" },
                            letterSpacing: "-1px",
                        }}
                    >
                        Popular Destination
                    </Typography>
                    <Typography
                        sx={{
                            color: "#64748B",
                            fontSize: { xs: "0.95rem", md: "1.1rem" },
                            mt: 1.2,
                            fontWeight: 450,
                        }}
                    >
                        Vacations that help you make your journey unforgettable, monitored by autonomous AI
                    </Typography>
                </Box>

                {/* 4 Cards Grid with Aerospace Corner Brackets & Laser Shimmer */}
                <Grid container spacing={3.5}>
                    {DESTINATIONS.map((dest) => (
                        <Grid item xs={12} sm={6} md={3} key={dest.id}>
                            <Paper
                                elevation={0}
                                className="hud-card"
                                onMouseEnter={() => sounds.playHover()}
                                sx={{
                                    borderRadius: "26px",
                                    overflow: "hidden",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    sounds.playClick();
                                    setSelectedDest(dest);
                                }}
                            >
                                {/* Card Image Container with Telemetry Overlay */}
                                <Box
                                    sx={{
                                        position: "relative",
                                        height: 290,
                                        overflow: "hidden",
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={dest.image}
                                        alt={dest.title}
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                                            "&:hover": {
                                                transform: "scale(1.08)",
                                            },
                                        }}
                                    />
                                    {/* Gradient Scrim */}
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            inset: 0,
                                            background: "linear-gradient(180deg, rgba(11, 15, 23, 0.4) 0%, transparent 40%, rgba(11, 15, 23, 0.85) 100%)",
                                        }}
                                    />

                                    {/* Sector Code Pill on Top Left */}
                                    <Box sx={{ position: "absolute", top: 16, left: 16 }}>
                                        <Chip
                                            label={dest.country}
                                            size="small"
                                            className="telemetry-code"
                                            sx={{
                                                bgcolor: "rgba(11, 15, 23, 0.75)",
                                                backdropFilter: "blur(10px)",
                                                color: "#34D399",
                                                fontWeight: 850,
                                                borderRadius: "8px",
                                                border: "1px solid rgba(16, 185, 129, 0.4)",
                                                height: 24,
                                                fontSize: "0.68rem",
                                            }}
                                        />
                                    </Box>

                                    {/* Weather & Telemetry on Top Right */}
                                    <Box sx={{ position: "absolute", top: 16, right: 16 }}>
                                        <Chip
                                            label={dest.weather}
                                            size="small"
                                            sx={{
                                                bgcolor: "rgba(255, 255, 255, 0.9)",
                                                backdropFilter: "blur(8px)",
                                                color: "#0F172A",
                                                fontWeight: 750,
                                                borderRadius: "8px",
                                                height: 24,
                                                fontSize: "0.7rem",
                                            }}
                                        />
                                    </Box>

                                    {/* Card Title & Telemetry on Image Bottom */}
                                    <Box sx={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: "#FFFFFF",
                                                fontWeight: 850,
                                                fontSize: "1.25rem",
                                                lineHeight: 1.2,
                                                textShadow: "0 2px 8px rgba(0, 0, 0, 0.6)",
                                            }}
                                        >
                                            {dest.title}
                                        </Typography>
                                        <Typography
                                            className="telemetry-code"
                                            sx={{
                                                color: "#00F5D4",
                                                fontSize: "0.68rem !important",
                                                mt: 0.5,
                                                textShadow: "0 1px 4px rgba(0, 0, 0, 0.8)",
                                            }}
                                        >
                                            {dest.telemetry}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Card Body */}
                                <Box sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                    <Box>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                            <Typography sx={{ color: "#64748B", fontSize: "0.82rem", fontWeight: 600 }}>
                                                {dest.location}
                                            </Typography>
                                            <Stack direction="row" spacing={0.4} alignItems="center">
                                                <StarRoundedIcon sx={{ color: "#F59E0B", fontSize: 18 }} />
                                                <Typography sx={{ color: "#0F172A", fontSize: "0.85rem", fontWeight: 800 }}>
                                                    {dest.rating}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        <Typography
                                            sx={{
                                                color: "#475569",
                                                fontSize: "0.86rem",
                                                lineHeight: 1.5,
                                                mb: 2,
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {dest.description}
                                        </Typography>
                                    </Box>

                                    {/* Card Action & Price */}
                                    <Box sx={{ pt: 1.5, borderTop: "1px solid #F1F5F9" }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Typography sx={{ fontSize: "0.72rem", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase" }}>
                                                    From
                                                </Typography>
                                                <Typography sx={{ fontSize: "1.15rem", fontWeight: 850, color: "#0F172A" }}>
                                                    {dest.price}
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    sounds.playClick();
                                                    setSelectedDest(dest);
                                                }}
                                                sx={{
                                                    bgcolor: "#10B981",
                                                    color: "#FFFFFF",
                                                    px: 2.2,
                                                    py: 0.8,
                                                    borderRadius: "12px",
                                                    textTransform: "none",
                                                    fontWeight: 750,
                                                    fontSize: "0.82rem",
                                                    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
                                                    "&:hover": { bgcolor: "#059669" },
                                                }}
                                            >
                                                View Detail
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                    </Grid>
                </Container>

                {/* Aerospace Telemetry Detail Modal */}
                <Dialog
                    open={Boolean(selectedDest)}
                    onClose={() => setSelectedDest(null)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: "28px",
                            overflow: "hidden",
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                            boxShadow: "0 25px 60px rgba(15, 23, 42, 0.25)",
                        },
                    }}
                >
                    {selectedDest && (
                        <>
                            <Box sx={{ position: "relative", height: 260 }}>
                                <Box
                                    component="img"
                                    src={selectedDest.image}
                                    alt={selectedDest.title}
                                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                                <Box
                                    sx={{
                                        position: "absolute",
                                        inset: 0,
                                        background: "linear-gradient(180deg, rgba(11, 15, 23, 0.3) 0%, rgba(11, 15, 23, 0.85) 100%)",
                                    }}
                                />
                                <Box sx={{ position: "absolute", bottom: 20, left: 24, right: 24 }}>
                                    <Chip
                                        label={selectedDest.sector}
                                        size="small"
                                        className="telemetry-code"
                                        sx={{ bgcolor: "#10B981", color: "#FFFFFF", fontWeight: 850, mb: 1 }}
                                    />
                                    <Typography variant="h5" sx={{ color: "#FFFFFF", fontWeight: 850 }}>
                                        {selectedDest.title}
                                    </Typography>
                                    <Typography className="telemetry-code" sx={{ color: "#00F5D4", fontSize: "0.72rem !important" }}>
                                        COORDS: {selectedDest.coords} · {selectedDest.telemetry}
                                    </Typography>
                                </Box>
                            </Box>

                            <DialogContent sx={{ p: 3.5 }}>
                                <Typography sx={{ color: "#334155", fontSize: "0.95rem", lineHeight: 1.6, mb: 3 }}>
                                    {selectedDest.description}
                                </Typography>

                                <Stack spacing={2} sx={{ bgcolor: "#F8FAFC", p: 2.5, borderRadius: "18px", border: "1px solid #E2E8F0" }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <FlightTakeoffRoundedIcon sx={{ color: "#10B981", fontSize: 20 }} />
                                        <Typography sx={{ fontSize: "0.9rem", color: "#475569" }}>
                                            Air Corridor Hubs: <b>{selectedDest.airports}</b>
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <HotelRoundedIcon sx={{ color: "#10B981", fontSize: 20 }} />
                                        <Typography sx={{ fontSize: "0.9rem", color: "#475569" }}>
                                            Luxury Stays: <b>{selectedDest.stays}</b>
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <WbSunnyRoundedIcon sx={{ color: "#F59E0B", fontSize: 20 }} />
                                        <Typography sx={{ fontSize: "0.9rem", color: "#475569" }}>
                                            Live Climate Sensors: <b>{selectedDest.weather}</b>
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </DialogContent>

                            <DialogActions sx={{ p: 3, pt: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Box>
                                    <Typography sx={{ fontSize: "0.75rem", color: "#94A3B8" }}>Total Package</Typography>
                                    <Typography sx={{ fontSize: "1.3rem", fontWeight: 900, color: "#0F172A" }}>
                                        {selectedDest.price}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        sounds.playClick();
                                        if (!localStorage.getItem("token")) {
                                            setSelectedDest(null);
                                            navigate("/login");
                                            return;
                                        }
                                        sounds.playWarp();
                                        triggerConfetti();
                                        setSelectedDest(null);
                                        navigate("/trips");
                                    }}
                                    endIcon={<ArrowForwardRoundedIcon />}
                                    sx={{
                                        bgcolor: "#10B981",
                                        color: "#FFFFFF",
                                        px: 3.5,
                                        py: 1.2,
                                        borderRadius: "14px",
                                        fontWeight: 800,
                                        textTransform: "none",
                                        boxShadow: "0 8px 24px rgba(16, 185, 129, 0.35)",
                                        "&:hover": { bgcolor: "#059669" },
                                    }}
                                >
                                    Plan This Trip
                                </Button>
                            </DialogActions>
                        </>
                    )}
                </Dialog>
            </Box>
        );
    }
