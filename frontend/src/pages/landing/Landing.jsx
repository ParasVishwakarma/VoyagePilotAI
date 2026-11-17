import React from "react";
import { Box } from "@mui/material";

import Navbar from "../../components/landing/Navbar";
import Hero from "../../components/landing/Hero";
import PopularDestinations from "../../components/landing/PopularDestinations";
import ExperienceSection from "../../components/landing/ExperienceSection";
import NewsletterSection from "../../components/landing/NewsletterSection";
import TestimonialsSection from "../../components/landing/TestimonialsSection";
import Footer from "../../components/landing/Footer";
import FloatingAIOrb from "../../components/common/FloatingAIOrb";
import CyberFlightGrid from "../../components/common/CyberFlightGrid";

export default function Landing() {
    return (
        <Box
            className="aerospace-grid-bg"
            sx={{
                bgcolor: "#F8FAFC",
                minHeight: "100vh",
                color: "#0F172A",
                overflowX: "hidden",
                position: "relative",
            }}
        >
            {/* Interactive Aerospace Constellation / Flight Corridor Canvas */}
            <CyberFlightGrid />

            {/* Top Navigation with Audio Controller & Telemetry Ribbon */}
            <Navbar />

            {/* Hero Section with Scenic Banner & Aerospace HUD Search Portal */}
            <Hero />

            {/* Popular Destination Catalog with Corner Brackets & Telemetry */}
            <PopularDestinations />

            {/* Our Experience / Value Proposition with 4 Stats */}
            <ExperienceSection />

            {/* Newsletter Subscription Banner */}
            <NewsletterSection />

            {/* Social Proof & Customer Reviews */}
            <TestimonialsSection />

            {/* Clean Modern Footer */}
            <Footer />

            {/* Persistent Futuristic Floating Neural AI Orb */}
            <FloatingAIOrb />
        </Box>
    );
}
