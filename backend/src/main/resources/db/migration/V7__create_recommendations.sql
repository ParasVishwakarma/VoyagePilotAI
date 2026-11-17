CREATE TABLE recommendations (
                                 id BIGINT AUTO_INCREMENT PRIMARY KEY,

                                 disruption_id BIGINT NOT NULL,

                                 type VARCHAR(50) NOT NULL,

                                 message TEXT NOT NULL,

                                 accepted BOOLEAN NOT NULL DEFAULT FALSE,

                                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                 CONSTRAINT fk_recommendation_disruption
                                     FOREIGN KEY (disruption_id)
                                         REFERENCES disruptions(id)
                                         ON DELETE CASCADE
);