# Migration Scenario Guidance
> Load this reference when $ARGUMENTS or SRS content contains "migrate", "migration", "lift and shift", or "on-premises" in /swc-arch STEP 1.

**Migration scenario guidance (only when migration is detected)**

> **Gate: only apply this block if $ARGUMENTS or SRS content contains any of: "migrate", "migration", "lift and shift", "on-premises". If none of these terms are present, skip this entire block and go directly to STEP 2.**

If migration is detected, cover the three topics below before proceeding to STEP 2.

---

**1. Migration pattern selection**

Present the three patterns and select the appropriate one:

| Pattern | Description | Trade-off |
|---------|-------------|-----------|
| Rehost (lift and shift) | Move VMs/containers as-is to the cloud | Fastest to execute; least optimised for cloud — no cost or scale benefits |
| Replatform | Change runtime only (e.g. IIS → App Service) with minimal code change | Balanced effort vs gain — gets PaaS benefits without a rewrite |
| Refactor / rearchitect | Redesign to cloud-native (containers, serverless, managed services) | Highest long-term value; highest effort and risk |

Decision rule: **choose rehost for speed or regulatory constraints; choose replatform for most projects; choose refactor only if the existing architecture has critical scalability blockers that cannot be resolved by replatforming.**

Record the chosen pattern in CLOUD-ARCH.md: `Migration pattern: [Rehost / Replatform / Refactor] — reason`.

---

**2. Migration phasing**

Propose a phasing table in CLOUD-ARCH.md so the migration is de-risked by moving lower-impact workloads first:

| Phase | Scope | Goal |
|-------|-------|------|
| Phase 1 | Non-critical services (e.g. static assets, background jobs, dev/staging environments) | Validate cloud connectivity and tooling with low blast radius |
| Phase 2 | Core application services (API, frontend, auth) | Migrate the primary workload; cutover non-data traffic |
| Phase 3 | Data layer + final cutover (primary database, cache, file storage) | Riskiest step — execute with parallel-run buffer and validated rollback plan |

---

**3. Cutover strategy**

- **DNS cutover** — update DNS records to point to cloud endpoints; simple but results in a hard switchover moment. Use a low TTL (60 s) before cutover to allow fast rollback.
- **Traffic split** — gradually shift a percentage of live traffic to the cloud endpoint (e.g. 5% → 25% → 100%) using a weighted routing policy. Recommended for high-traffic or SLA-sensitive services.
- **Data migration risk** — flag that Phase 3 data migration is the riskiest step. Always run a parallel period (both on-premises and cloud databases accepting reads; cloud is write-primary) before decommissioning on-premises.
- **Parallel-run period** — recommend a minimum parallel-run window appropriate to the RTO/RPO targets. During this window both environments are live and a rollback to on-premises is possible without data loss.

Record the cutover strategy in CLOUD-ARCH.md: `Cutover: [DNS cutover / Traffic split] — parallel-run period: [duration]`.

---

> Once migration pattern, phasing, and cutover strategy are confirmed, continue to STEP 2.
