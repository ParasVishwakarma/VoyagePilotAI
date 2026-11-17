import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { Box, Paper, Typography } from "@mui/material";

export default function AnalyticsCard({
                                          title,
                                          value,
                                          color,
                                      }) {
    return (
        <Paper
            elevation={0}
            sx={{
                height: 150,
                borderRadius: "20px",
                border: "1px solid #E7ECEF",
                bgcolor: "#FFFFFF",
                p: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "0.25s ease",
                cursor: "pointer",

                "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 14px 28px rgba(0,0,0,0.08)",
                },
            }}
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography
                    sx={{
                        color: "#64748B",
                        fontWeight: 600,
                        fontSize: 15,
                    }}
                >
                    {title}
                </Typography>

                <Box
                    sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "12px",
                        bgcolor: `${color}15`,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <TrendingUpRoundedIcon
                        sx={{
                            color,
                            fontSize: 22,
                        }}
                    />
                </Box>
            </Box>

            <Typography
                variant="h3"
                sx={{
                    fontWeight: 800,
                    color,
                    mt: 1,
                }}
            >
                {value}
            </Typography>

            <Typography
                sx={{
                    color: "#94A3B8",
                    fontSize: 13,
                }}
            >
                Live data from backend
            </Typography>
        </Paper>
    );
}
