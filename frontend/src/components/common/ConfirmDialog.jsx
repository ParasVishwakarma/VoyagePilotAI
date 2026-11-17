import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Box,
} from "@mui/material";

import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

export default function ConfirmDialog({
                                          open,
                                          title = "Are you sure?",
                                          message = "This action cannot be undone.",
                                          confirmText = "Confirm",
                                          cancelText = "Cancel",
                                          onConfirm,
                                          onCancel,
                                          loading = false,
                                      }) {
    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onCancel}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 5,
                    p: 1,
                    background: "#FCFDFE",
                },
            }}
        >
            <DialogTitle>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#FEF2F2",
                            color: "#EF4444",
                        }}
                    >
                        <WarningAmberRoundedIcon />
                    </Box>

                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        {title}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Typography
                    color="text.secondary"
                    sx={{
                        lineHeight: 1.7,
                        ml: 0.5,
                    }}
                >
                    {message}
                </Typography>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2,
                    gap: 1,
                }}
            >
                <Button
                    variant="outlined"
                    onClick={onCancel}
                    disabled={loading}
                    sx={{
                        borderRadius: 3,
                        px: 2.5,
                    }}
                >
                    {cancelText}
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={onConfirm}
                    disabled={loading}
                    sx={{
                        borderRadius: 3,
                        px: 2.5,
                    }}
                >
                    {loading ? "Deleting..." : confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
