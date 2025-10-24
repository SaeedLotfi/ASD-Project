WITH u AS (
  SELECT "id" FROM "User" WHERE "email" = 'alice@example.com'
)
INSERT INTO "Item" (
  "id", "name", "x", "y", "shape", "width", "height", "userId", "updatedAt"
)
SELECT
  'it_003',
  'Circular Badge',
  240,             -- x
  180,             -- y
  'CIRCLE'::"Shape",
  100,             -- width
  100,             -- height
  u."id",
  CURRENT_TIMESTAMP(3)
FROM u
RETURNING *;
