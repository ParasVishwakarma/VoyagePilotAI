import { Box, Card, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { sounds } from "../../utils/soundEffects";

export default function StatCard({ title, value, icon, color = "#10B981", trend = "+12%" }) {
    return (
        <motion.div
            whileHover={{ y: -6, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            style={{ height: "100%" }}
            onMouseEnter={() => sounds.playHover()}
        >
            <Card
                elevation={0}
                className="hud-card neon-border-glow"
                sx={{
                    height: "100%",
                    p: { xs: 2.2, md: 2.5 },
                    borderRadius: "22px",
                    bgcolor: "#FFFFFF",
                    boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.05)",
                    transition: "all .25s ease",
                }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Typography className="telemetry-code" sx={{ color: "#64748B", fontSize: "0.68rem !important", mb: 0.5 }}>
                            // {title}
                        </Typography>
                        <Typography sx={{ color: "#0F172A", fontSize: 32, lineHeight: 1.2, fontWeight: 900, letterSpacing: "-1px" }}>
                            {value}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={0.6} sx={{ mt: 1.2 }}>
                            <TrendingUpRoundedIcon sx={{ color: "#10B981", fontSize: 16 }} />
                            <Typography sx={{ color: "#059669", fontSize: 11.5, fontWeight: 800 }}>{trend}</Typography>
                        </Stack>
                    </Box>
                    <Box
                        sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "16px",
                            display: "grid",
                            placeItems: "center",
                            color,
                            bgcolor: `${color}18`,
                            border: `1.5px solid ${color}35`,
                            boxShadow: `0 6px 18px ${color}25`,
                            "& svg": { fontSize: 26 },
                        }}
                    >
                        {icon}
                    </Box>
                </Stack>
            </Card>
        </motion.div>
    );
}
