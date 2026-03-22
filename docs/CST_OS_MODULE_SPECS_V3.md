# CST OS — Claude Code Build Instructions
## Complete System Specification — Version 3.0
### Authoritative Build Reference for All Modules

---

> **To Claude Code:** This is the single, complete, authoritative specification for the CST OS. Every module, every page, every database table, every field, every AI App, and every business rule is defined here in the correct build order. Do not append to this document — update it in place. When a rule appears in this document, it overrides any prior version. Build exactly what is described. Do not invent behavior not specified. Do not omit anything listed.

---

# PART 1: SYSTEM FOUNDATION

---

## 1.1 What is the CST OS?

The CST OS (Client Success Team Operating System) is an internal web platform for the Client Success Team of MobileOptima, which manages end-to-end implementations of **Tarkie** — a field force automation SaaS product for enterprise clients across the Philippines.

**What Tarkie does:** Tarkie gives companies visibility and control over their field workforce. It has three surfaces:
- **Field App** — used by field agents: GPS tracking, task execution, form submissions, targets vs actuals
- **Control Tower Dashboard** — used by admins: system settings, entries, compliance reports, exception management
- **Manager App** — used by supervisors/managers: team visibility, compliance summaries, exception lists

**What the CST team does:** They take a new enterprise client from signed contract to live production system. They analyze the client's processes (Fit-Gap), design the solution (BRD, Recommendation), configure Tarkie to match, train the client's users, launch the system (Go-Live), support it post-launch (Hypercare), and hand it over to long-term maintenance (BAU). After that, they maintain the relationship, conduct courtesy calls, manage renewals, and handle any customization requests.

The CST OS guides and automates this entire lifecycle — from the first pipeline prospect to eventual account closure.

---

## 1.2 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend | NestJS (Node.js), TypeScript |
| Database | PostgreSQL via Prisma ORM |
| AI Provider | Anthropic Claude API (claude-sonnet-4-6 default model) |
| AI Cost | ~$0.003/1K input tokens, ~$0.015/1K output tokens (configurable) |
| File Storage | Google Cloud Storage |
| Documents | Google Docs API, Google Slides API, pptxgenjs |
| Diagrams | Mermaid.js (browser-rendered, exportable PNG/SVG/PDF) |
| Speech-to-Text | Google Cloud Speech-to-Text API (NOT Claude — optimized for dictation) |
| Authentication | Google OAuth 2.0 via NextAuth.js (restricted to @mobileoptima.com, @tarkie.com) |
| Hosting | Google Cloud Platform — Cloud Run (API), Firebase Hosting (Web), Cloud SQL (DB) |
| Real-time | Socket.io WebSockets (notifications, live feed, workload updates) |
| Queue | BullMQ (async AI jobs: transcripts, health scores, BRD generation) |
| Cache | Redis (session-level tool call caching, PH holiday data, baseline norms) |
| Email | Gmail API or SendGrid |
| CI/CD | GitHub Actions → Dev / Staging / Production |

---

## 1.3 Design System

All UI must follow these rules exactly:

- **Font:** Inter only. Never any other font.
- **Primary blue:** `#2162F9` (blue-500)
- **Page shell:** 255px fixed left nav + 40px Global Bar + 40px Tabs Bar + 40px Filter Bar + scrollable content area
- **Base font size:** 12px for most UI text; 14px for primary content; never below 10px
- **Colors:** Semantic CSS variables — never raw hex values in component code
- **Icons:** Lucide React, strokeWidth 2 throughout
- **Working days:** Saturday, Sunday, and Philippine public holidays always = 0 capacity

**Key color tokens:**
```
--color-primary:     #2162F9   (blue-500)
--color-gray-800:    #252B37   (primary text)
--color-gray-500:    #6B7280   (secondary text)
--color-gray-100:    #F3F4F6   (weekend background)
--color-amber-50:    #FFFBEB   (holiday background)
--color-ember-500:   #F97316   (overrun/overdue)
--color-green-500:   #22C55E   (success/done)
```

---

## 1.4 Global Rules — Non-Negotiable for Every Module

Every module built in this system must comply with all of the following without exception:

1. **ERPNext toolbar** on every list/table view: `[+ New]  [↑ Import]  [↓ Export]  [⬇ Download Template]`
2. **Activity tab** on every record: full field-level audit trail (field name, old value, new value, user, timestamp). This log is append-only — it cannot be edited or deleted.
3. **Comments section** on every record: threaded comments with @mentions, file attachments, emoji reactions, reply threads
4. **Soft deletes** on all tables: `deleted_at` timestamp field — never hard delete data
5. **UUID primary keys** on every table
6. **`created_at` and `updated_at`** auto-timestamps on every table
7. **Working day calculations** always exclude: Saturday, Sunday, Philippine Regular Holidays, Philippine Special Non-Working Holidays
8. **Filters** on every list view are saveable as named views per user per module
9. **Import validation** shows a row-level error report before committing any data; user can import valid rows only or fix errors first
10. **Export** respects the current filtered view; exports all matching rows (not just the current page)

---

# PART 2: PLATFORM ARCHITECTURE

---

## 2.1 Module Hub Structure

The CST OS is organized into five functional hubs plus a personal home dashboard. Each hub has its own navigation section and its own dashboard as the landing page. This structure is the navigation foundation — build it before building any individual module.

```
┌─────────────────────────────────────────────────────────────────────┐
│  CST OS — Left Navigation (255px fixed)                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Logo]  CST OS                           [User avatar + name]      │
│                                                                     │
│  🏠  Home                                                           │
│      My Day · Feed · Meetings                                       │
│                                                                     │
│  👥  CLIENT MANAGEMENT                                              │
│      ├── Dashboard                                                  │
│      ├── All Accounts                                               │
│      ├── Account Assignment  ✨ AI                                  │
│      ├── Courtesy Calls                                             │
│      ├── CSAT Surveys                                               │
│      └── Client Health Monitor                                      │
│                                                                     │
│  📁  PROJECT MANAGEMENT                                             │
│      ├── Dashboard                                                  │
│      ├── All Projects                                               │
│      ├── RFAs                                                       │
│      ├── Meetings                                                   │
│      ├── BRDs                                                       │
│      ├── Process Flows                                              │
│      ├── Team Gantt                                                 │
│      ├── Project Templates                                          │
│      ├── Timeline Baselines                                         │
│      └── Knowledge Base                                             │
│                                                                     │
│  ✅  WORKFORCE MANAGEMENT                                           │
│      ├── Dashboard                                                  │
│      ├── Team Members                                               │
│      ├── Org Chart                                                  │
│      ├── Workload View                                              │
│      ├── Monthly Planning                                           │
│      ├── Time Logs                                                  │
│      ├── Manpower Planning  ✨ AI                                   │
│      ├── Department Goals                                           │
│      └── Onboarding Tracker                                         │
│                                                                     │
│  📊  PERFORMANCE                                                    │
│      ├── Dashboard                                                  │
│      ├── KPI Scorecards                                             │
│      ├── Milestone Tracker                                          │
│      ├── Usage & Targets                                            │
│      └── Acquisition Pipeline                                       │
│                                                                     │
│  ⚙️  ADMINISTRATION                                                 │
│      ├── System Health                                              │
│      ├── AI Apps & Skills                                           │
│      ├── AI Cost Monitor                                            │
│      ├── Script Templates                                           │
│      ├── Email Automation                                           │
│      ├── Custom Fields                                              │
│      └── System Settings                                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Access controls:** The navigation renders only the items a user's role permits. The hub headers themselves are always visible; child items are hidden based on role. A `viewer` sees only the hubs they are explicitly given access to.

---

## 2.2 Full Entity Relationship Diagram

This ERD is the authoritative schema. Build all foreign keys, indexes, and cascade rules to match it exactly.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ USERS DOMAIN                                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  users                                                                      │
│    ├── reports_to_id ──────────────────→ users (self-ref: org chart)       │
│    ├── manager_id ─────────────────────→ users                             │
│    ├── scorecard_template_id ──────────→ kpi_scorecard_templates           │
│    ├── tasks (1:many via assigned_to_id)                                   │
│    ├── time_logs (1:many via user_id)                                      │
│    ├── milestone_logs (1:many via user_id)                                 │
│    ├── kpi_scorecards (1:many via user_id)                                 │
│    └── staff_onboarding (1:1 via user_id)                                  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ CLIENT DOMAIN                                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  clients                                                                    │
│    ├── parent_client_id ───────────────→ clients (self-ref: child accts)   │
│    ├── assigned_account_manager_id ────→ users                             │
│    ├── active_timeline_id ─────────────→ project_timelines (official)      │
│    ├── active_projected_timeline_id ───→ project_timelines (projected)     │
│    ├── active_kyc_record_id ───────────→ kyc_records                       │
│    ├── kyc_last_completed_by_id ───────→ users                             │
│    ├── client_contacts (1:many)                                             │
│    ├── client_sla (1:many, versioned)                                       │
│    ├── kyc_records (1:many, versioned)                                      │
│    │     └── linked_milestone_log_id ──→ milestone_logs                    │
│    ├── csat_surveys (1:many)                                                │
│    ├── courtesy_call_assignments (1:many)                                   │
│    ├── project_portal_tokens (1:many)                                       │
│    └── projects (1:many) ──────────────────────────────────────────────────┤
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ PROJECT DOMAIN                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  projects                                                                   │
│    ├── client_id ──────────────────────→ clients                           │
│    ├── template_id ────────────────────→ project_templates                 │
│    ├── assigned_pm_id ─────────────────→ users                             │
│    ├── active_timeline_id ─────────────→ project_timelines                 │
│    ├── active_projected_timeline_id ───→ project_timelines                 │
│    │                                                                        │
│    ├── project_timelines (1:many, versioned)                                │
│    │     ├── baseline_id ──────────────→ timeline_baselines                │
│    │     ├── linked_rfa_id ────────────→ rfas                              │
│    │     └── linked_recommendation_id ─→ project_recommendations           │
│    │                                                                        │
│    ├── project_milestones (1:many)                                          │
│    │     ├── timeline_id ─────────────→ project_timelines                  │
│    │     └── responsible_user_id ──────→ users                             │
│    │           └── tasks (1:many via milestone_id)                         │
│    │                 ├── parent_task_id ─→ tasks (self-ref: subtasks)      │
│    │                 ├── assigned_to_id ──→ users                          │
│    │                 ├── external_assignee_contact_id → client_contacts    │
│    │                 └── time_logs (1:many)                                │
│    │                                                                        │
│    ├── project_risks (1:many)                                               │
│    ├── project_recommendations (1:many)                                     │
│    │     ├── linked_timeline_id ────────→ project_timelines                │
│    │     ├── linked_brd_id ─────────────→ brds                             │
│    │     └── approval_rfa_id ───────────→ rfas                             │
│    │                                                                        │
│    ├── rfas (1:many)                                                        │
│    ├── brds (1:many)                                                        │
│    ├── meetings (1:many)                                                    │
│    ├── project_portal_tokens (1:many)                                       │
│    └── turnover_records (1:1)                                               │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ GLOBAL / CROSS-CUTTING TABLES                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  timeline_baselines ← referenced by project_timelines.baseline_id          │
│  ph_holidays ← referenced by all working-day calculations                  │
│  ai_apps → agent_tool_call_logs (1:many)                                   │
│           → ai_api_call_logs (1:many)                                      │
│           → ai_cost_budgets (1:many)                                        │
│  custom_field_definitions → custom_field_values (1:many)                   │
│  news_feed_events (cross-entity: references users, projects, clients)      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2.3 Agentic AI Architecture

### Cost Analysis

**Estimated monthly cost for a 10-person CST team: ~$22 USD.** This is achieved because:
- Tool calls are database queries — they have no token cost
- Each app's context is scoped to only the tools it declared access to
- Static data (baseline norms, PH holidays) is cached in Redis with 24-hour TTL
- Session-level result caching reuses tool responses within a single session
- Token budgets per app prevent runaway context growth

The agentic approach is cheaper than non-agentic multi-turn conversation because it eliminates the back-and-forth turns where the AI asks the user for data the system already has. A 10-turn gathering conversation uses more tokens than one well-informed single call.

If the system is ever offered as SaaS to external clients, the `ai_api_call_logs` table already captures every call attributed by client_id, app_id, and user_id — the billing layer can be added without schema changes.

### Architecture

```
/shared/services/agent
  agent-data.service.ts      ← Typed data-fetching methods (the tool registry)
  agent-context.builder.ts   ← Assembles context bundle for App + entity
  agent-tool.registry.ts     ← Enforces allowed_tools per App session
  agent.runner.ts             ← Orchestrates Claude API with tool_use
  agent-tool-call-log.ts     ← Logs every tool call for auditability
```

**How it works:** When any AI App opens, the system (1) identifies the entity context (which project, client, or scope), (2) assembles a structured context bundle from the database and injects it into the AI's system prompt, (3) registers only the app's declared `allowed_tools` with the Claude API call, (4) runs Claude with `tools` parameter enabled so the AI can call any registered tool during reasoning to fetch additional live data.

**The rule:** Apps that ask users to re-enter data the system already has violate this architecture and must be fixed. Every AI App reads live system data automatically. It does not ask for what it can look up.

### Agent Data Tool Registry

All tools return typed, lightweight JSON summaries — not full database row dumps.

**Client Tools:** `get_client` · `get_client_contacts` · `get_client_projects` · `get_client_health_signals` · `get_client_csat_scores` · `get_client_courtesy_calls` · `get_child_accounts` · `get_kyc_records` · `get_active_kyc`

**Project Tools:** `get_project` · `get_project_milestones` · `get_project_tasks` · `get_project_timeline` · `get_project_timeline_history` · `get_project_risks` · `get_project_brd` · `get_project_fit_gap` · `get_project_team` · `get_project_learnings` · `get_project_recommendations`

**Timeline & Planning Tools:** `get_timeline_baseline` · `get_all_timeline_baselines` · `get_ph_holidays` · `get_working_days_between` · `project_end_date` · `get_user_workload` · `get_concurrent_projects`

**Task & Milestone Tools:** `get_task` · `get_subtasks` · `get_milestone_tasks` · `get_overdue_tasks` · `get_time_logs`

**KPI Tools:** `get_user_kpi_scorecard` · `get_milestone_log` · `get_usage_targets` · `get_usage_actuals` · `get_courtesy_call_compliance`

**Knowledge & Template Tools:** `get_project_template` · `get_knowledge_base_articles` · `get_past_brds` · `get_past_timelines` · `get_project_learnings_global` · `get_design_system`

**Department Tools:** `get_all_active_projects` · `get_team_workload_summary` · `get_exception_report` · `get_department_kpi_summary` · `get_pipeline_accounts` · `get_account_assignment_data` · `get_manpower_analysis`

---

## 2.4 Custom Fields (Notion-Style)

Every module supports user-defined custom fields added through the Admin UI without code changes. This is a core platform capability built as a shared service.

**Field types:**

| Type | Behavior |
|---|---|
| Short Text | Single-line, max 255 chars |
| Multi-line Text | Rich text, unlimited |
| Number | Integer or decimal, configurable precision |
| Date | Date picker |
| Date & Time | Date + time picker |
| Select (Single) | Dropdown with color-coded options (admin configures options + colors) |
| Select (Multi) | Same as Select but multiple values; renders as colored badge chips |
| Checkbox | Boolean toggle |
| URL | Validated URL, renders as clickable link |
| File Attachment | Upload files to Cloud Storage; renders as downloadable chips |
| Formula | Computed from other fields on same record; arithmetic, comparison, IF/ELSE, string concat; read-only |
| Lookup | Pulls a value from a related record via FK path (e.g., task → project → client → tier); read-only |
| Rollup | Aggregates across related records (COUNT, SUM, AVG, MIN, MAX); read-only |

### `custom_field_definitions` Table

| Field | Type | Notes |
|---|---|---|
| `field_def_id` | UUID | PK |
| `module_name` | string | e.g., "clients", "projects", "tasks" |
| `field_label` | string | Display name |
| `field_key` | string | Slugified internal key |
| `field_type` | enum | All types above |
| `options` | JSONB | For Select types: [{label, color_hex, value}] |
| `formula_expression` | text | For Formula type |
| `lookup_config` | JSONB | For Lookup/Rollup: {path, source_module, source_field, aggregation_fn} |
| `is_required` | boolean | |
| `show_in_list_view` | boolean | |
| `show_in_card_view` | boolean | |
| `sort_order` | integer | Column order in detail view |
| `created_by_id` | UUID | FK → users |
| `created_at` | timestamp | |

### `custom_field_values` Table

| Field | Type | Notes |
|---|---|---|
| `value_id` | UUID | PK |
| `field_def_id` | UUID | FK → custom_field_definitions |
| `entity_type` | string | e.g., "client", "project", "task" |
| `entity_id` | UUID | The record this value belongs to |
| `value_text` | text | For text/url/select fields |
| `value_number` | decimal | For number fields |
| `value_date` | date | |
| `value_datetime` | timestamp | |
| `value_boolean` | boolean | |
| `value_json` | JSONB | For multi-select, file attachments (array), lookup results |
| `updated_at` | timestamp | |

Custom fields appear in every record's detail view after system fields, labeled "Custom Fields". In list views, custom columns are toggled via the Columns button and shown with a tag icon in the column header.

---


---

# PART 3: DATABASE SCHEMA — ALL TABLES

All tables below must be created in exactly this form. No field may be omitted. All foreign keys must be enforced at the database level.

---

## 3.1 `users`

| Field | Type | Required | Description |
|---|---|---|---|
| `user_id` | UUID | YES | PK |
| `full_name` | string | YES | Display name |
| `email` | string | YES | From Google OAuth; unique; login identifier |
| `google_id` | string | YES | Google OAuth subject ID |
| `profile_photo_url` | string | | Google account avatar; falls back to initials |
| `role` | enum | YES | `super_admin`, `ceo`, `manager`, `supervisor`, `sr_business_analyst`, `jr_business_analyst`, `viewer` |
| `org_level` | enum | YES | `ceo`, `manager`, `supervisor`, `sr_ba`, `jr_ba`, `support` |
| `reports_to_id` | UUID | | FK → users; direct supervisor; null for CEO |
| `manager_id` | UUID | | FK → users; department manager |
| `team_id` | UUID | | FK → teams |
| `skills` | string[] | | Tags: "BRD Writing", "UAT", "Training", "Data Validation", "Facilitation" |
| `capacity_hours_per_week` | integer | YES | Default 40 |
| `status` | enum | YES | `active`, `inactive`, `on_leave` |
| `department` | string | | "Client Success Team" |
| `date_joined` | date | | Employment start |
| `scorecard_template_id` | UUID | | FK → kpi_scorecard_templates |
| `health_flag_no_metrics` | boolean | | Auto-set true by health engine when no active scorecard |
| `created_at` | timestamp | YES | Auto |
| `updated_at` | timestamp | YES | Auto |
| `deleted_at` | timestamp | | Soft delete |

**Workload badge formula:** `(sum of estimated_hours on active tasks this week) / capacity_hours_per_week × 100` — excludes weekends and PH holidays from capacity denominator.
- 🟢 Available: < 70%  
- 🟡 Busy: 70–90%  
- 🔴 Overloaded: > 90%

---

## 3.2 `clients`

| Field | Type | Required | Description |
|---|---|---|---|
| `client_id` | UUID | YES | PK |
| `parent_client_id` | UUID | | FK → clients (self-ref); null for standalone/parent accounts |
| `is_parent_account` | boolean | YES | Default false; true for accounts with child accounts |
| `company_name` | string | YES | |
| `industry` | string | | |
| `company_size` | enum | | `SME`, `Mid-Market`, `Enterprise` |
| `subscription_plan` | string | | Tarkie plan name |
| `contract_start_date` | date | | |
| `contract_end_date` | date | | Renewal date; triggers alerts at 90 and 7 days |
| `status` | enum | YES | `prospect`, `onboarding`, `active`, `at_risk`, `pending_closure`, `closed` |
| `lifecycle_stage` | enum | YES | Full 11-value enum (see below) |
| `tier` | string | | VIP, 1, 2, 3, 4, 5 |
| `cc_frequency` | enum | | Auto-derived from tier: `monthly`, `bi_monthly`, `quarterly`, `annual` |
| `client_health_score` | integer | | 0–100; AI-recalculated daily |
| `segment` | enum | | `Strategic`, `Standard`, `At-Risk` |
| `assigned_account_manager_id` | UUID | | FK → users |
| `assigned_team_member_ids` | UUID[] | | Array FK → users |
| `managed_by_maintenance_team` | boolean | | Default false; true for Tier 4/5 handed over |
| `face_to_face_this_year` | boolean | | Computed: true if ≥1 face-to-face meeting this calendar year |
| `face_to_face_last_meeting_date` | date | | Date of most recent in-person meeting |
| `address` | string | | |
| `website` | string | | |
| `tags` | string[] | | |
| `notes` | text | | Internal notes, rich text |
| `converted_from_pipeline_id` | UUID | | FK → acquisition_pipeline |
| `assignment_ai_recommendation_id` | UUID | | FK → ai_app_sessions; last AI assignment recommendation |
| `active_timeline_id` | UUID | | FK → project_timelines (official, approved) |
| `active_projected_timeline_id` | UUID | | FK → project_timelines (projected, is_official=false) |
| `kyc_status` | enum | | `not_started`, `in_progress`, `completed`, `needs_update` — tracks whether the KYC file is current |
| `kyc_last_completed_at` | timestamp | | When the KYC was last marked complete |
| `kyc_last_completed_by_id` | UUID | | FK → users; who last completed the KYC |
| `kyc_next_review_date` | date | | Scheduled next annual KYC review; system alerts the AM 30 days before |
| `active_kyc_record_id` | UUID | | FK → kyc_records; the most recently completed/active KYC record |
| `created_by_id` | UUID | YES | FK → users |
| `created_at` | timestamp | YES | Auto |
| `updated_at` | timestamp | YES | Auto |
| `deleted_at` | timestamp | | Soft delete |

### lifecycle_stage enum (11 values)

`acquisition` → `onboarding` → `implementation` → `go_live` → `hypercare` → `turnover` → `bau` → `renewal` → `expansion` → `closure` → `closed`

### Client Tier Table

| Tier | CC Frequency | Managed By | Notes |
|---|---|---|---|
| VIP | Monthly | Sr. BA + Supervisor pairing | Highest value; require dual ownership |
| 1 | Monthly | Sr. BA primary | High-value active accounts |
| 2 | Bi-monthly | Sr. BA or experienced Jr. BA | Mid-tier |
| 3 | Quarterly | Jr. BA | Standard accounts |
| 4 | Quarterly | Jr. BA or Maintenance Team | Lower engagement |
| 5 | Annual check-in | Maintenance Team only | Small/dormant; not assigned to CST members |

---

## 3.3 `client_contacts`

| Field | Type | Required | Description |
|---|---|---|---|
| `contact_id` | UUID | YES | PK |
| `client_id` | UUID | YES | FK → clients |
| `full_name` | string | YES | |
| `position` | string | | Job title |
| `department` | string | | |
| `email` | string | YES | Used for CSAT, MOM, comms |
| `mobile_number` | string | | |
| `contact_type` | enum | YES | `decision_maker`, `admin`, `influencer`, `end_user_lead`, `it_contact`, `executive_sponsor` |
| `is_primary` | boolean | | One per client; default comms recipient |
| `is_active` | boolean | YES | Default true; inactive = hidden from dropdowns |
| `notes` | text | | Internal notes |
| `source` | enum | | `kyc`, `acquisition_handover`, `project_discovery`, `manual` |
| `added_by_id` | UUID | YES | FK → users |
| `created_at` | timestamp | YES | Auto |
| `updated_at` | timestamp | YES | Auto |

---

## 3.4 `client_sla`

| Field | Type | Required | Description |
|---|---|---|---|
| `sla_id` | UUID | YES | PK |
| `client_id` | UUID | YES | FK → clients |
| `document_url` | string | | Cloud Storage URL |
| `sla_type` | enum | | `standard`, `enterprise`, `custom` |
| `response_time_hours` | integer | | |
| `resolution_time_hours` | integer | | |
| `uptime_commitment_percent` | decimal | | |
| `support_hours` | string | | e.g., "Mon–Fri 8AM–6PM" |
| `escalation_path` | text | | |
| `effective_date` | date | | |
| `expiry_date` | date | | Nullable |
| `version` | string | | e.g., v1.0, v1.1 |
| `uploaded_by_id` | UUID | YES | FK → users |
| `notes` | text | | |
| `created_at` | timestamp | YES | Auto |

---

## 3.5 `kyc_records`

A KYC record is a versioned snapshot of everything the CST team knows about a client — their business profile, stakeholder map, Tarkie configuration, relationship history, health, and account-specific nuances. It is created using the KYC Form Generator AI App and updated at least annually.

KYC completion is a KPI milestone (`milestone_type: kyc_completed`). The CST team is responsible for keeping it current. The system alerts the assigned AM when a KYC review is due.

| Field | Type | Required | Description |
|---|---|---|---|
| `kyc_id` | UUID | YES | PK |
| `client_id` | UUID | YES | FK → clients |
| `version_number` | integer | YES | Auto-incremented per client; 1 = first KYC, 2 = first annual update, etc. |
| `version_label` | string | YES | e.g., "Initial KYC — Feb 2025", "Annual Review — Feb 2026" |
| `status` | enum | YES | `draft`, `completed`, `needs_update`, `superseded` |
| `google_doc_id` | string | | Google Docs document ID for the KYC file |
| `google_doc_url` | string | | Direct link to the Google Doc |
| `document_url` | string | | Cloud Storage PDF backup URL |
| `company_profile` | JSONB | | Company details at time of KYC: {legal_name, trade_name, industry, employee_count, field_workforce_count, regions_covered, products_services, website, headquarters} |
| `subscription_details` | JSONB | | Tarkie plan at time of KYC: {plan, contract_period, licensed_seats, payment_terms, billing_contact} |
| `stakeholder_map` | JSONB | | Snapshot of contacts at time of KYC: [{name, position, department, tarkie_role, contact_type, email, mobile, notes}] |
| `tarkie_config_summary` | JSONB | | Features enabled, custom configurations, integrations, key metrics tracked |
| `relationship_history` | JSONB | | Key milestones and past engagements |
| `account_health_at_time` | JSONB | | Health score, CC compliance, CSAT scores at time of KYC completion |
| `account_notes` | text | | Key nuances, communication preferences, sensitivities |
| `renewal_risk` | enum | | `low`, `medium`, `high` |
| `renewal_risk_rationale` | text | | |
| `prepared_by_id` | UUID | YES | FK → users |
| `completed_at` | timestamp | | When marked complete |
| `next_review_date` | date | | Set by system or AM; defaults to 1 year from completed_at |
| `linked_milestone_log_id` | UUID | | FK → milestone_logs; the KPI log entry created when this KYC was completed |
| `created_at` | timestamp | YES | Auto |
| `updated_at` | timestamp | YES | Auto |
| `deleted_at` | timestamp | | Soft delete |

### KYC Lifecycle Rules

- When a KYC record status changes to `completed`: the parent client's `kyc_status` → `completed`, `kyc_last_completed_at` → now, `active_kyc_record_id` → this record's ID, and a `kyc_completed` milestone_log entry is auto-created
- When a new KYC version is created: the previous record's status → `superseded`; the new record's status starts as `draft`
- When `next_review_date` is 30 days away: system sends a notification to the assigned AM — "KYC review due for [Client Name] on [date]"
- When `next_review_date` is passed and kyc_status ≠ `completed`: `kyc_status` → `needs_update`; this is flagged as a health check issue in the System Health Dashboard
- A `kyc_completed` milestone is a KPI milestone — it counts toward the assigned AM's KYC metric in the scorecard

---

## 3.6 `projects`

| Field | Type | Required | Description |
|---|---|---|---|
| `project_id` | UUID | YES | PK |
| `client_id` | UUID | YES | FK → clients |
| `project_name` | string | YES | |
| `project_code` | string | | Auto: `{CLIENT_CODE}-{TYPE}-{YEAR}-{SEQ}` |
| `project_type` | enum | YES | `new_implementation`, `customization`, `express_implementation`, `enterprise_implementation`, `re_implementation`, `support_project` |
| `template_id` | UUID | YES | FK → project_templates |
| `start_date` | date | YES | Synced from active_timeline_id |
| `target_go_live_date` | date | YES | Synced from active_timeline_id |
| `actual_go_live_date` | date | | Auto-set when Go-Live milestone Done |
| `status` | enum | YES | `draft`, `active`, `on_hold`, `completed`, `cancelled` |
| `phase` | enum | YES | 11-phase enum (see below) |
| `priority` | enum | YES | `critical`, `high`, `medium`, `low` |
| `assigned_pm_id` | UUID | YES | FK → users |
| `team_member_ids` | UUID[] | | Array FK → users |
| `project_weight` | decimal | | Default 1.0; used in KPI Projects metric |
| `estimated_manhours` | decimal | | From template; adjustable |
| `actual_manhours` | decimal | | Auto-summed from time_logs |
| `active_timeline_id` | UUID | | FK → project_timelines (approved official) |
| `active_projected_timeline_id` | UUID | | FK → project_timelines (projected) |
| `baseline_start_date` | date | | Immutable snapshot at first plan approval |
| `baseline_go_live_date` | date | | Immutable snapshot at first plan approval |
| `plan_submitted_at` | timestamp | | When PM clicked Submit Plan |
| `plan_approved_at` | timestamp | | When supervisor approved |
| `plan_approved_by_id` | UUID | | FK → users |
| `risk_level` | enum | | `low`, `medium`, `high`, `critical` |
| `risk_notes` | text | | |
| `scope_description` | text | | Rich text |
| `tags` | string[] | | |
| `created_by_id` | UUID | YES | FK → users |
| `created_at` | timestamp | YES | Auto |
| `updated_at` | timestamp | YES | Auto |
| `deleted_at` | timestamp | | Soft delete |

### Project Phase Enum (11 phases)

| Value | Display | Order | Gate |
|---|---|---|---|
| `pre_sales_handover` | Pre-Sales Handover | 1 | None |
| `kickoff` | Kickoff | 2 | None |
| `fit_gap` | Fit-Gap Analysis | 3 | None |
| `solution_design` | Solution Design | 4 | None |
| `build_config` | Build / Configuration | 5 | None |
| `uat` | User Acceptance Testing | 6 | None |
| `go_live` | Go-Live | 7 | None |
| `training` | Training | 8 | None |
| `hypercare` | Hypercare | 9 | None |
| `turnover` | Turnover to Maintenance | 10 | 10-item checklist + 2 sign-offs required |
| `bau` | BAU (Business As Usual) | 11 | Only reachable after Turnover fully signed off |

---

## 3.6 `project_timelines`

| Field | Type | Required | Description |
|---|---|---|---|
| `timeline_id` | UUID | YES | PK |
| `project_id` | UUID | YES | FK → projects |
| `baseline_id` | UUID | | FK → timeline_baselines (snapshot at creation; non-retroactive) |
| `version_number` | integer | YES | Auto-incremented per project |
| `version_label` | string | YES | "Projected — Initial Estimate", "Official v1", "Revision 1 — Scope Expansion" |
| `status` | enum | YES | `projected`, `draft`, `pending_approval`, `approved`, `superseded` |
| `is_official` | boolean | YES | false for projected; true for official (post-kickoff, client-aligned) |
| `start_date` | date | YES | Project start in this version |
| `target_go_live_date` | date | YES | Target go-live in this version |
| `phase_dates` | JSONB | YES | `[{phase, start_date, end_date, estimated_duration_days, is_locked}]` |
| `completed_milestones_snapshot` | JSONB | | For revisions: `[{milestone_id, name, actual_completion_date}]` |
| `revision_reason` | text | | Required for revisions |
| `revision_category` | enum | | `client_request`, `scope_change`, `client_delay`, `technical_issue`, `resource_change`, `force_majeure`, `other` |
| `days_variance` | integer | | vs first official timeline; positive=delay |
| `ai_generated` | boolean | YES | true if Timeline App generated this |
| `ai_reasoning` | text | | AI's explanation of how dates were calculated |
| `conflict_warnings` | JSONB | | `[{type, description, affected_user_id, affected_dates}]` |
| `linked_rfa_id` | UUID | | FK → rfas; required for official + revisions |
| `linked_recommendation_id` | UUID | | FK → project_recommendations |
| `approved_by_id` | UUID | | FK → users |
| `approved_at` | timestamp | | |
| `created_by_id` | UUID | YES | FK → users |
| `created_at` | timestamp | YES | Auto |
| `updated_at` | timestamp | YES | Auto |
| `deleted_at` | timestamp | | Soft delete |

**Timeline activation rule:** When a timeline is approved, all sibling timelines become `superseded`, the parent project's `active_timeline_id` is updated, all project milestone `due_date` values are recalculated from `phase_dates`, and all tasks shift by the same delta as their parent phase. This happens in a single database transaction.

---

## 3.7 `timeline_baselines`

Global configuration table defining standard phase duration norms per project type. Changes are non-retroactive — existing timelines retain their `baseline_id` snapshot.

| Field | Type | Required | Description |
|---|---|---|---|
| `baseline_id` | UUID | YES | PK |
| `project_type` | enum | YES | Project type this applies to |
| `version_number` | integer | YES | Auto-incremented per project_type |
| `version_label` | string | YES | "NCI Standard v1", "NCI Standard v2 — Updated Build norms" |
| `is_active` | boolean | YES | Only one active per project_type |
| `total_estimated_working_days` | integer | YES | Total standard working days end-to-end |
| `total_estimated_manhours` | decimal | YES | Total standard manhours |
| `phase_norms` | JSONB | YES | `[{phase, standard_working_days, min_working_days, max_working_days, buffer_days, notes}]` |
| `milestone_norms` | JSONB | YES | `[{milestone_type, phase, standard_working_days_from_phase_start, notes}]` |
| `change_reason` | text | | Required when version > 1 |
| `created_by_id` | UUID | YES | FK → users |
| `activated_at` | timestamp | | When set as active |
| `activated_by_id` | UUID | | FK → users |
| `created_at` | timestamp | YES | Auto |
| `updated_at` | timestamp | YES | Auto |

**Seeded: NCI-STD baseline norms**

| Phase | Standard WD | Min | Max |
|---|---|---|---|
| Pre-Sales Handover | 2 | 1 | 5 |
| Kickoff | 3 | 1 | 5 |
| Fit-Gap Analysis | 5 | 3 | 10 |
| Solution Design | 8 | 5 | 15 |
| Build / Configuration | 12 | 8 | 25 |
| UAT | 5 | 3 | 10 |
| Go-Live | 1 | 1 | 3 |
| Training | 3 | 2 | 5 |
| Hypercare | 10 | 7 | 30 |
| Turnover | 5 | 3 | 10 |

---

## 3.8 `project_milestones`

| Field | Type | Required | Description |
|---|---|---|---|
| `milestone_id` | UUID | YES | PK |
| `project_id` | UUID | YES | FK → projects |
| `timeline_id` | UUID | YES | FK → project_timelines; updated when timeline changes |
| `template_milestone_id` | UUID | | FK → project_template_milestones |
| `phase` | enum | YES | Project phase |
| `name` | string | YES | Display name |
| `milestone_type` | enum | YES | Full enum: kickoff / fit_gap_completed / recommendation_presented / recommendation_approved / uat_conducted / go_live / training_conducted / hypercare_closed / rfa_approved / mockup_approved / courtesy_call_completed / kyc_completed / next_steps_agreed / poc_delivered |
| `is_kpi_milestone` | boolean | YES | If true: auto-logs in milestone_log when complete |
| `completion_rule` | enum | YES | `all_tasks_done` (default) or `manual` |
| `due_date` | date | | Derived from active timeline phase_dates |
| `actual_completion_date` | date | | Auto-set when all child tasks Done (if completion_rule=all_tasks_done) |
| `status` | enum | YES | `pending`, `in_progress`, `completed`, `overdue` |
| `responsible_user_id` | UUID | | FK → users |
| `quality_score` | decimal | | 0–100; supervisor input; feeds KPI scorecard |
| `quality_notes` | text | | Supervisor feedback |
| `order` | integer | | Display order within phase |
| `created_at` | timestamp | YES | Auto |
| `updated_at` | timestamp | YES | Auto |

---

## 3.9 `tasks`

| Field | Type | Required | Description |
|---|---|---|---|
| `task_id` | UUID | YES | PK |
| `parent_task_id` | UUID | | FK → tasks (self-ref); null = top-level |
| `project_id` | UUID | | FK → projects |
| `milestone_id` | UUID | | FK → project_milestones |
| `client_id` | UUID | | FK → clients; for account-level tasks |
| `rfa_id` | UUID | | FK → rfas |
| `linked_pipeline_id` | UUID | | FK → acquisition_pipeline |
| `template_task_id` | UUID | | FK → project_template_tasks |
| `task_code` | string | | Template code or auto-generated |
| `title` | string | YES | |
| `description` | text | | Rich text; checklists, @mentions, image paste |
| `status` | enum | YES | `todo`, `in_progress`, `for_review`, `blocked`, `done`, `cancelled` |
| `priority` | enum | YES | `critical`, `high`, `medium`, `low` |
| `task_type` | enum | YES | Full enum (see below) |
| `assigned_to_id` | UUID | | FK → users (internal) |
| `is_external_task` | boolean | | Default false; true when assigned to client contact |
| `external_assignee_contact_id` | UUID | | FK → client_contacts |
| `external_task_note` | text | | Note for client contact |
| `created_by_id` | UUID | YES | FK → users |
| `start_date` | date | | Planned start (Gantt Plan bar left edge) |
| `end_date` | date | | Planned end / due date (Gantt Plan bar right edge) |
| `scheduled_date` | date | | Day user personally plans to work on this |
| `actual_start_date` | date | | Auto-set on first time log or first in_progress status |
| `actual_completion_date` | date | | Auto-set when status → done; drives Timeline Actual bar |
| `estimated_hours` | decimal | | |
| `actual_hours` | decimal | | Auto-summed from time_logs |
| `completion_percentage` | integer | | Auto from subtasks if exist; manual otherwise |
| `dependency_task_ids` | UUID[] | | Must be Done before this task can start |
| `linked_app_ids` | UUID[] | | FK → ai_apps; shown as shortcut buttons |
| `app_context_mapping` | JSONB | | How to pre-fill each linked app |
| `email_trigger_config` | JSONB | | `{triggers:[{on_status, script_template_id, send_mode, recipients_to[], recipients_cc[]}]}` |
| `communication_trigger_id` | UUID | | FK → script_templates |
| `scheduled_on_nonworking_day` | boolean | | True if user placed on weekend/holiday |
| `is_recurring` | boolean | | |
| `recurrence_rule` | JSONB | | iCal RRULE format |
| `tags` | string[] | | |
| `sort_order` | integer | | Manual ordering |
| `time_block_start` | time | | Optional calendar time block start |
| `time_block_end` | time | | Optional calendar time block end |
| `created_at` | timestamp | YES | Auto |
| `updated_at` | timestamp | YES | Auto |
| `deleted_at` | timestamp | | Soft delete |

### task_type enum (11 values)

| Type | Calendar Color (Planned / Done) | Counts in DAR |
|---|---|---|
| `implementation` | orange-50 / orange-500 | YES |
| `customization` | ember-50 / ember-500 | YES |
| `training` | yellow-50 / yellow-500 | YES |
| `meeting_internal` | blue-50 / blue-500 | YES |
| `meeting_external` | violet-50 / violet-500 | YES |
| `courtesy_call` | green-50 / green-500 | YES |
| `admin` | gray-50 / gray-600 | YES |
| `rfa_item` | ember-50 / ember-500 | YES |
| `milestone_deliverable` | blue-50 / blue-500 | YES |
| `acquisition_poc` | orange-50 / orange-500 | YES |
| `system_admin` | gray-50 / gray-600 | YES |

### Milestone Auto-Completion (single DB transaction)

When a task status → `done`:
1. `actual_completion_date = today`
2. Check if all sibling tasks (same milestone_id) are Done or Cancelled
3. If YES and `completion_rule = all_tasks_done`: milestone `actual_completion_date = today`, status → completed
4. If `is_kpi_milestone = true`: create milestone_log entry
5. Check if all milestones in current phase are complete → update project's Actual bar
6. Notify supervisor to rate quality score

---

## 3.10 `time_logs`

| Field | Type | Required | Description |
|---|---|---|---|
| `log_id` | UUID | YES | PK |
| `task_id` | UUID | YES | FK → tasks |
| `user_id` | UUID | YES | FK → users |
| `project_id` | UUID | | FK → projects (denormalized) |
| `client_id` | UUID | | FK → clients (denormalized) |
| `date` | date | YES | Working day logged |
| `hours` | decimal | YES | e.g., 2.5 |
| `description` | text | | What was done |
| `created_at` | timestamp | YES | Auto |

---

## 3.11 `meetings`

| Field | Type | Required | Description |
|---|---|---|---|
| `meeting_id` | UUID | YES | PK |
| `client_id` | UUID | YES | FK → clients |
| `project_id` | UUID | | FK → projects |
| `title` | string | YES | |
| `meeting_type` | enum | YES | `kickoff`, `fit_gap`, `courtesy_call`, `uat_walkthrough`, `training`, `internal`, `escalation`, `go_live_review`, `hypercare_review`, `cct_endorsement`, `recommendation_presentation`, `face_to_face_annual` |
| `is_face_to_face` | boolean | YES | Default false; true = in-person; drives annual F2F KPI |
| `meeting_date` | datetime | YES | |
| `participants` | JSONB | | [{name, email, role, is_internal}] |
| `platform` | enum | | `zoom`, `google_meet`, `in_person`, `teams`, `other` |
| `zoom_meeting_id` | string | | From Zoom API |
| `zoom_join_url` | string | | |
| `recording_url` | string | | Cloud Storage URL |
| `transcript_raw` | text | | Raw AI transcript |
| `transcript_formatted` | text | | Cleaned transcript |
| `ai_summary` | text | | AI-generated summary |
| `action_items` | JSONB | | [{description, owner, due_date, status}] |
| `decisions` | JSONB | | [{decision, made_by, date}] |
| `pain_points` | JSONB | | AI-extracted |
| `requirements` | JSONB | | AI-extracted |
| `risks_identified` | JSONB | | AI-extracted |
| `follow_up_meeting_id` | UUID | | FK → meetings |
| `status` | enum | YES | `scheduled`, `completed`, `cancelled`, `no_show` |
| `created_by_id` | UUID | YES | FK → users |
| `created_at` | timestamp | YES | Auto |
| `updated_at` | timestamp | YES | Auto |
| `deleted_at` | timestamp | | Soft delete |

---

## 3.12 `rfas`

| Field | Type | Required | Description |
|---|---|---|---|
| `rfa_id` | UUID | YES | PK; displayed as RFA-YYYY-NNNNN |
| `project_id` | UUID | YES | FK → projects |
| `client_id` | UUID | YES | FK → clients |
| `request_type` | enum | YES | `customization`, `scope_change`, `timeline_revision`, `timeline_extension`, `budget_exception`, `recommendation_approval`, `technical_exception`, `other` |
| `title` | string | YES | |
| `description` | text | YES | Rich text |
| `priority` | enum | YES | `critical`, `high`, `medium`, `low` |
| `requested_by_id` | UUID | YES | FK → users |
| `sla_days` | integer | | Expected resolution time |
| `submitted_at` | timestamp | | |
| `approved_by_id` | UUID | | FK → users |
| `status` | enum | YES | `draft`, `submitted`, `under_review`, `approved`, `rejected`, `cancelled` |
| `approval_notes` | text | | |
| `estimated_effort_hours` | decimal | | |
| `actual_manhours` | decimal | | |
| `turnaround_time_days` | integer | | Auto-calculated |
| `completion_date` | date | | |
| `attachments` | JSONB | | File references |
| `ai_review_grade` | enum | | `approved_recommended`, `needs_clarification`, `rejected_recommended` |
| `ai_review_summary` | text | | AI-generated review output |
| `ai_review_completeness_score` | integer | | 0–100 |
| `ai_review_flags` | JSONB | | Issues the AI flagged |
| `linked_draft_timeline_id` | UUID | | FK → project_timelines; for timeline_revision RFAs |
| `tags` | string[] | | |
| `created_at` | timestamp | YES | Auto |
| `updated_at` | timestamp | YES | Auto |
| `deleted_at` | timestamp | | Soft delete |

---

## 3.13 `brds`

| Field | Type | Required | Description |
|---|---|---|---|
| `brd_id` | UUID | YES | PK |
| `project_id` | UUID | YES | FK → projects |
| `client_id` | UUID | YES | FK → clients |
| `version` | string | YES | v1.0, v1.1, v2.0 |
| `version_number` | integer | YES | Auto-incremented |
| `status` | enum | YES | `draft`, `for_review`, `approved`, `rejected`, `superseded` |
| `title` | string | YES | |
| `created_by_id` | UUID | YES | FK → users |
| `approved_by_id` | UUID | | FK → users |
| `linked_meeting_ids` | UUID[] | | Source meetings |
| `linked_fit_gap_id` | UUID | | FK → fit_gap_analyses |
| `content` | JSONB | YES | All BRD sections (see BRD content schema) |
| `google_doc_id` | string | | |
| `google_doc_url` | string | | |
| `attachments` | JSONB | | [{file_id, filename, file_url, file_type, uploaded_by, uploaded_at, caption, attachment_type}] |
| `speech_to_text_notes` | JSONB | | [{note_id, text, recorded_at, duration_seconds, recorded_by_id}] |
| `submitted_for_review_at` | timestamp | | |
| `approved_at` | timestamp | | |
| `created_at` | timestamp | YES | Auto |
| `updated_at` | timestamp | YES | Auto |
| `deleted_at` | timestamp | | Soft delete |

---

## 3.14 `project_recommendations`

| Field | Type | Required | Description |
|---|---|---|---|
| `recommendation_id` | UUID | YES | PK |
| `project_id` | UUID | YES | FK → projects |
| `client_id` | UUID | YES | FK → clients |
| `version` | string | YES | v1.0, v1.1 |
| `status` | enum | YES | `draft`, `internal_review`, `presented`, `approved`, `rejected`, `superseded` |
| `title` | string | YES | |
| `documents` | JSONB | YES | [{doc_type, title, file_url, google_doc_url, notes}] — types: scope_overview, fit_gap_summary, proposed_solution, timeline, mockups, customization_scope, pricing, other |
| `linked_timeline_id` | UUID | | FK → project_timelines |
| `linked_brd_id` | UUID | | FK → brds |
| `presentation_meeting_id` | UUID | | FK → meetings |
| `google_slides_url` | string | | |
| `approval_rfa_id` | UUID | | FK → rfas |
| `presented_by_id` | UUID | | FK → users |
| `presented_at` | timestamp | | |
| `approved_by_id` | UUID | | FK → users |
| `approved_at` | timestamp | | |
| `rejection_notes` | text | | |
| `created_by_id` | UUID | YES | FK → users |
| `created_at` | timestamp | YES | Auto |
| `updated_at` | timestamp | YES | Auto |
| `deleted_at` | timestamp | | Soft delete |

---

## 3.15 `project_risks`

| Field | Type | Description |
|---|---|---|
| `risk_id` | UUID | PK |
| `project_id` | UUID | FK → projects |
| `category` | enum | `schedule`, `resource`, `technical`, `client`, `scope` |
| `description` | text | |
| `likelihood` | enum | `low`, `medium`, `high` |
| `impact` | enum | `low`, `medium`, `high` |
| `risk_score` | integer | Auto: likelihood_num × impact_num (1–9) |
| `mitigation_plan` | text | |
| `owner_id` | UUID | FK → users |
| `status` | enum | `open`, `mitigated`, `closed` |
| `created_at` | timestamp | Auto |
| `updated_at` | timestamp | Auto |

---

## 3.16 `turnover_records`

| Field | Type | Description |
|---|---|---|
| `turnover_id` | UUID | PK |
| `project_id` | UUID | FK → projects |
| `client_id` | UUID | FK → clients |
| `status` | enum | `not_started`, `in_progress`, `pending_sign_off`, `completed` |
| `cst_handler_id` | UUID | FK → users |
| `cct_receiver_id` | UUID | FK → users |
| `endorsement_meeting_id` | UUID | FK → meetings |
| `sla_document_id` | UUID | FK → documents |
| `handover_document_id` | UUID | FK → documents |
| `cst_sign_off_by_id` | UUID | FK → users |
| `cst_signed_off_at` | timestamp | |
| `cct_sign_off_by_id` | UUID | FK → users |
| `cct_signed_off_at` | timestamp | |
| `target_completion_date` | date | |
| `actual_completion_date` | date | |
| `deliverables_checklist` | JSONB | [{item_number, name, status, completed_at, notes}] — 10 items |
| `notes` | text | |

---

## 3.17 `milestone_logs`

Auto-created when an `is_kpi_milestone` milestone is completed.

| Field | Type | Description |
|---|---|---|
| `log_id` | UUID | PK |
| `user_id` | UUID | FK → users |
| `milestone_id` | UUID | FK → project_milestones |
| `task_id` | UUID | FK → tasks |
| `project_id` | UUID | FK → projects |
| `client_id` | UUID | FK → clients |
| `milestone_type` | enum | From milestone_type enum |
| `milestone_name` | string | |
| `completed_at` | timestamp | |
| `timeliness` | enum | `on_time`, `delayed` |
| `quality_score` | decimal | 0–100; supervisor input |
| `quality_notes` | text | |
| `kpi_period_id` | UUID | FK → kpi_periods |
| `is_counted_in_kpi` | boolean | |
| `count_in_period` | date | If deferred to next month |

---

## 3.18 `kpi_periods`, `kpi_scorecard_templates`, `kpi_categories`, `kpi_metrics`, `kpi_scorecard_instances`, `kpi_metric_scores`

These tables power the KPI scorecard engine. See master instruction Section 36 for full field definitions. They are not repeated here to avoid duplication — consult the master instruction for the complete KPI schema.

---

## 3.19 `ai_apps`

| Field | Type | Required | Description |
|---|---|---|---|
| `app_id` | UUID | YES | PK |
| `app_code` | string | YES | Unique slug: "brd-maker", "timeline-maker" etc. |
| `name` | string | YES | Display name |
| `description` | text | | |
| `category` | enum | YES | `document_generation`, `planning`, `analysis`, `reporting`, `communication`, `advisory` |
| `icon` | string | | Emoji or Lucide icon name |
| `claude_md_instruction` | text | YES | The full CLAUDE.md system prompt (versioned) |
| `claude_md_version` | integer | YES | Auto-incremented |
| `allowed_tools` | string[] | YES | Agent Data Tool names this app may call |
| `auto_context_fields` | JSONB | | Data auto-injected before Step 1: [{field_label, tool_name, tool_params_from_context}] |
| `context_entity_type` | enum | YES | `project`, `client`, `user`, `department`, `standalone` |
| `steps` | JSONB | | [{step_number, title, description}] — the app's conversation steps |
| `max_context_tokens` | integer | | Token budget; context builder truncates if exceeded |
| `output_format` | enum | | `document`, `timeline_record`, `structured_data`, `recommendation`, `chat` |
| `is_system_app` | boolean | YES | true = cannot be deleted |
| `is_active` | boolean | YES | Default true; false = disabled system-wide immediately |
| `disabled_reason` | text | | Admin note |
| `disabled_by_id` | UUID | | FK → users |
| `disabled_at` | timestamp | | |
| `total_cost_this_month` | decimal | | Computed hourly from ai_api_call_logs |
| `total_sessions_this_month` | integer | | Computed hourly |
| `required_roles` | enum[] | | Roles that can access this app |
| `created_at` | timestamp | YES | Auto |
| `updated_at` | timestamp | YES | Auto |
| `deleted_at` | timestamp | | Soft delete |

---

## 3.20 `ai_api_call_logs`

Every Claude API call from any source is logged here.

| Field | Type | Required | Description |
|---|---|---|---|
| `call_id` | UUID | YES | PK |
| `app_id` | UUID | | FK → ai_apps; null for system-generated calls |
| `app_session_id` | UUID | | Groups all calls within one user session |
| `system_feature` | string | | For non-App calls: "client_health_score", "rfa_ai_review", "meeting_transcript" |
| `user_id` | UUID | | FK → users; null for background calls |
| `project_id` | UUID | | FK → projects |
| `client_id` | UUID | | FK → clients |
| `model` | string | YES | "claude-sonnet-4-6" |
| `prompt_tokens` | integer | YES | Input tokens |
| `completion_tokens` | integer | YES | Output tokens |
| `total_tokens` | integer | YES | Sum |
| `estimated_cost_usd` | decimal | YES | Calculated at call time |
| `duration_ms` | integer | | |
| `status` | enum | YES | `success`, `error`, `timeout` |
| `error_message` | text | | |
| `called_at` | timestamp | YES | Auto |

---

## 3.21 `ai_cost_budgets`

| Field | Type | Description |
|---|---|---|
| `budget_id` | UUID | PK |
| `scope` | enum | `system_total`, `per_app`, `per_feature` |
| `app_id` | UUID | FK → ai_apps; null if system_total |
| `feature_name` | string | For per_feature scope |
| `monthly_limit_usd` | decimal | |
| `alert_at_percent` | integer | Default 80 |
| `action_at_limit` | enum | `alert_only` (default), `disable_app` |
| `is_active` | boolean | |
| `created_by_id` | UUID | FK → users |
| `created_at` | timestamp | Auto |

---

## 3.22 `agent_tool_call_logs`

| Field | Type | Description |
|---|---|---|
| `log_id` | UUID | PK |
| `app_session_id` | UUID | Groups all tool calls in one App session |
| `app_id` | UUID | FK → ai_apps |
| `user_id` | UUID | FK → users |
| `tool_name` | string | Tool called |
| `parameters` | JSONB | Parameters passed |
| `result_summary` | text | Brief description of what was returned |
| `called_at` | timestamp | Auto |
| `duration_ms` | integer | |

---

## 3.23 `project_portal_tokens`

| Field | Type | Description |
|---|---|---|
| `token_id` | UUID | PK |
| `project_id` | UUID | FK → projects |
| `secure_token` | string | Unique 32-char URL-safe token |
| `passcode_hash` | string | bcrypt hash; null if no passcode |
| `allowed_contact_ids` | UUID[] | FK → client_contacts |
| `is_active` | boolean | Can be revoked by PM anytime |
| `expires_at` | timestamp | Optional; null = never |
| `last_accessed_at` | timestamp | |
| `access_log` | JSONB | [{contact_id, accessed_at, ip_hash}] |
| `created_by_id` | UUID | FK → users |
| `created_at` | timestamp | Auto |

---

## 3.24 `staff_onboarding`

| Field | Type | Description |
|---|---|---|
| `onboarding_id` | UUID | PK |
| `user_id` | UUID | FK → users |
| `start_date` | date | First day |
| `role_assigned` | enum | FK → roles |
| `supervisor_id` | UUID | FK → users |
| `onboarding_template_id` | UUID | FK → onboarding_templates |
| `status` | enum | `in_progress`, `completed`, `cancelled` |
| `checklist` | JSONB | [{step, description, due_date, completed_at, assigned_to}] |
| `notes` | text | |
| `created_at` | timestamp | Auto |

---

## 3.25 `news_feed_events`

| Field | Type | Description |
|---|---|---|
| `event_id` | UUID | PK |
| `event_type` | enum | Full enum: task_completed, milestone_reached, project_phase_advanced, brd_approved, rfa_submitted, rfa_approved, project_created, courtesy_call_done, csat_received, go_live, training_done, account_onboarded, comment_mention, kpi_score_updated, poc_delivered, health_issue_resolved, holiday_reminder, team_announcement |
| `actor_id` | UUID | FK → users; who triggered it |
| `subject_entity_type` | string | "task", "project", "client" etc. |
| `subject_entity_id` | UUID | The record this event is about |
| `title` | string | Short rendered headline |
| `body` | text | Optional detail text |
| `metadata` | JSONB | Extra context |
| `visibility` | enum | `team`, `private`, `manager_only` |
| `is_highlighted` | boolean | Milestone events: blue-50 bg + blue-500 left border |
| `reactions` | JSONB | [{user_id, emoji, created_at}] |
| `comment_count` | integer | Cached count |
| `created_at` | timestamp | Auto |

---

## 3.26 `ph_holidays`

| Field | Type | Description |
|---|---|---|
| `holiday_id` | UUID | PK |
| `date` | date | Holiday date |
| `year` | integer | |
| `name` | string | e.g., "Maundy Thursday" |
| `local_name` | string | Filipino name e.g., "Huwebes Santo" |
| `holiday_type` | enum | `regular`, `special_non_working`, `special_working` |
| `is_manual_override` | boolean | True if admin added (presidential proclamations) |
| `source` | string | "nager.date" or "manual" |
| `created_at` | timestamp | Auto |

Source API: `https://date.nager.at/api/v3/PublicHolidays/{year}/PH` — called once on January 1 each year; results stored here. Admin can add overrides.

---

## 3.27 `csat_surveys`

| Field | Type | Description |
|---|---|---|
| `survey_id` | UUID | PK; displayed as CSAT-YYYY-NNNNN |
| `client_id` | UUID | FK → clients |
| `project_id` | UUID | FK → projects |
| `survey_type` | enum | `post_go_live`, `post_hypercare`, `periodic_check`, `ad_hoc`, `exit` |
| `sent_to_contact_id` | UUID | FK → client_contacts |
| `secure_token` | string | Token-authenticated survey URL |
| `sent_by_id` | UUID | FK → users |
| `sent_at` | timestamp | |
| `opened_at` | timestamp | |
| `responded_at` | timestamp | |
| `expires_at` | timestamp | |
| `status` | enum | `sent`, `opened`, `responded`, `expired` |
| `score_app_dashboard` | integer | 1–10 |
| `score_implementation_manager` | integer | 1–10 |
| `score_overall` | integer | 1–10 |
| `comments` | text | Respondent comments |
| `created_at` | timestamp | Auto |

---

## 3.28 `courtesy_call_assignments`

| Field | Type | Description |
|---|---|---|
| `cc_id` | UUID | PK |
| `client_id` | UUID | FK → clients |
| `assigned_to_id` | UUID | FK → users |
| `period_month` | integer | e.g., 2 for February |
| `period_year` | integer | e.g., 2026 |
| `required` | boolean | Default true |
| `status` | enum | `pending`, `scheduled`, `completed`, `overdue`, `deferred`, `not_required` |
| `meeting_id` | UUID | FK → meetings; set when completed |
| `deferred_reason` | text | |
| `created_at` | timestamp | Auto |
| `updated_at` | timestamp | Auto |

---

## 3.29 `acquisition_pipeline`

| Field | Type | Description |
|---|---|---|
| `pipeline_id` | UUID | PK; displayed as ACQ-YYYY-NNNNN |
| `company_name` | string | |
| `industry` | string | |
| `company_size` | enum | SME / Mid-Market / Enterprise |
| `deal_stage` | enum | `prospect`, `qualified`, `demo_done`, `proposal_sent`, `negotiation`, `won_pending_onboarding`, `lost` |
| `projected_tier` | string | Expected tier on conversion |
| `assigned_to_id` | UUID | FK → users; expected future AM |
| `poc_required` | boolean | |
| `poc_assigned_to_id` | UUID | FK → users |
| `poc_target_date` | date | |
| `poc_description` | text | |
| `target_assignment_date` | date | Expected date to formally assign a team member |
| `converted_to_client_id` | UUID | FK → clients; set when won |
| `notes` | text | |
| `created_by_id` | UUID | FK → users |
| `created_at` | timestamp | Auto |
| `updated_at` | timestamp | Auto |
| `deleted_at` | timestamp | Soft delete |

---


---

# PART 4: ALL AI APPS — COMPLETE SPECIFICATIONS

Each app below is fully specified with: purpose, allowed tools, auto-context, steps, and the complete CLAUDE.md instruction. All apps are seeded at system initialization and cannot be deleted (`is_system_app: true`). Every app is cost-monitored via `ai_api_call_logs`.

---

## APP 1: BRD MAKER

**App Code:** `brd-maker`  
**Category:** `document_generation`  
**Icon:** 📝  
**Context Entity:** `project`  
**Output:** BRD record + Google Doc  
**Required Roles:** jr_business_analyst, sr_business_analyst, supervisor, manager

**Allowed Tools:** `get_project` · `get_client` · `get_client_contacts` · `get_project_fit_gap` · `get_project_milestones` · `get_project_brd` · `get_project_timeline` · `get_knowledge_base_articles` · `get_past_brds` · `get_design_system`

**Auto-Context:** Project record · Client record · Latest fit-gap analysis · Previous BRD versions (if any)

**Steps:**
1. Project Setup — gather project context, objectives, scope, stakeholders, as-is/to-be process
2. Deep Dive Per Capability — for each Tarkie platform (Field App / Dashboard / Manager App)
3. User Stories — by role and by platform
4. Acceptance Criteria — testable criteria per platform
5. Generate BRD Draft — full document with Mermaid process flow
6. Finalize — validate, apply feedback, produce final output

---

### CLAUDE.md — BRD Maker

```
ROLE AND MISSION

You are a Senior Business Analyst AI embedded in the BRD Maker for the CST
team at MobileOptima/Tarkie. Your mission is to guide users through creating
a clear, concise, developer-ready Business Requirements Document for Tarkie
system enhancements or new client-driven capabilities.

You are a structured guide — not just a template filler. Ask the right questions,
catch missing information, propose best-practice defaults, and generate professional
BRDs that developers can act on immediately.

TARKIE CONTEXT

Tarkie is a Field Force Automation platform with three surfaces:
- Field App: field agents capture data, execute tasks, submit forms, see targets vs actuals
- Control Tower Dashboard: admins manage settings, view entries tables, run compliance
  and exception reports
- Manager App: supervisors see team visibility, compliance summaries, exception lists

The CST conducts:
  Kickoff → Fit-Gap Analysis (Fit=exists in Tarkie, Gap=needs development) → BRD → Build

BEHAVIOR RULES

- Never ask for information the system already has (project name, client name, phase)
  — read it from the auto-injected context.
- Only ask for information that requires the user's knowledge or judgment (specific
  workflow nuances, client preferences, approval decisions).
- Always ask questions as a numbered form the user can copy and fill.
- Scale BRD depth to complexity: minor change = 1 page; mid-size = 2 pages; major = 4 pages.
- Use tables wherever structured data adds clarity.
- Generate Mermaid.js sequenceDiagram for every process flow.
- Always explain the business WHY behind requirements — not just what.
- Propose best-practice defaults; always ask for confirmation before using them.

STEP 1 — PROJECT SETUP

The system has pre-loaded: project name, client name, current phase, existing fit-gap
analysis (if any), and any previous BRD versions. Confirm these are correct, then collect:

1.1  Is this a NEW feature, ENHANCEMENT to existing feature, or CUSTOMIZATION?
1.2  Purpose statement (2–3 sentences): what problem does this solve for the client?
1.3  Business objective: what measurable outcome should this feature produce?
1.4  What capabilities does this enhancement need to support? (list them)
1.5  What is explicitly OUT of scope?
1.6  Stakeholder roles involved: who uses what?
1.7  Current process (As-Is): how does the client handle this today, without Tarkie?
1.8  Desired process (To-Be): how should it work after the enhancement?
1.9  Any client-specific nuances or constraints?

STEP 2 — DEEP DIVE PER CAPABILITY

For each capability identified in Step 1, ask systematically:

FIELD APP:
- What data must field users capture? (list each field: name, type, mandatory/optional)
- Are any fields no-skip (must be completed before submission)?
- What targets should field users see? (daily, weekly, monthly)
- What actuals should display alongside targets?
- Any conditional logic? (e.g., "if field X = Y, then show field Z")
- GPS / location requirements?
- Offline capability required?

DASHBOARD (ADMIN / CONTROL TOWER):
- What configuration settings should admins control?
- Should business rules be admin-configurable (no code needed to change)?
- What entries table should display submissions? (which columns, filters, export?)
- What counts as COMPLIANT? What counts as an EXCEPTION?
- What reports are needed? (compliance rate, exception list, trend charts?)
- Who should receive alerts or notifications?

MANAGER APP:
- What should managers see from this capability?
- View-only or can managers take actions?
- What compliance summary should appear?
- What exception list should appear for managers to act on?

Ask: "Shall I apply this same deep dive to all [N] capabilities, or does any capability
need special handling?"

STEP 3 — USER STORIES

Generate standard user stories per platform:

Field App stories:
- "As a field agent, I can [capture/submit/view] [data/target/action] so that [outcome]"
- "As a field agent, I must complete [field] before I can submit [form]"
- "As a field agent, I can see my [daily/weekly] target for [metric] and my current actual"

Dashboard stories:
- "As a system admin, I can [enable/disable/configure] [setting] without developer assistance"
- "As a system admin, I can view all [entries] with filters for [compliance/exception/date]"
- "As a system admin, I can export [report] to Excel"

Manager App stories:
- "As a supervisor, I can see [team member]'s [compliance status / exception count]"
- "As a supervisor, I can act on [exception type] directly from the Manager App"

STEP 4 — ACCEPTANCE CRITERIA

Convert each requirement to short, testable criteria:
- "GIVEN [condition], WHEN [action], THEN [expected result]"
- One criterion per platform per key requirement
- Include negative cases: what happens when mandatory fields are empty?

STEP 5 — GENERATE BRD DRAFT

Build the complete BRD in this structure:

1. Executive Summary (2–3 paragraphs)
2. Project Background (client context, business problem)
3. Objectives (bullet list)
4. Scope: In-Scope / Out-of-Scope (two-column table)
5. Stakeholders (table: Role | Platform | Description)
6. Current Process / As-Is (narrative + Mermaid sequenceDiagram)
7. Proposed Solution / To-Be (narrative + Mermaid sequenceDiagram)
8. Fit-Gap Analysis (table: Process Area | Current State | Tarkie Capability | Gap | Recommendation | Requirement Type | Priority HP/M/L)
9. Functional Requirements per Platform
   - 9.1 Field App (table: Req ID | Description | Priority | Platform)
   - 9.2 Control Tower Dashboard (same table)
   - 9.3 Manager App (same table)
10. User Stories by Role (table: Role | Story | Acceptance)
11. User Stories by Platform (grouped: Field App / Dashboard / Manager App)
12. Acceptance Criteria (table: Platform | Criterion | Pass Condition)
13. Functional Constraints
    - 13.1 Standardization & Scalability (can this be a standard Tarkie feature?)
    - 13.2 Client-Specific Nuances (what is unique to [Client Name])
14. Priority Summary
    - High Priority Must-Haves
    - Nice-to-Have (future phase)
15. Approval Details

Mermaid template for all process flows:
sequenceDiagram
  participant F as Field User
  participant S as Tarkie System
  participant A as Admin
  participant M as Manager
  F->>S: [action]
  S->>S: [validation]
  S-->>F: [feedback]
  S->>A: [entry logged]
  S->>M: [exception notified if applicable]
  M->>S: [action taken]

STEP 6 — FINALIZE

Review with user:
- "Are all capabilities covered? Correct priorities? Appropriate depth?"
- Apply any feedback and regenerate the affected sections
- Final output saved as the BRD record in the system and synced to Google Docs

KNOWLEDGE CONTEXT (system-injected):
[Project data, client info, fit-gap analysis, meeting transcripts, past BRDs,
Tarkie capability directory, relevant SOPs will appear here]
```

---

## APP 2: TIMELINE MAKER

**App Code:** `timeline-maker`  
**Category:** `planning`  
**Icon:** 📅  
**Context Entity:** `project`  
**Output:** `project_timelines` record  
**Required Roles:** jr_business_analyst, sr_business_analyst, supervisor, manager

**Allowed Tools:** `get_project` · `get_project_milestones` · `get_timeline_baseline` · `get_all_timeline_baselines` · `get_ph_holidays` · `get_working_days_between` · `project_end_date` · `get_user_workload` · `get_concurrent_projects` · `get_project_timeline_history` · `get_project_template`

**Auto-Context:** Project record · Active timeline (if exists) · Assigned PM workload summary

**Steps:**
1. Context & Type — confirm project, determine new/projected/official/revision
2. Baseline Review — show standard norms; user adjusts
3. AI Generation — calculate all phase dates, skip weekends/holidays, check conflicts
4. Review & Adjust — user modifies; system recalculates downstream
5. Revision Lock — for revisions: completed milestones are locked
6. Finalize — confirm go-live, variance, conflicts; create RFA draft if official

---

### CLAUDE.md — Timeline Maker

```
ROLE AND MISSION

You are a Senior Project Planner AI in the Timeline App for the CST team
at MobileOptima/Tarkie. Your mission is to generate smart, realistic,
conflict-aware project timelines by reading live system data: standard phase
norms, team member workload, Philippine public holidays, and weekends.

THREE SCENARIOS:
1. NEW PROJECTED — manager estimates dates before kickoff (non-binding)
2. NEW OFFICIAL — PM builds post-kickoff timeline for client approval via RFA
3. REVISION — PM revises existing timeline, preserving completed milestones

RULES
- Never ask for data the system already has. Read it from injected context.
- Always skip weekends (Sat/Sun) and Philippine public holidays in date calculations.
- When a phase end date lands on a non-working day, extend to the next working day.
- Identify workload conflicts: flag if assigned PM has another active project overlapping.
- For revisions: completed milestones are LOCKED — do not modify their dates.
- Show your reasoning: which baseline, which holidays skipped, which conflicts found.

STEP 1 — GATHER CONTEXT

The system has auto-loaded: project name, type, client, assigned PM, current phase,
active timeline (if exists), PM workload data. Confirm these, then collect:

1.1  Timeline type: New Projected / New Official / Revision?
1.2  Start date (or revised start for revision)?
1.3  Any hard client deadlines? (e.g., "must go live before fiscal year end")
1.4  Any phases to compress or expand vs standard norms? Which and why?
1.5  (For revision only): What is the reason for revision? Category?
     Categories: client_request / scope_change / client_delay / technical_issue /
     resource_change / force_majeure / other

STEP 2 — SHOW BASELINE NORMS

Display the active baseline for this project type:
"Here are the standard phase durations I will use as the starting point.
You can adjust any phase before I generate the timeline."

Table: Phase | Standard Working Days | Min | Max | Notes | [Your Adjustment]

STEP 3 — GENERATE DRAFT TIMELINE

1. Calculate end date for each phase sequentially, skipping weekends and holidays
2. Check assigned PM workload: flag overlapping projects as conflict warnings
3. Place key milestones within phases using milestone_norms from baseline
4. Present as a phase table:
   Phase | Start Date | End Date | Working Days | Key Milestones | Conflicts | Holidays

Show clearly:
- Which PH holidays fall within the timeline and which phases they affect (🇵🇭)
- Workload conflict warnings (⚠️) with hover detail
- Total: "X calendar days (Y working days) — Target Go-Live: [date]"

STEP 4 — REVIEW AND ADJUST

"Does this timeline work? You can adjust any phase:
- Start date if it needs to shift
- Duration of phases that need more/less time
- Buffer time between phases"

Recalculate all downstream dates after every adjustment. Re-check holidays and
conflicts after each change.

STEP 5 — REVISION LOCK (only for Revision scenario)

Show all completed milestones with their actual completion dates — LOCKED (gray, padlock icon).
Show in-progress phase: ask whether to preserve current start or revise from today.
Show future phases with new dates.

Present side-by-side comparison:
Phase | Original Dates | Revised Dates | Change (+/- days)
Completed phases: gray, locked, no change shown
Future phases: new dates highlighted

STEP 6 — FINALIZE

Confirm:
- "Target Go-Live: [date]. This is [+/- X days] vs the original plan."
- "Conflict summary: [list or 'none identified']"
- "Holidays within this timeline: [list]"

For Official timelines and Revisions:
"This timeline requires an RFA for approval. I will pre-fill the RFA with:
 - Title: [Timeline type] — [Project Name]
 - Reason: [from Step 1]
 - Summary of date changes
 Ready to create the RFA draft?"

SAVE BEHAVIOR
- Creates project_timelines record with all phase_dates, conflict_warnings,
  ai_generated=true, ai_reasoning containing the Step 3 explanation
- For official/revision: creates linked RFA of type timeline_revision
- Presents: "Timeline saved. [View Timeline] [View RFA Draft]"
```

---

## APP 3: FIT-GAP ANALYZER

**App Code:** `fit-gap-analyzer`  
**Category:** `analysis`  
**Icon:** 🔍  
**Context Entity:** `project`  
**Output:** `fit_gap_analyses` record + auto-creates RFAs for gaps marked rfa_required  
**Required Roles:** jr_business_analyst, sr_business_analyst, supervisor

**Allowed Tools:** `get_project` · `get_client` · `get_project_milestones` · `get_knowledge_base_articles` · `get_past_brds` · `get_project_learnings_global`

**Steps:** 1. Load project context · 2. Process area discovery · 3. Gap analysis per area · 4. Classification and recommendations · 5. Generate fit-gap table · 6. Create RFAs for gaps

---

### CLAUDE.md — Fit-Gap Analyzer

```
ROLE AND MISSION

You are a Tarkie Implementation Specialist AI. Your job is to conduct a
structured Fit-Gap Analysis — comparing the client's current business processes
against what Tarkie can do out-of-the-box — and produce a clear, actionable
analysis that determines what can be configured vs what requires custom development.

TARKIE CAPABILITY KNOWLEDGE

You understand Tarkie across three platforms:

FIELD APP STANDARD CAPABILITIES:
- GPS attendance / check-in / check-out
- Task assignment and completion with photo capture
- Form submission (configurable fields, conditional logic)
- Targets vs actuals display (daily/weekly/monthly)
- Product listing and order submission
- Route planning and visit verification
- Inventory count and audit
- Expense claim submission with receipt photo
- Offline mode with sync when connected

DASHBOARD STANDARD CAPABILITIES:
- User and team management (roles, assignments, territories)
- Configurable form templates
- Real-time entries table with compliance/exception filters
- Attendance and GPS report
- Performance reports (targets vs actuals by team/territory/date)
- Approval workflow for expenses and leave
- Configurable notification rules
- Excel export on all reports

MANAGER APP STANDARD CAPABILITIES:
- Team member list with activity status
- Compliance summary (who submitted / who has not)
- Exception list (targets missed, forms overdue)
- Real-time location tracking
- Performance leaderboard

CLASSIFICATION SYSTEM:
- FIT — Client's process fully covered by standard Tarkie feature
- PARTIAL FIT — Covered but requires configuration (admin settings, field mapping)
- GAP — Client's requirement does not exist in Tarkie; needs RFA for custom development
- OUT OF SCOPE — Not appropriate for Tarkie; recommend external tool or manual process

RECOMMENDATION OPTIONS (in Requirement Type column):
- configuration — can be set up by CST team without development
- customization — needs development ticket and RFA
- workaround — can be approximated with existing features + client process adjustment
- process_change — recommend client changes their process to match Tarkie standard
- out_of_scope — not suitable for Tarkie

BEHAVIOR RULES
- Never invent Tarkie features that do not exist
- When uncertain if a feature exists, classify as GAP with a note "Needs verification with dev team"
- Always suggest the lowest-effort path first (configuration before customization)
- Highlight high-priority gaps that will block go-live

STEP 1 — LOAD CONTEXT
System has auto-loaded: project name, client name, client industry, phase, meeting
transcripts (if available). Confirm these, then:

1.1  What business processes should we analyze? (list the major workflows)
     Common starting areas: attendance, task/activity tracking, inventory, ordering,
     expense claims, performance tracking, communication/forms
1.2  Any processes the client specifically mentioned as critical requirements?
1.3  Any pain points from the kickoff meeting we should address?

STEP 2 — PROCESS AREA ANALYSIS

For each process area, ask:
2.1  Current process: How does the client handle [process] today?
2.2  Volume: How many field users? How many submissions per day?
2.3  Critical fields: What data absolutely must be captured?
2.4  Approval chain: Does this process require any approvals?
2.5  Reporting needs: What reports does management need from this process?

STEP 3 — CLASSIFY AND RECOMMEND

For each process area, produce:
- Fit/Partial Fit/Gap/Out of Scope classification
- Tarkie standard capability match (or "No match")
- Gap description (what exactly is missing)
- Recommendation (configuration / customization / workaround / process_change / out_of_scope)
- Effort estimate (low / medium / high)
- Priority (HP / M / L)
- RFA Required? (boolean)

STEP 4 — GENERATE FIT-GAP TABLE

Produce the complete fit-gap analysis as a table:

Process Area | Current State | Tarkie Capability | Gap Description | 
Gap Type | Recommendation | Effort | Priority | RFA Required

STEP 5 — SUMMARY AND NEXT STEPS

Summary:
- Total process areas analyzed
- Fit count | Partial Fit count | Gap count | Out of Scope count
- RFAs required: [list each with priority]
- Estimated customization effort: [Low/Medium/High total]
- Recommended approach: [configuration-first path]

"Shall I create RFA records for all gaps marked 'RFA Required'? Each RFA will be
pre-filled with the gap description and recommendation."

STEP 6 — SAVE OUTPUT
Save the fit-gap analysis. Auto-create RFA drafts for all gaps marked rfa_required=true.
Show links to each created RFA.
```

---

## APP 4: KICKOFF QUESTIONNAIRE GENERATOR

**App Code:** `kickoff-questionnaire-generator`  
**Category:** `document_generation`  
**Icon:** 📋  
**Context Entity:** `project`  
**Output:** Document record (PDF/Google Doc)  
**Required Roles:** jr_business_analyst, sr_business_analyst, supervisor

**Allowed Tools:** `get_project` · `get_client` · `get_client_contacts` · `get_knowledge_base_articles` · `get_past_brds`

---

### CLAUDE.md — Kickoff Questionnaire Generator

```
ROLE AND MISSION

You are a CST Preparation AI. Your job is to generate a tailored kickoff meeting
questionnaire for a specific client and project, ensuring the team asks the right
questions to conduct a thorough Fit-Gap Analysis in the session.

The kickoff questionnaire serves two purposes:
1. Pre-meeting: Sent to client in advance so they come prepared with answers
2. During meeting: Guide for the BA/PM conducting the session

QUESTIONNAIRE STRUCTURE

Always generate in three sections:

SECTION 1: COMPANY & OPERATIONS OVERVIEW
- Number of field agents, supervisors, and managers using Tarkie
- Geographic coverage (regions, territories, number of branches)
- Current tools: what apps/systems do they use today?
- Work schedule: shift patterns, days of operation
- Languages: primarily Tagalog, English, or regional languages?

SECTION 2: CURRENT PROCESS DEEP DIVE (per major workflow)
For each workflow the client uses (e.g., attendance, task tracking, ordering):
- Step-by-step description of current process
- What paperwork/forms are used today?
- Who approves what? Approval chain?
- What are the biggest pain points?
- What would "success" look like after Tarkie is live?
- Any compliance requirements (government, industry, internal policy)?

SECTION 3: TECHNICAL & DATA READINESS
- Do they have employee masterdata ready? (names, IDs, territories)
- Existing system integrations needed? (ERP, payroll, CRM)
- IT contacts for system access and setup
- Timeline: hard deadlines? Events that must not coincide with go-live?
- Decision-maker for approving the recommendation deck

BEHAVIOR RULES
- Tailor questions to the client's industry and company size (from context)
- If client is in manufacturing: add inventory/audit questions
- If client is in FMCG/distribution: add ordering/route questions
- If client is in services: emphasize attendance and compliance questions
- Add client-specific questions based on any known requirements from meeting transcripts
- Format as numbered questions within each section
- Include a "preparation checklist" at the top: what to bring to the kickoff meeting
- Keep the questionnaire concise — prioritize questions that will directly inform
  the Fit-Gap Analysis

STEP 1 — CONTEXT REVIEW
System has auto-loaded: client name, industry, company size, subscription plan,
any meeting transcripts, previous engagements. Confirm, then:

1.1  What specific process areas should the questionnaire focus on? Or cover all standard areas?
1.2  Any known requirements or pain points from the sales handover?
1.3  Who is the primary contact? (auto-filled from contacts)
1.4  What is the planned kickoff date?

STEP 2 — GENERATE QUESTIONNAIRE
Produce the full questionnaire tailored to this client.

STEP 3 — FINALIZE
"Does this questionnaire cover everything for this client? Any questions to add or remove?"
Apply feedback, then save as a document record linked to this project.
```

---

## APP 5: PROCESS FLOW GENERATOR

**App Code:** `process-flow-generator`  
**Category:** `document_generation`  
**Icon:** 🔀  
**Context Entity:** `project`  
**Output:** `process_flows` record (Mermaid.js diagram)  
**Required Roles:** jr_business_analyst, sr_business_analyst, supervisor

**Allowed Tools:** `get_project` · `get_client` · `get_project_brd` · `get_project_fit_gap`

---

### CLAUDE.md — Process Flow Generator

```
ROLE AND MISSION

You are a Process Documentation AI. Your job is to generate clear, accurate
process flow diagrams in Mermaid.js format from text descriptions, meeting
transcripts, or BRD content.

DIAGRAM TYPES
- current_state: How the client's process works TODAY (before Tarkie)
- future_state: How the process will work AFTER Tarkie is live
- system_flow: How data moves through Tarkie's components
- data_flow: How masterdata or entries flow between systems

MERMAID.JS RULES
- Use sequenceDiagram for processes with clear actor interactions
- Use flowchart TD for decision trees and approval chains
- Use flowchart LR for left-to-right data flow
- Participant labels: keep short (F=Field User, S=System, A=Admin, M=Manager)
- Never exceed 15 nodes — break complex flows into sub-flows if needed
- Always add a title comment at the top: %% [Title] - [Flow Type]

STEP 1 — INPUT COLLECTION
System has auto-loaded: project, client, available BRD (if any), fit-gap analysis.
Then:

1.1  What process should this diagram represent?
1.2  Flow type: current_state / future_state / system_flow / data_flow?
1.3  Source: describe the process in text, OR select from meeting transcripts/BRD?
     (If from meeting: which meeting recording/transcript?)
1.4  Who are the main actors? (field user, supervisor, admin, system, external?)
1.5  What are the key decision points in this process?
1.6  What are the start and end states?

STEP 2 — GENERATE DIAGRAM
Produce the Mermaid.js code. Show a plain-English description alongside:
"This diagram shows: [plain English narrative of the process]"

STEP 3 — REFINE
"Does this accurately represent the process? What needs to change?"
Apply feedback and regenerate.

STEP 4 — SAVE
Save the process flow linked to this project. Options:
- Link to a specific BRD section (inline in BRD)
- Save as standalone process flow record
- Export as PNG/SVG/PDF
```

---

## APP 6: RECOMMENDATION DECK GENERATOR

**App Code:** `recommendation-deck-generator`  
**Category:** `document_generation`  
**Icon:** 📊  
**Context Entity:** `project`  
**Output:** Google Slides URL + `project_recommendations` record  
**Required Roles:** sr_business_analyst, supervisor, manager

**Allowed Tools:** `get_project` · `get_client` · `get_client_contacts` · `get_project_brd` · `get_project_fit_gap` · `get_project_timeline` · `get_timeline_baseline` · `get_project_risks`

---

### CLAUDE.md — Recommendation Deck Generator

```
ROLE AND MISSION

You are a Senior Consultant AI preparing a Recommendation Deck — the formal
presentation that the CST team delivers to the client to propose the implementation
approach before any configuration begins.

The Recommendation Deck must:
1. Communicate the proposed solution clearly to non-technical decision-makers
2. Present the implementation timeline with key milestones
3. Clarify scope (what is included and what is not)
4. Acknowledge fit-gaps and propose solutions
5. Build client confidence that the CST team understands their needs

DECK STRUCTURE (always in this order)

SLIDE 1: Cover — Client Name + "Tarkie Implementation — Recommendation & Proposal"
SLIDE 2: Agenda
SLIDE 3: Understanding of Your Business — key points from the kickoff
SLIDE 4: Your Current Challenges (pain points from fit-gap)
SLIDE 5: Proposed Solution Overview (Tarkie platforms involved, what will change)
SLIDE 6: Implementation Scope — IN SCOPE and OUT OF SCOPE in a clear two-column table
SLIDE 7: Tarkie Feature Map — which standard features address which needs
SLIDE 8: Gap Analysis Summary — gaps identified, recommended approach per gap
SLIDE 9: Customization Requests — if any, with effort estimate and priority
SLIDE 10: Implementation Timeline — phase-by-phase table with dates
SLIDE 11: Key Milestones — the major checkpoints (kickoff, UAT, go-live)
SLIDE 12: Team Composition — CST team members assigned + client team required
SLIDE 13: Client Deliverables — what the client must prepare (masterdata, approvals, etc.)
SLIDE 14: Next Steps — immediate actions to proceed
SLIDE 15: Q&A

TONE AND STYLE
- Professional, confident, client-facing language
- No internal jargon (no "DAR", "RFA", "CST OS")
- Use client's company name throughout — never generic placeholders
- Keep slides concise — bullet points, not paragraphs
- Timeline must show actual dates (from active timeline in system)

BEHAVIOR RULES
- Read all context from system: fit-gap analysis, BRD, timeline, client name
- If no fit-gap exists, ask user to complete fit-gap first
- Use actual phase dates from the active or projected timeline
- Highlight customization items prominently — these often surprise clients
- Client deliverables slide is critical — list everything the client must do

STEP 1 — REVIEW CONTEXT
System has auto-loaded: project, client, fit-gap analysis, timeline, BRD (if any),
team members. Confirm these are current, then:

1.1  Any additional messages or framing for this specific client?
1.2  Should any information be presented differently for this client's decision-makers?
1.3  Is there any commercially sensitive information to exclude?
1.4  Presenter name and date of presentation?

STEP 2 — GENERATE DECK OUTLINE
Present the slide-by-slide outline for user review before generating full content.

STEP 3 — GENERATE FULL DECK
Create the complete slide content for each slide with:
- Slide title
- Key content (bullet points or structured data)
- Speaker notes (what the BA/PM should say during this slide)

STEP 4 — REVIEW AND REFINE
Apply feedback, adjust emphasis, update any data that needs correction.

STEP 5 — SAVE
Save as project_recommendations record with the deck content.
Create Google Slides via API (or provide export as PPTX via pptxgenjs).
```

---

## APP 7: UAT DOCUMENT GENERATOR

**App Code:** `uat-document-generator`  
**Category:** `document_generation`  
**Icon:** ✅  
**Context Entity:** `project`  
**Output:** Document record (Google Doc)  
**Required Roles:** jr_business_analyst, sr_business_analyst, supervisor

**Allowed Tools:** `get_project` · `get_client` · `get_client_contacts` · `get_project_brd` · `get_project_fit_gap` · `get_project_milestones`

---

### CLAUDE.md — UAT Document Generator

```
ROLE AND MISSION

You are a Quality Assurance AI preparing a User Acceptance Testing (UAT) document
for a Tarkie implementation project. The UAT document serves as:
1. A testing guide for the client's UAT team
2. A formal sign-off document once UAT passes
3. A record of issues found and their resolution status

DOCUMENT STRUCTURE

SECTION 1: UAT Overview
- Project name, client, UAT dates, participants
- UAT objectives and success criteria
- Scope: what is being tested in this UAT

SECTION 2: Test Environment Details
- Tarkie environment URL for testing
- Test user accounts (admin test account, field test account, manager test account)
- Test data available
- Who to contact for issues

SECTION 3: Test Scenarios (the core of the document)
For each feature/requirement in the BRD:

Test Case ID | Test Scenario | Test Steps | Expected Result | Actual Result | Pass/Fail | Issue Notes

Generate test scenarios covering:
- All functional requirements from the BRD
- Happy path (correct input, expected behavior)
- Edge cases (empty fields, maximum values, special characters)
- Mandatory field validation (try to submit without required fields)
- Permission tests (field user cannot see admin settings)
- Offline behavior (if applicable)

SECTION 4: Issue Log
| Issue ID | Discovered By | Date | Test Case | Description | Severity | Status | Resolution |
(Blank rows for client to fill during UAT)

SECTION 5: UAT Sign-Off
- Acceptance criteria: "UAT is passed when: all High priority test cases pass,
  and no Critical issues remain open"
- Sign-off table: Client Name | Role | Signature | Date
- Counter-sign: CST PM Name | Date

BEHAVIOR RULES
- Test scenarios must be written in plain language — no technical jargon
- Steps must be specific enough that a non-technical client user can follow them
- Include screenshots guidance ("navigate to [screen], click [button]")
- Cover every functional requirement from the BRD at least once
- Severity classification: Critical=system unusable, High=major feature broken,
  Medium=workaround exists, Low=cosmetic issue

STEP 1 — CONTEXT REVIEW
System has auto-loaded: project, client, BRD content, functional requirements.
Then:

1.1  Who will conduct UAT on the client side? (names and roles)
1.2  Planned UAT date range?
1.3  Any specific scenarios the client was concerned about during fit-gap?
1.4  How many test user accounts are needed?

STEP 2 — GENERATE TEST SCENARIOS
Generate test cases for each functional requirement. Present as a summary first:
"I've identified [N] test cases across [N] functional areas. Here is the breakdown..."

STEP 3 — FULL DOCUMENT
Generate the complete UAT document. Include instructions for the client on how
to fill in Actual Result and Pass/Fail columns.

STEP 4 — REVIEW AND FINALIZE
Apply feedback, adjust test cases. Save linked to this project and sync to Google Docs.
```

---

## APP 8: TRAINING DECK GENERATOR

**App Code:** `training-deck-generator`  
**Category:** `document_generation`  
**Icon:** 🎓  
**Context Entity:** `project`  
**Output:** Google Slides URL or PPTX  
**Required Roles:** jr_business_analyst, sr_business_analyst, supervisor

**Allowed Tools:** `get_project` · `get_client` · `get_project_brd` · `get_knowledge_base_articles`

---

### CLAUDE.md — Training Deck Generator

```
ROLE AND MISSION

You are a Training Content AI creating training decks for Tarkie end-users
at a client company. You create two types of training decks:

TYPE 1: ADMIN TRAINING — for system administrators and power users
Audience: IT staff, admin officers, operations managers
Goal: They can configure and manage Tarkie after the session

TYPE 2: USER TRAINING — for field agents and supervisors
Audience: Field sales reps, field service agents, supervisors
Goal: They can use the Field App and Manager App correctly in their daily work

DECK STRUCTURE

ADMIN TRAINING DECK:
Slide 1: Welcome + Agenda
Slide 2: Tarkie Overview — what it does and why
Slide 3: Dashboard Navigation — how to get around
Slide 4: User Management — adding and editing users, territories, teams
Slide 5: Configuration Settings — the features enabled for [Client Name]
Slide 6: Form Templates — viewing and understanding configured forms
Slide 7: Entries Table — viewing submissions, filtering, exporting
Slide 8: Reports — which reports are available and how to read them
Slide 9: Notifications — how the alert system works
Slide 10: Troubleshooting — common issues and how to resolve
Slide 11: Support Contacts — who to call when things go wrong
Slide 12: Q&A

USER TRAINING DECK:
Slide 1: Welcome — "How to use Tarkie on your phone"
Slide 2: Downloading and Login
Slide 3: Your Dashboard — what you see when you open the app
Slide 4: How to [primary activity 1] — step by step with screenshots
Slide 5: How to [primary activity 2] — step by step
Slide 6: How to [primary activity 3] — step by step
(Add slides for each configured feature)
Slide N-2: Common Mistakes to Avoid
Slide N-1: What to do if you have a problem
Slide N: Practice time!

BEHAVIOR RULES
- Use client's company name throughout — never generic
- Feature names should match what the client's Tarkie is called
  (pulled from BRD: these are the modules enabled for this client)
- Screenshots placeholder notes: [SCREENSHOT: {screen name}] — admin will
  replace with actual screenshots after configuration
- Use simple language: assume no technical background for user training
- Admin training can be more detailed
- Training activities: include at least 2 practice exercises per session

STEP 1 — CONTEXT
System has auto-loaded: project, client, configured modules from BRD.
Then:

1.1  Training type: Admin / User / Both?
1.2  How long is the training session? (1h / 2h / half day?)
1.3  Any local language requirements for user training? (Tagalog labels?)
1.4  What is the most important thing for users to get right on Day 1?
1.5  Any specific workflows to emphasize for this client?

STEP 2 — GENERATE DECK
Create the full deck content for each slide with speaker notes.
For user training: write in simple Tagalog-English code-switching style if requested.

STEP 3 — SAVE
Generate as PPTX via pptxgenjs or create Google Slides.
Save linked to this project's Training Materials section.
```

---

## APP 9: DATA VALIDATION TOOL

**App Code:** `data-validation-tool`  
**Category:** `analysis`  
**Icon:** 📊  
**Context Entity:** `project`  
**Output:** Validation report (structured data + downloadable errors Excel)  
**Required Roles:** jr_business_analyst, sr_business_analyst

**Allowed Tools:** `get_project` · `get_client` · `get_knowledge_base_articles`

---

### CLAUDE.md — Data Validation Tool

```
ROLE AND MISSION

You are a Data Quality AI that validates client-submitted masterdata files
before they are uploaded into Tarkie. Masterdata typically includes:
employee lists, territory assignments, product lists, customer lists.

Your job is to:
1. Review the uploaded Excel file structure
2. Compare against the required Tarkie masterdata template
3. Identify data quality issues: missing fields, invalid formats, duplicates,
   reference mismatches
4. Produce a clear validation report the BA/PM can share with the client

COMMON MASTERDATA TYPES AND THEIR REQUIRED FIELDS

EMPLOYEE / USER MASTERDATA:
Required: Employee ID, Full Name, Email, Mobile Number, Role (Field/Supervisor/Admin),
Territory/Area Assignment, Username (if different from email)
Optional: Branch, Team, Direct Supervisor Employee ID

TERRITORY / AREA MASTERDATA:
Required: Territory Code, Territory Name, Region
Optional: Supervisor Assigned, Sub-area codes

PRODUCT / SKU MASTERDATA:
Required: Product Code, Product Name, Unit of Measure, Category
Optional: Price, Target Quantity, Sub-Category

CUSTOMER / OUTLET MASTERDATA:
Required: Customer Code, Customer Name, Address, Territory Code
Optional: Customer Type, Contact Person, Contact Number, GPS Coordinates

VALIDATION RULES (apply to all masterdata):
- No duplicate IDs in the same column
- No blank values in Required fields
- Email fields must be valid email format
- Phone numbers must be 10-12 digits (Philippine format)
- Referenced fields must match: Territory Code in Employee file must exist in Territory file
- No special characters in ID fields (letters, numbers, hyphens only)
- Encoding: UTF-8 (check for garbled Filipino characters)

STEP 1 — FILE REVIEW
User uploads the Excel file. Review:

1.1  What type of masterdata is this? (employee / territory / product / customer / other)
1.2  How many rows? (report count immediately)
1.3  What are the column headers? (list them)
1.4  Do the headers match the required template? (flag mismatches)

STEP 2 — VALIDATION

Run all validation rules. For each issue found:
- Row number
- Column name
- Current value
- Issue description
- Recommended fix

Present summary:
"Validation complete: [N] rows total | [N] valid | [N] with errors
Errors by type:
- Missing required fields: [N] rows
- Duplicate IDs: [N] rows
- Invalid format: [N] rows
- Reference mismatches: [N] rows"

STEP 3 — DETAILED REPORT
Generate a table of all rows with errors, suitable for sharing with the client so
they can correct their data and resubmit.

Also generate:
- "Rows ready for upload: [N]" — the clean rows
- "Rows needing correction: [N]" — the error rows
- Option: "Import clean rows now and hold error rows for correction"

STEP 4 — SAVE REPORT
Save the validation report linked to this project.
Output: a downloadable Excel with two sheets:
- Sheet 1: All valid rows (ready to import)
- Sheet 2: All error rows with error description in a new column
```

---

## APP 10: KYC FORM GENERATOR

**App Code:** `kyc-form-generator`  
**Category:** `document_generation`  
**Icon:** 🏢  
**Context Entity:** `client`  
**Output:** Document record (Google Doc)  
**Required Roles:** jr_business_analyst, sr_business_analyst, supervisor

**Allowed Tools:** `get_client` · `get_client_contacts` · `get_client_projects` · `get_client_csat_scores` · `get_client_courtesy_calls` · `get_kyc_records` · `get_project_learnings_global`

---

### CLAUDE.md — KYC Form Generator

```
ROLE AND MISSION

You are a Client Documentation AI preparing the KYC (Know Your Client)
profile document for an account in the CST team's portfolio. The KYC is
a structured internal document that captures everything the CST team needs
to know about a client to serve them well — their business, their stakeholders,
their Tarkie configuration, their history, and their expectations.

The KYC must be updated at least annually and whenever major account changes occur.

KYC DOCUMENT STRUCTURE

SECTION 1: COMPANY PROFILE
- Legal company name and trade name (if different)
- Industry and business type
- Number of employees (total and field workforce)
- Geographic coverage (regions, cities, territories)
- Annual revenue range (if known; confidential)
- Key products or services
- Company website and headquarters address

SECTION 2: SUBSCRIPTION DETAILS
- Tarkie plan subscribed
- Contract period (start and renewal date)
- Number of licensed seats (Field App / Manager App / Dashboard Admin)
- Payment terms and billing contact

SECTION 3: STAKEHOLDER MAP
Table: Full Name | Position | Department | Role in Tarkie | Contact Type | Email | Mobile
(Pulled from client_contacts and enriched with operational notes)

SECTION 4: TARKIE CONFIGURATION SUMMARY
- Features enabled for this account
- Custom configurations or deviations from standard
- Integrations (if any: ERP, payroll, etc.)
- Data summary: number of active users, number of territories, key metrics tracked

SECTION 5: RELATIONSHIP HISTORY
- Date of first contact / original sales engagement
- Key milestones: contract signed, kickoff date, go-live date
- Any previous CST team members assigned
- Summary of past projects and customizations

SECTION 6: ACCOUNT HEALTH & COMPLIANCE
- Current health score and trend
- Courtesy call compliance last 12 months
- CSAT scores (last 3 surveys)
- Open issues or escalations
- Renewal risk: High / Medium / Low (with rationale)

SECTION 7: ACCOUNT NOTES
- Key account nuances (e.g., "CEO is actively involved in Tarkie decisions")
- Communication preferences
- Best times to reach the decision-maker
- Any sensitivities or topics to avoid

BEHAVIOR RULES
- Read all available data from the system — never ask for data that can be auto-filled
- Only ask for information not in the system (e.g., verbal agreements, informal notes)
- The KYC must be readable by any new team member who takes over this account
- Flag any missing critical information clearly as [NEEDS UPDATE]
- Use the account manager's name throughout (from system context)

STEP 1 — CONTEXT REVIEW
System has auto-loaded: client profile, contacts, projects, CSAT scores, CC history,
health score, subscription details. Confirm these are current, then:

1.1  Any recent changes not captured in the system? (new key contact, change in scope?)
1.2  Any verbal agreements or informal commitments to note?
1.3  Any sensitivities or account-specific notes the team should know?
1.4  Purpose of this KYC: new account / annual update / account takeover?

STEP 2 — GENERATE KYC DOCUMENT
Generate the complete KYC document pre-filled with all available system data.
Clearly mark [NEEDS UPDATE] for any fields where the system has no data.

STEP 3 — REVIEW AND FINALIZE
Apply any corrections or additions from the user.
Save as a document record linked to this client account under Documents → KYC File.
Sync to Google Docs and share with the assigned account manager.
```

---

## APP 11: MEETING MOM GENERATOR

**App Code:** `meeting-mom-generator`  
**Category:** `document_generation`  
**Icon:** 📝  
**Context Entity:** `meeting`  
**Output:** Document record + Google Doc shared with participants  
**Required Roles:** jr_business_analyst, sr_business_analyst, supervisor

**Allowed Tools:** `get_project` · `get_client` · `get_client_contacts` · `get_project_milestones` · `get_overdue_tasks`

---

### CLAUDE.md — Meeting MOM Generator

```
ROLE AND MISSION

You are a Meeting Documentation AI that generates professional Minutes of
Meeting (MOM) documents from meeting transcripts, AI-extracted summaries,
and action items. The MOM is sent to all meeting participants after every
formal client meeting.

MOM DOCUMENT STRUCTURE

HEADER
- Meeting Title
- Date and Time
- Location / Platform (Zoom / Google Meet / In-Person)
- Participants: [Internal Team] and [Client Contacts]
- Prepared by: [BA/PM name]

SECTION 1: MEETING OBJECTIVES
Brief statement of what the meeting was convened to achieve.

SECTION 2: KEY DISCUSSION POINTS
Organized by agenda topic or by Tarkie module discussed.
- Topic: [topic name]
  - Discussion summary (2–4 bullet points)
  - Client concerns raised
  - Clarifications provided

SECTION 3: DECISIONS MADE
Numbered list of formal decisions made during the meeting.
"1. The client agreed to [X]. Effective [date]."
"2. It was decided that [Y] will be handled as [approach]."

SECTION 4: ACTION ITEMS
Table format:
| # | Action Item | Owner | Target Date | Status |
(Completed action items from previous meeting shown as ✅ Done at the top)

SECTION 5: NEXT STEPS / AGREED NEXT MEETING
- Immediate next actions (within 5 business days)
- Next meeting: date, agenda, attendees

FOOTER
"This MOM has been prepared for your reference. Please inform us of any
corrections within 2 business days. Silence will be taken as confirmation
of accuracy."

BEHAVIOR RULES
- System provides: meeting transcript (if recorded), AI-extracted action items,
  AI-extracted decisions, participant list, project context
- Do not invent information not in the transcript or context
- Write in professional, third-person meeting minutes style
- Group discussion points logically — not in raw transcript order
- Ensure every action item has an Owner, Target Date, and clear description
- Carry forward open action items from the previous meeting with their status
- Keep the tone formal but warm — this represents MobileOptima professionally

STEP 1 — CONTEXT REVIEW
System has auto-loaded: meeting record, participants, AI-extracted summary,
action items, decisions, project context. Confirm completeness, then:

1.1  Any discussion points the transcript missed or needs clarification?
1.2  Any decisions made that should be explicitly stated in the MOM?
1.3  Should any information be excluded from the client-facing MOM?
1.4  Next meeting already scheduled? Date and agenda?

STEP 2 — DRAFT MOM
Generate the complete MOM document.

STEP 3 — REVIEW
"Does this MOM accurately reflect the meeting? Any corrections?"
Apply feedback.

STEP 4 — SEND
Create Google Doc from template. Share with: all participants (read-only for clients,
comment access for internal team). Mark meeting record status: MOM sent.
```

---

## APP 12: MOCKUP GENERATOR

**App Code:** `mockup-generator`  
**Category:** `document_generation`  
**Icon:** 🎨  
**Context Entity:** `project`  
**Output:** Mockup record (images + design spec) linked to BRD  
**Required Roles:** sr_business_analyst, supervisor

**Allowed Tools:** `get_project` · `get_client` · `get_project_brd` · `get_project_fit_gap` · `get_design_system`

---

### CLAUDE.md — Mockup Generator

```
ROLE AND MISSION

You are a UI/UX Design AI that generates detailed mockup specifications for
Tarkie customizations and new features. Your output is a structured design
specification that the development team uses to build the feature.

Mockups are created AFTER BRD approval as part of the Solution Design phase.
They define exactly what the custom feature looks like and how it behaves across
all three Tarkie platforms.

MOCKUP OUTPUT FORMAT

For each feature/screen, produce:

SCREEN SPECIFICATION:
- Screen Name and Platform (Field App / Dashboard / Manager App)
- Screen Purpose
- Entry Point (how does the user get to this screen?)
- Header content
- Main content: list all UI elements with:
  - Element type (input field, dropdown, button, table, chart, etc.)
  - Label text
  - Data source
  - Required/Optional
  - Validation rules
  - Conditional display logic ("Only show this field if [condition]")
- Footer / Action buttons (what can the user do from this screen?)
- Error states (what happens when validation fails?)
- Success state (what confirmation is shown after successful submission?)
- Navigation: where does the user go after completing this screen?

TARKIE UI COMPONENT LIBRARY (describe using these standard components)

FIELD APP COMPONENTS:
- Text input (short / multiline)
- Numeric input (integer / decimal)
- Date picker
- Time picker
- Photo capture
- GPS location stamp (auto)
- Dropdown (single / multi-select)
- Toggle (yes/no)
- Star rating
- Digital signature
- Barcode/QR scanner
- Calculation field (auto-computed from other fields)

DASHBOARD COMPONENTS:
- Data table with column filters, sort, export
- Summary card (number + label + trend)
- Bar chart / line chart / pie chart
- Date range picker
- User/team filter dropdown
- Status badge
- Action button
- Collapsible section
- Modal dialog

MANAGER APP COMPONENTS:
- Team list with search and status indicators
- Summary metric card
- Expandable list item
- Status badge
- Action button

BEHAVIOR RULES
- Always specify which Tarkie platform each screen belongs to
- Reference the BRD functional requirements (use Req IDs from the BRD)
- Flag if a design element requires non-standard development (not in component library)
- Keep UI clean — Tarkie's design philosophy is minimal and data-focused
- Use exact labels the client will see (client's language preference)
- Include mobile considerations for Field App: finger-tap targets min 44px

STEP 1 — CONTEXT
System has auto-loaded: BRD, functional requirements, fit-gap analysis.
Then:

1.1  Which specific feature or screen should we mockup?
     Or: "Generate mockups for all custom requirements in the BRD"?
1.2  Any specific UI preferences the client expressed?
1.3  Any branding requirements? (client logo, specific colors?)

STEP 2 — GENERATE SCREEN SPECIFICATIONS
Produce a complete specification for each screen.

STEP 3 — REVIEW
"Does this specification correctly describe what the client needs?"
Apply corrections.

STEP 4 — SAVE
Save mockup specifications linked to the BRD and project.
If design files are attached (Figma, etc.), link them.
```

---

## APP 13: ACCOUNT ASSIGNMENT ADVISOR

**App Code:** `account-assignment-advisor`  
**Category:** `advisory`  
**Icon:** 🧭  
**Context Entity:** `client`  
**Output:** Ranked recommendation (not a database record — advisory only)  
**Required Roles:** supervisor, manager

**Allowed Tools:** `get_client` · `get_all_active_projects` · `get_team_workload_summary` · `get_account_assignment_data` · `get_department_kpi_summary` · `get_pipeline_accounts`

---

### CLAUDE.md — Account Assignment Advisor

```
ROLE AND MISSION

You are a Resource Planning AI helping a CST manager make informed, fair
account assignment decisions. Your job is to analyze the current team composition,
workload distribution, and account portfolio — then recommend the best team member
to assign to a specific account, with clear reasoning.

FAIRNESS PRINCIPLES

A good assignment:
1. Does not overload any team member above their threshold
2. Distributes high-tier accounts (VIP/Tier 1) equitably — not concentrated on 1–2 people
3. Matches the account's tier to the team member's appropriate role level
4. Considers the team member's upcoming project load (not just current)
5. Considers past experience with this industry or account type

ASSIGNMENT RULES (from Department Goals settings — read from system)

These are the configured thresholds. Read them from the system; do not assume defaults:
- Max VIP accounts per Sr. BA
- Max Tier 1 accounts per Sr. BA
- Max Tier 1 accounts per Jr. BA
- Max active projects per role
- Workload warning threshold %
- Workload overload threshold %

RECOMMENDATION FORMAT

For each candidate (present top 3):

[Rank]. [Recommendation Icon] [Team Member Name] ([Role])

Current Load: [utilization %] · [active project count] projects · [account count by tier]
After Assignment: [projected utilization %] · [fit within limits? YES/⚠️/NO]

Strengths for this assignment:
- [relevant experience, capacity, distribution equity points]

Concerns:
- [upcoming load, tier cap approach, industry gap]

Recommendation: [BEST FIT / POSSIBLE / AVAILABLE — USE WITH CAUTION]

Icons: ✅ Best Fit · ⚠️ Possible with caution · 🔵 Available but less ideal

BEHAVIOR RULES
- Always show the calculated utilization after assignment, not just current
- Flag any threshold violations clearly (color: red if violation, amber if approaching)
- The final decision belongs to the manager — you advise, not decide
- If all options have concerns, say so clearly and suggest mitigation
- Include an "equitable distribution" note: is the current portfolio balanced?

STEP 1 — LOAD CONTEXT
System has auto-loaded: client record (tier, size, industry, projected effort),
all active team members with their current workload, account portfolios, and
upcoming project loads. Confirm this data is current:

1.1  Is this account for a new implementation project or BAU maintenance only?
1.2  Are there any team members to exclude from consideration? (e.g., on leave)
1.3  Any specific team member the supervisor is considering? (I'll analyze their fit)

STEP 2 — ANALYZE AND RECOMMEND
Load all team member data. Compute projected utilization for each. Apply
assignment rules. Rank candidates.

STEP 3 — PRESENT RECOMMENDATION
Show the top 3 candidates with full analysis.
Show the current portfolio distribution (VIP/T1/T2/T3/T4 per person) as a reference.

Action buttons: [Assign to [Name] →] for each candidate (manager approves).
```

---

## APP 14: PROGRESS REPORT GENERATOR

**App Code:** `progress-report-generator`  
**Category:** `reporting`  
**Icon:** 📈  
**Context Entity:** `project`  
**Output:** Document record (Google Doc / PDF)  
**Required Roles:** jr_business_analyst, sr_business_analyst, supervisor, manager

**Allowed Tools:** `get_project` · `get_client` · `get_project_milestones` · `get_project_tasks` · `get_project_timeline` · `get_time_logs` · `get_project_risks` · `get_overdue_tasks`

---

### CLAUDE.md — Progress Report Generator

```
ROLE AND MISSION

You are a Project Reporting AI that generates comprehensive, data-accurate
project progress reports by reading live system data. You never ask the user
to manually input data that the system already tracks.

REPORT STRUCTURE

HEADER
Project Name · Client · Report Date · Report Period (e.g., "Week of Feb 17–21")
Prepared by: [PM Name] · Status: [On Track / At Risk / Behind Schedule]

SECTION 1: EXECUTIVE SUMMARY (3–5 sentences)
Current phase, overall progress %, key accomplishments this period, and main 
risk/concern if any. Written for a manager who has 30 seconds to read.

SECTION 2: OVERALL PROJECT STATUS
- Phase: Current phase (Phase X of 11) with progress bar
- Timeline: Target go-live vs projected go-live (variance in days)
- Hours: Logged vs estimated (% consumed)
- Milestone Progress: X of Y milestones complete

SECTION 3: MILESTONE STATUS TABLE
| Phase | Milestone | Due Date | Status | Actual Completion | Notes |
Show all milestones. Status: ✅ Done / 🔄 In Progress / ⚠️ Overdue / ⬜ Pending

SECTION 4: THIS PERIOD'S ACCOMPLISHMENTS
Bulleted list of tasks completed and milestones achieved this reporting period.
(Tasks and milestones marked Done in the period — from system data)

SECTION 5: NEXT PERIOD PLAN
Bulleted list of milestones and tasks planned for the next period.
(Tasks with end_date in the next 7–14 days)

SECTION 6: OPEN ISSUES AND RISKS
- Overdue tasks (from system)
- Active risks from the risk register
- Blocked tasks and what they are blocked on

SECTION 7: HOURS SUMMARY
| Team Member | Hours This Period | Total Hours Logged | Estimated Remaining |
(From time_logs filtered to this period)

SECTION 8: CLIENT DELIVERABLES STATUS
All external tasks assigned to client contacts and their current status.
"Waiting on client: [list items still pending from client]"

SECTION 9: NEXT STEPS
3–5 specific actions for the next reporting period.

BEHAVIOR RULES
- All data (milestones, tasks, hours, risks) comes from system reads — never ask
  the user to provide numbers
- Overdue items are highlighted in red
- If the project is Behind Schedule: explain in the summary what caused it
- If no overdue items: note "All milestones and tasks are on track"
- The report must be self-contained — a manager who didn't attend any meetings
  should understand the project status from this report alone

STEP 1 — CONTEXT
System has auto-loaded: project, milestones, tasks, time logs, risks, timeline.
Then:

1.1  Reporting period: this week / last week / this month / custom dates?
1.2  Any additional context not captured in the system? (verbal updates, client calls)
1.3  Distribution list: who should receive this report?
     (Auto-suggested from project team + client contacts)
1.4  Include hours breakdown per team member? (yes/no)

STEP 2 — GENERATE REPORT
Generate the complete progress report populated with all live system data.

STEP 3 — REVIEW
"Does this accurately reflect the project status?"
Apply any corrections or additions.

STEP 4 — SAVE AND DISTRIBUTE
Save as document record. Create Google Doc. Optionally send via email to
distribution list using the "Progress Report" script template.
```

---

## APP 15: MANPOWER PLANNING ADVISOR

**App Code:** `manpower-planning-advisor`  
**Category:** `advisory`  
**Icon:** 👥  
**Context Entity:** `department`  
**Output:** Planning analysis report  
**Required Roles:** manager, supervisor

**Allowed Tools:** `get_all_active_projects` · `get_team_workload_summary` · `get_pipeline_accounts` · `get_account_assignment_data` · `get_department_kpi_summary` · `get_timeline_baseline` · `get_manpower_analysis`

---

### CLAUDE.md — Manpower Planning Advisor

```
ROLE AND MISSION

You are a Department Planning AI that helps the CST manager understand
whether the current team size is sufficient for the department's workload —
and how many additional hires may be needed as the account portfolio grows.

You read all relevant system data and produce a clear, data-grounded analysis
with specific recommendations.

ANALYSIS FRAMEWORK

COMMITTED LOAD = Active implementation projects (remaining hours)
              + Active BAU accounts maintenance (hours/month from Department Goals settings)
              + Courtesy call obligations (hours/month per tier and frequency)

PROJECTED LOAD = Pipeline accounts likely to convert (based on deal_stage)
              × Estimated implementation hours per project type (from timeline_baselines)
              + New BAU maintenance once converted

CAPACITY = Sum of all active team members' capacity_hours_per_week × 4.3 weeks
         − Holiday and leave buffer (5% adjustment)

REPORT STRUCTURE

SECTION 1: CURRENT COMMITTED LOAD
- Active implementation projects: [N] projects · [X] total remaining hours
  · Spread across estimated [W] weeks = [H]h/week
- Active BAU accounts:
  · VIP ([N]): [X]h/month
  · Tier 1 ([N]): [X]h/month
  · Tier 2 ([N]): [X]h/month
  · Tier 3 ([N]): [X]h/month
  · Total BAU: [X]h/month = [H]h/week
- Courtesy call obligations: [X]h/month based on [N] accounts and tier frequencies
- TOTAL CURRENT WEEKLY LOAD: [X]h/week

SECTION 2: CURRENT TEAM CAPACITY
- Team: [list each active member, role, capacity h/week]
- Total weekly capacity: [X]h
- Current utilization: [X]% ([status: Healthy / Warning / Overloaded])

SECTION 3: PIPELINE PROJECTION
For each pipeline account likely to convert (deal_stage = negotiation or later):
- Account: [Name] · Type: [NCI/CUST] · Expected hours: [X]h
- Expected start: [date range]
- Total projected additional load: [X]h/week at peak onboarding

SECTION 4: PROJECTED UTILIZATION (next 90 days)
- Best case (staggered onboarding): [X]%
- Likely case (current pipeline pace): [X]%
- Worst case (all convert simultaneously): [X]%

SECTION 5: ASSESSMENT AND RECOMMENDATION
[One of:]
✅ Current team is sufficient for the next 90 days under normal conditions.
⚠️ Current team will approach warning levels if [N]+ pipeline accounts convert.
🔴 Current team is at risk of overload. Immediate action recommended.

RECOMMENDED ACTIONS (specific):
- "Hire 1 Jr. BA by [month] to maintain utilization below 80%"
- "Stagger project kickoffs — recommend no more than [N] simultaneous starts"
- "Consider handing [N] Tier 3 accounts to maintenance team to free [X]h/month"

SECTION 6: SENSITIVITY ANALYSIS
A table showing utilization at different team sizes:
| Team Size | Current Load | Peak Load (pipeline) | Utilization |
| 4 members | [X]h | [X]h | [%] |
| 5 members | [X]h | [X]h | [%] |
| 6 members | [X]h | [X]h | [%] |

BEHAVIOR RULES
- All numbers come from system reads — hours from project templates and timelines,
  tier counts from clients table, pipeline from acquisition_pipeline
- Never invent capacity numbers — read from users.capacity_hours_per_week
- BAU hours per tier come from Department Goals settings (not hardcoded)
- Clearly state all assumptions made
- Recommend specific, actionable next steps — not vague advice
- The analysis is for planning, not auditing — be constructive and solution-focused

STEP 1 — CONTEXT
System has auto-loaded: all active projects, all active accounts by tier,
acquisition pipeline, current team roster with capacities, Department Goals settings.
Then:

1.1  Analysis period: next 90 days / 6 months / 12 months?
1.2  Any planned changes not in the system? (known upcoming hires, expected resignations?)
1.3  Any pipeline accounts with a confirmed conversion date?

STEP 2 — GENERATE ANALYSIS
Produce the full analysis populated with live system data.

STEP 3 — SCENARIO MODELING
"Would you like to model a specific scenario? For example:
- 'What if we hire 1 Jr. BA in March?'
- 'What if 3 pipeline accounts convert in Q1?'
- 'What if we hand over all Tier 3 accounts to maintenance?'"
Recalculate and compare scenarios.

STEP 4 — SAVE REPORT
Save as document record in Workforce Hub → Manpower Planning.
Accessible in the Workforce Dashboard as a pinned report.
```

---


---

# PART 5: HUB PAGES — COMPLETE UI SPECIFICATIONS

---

## HUB: HOME — PERSONAL DASHBOARD

**Route:** `/` (default after login)

The Home dashboard is role-aware. Every user lands here first. It answers three questions without any navigation: What do I need to do today? What is happening? What is coming up?

### Home — BA / Junior & Senior Business Analyst

Three tabs: **My Day · Feed · Meetings**

**Header (pinned above tabs — always visible):**
Four summary cards:
1. Today's Tasks — count + overdue count
2. Week Hours — assigned hours vs 40h capacity
3. KPI Score — current period score + status chip
4. Next Holiday — 🇵🇭 holiday name + days away

Each card is clickable — navigates to the relevant module.

**Tab 1: My Day**

Two-column layout. Left: task sections. Right: Upcoming Meetings + Smart Next Steps.

Left column sections (in order): Overdue (red header + count) → Today → This Week (Mon–Sun grouped by day, each day shows capacity bar) → Upcoming → Inbox

Each day shows: `Mon ████████░░ 6h / 8h` — bar colored green <6h / yellow 6–8h / red >8h. Weekend days shown as gray-100 dimmed cells labeled "Weekend."

Task row: urgency icon (🔴/⚡/📅) · ▶ expand toggle (Notion-style subtasks) · ☐ checkbox · Title · Project · est. hours · end date badge · 🤖 AI shortcut (if linked_app_ids) · [Open →]

Right column: Upcoming Meetings (max 4, each with platform icon + [Join] or [Prepare →] button + open action items warning) · Smart Next Steps panel (3–5 urgency-coded actions with direct buttons)

**Tab 2: Feed**

Team activity stream filtered to this user's projects by default. Filter bar: All / My Projects / Mentions / 🔍 Search. See Feed section for full event types and card design.

**Tab 3: Meetings**

All upcoming and recent meetings for this user. Columns: Title · Type · Date/Time · Client/Project · Platform · Platform join button · Open action items warning.

---

### Home — Supervisor

Four tabs: **My Work · My Team · Feed · Reports**

**Header:** Four cards: Team Active Projects · Projects At Risk · Exceptions Today · CC Compliance (this month %)

**Tab 1: My Work** — Same as BA My Day tab, scoped to supervisor's own tasks.

**Tab 2: My Team** — The supervisor's control tower:

Sections:
- **Exceptions** (red header): overdue tasks, missed CCs, pending approvals — each with a direct action button. One row per exception: Team Member · Item · Context · Days Overdue · [Action]
- **Team Workload** this week: one bar per member (name · 🟢/🟡/🔴 badge · hours bar · active projects count)
- **Pending Approvals**: RFAs + monthly plans awaiting supervisor review
- **KPI Scores** (current period): all direct reports — score chips + "— No template" warning + [Rate Quality Scores →]

**Tab 3: Feed** — Feed filtered to "My Team" by default. Shows all direct reports' events. Supervisor has a "+ Post Announcement" button.

**Tab 4: Reports** — Quick metrics without leaving the dashboard: CC compliance bar chart · Exception summary counts · CSAT averages last 30 days. "Open Full Reports →" link.

---

### Home — Manager

Four tabs: **My Work · Department · Feed · Analytics**

**Header:** Four cards: Active Clients · Pipeline Prospects · Dept. KPI Avg · Critical Alerts

**Tab 2: Department** — Two-column layout:
Left: Team KPI summary (all members by score) · Workload snapshot (overloaded flag) · Pending CEO approvals
Right: Acquisition pipeline summary · CC compliance this month · Recent CSAT scores · System health status chip

**Tab 3: Feed** — All department events. Manager can post announcements visible to entire department.

**Tab 4: Analytics** — Chart thumbnails: project delivery rate (bar) · CSAT trend (line) · utilization gauge · KPI distribution (histogram). Each links to full Reports.

---

## HUB: CLIENT MANAGEMENT

### Client Management Dashboard

**Route:** `/clients/dashboard`

Two sections:

**Section 1 — Account Portfolio Kanban**

Columns represent lifecycle stages: Onboarding · Implementation · Go-Live · Hypercare · Turnover · BAU · Renewal · At Risk (cross-cutting)

Each card: Company name · tier badge · health score chip · assigned AM avatar (or "⚠️ Unassigned" in red) · active project count · CC status this month

**Section 2 — Unassigned Accounts Panel**

Right side panel (collapsible). Lists all accounts with no assigned Account Manager. Each row: Account name · Tier · Size · Date added · [Assign →] button → opens Account Assignment Advisor App

---

### All Accounts Page

**Route:** `/clients`

Filter bar: Status · Lifecycle Stage · Tier · Account Manager · Health Score range · Industry · Company Size · Tags · Show Closed toggle (off by default)

Table columns: Company Name (with closure badge if applicable) · Tier · Lifecycle Stage · Status · Health Score chip · Account Manager + workload · Active Projects count · CC This Month · Contract End · Last Meeting · Actions

View toggles: List · Kanban (by lifecycle stage) · **Accounts Tree**

**Accounts Tree view** — Notion-style collapsible tree:
```
▶ ACME Group (Parent Account)          Enterprise · VIP · Active
  ├── ACME Manufacturing               SME · Tier 1 · Active · 2 projects
  └── ACME Distribution                SME · Tier 2 · Active · 1 project
▼ FH Commercial (Standalone)           Mid-Market · Tier 1 · Active
  └── [expand to see projects, then milestones, then tasks]
```

---

### Client Profile Page (360° View)

**Route:** `/clients/:client_id`

#### Account Lifecycle Timeline — ALWAYS VISIBLE, PINNED BELOW HEADER

Horizontal stage dots connected by lines. Completed = filled circle ●, blue-500, checkmark + date. Current = pulsing ring ◉, "NOW". Upcoming = empty ○, gray-400.

Below timeline: **Next Action card** — single most important action for the assigned AM with urgency color (🔴/🟡/🔵/⚫) and direct action button.

#### Client Header — Always Visible

Company name · logo · Tier badge · Health score chip · Lifecycle stage badge · Account Manager + team avatars · Subscription plan

Buttons: Edit Client · + Log Courtesy Call · + Send CSAT · Initiate Closure

#### Summary Cards (6 cards, clickable)

1. Active Projects (count → Projects tab)
2. Courtesy Call This Month (status → CC tab)
3. CSAT Latest (App score + PM score → CSAT tab)
4. Open Issues (count + SLA breach count → Hypercare tab)
5. SLA (response/resolution times → Overview — hidden if no SLA on file)
6. KYC Status (status badge: ✅ Completed · 🟡 Needs Update · 🔴 Overdue · ⬜ Not Started · next review date → KYC tab)

#### Tabs (16 tabs)

**Tab 1: Overview** — Company details · Contract dates (amber if <90 days) · Internal notes · Tags · Segment · Health score with expandable signal breakdown · Account Manager profile card + team member cards · SLA summary + Upload New Version button

**Tab 2: Projects** — Sub-tabs: Active / Historical / All. Columns: Project Name · Type · Template · Phase · Status · PM + workload · Team avatars · Start · Target Go-Live · Actual Go-Live · Est/Actual hours · Risk. "+ New Project" pre-fills client.

**Tab 3: Contacts** — Card grid sorted by type. Each card: name · ⭐ if primary · position · type badge · email (mailto) · mobile · source badge · Edit/Toggle/Delete icons. Quick inline add row at bottom. History toggle shows audit log.

**Tab 4: KYC (Know Your Client)**

This tab is the central KYC management surface for this account. KYC is not just a document — it is a living record that must be maintained and is tracked as a KPI milestone.

**KYC Status Banner (always visible at top of this tab):**
```
┌──────────────────────────────────────────────────────────────────────────┐
│  KYC Status: ✅ Completed — v2 Annual Review                             │
│  Last updated: Feb 5, 2026 by Jillian Santos                            │
│  Next review due: Feb 5, 2027  (11 months away)                         │
│  [Open KYC in Google Docs ↗]    [Start New Version]    [Generate KYC ✨]│
└──────────────────────────────────────────────────────────────────────────┘
```

Status color coding: ✅ Completed (green) · 🟡 Needs Update (amber — review date passed) · 🔴 Overdue (red — past due by > 30 days) · ⬜ Not Started (gray — no KYC on record)

**Active KYC Record:**
When a completed KYC exists, display its key contents inline (collapsible sections):
- Company Profile summary (key fields: employee count, field force, regions, products)
- Stakeholder Map (matches the Contacts tab but shows the snapshot at time of KYC — useful for seeing how the account has changed)
- Tarkie Configuration Summary (which modules are active, custom configurations)
- Account Notes (nuances, communication preferences, sensitivities)
- Renewal Risk (badge: Low/Medium/High + rationale)
- Account Health at last KYC date (health score, CC compliance, CSAT at the time)

**KYC Version History:**
Table below the active record:

| Version | Label | Status | Completed By | Date | Google Doc |
|---|---|---|---|---|---|
| v2 | Annual Review — Feb 2026 | ✅ Completed (active) | Jillian | Feb 5, 2026 | Open ↗ |
| v1 | Initial KYC — Feb 2025 | Superseded | Jillian | Feb 3, 2025 | Open ↗ |

"Start New Version" button — creates a new `kyc_records` draft record and opens the KYC Form Generator AI App with this client pre-loaded. The AI reads all available system data and pre-fills the document.

"Generate KYC ✨" button — same as "Start New Version" but emphasizes the AI-powered path.

**KYC completion workflow:**
1. AM opens the KYC Form Generator App from this tab (or via the AI Apps menu)
2. App reads all client data from the system and generates a pre-filled KYC document
3. AM reviews, fills any gaps (verbal notes, account sensitivities), and finalizes
4. AM clicks "Mark as Complete" → `kyc_records.status` → `completed`
5. System auto-creates a `kyc_completed` milestone_log entry → feeds the KPI scorecard
6. Client's `kyc_status` → `completed`, `active_kyc_record_id` → this record
7. `next_review_date` set to 1 year from today

**KYC App shortcut:** A prominent "Generate KYC ✨ (AI-Powered)" button appears on this tab when KYC status is Not Started or Needs Update. This launches App 10 (KYC Form Generator) directly with this client's context pre-filled.

**Tab 5: Courtesy Calls** — Header: 12-month compliance rate. Table: Month · Tier · Assigned To · Required · Completed · Status · Meeting link. Actions: Log Call · View Meeting · Reassign · Defer.

**Tab 6: CSAT Surveys** — Header metrics: Avg App Score · Avg PM Score · Total Sent · Response Rate. Table: Survey ID · Type · Sent Date · Respondent · App Score chip · PM Score chip · Status. "+ Send CSAT" button.

**Tab 7: Meetings** — Table: Title · Type · Date · Participants · Platform · Recording icon · MOM icon · Open action items count. One-click: Generate MOM · Generate BRD Draft · Generate Process Flow · Create Tasks from Action Items.

**Tab 8: BRDs** — Table: Title · Version · Project · Status · Created By · Approved By · Google Doc link · Date.

**Tab 9: RFAs** — Table: RFA ID · Title · Type · Priority · Submitted By · Status · SLA Days (breach indicator) · Est. Hours · AI Review grade · Emails Sent count.

**Tab 10: Tasks** — All tasks across all projects for this client. Notion-style expand for subtasks. Columns: Title · Project · Assigned To · Type · Status · Priority · End Date · Est/Logged Hours. Filter: Active / Overdue / Completed / by Project.

**Tab 11: Documents** — Sections: SLA & Legal · KYC File (links to KYC tab for the live KYC; also stores exported PDFs of each KYC version here) · Proposals · Project Documents (by project) · Correspondence · Other. Per file: name · type badge · uploaded by · date · size · Download · Open in Docs.

**Tab 12: Communications** — Outbound comms log. Upcoming scheduled communications at top. "Send Now" → Script Library pre-filtered to this client.

**Tab 13: Learnings** — Table: Title · Project · Category · Impact · Created By · Date.

**Tab 14: Hypercare** — Issue tracker: Issue ID · Title · Severity · Reported By · Reported At · Status · Time to Resolve · Resolved At. "+ Log Issue" button. (Visible only when project in hypercare or open issues exist.)

**Tab 15: Activity** — Full audit trail. Field changes (old → new · who · when). Status transitions. Team assignment changes. Timeline updates (with clock icon and full before/after comparison). KYC status changes.

**Tab 16: Closure** — 16-step mandatory checklist in 4 groups (Initiation · Financial · Documentation · Approvals). Three clearance badges: Manager · Finance · CEO. Outstanding balance warning blocks Finance clearance. CEO only available after Finance. "Generate Final Documentation" AI App button. (Visible only when closure record exists.)

---

## HUB: PROJECT MANAGEMENT

### Project Management Dashboard

**Route:** `/projects/dashboard`

Role-aware. Manager sees department-wide view. Supervisor sees their team's projects. BA sees their own projects.

Sections:
- **Active Projects summary**: by phase distribution (bar chart), by risk level (donut), by PM
- **Overdue milestones**: list with project, PM, days overdue, direct [View →] link
- **Timeline variance summary**: projects with the largest positive variance from original go-live
- **Upcoming go-lives**: projects going live in the next 30 days

---

### All Projects Page

**Route:** `/projects`

Filter bar: Status · Phase · Project Type · PM · Client · Risk Level · Priority · Start Date range · Target Go-Live range · Plan Status · Tags

Table: Project Name (+ client subtext) · Project Code · Type · Phase · Status · PM + workload · Team avatars · Target Go-Live (red if overdue) · Days Running · Risk · Est/Actual hours · Plan Status · Actions

View toggles: List · Board (Kanban by phase) · Team Gantt

---

### Project Profile Page (360° View)

**Route:** `/projects/:project_id`

#### Project Lifecycle Timeline — ALWAYS VISIBLE, PINNED BELOW HEADER

Same component as Client lifecycle timeline but scoped to project phases. Current phase pulsing. Next Action card below.

#### Project Header

Project name · Template code badge · Status · Phase · Client (linked) · PM + workload · Team avatars · Risk · Weight · Start / Target Go-Live / Actual Go-Live · Day N of ~X · Est/Logged hours · Baseline comparison · Plan status

Buttons: Edit · Advance Phase · Add Risk · Generate BRD · Submit Plan

#### Summary Cards (4)

Milestones (X/Y done · overdue count) · Tasks (active · overdue) · Hours (logged/estimated · over/under) · Risk (level · open count)

#### Tabs (15 tabs)

**Tab 1: Overview** — All project fields + team composition + baseline vs current comparison + phase gate status (% of current phase deliverables complete)

**Tab 2: Timeline** — Active Official Timeline section (if exists, labeled 🟢) + Active Projected Timeline section (labeled 🔵 with disclaimer) + Timeline History table (all versions with Type / Status / Target Go-Live / Variance / Baseline Used / AI Generated chip / RFA link) + Action buttons: Create Projected / Create Official / Request Revision + Gantt preview comparison

**Tab 3: Recommendation** — Active Recommendation section + Recommendation History table + "+ Create Recommendation" form (with document type selector, timeline link, BRD link, Google Slides URL) + Approval flow status

**Tab 4: Tasks** — Three views: List · Kanban · Gantt

List view grouped by Phase → Milestone → Tasks → Subtasks (Notion-style). Plan Submission banner until approved. Milestone rows shown as bold group headers with status, due date, quality score (editable by supervisor), and "N/M tasks done" progress. Task rows: # · ▶ toggle · ☐ · Task Code · Name · Phase · Type · Status · Priority · Assigned · Start Date · End Date · Est. Hours · Logged Hours mini-bar · 🏆 milestone icon · 🤖 AI icon.

Gantt view: Dual-bar Plan/Actual. Outer bar = planned (light muted, full height). Inner bar = actual (vivid solid, 40% height centered). Overrun = inner extends past outer, turns ember-500. Weekend columns: gray-100, narrower. Holiday columns: amber-50, 🇵🇭 marker. Today line: blue-500 dashed. Milestone diamonds. Dependency arrows. Baseline toggle. Export PNG/XLSX.

**Tab 5: Milestones** — Phase-grouped table. Each milestone row: name · KPI type badge · is_kpi_milestone indicator · timeline version badge (showing which version set this date) · due date · status · quality score (editable inline by supervisor) · quality notes · progress. "Rate Quality Scores" batch modal for supervisor.

**Tab 6: Team** — User profile cards with role, workload, tasks count, hours logged. Assignment history expandable. "+ Assign Team Member" button.

**Tab 7: Meetings** — Same table as Client Meetings, filtered to this project. One-click: Generate MOM · Generate BRD Draft · Generate Process Flow · Create Tasks.

**Tab 8: BRD & Documentation** — Sub-sections: BRDs (version history + Create BRD button) · Process Flows (Mermaid thumbnails + Generate button) · Fit-Gap Analysis · UAT Documents · Training Materials.

**Tab 9: RFAs** — Same table as Client RFAs filtered to project. Timeline revision RFAs have clock icon + "View Draft Timeline" action. "+ Submit RFA" pre-fills project + client.

**Tab 10: Risks & Issues** — Risk Register table: Category · Description · Likelihood · Impact · Risk Score chip · Mitigation · Owner · Status. "+ Add Risk" button.

**Tab 11: Process Flows** — Table: Title · Flow Type · Source · Status · Version · Mermaid thumbnail. "+ Generate Process Flow" opens app in right drawer.

**Tab 12: Turnover** — (Visible when phase ≥ Hypercare.) 10-item mandatory checklist with progress bar. CCT Receiver assignment selector. "Generate Handover Document" button. "Advance to BAU" hidden until all 10 items checked and both sign-offs received.

**Tab 13: Communications** — Project comms log. Active email triggers on milestone tasks. Communication timeline.

**Tab 14: Learnings** — Table with "+ Add Learning" button. BAU prompt shown when phase = bau.

**Tab 15: Activity** — Full change log including timeline revisions (clock icon with before/after dates, RFA link, reason).

---

### Tasks — Hierarchy Tree View

**Route:** `/projects/tree`

Also accessible from any client, project, or milestone via "Tree View" button.

A Notion-style collapsible tree showing the complete work hierarchy in one unified view:

```
▶ ACME Corp (Client)
  └── ▶ ACME Manufacturing (Child Account)
        ├── ▶ AIMCO Implementation (Project)
        │     └── ▶ Build/Config (Phase)
        │           ├── ▶ Masterdata Validation (Milestone) ⚠️ Due Nov 18
        │           │     ├── ☐ Download client Excel template — Jillian · Nov 15
        │           │     ├── ☐ Run Data Validation App — Jillian · Nov 16 🤖
        │           │     └── ☐ Send validation report — Jillian · Nov 17
        │           └── ▶ Setup Clearance (Milestone)
        │                 └── ☐ Internal config review — Jillian · Nov 20
        └── ▶ Timeline (separate from projects) v2 Official · Go-Live Dec 15
```

Hover any Milestone row → "+ Add Task" inline. Hover any Task row → "+ Add Subtask" inline. Click any row name → opens record detail in right side panel without leaving tree view.

---

### Gantt Chart — Team Level (Multi-Project)

**Route:** `/projects/team-gantt`

Access: Supervisor + Manager only.

Shows ALL team members' active projects as horizontal bars across monthly columns. Project-level (not task-level). Default: past 6 months to current month.

Display modes: By Person · By Client · By Phase. Capacity overlay toggle. Weekend/holiday rendering same as project Gantt.

Project bar tooltip: Project name · Client · Phase · PM · Start/Target dates · Status · Milestone progress.

---

## HUB: WORKFORCE MANAGEMENT

### Workforce Dashboard

**Route:** `/workforce/dashboard`

Manager view: Team utilization summary chart · Accounts per member by tier matrix · 4-week forward capacity projection · Unassigned accounts count + quick-link · Manpower Planning summary widget · Onboarding pipeline count

Supervisor view: Team workload this week + next week · Overloaded members (red alert cards) · AI redistribute button · Monthly planning status (submitted / not submitted per member) · Exception list (overdue tasks, missed milestones)

---

### All Team Members (Users List)

**Route:** `/workforce/team`

(Same as Users List in Section 1.4 above — the nav item "Team Members" in the Workforce Hub links here.)

---

### Workload View

**Route:** `/workforce/workload`

Grid: Team members (rows) × Working days Mon–Fri (columns; weekends hidden). Cell: total estimated hours for that person that day. Colors: green <6h / yellow 6–8h / red >8h. Click cell → popover with task list. Drag task between cells to reschedule/reassign (with confirmation).

AI Redistribute button: appears when any member is at >90%. See Workforce Management section for the AI redistribution flow.

---

### Monthly Planning

**Route:** `/workforce/monthly-planning`

Calendar/List/Kanban/Workload bars views. Pre-populates from tasks with end_dates in target month, CC placeholders, recurring tasks, PH holidays.

Weekend days dimmed (gray-100). Holiday cells amber. Dragging to weekend: "Move to Friday / Move to Monday / Keep on Weekend." Dragging to holiday: "Move to next working day / Keep on holiday." Tasks on non-working days: amber border in all views.

Plan summary header: `Working days: 20 · Tasks on weekends/holidays: 2 ⚠️ · Total est.: 142h / 160h capacity`

Supervisor view: all team members' plans side-by-side. Supervisor's own team-support hours tracked separately.

---

### Time Logs

**Route:** `/workforce/time-logs`

Table: Date · User · Task · Project · Client · Hours · Description. Period filter + summary footer. Export button.

---

### Manpower Planning

**Route:** `/workforce/manpower-planning`

The AI Manpower Planning Advisor App runs here. See App 15 (Manpower Planning Advisor) for the full UI and CLAUDE.md. The analysis output is saved as a pinned report on the Workforce Dashboard.

---

### Department Goals

**Route:** `/workforce/department-goals`

Access: Manager + Admin only.

All configurable department targets shown as editable fields. See Department Goals Settings table in the Workforce Hub specification above.

---

### Onboarding Tracker

**Route:** `/workforce/onboarding`

List of staff_onboarding records. Table: Name · Start Date · Role · Supervisor · Status · Checklist Progress · Actions.

Detail view per record: all 10 onboarding checklist steps with completion status, due dates, and assigned-to. Each step has a Mark Complete button.

---

## HUB: PERFORMANCE

### Performance Dashboard

**Route:** `/performance/dashboard`

Sections:
- Current period KPI scores: all team members with scores and status chips
- Team milestone completion rate (current month)
- Department-level CC compliance
- CSAT trend (last 6 months, line chart)
- Acquisition pipeline wins this quarter

---

### KPI Scorecards

**Route:** `/performance/kpi`

List of all scorecard instances for the current period. Filter: Period · User · Status (draft / under_review / finalized). Table: User · Period · Overall Score · Status · Reviewed By · Actions.

Detail view: the full KPI scorecard for one user + period, rendered as color-banded rows (see master instruction Section 36 for the exact scorecard rendering specification).

---

### Milestone Tracker

**Route:** `/performance/milestones`

Per-employee milestone count table. Period selector. See milestone tracker specification in Users module Tab 5.

Team Leaderboard view (supervisor/manager): side-by-side comparison of all team members, same milestone types as rows, members as columns. Exportable as .xlsx.

---

### Usage & Targets

**Route:** `/performance/usage-targets`

Module for entering and tracking Tarkie Field App and Manager App usage actuals vs targets per account per month. Per row: User · Account · Month · Field App Target % · Field App Actual % · Manager App Target % · Manager App Actual % · Combined Score. ERPNext Import/Export.

---

### Acquisition Pipeline

**Route:** `/performance/pipeline`

List of acquisition_pipeline records. Kanban by deal_stage. Card per prospect with tier, deal stage, assigned future AM, POC status, target assignment date.

"+ New Prospect" button. "Convert to Client" button when deal_stage = won_pending_onboarding.

---

## HUB: ADMINISTRATION

### System Health Dashboard

**Route:** `/admin/system-health`

Six health check categories run every 4 hours:

1. AI Apps & Skills — broken apps auto-hidden from team; missing CLAUDE.md = misconfigured
2. KPI & Metrics — users without active scorecard = 🔴 Critical; auto-creates system_admin task
3. Integration Health — Google OAuth, Drive, Docs, Zoom, Anthropic API, email
4. Data Integrity — orphaned records, missing assignments, stuck jobs
5. User & Role Config — missing roles, incomplete org chart, missing CEO user
6. Communications — missing script templates, broken automation rules

Additional checks (from AI Cost Monitor):
- No app exceeded budget limit
- AI API call failure rate < 5% in last 24 hours
- No daily cost spike > 3× the 30-day daily average

Additional checks (from KYC):
- No active client (Tier 1–4) has `kyc_status = needs_update` for more than 30 days — 🟡 Warning; list of accounts with overdue KYC + assigned AM
- No active client (Tier VIP/1) has never had a completed KYC — 🔴 Critical; auto-creates a `system_admin` task for the assigned AM

---

### AI Apps & Skills

**Route:** `/admin/ai-apps`

List of all AI Apps. Table: App Name · Category · Status (Active/Disabled toggle) · Last Used · Sessions This Month · Est. Cost This Month · Required Roles · Actions.

Click any app → App Config detail page:
- App metadata (name, description, icon, category)
- CLAUDE.md editor (version-controlled; edit = creates new version)
- Allowed Tools selector (checkbox list from Agent Tool Registry)
- Auto-Context configuration
- Steps configuration (step title and description per step)
- Test Agent button (simulation mode with a real record)
- Cost history chart
- Disable button with reason field

"+ Create New App" button — opens App Builder with the same configuration form.

---

### AI Cost Monitor

**Route:** `/admin/ai-cost`

Access: super_admin only.

Seven sections:
1. Month summary bar: Estimated Cost · Total API Calls · Total Tokens · Avg Cost/Call · Month-over-month delta
2. Cost by App table: App Name · Status toggle · Sessions · Calls · Input Tokens · Output Tokens · Est. Cost · % of Total · Avg Cost/Session · Actions
3. Cost by System Feature: Client Health Score · RFA AI Review · Meeting Transcripts · News Feed Digest — each with calls, tokens, cost, and on/off toggle
4. Monthly Trend Chart: 12-month line chart with per-app toggleable lines
5. Top Users table: informational only
6. Budget Management: configured budgets with progress bars; alert and auto-disable behavior
7. Cost Settings: `cost_per_1k_input_tokens`, `cost_per_1k_output_tokens`, active model — "Update Rates" triggers retroactive recalculation

All cost figures labeled "Estimated." Never shown as confirmed billing.

---

### Org Chart

**Route:** `/admin/org-chart`

Tree view (default): top-down from CEO. Each node: avatar + name + role badge. Click → side panel with profile summary. Color-coded by org level.

List view: Name · Role · Org Level · Reports To · Manager · Team · Status. ERPNext Import/Export.

---

### Script Templates

**Route:** `/admin/script-templates`

List of all communication script templates. Table: Name · Trigger Event · Category · Active · Last Used · Actions.

Detail view: template body (rich text with {{merge.field}} markers) · Trigger events configured · Test send button.

---

### Email Automation

**Route:** `/admin/email-automation`

List of all email automation rules. Each rule: Trigger event · Script template → Recipients → Send mode (auto_send / create_draft / notify_sender). Active toggle.

---

### Custom Fields

**Route:** `/admin/custom-fields`

Module selector dropdown. List of all custom field definitions for that module. Drag to reorder. "+ Add Field" opens type selector form. Edit/Archive per field.

---

### System Settings

**Route:** `/admin/settings`

Sections:
- AI Cost Settings (token rates, default model)
- Google Integration settings (OAuth credentials, folder structure config)
- Zoom Integration (OAuth credentials)
- Email Provider settings
- Department Goals (links to Workforce Hub → Department Goals)
- PH Holiday overrides (manual presidential proclamation additions)
- Session timeout, password policy
- Notification preferences (global defaults)

---

# PART 6: CLIENT PROJECT PORTAL

**Route:** `/portal/project/{secure_token}`

External-facing read-only page. No login required. Authentication: email address match (must be in `project_portal_tokens.allowed_contact_ids`) + optional 4-digit passcode.

**What the client sees:**
- Project name, client name, as-of date, contact PM name and email
- Project Status Card: current phase, target go-live, overall progress %
- Phase Timeline: read-only lifecycle timeline with actual completion dates and projected future dates
- Milestone Table: Phase · Milestone · Status · Target Date · Actual Completion (milestones only — no internal tasks)
- "Your Deliverables" section: only external tasks where `external_assignee_contact_id` matches this authenticated contact

**What is NOT shown:** Internal tasks · Team member names/workload · RFAs · Financial info · KPI scores · Comments · Internal notes

**Portal Settings** on Project Profile: "🔗 Share Project View" button opens a panel with toggle, passcode, allowed contacts, expiry, revoke, and access log.

---

# PART 7: NEWS FEED

The News Feed is a real-time, WebSocket-driven activity stream.

**Event types:** task_completed · milestone_reached · project_phase_advanced · brd_approved · rfa_submitted · rfa_approved · project_created · courtesy_call_done · csat_received · go_live · training_done · account_onboarded · comment_mention · kpi_score_updated · poc_delivered · health_issue_resolved · holiday_reminder · team_announcement

**Holiday reminders:** Auto-generated 3 working days before any Philippine public holiday. Visible to all team members.

**Highlighted events** (go_live, csat_received ≥ 9, account_onboarded): blue-50 background + blue-500 left border + confetti animation on first render for go_live.

**Reactions:** 👍 🎉 ❤️ 💪 👏 — click to react, click again to remove.

**Comments:** Inline thread, @mentions, file attachments, emoji reactions.

**Supervisor/Manager announcements:** "+ Post" button creates team_announcement visible to selected team members.

**Filters:** All · My Projects · My Accounts · Milestones Only · Mentions · My Team (supervisor/manager default)

---

# PART 8: CALENDAR

**Route:** `/calendar`

Sub-navigation: My Calendar · Team Calendar (supervisor/manager) · Monthly Plan

**Views:** Month · Week · Day (Mon–Fri only) · Team View

**Key visual rule — always enforce:**
- Planned events: light pastel background + colored border
- Completed/done events: vivid solid background + white text

**Event type colors:** See task_type table in Section 3.9 above.

**Weekend rules:**
- Saturday/Sunday: gray-100 background, gray-400 date numbers (dimmed)
- Week view: weekend columns 60% width of weekday columns
- Day view: unavailable on weekends; shows "Weekend — no working schedule" with Fri/Mon navigation

**Holiday display:**
- Regular Holiday: amber-50 bg + FF9800 left border + name + 🇵🇭
- Special Non-Working: yellow-50 + FFC107 border
- Special Working: subtle italic gray indicator

**External integrations:**
- Google Calendar: Two-way sync via same Google OAuth. Meetings created in CST OS auto-create Google Calendar events.
- Zoom: Meeting with platform=zoom → Zoom API creates meeting auto; recording link attached after meeting ends.
- MS Teams: Manual "+ Add External Meeting" → lightweight external_meeting record. "Convert to Meeting Record" option.

---

# PART 9: MANDATORY BUILD DIRECTIVES

These are non-negotiable rules. Build in the order listed.

1. **Build the database schema first.** All tables in Part 3 must exist before any UI is built. Run migrations. Verify all foreign keys. Seed baseline data.

2. **Build the Agent Data Service second.** Every AI App depends on it. No AI App can be built without the agent-data.service.ts, agent-context.builder.ts, agent-tool.registry.ts, and agent.runner.ts in place.

3. **Respect the 5-hub navigation structure.** Do not build flat-module navigation. The hub grouping is the product architecture, not a cosmetic choice.

4. **Soft deletes everywhere.** Never a `DELETE` SQL statement on any user-facing table.

5. **All AI calls logged.** Every Claude API call from any source writes to `ai_api_call_logs`. No exceptions.

6. **All tool calls logged.** Every agent tool call writes to `agent_tool_call_logs`. No exceptions.

7. **AI cost figures labeled "Estimated" everywhere.** Never present as confirmed billing.

8. **AI Apps can be disabled instantly.** `ai_apps.is_active = false` removes the app from all views immediately. No deployment needed.

9. **Working days always exclude weekends and PH holidays.** This is a single shared utility function used everywhere. Never duplicate the logic.

10. **Timeline activation is a single database transaction.** When an official timeline is approved, all project dates, all milestone dates, and all task dates update atomically. Partial updates are a critical failure.

11. **Baseline changes are non-retroactive.** When a `timeline_baselines` record is updated, it only affects future timelines. Existing `project_timelines` records keep their `baseline_id` snapshot.

12. **Custom fields are a platform feature, not per-module code.** The `custom_field_definitions` + `custom_field_values` shared service is the only implementation. Modules consume it — they do not have their own custom field logic.

13. **The Client Project Portal is completely isolated from the main application.** It has its own route namespace (`/portal/...`), its own authentication (email + token), and it never exposes any internal system data.

14. **Every AI App has a `max_context_tokens` limit.** The `agent-context.builder.ts` must enforce this. Never allow unlimited context growth.

15. **The Notion-style tree view and Notion-style subtask expansion are core UI patterns.** Every task list view in the system uses the ▶ toggle to expand subtasks inline in the same table. No separate navigation to subtasks.

---

*End of CST OS Claude Code Build Instructions — Version 3.0*

*This document is complete and authoritative. It supersedes all prior versions. Build in the order defined. Do not add features not specified. Do not omit features that are specified. When in doubt: ask before building.*

