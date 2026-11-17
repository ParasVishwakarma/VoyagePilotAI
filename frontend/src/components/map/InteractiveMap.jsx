import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import L from "leaflet";
import {
    Box, Paper, Typography, Stack, Chip, Button, IconButton, Tooltip,
    ButtonGroup, Divider
} from "@mui/material";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import CenterFocusStrongRoundedIcon from "@mui/icons-material/CenterFocusStrongRounded";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";
import ZoomOutRoundedIcon from "@mui/icons-material/ZoomOutRounded";

// Comprehensive Global Airports and Cities Coordinates Database
const GEO_COORDINATES = {
    // Airports (IATA)
    bom: { lat: 19.0896, lng: 72.8656, name: "Mumbai (BOM)", country: "India" },
    del: { lat: 28.5562, lng: 77.1000, name: "Delhi (DEL)", country: "India" },
    blr: { lat: 13.1986, lng: 77.7066, name: "Bengaluru (BLR)", country: "India" },
    goa: { lat: 15.3808, lng: 73.8314, name: "Goa (GOI)", country: "India" },
    dxb: { lat: 25.2532, lng: 55.3657, name: "Dubai (DXB)", country: "UAE" },
    lhr: { lat: 51.4700, lng: -0.4543, name: "London Heathrow (LHR)", country: "UK" },
    cdg: { lat: 49.0097, lng: 2.5479, name: "Paris Charles de Gaulle (CDG)", country: "France" },
    fra: { lat: 50.0379, lng: 8.5622, name: "Frankfurt (FRA)", country: "Germany" },
    zrh: { lat: 47.4582, lng: 8.5555, name: "Zurich (ZRH)", country: "Switzerland" },
    sin: { lat: 1.3644, lng: 103.9915, name: "Singapore Changi (SIN)", country: "Singapore" },
    hnd: { lat: 35.5494, lng: 139.7798, name: "Tokyo Haneda (HND)", country: "Japan" },
    nrt: { lat: 35.7720, lng: 140.3929, name: "Tokyo Narita (NRT)", country: "Japan" },
    jfk: { lat: 40.6413, lng: -73.7781, name: "New York JFK", country: "USA" },
    sfo: { lat: 37.6213, lng: -122.3790, name: "San Francisco (SFO)", country: "USA" },
    lax: { lat: 33.9416, lng: -118.4085, name: "Los Angeles (LAX)", country: "USA" },
    ord: { lat: 41.9742, lng: -87.9073, name: "Chicago O'Hare (ORD)", country: "USA" },
    syd: { lat: -33.9399, lng: 151.1753, name: "Sydney Kingsford (SYD)", country: "Australia" },
    mel: { lat: -37.6690, lng: 144.8410, name: "Melbourne (MEL)", country: "Australia" },
    ams: { lat: 52.3105, lng: 4.7683, name: "Amsterdam Schiphol (AMS)", country: "Netherlands" },
    fco: { lat: 41.8003, lng: 12.2389, name: "Rome Fiumicino (FCO)", country: "Italy" },
    bcn: { lat: 41.2974, lng: 2.0833, name: "Barcelona El Prat (BCN)", country: "Spain" },
    doh: { lat: 25.2731, lng: 51.6081, name: "Doha Hamad (DOH)", country: "Qatar" },
    bkk: { lat: 13.6900, lng: 100.7501, name: "Bangkok Suvarnabhumi (BKK)", country: "Thailand" },
    kul: { lat: 2.7456, lng: 101.7099, name: "Kuala Lumpur (KUL)", country: "Malaysia" },
    hkg: { lat: 22.3080, lng: 113.9185, name: "Hong Kong (HKG)", country: "Hong Kong" },

    // Cities
    mumbai: { lat: 19.0760, lng: 72.8777, name: "Mumbai", country: "India" },
    delhi: { lat: 28.6139, lng: 77.2090, name: "New Delhi", country: "India" },
    bangalore: { lat: 12.9716, lng: 77.5946, name: "Bengaluru", country: "India" },
    london: { lat: 51.5074, lng: -0.1278, name: "London", country: "UK" },
    paris: { lat: 48.8566, lng: 2.3522, name: "Paris", country: "France" },
    zurich: { lat: 47.3769, lng: 8.5417, name: "Zurich", country: "Switzerland" },
    switzerland: { lat: 46.8182, lng: 8.2275, name: "Switzerland", country: "Europe" },
    frankfurt: { lat: 50.1109, lng: 8.6821, name: "Frankfurt", country: "Germany" },
    dubai: { lat: 25.2048, lng: 55.2708, name: "Dubai", country: "UAE" },
    singapore: { lat: 1.3521, lng: 103.8198, name: "Singapore", country: "Singapore" },
    tokyo: { lat: 35.6762, lng: 139.6503, name: "Tokyo", country: "Japan" },
    newyork: { lat: 40.7128, lng: -74.0060, name: "New York", country: "USA" },
    sanfrancisco: { lat: 37.7749, lng: -122.4194, name: "San Francisco", country: "USA" },
    rome: { lat: 41.9028, lng: 12.4964, name: "Rome", country: "Italy" },
    barcelona: { lat: 41.3851, lng: 2.1734, name: "Barcelona", country: "Spain" },
    bali: { lat: -8.4095, lng: 115.1889, name: "Bali", country: "Indonesia" },
    sydney: { lat: -33.8688, lng: 151.2093, name: "Sydney", country: "Australia" },
};

function resolveCoords(str) {
    if (!str) return null;
    const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");
    for (const [key, val] of Object.entries(GEO_COORDINATES)) {
        if (clean === key || clean.includes(key) || key.includes(clean)) {
            return val;
        }
    }
    // Deterministic fallback based on hash of string
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
    const lat = 12 + (Math.abs(hash) % 45);
    const lng = -20 + (Math.abs(hash >> 3) % 150);
    return { lat, lng, name: str, country: "Global" };
}

// Generate curved geodesic points between start and end coordinates
function generateCurvedPath(start, end, numPoints = 60) {
    const points = [];
    const lat1 = start.lat;
    const lng1 = start.lng;
    const lat2 = end.lat;
    const lng2 = end.lng;

    // Midpoint with curve offset
    const midLat = (lat1 + lat2) / 2;
    const midLng = (lng1 + lng2) / 2;
    const distance = Math.hypot(lat2 - lat1, lng2 - lng1);
    const curveOffset = Math.min(20, distance * 0.18);

    // Control point for quadratic curve
    const ctrlLat = midLat + curveOffset;
    const ctrlLng = midLng;

    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        // Quadratic bezier interpolation
        const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * ctrlLat + t * t * lat2;
        const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * ctrlLng + t * t * lng2;
        points.push([lat, lng]);
    }
    return points;
}

// Calculate angle between two points for airplane orientation
function calculateBearing(start, end) {
    const lat1 = (start[0] * Math.PI) / 180;
    const lat2 = (end[0] * Math.PI) / 180;
    const dLng = ((end[1] - start[1]) * Math.PI) / 180;

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    const brng = (Math.atan2(y, x) * 180) / Math.PI;
    return (brng + 360) % 360;
}

const TILE_LAYERS = {
    voyager: {
        name: "Voyager",
        url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
    light: {
        name: "Light Clean",
        url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    },
    satellite: {
        name: "Satellite",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    },
};

export default function InteractiveMap({ trips = [], flights = [], hotels = [] }) {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const tileLayerRef = useRef(null);
    const animationFrameRef = useRef(null);
    const flightAnimatorsRef = useRef([]);

    const [activeLayer, setActiveLayer] = useState("voyager");
    const [stats, setStats] = useState({ totalCorridors: 0, totalHotels: 0, totalDestinations: 0 });

    // Initialize Map Instance once
    useEffect(() => {
        if (!mapContainerRef.current) return;
        if (mapInstanceRef.current) return;

        const map = L.map(mapContainerRef.current, {
            center: [25, 45],
            zoom: 3,
            minZoom: 2,
            maxZoom: 18,
            zoomControl: false,
        });

        const initialLayer = L.tileLayer(TILE_LAYERS[activeLayer].url, {
            attribution: TILE_LAYERS[activeLayer].attribution,
            maxZoom: 19,
        }).addTo(map);

        tileLayerRef.current = initialLayer;
        mapInstanceRef.current = map;

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Change Tile Layer on selection
    useEffect(() => {
        if (!mapInstanceRef.current || !tileLayerRef.current) return;
        mapInstanceRef.current.removeLayer(tileLayerRef.current);
        const newLayer = L.tileLayer(TILE_LAYERS[activeLayer].url, {
            attribution: TILE_LAYERS[activeLayer].attribution,
            maxZoom: 19,
        }).addTo(mapInstanceRef.current);
        tileLayerRef.current = newLayer;
    }, [activeLayer]);

    // Render Markers, Polylines, and Flight Motion Animation
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        // Clear existing markers, lines, animations
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        flightAnimatorsRef.current = [];

        // Layer group to hold current dynamic overlays
        const overlaysLayer = L.layerGroup().addTo(map);
        const allBounds = [];

        // 1. Process Destination Waypoints
        trips.forEach((trip) => {
            const destName = trip.destination || trip.title;
            const coords = resolveCoords(destName);
            if (!coords) return;

            allBounds.push([coords.lat, coords.lng]);

            const markerHtml = `
                <div class="dest-pin-marker">
                    <span>📍</span>
                    <span>${coords.name}</span>
                </div>
            `;
            const destIcon = L.divIcon({
                className: "custom-dest-icon",
                html: markerHtml,
                iconSize: [110, 28],
                iconAnchor: [55, 14],
            });

            const marker = L.marker([coords.lat, coords.lng], { icon: destIcon }).addTo(overlaysLayer);

            const popupContent = `
                <div style="padding: 14px 16px; min-width: 200px; font-family: Inter, sans-serif;">
                    <div style="font-size: 10px; font-weight: 800; color: #6366F1; text-transform: uppercase; letter-spacing: 0.5px;">Trip Destination</div>
                    <div style="font-size: 15px; font-weight: 800; color: #0F172A; margin: 4px 0;">${trip.title || coords.name}</div>
                    <div style="font-size: 12px; color: #64748B; margin-bottom: 8px;">${coords.country}</div>
                    <div style="display: flex; gap: 8px; font-size: 11px; color: #475569;">
                        <span>📅 ${trip.startDate ? new Date(trip.startDate).toLocaleDateString() : "Planned"}</span>
                        ${trip.budget ? `<span style="font-weight: 700; color: #059669;">₹${Number(trip.budget).toLocaleString()}</span>` : ""}
                    </div>
                </div>
            `;
            marker.bindPopup(popupContent);
        });

        // 2. Process Hotel Stays
        hotels.forEach((hotel) => {
            const locName = hotel.address || hotel.name;
            const coords = resolveCoords(locName);
            if (!coords) return;

            // Apply deterministic jitter to prevent overlap with destination pin
            const jitterLat = coords.lat + ((((Number(hotel.id) || 1) * 13) % 7) * 0.03 - 0.09);
            const jitterLng = coords.lng + ((((Number(hotel.id) || 1) * 23) % 7) * 0.03 - 0.09);
            allBounds.push([jitterLat, jitterLng]);

            const hotelHtml = `
                <div class="hotel-pin-marker">
                    <span>🏨</span>
                    <span>${hotel.name || "Hotel Stay"}</span>
                </div>
            `;
            const hotelIcon = L.divIcon({
                className: "custom-hotel-icon",
                html: hotelHtml,
                iconSize: [120, 28],
                iconAnchor: [60, 14],
            });

            const marker = L.marker([jitterLat, jitterLng], { icon: hotelIcon }).addTo(overlaysLayer);

            const popupContent = `
                <div style="padding: 14px 16px; min-width: 220px; font-family: Inter, sans-serif;">
                    <div style="font-size: 10px; font-weight: 800; color: #10B981; text-transform: uppercase; letter-spacing: 0.5px;">Hotel & Accommodation</div>
                    <div style="font-size: 15px; font-weight: 800; color: #0F172A; margin: 4px 0;">${hotel.name}</div>
                    <div style="font-size: 11.5px; color: #64748B; margin-bottom: 8px;">${hotel.address || coords.name}</div>
                    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 6px 10px; border-radius: 8px; font-size: 11px; margin-bottom: 8px;">
                        <div>🛏️ ${hotel.roomType || "Standard Suite"} · <b style="color: #059669;">${hotel.price ? "₹" + Number(hotel.price).toLocaleString() : "Confirmed"}</b></div>
                        ${hotel.confirmationCode ? `<div style="color: #64748B; margin-top: 2px;">Code: <code style="font-weight: 700; color: #2563EB;">${hotel.confirmationCode}</code></div>` : ""}
                    </div>
                </div>
            `;
            marker.bindPopup(popupContent);
        });

        // 3. Process Flight Corridors & Animated Planes in Motion
        const animators = [];

        flights.forEach((flight) => {
            const depCoords = resolveCoords(flight.departureAirport);
            const arrCoords = resolveCoords(flight.arrivalAirport);
            if (!depCoords || !arrCoords) return;

            allBounds.push([depCoords.lat, depCoords.lng]);
            allBounds.push([arrCoords.lat, arrCoords.lng]);

            // Add Pulsing Radar Circles at departure and arrival hubs
            const radarIcon = L.divIcon({
                className: "custom-radar-icon",
                html: `<div class="pulse-airport-marker"><div class="radar-ring"></div><div class="radar-dot"></div></div>`,
                iconSize: [28, 28],
                iconAnchor: [14, 14],
            });
            L.marker([depCoords.lat, depCoords.lng], { icon: radarIcon }).addTo(overlaysLayer)
                .bindPopup(`<b style="font-family: Inter, sans-serif;">Departure: ${depCoords.name}</b>`);
            L.marker([arrCoords.lat, arrCoords.lng], { icon: radarIcon }).addTo(overlaysLayer)
                .bindPopup(`<b style="font-family: Inter, sans-serif;">Arrival: ${arrCoords.name}</b>`);

            // Generate curved path
            const pathPoints = generateCurvedPath(depCoords, arrCoords, 80);

            // Draw glowing curved trajectory line
            L.polyline(pathPoints, {
                color: "#10B981",
                weight: 2.5,
                opacity: 0.8,
                dashArray: "6, 8",
                lineCap: "round",
            }).addTo(overlaysLayer);

            // Create Animated Airplane Marker in Motion
            const planeIcon = L.divIcon({
                className: "airplane-icon-container",
                html: `<div class="airplane-motion-marker"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg></div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16],
            });

            const planeMarker = L.marker(pathPoints[0], { icon: planeIcon }).addTo(overlaysLayer);

            const planePopupContent = `
                <div style="padding: 14px 16px; min-width: 220px; font-family: Inter, sans-serif;">
                    <div style="font-size: 10px; font-weight: 800; color: #10B981; text-transform: uppercase; letter-spacing: 0.5px;">Active Flight Corridor</div>
                    <div style="font-size: 16px; font-weight: 800; color: #0F172A; margin: 4px 0;">${flight.airline || "Flight"} ${flight.flightNumber || ""}</div>
                    <div style="font-size: 12.5px; font-weight: 700; color: #334155;">${depCoords.name} → ${arrCoords.name}</div>
                    <div style="margin-top: 8px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 11px; color: #64748B;">Status:</span>
                        <span style="background: #ECFDF5; color: #059669; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 6px;">${flight.status || "IN MOTION"}</span>
                    </div>
                </div>
            `;
            planeMarker.bindPopup(planePopupContent);

            // Animator state for this flight
            animators.push({
                marker: planeMarker,
                points: pathPoints,
                index: Math.floor(Math.random() * pathPoints.length), // Stagger airplanes along path
                speed: 0.25 + (Math.random() * 0.15),
            });
        });

        flightAnimatorsRef.current = animators;

        // Start requestAnimationFrame loop for continuous real flight motion
        let lastTime = performance.now();
        const animateFlights = (currentTime) => {
            const delta = (currentTime - lastTime) / 1000;
            lastTime = currentTime;

            flightAnimatorsRef.current.forEach((anim) => {
                anim.index = (anim.index + anim.speed) % anim.points.length;
                const currIdx = Math.floor(anim.index);
                const nextIdx = (currIdx + 1) % anim.points.length;
                const pos = anim.points[currIdx];
                const nextPos = anim.points[nextIdx];

                anim.marker.setLatLng(pos);

                // Rotate airplane icon towards heading
                const bearing = calculateBearing(pos, nextPos);
                const iconElement = anim.marker.getElement()?.querySelector(".airplane-motion-marker");
                if (iconElement) {
                    iconElement.style.transform = `rotate(${bearing}deg)`;
                }
            });

            animationFrameRef.current = requestAnimationFrame(animateFlights);
        };

        if (animators.length > 0) {
            animationFrameRef.current = requestAnimationFrame(animateFlights);
        }

        // Fit map bounds to show all user markers nicely
        if (allBounds.length > 0) {
            try {
                map.fitBounds(allBounds, { padding: [50, 50], maxZoom: 6 });
            } catch (e) {
                console.error("Fit bounds error", e);
            }
        }

        setStats({
            totalCorridors: flights.length,
            totalHotels: hotels.length,
            totalDestinations: trips.length,
        });

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (map.hasLayer(overlaysLayer)) {
                map.removeLayer(overlaysLayer);
            }
        };
    }, [trips, flights, hotels]);

    // Zoom Controls
    const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
    const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
    const handleResetView = () => {
        if (!mapInstanceRef.current) return;
        mapInstanceRef.current.setView([25, 45], 3);
    };

    return (
        <Paper
            elevation={0}
            sx={{
                position: "relative",
                borderRadius: "24px",
                border: "1px solid #E2E8F0",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
                background: "#FFFFFF",
            }}
        >
            {/* Top Interactive Controls Toolbar */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
                sx={{
                    p: 2.2,
                    borderBottom: "1px solid #F1F5F9",
                    bgcolor: "#FFFFFF",
                }}
            >
                {/* Stats Pills */}
                <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
                    <Chip
                        icon={<FlightTakeoffRoundedIcon sx={{ fontSize: "15px !important", color: "#10B981" }} />}
                        label={`${stats.totalCorridors} Active Corridors`}
                        sx={{ bgcolor: "#ECFDF5", color: "#059669", fontWeight: 750, fontSize: "0.75rem", borderRadius: "10px" }}
                    />
                    <Chip
                        icon={<HotelRoundedIcon sx={{ fontSize: "15px !important", color: "#10B981" }} />}
                        label={`${stats.totalHotels} Hotel Stays`}
                        sx={{ bgcolor: "#ECFDF5", color: "#059669", fontWeight: 750, fontSize: "0.75rem", borderRadius: "10px" }}
                    />
                    <Chip
                        icon={<PlaceRoundedIcon sx={{ fontSize: "15px !important", color: "#6366F1" }} />}
                        label={`${stats.totalDestinations} Destinations`}
                        sx={{ bgcolor: "#EEF2FF", color: "#4F46E5", fontWeight: 750, fontSize: "0.75rem", borderRadius: "10px" }}
                    />
                </Stack>

                {/* Map Mode Buttons & Reset */}
                <Stack direction="row" spacing={1.5} alignItems="center">
                    {/* Layer Switcher */}
                    <ButtonGroup size="small" sx={{ borderRadius: "10px", bgcolor: "#F8FAFC" }}>
                        {Object.entries(TILE_LAYERS).map(([key, item]) => (
                            <Button
                                key={key}
                                onClick={() => setActiveLayer(key)}
                                variant={activeLayer === key ? "contained" : "text"}
                                sx={{
                                    textTransform: "none",
                                    fontSize: "0.78rem",
                                    fontWeight: 700,
                                    borderRadius: "8px",
                                    bgcolor: activeLayer === key ? "#2563EB" : "transparent",
                                    color: activeLayer === key ? "#FFFFFF" : "#64748B",
                                    "&:hover": { bgcolor: activeLayer === key ? "#1D4ED8" : "rgba(0,0,0,0.04)" },
                                }}
                            >
                                {item.name}
                            </Button>
                        ))}
                    </ButtonGroup>

                    <Tooltip title="Reset View">
                        <IconButton
                            size="small"
                            onClick={handleResetView}
                            sx={{
                                border: "1px solid #E2E8F0",
                                borderRadius: "10px",
                                color: "#475569",
                                "&:hover": { bgcolor: "#F1F5F9" },
                            }}
                        >
                            <CenterFocusStrongRoundedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>

            {/* Map Container */}
            <Box sx={{ position: "relative", height: { xs: 460, sm: 580, md: 640 }, width: "100%" }}>
                <div
                    ref={mapContainerRef}
                    style={{ height: "100%", width: "100%", outline: "none" }}
                />

                {/* Floating Map Zoom Widget */}
                <Paper
                    elevation={3}
                    sx={{
                        position: "absolute",
                        bottom: 24,
                        right: 24,
                        zIndex: 1000,
                        borderRadius: "14px",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid #E2E8F0",
                        bgcolor: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <IconButton size="small" onClick={handleZoomIn} sx={{ p: 1, color: "#334155" }}>
                        <ZoomInRoundedIcon fontSize="small" />
                    </IconButton>
                    <Divider />
                    <IconButton size="small" onClick={handleZoomOut} sx={{ p: 1, color: "#334155" }}>
                        <ZoomOutRoundedIcon fontSize="small" />
                    </IconButton>
                </Paper>

                {/* In-Motion Indicator Pill */}
                <Paper
                    elevation={2}
                    sx={{
                        position: "absolute",
                        top: 18,
                        left: 18,
                        zIndex: 1000,
                        py: 0.6,
                        px: 1.4,
                        borderRadius: "20px",
                        bgcolor: "rgba(255, 255, 255, 0.94)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid #E2E8F0",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <Box
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "#10B981",
                            boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.25)",
                        }}
                    />
                    <Typography variant="caption" sx={{ fontSize: "0.75rem", fontWeight: 750, color: "#0F172A" }}>
                        Live Geospatial Telemetry · In Motion
                    </Typography>
                </Paper>
            </Box>
        </Paper>
    );
}
