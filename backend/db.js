import mysql from "mysql2/promise";

const connectionPool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "ispitivac",
  database: "Ludo",
  waitForConnections: true,
  connectionLimit: 100,
  maxIdle: 10,
  idleTimeout: 3000,
  queueLimit: 0,
});

export default async function query(sql, params) {
  try {
    const [results] = await connectionPool.execute(sql, params);
    return results;
  } catch (err) {
    return console.log("Mysql connection error: " + err);
  }
}
