import { Box, Paper, Typography, Stack, Chip } from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";

export default function DashboardPreview() {
    return (
        <Box
            sx={{
                maxWidth: "1280px",
                mx: "auto",
                py: 12,
                px: { xs: 3, md: 6 },
            }}
        >
            <Typography
                align="center"
                sx={{
                    color: "#2EAF7D",
                    fontWeight: 700,
                }}
            >
                PRODUCT PREVIEW
            </Typography>

            <Typography
                variant="h2"
                align="center"
                sx={{
                    fontWeight: 800,
                    color: "#02353C",
                    mt: 2,
                    mb: 8,
                }}
            >
                Everything in One Dashboard
            </Typography>

            <Paper
                elevation={0}
                sx={{
                    borderRadius: "28px",
                    border: "1px solid #E5F3EC",
                    p: 5,
                    background: "#fff",
                    boxShadow: "0 20px 60px rgba(0,0,0,.08)",
                }}
            >
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={3}
                >
                    <Paper sx={{ flex: 1, p: 3,borderRadius: 5, }}>
                        <FlightIcon color="success" />
                        <Typography variant="h5" fontWeight={700} mt={2}>
                            26 Flights
                        </Typography>
                        <Typography color="text.secondary">
                            Active bookings
                        </Typography>
                    </Paper>

                    <Paper sx={{ flex: 1, p: 3, borderRadius: 5, }}>
                        <CloudQueueIcon color="success" />
                        <Typography variant="h5" fontWeight={700} mt={2}>
                            Sunny 28°C
                        </Typography>
                        <Typography color="text.secondary">
                            Destination Weather
                        </Typography>
                    </Paper>

                    <Paper sx={{ flex: 1, p: 3, borderRadius: 5,}}>
                        <SmartToyIcon color="success" />
                        <Typography variant="h5" fontWeight={700} mt={2}>
                            AI Active
                        </Typography>

                        <Chip
                            label="Monitoring"
                            color="success"
                            sx={{ mt: 2 }}
                        />
                    </Paper>
                </Stack>

                <Paper
                    sx={{
                        mt: 5,
                        p: 4,
                        borderRadius: 5,
                        bgcolor: "#F8FFFC",
                    }}
                >
                    <Typography fontWeight={700}>
                        Upcoming Journey
                    </Typography>

                    <Typography mt={2}>
                        Pune ✈ Dubai
                    </Typography>

                    <Typography color="text.secondary">
                        24 July 2026 • Emirates EK-507
                    </Typography>

                    <Chip
                        label="On Time"
                        color="success"
                        sx={{ mt: 3 }}
                    />
                </Paper>
            </Paper>
        </Box>
    );
}
