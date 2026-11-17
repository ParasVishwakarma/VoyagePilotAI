import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControl, Grid, IconButton, InputAdornment, MenuItem, Paper, Select,
    Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Typography, useMediaQuery, useTheme,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";

import DashboardLayout from "../../layouts/DashboardLayout";
import Topbar from "../../components/dashboard/Topbar";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { useSearch } from "../../context/SearchContext";
import { useNotification } from "../../context/NotificationContext";
import { getAllHotels, getHotelsByTrip, deleteHotel } from "../../api/hotelApi";
import { getMyTrips } from "../../api/tripApi";
import HotelDialog from "../../components/hotels/HotelDialog";
import { triggerConfetti } from "../../utils/confetti";

const statusStyles = {
    CONFIRMED: { color: "#059669", bgcolor: "#ECFDF5" },
    PLANNED: { color: "#2563EB", bgcolor: "#EFF6FF" },
    CANCELLED: { color: "#DC2626", bgcolor: "#FEF2F2" },
};

const dateLabel = (v) => {
    if (!v) return "—";
    const d = new Date(v);
    return Number.isNaN(d.getTime())
        ? "—"
        : d.toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

function StatusChip({ status }) {
    const style = statusStyles[String(status || "").toUpperCase()] || statusStyles.CONFIRMED;
    return (
        <Chip
            size="small"
            label={status || "CONFIRMED"}
            sx={{
                ...style,
                height: 26,
                borderRadius: "8px",
                fontWeight: 750,
                fontSize: ".7rem",
            }}
        />
    );
}

function SummaryCard({ icon, label, value, helper, accent }) {
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

export default function Hotels() {
    const [tripId, setTripId] = useState("ALL");
    const [trips, setTrips] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [loadingTrips, setLoadingTrips] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [openDialog, setOpenDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);
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
        } catch (e) {
            console.error(e);
            setError("Unable to load journeys.");
        } finally {
            setLoadingTrips(false);
        }
    }, []);

    const loadHotels = useCallback(async (selectedTripId) => {
        try {
            setLoading(true);
            setError("");
            let d;
            if (!selectedTripId || selectedTripId === "ALL") {
                d = await getAllHotels();
            } else {
                d = await getHotelsByTrip(selectedTripId);
            }
            setHotels(Array.isArray(d) ? d : []);
        } catch (e) {
            console.error(e);
            setHotels([]);
            setError("Unable to load accommodations.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTrips();
    }, [loadTrips]);

    useEffect(() => {
        loadHotels(tripId);
    }, [tripId, loadHotels]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return hotels;
        return hotels.filter((h) =>
            [h.name, h.address, h.roomType, h.confirmationCode, h.status, h.tripTitle].some((v) =>
                v?.toLowerCase().includes(q)
            )
        );
    }, [hotels, search]);

    const stats = useMemo(() => {
        const total = hotels.length;
        const confirmed = hotels.filter((h) => String(h.status).toUpperCase() === "CONFIRMED").length;
        const totalCost = hotels.reduce((sum, h) => sum + (Number(h.price) || 0), 0);
        return {
            total,
            confirmed,
            totalCost,
        };
    }, [hotels]);

    const add = () => {
        if (!trips.length) {
            showNotification("Create a journey before adding an accommodation stay.", "warning");
            return;
        }
        setSelectedHotel(null);
        setOpenDialog(true);
    };

    const edit = (h) => {
        setSelectedHotel(h);
        setOpenDialog(true);
    };

    const askDelete = (h) => {
        setSelectedHotel(h);
        setDeleteDialog(true);
    };

    const remove = async () => {
        if (!selectedHotel?.id) return;
        try {
            setDeleting(true);
            await deleteHotel(selectedHotel.id);
            showNotification("Accommodation removed successfully.", "success");
            setDeleteDialog(false);
            setSelectedHotel(null);
            await loadHotels(tripId);
        } catch (e) {
            console.error(e);
            showNotification("Delete failed. Please try again.", "error");
        } finally {
            setDeleting(false);
        }
    };

    const saved = () => {
        setOpenDialog(false);
        loadHotels(tripId);
        triggerConfetti();
        showNotification(selectedHotel ? "Accommodation updated." : "Hotel reservation added.", "success");
    };

    return (
        <DashboardLayout>
            <Topbar />

            <Box sx={{ maxWidth: 1600, mx: "auto", pb: 5 }}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} spacing={2} mb={3.2}>
                    <Box>
                        <Typography sx={{ color: "#0F172A", fontSize: { xs: 24, md: 28 }, fontWeight: 850, letterSpacing: "-.8px" }}>
                            Hotels & Accommodations
                        </Typography>
                        <Typography sx={{ color: "#64748B", mt: 0.5, fontSize: 13 }}>
                            Track reservations, check-in schedules, confirmation codes, and stay expenses.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        onClick={add}
                        startIcon={<AddRoundedIcon />}
                        sx={{ px: 2.5, py: 1.1, borderRadius: "12px", textTransform: "none", fontWeight: 750, bgcolor: "#10B981", boxShadow: "0 6px 18px rgba(16, 185, 129, 0.3)", "&:hover": { bgcolor: "#059669" } }}
                    >
                        Add Stay
                    </Button>
                </Stack>

                {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: "12px" }} onClose={() => setError("")}>{error}</Alert>}

                {/* Filter by Trip */}
                <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, mb: 2.5, border: "1px solid #E2E8F0", borderRadius: "16px", bgcolor: "#FFFFFF" }}>
                    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} spacing={1.5}>
                        <Box>
                            <Typography fontSize={11} fontWeight={800} color="#64748B" letterSpacing=".5px">
                                FILTER BY TRIP
                            </Typography>
                            <Typography fontWeight={800} color="#0F172A" fontSize={15} mt={0.2}>
                                {tripId === "ALL" ? "All Accommodations" : trips.find((t) => String(t.id) === String(tripId))?.title || "Selected Trip"}
                            </Typography>
                        </Box>
                        <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 300 } }}>
                            <Select
                                value={tripId}
                                disabled={loadingTrips}
                                onChange={(e) => {
                                    setTripId(e.target.value);
                                    setSearch("");
                                }}
                                sx={{ borderRadius: "10px", bgcolor: "#F8FAFC" }}
                            >
                                <MenuItem value="ALL">All Journeys (Aggregated)</MenuItem>
                                {trips.map((t) => (
                                    <MenuItem key={t.id} value={String(t.id)}>
                                        {t.title} — {t.destination}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </Paper>

                {/* KPI Cards */}
                <Grid container spacing={2} mb={3}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <SummaryCard icon={<HotelRoundedIcon />} label="Total Reservations" value={stats.total} helper="Across active itineraries" accent="#0284C7" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <SummaryCard icon={<CalendarMonthRoundedIcon />} label="Confirmed Stays" value={stats.confirmed} helper="Booked and guaranteed" accent="#059669" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <SummaryCard icon={<AccountBalanceWalletRoundedIcon />} label="Total Stay Cost" value={`₹${stats.totalCost.toLocaleString("en-IN")}`} helper="Committed room budget" accent="#8B5CF6" />
                    </Grid>
                </Grid>

                {/* Main Table */}
                <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 }, border: "1px solid #E2E8F0", borderRadius: "18px", bgcolor: "#FFFFFF" }}>
                    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} spacing={1.5} mb={2}>
                        <Box>
                            <Typography fontWeight={800} color="#0F172A" fontSize={16}>
                                Accommodation Roster
                            </Typography>
                            <Typography color="#64748B" fontSize={12} mt={0.2}>
                                {filtered.length} {filtered.length === 1 ? "reservation" : "reservations"} shown
                            </Typography>
                        </Box>
                        <TextField
                            size="small"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Filter by hotel, city, code..."
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
                            <EmptyState message="Create a journey first, then add accommodation stays." />
                        </Box>
                    ) : !filtered.length ? (
                        <Box sx={{ py: 4 }}>
                            <EmptyState message={search.trim() ? "No stays match your search." : "No accommodation reservations recorded yet."} />
                            {!search.trim() && (
                                <Stack alignItems="center" mt={2}>
                                    <Button onClick={add} variant="outlined" startIcon={<AddRoundedIcon />} sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px" }}>
                                        Add Your First Stay
                                    </Button>
                                </Stack>
                            )}
                        </Box>
                    ) : mobile ? (
                        <Stack spacing={2}>
                            {filtered.map((h) => (
                                <Paper key={h.id} elevation={0} sx={{ p: 2, border: "1px solid #E2E8F0", borderRadius: "16px" }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                        <Box>
                                            <Typography fontWeight={800} color="#0F172A">{h.name}</Typography>
                                            <Typography variant="body2" color="#64748B">{h.address}</Typography>
                                        </Box>
                                        <StatusChip status={h.status} />
                                    </Stack>
                                    <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
                                        <Box>
                                            <Typography variant="caption" color="#94A3B8">Check-in</Typography>
                                            <Typography variant="body2" fontWeight={650}>{dateLabel(h.checkIn)}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="#94A3B8">Check-out</Typography>
                                            <Typography variant="body2" fontWeight={650}>{dateLabel(h.checkOut)}</Typography>
                                        </Box>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5, pt: 1, borderTop: "1px solid #F1F5F9" }}>
                                        <Typography fontWeight={750} color="#0F172A">{h.price ? `₹${Number(h.price).toLocaleString("en-IN")}` : "—"}</Typography>
                                        <Stack direction="row" spacing={0.5}>
                                            <IconButton size="small" onClick={() => edit(h)} sx={{ color: "#0284C7" }}><EditOutlinedIcon fontSize="small" /></IconButton>
                                            <IconButton size="small" onClick={() => askDelete(h)} sx={{ color: "#DC2626" }}><DeleteOutlineRoundedIcon fontSize="small" /></IconButton>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            ))}
                        </Stack>
                    ) : (
                        <TableContainer sx={{ overflowX: "auto" }}>
                            <Table sx={{ minWidth: 700 }}>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: "#F8FAFC" }}>
                                        {["Property & Location", "Journey", "Check-in", "Check-out", "Confirmation", "Cost", "Status", "Actions"].map((head, i) => (
                                            <TableCell key={head} align={i === 7 ? "center" : "left"} sx={{ py: 1.4, color: "#64748B", fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".5px" }}>
                                                {head}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filtered.map((h) => (
                                        <TableRow key={h.id} hover sx={{ "& td": { borderColor: "#F1F5F9", py: 1.6 }, "&:last-child td": { borderBottom: 0 } }}>
                                            <TableCell>
                                                <Stack direction="row" spacing={1.2} alignItems="center">
                                                    <Box sx={{ width: 34, height: 34, display: "grid", placeItems: "center", borderRadius: "10px", color: "#0284C7", bgcolor: "#E0F2FE" }}>
                                                        <HotelRoundedIcon sx={{ fontSize: 18 }} />
                                                    </Box>
                                                    <Box>
                                                        <Typography fontSize={13} fontWeight={800} color="#0F172A">{h.name}</Typography>
                                                        <Typography fontSize={11} color="#64748B">{h.address}</Typography>
                                                    </Box>
                                                </Stack>
                                            </TableCell>
                                            <TableCell sx={{ fontSize: 12, color: "#475569", fontWeight: 650 }}>{h.tripTitle || "—"}</TableCell>
                                            <TableCell sx={{ fontSize: 12, color: "#334155" }}>{dateLabel(h.checkIn)}</TableCell>
                                            <TableCell sx={{ fontSize: 12, color: "#334155" }}>{dateLabel(h.checkOut)}</TableCell>
                                            <TableCell>
                                                <Typography fontSize={11.5} fontFamily="monospace" fontWeight={700} color="#0F172A">
                                                    {h.confirmationCode || "—"}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ fontSize: 13, fontWeight: 750, color: "#0F172A" }}>
                                                {h.price ? `₹${Number(h.price).toLocaleString("en-IN")}` : "—"}
                                            </TableCell>
                                            <TableCell><StatusChip status={h.status} /></TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" justifyContent="center" spacing={0.5}>
                                                    <IconButton size="small" aria-label="Edit stay" onClick={() => edit(h)} sx={{ color: "#0284C7", bgcolor: "#E0F2FE" }}>
                                                        <EditOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small" aria-label="Delete stay" onClick={() => askDelete(h)} sx={{ color: "#DC2626", bgcolor: "#FEF2F2" }}>
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

                <HotelDialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    hotel={selectedHotel}
                    tripId={tripId === "ALL" ? (trips[0]?.id || "") : tripId}
                    onSuccess={saved}
                />

                <Dialog open={deleteDialog} onClose={() => !deleting && setDeleteDialog(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "18px" } }}>
                    <DialogTitle sx={{ fontWeight: 800, color: "#DC2626" }}>Delete Accommodation?</DialogTitle>
                    <DialogContent>
                        <Typography sx={{ fontSize: 13, color: "#334155" }}>
                            Are you sure you want to remove <b>{selectedHotel?.name}</b> from your itinerary?
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setDeleteDialog(false)} sx={{ fontWeight: 700, color: "#64748B" }}>Cancel</Button>
                        <Button onClick={remove} color="error" variant="contained" disabled={deleting} sx={{ fontWeight: 750, borderRadius: "10px" }}>
                            {deleting ? "Deleting..." : "Delete Stay"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </DashboardLayout>
    );
}
