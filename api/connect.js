import pg from "pg";

const db = new pg.Client({
  user : "postgres",
  host : "localhost",
  database : "social",
  password : "Ritika#12345678",
  port : 5432,
});

db.connect();

export default db;