import { Box, Typography, Stack } from "@mui/material";
import SoftCard from "./SoftCard";

export default function SoftStatCard({
    icon,
    title,
    value,
    color = "#2563EB",
}) {
    return (
        <SoftCard>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {title}
                    </Typography>
                    <Typography variant="h4" fontWeight={750} sx={{ color: "#0F172A", letterSpacing: "-0.5px" }}>
                        {value}
                    </Typography>
                </Box>
                {icon && (
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "14px",
                            display: "grid",
                            placeItems: "center",
                            bgcolor: `${color}14`,
                            color: color,
                        }}
                    >
                        {icon}
                    </Box>
                )}
            </Stack>
        </SoftCard>
    );
}
