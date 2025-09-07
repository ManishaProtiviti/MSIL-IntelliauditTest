// db.js
import { Environment } from "../../constants.js";
import { Client } from "pg";
// import { mysql } from "mysql2";
import  mysql from 'mysql2';
const db = new Client({
  host: Environment.DB_HOST,
  port: Environment.DB_PORT,
  user: Environment.DB_USER,
  password: Environment.DB_PWD,        // <-- change if needed
  database: Environment.DB,   // <-- change to your DB name,
  ssl: true
});

// async function checkconnection() {
//   try {
//     await db.connect();
//     console.log("Redshift connected");
//   } catch (err) {
//     console.error("Reshift connection failed", err);
//   }
// }

// // checkconnection();
export default db;

//Note : move all DB connection details in ENv file
const pool =  mysql.createPool({
      host : 'intelliaudit-dev-mysql.c9ygm4w2aore.ap-south-1.rds.amazonaws.com', //Environment.DB_HOST,
      port:3306,
      ssl:'Amazon RDS',
      user: 'admin',//Environment.DB_USER,
      password: '8<LsUmQg9hkA',//Environment.DB_PASSWORD,
      database: 'intelliaudit_db',//Environment.DB_DATABASE
      waitForConnections:true,
      connectionLimit:10, // Change as per requirement
      queueLimit:0
    });

export async function executeSQLQuery(query) {
  try {
      console.log("my sql connected", query);

      const promise = pool.promise();
      const [rows] = await promise.query(query);
    
      return rows;
  } catch (err) {
    console.error("mysql  error", err);
  } 
}

// checkconnection();
// export default db;

