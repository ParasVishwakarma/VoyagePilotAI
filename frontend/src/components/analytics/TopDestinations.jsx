import { useMemo } from "react";
import {
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    Avatar,
} from "@mui/material";

export default function TopDestinations({ trips = [] }) {

    const destinations = useMemo(() => {

        const map = {};

        trips.forEach((trip) => {

            const destination = trip.destination || "Unknown";

            map[destination] = (map[destination] || 0) + 1;

        });

        return Object.entries(map)
            .map(([destination, count]) => ({
                destination,
                count,
            }))
            .sort((a, b) => b.count - a.count);

    }, [trips]);

    return (

        <Paper
            elevation={0}
            sx={{
                height: 420,
                p: 3,
                borderRadius: 5,
                border: "1px solid #E7ECEF",
            }}
        >

            <Typography
                variant="h6"
                fontWeight={700}
                mb={3}
            >
                Top Destinations
            </Typography>

            <List>

                {
                    destinations.length === 0 ? (

                        <Typography color="text.secondary">
                            No destinations available.
                        </Typography>

                    ) : (

                        destinations.map((item, index) => (

                            <ListItem
                                key={item.destination}
                                sx={{
                                    px: 0,
                                }}
                            >

                                <Avatar
                                    sx={{
                                        bgcolor: "#2EAF7D",
                                        mr: 2,
                                    }}
                                >
                                    {index + 1}
                                </Avatar>

                                <ListItemText
                                    primary={item.destination}
                                    secondary={`${item.count} Trip(s)`}
                                />

                            </ListItem>

                        ))

                    )
                }

            </List>

        </Paper>

    );
}
