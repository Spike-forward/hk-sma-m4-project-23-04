CREATE SEQUENCE booking_reference_seq;

CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS VARCHAR AS $$
DECLARE
    curr_date TEXT;
    next_val INT;
    reference_number TEXT;
BEGIN
    curr_date := TO_CHAR(NOW(), 'YYYYMMDD');
    
    -- Check if a sequence for the current date already exists
    IF NOT EXISTS (
        SELECT 1
        FROM pg_sequences
        WHERE schemaname = 'public' AND sequencename = 'booking_reference_seq_' || curr_date
    ) THEN
        -- If not, create a new sequence for the current date and set its value to 1
        EXECUTE 'CREATE SEQUENCE booking_reference_seq_' || curr_date || ' START 1';
    END IF;
    
    -- Get the next value from the sequence for the current date
    EXECUTE 'SELECT NEXTVAL(''booking_reference_seq_' || curr_date || ''')' INTO next_val;
    
    -- Create the reference number
    reference_number := curr_date || LPAD(next_val::TEXT, 5, '0');
    
    RETURN reference_number;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
    NEW.reference_no := generate_booking_reference();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER before_insert_trigger
BEFORE INSERT ON booking
FOR EACH ROW
EXECUTE FUNCTION set_booking_reference();


INSERT INTO 
    booking (name, date, contact_no, remarks,studio_id,created_at, updated_at)
VALUES 
    ('Anna','2024-01-25','90350163','Can I bring my pet to come?',4,'2023-12-28 15:00:00','2023-12-28 15:00:00'),
    ('Lara','2024-01-25','65123831','null',4,'2023-12-28 15:00:00','2023-12-28 15:00:00'),  
    ('Wynne','2024-01-25','99887472','Could you help me to set up the studio? I dont know how to set it up.',5,'2023-12-29 14:00:00','2023-12-29 14:00:00'),
    ('Brian','2024-01-25','90167436','null',1,'2023-12-29 14:00:00','2023-12-29 14:00:00'),
    ('Colin','2024-01-25','94688303','Do you have private washroom?',5,'2023-12-29 14:00:00','2023-12-29 14:00:00'),
    ('Jason','2024-01-25','90880313','null',3,'2023-12-29 14:00:00','2023-12-29 14:00:00'),
    ('Tiffany','2024-01-26','67891234','Do you have changing room in your studio?',2,'2023-12-29 14:30:00','2023-12-29 14:30:00');

INSERT INTO 
    booking_timeslot (start_time, end_time, booking_id)
VALUES
    ('18:00','19:00',1),
    ('19:00','20:00',2),
    ('18:00','19:00',3),
    ('19:00','20:00',4),
    ('20:00','21:00',4),
    ('16:00','17:00',5),
    ('15:00','16:00',6),
    ('20:00','21:00',7),
    ('21:00','22:00',7)
;


INSERT INTO 
    booking_status (status, booking_id, created_at, updated_at )
VALUES
    ('approved',1,'2023-12-28 15:00:00','2023-12-29 15:00:00'),
    ('approved',2,'2023-12-28 15:00:00','2023-12-29 15:00:00'),
    ('waiting for payment',3,'2023-12-29 14:00:00','2023-12-30 10:00:00'),
    ('waiting for payment',4,'2023-12-29 14:00:00','2023-12-30 10:00:00'),
    ('rejected',5,'2023-12-29 14:00:00','2023-12-30 10:00:00'),
    ('pending',6,'2023-12-29 14:00:00','2023-12-29 14:00:00'),
    ('pending',7,'2023-12-29 14:30:00','2023-12-29 14:30:00');


