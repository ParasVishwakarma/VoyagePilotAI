import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    Box, Paper, Typography, Stack, Grid, Chip, Button, MenuItem, Select,
    FormControl, InputLabel, Card, CardContent, Divider, Alert
} from "@mui/material";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";

import DashboardLayout from "../../layouts/DashboardLayout";
import InteractiveMap from "../../components/map/InteractiveMap";
import Loader from "../../components/common/Loader";
import { getMyTrips } from "../../api/tripApi";
import { getFlightsByTrip } from "../../api/flightApi";
import { getAllHotels } from "../../api/hotelApi";
import { sounds } from "../../utils/soundEffects";

const asList = (v) => {
    if (Array.isArray(v)) return v;
    if (Array.isArray(v?.content)) return v.content;
    if (Array.isArray(v?.data)) return v.data;
    if (Array.isArray(v?.data?.content)) return v.data.content;
    return [];
};

export default function TravelMap() {
    const [trips, setTrips] = useState([]);
    const [flights, setFlights] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [selectedTripId, setSelectedTripId] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const tripsRes = await getMyTrips(0, 100);
            const userTrips = asList(tripsRes);
            setTrips(userTrips);

            const flightPromises = userTrips.map(async (trip) => {
                try {
                    const res = await getFlightsByTrip(trip.id);
                    return asList(res);
                } catch {
                    return [];
                }
            });
            const flightArrays = await Promise.all(flightPromises);
            setFlights(flightArrays.flat());

            try {
                const hotelsRes = await getAllHotels();
                setHotels(asList(hotelsRes));
            } catch {
                setHotels([]);
            }
        } catch (err) {
            console.error("Failed to load map data", err);
            setError("Unable to load travel data for map visualization.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredTrips = useMemo(() => {
        if (selectedTripId === "all") return trips;
        return trips.filter((t) => String(t.id) === String(selectedTripId));
    }, [trips, selectedTripId]);

    const filteredFlights = useMemo(() => {
        if (selectedTripId === "all") return flights;
        return flights.filter((f) => String(f.tripId || f.trip?.id) === String(selectedTripId));
    }, [flights, selectedTripId]);

    const filteredHotels = useMemo(() => {
        if (selectedTripId === "all") return hotels;
        return hotels.filter((h) => String(h.tripId || h.trip?.id) === String(selectedTripId));
    }, [hotels, selectedTripId]);

    return (
        <DashboardLayout>
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: "auto" }}>
                {/* Header */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    <Box>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box
                                sx={{
                                    p: 1.2,
                                    borderRadius: "14px",
                                    bgcolor: "#ECFDF5",
                                    color: "#10B981",
                                    display: "flex",
                                    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.2)",
                                }}
                            >
                                <MapRoundedIcon fontSize="medium" />
                            </Box>
                            <Box>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Typography variant="h5" fontWeight={850} color="#0F172A">
                                        Quantum Travel Radar
                                    </Typography>
                                    <Chip label="60 FPS In-Motion" size="small" className="holographic-pill" sx={{ height: 20, fontSize: "0.68rem" }} />
                                </Stack>
                                <Typography variant="body2" color="#64748B">
                                    Real-time flight trajectories in continuous motion, animated compass headings, and lodging telemetry
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel id="trip-filter-label">Filter Trip</InputLabel>
                            <Select
                                labelId="trip-filter-label"
                                value={selectedTripId}
                                label="Filter Trip"
                                onChange={(e) => {
                                    sounds.playClick();
                                    setSelectedTripId(e.target.value);
                                }}
                                sx={{ borderRadius: "12px", bgcolor: "#FFFFFF" }}
                            >
                                <MenuItem value="all">All Trips & Corridors</MenuItem>
                                {trips.map((t) => (
                                    <MenuItem key={t.id} value={t.id}>
                                        {t.title || t.destination}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            variant="outlined"
                            startIcon={<RefreshRoundedIcon />}
                            onClick={() => {
                                sounds.playClick();
                                loadData();
                            }}
                            sx={{
                                borderRadius: "12px",
                                borderColor: "#E2E8F0",
                                color: "#475569",
                                textTransform: "none",
                                fontWeight: 600,
                                "&:hover": { borderColor: "#CBD5E1", bgcolor: "#F8FAFC" },
                            }}
                        >
                            Sync
                        </Button>
                    </Stack>
                </Stack>

                {error && (
                    <Alert severity="warning" sx={{ mb: 3, borderRadius: "14px" }}>
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Box sx={{ minHeight: "50vh", display: "grid", placeItems: "center" }}>
                        <Loader />
                    </Box>
                ) : (
                    <Stack spacing={3}>
                        {/* Summary Badges */}
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        borderRadius: "16px",
                                        border: "1px solid #E2E8F0",
                                        bgcolor: "#FFFFFF",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: "12px",
                                            bgcolor: "rgba(37, 99, 235, 0.1)",
                                            color: "#2563EB",
                                        }}
                                    >
                                        <PlaceRoundedIcon />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="#64748B" fontWeight={600}>
                                            DESTINATIONS
                                        </Typography>
                                        <Typography variant="h6" fontWeight={800} color="#0F172A">
                                            {filteredTrips.length}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        borderRadius: "16px",
                                        border: "1px solid #E2E8F0",
                                        bgcolor: "#FFFFFF",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: "12px",
                                            bgcolor: "rgba(14, 165, 233, 0.1)",
                                            color: "#0EA5E9",
                                        }}
                                    >
                                        <FlightTakeoffRoundedIcon />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="#64748B" fontWeight={600}>
                                            FLIGHT CORRIDORS
                                        </Typography>
                                        <Typography variant="h6" fontWeight={800} color="#0F172A">
                                            {filteredFlights.length}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        borderRadius: "16px",
                                        border: "1px solid #E2E8F0",
                                        bgcolor: "#FFFFFF",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: "12px",
                                            bgcolor: "rgba(16, 185, 129, 0.1)",
                                            color: "#10B981",
                                        }}
                                    >
                                        <HotelRoundedIcon />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="#64748B" fontWeight={600}>
                                            HOTEL STAYS
                                        </Typography>
                                        <Typography variant="h6" fontWeight={800} color="#0F172A">
                                            {filteredHotels.length}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Real Interactive Leaflet World Map with Motion */}
                        <InteractiveMap
                            trips={filteredTrips}
                            flights={filteredFlights}
                            hotels={filteredHotels}
                        />

                        {/* Live Corridors & Stays Telemetry Panel */}
                        <Grid container spacing={3}>
                            {/* Flight Corridors List */}
                            <Grid item xs={12} md={6}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: "20px",
                                        border: "1px solid #E2E8F0",
                                        bgcolor: "#FFFFFF",
                                        height: "100%",
                                    }}
                                >
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                        <Typography variant="subtitle1" fontWeight={800} color="#0F172A">
                                            Flight Corridors in Motion
                                        </Typography>
                                        <Chip
                                            label={`${filteredFlights.length} Corridors`}
                                            size="small"
                                            sx={{ bgcolor: "#EFF6FF", color: "#2563EB", fontWeight: 750 }}
                                        />
                                    </Stack>

                                    {filteredFlights.length === 0 ? (
                                        <Typography variant="body2" color="#64748B" sx={{ py: 3, textAlign: "center" }}>
                                            No flights linked to this selection. Add flights to visualize animated corridors.
                                        </Typography>
                                    ) : (
                                        <Stack spacing={1.5}>
                                            {filteredFlights.map((f) => (
                                                <Box
                                                    key={f.id}
                                                    sx={{
                                                        p: 1.8,
                                                        borderRadius: "14px",
                                                        bgcolor: "#F8FAFC",
                                                        border: "1px solid #E2E8F0",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                        <Box
                                                            sx={{
                                                                width: 36,
                                                                height: 36,
                                                                borderRadius: "10px",
                                                                bgcolor: "rgba(37, 99, 235, 0.1)",
                                                                color: "#2563EB",
                                                                display: "grid",
                                                                placeItems: "center",
                                                            }}
                                                        >
                                                            <FlightTakeoffRoundedIcon sx={{ fontSize: 18 }} />
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={800} color="#0F172A">
                                                                {f.airline} · {f.flightNumber}
                                                            </Typography>
                                                            <Typography variant="caption" color="#64748B">
                                                                {f.departureAirport} → {f.arrivalAirport}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                    <Chip
                                                        label={f.status || "IN MOTION"}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: "#EFF6FF",
                                                            color: "#2563EB",
                                                            fontWeight: 800,
                                                            fontSize: "0.7rem",
                                                            borderRadius: "6px",
                                                        }}
                                                    />
                                                </Box>
                                            ))}
                                        </Stack>
                                    )}
                                </Paper>
                            </Grid>

                            {/* Stays & Accommodations List */}
                            <Grid item xs={12} md={6}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: "20px",
                                        border: "1px solid #E2E8F0",
                                        bgcolor: "#FFFFFF",
                                        height: "100%",
                                    }}
                                >
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                        <Typography variant="subtitle1" fontWeight={800} color="#0F172A">
                                            Lodging & Stays on Route
                                        </Typography>
                                        <Chip
                                            label={`${filteredHotels.length} Stays`}
                                            size="small"
                                            sx={{ bgcolor: "#ECFDF5", color: "#059669", fontWeight: 750 }}
                                        />
                                    </Stack>

                                    {filteredHotels.length === 0 ? (
                                        <Typography variant="body2" color="#64748B" sx={{ py: 3, textAlign: "center" }}>
                                            No hotel reservations found for this selection. Add hotels under Stays.
                                        </Typography>
                                    ) : (
                                        <Stack spacing={1.5}>
                                            {filteredHotels.map((h) => (
                                                <Box
                                                    key={h.id}
                                                    sx={{
                                                        p: 1.8,
                                                        borderRadius: "14px",
                                                        bgcolor: "#F8FAFC",
                                                        border: "1px solid #E2E8F0",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                        <Box
                                                            sx={{
                                                                width: 36,
                                                                height: 36,
                                                                borderRadius: "10px",
                                                                bgcolor: "rgba(16, 185, 129, 0.1)",
                                                                color: "#10B981",
                                                                display: "grid",
                                                                placeItems: "center",
                                                            }}
                                                        >
                                                            <HotelRoundedIcon sx={{ fontSize: 18 }} />
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={800} color="#0F172A">
                                                                {h.name}
                                                            </Typography>
                                                            <Typography variant="caption" color="#64748B">
                                                                {h.address} · {h.roomType || "Standard"}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                    {h.price && (
                                                        <Typography variant="body2" fontWeight={800} color="#059669">
                                                            ₹{Number(h.price).toLocaleString()}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            ))}
                                        </Stack>
                                    )}
                                </Paper>
                            </Grid>
                        </Grid>
                    </Stack>
                )}
            </Box>
        </DashboardLayout>
    );
}
