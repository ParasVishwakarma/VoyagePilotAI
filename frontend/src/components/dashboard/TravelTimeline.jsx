import { Box, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import FlightLandRoundedIcon from "@mui/icons-material/FlightLandRounded";
import SectionHeader from "./SectionHeader";

const badgeStyle = (status) => {
    const value = String(status || "").toUpperCase();
    if (value === "DELAYED") return { color: "#B7791F", bgcolor: "#FFF7E8" };
    if (value === "CANCELLED") return { color: "#C2414B", bgcolor: "#FFF0F1" };
    if (value === "BOARDING") return { color: "#3267C8", bgcolor: "#EDF4FF" };
    return { color: "#168568", bgcolor: "#EAF8F3" };
};

export default function TravelTimeline({ flights = [] }) {
    const timeline = [];
    flights.forEach((flight) => {
        if (flight.departureTime) timeline.push({
            date: new Date(flight.departureTime), time: new Date(flight.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            title: `Flight ${flight.flightNumber || ""} departure`, subtitle: `${flight.departureAirport || "—"} → ${flight.arrivalAirport || "—"}`,
            status: flight.status || "SCHEDULED", type: "departure",
        });
        if (flight.arrivalTime) timeline.push({
            date: new Date(flight.arrivalTime), time: new Date(flight.arrivalTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            title: `Arrival · ${flight.flightNumber || "Flight"}`, subtitle: flight.arrivalAirport || "Arrival airport",
            status: "ARRIVAL", type: "arrival",
        });
    });
    timeline.sort((a, b) => a.date - b.date);

    return (
        <Paper elevation={0} sx={{ p: { xs: 2, md: 2.6 }, height: "100%", borderRadius: "16px", border: "1px solid #E9EDF4", bgcolor: "#fff", boxShadow: "0 5px 18px rgba(24,39,75,.035)" }}>
            <SectionHeader title="Journey timeline" subtitle="Your upcoming travel events" />
            {timeline.length === 0 ? (
                <Box sx={{ py: 4, textAlign: "center" }}>
                    <ScheduleRoundedIcon sx={{ fontSize: 30, color: "#B5C0D0", mb: 1 }} />
                    <Typography sx={{ color: "#7F8BA0", fontSize: 12 }}>No travel schedule available yet.</Typography>
                </Box>
            ) : (
                <Box sx={{ mt: 1.5 }}>
                    {timeline.map((item, index) => {
                        const style = badgeStyle(item.status);
                        return (
                            <Box key={`${item.title}-${index}`}>
                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ py: 1.6 }}>
                                    <Box sx={{ width: 42, height: 42, flex: "0 0 42px", display: "grid", placeItems: "center", borderRadius: "12px", bgcolor: item.type === "departure" ? "#EDF3FF" : "#EAF8F3", color: item.type === "departure" ? "#477BFF" : "#169B79" }}>
                                        {item.type === "departure" ? <FlightTakeoffRoundedIcon fontSize="small" /> : <FlightLandRoundedIcon fontSize="small" />}
                                    </Box>
                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                        <Typography sx={{ fontSize: 12, fontWeight: 750, color: "#26344D" }}>{item.title}</Typography>
                                        <Typography sx={{ fontSize: 10.5, color: "#8A96A8", mt: .35 }}>{item.subtitle}</Typography>
                                    </Box>
                                    <Stack alignItems="flex-end" spacing={.6}>
                                        <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#53627A" }}>{item.time}</Typography>
                                        <Chip label={item.status} size="small" sx={{ height: 19, fontSize: 8.5, fontWeight: 800, color: style.color, bgcolor: style.bgcolor }} />
                                    </Stack>
                                </Stack>
                                {index !== timeline.length - 1 && <Divider sx={{ borderColor: "#F0F2F6" }} />}
                            </Box>
                        );
                    })}
                </Box>
            )}
        </Paper>
    );
}
