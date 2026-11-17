CREATE TABLE roles (
                       id BIGINT PRIMARY KEY AUTO_INCREMENT,
                       name VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE users (
                       id BIGINT PRIMARY KEY AUTO_INCREMENT,

                       first_name VARCHAR(100) NOT NULL,
                       last_name VARCHAR(100) NOT NULL,

                       email VARCHAR(150) NOT NULL UNIQUE,
                       phone VARCHAR(20),

                       password VARCHAR(255) NOT NULL,

                       enabled BOOLEAN DEFAULT TRUE,
                       account_non_locked BOOLEAN DEFAULT TRUE,

                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                           ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
                            user_id BIGINT NOT NULL,
                            role_id BIGINT NOT NULL,

                            PRIMARY KEY(user_id, role_id),

                            CONSTRAINT fk_user
                                FOREIGN KEY(user_id)
                                    REFERENCES users(id)
                                    ON DELETE CASCADE,

                            CONSTRAINT fk_role
                                FOREIGN KEY(role_id)
                                    REFERENCES roles(id)
                                    ON DELETE CASCADE
);

CREATE TABLE refresh_tokens (
                                id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                token VARCHAR(500) NOT NULL UNIQUE,

                                expiry_date TIMESTAMP NOT NULL,

                                user_id BIGINT NOT NULL UNIQUE,

                                CONSTRAINT fk_refresh_user
                                    FOREIGN KEY(user_id)
                                        REFERENCES users(id)
                                        ON DELETE CASCADE
);

INSERT INTO roles(name)
VALUES ('ROLE_USER'),
       ('ROLE_ADMIN');