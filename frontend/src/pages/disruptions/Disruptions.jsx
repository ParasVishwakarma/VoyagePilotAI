import { useCallback, useEffect, useState } from "react";

import { useSearch } from "../../context/SearchContext";
import { useNotification } from "../../context/NotificationContext";

import Loader from "../../components/common/Loader";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
} from "@mui/material";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
    getDisruptions,
    deleteDisruption,
    generateAIRecommendation,
} from "../../api/disruptionApi";

export default function Disruptions() {
    const [rows, setRows] = useState([]);

    const { search } = useSearch();
    const { showNotification } = useNotification();

    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedDisruptionId, setSelectedDisruptionId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [openAI, setOpenAI] = useState(false);
    const [recommendation, setRecommendation] = useState(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);

            const data = await getDisruptions();

            setRows(data);
        } catch (error) {
            console.error("Unable to load disruptions:", error);

            showNotification(
                "Unable to load disruptions.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    useEffect(() => {
        loadData();
    }, [loadData]);


    const openDeleteConfirmation = (id) => {
        setSelectedDisruptionId(id);
        setConfirmOpen(true);
    };

    const closeDeleteConfirmation = () => {
        if (deleteLoading) {
            return;
        }

        setConfirmOpen(false);
        setSelectedDisruptionId(null);
    };

    const handleDelete = async () => {
        if (!selectedDisruptionId) {
            return;
        }

        try {
            setDeleteLoading(true);

            await deleteDisruption(selectedDisruptionId);

            showNotification(
                "Disruption deleted successfully.",
                "success"
            );

            setConfirmOpen(false);
            setSelectedDisruptionId(null);

            await loadData();
        } catch (error) {
            console.error(
                "Delete disruption error:",
                error
            );

            showNotification(
                "Failed to delete disruption.",
                "error"
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleAI = async (id) => {
        try {
            setAiLoading(true);

            const result =
                await generateAIRecommendation(id);

            setRecommendation(result);
            setOpenAI(true);

            showNotification(
                "AI recommendation generated successfully.",
                "success"
            );
        } catch (error) {
            console.error(
                "AI Recommendation Error:",
                error
            );

            showNotification(
                "AI recommendation failed.",
                "error"
            );
        } finally {
            setAiLoading(false);
        }
    };

    const filteredRows = rows.filter((row) => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) {
            return true;
        }

        return (
            row.flight?.flightNumber
                ?.toLowerCase()
                .includes(keyword) ||

            row.type
                ?.toLowerCase()
                .includes(keyword) ||

            row.severity
                ?.toLowerCase()
                .includes(keyword) ||

            (row.resolved
                    ? "resolved"
                    : "pending"
            )
                .toLowerCase()
                .includes(keyword)
        );
    });

    if (loading) {
        return (
            <DashboardLayout>
                <Box
                    display="flex"
                    justifyContent="center"
                    mt={10}
                >
                    <Loader />
                </Box>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <Box
                sx={{
                    p: {
                        xs: 2,
                        md: 4,
                    },
                }}
            >
                {/* PAGE HEADER */}

                <Typography
                    variant="h4"
                    fontWeight={700}
                    mb={3}
                >
                    Flight Disruptions
                </Typography>

                {/* DISRUPTIONS TABLE */}

                <Paper>
                    <TableContainer>
                        <Table>

                            <TableHead
                                sx={{
                                    backgroundColor: "#F8FAFC",
                                }}
                            >
                                <TableRow>

                                    <TableCell sx={{ pl: 3, fontWeight: 700 }}>
                                        ID
                                    </TableCell>

                                    <TableCell sx={{ fontWeight: 700 }}>
                                        Flight
                                    </TableCell>

                                    <TableCell sx={{ fontWeight: 700 }}>
                                        Type
                                    </TableCell>

                                    <TableCell sx={{ fontWeight: 700 }}>
                                        Severity
                                    </TableCell>

                                    <TableCell sx={{ fontWeight: 700 }}>
                                        Status
                                    </TableCell>

                                    <TableCell
                                        align="center"
                                        sx={{
                                            pr:2,
                                            fontWeight: 700 }}
                                    >
                                        Actions
                                    </TableCell>

                                </TableRow>
                            </TableHead>

                            <TableBody>

                                {filteredRows.length === 0 ? (

                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            align="center"
                                        >
                                            <Typography
                                                color="text.secondary"
                                                sx={{ py: 5 }}
                                            >
                                                No disruptions found.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>

                                ) : (

                                    filteredRows.map((row) => (

                                        <TableRow
                                            key={row.id}
                                            hover
                                            sx={{
                                                "& td": {
                                                    py: 2,
                                                },
                                            }}
                                        >
                                            <TableCell>
                                                {row.id}
                                            </TableCell>

                                            <TableCell>
                                                {row.flight?.flightNumber ||
                                                    "N/A"}
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    label={
                                                        row.type || "Unknown"
                                                    }
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </TableCell>

                                            <TableCell>

                                                <Chip
                                                    label={
                                                        row.severity ||
                                                        "UNKNOWN"
                                                    }
                                                    color={
                                                        row.severity ===
                                                        "CRITICAL"
                                                            ? "error"
                                                            : row.severity ===
                                                            "HIGH"
                                                                ? "warning"
                                                                : "success"
                                                    }
                                                />

                                            </TableCell>

                                            <TableCell>

                                                <Chip
                                                    label={
                                                        row.resolved
                                                            ? "Resolved"
                                                            : "Pending"
                                                    }
                                                    color={
                                                        row.resolved
                                                            ? "success"
                                                            : "warning"
                                                    }
                                                />

                                            </TableCell>

                                            <TableCell>

                                                <Stack
                                                    direction="row"
                                                    spacing={1.5}
                                                    justifyContent="center"
                                                >

                                                    <Button
                                                        variant="contained"
                                                        disableElevation
                                                        color="secondary"
                                                        size="small"
                                                        sx={{
                                                            borderRadius: 2,
                                                            textTransform: "none",
                                                            px: 2,
                                                            minWidth: 90,
                                                        }}
                                                        disabled={aiLoading}
                                                        onClick={() => handleAI(row.id)}
                                                    >
                                                        {aiLoading ? <Loader /> : "🤖 Ask AI"}
                                                    </Button>

                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        sx={{
                                                            borderRadius: 2,
                                                            textTransform: "none",
                                                            px: 2,
                                                        }}
                                                        onClick={() => openDeleteConfirmation(row.id)}
                                                    >
                                                        Delete
                                                    </Button>

                                                </Stack>

                                            </TableCell>

                                        </TableRow>

                                    ))

                                )}

                            </TableBody>

                        </Table>
                    </TableContainer>
                </Paper>

                {/* AI RECOMMENDATION DIALOG */}

                <Dialog
                    open={openAI}
                    maxWidth="md"
                    fullWidth
                    onClose={() => setOpenAI(false)}
                >

                    <DialogTitle>
                        🤖 AI Recommendation
                    </DialogTitle>

                    <DialogContent dividers>

                        {recommendation && (

                            <Stack spacing={3}>

                                <Paper sx={{ p: 2 }}>
                                    <Typography fontWeight={700}>
                                        Recommended Action
                                    </Typography>

                                    <Typography>
                                        {
                                            recommendation.action
                                        }
                                    </Typography>
                                </Paper>

                                <Paper sx={{ p: 2 }}>
                                    <Typography fontWeight={700}>
                                        Reason
                                    </Typography>

                                    <Typography>
                                        {
                                            recommendation.reason
                                        }
                                    </Typography>
                                </Paper>

                                <Paper sx={{ p: 2 }}>
                                    <Typography fontWeight={700}>
                                        Airline
                                    </Typography>

                                    <Typography>
                                        {
                                            recommendation.airline
                                        }
                                    </Typography>
                                </Paper>

                                <Paper sx={{ p: 2 }}>
                                    <Typography fontWeight={700}>
                                        Flight Number
                                    </Typography>

                                    <Typography>
                                        {
                                            recommendation.flightNumber
                                        }
                                    </Typography>
                                </Paper>

                                <Paper sx={{ p: 2 }}>
                                    <Typography fontWeight={700}>
                                        Refund
                                    </Typography>

                                    <Typography>
                                        {
                                            recommendation.refund
                                                ? "Yes"
                                                : "No"
                                        }
                                    </Typography>
                                </Paper>

                                <Paper sx={{ p: 2 }}>
                                    <Typography fontWeight={700}>
                                        Hotel Extension
                                    </Typography>

                                    <Typography>
                                        {
                                            recommendation.hotelExtension
                                                ? "Required"
                                                : "Not Required"
                                        }
                                    </Typography>
                                </Paper>

                                <Paper sx={{ p: 2 }}>
                                    <Typography fontWeight={700}>
                                        Itinerary Update
                                    </Typography>

                                    <Typography>
                                        {
                                            recommendation.itineraryUpdate
                                                ? "Required"
                                                : "Not Required"
                                        }
                                    </Typography>
                                </Paper>

                                <Paper sx={{ p: 2 }}>
                                    <Typography fontWeight={700}>
                                        Notification
                                    </Typography>

                                    <Typography>
                                        {
                                            recommendation.notification
                                        }
                                    </Typography>
                                </Paper>

                            </Stack>

                        )}

                    </DialogContent>

                    <DialogActions>

                        <Button
                            onClick={() => setOpenAI(false)}
                            variant="contained"
                        >
                            Close
                        </Button>

                    </DialogActions>

                </Dialog>

                <ConfirmDialog
                    open={confirmOpen}
                    title="Delete Disruption?"
                    message="This disruption will be permanently deleted. This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={handleDelete}
                    onCancel={closeDeleteConfirmation}
                    loading={deleteLoading}
                />

            </Box>
        </DashboardLayout>
    );
}
