import { sqlJson } from "../src/lib/sqlserver.js";

const rows = await sqlJson(`
  SELECT id, code, name,
         CAST(price AS decimal(10,2)) AS price,
         CAST(originalPrice AS decimal(10,2)) AS originalPrice,
         description, sampleType, category
  FROM dbo.Test
  FOR JSON PATH
`);
console.log(JSON.stringify(rows, null, 2));
