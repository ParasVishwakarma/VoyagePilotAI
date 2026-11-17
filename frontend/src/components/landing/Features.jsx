import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";

import FeatureCard from "./FeatureCard";

const features = [
    {
        icon: <FlightTakeoffRoundedIcon fontSize="medium" />,
        title: "Intelligent Flight Tracking",
        description:
            "Track flights, airports, schedules, and monitor live delays with instant notification propagation.",
    },
    {
        icon: <AutoAwesomeRoundedIcon fontSize="medium" />,
        title: "Gemini AI Recommendations",
        description:
            "Receive context-aware disruption mitigations, re-routing alternatives, and automated flight analyses.",
    },
    {
        icon: <MapRoundedIcon fontSize="medium" />,
        title: "Global Interactive Map",
        description:
            "Visualize flight corridors, destination waypoints, and accommodation pins across an interactive world projection.",
    },
    {
        icon: <HotelRoundedIcon fontSize="medium" />,
        title: "Hotels & Stays Management",
        description:
            "Seamlessly associate reservations, check-in dates, confirmation codes, and costs with specific trips.",
    },
];

export default function Features() {
    return (
        <Box
            sx={{
                py: { xs: 8, md: 12 },
                px: { xs: 3, md: 6 },
                maxWidth: 1300,
                mx: "auto",
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
                ENTERPRISE CAPABILITIES
            </Typography>

            <Typography
                variant="h3"
                align="center"
                fontWeight={850}
                color="#0F172A"
                letterSpacing="-1px"
                sx={{ mb: 6, fontSize: { xs: "2rem", md: "2.75rem" } }}
            >
                Everything Required for Autonomous Travel Control
            </Typography>

            <Grid container spacing={3}>
                {features.map((feature) => (
                    <Grid item xs={12} sm={6} md={3} key={feature.title}>
                        <FeatureCard
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
