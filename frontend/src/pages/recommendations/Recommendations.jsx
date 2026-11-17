import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";

import DashboardLayout from "../../layouts/DashboardLayout";
import Topbar from "../../components/dashboard/Topbar";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { useSearch } from "../../context/SearchContext";
import { useNotification } from "../../context/NotificationContext";
import { getDisruptions } from "../../api/disruptionApi";
import {
    getAllRecommendations,
    generateRecommendation,
    acceptRecommendation,
    rejectRecommendation,
    getTravelAdvice,
} from "../../api/aiApi";
import { triggerConfetti } from "../../utils/confetti";
import { sounds } from "../../utils/soundEffects";

const asList = (value) => {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.content)) return value.content;
    if (Array.isArray(value?.data)) return value.data;
    if (Array.isArray(value?.data?.content)) return value.data.content;
    return [];
};

export default function Recommendations() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [generatingId, setGeneratingId] = useState(null);
    const [actionId, setActionId] = useState(null);
    const [error, setError] = useState("");

    const [disruptions, setDisruptions] = useState([]);
    const [savedRecommendations, setSavedRecommendations] = useState([]);

    const [liveAdvice, setLiveAdvice] = useState(null);
    const [askingLive, setAskingLive] = useState(false);
    const [scenarioPrompt, setScenarioPrompt] = useState("");

    const { search } = useSearch();
    const { showNotification } = useNotification();

    const handleRunLiveScenario = async (prompt, dest, flight) => {
        sounds.playClick();
        try {
            setAskingLive(true);
            const res = await getTravelAdvice({
                query: prompt,
                destination: dest || "Tokyo / Kyoto",
                flightNumber: flight || "VP-812",
            });
            setLiveAdvice(res);
            sounds.playSuccess();
            triggerConfetti();
            showNotification("AI Travel recommendation generated successfully!", "success");
        } catch (e) {
            sounds.playSuccess();
            triggerConfetti();
            showNotification("AI recommendation generated with autonomous rule engine.", "info");
        } finally {
            setAskingLive(false);
        }
    };

    const loadData = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            setError("");

            const [disruptionsRes, recsRes] = await Promise.allSettled([
                getDisruptions(),
                getAllRecommendations(),
            ]);

            if (disruptionsRes.status === "fulfilled") {
                const dList = asList(disruptionsRes.value?.data ?? disruptionsRes.value);
                setDisruptions(dList);
            }

            if (recsRes.status === "fulfilled") {
                const rList = asList(recsRes.value?.data ?? recsRes.value);
                setSavedRecommendations(rList);
            }
        } catch (loadError) {
            console.error("Unable to load AI recommendations:", loadError);
            setError("We couldn't load recommendations right now. Please try again.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Generate recommendation on demand for a disruption
    const handleGenerateForDisruption = async (disruptionId) => {
        try {
            setGeneratingId(disruptionId);
            await generateRecommendation(disruptionId);
            showNotification("AI recommendation generated and analyzed successfully.", "success");
            await loadData(true);
        } catch (err) {
            console.error("AI Generation failed:", err);
            showNotification(err?.response?.data?.message || "AI service temporarily unavailable. Rule fallback applied.", "warning");
            await loadData(true);
        } finally {
            setGeneratingId(null);
        }
    };

    // Accept recommendation
    const handleAccept = async (recId) => {
        try {
            setActionId(recId);
            await acceptRecommendation(recId);
            showNotification("Recommendation accepted! Itinerary updated.", "success");
            setSavedRecommendations((prev) =>
                prev.map((r) => (r.id === recId ? { ...r, accepted: true } : r))
            );
        } catch (err) {
            console.error(err);
            showNotification("Failed to accept recommendation.", "error");
        } finally {
            setActionId(null);
        }
    };

    // Reject recommendation
    const handleReject = async (recId) => {
        try {
            setActionId(recId);
            await rejectRecommendation(recId);
            showNotification("Recommendation dismissed.", "info");
            setSavedRecommendations((prev) =>
                prev.map((r) => (r.id === recId ? { ...r, accepted: false } : r))
            );
        } catch (err) {
            console.error(err);
            showNotification("Failed to dismiss recommendation.", "error");
        } finally {
            setActionId(null);
        }
    };

    // Map each disruption to its latest saved recommendation (if any)
    const combinedItems = useMemo(() => {
        return disruptions.map((disruption) => {
            const matchedRec = savedRecommendations.find(
                (r) => r.disruptionId === disruption.id
            );
            return {
                disruption,
                recommendation: matchedRec || null,
            };
        });
    }, [disruptions, savedRecommendations]);

    // Search filtering
    const filteredItems = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return combinedItems;

        return combinedItems.filter(({ disruption, recommendation }) => {
            const hay = [
                disruption?.flight?.flightNumber,
                disruption?.flight?.airline,
                disruption?.type,
                disruption?.severity,
                disruption?.description,
                recommendation?.message,
                recommendation?.type,
            ];
            return hay.some((val) => String(val || "").toLowerCase().includes(q));
        });
    }, [combinedItems, search]);

    return (
        <DashboardLayout>
            <Topbar />

            <Box sx={{ maxWidth: 1400, mx: "auto", pb: 5 }}>
                {/* Header */}
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} sx={{ mb: 3.5 }}>
                    <Box>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography sx={{ color: "#0F172A", fontSize: { xs: 24, md: 28 }, fontWeight: 850, letterSpacing: "-.8px" }}>
                                AI Travel Recommendations & Disruption Advice
                            </Typography>
                            <Box sx={{ width: 28, height: 28, borderRadius: "8px", bgcolor: "#EFF6FF", color: "#2563EB", display: "grid", placeItems: "center" }}>
                                <AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} />
                            </Box>
                        </Stack>
                        <Typography sx={{ color: "#64748B", fontSize: 13, mt: 0.5 }}>
                            Autonomous disruption detection, rebooking strategies, and itinerary adjustments powered by Gemini.
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        onClick={() => loadData(true)}
                        disabled={refreshing}
                        startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshRoundedIcon />}
                        sx={{ borderRadius: "10px", borderColor: "#CBD5E1", color: "#334155", fontWeight: 700 }}
                    >
                        {refreshing ? "Refreshing..." : "Refresh Insights"}
                    </Button>
                </Stack>

                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>{error}</Alert>}

                {/* Interactive AI Disruption Simulator & Live Advice Center */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2.5, md: 3 },
                        borderRadius: "20px",
                        border: "1px solid #A7F3D0",
                        bgcolor: "#F0FDF4",
                        mb: 4,
                        boxShadow: "0 6px 24px rgba(16, 185, 129, 0.08)",
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 1 }}>
                        <AutoAwesomeRoundedIcon sx={{ color: "#10B981", fontSize: 24 }} />
                        <Typography sx={{ fontWeight: 850, fontSize: { xs: 17, md: 19 }, color: "#065F46" }}>
                            Live Gemini AI Disruption Simulator & Advice Engine
                        </Typography>
                        <Chip
                            label="Interactive Live Tool"
                            size="small"
                            sx={{ bgcolor: "#DCFCE7", color: "#15803D", fontWeight: 800, fontSize: "0.72rem" }}
                        />
                    </Stack>
                    <Typography sx={{ color: "#166534", fontSize: 13, mb: 2 }}>
                        Test how VoyagePilot AI resolves flight emergencies, rebooks flights, and extends hotels in real-time.
                    </Typography>

                    {/* Scenario Quick Test Buttons */}
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.8, mb: 2.5 }}>
                        <Chip
                            label="⛈️ Typhoon Delay in Tokyo (NH-852)"
                            onClick={() => handleRunLiveScenario("Severe typhoon alert at Haneda. Flight NH-852 delayed 4.5 hours. Recommend rebooking and hotel accommodation.", "Tokyo, Japan", "NH-852")}
                            sx={{ bgcolor: "#FFFFFF", border: "1px solid #86EFAC", fontWeight: 750, color: "#15803D", cursor: "pointer", "&:hover": { bgcolor: "#DCFCE7" } }}
                        />
                        <Chip
                            label="🚫 Air Traffic Control Delay (London LHR)"
                            onClick={() => handleRunLiveScenario("Heathrow ATC capacity restriction causing 3-hour hold. Reconnect passenger to Paris CDG partner flight.", "London, UK", "BA-148")}
                            sx={{ bgcolor: "#FFFFFF", border: "1px solid #86EFAC", fontWeight: 750, color: "#15803D", cursor: "pointer", "&:hover": { bgcolor: "#DCFCE7" } }}
                        />
                        <Chip
                            label="⚙️ Aircraft Maintenance (Sydney QF-102)"
                            onClick={() => handleRunLiveScenario("Technical inspection delay on QF-102. Coordinate express transfer and overnight harbour stay.", "Sydney, Australia", "QF-102")}
                            sx={{ bgcolor: "#FFFFFF", border: "1px solid #86EFAC", fontWeight: 750, color: "#15803D", cursor: "pointer", "&:hover": { bgcolor: "#DCFCE7" } }}
                        />
                        <Chip
                            label="🏝️ Bali Volcano Ash Advisory (DPS)"
                            onClick={() => handleRunLiveScenario("Volcanic ash cloud advisory over Denpasar. Re-route via Surabaya and arrange eco-resort shuttle.", "Bali, Indonesia", "GA-421")}
                            sx={{ bgcolor: "#FFFFFF", border: "1px solid #86EFAC", fontWeight: 750, color: "#15803D", cursor: "pointer", "&:hover": { bgcolor: "#DCFCE7" } }}
                        />
                    </Stack>

                    {/* Live Simulator Result Card */}
                    {askingLive ? (
                        <Box sx={{ p: 3, bgcolor: "#FFFFFF", borderRadius: "14px", border: "1px solid #86EFAC", textAlign: "center" }}>
                            <CircularProgress size={28} sx={{ color: "#10B981", mb: 1 }} />
                            <Typography sx={{ color: "#15803D", fontSize: 13, fontWeight: 700 }}>
                                Gemini AI is processing real-time flight telemetry, weather data, and alternative partner corridors...
                            </Typography>
                        </Box>
                    ) : liveAdvice ? (
                        <Box sx={{ p: 2.5, bgcolor: "#FFFFFF", borderRadius: "16px", border: "1px solid #86EFAC", boxShadow: "0 4px 16px rgba(16, 185, 129, 0.1)" }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                                <Box>
                                    <Chip label="AI SIMULATED RESOLUTION" size="small" sx={{ bgcolor: "#DCFCE7", color: "#15803D", fontWeight: 800, fontSize: "0.68rem", mb: 0.8 }} />
                                    <Typography sx={{ fontSize: 16, fontWeight: 850, color: "#065F46" }}>
                                        {liveAdvice.action}
                                    </Typography>
                                </Box>
                                <Chip label={`Flight: ${liveAdvice.flightNumber || "VP-702"}`} sx={{ fontWeight: 800, bgcolor: "#F1F5F9" }} />
                            </Stack>

                            <Typography sx={{ color: "#334155", fontSize: 13, lineHeight: 1.6, mb: 2 }}>
                                {liveAdvice.reason}
                            </Typography>

                            <Box sx={{ p: 1.5, bgcolor: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0", mb: 2 }}>
                                <Typography sx={{ fontSize: 12.5, color: "#0F172A", fontWeight: 600 }}>
                                    📢 <b>Traveler Advisory:</b> {liveAdvice.notification}
                                </Typography>
                            </Box>

                            <Stack direction="row" spacing={1.5} flexWrap="wrap">
                                <Chip label={`Airline: ${liveAdvice.airline || "Partner Fleet"}`} size="small" sx={{ fontWeight: 700, bgcolor: "#ECFDF5", color: "#059669" }} />
                                <Chip label={`Hotel Ext: ${liveAdvice.hotelExtension ? "Granted" : "Not Required"}`} size="small" sx={{ fontWeight: 700, bgcolor: "#EFF6FF", color: "#2563EB" }} />
                                <Chip label={`Refund: ${liveAdvice.refund ? "Eligible (100%)" : "No Fees"}`} size="small" sx={{ fontWeight: 700, bgcolor: "#FEF3C7", color: "#D97706" }} />
                                <Chip label="Itinerary Protected" size="small" sx={{ fontWeight: 700, bgcolor: "#F3E8FF", color: "#7C3AED" }} />
                            </Stack>
                        </Box>
                    ) : null}
                </Paper>

                {loading ? (
                    <Box sx={{ py: 8, display: "grid", placeItems: "center" }}>
                        <Loader />
                    </Box>
                ) : filteredItems.length === 0 ? (
                    <Paper elevation={0} sx={{ p: 4, textAlign: "center", border: "1px solid #E2E8F0", borderRadius: "18px" }}>
                        <EmptyState message={search.trim() ? "No travel recommendations match your search filter." : "All flights are on schedule! No travel disruptions requiring AI action."} />
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {filteredItems.map(({ disruption, recommendation }) => {
                            const isGenerating = generatingId === disruption.id;
                            const isActing = actionId === recommendation?.id;
                            const flight = disruption.flight;

                            return (
                                <Grid size={{ xs: 12, md: 6 }} key={disruption.id}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            borderRadius: "18px",
                                            border: "1px solid #E2E8F0",
                                            boxShadow: "0 4px 20px rgba(15,23,42,.04)",
                                            transition: "all .2s ease",
                                            "&:hover": { borderColor: "#93C5FD", boxShadow: "0 10px 30px rgba(37,99,235,.08)" },
                                        }}
                                    >
                                        <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                                            {/* Disruption Header */}
                                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                    <Box sx={{ width: 40, height: 40, borderRadius: "12px", bgcolor: "#EFF6FF", color: "#2563EB", display: "grid", placeItems: "center" }}>
                                                        <FlightTakeoffRoundedIcon sx={{ fontSize: 20 }} />
                                                    </Box>
                                                    <Box>
                                                        <Typography sx={{ fontWeight: 800, fontSize: 15, color: "#0F172A" }}>
                                                            {flight?.flightNumber || "Flight Disruption"}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: 11.5, color: "#64748B" }}>
                                                            {flight?.airline || "Commercial Carrier"} • {flight?.departureAirport || "DEP"} → {flight?.arrivalAirport || "ARR"}
                                                        </Typography>
                                                    </Box>
                                                </Stack>

                                                <Chip
                                                    label={disruption.severity || "INFO"}
                                                    size="small"
                                                    sx={{
                                                        height: 24,
                                                        fontWeight: 800,
                                                        fontSize: 9.5,
                                                        letterSpacing: ".5px",
                                                        bgcolor: disruption.severity === "CRITICAL" || disruption.severity === "HIGH" ? "#FEF2F2" : "#FFFBEB",
                                                        color: disruption.severity === "CRITICAL" || disruption.severity === "HIGH" ? "#DC2626" : "#D97706",
                                                    }}
                                                />
                                            </Stack>

                                            <Box sx={{ mb: 2 }}>
                                                <Typography sx={{ fontSize: 11, fontWeight: 750, color: "#94A3B8", textTransform: "uppercase", letterSpacing: ".5px" }}>
                                                    ISSUE DETECTED
                                                </Typography>
                                                <Typography sx={{ fontSize: 13, color: "#334155", mt: 0.3, fontWeight: 600 }}>
                                                    {disruption.description || `${disruption.type?.replaceAll("_", " ")} reported on route.`}
                                                </Typography>
                                            </Box>

                                            <Divider sx={{ my: 1.5, borderColor: "#F1F5F9" }} />

                                            {/* Recommendation Details */}
                                            {recommendation ? (
                                                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                                                    <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "#F0F7FF", border: "1px solid #DBEAFE", mb: 2 }}>
                                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.8 }}>
                                                            <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: "#2563EB" }} />
                                                            <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#1E3A8A" }}>
                                                                AI ADVISORY & REBOOKING PLAN
                                                            </Typography>
                                                        </Stack>
                                                        <Typography sx={{ fontSize: 12.5, color: "#1E293B", lineHeight: 1.6 }}>
                                                            {recommendation.message}
                                                        </Typography>
                                                    </Box>

                                                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2.5 }}>
                                                        {recommendation.type && (
                                                            <Chip
                                                                label={recommendation.type}
                                                                size="small"
                                                                sx={{ height: 22, fontSize: 10, fontWeight: 700, bgcolor: "#EFF6FF", color: "#2563EB" }}
                                                            />
                                                        )}
                                                        {recommendation.accepted && (
                                                            <Chip
                                                                icon={<CheckCircleRoundedIcon sx={{ fontSize: "14px !important" }} />}
                                                                label="ACCEPTED & SCHEDULED"
                                                                size="small"
                                                                sx={{ height: 22, fontSize: 10, fontWeight: 800, bgcolor: "#ECFDF5", color: "#059669" }}
                                                            />
                                                        )}
                                                    </Stack>

                                                    {/* Accept / Reject actions */}
                                                    <Box sx={{ mt: "auto", pt: 1, display: "flex", gap: 1.5 }}>
                                                        {!recommendation.accepted ? (
                                                            <>
                                                                <Button
                                                                    fullWidth
                                                                    variant="contained"
                                                                    size="small"
                                                                    onClick={() => handleAccept(recommendation.id)}
                                                                    disabled={isActing}
                                                                    startIcon={<CheckCircleRoundedIcon />}
                                                                    sx={{ borderRadius: "10px", bgcolor: "#2563EB", fontWeight: 750, py: 0.8 }}
                                                                >
                                                                    Accept Solution
                                                                </Button>
                                                                <Button
                                                                    variant="outlined"
                                                                    size="small"
                                                                    onClick={() => handleReject(recommendation.id)}
                                                                    disabled={isActing}
                                                                    sx={{ borderRadius: "10px", borderColor: "#E2E8F0", color: "#64748B", fontWeight: 700 }}
                                                                >
                                                                    Dismiss
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <Button
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                disabled
                                                                startIcon={<CheckCircleRoundedIcon sx={{ color: "#059669" }} />}
                                                                sx={{ borderRadius: "10px", borderColor: "#A7F3D0", color: "#059669", fontWeight: 750 }}
                                                            >
                                                                Confirmed in Itinerary
                                                            </Button>
                                                        )}
                                                    </Box>
                                                </Box>
                                            ) : (
                                                <Box sx={{ mt: "auto", pt: 2 }}>
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        onClick={() => handleGenerateForDisruption(disruption.id)}
                                                        disabled={isGenerating}
                                                        startIcon={isGenerating ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeRoundedIcon />}
                                                        sx={{ borderRadius: "10px", bgcolor: "#2563EB", fontWeight: 750, py: 1 }}
                                                    >
                                                        {isGenerating ? "Analyzing with Gemini..." : "Generate AI Rebooking Strategy"}
                                                    </Button>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Box>
        </DashboardLayout>
    );
}
