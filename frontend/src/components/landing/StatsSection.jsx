import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";

const stats = [
    { value: "99.8%", label: "Platform Uptime", sub: "Enterprise grade reliability" },
    { value: "450+", label: "Airport Corridors", sub: "Global geo-tracking coverage" },
    { value: "< 2s", label: "AI Disruption Engine", sub: "Real-time mitigation response" },
    { value: "100%", label: "Data Isolation", sub: "Multi-tenant tenant security" },
];

export default function StatsSection() {
    return (
        <Box
            sx={{
                maxWidth: 1300,
                mx: "auto",
                py: { xs: 8, md: 10 },
                px: { xs: 3, md: 6 },
            }}
        >
            <Typography
                align="center"
                sx={{
                    color: "#2563EB",
                    fontWeight: 800,
                    letterSpacing: "1px",
                    fontSize: "0.85rem",
                    mb: 1.5,
                }}
            >
                ENGINEERED FOR MODERN TRAVEL MANAGEMENT
            </Typography>

            <Typography
                variant="h3"
                align="center"
                fontWeight={850}
                color="#0F172A"
                letterSpacing="-1px"
                sx={{ mb: 6, fontSize: { xs: "2rem", md: "2.75rem" } }}
            >
                Proven Scale and Real-Time Precision
            </Typography>

            <Grid container spacing={3}>
                {stats.map((item) => (
                    <Grid item xs={12} sm={6} md={3} key={item.label}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3.5,
                                textAlign: "center",
                                borderRadius: "20px",
                                border: "1px solid #E2E8F0",
                                bgcolor: "#FFFFFF",
                                transition: "all 0.3s ease",
                                boxShadow: "0 4px 20px rgba(15, 23, 42, 0.03)",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                    boxShadow: "0 18px 36px rgba(37, 99, 235, 0.08)",
                                    borderColor: "rgba(37, 99, 235, 0.3)",
                                },
                            }}
                        >
                            <Typography
                                variant="h3"
                                fontWeight={900}
                                sx={{
                                    background: "linear-gradient(135deg, #0F172A 0%, #2563EB 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    mb: 1,
                                }}
                            >
                                {item.value}
                            </Typography>
                            <Typography variant="body1" fontWeight={750} color="#0F172A" sx={{ mb: 0.5 }}>
                                {item.label}
                            </Typography>
                            <Typography variant="caption" color="#64748B">
                                {item.sub}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
