SET NAMES 'utf8mb4';
SET CHARACTER SET utf8mb4;
USE ticket_reservation;



INSERT INTO Company (name) VALUES
('ایران ایر'), ('ماهان ایر'),
('سیر و سفر'), ('همسفر'),
('رجا'), ('فدک');


INSERT INTO Class (name) VALUES
('اقتصادی'), ('بیزنس'), ('VIP');
INSERT INTO User (firstName, lastName, password, role, city, email, balance) VALUES
('مدیر', 'سیستم', '$2a$12$SG8oRRz4jJwg4f89xmNpzeQfXADlvUUsgEF3eG8JaiSww/.QeQDHa', 'admin', 'تهران', 'admin@example.com', 0);

INSERT INTO Ticket (vehicle_type, source, destination, arrival_date, arrival_time, departure_date, departure_time, price, remaining_cap, company_id, class_id) VALUES
('flight', 'تهران', 'مشهد', '2025-09-10', '14:30:00', '2025-09-10', '13:00:00', 1200000, 25, 1, 2), -- Iran Air, Business
('flight', 'مشهد', 'تهران', '2025-09-12', '18:00:00', '2025-09-12', '16:30:00', 850000, 40, 1, 1),  -- Iran Air, Economy
('flight', 'شیراز', 'تهران', '2025-09-11', '09:00:00', '2025-09-11', '07:45:00', 950000, 15, 2, 1);  -- Mahan Air, Economy


INSERT INTO Ticket (vehicle_type, source, destination, arrival_date, arrival_time, departure_date, departure_time, price, remaining_cap, company_id, class_id) VALUES
('train', 'تهران', 'مشهد', '2025-09-15', '06:00:00', '2025-09-14', '18:00:00', 750000, 30, 5, 3), -- Raja, VIP
('train', 'اصفهان', 'تهران', '2025-09-16', '12:00:00', '2025-09-16', '06:00:00', 900000, 18, 6, 3), -- Fadak, VIP
('train', 'مشهد', 'تهران', '2025-09-18', '22:00:00', '2025-09-18', '10:00:00', 600000, 50, 5, 1); -- Raja, Economy

INSERT INTO Ticket (vehicle_type, source, destination, arrival_date, arrival_time, departure_date, departure_time, price, remaining_cap, company_id, class_id) VALUES
('bus', 'تهران', 'اصفهان', '2025-09-08', '18:00:00', '2025-09-08', '12:00:00', 250000, 12, 3, 3), -- Seiro Safar, VIP
('bus', 'اصفهان', 'تهران', '2025-09-09', '23:00:00', '2025-09-09', '17:00:00', 250000, 20, 3, 3), -- Seiro Safar, VIP
('bus', 'یزد', 'شیراز', '2025-09-10', '06:00:00', '2025-09-09', '23:00:00', 200000, 25, 4, 1),    -- Hamsafar, Economy
('bus', 'شیراز', 'اصفهان', '2025-09-11', '19:00:00', '2025-09-11', '13:00:00', 220000, 15, 4, 1);    -- Hamsafar, Economy

INSERT INTO FlightDetails (ticket_id, flight_class, stops, flight_number, source_airport, destination_airport, has_bed, has_service, has_internet) VALUES
(1, 'First Class', 0, 452, 'IKA', 'MHD', 1, 1, 1),
(2, 'Economy', 1, 202, 'MHD', 'IKA', 0, 1, 0),
(3, 'Business', 0, 102, 'SYZ', 'THR', 0, 1, 1);


INSERT INTO TrainDetails (ticket_id, stars, has_bed, has_service, has_internet, has_condition) VALUES
(4, 4, 1, 1, 0, 1),
(5, 5, 1, 1, 1, 1),
(6, 3, 1, 0, 0, 1);


INSERT INTO BusDetails (ticket_id, bus_class, seats_in_row, has_condition, has_service, has_monitor) VALUES
(7, 'VIP', '1+2', 1, 1, 1),
(8, 'VIP', '1+2', 1, 1, 1),
(9, 'Normal', '2+2', 1, 0, 0),
(10, 'Normal', '2+2', 1, 0, 0);

