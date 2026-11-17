import {
    Card,
    CardContent,
    Typography,
    Chip,
    Stack,
    Divider,
    Grid,
    Alert,
} from "@mui/material";

export default function RecommendationCard({
                                               disruption,
                                               data,
                                           }) {

    if (!disruption) return null;

    const recommendation =
        data?.recommendation ||
        data?.action ||
        data?.message ||
        "No recommendation available.";

    return (

        <Card
            elevation={0}
            sx={{
                mb: 3,
                borderRadius: 5,
                border: "1px solid #E5E7EB",
            }}
        >

            <CardContent>

                <Typography
                    variant="h5"
                    fontWeight={700}
                    mb={3}
                >
                    🤖 AI Recommendation
                </Typography>

                <Grid
                    container
                    spacing={3}
                >

                    <Grid
                        size={{ xs: 12, md: 6 }}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Disruption Type
                        </Typography>

                        <Typography
                            fontWeight={700}
                        >
                            {String(disruption.type || "Travel disruption").replaceAll("_", " ")}
                        </Typography>

                    </Grid>

                    <Grid
                        size={{ xs: 12, md: 6 }}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Severity
                        </Typography>

                        <br />

                        <Chip
                            label={disruption.severity}
                            color={
                                disruption.severity === "HIGH"
                                    ? "error"
                                    : disruption.severity === "MEDIUM"
                                        ? "warning"
                                        : "success"
                            }
                        />

                    </Grid>

                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                >
                    Description
                </Typography>

                <Typography mb={3}>
                    {disruption.description || "No additional description provided."}
                </Typography>

                <Alert
                    severity="info"
                    sx={{
                        mb: 3,
                    }}
                >
                    {recommendation}
                </Alert>

                {
                    data && (

                        <>

                            <Divider sx={{ mb: 3 }} />

                            <Typography
                                variant="h6"
                                mb={2}
                            >
                                AI Decision
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={2}
                                flexWrap="wrap"
                                useFlexGap
                            >

                                {
                                    data.refund !== undefined && (

                                        <Chip
                                            label={
                                                data.refund
                                                    ? "Refund Available"
                                                    : "Refund Not Available"
                                            }
                                            color={
                                                data.refund
                                                    ? "success"
                                                    : "default"
                                            }
                                        />

                                    )
                                }

                                {
                                    data.hotelExtension !== undefined && (

                                        <Chip
                                            label={
                                                data.hotelExtension
                                                    ? "Hotel Extension"
                                                    : "No Hotel Extension"
                                            }
                                            color={
                                                data.hotelExtension
                                                    ? "warning"
                                                    : "default"
                                            }
                                        />

                                    )
                                }

                                {
                                    data.itineraryUpdate !== undefined && (

                                        <Chip
                                            label={
                                                data.itineraryUpdate
                                                    ? "Itinerary Updated"
                                                    : "No Itinerary Update"
                                            }
                                            color={
                                                data.itineraryUpdate
                                                    ? "primary"
                                                    : "default"
                                            }
                                        />

                                    )
                                }

                            </Stack>

                        </>

                    )

                }

            </CardContent>

        </Card>

    );

}
