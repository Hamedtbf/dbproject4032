CREATE TABLE User (
id INT NOT NULL AUTO_INCREMENT,
firstName VARCHAR(255) NOT NULL,
lastName VARCHAR(255) NOT NULL,
password VARCHAR(255) NOT NULL,
role VARCHAR(255) NOT NULL,
registerDate DATE NOT NULL,
city VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
accountState INT(1) NOT NULL, -- 1 means active, 0 means
created_at DATETIME NOT NULL,
balance INT NOT NULL,
PRIMARY KEY(id)
);

CREATE TABLE Class (
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(255) NOT NULL, -- economy, business, VIP
PRIMARY KEY(id)
);
CREATE TABLE Company (
id INT NOT NULL,
name VARCHAR(255) NOT NULL,
PRIMARY KEY(id)
);

CREATE TABLE TrainDetails (
    ticket_id INT NOT NULL,
    stars INT NOT NULL,
    has_bed INT(1) NOT NULL,
    has_service INT(1) NOT NULL,
    has_internet INT(1) NOT NULL,
    has_condition INT(1) NOT NULL,
    PRIMARY KEY(ticket_id)
    CONSTAINT fk1 Foreign Key (ticket_id) REFERENCES ticket(id)

)

CREATE TABLE FlightDetails (
    ticket_id INT NOT NULL,
    flight_class VARCHAR(255) NOT NULL, -- economy, business, first class
    stops INT NOT NULL,
    flight_number INT NOT NULL,
    source_airport VARCHAR(255) NOT NULL,
    destination_airport VARCHAR(255) NOT NULL,
    has_bed INT(1) NOT NULL,
    has_service INT(1) NOT NULL,
    has_internet INT(1) NOT NULL,
    CONSTAINT fk1 Foreign Key (ticket_id) REFERENCES ticket(id)

)

CREATE TABLE BusDetails (
    ticket_id INT NOT NULL,
    bus_class VARCHAR(255) NOT NULL, -- VIP, normal
    seats_in_row VARCHAR(255) NOT NULL, -- 2+2, 1+2
    has_condition INT(1) NOT NULL,
    has_service INT(1) NOT NULL,
    has_monitor INT(1) NOT NULL,
    CONSTAINT fk1 Foreign Key (ticket_id) REFERENCES ticket(id)

)
CREATE TABLE Ticket (
id INT NOT NULL AUTO_INCREMENT,
vehicle_type INT NOT NULL,
source VARCHAR(255) NOT NULL,
destination VARCHAR(255) NOT NULL,
arrival_time DATETIME NOT NULL,
departure_time DATETIME NOT NULL,
price INT NOT NULL,
remaining_cap INT NOT NULL,
company_id INT NOT NULL,
class_id VARCHAR(255) NOT NULL,
PRIMARY KEY(id)
CONSTRAINT fk1 Foreign Key (company_id) REFERENCES company(id)
CONSTRAINT fk2 Foreign Key (class_id) REFERENCES class(id)
);

CREATE TABLE Reservation (
id INT NOT NULL AUTO_INCREMENT,
user_id INT NOT NULL,
ticket_id INT NOT NULL,
status VARCHAR(255) NOT NULL, -- reserved, paid, canceled, canceled by support
reserve_time DATETIME NOT NULL,
expire_time DATETIME NOT NULL,
PRIMARY KEY(id)
CONSTRAINT fk1 Foreign Key (user_id) REFERENCES user(id)
CONSTRAINT fk2 Foreign Key (ticket_id) REFERENCES ticket(id)
);

CREATE TABLE Payment (
id INT NOT NULL AUTO_INCREMENT,
reservation_id INT NOT NULL,
price INT NOT NULL,
method VARCHAR(255) NOT NULL,
status VARCHAR(255) NOT NULL, -- successful, unsuccessful, pending
payment_time DATETIME NOT NULL,
PRIMARY KEY(id)
CONSTRAINT fk1 Foreign Key (reservation_id) REFERENCES reservation(id)
);

CREATE TABLE Report (
id INT NOT NULL AUTO_INCREMENT,
user_id INT NOT NULL
reservation_id INT NOT NULL,
category VARCHAR(255) NOT NULL -- delay, problem in payment, etc.
description VARCHAR(255) NOT NULL,
status VARCHAR(255) NOT NULL, -- resolved, pending
PRIMARY KEY(id)
CONSTRAINT fk1 Foreign Key (user_id) REFERENCES user(id)
CONSTRAINT fk2 Foreign Key (reservation_id) REFERENCES reservation(id)
);
