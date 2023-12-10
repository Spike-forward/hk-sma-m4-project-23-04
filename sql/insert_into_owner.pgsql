INSERT INTO 
    owner (first_name, last_name,email,password,created_at,updated_at)
VALUES 
    ('Anna','Ngan','anna.ngan@gmail.com','$2a$10$ZjJdxQ2xQIiKGjiBeXoUzuogZa/e9okqd0pzFxEPHUhpg1aEaV3JW','2023-12-08 12:00:00','2023-12-08 12:00:00'),
    ('Brian','Chan','brian.chan@gmail.com','$2a$10$ZjJdxQ2xQIiKGjiBeXoUzuogZa/e9okqd0pzFxEPHUhpg1aEaV3JW','2023-12-09 12:00:00','2023-12-09 12:00:00'),
    ('Colin','Lee','colin.lee@gmail.com','$2a$10$ZjJdxQ2xQIiKGjiBeXoUzuogZa/e9okqd0pzFxEPHUhpg1aEaV3JW','2023-12-10 12:00:00','2023-12-10 12:00:00');


-- If you have already created the above table previously with plaintext password, 
-- please use below script to update the password to the hased version
-- Plain Text Password = Tecky123

UPDATE owner 
SET password = '$2a$10$ZjJdxQ2xQIiKGjiBeXoUzuogZa/e9okqd0pzFxEPHUhpg1aEaV3JW'
WHERE id = 1 OR id = 2 OR id = 3;