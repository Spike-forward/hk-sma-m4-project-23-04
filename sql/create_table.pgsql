CREATE TABLE owner(
    id SERIAL primary key,
    first_name VARCHAR(255) not null,
    last_name VARCHAR(255) not null,
    email VARCHAR(255) not null,
    password VARCHAR(255) not null,
    created_at timestamp DEFAULT NOW() not null,
    updated_at timestamp DEFAULT NOW() not null
);


CREATE TABLE studio(
    id SERIAL primary key,
    name VARCHAR(255) not null,
    district VARCHAR(255) not null,
    address text not null,
    contact_no VARCHAR(255) not null,
    icon VARCHAR(255) not null,
    open_time time not null,
    close_time time not null,
    price text not null,
    description text not null,
    owner_id integer,
    FOREIGN KEY (owner_id) REFERENCES owner(id),
    created_at timestamp DEFAULT NOW() not null,
    updated_at timestamp DEFAULT NOW() not null
);


CREATE TABLE equipment(
    id SERIAL primary key,
    items VARCHAR(255) not null
);

CREATE TABLE studio_equipment(
    id SERIAL primary key,
    studio_id integer,
    FOREIGN KEY (studio_id) REFERENCES studio(id),
    equipment_id integer,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id)
);

CREATE TABLE studio_photo(
    id SERIAL primary key,
    filename VARCHAR(255) not null,
    cover_photo boolean not null,
    studio_id integer,
    FOREIGN KEY (studio_id) REFERENCES studio(id),
    created_at timestamp DEFAULT NOW() not null,
    updated_at timestamp DEFAULT NOW() not null
);

CREATE TABLE booking(
    id SERIAL primary key,
    name VARCHAR(255) not null,
    date DATE not null,
    contact_no VARCHAR(255) not null,
    remarks text,
    studio_id integer,
    FOREIGN KEY (studio_id) REFERENCES studio(id),
    created_at timestamp DEFAULT NOW() not null,
    updated_at timestamp DEFAULT NOW() not null
);

CREATE TABLE booking_timeslot(
    id SERIAL primary key,
    start_time time not null,
    end_time time not null,
    booking_id integer,
    FOREIGN KEY (booking_id) REFERENCES booking(id)
);

CREATE TABLE booking_status(
    id SERIAL primary key,
    status VARCHAR(255) not null,
    booking_id integer,
    FOREIGN KEY (booking_id) REFERENCES booking(id),
    created_at timestamp DEFAULT NOW() not null,
    updated_at timestamp DEFAULT NOW() not null
);





















