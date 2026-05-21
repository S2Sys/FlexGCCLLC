# Multi-Cloud Design Guidance
> Load this reference when the user confirms "multi-cloud" as their provider choice in /swc-arch STEP 1.

**Multi-cloud design guidance (only when multi-cloud is confirmed)**

> **Gate: if the user confirmed a single provider in the response above, skip this entire block and go directly to STEP 2. Only enter this block if the user explicitly confirmed "multi-cloud" as the provider choice.**

If the user confirms multi-cloud, cover the three topics below before proceeding.

---

**1. Deployment pattern**

Choose one:

| Pattern | Description | When to use |
|---------|-------------|-------------|
| Active-active | Both clouds serve live traffic simultaneously; requires data sync and global load balancing | RTO < 5 min or SLA ≥ 99.99% |
| Active-passive | One cloud is primary; the other is a warm standby for DR only; simpler but no cost sharing | RTO ≥ 5 min and SLA < 99.99% |

Decision rule: **choose active-active when RTO < 5 min or SLA ≥ 99.99%; otherwise active-passive is simpler and cheaper.**

Record the chosen pattern in CLOUD-ARCH.md: `Multi-cloud pattern: [Active-active / Active-passive] — reason`.

---

**2. Global traffic routing**

Select a routing layer appropriate for the confirmed providers:

- **Azure + AWS**: Azure Traffic Manager (DNS-based) + AWS Route 53 Latency or Geolocation routing
- **Azure + GCP**: Azure Traffic Manager + GCP Global External Application Load Balancer (Cloud Load Balancing)
- **AWS + GCP**: AWS Route 53 + GCP Global External Application Load Balancer
- **All three**: Use a provider-neutral CDN/DNS layer (e.g., Cloudflare) as the single global entry point

For active-active: health-based failover **must** be configured on the routing layer so traffic shifts automatically when a cloud endpoint becomes unhealthy.

---

**3. Data sync strategy**

> **Warning: multi-cloud data sync is the hardest part of a multi-cloud design. Confirm with the SRS NFR whether eventual consistency is acceptable before choosing an approach.**

| Approach | Complexity | Consistency | Best for |
|----------|------------|-------------|----------|
| Primary-replica replication | Low | Eventual | Active-passive — replica is read-only DR copy |
| Bi-directional sync with conflict resolution | High | Eventual (conflict window) | Active-active — both sides accept writes |
| Shared data layer on a third provider/service | Medium | Strong (depends on service) | Active-active where consistency is non-negotiable (e.g., CockroachDB, PlanetScale, Spanner) |

Record the chosen strategy in CLOUD-ARCH.md: `Data sync: [approach] — consistency model: [strong / eventual]`.

---

> Once deployment pattern, traffic routing, and data sync are confirmed, continue to STEP 2.
