import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Typography,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

export default function DeleteTripDialog({ open, trip, onClose, onConfirm, loading = false }) {
    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: "20px", p: 0.5 } }}
        >
            <DialogTitle sx={{ px: 3, pt: 3, pb: 1 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                        sx={{
                            width: 46,
                            height: 46,
                            borderRadius: "14px",
                            display: "grid",
                            placeItems: "center",
                            color: "#D34B4B",
                            backgroundColor: "#FFF0EF",
                        }}
                    >
                        <WarningAmberRoundedIcon />
                    </Box>
                    <Box>
                        <Typography fontSize={18} fontWeight={800} color="#14243A">
                            Delete this trip?
                        </Typography>
                        <Typography fontSize={12} color="text.secondary">
                            This action is permanent.
                        </Typography>
                    </Box>
                </Stack>
            </DialogTitle>
            <DialogContent sx={{ px: 3, pt: 1.5 }}>
                <Typography color="#526176" fontSize={14} lineHeight={1.7}>
                    Are you sure you want to delete{" "}
                    <Box component="strong" sx={{ color: "#14243A" }}>
                        {trip?.title || "this trip"}
                    </Box>
                    ? You won’t be able to recover it afterward.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1 }}>
                <Button
                    onClick={onClose}
                    disabled={loading}
                    variant="outlined"
                    sx={{ borderRadius: "10px", px: 2, borderColor: "#DCE3EC", color: "#526176", textTransform: "none", fontWeight: 700 }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    disabled={loading}
                    variant="contained"
                    color="error"
                    disableElevation
                    sx={{ borderRadius: "10px", px: 2.25, textTransform: "none", fontWeight: 750 }}
                >
                    {loading ? "Deleting..." : "Delete trip"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
