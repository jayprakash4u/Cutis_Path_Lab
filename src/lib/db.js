import sql from "mssql/msnodesqlv8.js";

const connectionString =
  process.env.SQLSERVER_CONNECTION_STRING ||
  "Driver={ODBC Driver 17 for SQL Server};Server=localhost\\SQLEXPRESS;Database=CutisPathLab;Trusted_Connection=Yes;TrustServerCertificate=Yes;";

let poolPromise;

export function getDb() {
  if (!poolPromise) {
    poolPromise = sql
      .connect(connectionString)
      .then((pool) => {
        console.log("Connected to SQL Server (SQLEXPRESS)");
        return pool;
      })
      .catch((err) => {
        poolPromise = null;
        console.error("SQL Server connection failed:", err.message);
        throw err;
      });
  }
  return poolPromise;
}

export { sql };
export default getDb;
