import { Paper, Typography, Box, LinearProgress } from "@mui/material";
import { useMemo } from "react";

export default function TravelScoreCard({
                                            trips = [],
                                            flights = [],
                                            disruptions = [],
                                        }) {

    const score = useMemo(() => {

        let value = 100;

        value += trips.length * 2;

        const delayed = flights.filter(
            f => f.status === "DELAYED"
        ).length;

        const cancelled = flights.filter(
            f => f.status === "CANCELLED"
        ).length;

        const unresolved = disruptions.filter(
            d => !d.resolved
        ).length;

        value -= delayed * 5;
        value -= cancelled * 10;
        value -= unresolved * 3;

        if (value < 0) value = 0;
        if (value > 100) value = 100;

        return value;

    }, [trips, flights, disruptions]);

    return (

        <Paper
            elevation={0}
            sx={{
                height: 420,
                p: 4,
                borderRadius: "20px",
                border: "1px solid #E7ECEF",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
            }}
        >

            <Typography
                variant="h6"
                fontWeight={700}
            >
                Travel Score
            </Typography>

            <Typography
                variant="h2"
                fontWeight={800}
                color="#2EAF7D"
                mt={4}
            >
                {score}
            </Typography>

            <Typography
                color="#64748B"
                mb={4}
            >
                Calculated from your trips, flights and disruptions
            </Typography>

            <LinearProgress
                variant="determinate"
                value={score}
                sx={{
                    height: 12,
                    borderRadius: 10,
                }}
            />

            <Box mt={5}>

                <Typography>
                    Trips : {trips.length}
                </Typography>

                <Typography>
                    Flights : {flights.length}
                </Typography>

                <Typography>
                    Active Alerts : {
                    disruptions.filter(
                        d => !d.resolved
                    ).length
                }
                </Typography>

            </Box>

        </Paper>

    );
}
