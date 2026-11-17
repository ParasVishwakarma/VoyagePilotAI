import { useState } from "react";
import {
    Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid, MenuItem, Stack, TextField, Typography,
} from "@mui/material";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import { createFlight, updateFlight } from "../../api/flightApi";
import { useNotification } from "../../context/NotificationContext";

const initialForm = {
    flightNumber: "",
    airline: "",
    departureAirport: "",
    arrivalAirport: "",
    departureTime: "",
    arrivalTime: "",
    status: "ON_TIME",
};

const localDate = (v) => (v ? String(v).slice(0, 16) : "");

const getInitialFlightForm = (flight) => {
    if (!flight) return initialForm;
    return {
        flightNumber: flight.flightNumber || "",
        airline: flight.airline || "",
        departureAirport: flight.departureAirport || "",
        arrivalAirport: flight.arrivalAirport || "",
        departureTime: localDate(flight.departureTime),
        arrivalTime: localDate(flight.arrivalTime),
        status: flight.status || "ON_TIME",
    };
};

export default function FlightDialog({ open, onClose, flight, tripId, onSuccess }) {
    const [prevFlight, setPrevFlight] = useState(flight);
    const [form, setForm] = useState(() => getInitialFlightForm(flight));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { showNotification } = useNotification();

    if (flight !== prevFlight) {
        setPrevFlight(flight);
        setForm(getInitialFlightForm(flight));
        setError("");
    }

    const handleChange = (e) => {
        setForm((old) => ({ ...old, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.flightNumber.trim() || !form.airline.trim() || !form.departureAirport.trim() || !form.arrivalAirport.trim()) {
            setError("Please complete the flight number, airline, and both airports.");
            return;
        }

        if (form.departureTime && form.arrivalTime && form.arrivalTime < form.departureTime) {
            setError("Arrival time cannot be earlier than departure time.");
            return;
        }

        if (!flight && !tripId) {
            setError("Select a trip before creating a flight.");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                ...form,
                flightNumber: form.flightNumber.trim().toUpperCase(),
                airline: form.airline.trim(),
                departureAirport: form.departureAirport.trim().toUpperCase(),
                arrivalAirport: form.arrivalAirport.trim().toUpperCase(),
            };

            if (flight) {
                await updateFlight(flight.id, payload);
            } else {
                await createFlight(tripId, payload);
            }
            onSuccess();
        } catch (err) {
            console.error("Flight save failed:", err);
            const msg = err?.response?.data?.message || "Unable to save flight. Please try again.";
            setError(msg);
            showNotification(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: { xs: "18px", sm: "22px" }, overflow: "hidden" } }}
        >
            <Box sx={{ px: 3, pt: 3, pb: 2, color: "#fff", background: "linear-gradient(120deg, #0F172A 0%, #2563EB 100%)" }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ width: 42, height: 42, borderRadius: "13px", display: "grid", placeItems: "center", bgcolor: "rgba(255,255,255,.14)" }}>
                        <FlightTakeoffRoundedIcon />
                    </Box>
                    <Box>
                        <DialogTitle sx={{ p: 0, color: "#fff", fontSize: 20, fontWeight: 850 }}>
                            {flight ? "Edit Flight Schedule" : "Add Flight Details"}
                        </DialogTitle>
                        <Typography sx={{ mt: 0.35, color: "rgba(255,255,255,.8)", fontSize: 12.5 }}>
                            Track departure schedules, terminals, gates, and statuses.
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent sx={{ px: { xs: 2.5, sm: 3 }, py: 3 }}>
                    {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
                    <Stack spacing={2.2}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Flight Number"
                                    name="flightNumber"
                                    value={form.flightNumber}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="e.g. AI 865 / LH 757"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Airline Carrier"
                                    name="airline"
                                    value={form.airline}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="e.g. Air India / Lufthansa"
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Departure Airport"
                                    name="departureAirport"
                                    value={form.departureAirport}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="e.g. BOM (Mumbai)"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Arrival Airport"
                                    name="arrivalAirport"
                                    value={form.arrivalAirport}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="e.g. FRA (Frankfurt)"
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Departure Date & Time"
                                    name="departureTime"
                                    type="datetime-local"
                                    value={form.departureTime}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Arrival Date & Time"
                                    name="arrivalTime"
                                    type="datetime-local"
                                    value={form.arrivalTime}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ min: form.departureTime || undefined }}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            select
                            label="Flight Status"
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            fullWidth
                        >
                            <MenuItem value="ON_TIME">On Time</MenuItem>
                            <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                            <MenuItem value="BOARDING">Boarding</MenuItem>
                            <MenuItem value="DELAYED">Delayed</MenuItem>
                            <MenuItem value="CANCELLED">Cancelled</MenuItem>
                            <MenuItem value="COMPLETED">Completed</MenuItem>
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, pt: 0, gap: 1 }}>
                    <Button onClick={onClose} disabled={loading} sx={{ px: 2, borderRadius: "10px", color: "#64748B", textTransform: "none", fontWeight: 700 }}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disableElevation
                        disabled={loading}
                        sx={{ px: 2.5, py: 1, borderRadius: "10px", textTransform: "none", fontWeight: 750, bgcolor: "#2563EB", "&:hover": { bgcolor: "#1D4ED8" } }}
                    >
                        {loading ? "Saving..." : flight ? "Save Changes" : "Track Flight"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
