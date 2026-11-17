import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Chip,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Pagination,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
    Tooltip,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import Topbar from "../../components/dashboard/Topbar";
import { formatDate } from "../../utils/date";
import { useSearch } from "../../context/SearchContext";
import { useNotification } from "../../context/NotificationContext";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { getMyTrips, deleteTrip } from "../../api/tripApi";
import TripDialog from "../../components/trips/TripDialog";
import DeleteTripDialog from "../../components/trips/DeleteTripDialog";
import { triggerConfetti } from "../../utils/confetti";

const statusStyles = {
    UPCOMING: { color: "#2563EB", backgroundColor: "#EFF6FF" },
    ONGOING: { color: "#059669", backgroundColor: "#ECFDF5" },
    COMPLETED: { color: "#64748B", backgroundColor: "#F1F5F9" },
    CANCELLED: { color: "#DC2626", backgroundColor: "#FEF2F2" },
};

const formatBudget = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

function StatusChip({ status }) {
    const style = statusStyles[status] || statusStyles.COMPLETED;
    return (
        <Chip
            size="small"
            label={status || "PLANNED"}
            sx={{
                ...style,
                height: 26,
                borderRadius: "8px",
                fontWeight: 750,
                fontSize: "0.7rem",
                letterSpacing: "0.025em",
            }}
        />
    );
}

function SummaryCard({ icon, label, value, helper, accent }) {
    return (
        <Paper
            elevation={0}
            sx={{
                height: "100%",
                p: 2.25,
                border: "1px solid #E2E8F0",
                borderRadius: "18px",
                display: "flex",
                alignItems: "center",
                gap: 1.75,
                background: "#FFFFFF",
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
                    backgroundColor: `${accent}14`,
                    flexShrink: 0,
                }}
            >
                {icon}
            </Box>
            <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ color: "#64748B", fontSize: 12, fontWeight: 650 }}>
                    {label}
                </Typography>
                <Typography sx={{ color: "#0F172A", fontSize: 23, lineHeight: 1.35, fontWeight: 800 }}>
                    {value}
                </Typography>
                <Typography sx={{ color: "#94A3B8", fontSize: 11 }}>
                    {helper}
                </Typography>
            </Box>
        </Paper>
    );
}

function TripMobileCard({ trip, onEdit, onDelete, onNavigateStays, onNavigateMap }) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                border: "1px solid #E2E8F0",
                borderRadius: "16px",
                background: "#FFFFFF",
                mb: 1.5,
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={750} color="#0F172A" noWrap>
                        {trip.title || "Untitled Trip"}
                    </Typography>
                    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.5 }}>
                        <ExploreOutlinedIcon sx={{ fontSize: 15, color: "#64748B" }} />
                        <Typography variant="body2" color="text.secondary" noWrap>
                            {trip.destination || "Destination not set"}
                        </Typography>
                    </Stack>
                </Box>
                <StatusChip status={trip.status} />
            </Stack>
            <Grid container spacing={1.5} sx={{ mt: 1.25 }}>
                <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">Departure</Typography>
                    <Typography variant="body2" fontWeight={650}>{formatDate(trip.startDate)}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">Return</Typography>
                    <Typography variant="body2" fontWeight={650}>{formatDate(trip.endDate)}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="text.secondary">Allocated Budget</Typography>
                    <Typography variant="body2" fontWeight={750} color="#0F172A">{formatBudget(trip.budget)}</Typography>
                </Grid>
            </Grid>
            <Stack direction="row" justifyContent="flex-end" spacing={0.5} sx={{ mt: 1 }}>
                <IconButton size="small" onClick={() => onNavigateStays(trip)} title="Stays" sx={{ color: "#0EA5E9" }}>
                    <HotelRoundedIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => onNavigateMap(trip)} title="View Map" sx={{ color: "#2563EB" }}>
                    <MapRoundedIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => onEdit(trip)} sx={{ color: "#2563EB" }}>
                    <EditOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(trip)} sx={{ color: "#DC2626" }}>
                    <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
            </Stack>
        </Paper>
    );
}

export default function Trips() {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0);

    const { search, setSearch } = useSearch();
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const { showNotification } = useNotification();

    const [openDialog, setOpenDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const triggerRefresh = useCallback(() => {
        setRefreshKey((k) => k + 1);
    }, []);

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                if (active) setLoading(true);
                const data = await getMyTrips(page - 1);
                if (active) {
                    setTrips(Array.isArray(data?.content) ? data.content : []);
                    setTotalPages(Math.max(1, Number(data?.totalPages) || 1));
                }
            } catch (error) {
                console.error("Failed to load trips:", error);
            } finally {
                if (active) setLoading(false);
            }
        };

        load();
        return () => {
            active = false;
        };
    }, [page, refreshKey]);

    const filteredTrips = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) return trips;
        return trips.filter((trip) =>
            [trip.title, trip.destination, trip.status].some((value) => value?.toLowerCase().includes(keyword))
        );
    }, [trips, search]);

    const summary = useMemo(
        () => ({
            total: trips.length,
            upcoming: trips.filter((trip) => trip.status === "UPCOMING" || trip.status === "PLANNED").length,
            ongoing: trips.filter((trip) => trip.status === "ONGOING").length,
            budget: trips.reduce((sum, trip) => sum + Number(trip.budget || 0), 0),
        }),
        [trips]
    );

    const handleAdd = () => {
        setSelectedTrip(null);
        setOpenDialog(true);
    };

    const handleEdit = (trip) => {
        setSelectedTrip(trip);
        setOpenDialog(true);
    };

    const handleDeleteClick = (trip) => {
        setSelectedTrip(trip);
        setDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (!selectedTrip?.id) return;
        try {
            setDeleting(true);
            await deleteTrip(selectedTrip.id);
            showNotification("Trip deleted successfully.", "success");
            setDeleteDialog(false);
            setSelectedTrip(null);
            triggerRefresh();
        } catch (error) {
            console.error("Failed to delete trip:", error);
            showNotification("Failed to delete trip. Please try again.", "error");
        } finally {
            setDeleting(false);
        }
    };

    const handleDialogSuccess = () => {
        setOpenDialog(false);
        triggerRefresh();
        triggerConfetti();
        showNotification(selectedTrip ? "Trip updated successfully." : "Trip created successfully.", "success");
    };

    return (
        <DashboardLayout>
            <Topbar />

            <Box sx={{ maxWidth: 1600, mx: "auto", pb: 5 }}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} spacing={2} sx={{ mb: 3.5 }}>
                    <Box>
                        <Typography sx={{ color: "#0F172A", fontSize: { xs: 24, md: 28 }, fontWeight: 850, letterSpacing: "-.8px" }}>
                            Journey Management
                        </Typography>
                        <Typography sx={{ color: "#64748B", fontSize: 13, mt: 0.5 }}>
                            Plan, organize, and monitor travel itineraries, dates, and committed budgets.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        onClick={handleAdd}
                        startIcon={<AddRoundedIcon />}
                        sx={{ px: 2.5, py: 1.1, borderRadius: "12px", textTransform: "none", fontWeight: 750, bgcolor: "#10B981", boxShadow: "0 6px 18px rgba(16, 185, 129, 0.3)", "&:hover": { bgcolor: "#059669" } }}
                    >
                        Create Journey
                    </Button>
                </Stack>

                {/* Summary Metrics */}
                <Grid container spacing={2.2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <SummaryCard icon={<FlightTakeoffRoundedIcon />} label="Total Journeys" value={summary.total} helper="Listed on this page" accent="#2563EB" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <SummaryCard icon={<CalendarMonthRoundedIcon />} label="Upcoming" value={summary.upcoming} helper="Planned adventures" accent="#8B5CF6" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <SummaryCard icon={<ExploreOutlinedIcon />} label="Ongoing" value={summary.ongoing} helper="Currently underway" accent="#059669" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                        <SummaryCard icon={<AccountBalanceWalletOutlinedIcon />} label="Committed Budget" value={formatBudget(summary.budget)} helper="Current page allocation" accent="#D97706" />
                    </Grid>
                </Grid>

                {/* Main Table Card */}
                <Paper elevation={0} sx={{ border: "1px solid #E2E8F0", borderRadius: "18px", overflow: "hidden", background: "#FFFFFF" }}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems={{ xs: "stretch", sm: "center" }}
                        justifyContent="space-between"
                        spacing={1.5}
                        sx={{ p: { xs: 2, md: 2.5 }, borderBottom: "1px solid #E2E8F0" }}
                    >
                        <Box>
                            <Typography fontWeight={800} color="#0F172A" fontSize={16}>Your Travel Portfolio</Typography>
                            <Typography color="#64748B" fontSize={12} sx={{ mt: 0.2 }}>
                                {filteredTrips.length} {filteredTrips.length === 1 ? "journey" : "journeys"} shown
                            </Typography>
                        </Box>
                        <TextField
                            size="small"
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setPage(1);
                            }}
                            placeholder="Filter by title or destination..."
                            sx={{
                                width: { xs: "100%", sm: 290 },
                                "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#F8FAFC" },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchRoundedIcon sx={{ color: "#94A3B8", fontSize: 18 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Stack>

                    {loading ? (
                        <Box sx={{ py: 7, display: "flex", justifyContent: "center" }}>
                            <Loader />
                        </Box>
                    ) : filteredTrips.length === 0 ? (
                        <Box sx={{ py: 5, px: 2 }}>
                            <EmptyState message={search.trim() ? "No journeys match your search filter." : "No journeys created yet."} />
                            {!search.trim() && (
                                <Stack alignItems="center" sx={{ mt: 2 }}>
                                    <Button onClick={handleAdd} variant="outlined" startIcon={<AddRoundedIcon />} sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px" }}>
                                        Create your first journey
                                    </Button>
                                </Stack>
                            )}
                        </Box>
                    ) : isMobile ? (
                        <Stack spacing={1.5} sx={{ p: 2 }}>
                            {filteredTrips.map((trip) => (
                                <TripMobileCard
                                    key={trip.id}
                                    trip={trip}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteClick}
                                    onNavigateStays={() => navigate("/hotels")}
                                    onNavigateMap={() => navigate("/map")}
                                />
                            ))}
                        </Stack>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
                                        {["Journey", "Destination", "Start Date", "End Date", "Budget", "Status", "Actions"].map((heading, index) => (
                                            <TableCell
                                                key={heading}
                                                align={index === 6 ? "center" : "left"}
                                                sx={{ py: 1.5, px: index === 0 ? 3 : 2, color: "#64748B", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".5px", whiteSpace: "nowrap" }}
                                            >
                                                {heading}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredTrips.map((trip) => (
                                        <TableRow key={trip.id} hover sx={{ "& td": { borderColor: "#F1F5F9", py: 1.8 }, "&:last-child td": { borderBottom: 0 } }}>
                                            <TableCell sx={{ px: 3, minWidth: 170 }}>
                                                <Typography fontWeight={750} color="#0F172A">{trip.title || "Untitled journey"}</Typography>
                                                {trip.description && (
                                                    <Typography color="text.secondary" variant="caption" sx={{ display: "block", maxWidth: 220 }} noWrap>
                                                        {trip.description}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell sx={{ minWidth: 150 }}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <ExploreOutlinedIcon sx={{ color: "#2563EB", fontSize: 18 }} />
                                                    <Typography fontWeight={650} color="#334155">{trip.destination || "—"}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell sx={{ color: "#475569", whiteSpace: "nowrap", fontSize: 12.5 }}>{formatDate(trip.startDate)}</TableCell>
                                            <TableCell sx={{ color: "#475569", whiteSpace: "nowrap", fontSize: 12.5 }}>{formatDate(trip.endDate)}</TableCell>
                                            <TableCell sx={{ color: "#0F172A", fontWeight: 750, whiteSpace: "nowrap", fontSize: 13 }}>{formatBudget(trip.budget)}</TableCell>
                                            <TableCell><StatusChip status={trip.status} /></TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" justifyContent="center" spacing={0.6}>
                                                    <Tooltip title="View Stays">
                                                        <IconButton size="small" onClick={() => navigate("/hotels")} sx={{ color: "#0284C7", bgcolor: "#E0F2FE" }}>
                                                            <HotelRoundedIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="View on Map">
                                                        <IconButton size="small" onClick={() => navigate("/map")} sx={{ color: "#2563EB", bgcolor: "#EFF6FF" }}>
                                                            <MapRoundedIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Edit Journey">
                                                        <IconButton size="small" onClick={() => handleEdit(trip)} sx={{ color: "#2563EB", bgcolor: "#EFF6FF" }}>
                                                            <EditOutlinedIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Journey">
                                                        <IconButton size="small" onClick={() => handleDeleteClick(trip)} sx={{ color: "#DC2626", bgcolor: "#FEF2F2" }}>
                                                            <DeleteOutlineRoundedIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {totalPages > 1 && (
                        <Stack alignItems="center" sx={{ py: 2.25, borderTop: "1px solid #E2E8F0" }}>
                            <Pagination page={page} count={totalPages} onChange={(_, value) => setPage(value)} color="primary" shape="rounded" />
                        </Stack>
                    )}
                </Paper>

                <TripDialog open={openDialog} onClose={() => setOpenDialog(false)} trip={selectedTrip} onSuccess={handleDialogSuccess} />
                <DeleteTripDialog open={deleteDialog} trip={selectedTrip} onClose={() => !deleting && setDeleteDialog(false)} onConfirm={confirmDelete} loading={deleting} />
            </Box>
        </DashboardLayout>
    );
}
