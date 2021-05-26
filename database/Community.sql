
CREATE TABLE community (
  id SERIAL NOT NULL PRIMARY KEY,
  community_uid UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  user_uid UUID NOT NULL,
  role role NOT NULL,
  sub_uid UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY ("user_uid") REFERENCES "users" (user_uid),
  FOREIGN KEY ("sub_uid") REFERENCES "subs" (sub_uid)
);