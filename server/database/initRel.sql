
CREATE TABLE IF NOT EXISTS users (
    id serial primary key,
    username varchar(255) not null unique,
    password varchar(255) not null
);

CREATE TABLE IF NOT EXISTS buckets (
    id serial primary key,
    user_id int not null references users (id) on delete cascade,
    api_key varchar(255) not null,
    name varchar(255) not null
);
