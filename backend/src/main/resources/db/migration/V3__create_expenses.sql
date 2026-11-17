CREATE TABLE expenses (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,

                          amount DECIMAL(10,2) NOT NULL,

                          category VARCHAR(50) NOT NULL,

                          description VARCHAR(255),

                          expense_date DATE NOT NULL,

                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,

                          trip_id BIGINT NOT NULL,

                          CONSTRAINT fk_expense_trip
                              FOREIGN KEY (trip_id)
                                  REFERENCES trips(id)
                                  ON DELETE CASCADE
);