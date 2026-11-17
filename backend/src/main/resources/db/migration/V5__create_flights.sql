CREATE TABLE flights (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,

                         trip_id BIGINT NOT NULL,

                         airline VARCHAR(255) NOT NULL,

                         flight_number VARCHAR(255) NOT NULL,

                         departure_airport VARCHAR(255) NOT NULL,

                         arrival_airport VARCHAR(255) NOT NULL,

                         departure_terminal VARCHAR(255),

                         arrival_terminal VARCHAR(255),

                         departure_gate VARCHAR(255),

                         arrival_gate VARCHAR(255),

                         departure_time DATETIME,

                         arrival_time DATETIME,

                         status VARCHAR(50),

                         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                         updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                             ON UPDATE CURRENT_TIMESTAMP,

                         CONSTRAINT fk_flight_trip
                             FOREIGN KEY (trip_id)
                                 REFERENCES trips(id)
                                 ON DELETE CASCADE
);