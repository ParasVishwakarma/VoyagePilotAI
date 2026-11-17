import React from "react";
import { Paper, Typography, Box } from "@mui/material";

export default function FeatureCard({ icon, title, description }) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3.5,
                borderRadius: "20px",
                border: "1px solid #E2E8F0",
                bgcolor: "#FFFFFF",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 20px rgba(15, 23, 42, 0.03)",
                "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 18px 36px rgba(37, 99, 235, 0.08)",
                    borderColor: "rgba(37, 99, 235, 0.3)",
                },
            }}
        >
            <Box
                sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "14px",
                    bgcolor: "rgba(37, 99, 235, 0.08)",
                    color: "#2563EB",
                    display: "grid",
                    placeItems: "center",
                    mb: 2.5,
                }}
            >
                {icon}
            </Box>

            <Typography variant="h6" fontWeight={800} color="#0F172A" sx={{ mb: 1, letterSpacing: "-0.3px" }}>
                {title}
            </Typography>

            <Typography variant="body2" color="#64748B" sx={{ lineHeight: 1.6, flexGrow: 1 }}>
                {description}
            </Typography>
        </Paper>
    );
}
