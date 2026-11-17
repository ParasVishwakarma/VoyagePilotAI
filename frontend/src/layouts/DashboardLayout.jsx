import { Box } from "@mui/material";
import Sidebar from "../components/dashboard/Sidebar";
import FloatingAIOrb from "../components/common/FloatingAIOrb";
import CyberFlightGrid from "../components/common/CyberFlightGrid";

export default function DashboardLayout({ children }) {
    return (
        <Box
            className="aerospace-grid-bg"
            sx={{
                display: "flex",
                minHeight: "100vh",
                width: "100%",
                bgcolor: "#F8FAFC",
                color: "#0F172A",
                position: "relative",
            }}
        >
            {/* Interactive Aerospace Constellation / Flight Corridor Canvas */}
            <CyberFlightGrid />

            <Sidebar />
            <Box
                component="main"
                sx={{
                    flex: 1,
                    minWidth: 0,
                    minHeight: "100vh",
                    px: { xs: 2, sm: 3, lg: 4 },
                    py: { xs: 2, md: 3 },
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <Box sx={{ width: "100%", maxWidth: 1600, mx: "auto" }}>
                    {children}
                </Box>
            </Box>
            {/* Persistent Futuristic Floating Neural AI Orb */}
            <FloatingAIOrb />
        </Box>
    );
}
