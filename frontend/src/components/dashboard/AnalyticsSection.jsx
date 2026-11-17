import { Grid } from "@mui/material";

import AnalyticsCard from "../analytics/AnalyticsCard.jsx";
import MonthlyTripsChart from "../analytics/MonthlyTripsChart.jsx";
import FlightStatusChart from "../analytics/FlightStatusChart.jsx";
import BudgetChart from "../analytics/BudgetChart.jsx";

export default function AnalyticsSection({ trips, flights }) {
    return (
        <Grid container spacing={3} sx={{ mt: 1 }}>

            <Grid size={{ xs: 12, md: 3 }}>
                <AnalyticsCard
                    title="Total Trips"
                    value={trips.length}
                    color="#2EAF7D"
                />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
                <AnalyticsCard
                    title="Flights"
                    value={flights.length}
                    color="#3F8EF7"
                />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
                <AnalyticsCard
                    title="Completed Trips"
                    value={
                        trips.filter(
                            (trip) => trip.status === "COMPLETED"
                        ).length
                    }
                    color="#8B5CF6"
                />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
                <AnalyticsCard
                    title="Planned Trips"
                    value={
                        trips.filter(
                            (trip) => trip.status === "PLANNED"
                        ).length
                    }
                    color="#F59E0B"
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <MonthlyTripsChart trips={trips} />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
                <FlightStatusChart flights={flights} />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
                <BudgetChart trips={trips} />
            </Grid>

        </Grid>
    );
}
