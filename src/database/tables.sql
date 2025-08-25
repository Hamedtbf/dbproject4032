-- Schema with corrections for table creation errors only.
-- Data types are kept as originally specified, with INT(1) changed to TINYINT(1) for boolean-like fields.
-- Added default CURRENT_TIMESTAMP for DATETIME columns.

CREATE TABLE User (
    id INT NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    registerDate DATE NOT NULL,
    city VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    accountState TINYINT(1) NOT NULL, -- 1 means active, 0 means inactive
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    balance INT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE Class (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL, -- economy, business, VIP
    PRIMARY KEY(id)
);

CREATE TABLE Company (
    id INT NOT NULL AUTO_INCREMENT, -- Added AUTO_INCREMENT to allow creation
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
);

-- Main table for all tickets.
-- Fixed missing commas and incorrect foreign key references.
-- Changed class_id to INT to match the Class(id) it references, which is required to prevent a creation error.
CREATE TABLE Ticket (
    id INT NOT NULL AUTO_INCREMENT,
    vehicle_type INT NOT NULL,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    arrival_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    departure_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    price INT NOT NULL,
    remaining_cap INT NOT NULL,
    company_id INT NOT NULL,
    class_id INT NOT NULL, -- This MUST be INT to reference Class(id)
    PRIMARY KEY(id),
    CONSTRAINT fk_ticket_company FOREIGN KEY (company_id) REFERENCES Company(id),
    CONSTRAINT fk_ticket_class FOREIGN KEY (class_id) REFERENCES Class(id),
    INDEX idx_source_dest (source, destination),
    INDEX idx_departure_time (departure_time)
);


-- Corrected typo 'CONSTAINT' and table reference 'ticket' to 'Ticket'.
CREATE TABLE TrainDetails (
    ticket_id INT NOT NULL,
    stars INT NOT NULL,
    has_bed TINYINT(1) NOT NULL,
    has_service TINYINT(1) NOT NULL,
    has_internet TINYINT(1) NOT NULL,
    has_condition TINYINT(1) NOT NULL,
    PRIMARY KEY(ticket_id),
    CONSTRAINT fk_train_ticket FOREIGN KEY (ticket_id) REFERENCES Ticket(id)
);

-- Corrected typo 'CONSTAINT' and table reference 'ticket' to 'Ticket'.
CREATE TABLE FlightDetails (
    ticket_id INT NOT NULL,
    flight_class VARCHAR(255) NOT NULL, -- economy, business, first class
    stops INT NOT NULL,
    flight_number INT NOT NULL,
    source_airport VARCHAR(255) NOT NULL,
    destination_airport VARCHAR(255) NOT NULL,
    has_bed TINYINT(1) NOT NULL,
    has_service TINYINT(1) NOT NULL,
    has_internet TINYINT(1) NOT NULL,
    PRIMARY KEY(ticket_id),
    CONSTRAINT fk_flight_ticket FOREIGN KEY (ticket_id) REFERENCES Ticket(id)
);

-- Corrected typo 'CONSTAINT' and table reference 'ticket' to 'Ticket'.
CREATE TABLE BusDetails (
    ticket_id INT NOT NULL,
    bus_class VARCHAR(255) NOT NULL, -- VIP, normal
    seats_in_row VARCHAR(255) NOT NULL, -- 2+2, 1+2
    has_condition TINYINT(1) NOT NULL,
    has_service TINYINT(1) NOT NULL,
    has_monitor TINYINT(1) NOT NULL,
    PRIMARY KEY(ticket_id),
    CONSTRAINT fk_bus_ticket FOREIGN KEY (ticket_id) REFERENCES Ticket(id)
);

-- Fixed missing comma and incorrect foreign key references.
-- Note: Using an expression for a DEFAULT value requires MySQL 8.0.13+ or MariaDB 10.2.1+.
CREATE TABLE Reservation (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    ticket_id INT NOT NULL,
    status VARCHAR(255) NOT NULL, -- reserved, paid, canceled, canceled by support
    reserve_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expire_time DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 10 MINUTE),
    PRIMARY KEY(id),
    CONSTRAINT fk_res_user FOREIGN KEY (user_id) REFERENCES User(id),
    CONSTRAINT fk_res_ticket FOREIGN KEY (ticket_id) REFERENCES Ticket(id),
    INDEX idx_user_id (user_id)
);

-- Fixed missing comma and incorrect foreign key reference.
CREATE TABLE Payment (
    id INT NOT NULL AUTO_INCREMENT,
    reservation_id INT NOT NULL,
    price INT NOT NULL,
    method VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL, -- successful, unsuccessful, pending
    payment_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    CONSTRAINT fk_payment_res FOREIGN KEY (reservation_id) REFERENCES Reservation(id)
);

-- Fixed missing commas and incorrect foreign key references.
CREATE TABLE Report (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    reservation_id INT NOT NULL,
    category VARCHAR(255) NOT NULL, -- delay, problem in payment, etc.
    description VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL, -- resolved, pending
    PRIMARY KEY(id),
    CONSTRAINT fk_report_user FOREIGN KEY (user_id) REFERENCES User(id),
    CONSTRAINT fk_report_reservation FOREIGN KEY (reservation_id) REFERENCES Reservation(id)
);
