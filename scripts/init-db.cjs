/**
 * Creates tables in CutisPathLab (SQL Server Express)
 * Run: node scripts/init-db.cjs
 */
const sql = require("mssql/msnodesqlv8");

const drivers = [
  "ODBC Driver 18 for SQL Server",
  "ODBC Driver 17 for SQL Server",
  "SQL Server",
];

const servers = ["localhost\\SQLEXPRESS", "JAY\\SQLEXPRESS", ".\\SQLEXPRESS"];

const createSql = `
IF OBJECT_ID('dbo.Test', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.Test (
    id NVARCHAR(50) NOT NULL PRIMARY KEY,
    code NVARCHAR(50) NOT NULL UNIQUE,
    name NVARCHAR(255) NOT NULL,
    category NVARCHAR(100) NOT NULL,
    price FLOAT NOT NULL,
    originalPrice FLOAT NULL,
    description NVARCHAR(MAX) NULL,
    sampleType NVARCHAR(50) NULL,
    fastingRequired BIT NOT NULL CONSTRAINT DF_Test_fasting DEFAULT 0,
    reportTime NVARCHAR(50) NULL,
    parameters INT NULL,
    popular BIT NOT NULL CONSTRAINT DF_Test_popular DEFAULT 0,
    createdAt DATETIME2 NOT NULL CONSTRAINT DF_Test_created DEFAULT SYSUTCDATETIME(),
    updatedAt DATETIME2 NOT NULL CONSTRAINT DF_Test_updated DEFAULT SYSUTCDATETIME()
  );
END;

IF OBJECT_ID('dbo.Booking', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.Booking (
    id NVARCHAR(50) NOT NULL PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    phone NVARCHAR(30) NOT NULL,
    email NVARCHAR(150) NULL,
    address NVARCHAR(500) NULL,
    preferredDate NVARCHAR(50) NULL,
    preferredTime NVARCHAR(50) NULL,
    notes NVARCHAR(MAX) NULL,
    status NVARCHAR(30) NOT NULL CONSTRAINT DF_Booking_status DEFAULT 'pending',
    testId NVARCHAR(50) NULL,
    createdAt DATETIME2 NOT NULL CONSTRAINT DF_Booking_created DEFAULT SYSUTCDATETIME(),
    updatedAt DATETIME2 NOT NULL CONSTRAINT DF_Booking_updated DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Booking_Test FOREIGN KEY (testId) REFERENCES dbo.Test(id)
  );
END;

IF OBJECT_ID('dbo.ContactMessage', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.ContactMessage (
    id NVARCHAR(50) NOT NULL PRIMARY KEY,
    name NVARCHAR(150) NOT NULL,
    email NVARCHAR(150) NOT NULL,
    phone NVARCHAR(30) NULL,
    subject NVARCHAR(255) NULL,
    message NVARCHAR(MAX) NOT NULL,
    createdAt DATETIME2 NOT NULL CONSTRAINT DF_Contact_created DEFAULT SYSUTCDATETIME()
  );
END;
`;

async function tryConnect() {
  let lastError;
  for (const driver of drivers) {
    for (const server of servers) {
      const connectionString = `Driver={${driver}};Server=${server};Database=CutisPathLab;Trusted_Connection=Yes;TrustServerCertificate=Yes;`;
      console.log("Trying:", driver, "|", server);
      try {
        const pool = await sql.connect(connectionString);
        console.log("Connected!");
        return pool;
      } catch (err) {
        lastError = err;
        console.log("  Failed:", err.message);
        try {
          await sql.close();
        } catch (_) {}
      }
    }
  }
  throw lastError;
}

async function main() {
  const pool = await tryConnect();
  await pool.request().query(createSql);
  const result = await pool.request().query(`
    SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA = 'dbo'
    ORDER BY TABLE_NAME;
  `);
  console.log("Tables ready:");
  for (const row of result.recordset) {
    console.log(" -", row.TABLE_NAME);
  }
  await sql.close();
  console.log("Done.");
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
