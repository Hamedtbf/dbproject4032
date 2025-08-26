CREATE DATABASE IF NOT EXISTS ticket_reservation;

USE ticket_reservation;

CREATE TABLE User (
    id INT NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL DEFAULT 'customer', -- customer, admin
    city VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    accountState TINYINT(1) NOT NULL DEFAULT 1, -- 1 means active, 0 means inactive
    registerDate DATE NOT NULL DEFAULT (CURRENT_DATE),
    balance INT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE Class (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL, -- economy, business, VIP
    PRIMARY KEY(id)
);

CREATE TABLE Company (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE Ticket (
    id INT NOT NULL AUTO_INCREMENT,
    vehicle_type VARCHAR(255) NOT NULL,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    arrival_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    arrival_time TIME NOT NULL DEFAULT (CURRENT_TIME),
    departure_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    departure_time TIME NOT NULL DEFAULT (CURRENT_TIME),
    price INT NOT NULL,
    remaining_cap INT NOT NULL,
    company_id INT NOT NULL,
    class_id INT NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_ticket_company FOREIGN KEY (company_id) REFERENCES Company(id),
    CONSTRAINT fk_ticket_class FOREIGN KEY (class_id) REFERENCES Class(id),
    INDEX idx_source_dest (source, destination),
    INDEX idx_departure (departure_date, departure_time)
);

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

CREATE TABLE Reservation (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    ticket_id INT NOT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'reserved', -- reserved, paid, canceled, canceled by support
    reserve_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expire_time DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 10 MINUTE),
    PRIMARY KEY(id),
    CONSTRAINT fk_res_user FOREIGN KEY (user_id) REFERENCES User(id),
    CONSTRAINT fk_res_ticket FOREIGN KEY (ticket_id) REFERENCES Ticket(id),
    INDEX idx_user_id (user_id)
);

CREATE TABLE Payment (
    id INT NOT NULL AUTO_INCREMENT,
    reservation_id INT NOT NULL,
    price INT NOT NULL,
    method VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'successful', -- successful, unsuccessful, returned
    payment_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    CONSTRAINT fk_payment_res FOREIGN KEY (reservation_id) REFERENCES Reservation(id)
);

CREATE TABLE Report (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    reservation_id INT NOT NULL,
    category VARCHAR(255) NOT NULL, -- delay, problem in payment, etc.
    description VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'pending', -- resolved, pending
    response VARCHAR(255) NOT NULL DEFAULT '',
    PRIMARY KEY(id),
    CONSTRAINT fk_report_user FOREIGN KEY (user_id) REFERENCES User(id),
    CONSTRAINT fk_report_reservation FOREIGN KEY (reservation_id) REFERENCES Reservation(id)
);
