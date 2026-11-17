import React from "react";
import {
    Box, Typography, Container, Grid, Stack, Link, Divider
} from "@mui/material";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import { useNavigate } from "react-router-dom";

export default function Footer() {
    const navigate = useNavigate();

    return (
        <Box
            component="footer"
            sx={{
                bgcolor: "#FFFFFF",
                borderTop: "1px solid #E2E8F0",
                pt: { xs: 8, md: 10 },
                pb: 6,
                px: { xs: 2, sm: 3, md: 4 },
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={{ xs: 5, md: 6 }} sx={{ mb: 6 }}>
                    {/* Column 1: Brand & Bio */}
                    <Grid item xs={12} md={4}>
                        <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 2 }}>
                            <Box
                                sx={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: "10px",
                                    bgcolor: "#10B981",
                                    display: "grid",
                                    placeItems: "center",
                                    color: "#FFFFFF",
                                    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
                                }}
                            >
                                <ExploreRoundedIcon fontSize="small" />
                            </Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 850,
                                    color: "#0F172A",
                                    fontSize: "1.3rem",
                                }}
                            >
                                VoyagePilot<span style={{ color: "#10B981" }}>.</span>
                            </Typography>
                        </Stack>

                        <Typography
                            sx={{
                                color: "#64748B",
                                fontSize: "0.92rem",
                                lineHeight: 1.65,
                                maxWidth: 320,
                                mb: 2,
                            }}
                        >
                            The intelligent travel companion engineered for autonomous disruption mitigation,
                            real-time flight tracking, and curated destination experiences worldwide.
                        </Typography>
                    </Grid>

                    {/* Column 2: Company */}
                    <Grid item xs={6} sm={3} md={2}>
                        <Typography sx={{ fontWeight: 800, color: "#0F172A", fontSize: "0.95rem", mb: 2 }}>
                            Company
                        </Typography>
                        <Stack spacing={1.2}>
                            {["About Us", "Careers", "Mobile App", "Blog"].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    underline="hover"
                                    sx={{ color: "#64748B", fontSize: "0.88rem", fontWeight: 500, "&:hover": { color: "#10B981" } }}
                                >
                                    {item}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Column 3: Contact */}
                    <Grid item xs={6} sm={3} md={2}>
                        <Typography sx={{ fontWeight: 800, color: "#0F172A", fontSize: "0.95rem", mb: 2 }}>
                            Contact
                        </Typography>
                        <Stack spacing={1.2}>
                            {["Help / FAQ", "Press", "Affiliates", "Enterprise Support"].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    underline="hover"
                                    sx={{ color: "#64748B", fontSize: "0.88rem", fontWeight: 500, "&:hover": { color: "#10B981" } }}
                                >
                                    {item}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Column 4: More */}
                    <Grid item xs={6} sm={3} md={2}>
                        <Typography sx={{ fontWeight: 800, color: "#0F172A", fontSize: "0.95rem", mb: 2 }}>
                            Explore
                        </Typography>
                        <Stack spacing={1.2}>
                            <Link
                                component="button"
                                onClick={() => navigate("/map")}
                                underline="hover"
                                sx={{ color: "#64748B", fontSize: "0.88rem", fontWeight: 500, textAlign: "left", "&:hover": { color: "#10B981" } }}
                            >
                                Flight Map
                            </Link>
                            <Link
                                component="button"
                                onClick={() => navigate("/flights")}
                                underline="hover"
                                sx={{ color: "#64748B", fontSize: "0.88rem", fontWeight: 500, textAlign: "left", "&:hover": { color: "#10B981" } }}
                            >
                                Track Flights
                            </Link>
                            <Link
                                component="button"
                                onClick={() => navigate("/hotels")}
                                underline="hover"
                                sx={{ color: "#64748B", fontSize: "0.88rem", fontWeight: 500, textAlign: "left", "&:hover": { color: "#10B981" } }}
                            >
                                Hotel Stays
                            </Link>
                            <Link
                                component="button"
                                onClick={() => navigate("/dashboard")}
                                underline="hover"
                                sx={{ color: "#64748B", fontSize: "0.88rem", fontWeight: 500, textAlign: "left", "&:hover": { color: "#10B981" } }}
                            >
                                Dashboard
                            </Link>
                        </Stack>
                    </Grid>

                    {/* Column 5: Social Media */}
                    <Grid item xs={6} sm={3} md={2}>
                        <Typography sx={{ fontWeight: 800, color: "#0F172A", fontSize: "0.95rem", mb: 2 }}>
                            Social Media
                        </Typography>
                        <Stack spacing={1.2}>
                            {["Instagram", "Twitter / X", "Facebook", "LinkedIn"].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    underline="hover"
                                    sx={{ color: "#64748B", fontSize: "0.88rem", fontWeight: 500, "&:hover": { color: "#10B981" } }}
                                >
                                    {item}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ borderColor: "#F1F5F9", mb: 4 }} />

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                >
                    <Typography variant="caption" color="#94A3B8">
                        © {new Date().getFullYear()} VoyagePilot AI Technologies Inc. All rights reserved.
                    </Typography>

                    <Stack direction="row" spacing={3}>
                        <Link href="#" underline="hover" sx={{ color: "#94A3B8", fontSize: "0.75rem" }}>
                            Privacy Policy
                        </Link>
                        <Link href="#" underline="hover" sx={{ color: "#94A3B8", fontSize: "0.75rem" }}>
                            Terms of Service
                        </Link>
                        <Link href="#" underline="hover" sx={{ color: "#94A3B8", fontSize: "0.75rem" }}>
                            Security Architecture
                        </Link>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}
