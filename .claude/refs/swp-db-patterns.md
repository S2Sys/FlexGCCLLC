---
name: swp-db-patterns
description: SQL Server stored procedure body templates for /swp-db — INSERT, SELECT, UPDATE, DELETE, paged search, search with filters, soft-delete patterns.
type: reference
---

# SmartWorkz DB Patterns — SP Body Templates

> Referenced by `/swp-db` STEP 4. Every SP must follow these templates.

### SP Body Template

Every SP must follow this skeleton — no exceptions:

```sql
CREATE OR ALTER PROCEDURE [Schema].usp[Entity][Action]
    @TenantId     INT,
    @[Param]      [Type]
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- [business logic here]

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
```

Rules:
- `SET NOCOUNT ON` — always, prevents extra result sets.
- `SET XACT_ABORT ON` — always, auto-rolls back on any error.
- `THROW` (not `RAISERROR`) — preserves original error number and state.
- Omit `BEGIN TRANSACTION` only for pure SELECT SPs (GetById, GetPaged, Search).
- Insert SPs: `SELECT SCOPE_IDENTITY()` as last statement to return new Id.
- GRANT EXECUTE on each SP to the application database role — never grant to public.

---

### SRS Pseudo Code Standard

For complex stored procedures (> 2 joins, financial logic, ranking, state machine logic), the SRS must document the algorithm in pseudo code form. This prevents implementation surprises and ensures the design aligns with business intent.

#### What Counts as Pseudo Code

Pseudo code is a **high-level algorithm description** — not SQL, not English prose, but structured steps that explain the logic clearly:

**GOOD Pseudo Code Example:**
```
ALGORITHM: Calculate User Reputation Score
INPUT: UserId, TenantId
OUTPUT: ReputationScore (INT)

STEP 1: Fetch user activity stats (approved posts, rejected posts, comment votes)
STEP 2: If user has 0 activity → return default score (500), exit
STEP 3: Calculate base score = (approved * 10) - (rejected * 5) + (votes / 2)
STEP 4: Apply decay: for each month since last activity, reduce score by 1%
STEP 5: Clamp score to range [0, 1000]
STEP 6: Return final score
```

**BAD Pseudo Code Example (too vague):**
```
"Calculate a reputation score based on user activity"
```

**BAD Pseudo Code Example (too detailed):**
```
SELECT @Score = ISNULL(SUM(...) - SUM(...) + SUM(...), 500)
FROM UserActivity
WHERE ...
```

Key characteristics:
- Numbered steps or clear flow
- Inputs and outputs defined
- Decision points explicit (IF, WHILE, FOR loops)
- Business logic clear (not SQL syntax)
- 5–15 steps typically

#### When to Require Pseudo Code

Use this decision tree to determine if a SP needs pseudo code in the SRS:

1. **Is the SP a simple CRUD operation?**
   - GetById, GetList, Insert, Update, Delete → NO pseudo code needed
   - These follow standard templates

2. **Does the SP have > 2 joins?**
   → YES, check SRS for pseudo code

3. **Does the SP compute a value (aggregate, calculation, score)?**
   → Examples: total amount, average rating, reputation score
   → YES, check SRS for pseudo code

4. **Does the SP have financial logic (payment, invoice, ledger)?**
   → Examples: tax calculation, discount application, payment allocation
   → YES, check SRS for pseudo code

5. **Does the SP handle ranking or sorting by computed value?**
   → Examples: leaderboard, relevance ranking, recommendation list
   → YES, check SRS for pseudo code

6. **Does the SP enforce a state machine (workflow, approval)?**
   → Examples: status transitions, approval chain, order fulfillment
   → YES, check SRS for pseudo code

7. **Does the SP search/filter dynamically?**
   → Simple LIKE search → NO
   → Full-text search with ranking → YES

If ANY step above answers YES → SP requires pseudo code in SRS before implementation.

#### SRS Pseudo Code Checklist

When implementing a complex SP, follow this checklist:

1. **Open docs/SRS.md** and search for the feature section that owns this SP
   - Example: If SP is `Exam.uspQuestionSearch`, search for "Question Management" or "Search" epic

2. **Locate the feature acceptance criteria** that mentions this SP's purpose
   - Example: "Users can search questions by difficulty, topic, and status"

3. **Find the pseudo code block** — it looks like:
   ```
   ### Pseudo Code: uspQuestionSearch
   
   INPUT: @TenantId, @SearchTerm, @DifficultyId, @TopicId, @PageNumber, @PageSize
   OUTPUT: Paged result set + total count
   
   ALGORITHM:
     1. Validate @TenantId is active
     2. Build filter conditions:
        - If @SearchTerm provided: match question text with FTS or LIKE
        - If @DifficultyId provided: exact match
        - If @TopicId provided: join to ExamQuestionTopics and filter
     3. Apply security: IsDeleted = 0, user has read permission on exam
     4. Order by relevance (if FTS) or by question creation date
     5. Paginate results
     6. Return result set + COUNT(*) for UI pagination
   ```

4. **Verify the pseudo code is sufficient:**
   - ✅ Is there an ALGORITHM section with numbered steps?
   - ✅ Are INPUT and OUTPUT defined?
   - ✅ Are decision points (IF, WHERE, JOIN conditions) explicitly mentioned?
   - ✅ Is the business logic clear (without SQL syntax)?

5. **If pseudo code is missing:**
   - **Do NOT implement the SP yet**
   - Add comment in DB-DESIGN.md: "❌ PSEUDO CODE MISSING — run /swp-srs and add pseudo code before implementing"
   - Trigger /swp-srs to add the pseudo code to SRS

6. **If pseudo code is present:**
   - Copy the pseudo code into DB-DESIGN.md under the SP entry
   - Proceed with SP implementation

#### Recording Pseudo Code in DB-DESIGN.md

When pseudo code is confirmed in SRS, record it in DB-DESIGN.md:

```
SRS PSEUDO CODE PRESENT — [Schema].usp[Entity][Action]
─────────────────────────────────────────────────────
SRS Section : § Feature Name → [section title]
Complexity  : [> 2 joins / financial logic / ranking / state machine]
In SRS?     : ✅ PRESENT

ALGORITHM:
  [Paste the full pseudo code block from SRS here]

Confirmed by: [Your name] on [date]
```

Example:
```
SRS PSEUDO CODE PRESENT — Exam.uspQuestionSearch
────────────────────────────────────────────────
SRS Section : § Feature #2 — Question Management → Search Functionality
Complexity  : > 2 joins (Questions + Topics + Difficulty) + FTS ranking
In SRS?     : ✅ PRESENT

ALGORITHM:
  INPUT: @TenantId, @SearchTerm, @DifficultyId, @TopicId, @PageNumber, @PageSize
  OUTPUT: Paged result set + total count

  STEP 1: Validate @TenantId is active
  STEP 2: Build filter conditions...
  [etc.]

Confirmed by: Senthilvel on 2026-05-14
```

---

### Bulk Insert SP via TVP

Use when a story requires inserting/updating multiple rows in one call:

```sql
-- First define the Table Type in Core schema:
-- CREATE TYPE Core.utt[Entity]List AS TABLE ([col1] [type], [col2] [type])

CREATE OR ALTER PROCEDURE [Schema].usp[Entity]BulkInsert
    @TenantId INT,
    @Items    Core.utt[Entity]List READONLY
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        INSERT INTO [Schema].[Entity] (TenantId, [cols], CreatedAt, CreatedBy)
        SELECT @TenantId, [cols], GETUTCDATE(), @CreatedBy
        FROM @Items;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
```

---

### Dynamic Search SP Pattern

Use for filtered list endpoints (search box, multi-filter UI):

```sql
CREATE OR ALTER PROCEDURE [Schema].usp[Entity]Search
    @TenantId    INT,
    @SearchTerm  NVARCHAR(255) = NULL,
    @StatusId    INT           = NULL,
    @PageNumber  INT           = 1,
    @PageSize    INT           = 20
AS
BEGIN
    SET NOCOUNT ON;

    SELECT [columns]
    FROM [Schema].[Entity]
    WHERE TenantId   = @TenantId
      AND IsDeleted  = 0
      AND (@SearchTerm IS NULL OR [NameCol] LIKE '%' + @SearchTerm + '%')
      AND (@StatusId  IS NULL OR StatusId = @StatusId)
    ORDER BY [SortColumn]
    OFFSET (@PageNumber - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;

    -- Return total count for pagination UI:
    SELECT COUNT(*)
    FROM [Schema].[Entity]
    WHERE TenantId  = @TenantId
      AND IsDeleted = 0
      AND (@SearchTerm IS NULL OR [NameCol] LIKE '%' + @SearchTerm + '%')
      AND (@StatusId  IS NULL OR StatusId = @StatusId);
END
```

Performance note: If table is High volume (>10M rows), replace LIKE with Full-Text Search or a dedicated search index. Flag this in PENDING DECISIONS.

---
