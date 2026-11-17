import { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
    Stack,
    CircularProgress,
} from "@mui/material";

import DashboardLayout from "../../layouts/DashboardLayout";
import RecommendationCard from "../../components/ai/RecommendationCard";
import { generateRecommendation } from "../../api/aiApi";

export default function Assistant() {

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState(null);

    const [form, setForm] = useState({
        disruptionId: "",
        travelerName: "",
        airline: "",
        flightNumber: "",
        departureAirport: "",
        arrivalAirport: "",
        disruptionType: "",
        severity: "",
        itinerary: "",
        budget: "",
        preferences: "",
    });

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

    };

    const handleGenerate = async () => {



        try {

            setLoading(true);

            const response = await generateRecommendation(form);


            setResult(response);

        } catch (err) {

            console.error(err);

            alert("Unable to generate recommendation.");

        } finally {

            setLoading(false);

        }

    };

    return (

        <DashboardLayout>

            <Box p={4}>

                <Typography
                    variant="h4"
                    fontWeight={700}
                    mb={3}
                >
                    AI Recommendation Center
                </Typography>

                <Paper sx={{ p: 4 }}>

                    <Grid container spacing={2}>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Disruption ID"
                                name="disruptionId"
                                value={form.disruptionId}
                                onChange={handleChange}


                                sx={{
                                    mb:3,
                                    "& .MuiOutlinedInput-root":{
                                        borderRadius:"14px"
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Traveler Name"
                                name="travelerName"
                                value={form.travelerName}
                                onChange={handleChange}

                                sx={{
                                    mb:3,
                                    "& .MuiOutlinedInput-root":{
                                        borderRadius:"14px"
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Airline"
                                name="airline"
                                value={form.airline}
                                onChange={handleChange}

                                sx={{
                                    mb:3,
                                    "& .MuiOutlinedInput-root":{
                                        borderRadius:"14px"
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Flight Number"
                                name="flightNumber"
                                value={form.flightNumber}
                                onChange={handleChange}

                                sx={{
                                    mb:3,
                                    "& .MuiOutlinedInput-root":{
                                        borderRadius:"14px"
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Departure Airport"
                                name="departureAirport"
                                value={form.departureAirport}
                                onChange={handleChange}
                                sx={{
                                    mb:3,
                                    "& .MuiOutlinedInput-root":{
                                        borderRadius:"14px"
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Arrival Airport"
                                name="arrivalAirport"
                                value={form.arrivalAirport}
                                onChange={handleChange}
                                sx={{
                                    mb:3,
                                    "& .MuiOutlinedInput-root":{
                                        borderRadius:"14px"
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                label="Disruption Type"
                                name="disruptionType"
                                value={form.disruptionType}
                                onChange={handleChange}
                            >
                                <MenuItem value="DELAY">
                                    Delay
                                </MenuItem>

                                <MenuItem value="CANCELLATION">
                                    Cancellation
                                </MenuItem>

                                <MenuItem value="WEATHER">
                                    Weather
                                </MenuItem>

                                <MenuItem value="TECHNICAL">
                                    Technical
                                </MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                label="Severity"
                                name="severity"
                                value={form.severity}
                                onChange={handleChange}
                            >
                                <MenuItem value="LOW">
                                    LOW
                                </MenuItem>

                                <MenuItem value="MEDIUM">
                                    MEDIUM
                                </MenuItem>

                                <MenuItem value="HIGH">
                                    HIGH
                                </MenuItem>

                                <MenuItem value="CRITICAL">
                                    CRITICAL
                                </MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                multiline
                                rows={4}
                                fullWidth
                                label="Itinerary"
                                name="itinerary"
                                value={form.itinerary}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Budget"
                                name="budget"
                                value={form.budget}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Preferences"
                                name="preferences"
                                value={form.preferences}
                                onChange={handleChange}
                            />
                        </Grid>

                    </Grid>

                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        mt={4}
                    >

                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleGenerate}
                            disabled={loading}
                        >

                            {loading
                                ? <CircularProgress size={24} color="inherit" />
                                : "Generate AI Recommendation"}

                        </Button>

                    </Stack>

                </Paper>

                <RecommendationCard data={result} />

            </Box>

        </DashboardLayout>

    );

}
