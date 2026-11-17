import { useEffect, useState } from "react";
import {
    Box, Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography,
} from "@mui/material";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import RadarRoundedIcon from "@mui/icons-material/RadarRounded";
import SectionHeader from "./SectionHeader";
import { getFlightsByTrip } from "../../api/flightApi";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { sounds } from "../../utils/soundEffects";

const statusStyle = (s) => {
    const v = String(s || "").toUpperCase();
    if (v === "CANCELLED") return { color: "#DC2626", bgcolor: "#FEF2F2", dot: "#DC2626" };
    if (v === "DELAYED") return { color: "#D97706", bgcolor: "#FFFBEB", dot: "#F59E0B" };
    if (["BOARDING", "SCHEDULED"].includes(v)) return { color: "#2563EB", bgcolor: "#EFF6FF", dot: "#38BDF8" };
    if (v === "COMPLETED") return { color: "#64748B", bgcolor: "#F1F5F9", dot: "#94A3B8" };
    return { color: "#059669", bgcolor: "#ECFDF5", dot: "#10B981" };
};

const dateLabel = (v) =>
    v ? new Date(v).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";

export default function FlightTable({ tripId, initialFlights = null }) {
    const [flights, setFlights] = useState(initialFlights || []);
    const [loading, setLoading] = useState(!initialFlights && !!tripId);

    useEffect(() => {
        if (initialFlights) {
            setFlights(initialFlights);
            return;
        }

        let active = true;

        const loadFlights = async () => {
            if (!tripId) {
                if (active) {
                    setFlights([]);
                    setLoading(false);
                }
                return;
            }

            try {
                if (active) setLoading(true);
                const r = await getFlightsByTrip(tripId);
                const d = r?.data ?? r;
                if (active) setFlights(Array.isArray(d) ? d : []);
            } catch (e) {
                console.error("Failed to fetch flights:", e);
                if (active) setFlights([]);
            } finally {
                if (active) setLoading(false);
            }
        };

        loadFlights();
        return () => {
            active = false;
        };
    }, [tripId, initialFlights]);

    return (
        <Paper
            elevation={0}
            className="hud-card"
            sx={{
                p: { xs: 2.2, md: 2.8 },
                height: "100%",
                borderRadius: "22px",
                border: "1px solid #E2E8F0",
                bgcolor: "#FFFFFF",
                boxShadow: "0 8px 30px rgba(15,23,42,.04)",
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <SectionHeader title="Autonomous Flight Corridors" subtitle="Live supersonic trajectory & radar telemetry" />
                <Chip
                    icon={<RadarRoundedIcon sx={{ fontSize: "14px !important", color: "#10B981" }} />}
                    label="RADAR ACTIVE"
                    size="small"
                    className="telemetry-code"
                    sx={{ bgcolor: "#ECFDF5", color: "#059669", fontWeight: 800, height: 22 }}
                />
            </Stack>

            {loading ? (
                <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
                    <Loader />
                </Box>
            ) : !flights.length ? (
                <Box sx={{ py: 3 }}>
                    <EmptyState message="No active flight corridors detected. Plan a new journey to initialize tracking." />
                </Box>
            ) : (
                <TableContainer sx={{ mt: 1.5, overflowX: "auto" }}>
                    <Table size="small" sx={{ minWidth: 540 }}>
                        <TableHead>
                            <TableRow sx={{ "& th": { color: "#64748B", fontSize: "0.7rem", fontWeight: 800, letterSpacing: ".5px", textTransform: "uppercase", borderBottom: "1px solid #E2E8F0", py: 1.2 } }}>
                                <TableCell>Flight & Corridor</TableCell>
                                <TableCell>Carrier</TableCell>
                                <TableCell>Departure Vector</TableCell>
                                <TableCell>Arrival Vector</TableCell>
                                <TableCell>Radar Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {flights.slice(0, 6).map((f) => {
                                const style = statusStyle(f.status);
                                return (
                                    <TableRow
                                        key={f.id}
                                        onMouseEnter={() => sounds.playHover()}
                                        sx={{
                                            "& td": { borderBottom: "1px solid #F1F5F9", py: 1.6 },
                                            "&:hover": { bgcolor: "#F8FAFC" },
                                            "&:last-child td": { borderBottom: 0 },
                                            transition: "background-color 0.15s ease",
                                        }}
                                    >
                                        <TableCell>
                                            <Stack direction="row" alignItems="center" spacing={1.2}>
                                                <Box sx={{ width: 34, height: 34, display: "grid", placeItems: "center", borderRadius: "10px", bgcolor: "#ECFDF5", color: "#10B981" }}>
                                                    <FlightTakeoffRoundedIcon sx={{ fontSize: 18 }} />
                                                </Box>
                                                <Box>
                                                    <Typography sx={{ fontSize: 13, color: "#0F172A", fontWeight: 800 }}>
                                                        {f.flightNumber || "VP-AUTO"}
                                                    </Typography>
                                                    <Typography className="telemetry-code" sx={{ fontSize: "0.65rem !important", color: "#64748B" }}>
                                                        CORRIDOR {f.departureAirport || "HND"}➔{f.arrivalAirport || "KIX"}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell sx={{ fontSize: 12.5, fontWeight: 650, color: "#334155" }}>
                                            {f.airline || "Voyage Fleet"}
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontSize: 12.5, fontWeight: 750, color: "#0F172A" }}>{f.departureAirport || "—"}</Typography>
                                            <Typography sx={{ fontSize: 10.5, color: "#94A3B8" }}>{dateLabel(f.departureTime)}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontSize: 12.5, fontWeight: 750, color: "#0F172A" }}>{f.arrivalAirport || "—"}</Typography>
                                            <Typography sx={{ fontSize: 10.5, color: "#94A3B8" }}>{dateLabel(f.arrivalTime)}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={<Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: style.dot, ml: 1 }} />}
                                                label={f.status || "NOMINAL"}
                                                size="small"
                                                sx={{
                                                    height: 24,
                                                    fontSize: "0.72rem",
                                                    fontWeight: 800,
                                                    letterSpacing: ".3px",
                                                    color: style.color,
                                                    bgcolor: style.bgcolor,
                                                    borderRadius: "8px",
                                                    border: `1px solid ${style.color}30`,
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    );
}
