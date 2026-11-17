import { useEffect, useState } from "react";
import {
    Box, Button, Chip, Grid, LinearProgress, Paper, Stack, Typography,
} from "@mui/material";
import FlightRoundedIcon from "@mui/icons-material/FlightRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";

import DashboardLayout from "../../layouts/DashboardLayout";
import Topbar from "../../components/dashboard/Topbar";
import StatCard from "../../components/dashboard/StatCard";
import FlightTable from "../../components/dashboard/FlightTable";
import TravelTimeline from "../../components/dashboard/TravelTimeline";
import AIAssistantCard from "../../components/dashboard/AIAssistantCard";
import DashboardPopularDestinations from "../../components/dashboard/DashboardPopularDestinations";
import { getDashboardData } from "../../api/dashboardApi";
import { getMyTrips } from "../../api/tripApi";
import { useNavigate } from "react-router-dom";
import { sounds } from "../../utils/soundEffects";

const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" }) : "Date not set";

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let active = true;

        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const dashData = await getDashboardData();
                if (active) setData(dashData);

                const tripsRes = await getMyTrips(0, 10);
                const tripPayload = tripsRes?.data ?? tripsRes;
                const tripList = Array.isArray(tripPayload?.content) ? tripPayload.content : Array.isArray(tripPayload) ? tripPayload : [];
                if (active) setTrips(tripList);
            } catch (error) {
                console.error("Dashboard Loading Error:", error);
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchDashboard();
        return () => {
            active = false;
        };
    }, []);

    const nextTrip = data?.upcomingTrips?.[0] || trips[0];
    const today = new Date();
    const start = nextTrip?.startDate ? new Date(nextTrip.startDate) : null;
    const end = nextTrip?.endDate ? new Date(nextTrip.endDate) : null;
    const totalDays = start && end ? Math.max(1, Math.ceil((end - start) / 86400000)) : 1;
    const daysLeft = start ? Math.max(0, Math.ceil((start - today) / 86400000)) : 0;
    const progress = start ? Math.min(100, Math.max(0, ((totalDays - daysLeft) / totalDays) * 100)) : 0;

    const totalTrips = data?.totalTrips ?? trips.length;
    const totalFlights = data?.totalFlights ?? 0;
    const activeAlerts = data?.activeAlerts ?? 0;
    const totalBudget = data?.totalBudget ? Number(data.totalBudget) : 0;
    const totalExpenses = data?.totalExpenses ? Number(data.totalExpenses) : 0;

    return (
        <DashboardLayout>
            <Topbar />

            {/* Futuristic Aerospace Mission Control Telemetry Ticker */}
            <Box
                className="telemetry-ticker"
                sx={{
                    mb: 3,
                    p: { xs: 1.2, md: 1.5 },
                    px: { xs: 2, md: 2.5 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1.5,
                }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                    <Chip
                        label="RADAR STATUS: NOMINAL"
                        size="small"
                        sx={{ bgcolor: "rgba(16, 185, 129, 0.2)", color: "#34D399", fontWeight: 850, fontSize: "0.7rem", border: "1px solid rgba(16, 185, 129, 0.4)" }}
                    />
                    <Typography sx={{ color: "rgba(255, 255, 255, 0.85)", fontSize: 12, fontWeight: 650 }}>
                        📡 Global Corridors: <b style={{ color: "#00F5D4" }}>450+ Active</b>
                    </Typography>
                    <Typography sx={{ color: "rgba(255, 255, 255, 0.85)", fontSize: 12, fontWeight: 650, display: { xs: "none", md: "inline" } }}>
                        ⚡ Neural Latency: <b style={{ color: "#38BDF8" }}>0.38s</b>
                    </Typography>
                    <Typography sx={{ color: "rgba(255, 255, 255, 0.85)", fontSize: 12, fontWeight: 650, display: { xs: "none", sm: "inline" } }}>
                        🛡️ Disruption Shield: <b style={{ color: "#34D399" }}>100% Protected</b>
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ color: "#94A3B8", fontSize: 11, fontWeight: 700 }}>
                        RANK:
                    </Typography>
                    <Chip
                        label="⚡ LEVEL 4 VOYAGER · 18,400 MILES"
                        size="small"
                        className="holographic-pill"
                        sx={{ height: 22, fontSize: "0.68rem" }}
                    />
                </Stack>
            </Box>

            {/* Welcome & System Status */}
            <Box sx={{ mb: 3.5, display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, flexWrap: "wrap", gap: 2 }}>
                <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                        <Typography sx={{ color: "#0F172A", fontSize: { xs: 24, md: 28 }, fontWeight: 850, letterSpacing: "-.8px" }}>
                            Welcome back, {data?.userName || "Traveler"}
                        </Typography>
                        <Box component="span" sx={{ fontSize: 20, color: "#10B981" }}>✦</Box>
                    </Stack>
                    <Typography sx={{ color: "#64748B", fontSize: 13 }}>
                        Here is your live autonomous travel overview and disruption monitor.
                    </Typography>
                </Box>

                {/* Quick Action Buttons */}
                <Stack direction="row" spacing={1.2} flexWrap="wrap">
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => { sounds.playClick(); navigate("/map"); }}
                        startIcon={<MapRoundedIcon sx={{ fontSize: 16 }} />}
                        sx={{ borderRadius: "10px", borderColor: "#CBD5E1", color: "#334155", fontWeight: 700, fontSize: 12 }}
                    >
                        Explore Map
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => { sounds.playClick(); navigate("/hotels"); }}
                        startIcon={<HotelRoundedIcon sx={{ fontSize: 16 }} />}
                        sx={{ borderRadius: "10px", borderColor: "#CBD5E1", color: "#334155", fontWeight: 700, fontSize: 12 }}
                    >
                        Add Stay
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => { sounds.playClick(); navigate("/trips"); }}
                        startIcon={<AddRoundedIcon sx={{ fontSize: 16 }} />}
                        sx={{ borderRadius: "10px", bgcolor: "#10B981", "&:hover": { bgcolor: "#059669" }, fontWeight: 700, fontSize: 12 }}
                    >
                        New Journey
                    </Button>
                </Stack>
            </Box>

            {/* Stat Cards - Real Data Backed */}
            <Grid container spacing={2.2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard
                        title="Total journeys"
                        value={loading ? "—" : totalTrips}
                        color="#2563EB"
                        trend={totalTrips > 0 ? `${totalTrips} planned or active` : "Start planning"}
                        icon={<LuggageRoundedIcon />}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard
                        title="Tracked flights"
                        value={loading ? "—" : totalFlights}
                        color="#0284C7"
                        trend={data?.delayedFlights > 0 ? `${data.delayedFlights} delayed` : "All on schedule"}
                        icon={<FlightRoundedIcon />}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard
                        title="Active AI alerts"
                        value={loading ? "—" : String(activeAlerts).padStart(2, "0")}
                        color={activeAlerts > 0 ? "#DC2626" : "#10B981"}
                        trend={activeAlerts > 0 ? "Requires review" : "Clear skies ahead"}
                        icon={<AutoAwesomeRoundedIcon />}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatCard
                        title="Budget committed"
                        value={loading ? "—" : `₹${totalBudget.toLocaleString("en-IN")}`}
                        color="#8B5CF6"
                        trend={`₹${totalExpenses.toLocaleString("en-IN")} spent`}
                        icon={<AccountBalanceWalletRoundedIcon />}
                    />
                </Grid>
            </Grid>

            {/* Main Interactive Grid */}
            <Grid container spacing={2.5}>
                {/* Flight Itinerary Table */}
                <Grid size={{ xs: 12, xl: 8 }}>
                    <FlightTable tripId={nextTrip?.id || null} initialFlights={data?.recentFlights} />
                </Grid>

                {/* AI Concierge Co-Pilot */}
                <Grid size={{ xs: 12, xl: 4 }}>
                    <AIAssistantCard flightId={data?.recentFlights?.[0]?.id || null} />
                </Grid>

                {/* Journey Timeline */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <TravelTimeline flights={data?.recentFlights || []} />
                </Grid>

                {/* Next Destination Card */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2.2, md: 2.6 },
                            height: "100%",
                            minHeight: 280,
                            borderRadius: "18px",
                            border: "1px solid #E2E8F0",
                            bgcolor: "#FFFFFF",
                            boxShadow: "0 4px 20px rgba(15,23,42,.03)",
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                            <Box>
                                <Typography sx={{ color: "#0F172A", fontSize: 14.5, fontWeight: 800 }}>Next Destination</Typography>
                                <Typography sx={{ color: "#64748B", fontSize: 11, mt: 0.3 }}>Your upcoming itinerary</Typography>
                            </Box>
                            <Box sx={{ width: 34, height: 34, borderRadius: "10px", display: "grid", placeItems: "center", bgcolor: "#EFF6FF", color: "#2563EB" }}>
                                <PlaceRoundedIcon fontSize="small" />
                            </Box>
                        </Stack>

                        {loading ? (
                            <Typography sx={{ color: "#64748B", fontSize: 12, py: 3 }}>Loading trip details...</Typography>
                        ) : !nextTrip ? (
                            <Box sx={{ py: 3, textAlign: "center" }}>
                                <Typography sx={{ color: "#0F172A", fontWeight: 700, fontSize: 13.5 }}>No upcoming trips scheduled</Typography>
                                <Typography sx={{ color: "#64748B", fontSize: 11.5, mt: 0.6 }}>Create a trip to view destination countdown and progress.</Typography>
                                <Button
                                    size="small"
                                    onClick={() => navigate("/trips")}
                                    sx={{ mt: 2, textTransform: "none", fontWeight: 750, color: "#2563EB" }}
                                >
                                    Create a trip
                                </Button>
                            </Box>
                        ) : (
                            <>
                                <Box
                                    sx={{
                                        p: 2.2,
                                        borderRadius: "14px",
                                        color: "#FFFFFF",
                                        background: "linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)",
                                        boxShadow: "0 8px 24px rgba(16,185,129,.22)",
                                    }}
                                >
                                    <Typography sx={{ color: "#93C5FD", fontSize: 9.5, fontWeight: 800, letterSpacing: "1px" }}>
                                        ACTIVE EXPEDITION
                                    </Typography>
                                    <Typography sx={{ fontSize: 22, fontWeight: 850, mt: 0.8, letterSpacing: "-.5px" }}>
                                        {nextTrip.destination || "Destination"}
                                    </Typography>
                                    <Stack direction="row" alignItems="center" spacing={0.8} sx={{ mt: 1 }}>
                                        <CalendarMonthRoundedIcon sx={{ fontSize: 14, color: "#93C5FD" }} />
                                        <Typography sx={{ color: "#E0F2FE", fontSize: 11 }}>
                                            {formatDate(nextTrip.startDate)} — {formatDate(nextTrip.endDate)}
                                        </Typography>
                                    </Stack>
                                </Box>

                                <Stack direction="row" justifyContent="space-between" sx={{ mt: 2.2 }}>
                                    <Box>
                                        <Typography sx={{ color: "#64748B", fontSize: 10.5, fontWeight: 600 }}>Trip Budget</Typography>
                                        <Typography sx={{ color: "#0F172A", fontSize: 15, fontWeight: 800, mt: 0.2 }}>
                                            ₹{Number(nextTrip.budget || 0).toLocaleString("en-IN")}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: "right" }}>
                                        <Typography sx={{ color: "#64748B", fontSize: 10.5, fontWeight: 600 }}>Departure</Typography>
                                        <Typography sx={{ color: "#2563EB", fontSize: 13, fontWeight: 750, mt: 0.3 }}>
                                            {daysLeft === 0 ? "Underway / Today" : `In ${daysLeft} days`}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Box sx={{ mt: 2 }}>
                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.8 }}>
                                        <Typography sx={{ color: "#64748B", fontSize: 11, fontWeight: 650 }}>Schedule readiness</Typography>
                                        <Typography sx={{ color: "#2563EB", fontSize: 11, fontWeight: 800 }}>{Math.round(progress)}%</Typography>
                                    </Stack>
                                    <LinearProgress
                                        variant="determinate"
                                        value={progress}
                                        sx={{
                                            height: 6,
                                            borderRadius: 5,
                                            bgcolor: "#F1F5F9",
                                            "& .MuiLinearProgress-bar": { borderRadius: 5, bgcolor: "#2563EB" },
                                        }}
                                    />
                                </Box>

                                <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                                    <Typography
                                        onClick={() => navigate("/trips")}
                                        sx={{
                                            cursor: "pointer",
                                            color: "#2563EB",
                                            fontSize: 11.5,
                                            fontWeight: 800,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                            "&:hover": { color: "#1D4ED8" },
                                        }}
                                    >
                                        Manage itinerary <ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />
                                    </Typography>
                                </Stack>
                            </>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Popular & Trending Destinations Movable Carousel */}
            <DashboardPopularDestinations />
        </DashboardLayout>
    );
}
