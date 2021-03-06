CREATE TYPE role AS ENUM ('user', 'admin', 'superadmin');

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL NOT NULL PRIMARY KEY,
  user_uid UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  username VARCHAR(150) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  confirmed BOOLEAN NOT NULL DEFAULT false,
  email VARCHAR(150) NOT NULL UNIQUE,
  role role NOT NULL,
  password VARCHAR(250) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);