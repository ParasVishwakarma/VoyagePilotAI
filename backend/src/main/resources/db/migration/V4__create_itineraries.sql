CREATE TABLE itineraries (
                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             trip_id BIGINT NOT NULL,
                             title VARCHAR(255) NOT NULL,
                             type VARCHAR(50) NOT NULL,
                             description TEXT,
                             location VARCHAR(255),
                             start_time DATETIME,
                             end_time DATETIME,
                             booking_reference VARCHAR(255),
                             status VARCHAR(50) NOT NULL,
                             sequence INT,
                             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                                 ON UPDATE CURRENT_TIMESTAMP,

                             CONSTRAINT fk_itinerary_trip
                                 FOREIGN KEY (trip_id)
                                     REFERENCES trips(id)
                                     ON DELETE CASCADE
);