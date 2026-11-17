import { useState, useEffect } from "react";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import Topbar from "../../components/dashboard/Topbar";

import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Snackbar,
    Alert,
    Switch,
    TextField,
    Typography,
    Stack,
    Tab,
    Tabs,
} from "@mui/material";

import {
    PersonRounded,
    LockRounded,
    NotificationsRounded,
    SaveRounded,
    Visibility,
    VisibilityOff,
    SmartToyRounded,
    SettingsRounded,
    DeleteForeverRounded,
    ShieldRounded,
} from "@mui/icons-material";

export default function Settings() {
    const [tabIndex, setTabIndex] = useState(0);
    const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: "success",
        message: "",
    });

    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });

    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [notifications, setNotifications] = useState({
        email: true,
        ai: true,
        flight: true,
        disruptions: true,
        booking: true,
    });

    const [aiPrefs, setAiPrefs] = useState({
        autoRebook: false,
        autoNotify: true,
        budgetAwareness: true,
        riskThreshold: "MODERATE",
    });

    /* ================= LOAD PROFILE ================= */
    useEffect(() => {
        let active = true;
        api.get("/users/me")
            .then((res) => {
                if (active) {
                    setProfile({
                        firstName: res.data.firstName || "",
                        lastName: res.data.lastName || "",
                        email: res.data.email || "",
                        phone: res.data.phone || "",
                    });
                }
            })
            .catch((err) => console.error("Error loading user profile:", err));

        return () => {
            active = false;
        };
    }, []);

    /* ================= SAVE PROFILE ================= */
    const handleSaveProfile = async () => {
        try {
            setLoading(true);
            const res = await api.put("/users/profile", {
                firstName: profile.firstName,
                lastName: profile.lastName,
                phone: profile.phone,
            });

            setProfile({
                firstName: res.data.firstName,
                lastName: res.data.lastName,
                email: res.data.email,
                phone: res.data.phone,
            });

            setSnackbar({
                open: true,
                severity: "success",
                message: "Profile updated successfully.",
            });
        } catch (err) {
            console.error(err);
            setSnackbar({
                open: true,
                severity: "error",
                message: err.response?.data?.message || "Failed to update profile.",
            });
        } finally {
            setLoading(false);
        }
    };

    /* ================= CHANGE PASSWORD ================= */
    const handleChangePassword = async () => {
        if (!password.currentPassword) {
            setSnackbar({ open: true, severity: "error", message: "Current password is required" });
            return;
        }

        if (password.newPassword.length < 6) {
            setSnackbar({ open: true, severity: "error", message: "New password must be at least 6 characters" });
            return;
        }

        if (password.newPassword !== password.confirmPassword) {
            setSnackbar({ open: true, severity: "error", message: "New passwords do not match" });
            return;
        }

        try {
            setLoading(true);
            await api.put("/users/change-password", {
                oldPassword: password.currentPassword,
                currentPassword: password.currentPassword,
                newPassword: password.newPassword,
            });

            setSnackbar({
                open: true,
                severity: "success",
                message: "Password changed successfully.",
            });

            setPassword({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            setSnackbar({
                open: true,
                severity: "error",
                message: err.response?.data?.message || "Current password is incorrect.",
            });
        } finally {
            setLoading(false);
        }
    };

    /* ================= DELETE ACCOUNT ================= */
    const handleDeleteAccount = async () => {
        try {
            setLoading(true);
            await api.delete("/users/me");
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
        } catch (err) {
            console.error(err);
            setSnackbar({
                open: true,
                severity: "error",
                message: err.response?.data?.message || "Failed to delete account.",
            });
            setLoading(false);
            setDeleteAccountOpen(false);
        }
    };

    return (
        <DashboardLayout>
            <Topbar />

            <Box sx={{ maxWidth: 1200, mx: "auto", pb: 5 }}>
                {/* Header */}
                <Box sx={{ mb: 3 }}>
                    <Typography sx={{ color: "#0F172A", fontSize: { xs: 24, md: 28 }, fontWeight: 850, letterSpacing: "-.8px" }}>
                        Account & System Settings
                    </Typography>
                    <Typography sx={{ color: "#64748B", fontSize: 13, mt: 0.5 }}>
                        Manage your traveler credentials, autonomous AI preferences, and notification channels.
                    </Typography>
                </Box>

                {/* Profile Overview Card */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2.5, md: 3 },
                        mb: 3,
                        borderRadius: "18px",
                        border: "1px solid #E2E8F0",
                        bgcolor: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        gap: 2.5,
                        flexWrap: "wrap",
                    }}
                >
                    <Avatar
                        sx={{
                            width: 64,
                            height: 64,
                            bgcolor: "#2563EB",
                            fontSize: 24,
                            fontWeight: 800,
                            boxShadow: "0 6px 18px rgba(37,99,235,0.25)",
                        }}
                    >
                        {(profile.firstName || "T").charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                        <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
                            {profile.firstName ? `${profile.firstName} ${profile.lastName}` : "Traveler"}
                        </Typography>
                        <Typography sx={{ fontSize: 13, color: "#64748B", mt: 0.2 }}>
                            {profile.email || "Loading account..."}
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setTabIndex(0)}
                            sx={{ borderRadius: "10px", borderColor: "#E2E8F0", color: "#334155", fontWeight: 700 }}
                        >
                            Edit Profile
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => setTabIndex(1)}
                            sx={{ borderRadius: "10px", bgcolor: "#2563EB", fontWeight: 700 }}
                        >
                            Security
                        </Button>
                    </Stack>
                </Paper>

                {/* Navigation Tabs */}
                <Tabs
                    value={tabIndex}
                    onChange={(e, val) => setTabIndex(val)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        mb: 3,
                        borderBottom: "1px solid #E2E8F0",
                        "& .MuiTab-root": {
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: 13.5,
                            color: "#64748B",
                            minHeight: 44,
                            "&.Mui-selected": { color: "#2563EB" },
                        },
                        "& .MuiTabs-indicator": { bgcolor: "#2563EB", height: 3, borderRadius: "3px 3px 0 0" },
                    }}
                >
                    <Tab icon={<PersonRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Personal Profile" />
                    <Tab icon={<LockRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Security & Password" />
                    <Tab icon={<NotificationsRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Notifications" />
                    <Tab icon={<SmartToyRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="AI Preferences" />
                    <Tab icon={<SettingsRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="System & Danger Zone" />
                </Tabs>

                {/* TAB 0: PROFILE */}
                {tabIndex === 0 && (
                    <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: "18px", border: "1px solid #E2E8F0" }}>
                        <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#0F172A", mb: 0.5 }}>
                            Personal Information
                        </Typography>
                        <Typography sx={{ fontSize: 12.5, color: "#64748B", mb: 3 }}>
                            Update your traveler contact details used for flight notifications and itineraries.
                        </Typography>

                        <Grid container spacing={2.5}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    value={profile.firstName}
                                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    value={profile.lastName}
                                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    value={profile.email}
                                    disabled
                                    helperText="Email is your account identifier and cannot be changed directly."
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    placeholder="+1 555-0199"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    helperText="Used for urgent flight delay and cancellation SMS notifications."
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 3.5, display: "flex", justifyContent: "flex-end" }}>
                            <Button
                                variant="contained"
                                onClick={handleSaveProfile}
                                disabled={loading}
                                startIcon={<SaveRounded />}
                                sx={{ px: 3, py: 1.1, borderRadius: "11px", bgcolor: "#2563EB", fontWeight: 750 }}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </Box>
                    </Paper>
                )}

                {/* TAB 1: SECURITY & PASSWORD */}
                {tabIndex === 1 && (
                    <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: "18px", border: "1px solid #E2E8F0" }}>
                        <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#0F172A", mb: 0.5 }}>
                            Security & Credentials
                        </Typography>
                        <Typography sx={{ fontSize: 12.5, color: "#64748B", mb: 3 }}>
                            Ensure your VoyagePilot AI account remains secure with strong authentication.
                        </Typography>

                        <Box sx={{ maxWidth: 500 }}>
                            <TextField
                                fullWidth
                                label="Current Password"
                                type={showCurrentPassword ? "text" : "password"}
                                value={password.currentPassword}
                                onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })}
                                sx={{ mb: 2 }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)} edge="end">
                                                {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                label="New Password"
                                type={showNewPassword ? "text" : "password"}
                                value={password.newPassword}
                                onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                                sx={{ mb: 2 }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Confirm New Password"
                                type={showConfirmPassword ? "text" : "password"}
                                value={password.confirmPassword}
                                onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
                                sx={{ mb: 3 }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                variant="contained"
                                onClick={handleChangePassword}
                                disabled={loading}
                                startIcon={<ShieldRounded />}
                                sx={{ px: 3, py: 1.1, borderRadius: "11px", bgcolor: "#2563EB", fontWeight: 750 }}
                            >
                                {loading ? "Updating..." : "Update Password"}
                            </Button>
                        </Box>
                    </Paper>
                )}

                {/* TAB 2: NOTIFICATIONS */}
                {tabIndex === 2 && (
                    <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: "18px", border: "1px solid #E2E8F0" }}>
                        <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#0F172A", mb: 0.5 }}>
                            Notification Preferences
                        </Typography>
                        <Typography sx={{ fontSize: 12.5, color: "#64748B", mb: 3 }}>
                            Configure which alerts you receive regarding your flights, trips, and stays.
                        </Typography>

                        <Stack spacing={2.5}>
                            {[
                                { key: "flight", title: "Flight Status & Delay Alerts", desc: "Real-time updates when departure times change or delays are announced." },
                                { key: "disruptions", title: "Severe Weather & Travel Disruptions", desc: "Automated warnings for airport closures and severe transit disruptions." },
                                { key: "ai", title: "AI Rebooking Advisories", desc: "Autonomous recommendations with optimized alternative routes." },
                                { key: "email", title: "Email Digests & Confirmations", desc: "Receive trip summary receipts and hotel reservation confirmations." },
                            ].map((item) => (
                                <Box key={item.key} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Box>
                                        <Typography sx={{ fontWeight: 750, fontSize: 13.5, color: "#0F172A" }}>{item.title}</Typography>
                                        <Typography sx={{ fontSize: 12, color: "#64748B" }}>{item.desc}</Typography>
                                    </Box>
                                    <Switch
                                        checked={notifications[item.key]}
                                        onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                                    />
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                )}

                {/* TAB 3: AI PREFERENCES */}
                {tabIndex === 3 && (
                    <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: "18px", border: "1px solid #E2E8F0" }}>
                        <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#0F172A", mb: 0.5 }}>
                            AI Travel Concierge Settings
                        </Typography>
                        <Typography sx={{ fontSize: 12.5, color: "#64748B", mb: 3 }}>
                            Control how VoyagePilot AI analyzes disruptions and assists with journey changes.
                        </Typography>

                        <Stack spacing={2.5}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Box>
                                    <Typography sx={{ fontWeight: 750, fontSize: 13.5, color: "#0F172A" }}>Autonomous Itinerary Updates</Typography>
                                    <Typography sx={{ fontSize: 12, color: "#64748B" }}>Automatically link rescheduled connecting flights to your trip calendar.</Typography>
                                </Box>
                                <Switch
                                    checked={aiPrefs.autoNotify}
                                    onChange={(e) => setAiPrefs({ ...aiPrefs, autoNotify: e.target.checked })}
                                />
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Box>
                                    <Typography sx={{ fontWeight: 750, fontSize: 13.5, color: "#0F172A" }}>Budget-Aware Rebooking</Typography>
                                    <Typography sx={{ fontSize: 12, color: "#64748B" }}>Prioritize alternative recommendations that fit within your specified trip budget.</Typography>
                                </Box>
                                <Switch
                                    checked={aiPrefs.budgetAwareness}
                                    onChange={(e) => setAiPrefs({ ...aiPrefs, budgetAwareness: e.target.checked })}
                                />
                            </Box>
                        </Stack>
                    </Paper>
                )}

                {/* TAB 4: SYSTEM & DANGER ZONE */}
                {tabIndex === 4 && (
                    <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: "18px", border: "1px solid #FCA5A5", bgcolor: "#FFF8F8" }}>
                        <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#DC2626", mb: 0.5 }}>
                            Danger Zone
                        </Typography>
                        <Typography sx={{ fontSize: 12.5, color: "#991B1B", mb: 3 }}>
                            Permanently delete your account and all associated travel records, itineraries, and flight data.
                        </Typography>

                        <Box sx={{ p: 2.5, borderRadius: "14px", bgcolor: "#FFFFFF", border: "1px solid #FECACA", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                            <Box>
                                <Typography sx={{ fontWeight: 750, fontSize: 14, color: "#0F172A" }}>
                                    Delete My VoyagePilot AI Account
                                </Typography>
                                <Typography sx={{ fontSize: 12, color: "#64748B", mt: 0.3 }}>
                                    This action is irreversible. All trips, bookings, expenses, and AI suggestions will be permanently erased.
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setDeleteAccountOpen(true)}
                                startIcon={<DeleteForeverRounded />}
                                sx={{ borderRadius: "10px", fontWeight: 750, textTransform: "none" }}
                            >
                                Delete Account
                            </Button>
                        </Box>
                    </Paper>
                )}
            </Box>

            {/* Account Deletion Confirmation Dialog */}
            <Dialog open={deleteAccountOpen} onClose={() => setDeleteAccountOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "18px" } }}>
                <DialogTitle sx={{ fontWeight: 800, color: "#DC2626" }}>Delete Account?</DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontSize: 13, color: "#334155" }}>
                        Are you sure you want to permanently delete your account? This action cannot be undone. All your trips, flights, and stored itineraries will be immediately deleted.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDeleteAccountOpen(false)} sx={{ fontWeight: 700, color: "#64748B" }}>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteAccount} color="error" variant="contained" disabled={loading} sx={{ fontWeight: 750, borderRadius: "10px" }}>
                        {loading ? "Deleting..." : "Permanently Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification Toast */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ width: "100%", borderRadius: "12px", fontWeight: 650 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </DashboardLayout>
    );
}
