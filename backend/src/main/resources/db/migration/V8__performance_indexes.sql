-- Performance indexes for tenant queries, joins, and cascading deletions
CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trips_start_date ON trips(start_date);
CREATE INDEX idx_flights_trip_id ON flights(trip_id);
CREATE INDEX idx_flights_status ON flights(status);
CREATE INDEX idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX idx_itineraries_trip_id ON itineraries(trip_id);
CREATE INDEX idx_itineraries_type ON itineraries(type);
CREATE INDEX idx_disruptions_flight_id ON disruptions(flight_id);
CREATE INDEX idx_disruptions_resolved ON disruptions(resolved);
CREATE INDEX idx_recommendations_disruption_id ON recommendations(disruption_id);
