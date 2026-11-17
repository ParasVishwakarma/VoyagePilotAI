CREATE TABLE trips (

                       id BIGINT PRIMARY KEY AUTO_INCREMENT,

                       title VARCHAR(150) NOT NULL,

                       destination VARCHAR(150) NOT NULL,

                       description TEXT,

                       start_date DATE NOT NULL,

                       end_date DATE NOT NULL,

                       budget DECIMAL(10,2),

                       status VARCHAR(30) NOT NULL DEFAULT 'PLANNED',

                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                           ON UPDATE CURRENT_TIMESTAMP,

                       user_id BIGINT NOT NULL,

                       CONSTRAINT fk_trip_user
                           FOREIGN KEY (user_id)
                               REFERENCES users(id)
                               ON DELETE CASCADE
);