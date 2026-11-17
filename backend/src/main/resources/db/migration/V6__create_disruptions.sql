CREATE TABLE disruptions (
                             id BIGINT AUTO_INCREMENT PRIMARY KEY,

                             flight_id BIGINT NOT NULL,

                             type VARCHAR(50) NOT NULL,

                             severity VARCHAR(20) NOT NULL,

                             description TEXT,

                             resolved BOOLEAN NOT NULL DEFAULT FALSE,

                             detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                             CONSTRAINT fk_disruption_flight
                                 FOREIGN KEY (flight_id)
                                     REFERENCES flights(id)
                                     ON DELETE CASCADE
);