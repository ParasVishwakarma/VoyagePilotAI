import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Grid,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import DashboardLayout from "../../layouts/DashboardLayout";
import Loader from "../../components/common/Loader";
import AnalyticsCard from "../../components/analytics/AnalyticsCard";
import MonthlyTripsChart from "../../components/analytics/MonthlyTripsChart";
import FlightStatusChart from "../../components/analytics/FlightStatusChart";
import BudgetChart from "../../components/analytics/BudgetChart";
import TravelScoreCard from "../../components/analytics/TravelScoreCard";
import TopDestinations from "../../components/analytics/TopDestinations";
import AIInsights from "../../components/analytics/AIInsights";

import { getMyTrips } from "../../api/tripApi";
import { getFlightsByTrip } from "../../api/flightApi";
import { getDisruptions } from "../../api/disruptionApi";

const asList = (value) => {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.content)) return value.content;
    if (Array.isArray(value?.data)) return value.data;
    if (Array.isArray(value?.data?.content)) return value.data.content;
    return [];
};

const unwrap = (value) => value?.data ?? value;

export default function Analytics() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [trips, setTrips] = useState([]);
    const [flights, setFlights] = useState([]);
    const [disruptions, setDisruptions] = useState([]);

    const loadAnalytics = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            setError("");

            const tripPayload = unwrap(await getMyTrips(0, 100));
            const userTrips = asList(tripPayload);
            setTrips(userTrips);

            const flightPayloads = await Promise.all(
                userTrips.map(async (trip) => {
                    try {
                        return asList(unwrap(await getFlightsByTrip(trip.id)));
                    } catch (flightError) {
                        console.error(`Unable to load flights for trip ${trip.id}:`, flightError);
                        return [];
                    }
                })
            );
            setFlights(flightPayloads.flat());

            const disruptionPayload = unwrap(await getDisruptions());
            setDisruptions(asList(disruptionPayload));
        } catch (loadError) {
            console.error("Analytics loading error:", loadError);
            setError("We couldn't load your analytics right now. Please try again.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadAnalytics();
    }, [loadAnalytics]);

    const totalBudget = useMemo(
        () => trips.reduce((sum, trip) => sum + (Number(trip.budget) || 0), 0),
        [trips]
    );
    const activeAlerts = useMemo(
        () => disruptions.filter((item) => !item.resolved).length,
        [disruptions]
    );

    if (loading) {
        return (
            <DashboardLayout>
                <Box sx={{ minHeight: "65vh", display: "grid", placeItems: "center" }}>
                    <Loader />
                </Box>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <Box sx={{ pb: 4 }}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "stretch", sm: "center" }}
                    justifyContent="space-between"
                    spacing={2}
                    sx={{ mb: 3.5 }}
                >
                    <Box>
                        <Typography
                            sx={{
                                color: "#14243A",
                                fontSize: { xs: 25, md: 30 },
                                fontWeight: 850,
                                letterSpacing: "-.9px",
                            }}
                        >
                            Travel analytics
                        </Typography>
                        <Typography sx={{ color: "#718096", fontSize: 13, mt: .6 }}>
                            A clear picture of your journeys, flight activity and travel spend.
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshRoundedIcon />}
                        onClick={() => loadAnalytics(true)}
                        disabled={refreshing}
                        sx={{
                            alignSelf: { xs: "flex-start", sm: "center" },
                            borderRadius: "11px",
                            px: 2,
                            py: 1,
                            borderColor: "#DCE4EF",
                            color: "#315FC5",
                            textTransform: "none",
                            fontWeight: 700,
                        }}
                    >
                        {refreshing ? "Refreshing…" : "Refresh data"}
                    </Button>
                </Stack>

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2.5, borderRadius: "12px" }}
                        action={
                            <Button color="inherit" size="small" onClick={() => loadAnalytics(true)}>
                                Retry
                            </Button>
                        }
                    >
                        {error}
                    </Alert>
                )}

                <Grid container spacing={2} sx={{ mb: 2.5 }}>
                    <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                        <AnalyticsCard title="Total trips" value={trips.length} color="#315FC5" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                        <AnalyticsCard title="Tracked flights" value={flights.length} color="#15966A" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                        <AnalyticsCard title="Total trip budget" value={`₹${totalBudget.toLocaleString("en-IN")}`} color="#7C65D6" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                        <AnalyticsCard title="Active alerts" value={activeAlerts} color="#D18A2D" />
                    </Grid>
                </Grid>

                <Grid container spacing={2.5} alignItems="stretch">
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <MonthlyTripsChart trips={trips} />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <FlightStatusChart flights={flights} />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <BudgetChart trips={trips} />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <TravelScoreCard trips={trips} flights={flights} disruptions={disruptions} />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <TopDestinations trips={trips} />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <AIInsights disruptions={disruptions} />
                    </Grid>
                </Grid>

                <Paper
                    elevation={0}
                    sx={{
                        mt: 2.5,
                        px: 2.2,
                        py: 1.6,
                        border: "1px solid #E8EDF3",
                        borderRadius: "14px",
                        bgcolor: "#FBFCFE",
                    }}
                >
                    <Typography sx={{ color: "#8290A5", fontSize: 11.5 }}>
                        Analytics are calculated from the trips, flights and disruptions currently saved in your account.
                    </Typography>
                </Paper>
            </Box>
        </DashboardLayout>
    );
}
