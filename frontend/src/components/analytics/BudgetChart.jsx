import { useMemo } from "react";
import { Paper, Typography } from "@mui/material";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

export default function BudgetChart({ trips = [] }) {

    const data = useMemo(() => {

        return trips.map((trip) => ({
            destination: trip.destination,
            budget: Number(trip.budget || 0),
        }));

    }, [trips]);

    return (

        <Paper
            elevation={0}
            sx={{
                height: 420,
                p: 3,
                borderRadius: "20px",
                border: "1px solid #E7ECEF",
            }}
        >

            <Typography
                variant="h6"
                fontWeight={700}
                mb={3}
            >
                Budget by Destination
            </Typography>

            <ResponsiveContainer
                width="100%"
                height="90%"
            >

                <BarChart data={data}>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="destination"
                    />

                    <YAxis />

                    <Tooltip
                        formatter={(value) =>
                            `₹${Number(value).toLocaleString()}`
                        }
                    />

                    <Bar
                        dataKey="budget"
                        fill="#7C3AED"
                        radius={[8, 8, 0, 0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </Paper>

    );
}
