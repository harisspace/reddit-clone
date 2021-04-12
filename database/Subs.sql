CREATE TABLE subs (
  id SERIAL NOT NULL PRIMARY KEY,
  sub_uid UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image_urn VARCHAR(250),
  banner_urn VARCHAR(250),
  user_uid UUID REFERENCES users(user_uid),
  post_uid UUID REFERENCES posts(post_uid),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY ("user_uid") REFERENCES "users"(user_uid),
  FOREIGN KEY ("post_uid") REFERENCES "posts"(post_uid) 
);