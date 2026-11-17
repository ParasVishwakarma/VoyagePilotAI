import React from "react";
import {
    Box, Typography, Container, Grid, Paper, Stack, Avatar, Chip
} from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import { sounds } from "../../utils/soundEffects";

const TESTIMONIALS = [
    {
        id: "VOYAGER-UK-8491",
        name: "Mark Jacob",
        role: "Frequent Global Traveler",
        location: "London, UK",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        route: "LHR ➔ HND",
        quote: "VoyagePilot AI handled our sudden delay at London Heathrow automatically. It rebooked our connecting flight and updated our hotel check-in without any stress!",
    },
    {
        id: "VOYAGER-CH-3910",
        name: "Maria Angelina",
        role: "Luxury Family Explorer",
        location: "Geneva, Switzerland",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        route: "GVA ➔ DPS",
        quote: "The real-time motion map and flight corridor tracking gave my family complete peace of mind while traveling across Kyoto and Bali. Truly revolutionary.",
    },
    {
        id: "VOYAGER-AU-7721",
        name: "David Wilson",
        role: "Corporate Executive",
        location: "Sydney, Australia",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        route: "SYD ➔ SIN",
        quote: "The Gemini AI recommendations saved us 6 hours and over ₹42,000 when severe weather struck. Best travel intelligence platform on the market.",
    },
];

export default function TestimonialsSection() {
    return (
        <Box id="testimonials" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, sm: 3, md: 4 }, bgcolor: "#F8FAFC" }}>
            <Container maxWidth="xl">
                {/* Section Header */}
                <Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 } }}>
                    <Chip
                        icon={<VerifiedRoundedIcon sx={{ fontSize: "14px !important", color: "#10B981" }} />}
                        label="VERIFIED VOYAGER TRANSMISSIONS"
                        size="small"
                        className="telemetry-code"
                        sx={{ bgcolor: "#ECFDF5", color: "#059669", fontWeight: 800, mb: 1.5 }}
                    />
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 900,
                            color: "#0F172A",
                            fontSize: { xs: "2.1rem", sm: "2.7rem", md: "3.2rem" },
                            letterSpacing: "-1px",
                        }}
                    >
                        Our Customer Says
                    </Typography>
                    <Typography
                        sx={{
                            color: "#64748B",
                            fontSize: { xs: "0.95rem", md: "1.05rem" },
                            mt: 1.2,
                            fontWeight: 450,
                        }}
                    >
                        Real travelers sharing their autonomous journey experiences
                    </Typography>
                </Box>

                {/* 3 Testimonial Cards */}
                <Grid container spacing={3.5}>
                    {TESTIMONIALS.map((item) => (
                        <Grid item xs={12} md={4} key={item.id}>
                            <Paper
                                elevation={0}
                                className="hud-card"
                                onMouseEnter={() => sounds.playHover()}
                                sx={{
                                    p: { xs: 3.5, md: 4 },
                                    borderRadius: "26px",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Box>
                                    {/* Monospace Identifier & Route */}
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                                        <Typography className="telemetry-code" sx={{ color: "#94A3B8", fontSize: "0.68rem !important" }}>
                                            {item.id}
                                        </Typography>
                                        <Chip
                                            label={item.route}
                                            size="small"
                                            className="telemetry-code"
                                            sx={{ bgcolor: "#F1F5F9", color: "#334155", fontWeight: 750, height: 22 }}
                                        />
                                    </Stack>

                                    {/* 5 Stars */}
                                    <Stack direction="row" spacing={0.5} sx={{ mb: 2 }}>
                                        {[...Array(item.rating)].map((_, i) => (
                                            <StarRoundedIcon key={i} sx={{ color: "#F59E0B", fontSize: 22 }} />
                                        ))}
                                    </Stack>

                                    <Typography
                                        sx={{
                                            color: "#334155",
                                            fontSize: "0.98rem",
                                            lineHeight: 1.7,
                                            fontStyle: "italic",
                                            mb: 3,
                                        }}
                                    >
                                        "{item.quote}"
                                    </Typography>
                                </Box>

                                {/* User Info Footer */}
                                <Stack direction="row" spacing={1.8} alignItems="center" sx={{ pt: 2, borderTop: "1px solid #F1F5F9" }}>
                                    <Avatar
                                        src={item.avatar}
                                        alt={item.name}
                                        sx={{
                                            width: 52,
                                            height: 52,
                                            boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)",
                                            border: "2px solid #10B981",
                                        }}
                                    />
                                    <Box>
                                        <Typography sx={{ fontWeight: 850, color: "#0F172A", fontSize: "1rem" }}>
                                            {item.name}
                                        </Typography>
                                        <Typography sx={{ color: "#64748B", fontSize: "0.8rem" }}>
                                            {item.role} · {item.location}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
