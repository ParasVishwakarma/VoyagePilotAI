import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { SearchProvider } from "./context/SearchContext";

// Lazy-loaded pages for optimized bundle splitting
const Landing = lazy(() => import("./pages/landing/Landing"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Trips = lazy(() => import("./pages/trips/Trips"));
const Flights = lazy(() => import("./pages/flights/Flights"));
const Hotels = lazy(() => import("./pages/hotels/Hotels"));
const TravelMap = lazy(() => import("./pages/map/TravelMap"));
const Disruptions = lazy(() => import("./pages/disruptions/Disruptions"));
const Recommendations = lazy(() => import("./pages/recommendations/Recommendations"));
const Analytics = lazy(() => import("./pages/analytics/Analytics"));
const Settings = lazy(() => import("./pages/settings/Settings"));

function PageFallback() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                bgcolor: "#F8FAFC",
            }}
        >
            <CircularProgress sx={{ color: "#2563EB" }} />
        </Box>
    );
}

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
    const token = localStorage.getItem("token");
    return token ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
    const token = localStorage.getItem("token");

    return (
        <SearchProvider>
            <BrowserRouter>
                <Suspense fallback={<PageFallback />}>
                    <Routes>
                        {/* Root & Landing Route */}
                        <Route path="/" element={<Landing />} />
                        <Route path="/landing" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />

                        {/* Protected Application Console */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/trips"
                            element={
                                <ProtectedRoute>
                                    <Trips />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/flights"
                            element={
                                <ProtectedRoute>
                                    <Flights />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/hotels"
                            element={
                                <ProtectedRoute>
                                    <Hotels />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/map"
                            element={
                                <ProtectedRoute>
                                    <TravelMap />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/disruptions"
                            element={
                                <ProtectedRoute>
                                    <Disruptions />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/recommendations"
                            element={
                                <ProtectedRoute>
                                    <Recommendations />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/analytics"
                            element={
                                <ProtectedRoute>
                                    <Analytics />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                <ProtectedRoute>
                                    <Settings />
                                </ProtectedRoute>
                            }
                        />

                        {/* Fallback 404 */}
                        <Route
                            path="*"
                            element={
                                token ? (
                                    <Navigate to="/dashboard" replace />
                                ) : (
                                    <Navigate to="/landing" replace />
                                )
                            }
                        />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </SearchProvider>
    );
}
