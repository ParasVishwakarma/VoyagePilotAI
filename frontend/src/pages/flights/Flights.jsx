import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert, Box, Button, Chip, FormControl, Grid, IconButton, InputAdornment,
    MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TextField, Typography, useMediaQuery, useTheme,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import FlightLandRoundedIcon from "@mui/icons-material/FlightLandRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import AirplanemodeActiveRoundedIcon from "@mui/icons-material/AirplanemodeActiveRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import DashboardLayout from "../../layouts/DashboardLayout";
import Topbar from "../../components/dashboard/Topbar";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { useSearch } from "../../context/SearchContext";
import { useNotification } from "../../context/NotificationContext";
import { getFlightsByTrip, deleteFlight } from "../../api/flightApi";
import { getMyTrips } from "../../api/tripApi";
import FlightDialog from "../../components/flights/FlightDialog";
import DeleteFlightDialog from "../../components/flights/DeleteFlightDialog";
import FlightStatusChart from "../../components/analytics/FlightStatusChart";
import { triggerConfetti } from "../../utils/confetti";

const styles = {
    ON_TIME: ["#059669", "#ECFDF5"],
    SCHEDULED: ["#2563EB", "#EFF6FF"],
    BOARDING: ["#0284C7", "#E0F2FE"],
    DELAYED: ["#D97706", "#FFFBEB"],
    CANCELLED: ["#DC2626", "#FEF2F2"],
    COMPLETED: ["#64748B", "#F1F5F9"],
};

const statusColor = (s) => styles[String(s || "").toUpperCase()] || styles.SCHEDULED;

const dateLabel = (v) => {
    if (!v) return "—";
    const d = new Date(v);
    return Number.isNaN(d.getTime())
        ? "—"
        : d.toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

function StatusChip({ value }) {
    const [color, bg] = statusColor(value);
    return (
        <Chip
            size="small"
            label={value || "UNKNOWN"}
            sx={{ color, bgcolor: bg, height: 26, borderRadius: "8px", fontWeight: 750, fontSize: ".7rem" }}
        />
    );
}

function Summary({ icon, label, value, helper, accent }) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.2,
                border: "1px solid #E2E8F0",
                borderRadius: "18px",
                display: "flex",
                alignItems: "center",
                gap: 1.8,
                height: "100%",
                bgcolor: "#FFFFFF",
                boxShadow: "0 4px 18px rgba(15,23,42,.03)",
            }}
        >
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "14px",
                    display: "grid",
                    placeItems: "center",
                    color: accent,
                    bgcolor: `${accent}14`,
                    flexShrink: 0,
                }}
            >
                {icon}
            </Box>
            <Box>
                <Typography color="#64748B" fontSize={12} fontWeight={650}>
                    {label}
                </Typography>
                <Typography color="#0F172A" fontSize={24} fontWeight={800}>
                    {value}
                </Typography>
                <Typography color="#94A3B8" fontSize={11}>
                    {helper}
                </Typography>
            </Box>
        </Paper>
    );
}

function MobileFlight({ flight, onEdit, onDelete }) {
    return (
        <Paper elevation={0} sx={{ p: 2, border: "1px solid #E2E8F0", borderRadius: "16px", mb: 1.5 }}>
            <Stack direction="row" justifyContent="space-between" spacing={1}>
                <Stack direction="row" spacing={1.2} alignItems="center">
                    <Box sx={{ width: 38, height: 38, borderRadius: 3, display: "grid", placeItems: "center", bgcolor: "#EFF6FF", color: "#2563EB" }}>
                        <FlightTakeoffRoundedIcon sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                        <Typography fontWeight={800} color="#0F172A">
                            {flight.flightNumber || "Flight"}
                        </Typography>
                        <Typography variant="body2" color="#64748B">
                            {flight.airline || "Airline not set"}
                        </Typography>
                    </Box>
                </Stack>
                <StatusChip value={flight.status} />
            </Stack>

            <Grid container spacing={1.5} sx={{ mt: 1.5 }}>
                <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="#94A3B8">Departure</Typography>
                    <Typography fontWeight={750} color="#0F172A">{flight.departureAirport || "—"}</Typography>
                    <Typography variant="caption" color="#64748B">{dateLabel(flight.departureTime)}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="#94A3B8">Arrival</Typography>
                    <Typography fontWeight={750} color="#0F172A">{flight.arrivalAirport || "—"}</Typography>
                    <Typography variant="caption" color="#64748B">{dateLabel(flight.arrivalTime)}</Typography>
                </Grid>
            </Grid>

            <Stack direction="row" justifyContent="flex-end" spacing={0.5} sx={{ mt: 1 }}>
                <IconButton size="small" onClick={() => onEdit(flight)} aria-label="Edit flight" sx={{ color: "#2563EB" }}>
                    <EditOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(flight)} aria-label="Delete flight" sx={{ color: "#DC2626" }}>
                    <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
            </Stack>
        </Paper>
    );
}

export default function Flights() {
    const [tripId, setTripId] = useState("");
    const [trips, setTrips] = useState([]);
    const [flights, setFlights] = useState([]);
    const [loadingTrips, setLoadingTrips] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [openDialog, setOpenDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const { showNotification } = useNotification();
    const { search, setSearch } = useSearch();
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down("md"));

    const loadTrips = useCallback(async () => {
        try {
            setLoadingTrips(true);
            const r = await getMyTrips(0, 100);
            const d = r?.data ?? r;
            const list = Array.isArray(d?.content) ? d.content : Array.isArray(d) ? d : [];
            setTrips(list);
            setTripId((old) => (old && list.some((t) => String(t.id) === String(old)) ? old : list.length ? String(list[0].id) : ""));
        } catch (e) {
            console.error(e);
            setError("Unable to load your trips. Please refresh and try again.");
        } finally {
            setLoadingTrips(false);
        }
    }, []);

    const loadFlights = useCallback(async (currentTripId) => {
        const idToLoad = currentTripId !== undefined ? currentTripId : tripId;
        if (!idToLoad) {
            setFlights([]);
            return;
        }
        try {
            setLoading(true);
            setError("");
            const r = await getFlightsByTrip(idToLoad);
            const d = r?.data ?? r;
            setFlights(Array.isArray(d) ? d : []);
        } catch (e) {
            console.error(e);
            setFlights([]);
            setError("Unable to load flights for this trip. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [tripId]);

    useEffect(() => {
        loadTrips();
    }, [loadTrips]);

    useEffect(() => {
        if (tripId) {
            loadFlights(tripId);
        }
    }, [tripId, loadFlights]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return q
            ? flights.filter((f) =>
                  [f.flightNumber, f.airline, f.departureAirport, f.arrivalAirport, f.status].some((v) =>
                      v?.toLowerCase().includes(q)
                  )
              )
            : flights;
    }, [flights, search]);

    const stats = useMemo(
        () => ({
            total: flights.length,
            onTime: flights.filter((f) => ["ON_TIME", "SCHEDULED", "BOARDING"].includes(String(f.status || "").toUpperCase())).length,
            delayed: flights.filter((f) => String(f.status).toUpperCase() === "DELAYED").length,
            cancelled: flights.filter((f) => String(f.status).toUpperCase() === "CANCELLED").length,
        }),
        [flights]
    );

    const selectedTrip = trips.find((t) => String(t.id) === String(tripId));

    const add = () => {
        if (!tripId) {
            showNotification("Create a trip before adding a flight.", "warning");
            return;
        }
        setSelectedFlight(null);
        setOpenDialog(true);
    };

    const edit = (f) => {
        setSelectedFlight(f);
        setOpenDialog(true);
    };

    const askDelete = (f) => {
        setSelectedFlight(f);
        setDeleteDialog(true);
    };

    const remove = async () => {
        if (!selectedFlight?.id) return;
        try {
            setDeleting(true);
            await deleteFlight(selectedFlight.id);
            showNotification("Flight deleted successfully.", "success");
            setDeleteDialog(false);
            setSelectedFlight(null);
            await loadFlights();
        } catch (e) {
            console.error(e);
            showNotification("Delete failed. Please try again.", "error");
        } finally {
            setDeleting(false);
        }
    };

    const saved = () => {
        setOpenDialog(false);
        loadFlights();
        triggerConfetti();
        showNotification(selectedFlight ? "Flight updated successfully." : "Flight created successfully.", "success");
    };

    return (
        <DashboardLayout>
            <Topbar />

            <Box sx={{ maxWidth: 1600, mx: "auto", pb: 5 }}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} spacing={2} mb={3.2}>
                    <Box>
                        <Typography sx={{ color: "#0F172A", fontSize: { xs: 24, md: 28 }, fontWeight: 850, letterSpacing: "-.8px" }}>
                            Flight Schedule & Tracking
                        </Typography>
                        <Typography sx={{ color: "#64748B", mt: 0.5, fontSize: 13 }}>
                            Real-time flight schedule management, airport terminals, and status alerts.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        onClick={add}
                        startIcon={<AddRoundedIcon />}
                        sx={{ px: 2.5, py: 1.1, borderRadius: "12px", textTransform: "none", fontWeight: 750, bgcolor: "#10B981", boxShadow: "0 6px 18px rgba(16, 185, 129, 0.3)", "&:hover": { bgcolor: "#059669" } }}
                    >
                        Add Flight
                    </Button>
                </Stack>

                {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: "12px" }} onClose={() => setError("")}>{error}</Alert>}

                {/* Trip Selector Bar */}
                <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, mb: 2.5, border: "1px solid #E2E8F0", borderRadius: "16px", bgcolor: "#FFFFFF" }}>
                    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} spacing={1.5}>
                        <Box>
                            <Typography fontSize={11} fontWeight={800} color="#64748B" letterSpacing=".5px">
                                CURRENT TRIP ITINERARY
                            </Typography>
                            <Typography fontWeight={800} color="#0F172A" fontSize={15} mt={0.2}>
                                {selectedTrip?.title ? `${selectedTrip.title} (${selectedTrip.destination})` : loadingTrips ? "Loading trips..." : "Select a trip to view flights"}
                            </Typography>
                        </Box>
                        <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 300 } }}>
                            <Select
                                value={tripId}
                                displayEmpty
                                disabled={loadingTrips || !trips.length}
                                onChange={(e) => {
                                    setTripId(e.target.value);
                                    setSearch("");
                                }}
                                sx={{ borderRadius: "10px", bgcolor: "#F8FAFC" }}
                            >
                                {!trips.length && <MenuItem value="">No trips available</MenuItem>}
                                {trips.map((t) => (
                                    <MenuItem key={t.id} value={String(t.id)}>
                                        {t.title} — {t.destination}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </Paper>

                {/* KPI Metrics */}
                <Grid container spacing={2} mb={3}>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <Summary icon={<AirplanemodeActiveRoundedIcon />} label="Total Flights" value={stats.total} helper="Under selected trip" accent="#2563EB" />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <Summary icon={<FlightTakeoffRoundedIcon />} label="On Schedule" value={stats.onTime} helper="On-time or scheduled" accent="#059669" />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <Summary icon={<ScheduleRoundedIcon />} label="Delayed" value={stats.delayed} helper="Requires attention" accent="#D97706" />
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <Summary icon={<FlightLandRoundedIcon />} label="Cancelled" value={stats.cancelled} helper="Rebooking eligible" accent="#DC2626" />
                    </Grid>
                </Grid>

                {/* Table & Chart View */}
                <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <Paper elevation={0} sx={{ height: "100%", p: { xs: 2, md: 2.5 }, border: "1px solid #E2E8F0", borderRadius: "18px", bgcolor: "#FFFFFF" }}>
                            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} spacing={1.5} mb={2}>
                                <Box>
                                    <Typography fontWeight={800} color="#0F172A" fontSize={16}>
                                        Flight Roster
                                    </Typography>
                                    <Typography color="#64748B" fontSize={12} mt={0.2}>
                                        {filtered.length} {filtered.length === 1 ? "flight" : "flights"} shown
                                    </Typography>
                                </Box>
                                <TextField
                                    size="small"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Filter by flight #, airline, airport..."
                                    sx={{ width: { xs: "100%", sm: 280 }, "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#F8FAFC" } }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchRoundedIcon sx={{ color: "#94A3B8", fontSize: 18 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Stack>

                            {loading || loadingTrips ? (
                                <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
                                    <Loader />
                                </Box>
                            ) : !trips.length ? (
                                <Box sx={{ py: 4 }}>
                                    <EmptyState message="Create a journey first, then add flight tickets to it." />
                                </Box>
                            ) : !filtered.length ? (
                                <Box sx={{ py: 4 }}>
                                    <EmptyState message={search.trim() ? "No flights match your search query." : "No flights recorded for this journey yet."} />
                                    {!search.trim() && (
                                        <Stack alignItems="center" mt={2}>
                                            <Button onClick={add} variant="outlined" startIcon={<AddRoundedIcon />} sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px" }}>
                                                Add First Flight
                                            </Button>
                                        </Stack>
                                    )}
                                </Box>
                            ) : mobile ? (
                                <Box>{filtered.map((f) => <MobileFlight key={f.id} flight={f} onEdit={edit} onDelete={askDelete} />)}</Box>
                            ) : (
                                <TableContainer sx={{ overflowX: "auto" }}>
                                    <Table sx={{ minWidth: 640 }}>
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: "#F8FAFC" }}>
                                                {["Flight", "Airline", "Departure", "Arrival", "Status", "Actions"].map((h, i) => (
                                                    <TableCell key={h} align={i === 5 ? "center" : "left"} sx={{ py: 1.4, color: "#64748B", fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".5px" }}>
                                                        {h}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filtered.map((f) => (
                                                <TableRow key={f.id} hover sx={{ "& td": { borderColor: "#F1F5F9", py: 1.6 }, "&:last-child td": { borderBottom: 0 } }}>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Box sx={{ width: 34, height: 34, display: "grid", placeItems: "center", borderRadius: "10px", color: "#2563EB", bgcolor: "#EFF6FF" }}>
                                                                <FlightTakeoffRoundedIcon sx={{ fontSize: 18 }} />
                                                            </Box>
                                                            <Typography fontSize={13} fontWeight={800} color="#0F172A">
                                                                {f.flightNumber || "—"}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: 12.5, color: "#475569", fontWeight: 600 }}>{f.airline || "—"}</TableCell>
                                                    <TableCell>
                                                        <Typography fontSize={12.5} fontWeight={750} color="#0F172A">{f.departureAirport || "—"}</Typography>
                                                        <Typography fontSize={10.5} color="#94A3B8">{dateLabel(f.departureTime)}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography fontSize={12.5} fontWeight={750} color="#0F172A">{f.arrivalAirport || "—"}</Typography>
                                                        <Typography fontSize={10.5} color="#94A3B8">{dateLabel(f.arrivalTime)}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusChip value={f.status} />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Stack direction="row" justifyContent="center" spacing={0.5}>
                                                            <IconButton size="small" aria-label="Edit flight" onClick={() => edit(f)} sx={{ color: "#2563EB", bgcolor: "#EFF6FF" }}>
                                                                <EditOutlinedIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton size="small" aria-label="Delete flight" onClick={() => askDelete(f)} sx={{ color: "#DC2626", bgcolor: "#FEF2F2" }}>
                                                                <DeleteOutlineRoundedIcon fontSize="small" />
                                                            </IconButton>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 4 }}>
                        <FlightStatusChart flights={flights} />
                    </Grid>
                </Grid>

                <FlightDialog open={openDialog} onClose={() => setOpenDialog(false)} flight={selectedFlight} tripId={tripId} onSuccess={saved} />
                <DeleteFlightDialog open={deleteDialog} flight={selectedFlight} onClose={() => !deleting && setDeleteDialog(false)} onConfirm={remove} loading={deleting} />
            </Box>
        </DashboardLayout>
    );
}
