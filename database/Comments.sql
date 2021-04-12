CREATE TABLE comments {
  id SERIAL NOT NULL PRIMARY KEY,
  comment_uid UUID NOT NULL DEFAULT uuid_generate_v4(),
  
}