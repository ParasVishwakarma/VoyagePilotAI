import { useEffect, useState } from "react";
import {
    Paper,
    Typography,
    Chip,
    Stack,
    Divider,
    CircularProgress,
    Alert,
} from "@mui/material";

import { generateRecommendation } from "../../api/aiApi";

export default function AIInsights({
                                       disruptions = [],
                                   }) {

    const [recommendations, setRecommendations] = useState({});
    const [loading, setLoading] = useState(false);

    const active = disruptions.filter(
        (d) => !d.resolved
    );

    useEffect(() => {
        const activeItems = disruptions.filter((item) => !item.resolved);
        let cancelled = false;

        if (activeItems.length === 0) {
            setRecommendations({});
            setLoading(false);
            return undefined;
        }

        const loadRecommendations = async () => {
            setLoading(true);
            const results = {};

            await Promise.all(
                activeItems.map(async (item) => {
                    try {
                        const response = await generateRecommendation(item.id);
                        results[item.id] =
                            response?.recommendation ??
                            response?.message ??
                            response?.data ??
                            "Recommendation generated.";
                    } catch (error) {
                        console.error(error);
                        results[item.id] = "Unable to generate AI recommendation.";
                    }
                })
            );

            if (!cancelled) {
                setRecommendations(results);
                setLoading(false);
            }
        };

        loadRecommendations();

        return () => {
            cancelled = true;
        };
    }, [disruptions]);

    return (

        <Paper
            elevation={0}
            sx={{
                height: 420,
                p: 3,
                borderRadius: 5,
                border: "1px solid #E7ECEF",
                overflowY: "auto",
            }}
        >

            <Typography
                variant="h6"
                fontWeight={700}
                mb={3}
            >
                AI Insights
            </Typography>

            {

                loading && (

                    <Stack
                        alignItems="center"
                        spacing={2}
                        py={6}
                    >

                        <CircularProgress />

                        <Typography
                            color="text.secondary"
                        >
                            AI is analyzing your disruptions...
                        </Typography>

                    </Stack>

                )

            }

            {

                !loading && active.length === 0 && (

                    <Alert severity="success">
                        🎉 No active disruptions detected.
                    </Alert>

                )

            }

            {

                !loading &&

                active.map((item) => (

                    <Paper
                        key={item.id}
                        elevation={0}
                        sx={{
                            p: 2,
                            mb: 2,
                            borderRadius: 3,
                            bgcolor: "#FAFAFA",
                            border: "1px solid #ECECEC",
                        }}
                    >

                        <Stack spacing={1.5}>

                            <Typography
                                fontWeight={700}
                            >
                                {String(item.type || "Travel disruption").replaceAll("_", " ")}
                            </Typography>

                            <Chip
                                label={item.severity}
                                color={
                                    item.severity === "HIGH"
                                        ? "error"
                                        : item.severity === "MEDIUM"
                                            ? "warning"
                                            : "success"
                                }
                                sx={{
                                    width: "fit-content",
                                }}
                            />

                            <Typography
                                variant="body2"
                            >
                                {item.description}
                            </Typography>

                            <Divider />

                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                            >
                                AI Recommendation
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {
                                    typeof recommendations[item.id] === "string"
                                        ? recommendations[item.id]
                                        : recommendations[item.id]?.text ||
                                          recommendations[item.id]?.recommendation ||
                                          "Generating recommendation..."
                                }
                            </Typography>

                        </Stack>

                    </Paper>

                ))

            }

        </Paper>

    );

}
