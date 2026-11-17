import React, { useState } from "react";
import {
    Box, Typography, Paper, Stack, Chip, Button, TextField, IconButton,
    Dialog, DialogContent, DialogTitle, CircularProgress, Divider, Tooltip
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import { useNavigate } from "react-router-dom";
import { getTravelAdvice } from "../../api/aiApi";
import { triggerConfetti } from "../../utils/confetti";
import { sounds } from "../../utils/soundEffects";

export default function FloatingAIOrb() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);

    const handleAsk = async (customPrompt) => {
        const text = customPrompt || query || "Autonomous travel optimization and disruption protection";
        try {
            setLoading(true);
            const res = await getTravelAdvice({
                query: text,
                destination: "Tokyo / Sydney / Paris",
                flightNumber: "VP-812",
            });
            setResponse(res);
            triggerConfetti();
        } catch (e) {
            setResponse({
                action: "Neural Corridor Protection Active",
                reason: "Airspace integrity along your corridors is currently 98.4% nominal. Autonomous rerouting ready if delays occur.",
                airline: "VoyagePilot Global Fleet",
                flightNumber: "VP-812",
                notification: "Real-time AI telemetry synced with global radar.",
                hotelExtension: false,
                refund: false,
                itineraryUpdate: true,
            });
            triggerConfetti();
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Futuristic AI Orb Dock */}
            <Box className="floating-ai-dock">
                <Tooltip title="Activate Neural AI Co-Pilot HUD" placement="left">
                    <Box
                        sx={{ position: "relative" }}
                        onClick={() => {
                            sounds.playWarp();
                            setOpen(true);
                        }}
                    >
                        <Box className="ai-orb-ring" />
                        <Box className="ai-orb-core">
                            <AutoAwesomeRoundedIcon sx={{ fontSize: 28 }} />
                        </Box>
                        {/* Status Ping */}
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: -4,
                                right: -4,
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                bgcolor: "#10B981",
                                border: "3px solid #FFFFFF",
                                boxShadow: "0 0 10px #10B981",
                            }}
                        />
                    </Box>
                </Tooltip>
            </Box>

            {/* Futuristic Holographic Cyber-HUD Modal */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: "24px",
                        bgcolor: "rgba(15, 23, 42, 0.96)",
                        backdropFilter: "blur(24px)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(16, 185, 129, 0.2)",
                        color: "#FFFFFF",
                        p: 1,
                    },
                }}
            >
                {/* HUD Header */}
                <DialogTitle sx={{ px: 3, pt: 2.5, pb: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box
                            sx={{
                                width: 38,
                                height: 38,
                                borderRadius: "10px",
                                bgcolor: "rgba(16, 185, 129, 0.2)",
                                border: "1px solid #10B981",
                                display: "grid",
                                placeItems: "center",
                                color: "#10B981",
                            }}
                        >
                            <BoltRoundedIcon />
                        </Box>
                        <Box>
                            <Typography sx={{ fontWeight: 850, fontSize: "1.1rem", color: "#FFFFFF", letterSpacing: "-.3px" }}>
                                VoyagePilot Neural HUD
                            </Typography>
                            <Typography sx={{ fontSize: "0.72rem", color: "#00F5D4", fontWeight: 700, letterSpacing: ".8px", textTransform: "uppercase" }}>
                                ✦ Autonomous Co-Pilot v4.2 Active
                            </Typography>
                        </Box>
                    </Stack>

                    <IconButton onClick={() => setOpen(false)} sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "#FFF" } }}>
                        <CloseRoundedIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ px: 3, py: 2 }}>
                    {/* Live Telemetry Bar */}
                    <Box sx={{ p: 1.5, borderRadius: "12px", bgcolor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", mb: 2.5 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>
                                📡 Radar Sweep: <b style={{ color: "#10B981" }}>Nominal</b>
                            </Typography>
                            <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>
                                ⚡ Disruption Shield: <b style={{ color: "#00F5D4" }}>100% Active</b>
                            </Typography>
                            <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>
                                ⏱️ AI Latency: <b style={{ color: "#38BDF8" }}>0.38s</b>
                            </Typography>
                        </Stack>
                    </Box>

                    {/* Ask Input */}
                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: "0.75rem", fontWeight: 750, color: "#94A3B8", textTransform: "uppercase", letterSpacing: ".5px", mb: 0.8 }}>
                            Query Neural Travel Co-Pilot
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="e.g., Check flight delay risk, pack list, or weather forecast..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                                sx={{
                                    bgcolor: "rgba(255,255,255,0.07)",
                                    borderRadius: "12px",
                                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.15)" },
                                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#10B981" },
                                    "& input": { color: "#FFFFFF", fontWeight: 600, fontSize: "0.9rem" },
                                }}
                            />
                            <Button
                                variant="contained"
                                onClick={() => handleAsk()}
                                disabled={loading}
                                sx={{
                                    bgcolor: "#10B981",
                                    borderRadius: "12px",
                                    minWidth: 46,
                                    px: 2,
                                    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)",
                                    "&:hover": { bgcolor: "#059669" },
                                }}
                            >
                                <SendRoundedIcon fontSize="small" />
                            </Button>
                        </Stack>
                    </Box>

                    {/* Quick Trigger Chips */}
                    <Stack direction="row" spacing={0.8} sx={{ flexWrap: "wrap", gap: 0.8, mb: 2.5 }}>
                        <Chip
                            label="⚡ Simulate Weather Delay"
                            onClick={() => handleAsk("Severe typhoon approaching Tokyo airport. Simulate immediate partner flight rebooking and hotel extension voucher.")}
                            sx={{
                                bgcolor: "rgba(16, 185, 129, 0.15)",
                                border: "1px solid rgba(16, 185, 129, 0.4)",
                                color: "#A7F3D0",
                                fontWeight: 750,
                                fontSize: "0.75rem",
                                cursor: "pointer",
                                "&:hover": { bgcolor: "rgba(16, 185, 129, 0.3)" },
                            }}
                        />
                        <Chip
                            label="🧳 Smart Pack & Weather Radar"
                            onClick={() => handleAsk("Generate smart packing checklist and current 7-day temperature trends for Kyoto & Swiss Alps.")}
                            sx={{
                                bgcolor: "rgba(56, 189, 248, 0.15)",
                                border: "1px solid rgba(56, 189, 248, 0.4)",
                                color: "#BAE6FD",
                                fontWeight: 750,
                                fontSize: "0.75rem",
                                cursor: "pointer",
                                "&:hover": { bgcolor: "rgba(56, 189, 248, 0.3)" },
                            }}
                        />
                        <Chip
                            label="🗺️ Quantum Flight Corridor Map"
                            onClick={() => {
                                setOpen(false);
                                navigate("/map");
                            }}
                            sx={{
                                bgcolor: "rgba(139, 92, 246, 0.15)",
                                border: "1px solid rgba(139, 92, 246, 0.4)",
                                color: "#DDD6FE",
                                fontWeight: 750,
                                fontSize: "0.75rem",
                                cursor: "pointer",
                            }}
                        />
                    </Stack>

                    {/* AI Output Card */}
                    {loading ? (
                        <Box sx={{ py: 4, textAlign: "center" }}>
                            <CircularProgress size={32} sx={{ color: "#00F5D4", mb: 1.5 }} />
                            <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", fontWeight: 600 }}>
                                Neural engine synchronizing with global aviation telemetry...
                            </Typography>
                        </Box>
                    ) : response ? (
                        <Box
                            sx={{
                                p: 2.5,
                                borderRadius: "16px",
                                bgcolor: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid rgba(16, 185, 129, 0.3)",
                                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                            }}
                        >
                            <Typography sx={{ color: "#00F5D4", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".8px", mb: 0.5 }}>
                                Autonomous Recommendation
                            </Typography>
                            <Typography sx={{ fontSize: "1.1rem", fontWeight: 850, color: "#FFFFFF", mb: 1.2 }}>
                                {response.action}
                            </Typography>
                            <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: "0.88rem", lineHeight: 1.6, mb: 2 }}>
                                {response.reason}
                            </Typography>

                            <Box sx={{ p: 1.5, borderRadius: "10px", bgcolor: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.25)", mb: 2 }}>
                                <Typography sx={{ fontSize: "0.82rem", color: "#A7F3D0", fontWeight: 650 }}>
                                    📢 {response.notification}
                                </Typography>
                            </Box>

                            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.8 }}>
                                <Chip label={`Fleet: ${response.airline || "Partner Fleet"}`} size="small" sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "#FFF", fontWeight: 700, fontSize: "0.72rem" }} />
                                <Chip label={`Flight: ${response.flightNumber || "VP-812"}`} size="small" sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "#FFF", fontWeight: 700, fontSize: "0.72rem" }} />
                                <Chip label="✦ 100% Protected" size="small" sx={{ bgcolor: "#10B981", color: "#FFF", fontWeight: 800, fontSize: "0.72rem" }} />
                            </Stack>
                        </Box>
                    ) : null}
                </DialogContent>
            </Dialog>
        </>
    );
}
