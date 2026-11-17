import { useState } from "react";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import { createTrip, updateTrip } from "../../api/tripApi";
import { useNotification } from "../../context/NotificationContext";

const emptyForm = {
    title: "",
    destination: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
};

const getInitialForm = (trip) => {
    if (!trip) return emptyForm;
    return {
        title: trip.title || "",
        destination: trip.destination || "",
        description: trip.description || "",
        startDate: trip.startDate || "",
        endDate: trip.endDate || "",
        budget: trip.budget ?? "",
    };
};

export default function TripDialog({ open, onClose, trip, onSuccess }) {
    const [prevTrip, setPrevTrip] = useState(trip);
    const [form, setForm] = useState(() => getInitialForm(trip));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { showNotification } = useNotification();

    if (trip !== prevTrip) {
        setPrevTrip(trip);
        setForm(getInitialForm(trip));
        setError("");
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!form.title.trim() || !form.destination.trim() || !form.startDate || !form.endDate) {
            setError("Please complete the trip title, destination and travel dates.");
            return;
        }
        if (form.endDate < form.startDate) {
            setError("End date cannot be earlier than the start date.");
            return;
        }
        if (form.budget !== "" && Number(form.budget) < 0) {
            setError("Budget cannot be negative.");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                ...form,
                title: form.title.trim(),
                destination: form.destination.trim(),
                description: form.description.trim(),
                budget: form.budget === "" ? "" : Number(form.budget),
            };

            if (trip) {
                await updateTrip(trip.id, payload);
            } else {
                await createTrip(payload);
            }
            onSuccess();
        } catch (err) {
            console.error("Trip save failed:", err);
            const message = err?.response?.data?.message || "Unable to save this trip. Please try again.";
            setError(message);
            showNotification(message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: { borderRadius: { xs: "18px", sm: "22px" }, overflow: "hidden" },
            }}
        >
            <Box sx={{ px: 3, pt: 3, pb: 2, color: "#fff", background: "linear-gradient(120deg, #0F172A 0%, #2563EB 100%)" }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ width: 42, height: 42, borderRadius: "13px", display: "grid", placeItems: "center", background: "rgba(255,255,255,.14)" }}>
                        <FlightTakeoffRoundedIcon />
                    </Box>
                    <Box>
                        <DialogTitle sx={{ p: 0, color: "#fff", fontSize: 20, fontWeight: 850 }}>
                            {trip ? "Edit Your Journey" : "Plan a New Journey"}
                        </DialogTitle>
                        <Typography sx={{ mt: 0.35, color: "rgba(255,255,255,.8)", fontSize: 12.5 }}>
                            Configure dates, destination, and budget for your voyage.
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent sx={{ px: { xs: 2.5, sm: 3 }, py: 3 }}>
                    {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
                    <Stack spacing={2.2}>
                        <TextField
                            label="Trip Title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            fullWidth
                            required
                            placeholder="e.g. European Tech Summit & Leisure"
                        />
                        <TextField
                            label="Destination"
                            name="destination"
                            value={form.destination}
                            onChange={handleChange}
                            fullWidth
                            required
                            placeholder="e.g. Zurich, Switzerland"
                        />
                        <TextField
                            label="Description / Purpose"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            multiline
                            minRows={3}
                            fullWidth
                            placeholder="Meeting agendas, packing reminders, key milestones..."
                        />
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Departure Date"
                                    name="startDate"
                                    type="date"
                                    value={form.startDate}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Return Date"
                                    name="endDate"
                                    type="date"
                                    value={form.endDate}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ min: form.startDate || undefined }}
                                    fullWidth
                                    required
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            label="Estimated Budget (₹)"
                            name="budget"
                            type="number"
                            value={form.budget}
                            onChange={handleChange}
                            fullWidth
                            inputProps={{ min: 0, step: "0.01" }}
                            placeholder="e.g. 150000"
                        />
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
                        {loading ? "Saving..." : trip ? "Save Changes" : "Create Journey"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
