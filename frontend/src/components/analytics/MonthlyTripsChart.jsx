import { Paper, Typography } from "@mui/material";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useMemo } from "react";

export default function MonthlyTripsChart({ trips = [] }) {

    const data = useMemo(() => {

        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];

        const counts = new Array(12).fill(0);

        trips.forEach((trip) => {
            if (!trip.startDate) return;

            const month = new Date(trip.startDate).getMonth();

            counts[month]++;
        });

        return months.map((month, index) => ({
            month,
            trips: counts[index],
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
                Monthly Trips
            </Typography>

            <ResponsiveContainer
                width="100%"
                height="90%"
            >

                <BarChart data={data}>

                    <CartesianGrid
                        vertical={false}
                        strokeDasharray="3 3"
                    />

                    <XAxis dataKey="month" />

                    <YAxis allowDecimals={false} />

                    <Tooltip />

                    <Bar
                        dataKey="trips"
                        radius={[8, 8, 0, 0]}
                        fill="#2EAF7D"
                    />

                </BarChart>

            </ResponsiveContainer>

        </Paper>
    );
}
