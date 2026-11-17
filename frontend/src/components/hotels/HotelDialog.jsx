import { useState } from "react";
import {
    Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid, MenuItem, Stack, TextField, Typography,
} from "@mui/material";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import { createHotel, updateHotel } from "../../api/hotelApi";
import { useNotification } from "../../context/NotificationContext";

const initialForm = {
    name: "",
    address: "",
    checkIn: "",
    checkOut: "",
    confirmationCode: "",
    roomType: "Deluxe Suite",
    price: "",
    status: "CONFIRMED",
    notes: "",
};

const localDate = (v) => (v ? String(v).slice(0, 16) : "");

const getInitialHotelForm = (hotel) => {
    if (!hotel) return initialForm;
    return {
        name: hotel.name || "",
        address: hotel.address || "",
        checkIn: localDate(hotel.checkIn),
        checkOut: localDate(hotel.checkOut),
        confirmationCode: hotel.confirmationCode || "",
        roomType: hotel.roomType || "Standard Room",
        price: hotel.price ?? "",
        status: hotel.status || "CONFIRMED",
        notes: hotel.notes || "",
    };
};

export default function HotelDialog({ open, onClose, hotel, tripId, onSuccess }) {
    const [prevHotel, setPrevHotel] = useState(hotel);
    const [form, setForm] = useState(() => getInitialHotelForm(hotel));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { showNotification } = useNotification();

    if (hotel !== prevHotel) {
        setPrevHotel(hotel);
        setForm(getInitialHotelForm(hotel));
        setError("");
    }

    const handleChange = (e) => {
        setForm((old) => ({ ...old, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.name.trim() || !form.address.trim() || !form.checkIn || !form.checkOut) {
            setError("Please complete the hotel name, location, check-in, and check-out.");
            return;
        }

        if (form.checkOut < form.checkIn) {
            setError("Check-out date/time cannot be earlier than check-in.");
            return;
        }

        if (!hotel && !tripId) {
            setError("Select a trip to associate this accommodation with.");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                ...form,
                name: form.name.trim(),
                address: form.address.trim(),
                price: form.price === "" ? null : Number(form.price),
            };

            if (hotel) {
                await updateHotel(hotel.id, payload);
            } else {
                await createHotel(tripId, payload);
            }
            onSuccess();
        } catch (err) {
            console.error("Hotel save failed:", err);
            const msg = err?.response?.data?.message || "Unable to save hotel stay. Please try again.";
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
            <Box sx={{ px: 3, pt: 3, pb: 2, color: "#fff", background: "linear-gradient(120deg, #0F172A 0%, #0284C7 100%)" }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ width: 42, height: 42, borderRadius: "13px", display: "grid", placeItems: "center", bgcolor: "rgba(255,255,255,.14)" }}>
                        <HotelRoundedIcon />
                    </Box>
                    <Box>
                        <DialogTitle sx={{ p: 0, color: "#fff", fontSize: 20, fontWeight: 850 }}>
                            {hotel ? "Edit Accommodation" : "Add Hotel Reservation"}
                        </DialogTitle>
                        <Typography sx={{ mt: 0.35, color: "rgba(255,255,255,.8)", fontSize: 12.5 }}>
                            Track check-in dates, confirmation codes, and accommodation details.
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent sx={{ px: { xs: 2.5, sm: 3 }, py: 3 }}>
                    {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
                    <Stack spacing={2.2}>
                        <TextField
                            label="Hotel or Property Name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            fullWidth
                            required
                            placeholder="e.g. Grand Hyatt / Marriott Downtown"
                        />

                        <TextField
                            label="Address or City Location"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            fullWidth
                            required
                            placeholder="e.g. 100 Ocean Avenue, Miami, FL"
                        />

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Check-in Date & Time"
                                    name="checkIn"
                                    type="datetime-local"
                                    value={form.checkIn}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Check-out Date & Time"
                                    name="checkOut"
                                    type="datetime-local"
                                    value={form.checkOut}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ min: form.checkIn || undefined }}
                                    fullWidth
                                    required
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Room Type"
                                    name="roomType"
                                    value={form.roomType}
                                    onChange={handleChange}
                                    fullWidth
                                    placeholder="e.g. King Deluxe / Executive Suite"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Confirmation Code"
                                    name="confirmationCode"
                                    value={form.confirmationCode}
                                    onChange={handleChange}
                                    fullWidth
                                    placeholder="e.g. HYATT-89421"
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Total Price (₹)"
                                    name="price"
                                    type="number"
                                    value={form.price}
                                    onChange={handleChange}
                                    fullWidth
                                    inputProps={{ min: 0, step: "0.01" }}
                                    placeholder="e.g. 24000"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    select
                                    label="Booking Status"
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    fullWidth
                                >
                                    <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                                    <MenuItem value="PLANNED">Planned / Tentative</MenuItem>
                                    <MenuItem value="CANCELLED">Cancelled</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>

                        <TextField
                            label="Special Notes or Amenities"
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            minRows={2}
                            placeholder="Breakfast included, high floor request, late check-in..."
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
                        sx={{ px: 2.5, py: 1, borderRadius: "10px", textTransform: "none", fontWeight: 750, bgcolor: "#0284C7", "&:hover": { bgcolor: "#0369A1" } }}
                    >
                        {loading ? "Saving..." : hotel ? "Save Changes" : "Confirm Reservation"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
