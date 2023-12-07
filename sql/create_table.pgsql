CREATE TABLE owner(
    id SERIAL primary key,
    first_name VARCHAR(255) not null,
    last_name VARCHAR(255) not null,
    email VARCHAR(255) not null,
    password VARCHAR(255) not null,
    created_at timestamp not null,
    updated_at timestamp not null
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
    created_at timestamp not null,
    updated_at timestamp not null
);












