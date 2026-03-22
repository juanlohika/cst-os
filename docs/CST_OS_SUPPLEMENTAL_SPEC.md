# CST OS — Supplemental Specification
## Navigation · AI Apps · App Builder · Skills · Assistant · Chat · Tasks
### Version 1.2 — Consolidated
### Supplement to CST_OS_MODULE_SPECS_V3.md

---

> **To Claude Code:** This document supplements V3 of the module specifications. All rules here override V3 where they conflict. When future refinements are added, they are merged into this document — never appended as a separate section at the bottom. Build everything described here. Nothing is optional.

---

# PART 1: NAVIGATION — COMPLETE CORRECTED STRUCTURE

## 1.1 What Changed from V3

V3 had two problems this document corrects:

**Problem 1:** AI Apps & Skills was listed under Administration. Administration is for building and configuring apps — not for using them. Daily-use AI Apps must be in the personal navigation alongside Home, Calendar, and Tasks.

**Problem 2:** The nav item was called "My Tasks" — too narrow. Supervisors and managers need their team's tasks from the same entry point. It is renamed to "Tasks" and the page is role-aware.

## 1.2 Final Navigation Structure

This is the complete, authoritative navigation. Build it exactly as shown.

```
┌─────────────────────────────────────────────────────────────────────┐
│  CST OS — Left Navigation (255px fixed)                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Logo]  CST OS                           [User avatar]             │
│                                                                     │
│  ─── PERSONAL ──────────────────────────────────────────────────── │
│  🏠  Home                                                           │
│  ✅  Tasks          ← role-aware: My Tasks / My Team / Department   │
│  📅  Calendar                                                       │
│  ✨  AI Apps        ← ALL team members; launch daily-use AI Apps    │
│  💬  Assistant & Chat                                               │
│      ├── My Assistant   ← full-page chat + job queue + capabilities │
│      └── Team Chat      ← direct messages and group chats           │
│                                                                     │
│  ─── HUBS ────────────────────────────────────────────────────────  │
│  👥  Client Management                                              │
│  📁  Project Management                                             │
│  ✅  Workforce Management                                           │
│  📊  Performance                                                    │
│                                                                     │
│  ─── ADMIN ───────────────────────────────────────────────────────  │
│  ⚙️  Administration                                                 │
│      ├── System Health                                              │
│      ├── App Builder        ← BUILD and configure AI Apps           │
│      ├── Skills Builder     ← BUILD and configure AI Skills         │
│      ├── Template Library   ← PPTX + Google Doc templates           │
│      ├── AI Cost Monitor                                            │
│      ├── Script Templates                                           │
│      ├── Email Automation                                           │
│      ├── Master Data        ← ALL lookups, enums, custom fields     │
│      └── System Settings                                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**The distinction between personal nav and admin is permanent:**

| Navigation Item | Who | Purpose |
|---|---|---|
| ✨ AI Apps | All team members | Launch and use pre-built AI Apps |
| 💬 Assistant & Chat | All team members | AI Assistant + Team Chat |
| ⚙️ App Builder | Admin + App Creators | Build, test, publish Apps |
| ⚙️ Skills Builder | Admin + App Creators | Build, test, publish Skills |

---

# PART 2: TASKS PAGE — ROLE-AWARE DESIGN

## 2.1 Route and Rename

**Route:** `/tasks`  
**Nav label:** Tasks (not "My Tasks")

The page is role-aware. The default view and available scope options differ by role. All roles share the same tab structure, the same filter bar, and the same task row design.

## 2.2 Context Selector

At the top of the Tasks page, a context selector dropdown controls whose tasks are shown. The options available depend on the user's role.

**For BA / Jr. and Sr. Business Analyst:**

```
View: [My Tasks ▼]   ← only option available; dropdown is decorative
```

Only their own tasks are ever shown on this page.

**For Supervisor:**

```
View: [My Tasks ▼]
      ─────────────────
      My Tasks          ← supervisor's own tasks
      My Team           ← all direct reports combined
      ─────────────────
      Jillian Santos
      Mark Reyes
      Edhenn Cruz
      Ana Reyes
```

Selecting "My Team" shows all tasks for all direct reports in one combined view. Selecting a specific name narrows to that person.

**For Manager:**

```
View: [Department ▼]
      ─────────────────
      My Tasks          ← manager's own tasks
      Department        ← all team members (default for manager)
      ─────────────────
      ▶ Supervisor A — Maria Cruz
          Jillian Santos
          Mark Reyes
      ▶ Supervisor B — John Dela Cruz
          Edhenn Cruz
          Ana Reyes
```

The manager can select the full department, a supervisor's entire team, or a single team member. The indented tree reflects the org chart.

## 2.3 Tabs

These tabs apply in all scope views (My Tasks, My Team, Department). Content is scoped to the current context selector selection.

| Tab | Shows |
|---|---|
| Today | Tasks where `scheduled_date = today` OR `end_date = today`; sorted by priority |
| This Week | Tasks grouped by day Mon–Sun; weekend days shown as gray-100 dimmed; holiday days amber-50 |
| Overdue | Tasks where `end_date < today` AND status ≠ done/cancelled; sorted by most overdue first |
| Upcoming | Tasks with `end_date > today` beyond this week; grouped by week |
| Inbox | Tasks with no `scheduled_date` and no `end_date`; sorted by priority then creation date |

**Today tab header:** Daily capacity bar for each person in scope.
For My Tasks: `Today's Load: ████████████░░░ 7.5h / 8h [🟡 Busy]`
For My Team: one bar per team member, labeled by name.

## 2.4 Filter Bar

All filters support **multi-select**. No filter is single-select except where technically required (date range). Filters are always visible above the task list, not hidden behind a button.

| Filter | Options | Notes |
|---|---|---|
| Assigned To | All users in current scope | Multi-select; for My Tasks defaults to current user and is locked |
| Project | All projects in scope | Multi-select |
| Client | All clients in scope | Multi-select |
| Task Type | All 11 task types | Multi-select |
| Priority | Critical / High / Medium / Low | Multi-select |
| Status | All 6 status values | Multi-select |
| End Date Range | Date range picker | |
| Has AI App | Toggle | Show only tasks with linked AI apps |
| Is External Task | Toggle | Show/hide tasks assigned to client contacts |
| Overdue Only | Toggle | Quick filter; same as Overdue tab but works across all tabs |
| Blocked Only | Toggle | Show only tasks with status = blocked |

**Saved Views:** Any filter combination + context scope + active tab can be saved as a named view using the "Save View" button that appears in the filter bar when any filter is active. Saved views appear as quick-access chips below the filter bar. They are per-user and not shared.

Example saved views:
- "Jillian's Overdue" — Scope: Jillian · Overdue tab
- "AIMCO All Active" — Client: AIMCO · Status: todo, in_progress, for_review
- "Blocked This Week" — Status: blocked · This Week tab · All team

## 2.5 Task Row Design

Same Notion-style row used everywhere in the system:

```
🔴  ▶  ☐  Masterdata Validation        AIMCO · Build/Config     3h   Nov 18 ⚠️
          [🤖 Data Validation Tool →]                                  [Open →]
```

- Urgency icon: 🔴 overdue / ⚡ due today / 📅 upcoming
- ▶ expand: shows subtasks indented 32px beneath the parent; "▶ 3 subtasks (1 done)" when collapsed
- ☐ checkbox: marks Done (triggers milestone cascade check)
- Title (14px medium) + Project/Client context (12px gray-500 below) + estimated hours
- End date badge (red if overdue, amber if today)
- 🤖 AI App shortcut button (secondary, 12px) — only shown when linked_app_ids populated
- [Open →] ghost button — opens Task Detail side panel

External tasks assigned to client contacts show a 🏢 icon instead of a user avatar.

## 2.6 Bulk Actions

When one or more task checkboxes are selected, a bulk action bar appears at the bottom of the screen:

```
[3 tasks selected]  [Reassign]  [Change Status ▼]  [Change Priority ▼]  [Set End Date]  [Delete]  [✕ Cancel]
```

Each action applies to all selected tasks. Delete requires a confirmation dialog.

## 2.7 Quick Task Creation

`T` keyboard shortcut anywhere opens the floating Quick Task Bar:

```
[+ New task: ___________________________] [Project ▼] [End Date ▼] [Assign To ▼] [Enter]
```

For supervisors and managers, "Assign To" defaults to the current user but can be changed to any team member immediately — enabling fast delegation without navigating to a project.

---

# PART 3: AI APPS PAGE — TEAM-FACING

## 3.1 Route and Access

**Route:** `/ai-apps`  
**Access:** All roles; each app's `required_roles` config controls which cards appear.

This is the team's personal AI workspace — where they launch apps for daily work. It is not an admin page.

## 3.2 Page Layout

**Header:** "AI Apps" (20px semibold) · "Powered by Claude AI" (12px gray-500) · [Search apps…] input

**Category tabs:** `All | Document Generation | Planning | Analysis | Reporting | Advisory | Communication`

**Recently Used section** (top, above grid): Last 3 apps launched by this user as compact chips: `[Icon] BRD Maker →`

**My Favorites section** (below Recently Used): Apps the user has starred. Star icon appears on hover of any card.

**App Grid:** Responsive 3-column grid (2 on tablet, 1 on mobile).

## 3.3 App Card Design

```
┌────────────────────────────────────────────────────────┐
│  [Icon 32px]   BRD Maker                               │
│                ● Active  ·  Document Generation        │
│                                                        │
│  Create structured Business Requirements Documents     │
│  guided by AI. Pre-filled with your project data.      │
│                                                        │
│  ──────────────────────────────────────────────────    │
│  📁 Context: Project                                   │
│  ⚡ ~3 min per session   💰 ~$0.02 est. cost          │
│                                                        │
│             [Launch App →]                             │
└────────────────────────────────────────────────────────┘
```

Each card shows: icon · name (16px semibold) · Active/Disabled badge + category · description (2 lines max) · context type badge · estimated session time · estimated AI cost (informational only — never charged to the user) · Launch button.

Disabled apps: gray card with "Currently unavailable" overlay. Launch button replaced with "Unavailable."

---

# PART 4: APP LAUNCH EXPERIENCE AND ANIMATIONS

## 4.1 App Launch Animation Sequence

Every app launch plays this full sequence. It is not optional. Static launches are unacceptable.

**Step 1: Card Click Response (0–100ms)**
- Card scales up (transform: scale(1.02))
- Soft blue ripple radiates from the click point
- Button text changes to "Opening…" with a subtle spinner

**Step 2: Context Loading Overlay (100ms–600ms)**
- Full-screen overlay fades in (white, 95% opacity)
- App icon centered, 64px, gentle pulse animation
- App name below in 20px semibold
- Progress bar fills left to right (not a spinner — the bar signals real progress)
- Text beneath the bar cycles through what the agent is actually doing:
  - "Reading your project data…"
  - "Checking workload and timelines…"
  - "Preparing context…"
  (These are real steps — agent-context.builder is running and the messages reflect the actual auto_context_fields being fetched)

**Step 3: Overlay Exits (600ms)**
Overlay slides up off screen (transform: translateY(-100%), 400ms ease-in-out). App panel is revealed beneath.

**Step 4: App Panel Entrance**
- Step Navigator fades in (opacity 0→1, 300ms)
- First AI message types character by character (typewriter effect, ~30ms per character)
- Context card slides down into position (translateY(-20px)→0, 300ms)

## 4.2 App Panel Layout

The app opens as a full-page panel — full viewport takeover, not a modal:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back to AI Apps     BRD Maker  ·  AIMCO Implementation                   │
├─────────────────────────┬────────────────────────────────────────────────────┤
│  STEPS      (280px)     │  AI CHAT                                           │
│                         │                                                    │
│  1 ● Project Setup      │  ┌─────────────────────────────────────────────┐  │
│  2 ○ Deep Dive          │  │  System context auto-loaded:                │  │
│  3 ○ User Stories       │  │  📁 AIMCO Implementation · Build/Config     │  │
│  4 ○ Acceptance         │  │  👤 PM: Jillian Santos                      │  │
│  5 ○ Generate Draft     │  │  📊 Fit-Gap: 12 items loaded               │  │
│  6 ○ Finalize           │  └─────────────────────────────────────────────┘  │
│                         │                                                    │
│  ─────────────────────  │  Hello! I've loaded the AIMCO context. I can see  │
│  Session Cost           │  your fit-gap has 12 items — 3 customization gaps. │
│  ~$0.02 (Estimated)     │                                                    │
│                         │  Is this a new feature, enhancement, or           │
│  [Save Session]         │  customization?  [New Feature] [Enhancement]      │
│  [Exit]                 │  [Customization]                                   │
│                         │                                                    │
│                         │  ┌──────────────────────────────────────────────┐ │
│                         │  │  Type your message...              🎤  Send  │ │
│                         │  └──────────────────────────────────────────────┘ │
└─────────────────────────┴────────────────────────────────────────────────────┘
```

## 4.3 In-App Micro-Animations

- **Step completion:** Step dot draws a green checkmark (SVG stroke animation, 400ms)
- **AI typing:** Every AI response types character-by-character (20ms/char; never slower than 5 seconds total for any response)
- **User message send:** Message bubble slides up and fades in from the bottom
- **Structured output cards** (tables, timelines): Cards cascade in one by one with 50ms stagger between each
- **Save confirmation:** Green check slides in from top of panel: "✅ Saved to project" — stays 2 seconds, fades out
- **Context card hover:** Expands gently to show more detail (height transition, 200ms)

## 4.4 System-Wide UI Animations

These apply to all pages, not just AI Apps:

| Animation | Trigger | Spec |
|---|---|---|
| Page transition | Route change | Cross-fade (opacity 0→1, 200ms) |
| Tab switch | Tab click | Content slides from direction of selected tab, 200ms |
| Card hover | Mouse over any card | Box-shadow level-1 → level-2, 150ms |
| Milestone confetti | go_live milestone marked Done | 10 particles, 800ms |
| Feed event entrance | New event arrives | Slides down from top (translateY(-40px)→0, 300ms) |
| Workload bar fill | First render | Width 0% → actual%, 600ms ease-out |
| Notification bell shake | New notification arrives | Rotate -15°→15°→0°, 300ms |
| Modal open | Modal triggered | Scale 0.95→1.0 with fade-in, 200ms |
| Toast message | System event | Slide in from top-right (translateX(100%)→0, 250ms); auto-dismiss after 3s |

**Performance rule:** All animations must use CSS `transform` and `opacity` only. Never animate layout properties (width, height, margin, padding) where avoidable. No animation may block the main thread. All animations are automatically disabled when `prefers-reduced-motion: reduce` is detected in the user's OS settings.

---

# PART 5: APPS vs SKILLS — DISTINCTION AND DEFINITIONS

## 5.1 What is a Skill?

A **Skill** is a focused, reusable AI capability that does one specific thing. It is the building block. Skills can be used inside Apps, triggered from the Assistant chip picker, or called from workflow automations. A Skill has a CLAUDE.md instruction, a set of allowed Agent Data Tools, and an input/output contract. Skills are granular.

**A Skill is a verb.** Examples: "analyze fit-gap items," "schedule a meeting," "populate a task record."

## 5.2 What is an App?

An **App** is a structured, multi-step workflow experience built on top of one or more Skills. It has a Step Navigator, a guided conversation flow, a specific context entity type (project/client/etc.), and produces a saved output (document, record, recommendation). Apps are what team members launch from ✨ AI Apps. Apps are complete experiences.

**An App is a workflow.** Example: "Fit-Gap Analyzer" — a 5-step workflow that uses the fit-gap classification skill, reads project meeting transcripts, generates a structured analysis, and saves the result.

## 5.3 How They Relate

A skill can be used in three ways:
1. **Inside an App:** The App's CLAUDE.md references and uses the skill's capability as part of its multi-step flow
2. **In the AI Assistant:** The user activates a skill chip in the Assistant and the assistant's behavior is focused on that skill for the session
3. **In workflow automations:** A skill can be triggered automatically when a system event fires (e.g., "when an RFA is submitted, run the RFA Review skill")

An App can only be launched from the ✨ AI Apps page or from a task's linked AI app shortcut button (🤖). It cannot be triggered from the Assistant chip picker in the compact chat panel — but the user can select the App from the chip picker to run the same conversation inside the Assistant panel with an "Open full view →" option that expands to the full app panel.

---

# PART 6: ADMINISTRATION — APP BUILDER AND SKILLS BUILDER

## 6.1 Who Can Create Apps and Skills

Apps and Skills have separate creation permissions. A team member may be authorized to build Skills without being authorized to build full Apps — this is intentional. Skills are smaller in scope and lower in risk; they are a good entry point for team members who want to contribute AI capabilities without building a full multi-step workflow.

### App Creator Permission

**Default:** Only `super_admin` and `manager` roles can create Apps.

**Configurable:** Admin can grant "App Creator" permission to any individual user regardless of their role (System Settings → App Builder Permissions → "+ Grant App Creator").

When a user has App Creator permission:
- "⚙️ App Builder" appears in their personal nav (below AI Apps, above Assistant)
- They can publish as **Personal** (only they see it) or **Draft** (awaiting admin review before team publication)
- Admin must approve any draft before it can be published to the full team (`is_active = true`)
- They cannot edit system apps (`is_system_app = true`)

### Skill Creator Permission

**Default:** Only `super_admin` and `manager` roles can create Skills.

**Configurable:** Admin can grant "Skill Creator" permission to any individual user regardless of their role (System Settings → App Builder Permissions → "+ Grant Skill Creator"). This is a separate grant from App Creator — a user can have one, both, or neither.

When a user has Skill Creator permission:
- "⚙️ Skills Builder" appears in their personal nav (below AI Apps or App Builder if they also have that)
- They can publish as **Personal** (only they see it in their Assistant chip picker) or **Draft** (awaiting admin review)
- Admin must approve any skill before it can be published to the full team
- They cannot edit system skills (`is_system_skill = true`)

### Permission Grant Page

**Route:** `/admin/system-settings` → "App Builder Permissions" section

Shows a table of all users with their current App Creator and Skill Creator status:

| User | Role | App Creator | Skill Creator | Actions |
|---|---|---|---|---|
| Jillian Santos | Sr. BA | ✅ Granted | ✅ Granted | Revoke |
| Mark Reyes | Sr. BA | ⬜ Not granted | ✅ Granted | Grant App / Revoke Skill |
| Edhenn Cruz | Jr. BA | ⬜ Not granted | ⬜ Not granted | Grant App / Grant Skill |

"+  Grant" opens a confirmation dialog explaining what the permission allows and its scope (personal only until admin approval).

---

## 6.2 App Builder Page

**Route:** `/admin/app-builder` (also at `/app-builder` for App Creator users)

**AI-Assisted Creation:** The App Builder itself is AI-guided. A lightweight assistant panel at the top asks the creator to describe their app in plain language and suggests a configuration:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  App Builder                                                     [Save Draft] │
├──────────────────────────────────────────────────────────────────────────────┤
│  AI GUIDE: "What would you like your app to help with? Describe it          │
│  in plain language and I'll suggest a configuration."                        │
│                                                                              │
│  [I want an app that summarizes a client meeting and creates action items]  │
│                                                                              │
│  AI GUIDE: "Great — sounds like a document generation app with project      │
│  context. Suggested config:                                                  │
│  - Category: Document Generation · Context: Meeting                          │
│  - Tools: get_project, get_client, get_client_contacts                       │
│  - Steps: 1. Context review  2. Summary  3. Action items  4. Save           │
│  Want me to pre-fill the form?"          [Yes, pre-fill →]                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Form sections (order preserved on the page):**

1. **Basic Info:** Name · App Code (auto-slugified) · Description · Icon (emoji picker) · Category · Context Entity Type
2. **Access:** Required Roles (multi-select) · Publish scope: Personal / Draft / Team (Team = admin only)
3. **Data Access — Tools:** Checkbox list of all Agent Data Tools organized by category. Each tool shows name, return type, and an example use case.
4. **Auto-Context:** For each auto_context_field: Label · Tool · Tool params from context. "+ Add auto-context field" button.
5. **Steps:** Drag-to-reorder list. Each step: number · Title · Description. "+ Add Step" button.
6. **Token Budget:** `max_context_tokens` slider (1,000–50,000; default 8,000).
7. **CLAUDE.md Instruction:** Full-height rich text editor with prompt syntax highlighting. "✨ Generate CLAUDE.md" button drafts the instruction based on everything filled above. Creator edits freely. Side panel shows version history.
8. **Voice Input:** Toggle — "Users can dictate their messages to this app using voice."
9. **Test:** "▶ Test with real data" — search and select a real project/client/user record; simulation pane shows exactly what context was assembled and what the AI produces.

---

## 6.3 Skills Builder Page

**Route:** `/admin/skills-builder` (also at `/skills-builder` for Skill Creator users)

A Skill is a focused, single-purpose AI capability — it does one specific thing well. Unlike an App (which has multiple conversation steps and a complex workflow), a Skill is invoked in a single interaction: it receives inputs, does its work, and returns an output. Skills are the building blocks that power the AI Assistant chip picker, can be embedded inside Apps, and can be triggered by workflow automations.

Building a Skill does not require knowing how to write code or AI prompts from scratch. The Skills Builder is fully AI-guided — the AI assistant walks the creator through every configuration decision via chat, explains what each field means in plain language, and generates the CLAUDE.md instruction automatically.

### Access

The Skills Builder is available to:
- `super_admin` and `manager` (always)
- Any user granted "Skill Creator" permission by an admin

### Page Layout — Two Panels Side by Side

The Skills Builder uses a two-panel layout that keeps the AI guide always visible alongside the form:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Skills Builder                                        [Save Draft]  [Publish]│
├─────────────────────────────────┬──────────────────────────────────────────── │
│  SKILL FORM (left, 55%)         │  AI GUIDE (right, 45%)                      │
│                                 │                                              │
│  Name: ________________________ │  "Hello! I'll help you build this skill.     │
│  Code: ________________________ │                                              │
│  Description: _________________ │  Tell me in plain language: what do you      │
│  Category: [dropdown]           │  want this skill to do? Don't worry about    │
│  Icon: [emoji]                  │  technical details — just describe the        │
│                                 │  capability you have in mind."               │
│  Input Contract                 │                                              │
│  [+ Add input field]            │  [I want a skill that checks if a            │
│                                 │   client has had a face-to-face meeting      │
│  Output Contract: _____________ │   this year and flags accounts that          │
│                                 │   haven't]                                   │
│  Allowed Tools                  │                                              │
│  [checkboxes]                   │  "Great. Here's what I suggest:             │
│                                 │   - Category: Reporting                      │
│  CLAUDE.md                      │   - Input: client_id (or scope: all)         │
│  [text editor]                  │   - Output: list of clients + flag           │
│                                 │   - Tools: get_client, get_client_contacts,  │
│  Voice: [toggle]                │     get_client_courtesy_calls                │
│                                 │   - Voice: Yes (simple query)                │
│  [Test with real data ▶]        │                                              │
│                                 │   Want me to pre-fill the form and write    │
│                                 │   the CLAUDE.md?"   [Yes →]  [Adjust first] │
│                                 │                                              │
│                                 │  ──────────────────────────────────────────  │
│                                 │  [Type a question or describe your skill...] │
└─────────────────────────────────┴──────────────────────────────────────────── │
```

The AI Guide panel is a persistent chat. The creator can ask questions at any point, request changes, or have the AI explain any field. The form on the left updates in real time as the AI fills or adjusts fields.

### Form Fields

**1. Basic Info**
- **Skill Name:** Display name shown in the Assistant chip picker and Capabilities page (e.g., "F2F Compliance Checker")
- **Skill Code:** Auto-slugified from the name; unique identifier used in system references (e.g., `f2f-compliance-checker`)
- **Description:** One or two sentences for the chip picker and Capabilities page. The AI can write this.
- **Category:** Dropdown: `data_entry` / `scheduling` / `communication` / `reporting` / `analysis` / `document_generation` / `other`
- **Icon:** Emoji picker

**2. Input Contract**

Defines what information the skill needs to do its job. The AI guide explains: *"Think of this as: what does someone need to provide, or what context does the skill need to receive, in order to work?"*

Each input field has: Name · Type (text / number / date / uuid / boolean / list) · Description (plain language) · Required toggle.

The AI recommends inputs based on the skill description. For skills triggered from the Assistant with voice, inputs are collected conversationally — the Assistant asks for them in the chat. For skills triggered programmatically (from Apps or automations), inputs are passed as structured parameters.

**3. Output Contract**

What does this skill return? Options (selectable from dropdown, not code):
- A text answer / summary
- A list of records with details
- A structured data object (for use in automations or Apps)
- A created or updated record in the system
- A generated document (Google Doc or PPTX)

**4. Allowed Tools**

Checkbox list of all Agent Data Tools, organized by category. Each tool shows:
- Name
- What it returns (plain language, not JSON schemas)
- An example: "e.g., use this to check a client's courtesy call history"

The AI Guide proactively suggests which tools this skill needs based on the description. Unchecked tools are completely inaccessible to this skill at runtime — enforced by the agent-tool.registry.ts, not just the prompt.

**5. Example Prompts** (required, minimum 4)

Phrases the user can literally type or say to invoke this skill in the Assistant. These populate the Capabilities page automatically and are used as few-shot examples in the CLAUDE.md. The AI Guide generates these from the skill description. Creator can edit or add more.

**6. CLAUDE.md Instruction**

Full-height editor with syntax highlighting. The AI Guide generates a complete draft based on everything configured above.

The editor has three modes, togglable at the top:
- **Edit mode:** Free text editing (for experienced users who want direct control)
- **Guided mode:** The AI chat can modify specific sections; creator describes what to change in plain language ("make the output more concise" / "add a rule that it never shows internal KPI data to clients") and the AI updates the CLAUDE.md accordingly
- **Preview mode:** Renders the CLAUDE.md as a formatted, human-readable document for final review

Version history is shown in a collapsible side panel: every saved version with a timestamp and diff view.

**7. Voice Input Toggle**

"This skill can be triggered via voice dictation in the AI Assistant." When enabled: the skill appears in the Assistant's voice-activated shortcut list and the Capabilities page marks it with a Voice badge.

**8. Test with Real Data**

Before publishing, the creator must test the skill:
- Search and select a real record (project / client / user) as the test context
- Type or speak a test instruction (e.g., "Check if AIMCO has had a face-to-face meeting this year")
- The simulation pane shows:
  - Which tools were called and what they returned
  - The full CLAUDE.md that was sent to the AI
  - The AI's raw response
  - The parsed output against the Output Contract
- If the output doesn't match expectations, the creator adjusts via the AI Guide and re-tests

**The Test button is always enabled** — it can be run at any point in the process, not just at the end. This allows iterative testing while building.

### AI Guide Capabilities

The AI Guide in the Skills Builder knows:
- Every Agent Data Tool: what it does, what it returns, when to use it
- The full CST OS data model: every module, every table, every field
- The system's Skill conventions and patterns (from reading all existing system skills)
- CLAUDE.md best practices: how to write clear instructions, how to handle edge cases, how to format outputs

**What the AI Guide can do in conversation:**
- Generate the full skill configuration from a plain-language description
- Explain any field in plain language: "What is the Input Contract?" → clear explanation
- Suggest which tools are needed: "You'll need get_client and get_client_courtesy_calls for this"
- Write and refine the CLAUDE.md: "Make it also check if the meeting was internal or external" → updates the instruction
- Write example prompts: "Give me 6 example phrases for this skill" → generates them
- Warn about issues: "This skill is trying to access KPI scores — are you sure you want to show that to all users? You might want to restrict it to supervisor+ roles"
- Explain existing system skills as references: "How is the Smart Query skill structured?" → shows the pattern

**What the AI Guide explicitly does NOT do:**
- It does not publish the skill — the creator always controls publishing
- It does not grant access permissions — those are set by the admin
- It does not run code — all tool calls in the test are real read-only database queries, not simulations of simulations

### Publish Flow

1. Creator builds and tests the skill
2. Creator clicks "Save Draft" at any point — draft is saved and accessible only to them
3. When ready: "Publish" button opens a dialog:
   - Scope: **Personal** (only this user's Assistant chip picker) or **Draft for Team** (admin review required)
   - Publish scope defaults to Personal for non-admin users
4. For Team publication: admin receives a review notification — "New skill submitted for team publication: [name]" — with a link to review, test with their own data, and approve or reject with notes
5. On approval: `is_active = true`; skill appears in all team members' Assistant chip pickers and Capabilities page

### Skills Builder in the Personal Nav

For users with Skill Creator permission, the nav shows:

```
─── PERSONAL ──────────────────────────────────
🏠  Home
✅  Tasks
📅  Calendar
✨  AI Apps
⚙️  Skills Builder   ← visible only with Skill Creator permission
💬  Assistant & Chat
```

The Skills Builder in the personal nav has the exact same interface as the admin route — only the publish scope defaults differ (Personal instead of Team).

---

## 6.4 Template Library

### Purpose

The Template Library is where admins upload and manage the document templates used by AI-powered generation skills and apps. Every time a skill generates a PowerPoint deck or a Google Doc, it uses a template from this library as the structural and visual foundation.

Templates are not just files — they are tagged with their intended use, their associated app or skill, and their version. When a new template is uploaded and activated, all future document generation uses the new template. Historical documents keep a reference to the template version that was used to create them.

### Template Types

| Type | Format | Used By | Notes |
|---|---|---|---|
| `pptx_recommendation` | `.pptx` | Recommendation Deck Generator App · PowerPoint Generator Skill | The branded recommendation deck layout |
| `pptx_training` | `.pptx` | Training Deck Generator App · PowerPoint Generator Skill | The branded training deck layout |
| `pptx_proposal` | `.pptx` | Proposal Maker App · PowerPoint Generator Skill | The branded proposal layout |
| `pptx_mom` | `.pptx` | Meeting MOM Generator App (PPTX variant) | Optional — for teams that present MOMs as slides |
| `pptx_general` | `.pptx` | PowerPoint Generator Skill (fallback) | Generic branded layout for any deck not covered by a specific type |
| `gdoc_brd` | Google Doc (template ID) | BRD Maker App | BRD document structure and formatting |
| `gdoc_mom` | Google Doc (template ID) | Meeting MOM Generator App | MOM document structure |
| `gdoc_proposal` | Google Doc (template ID) | Proposal Maker App | Proposal document structure |
| `gdoc_kyc` | Google Doc (template ID) | KYC Form Generator App | KYC document structure |
| `gdoc_uat` | Google Doc (template ID) | UAT Document Generator App | UAT document structure |
| `gdoc_handover` | Google Doc (template ID) | Turnover Handover Document App | Handover document structure |
| `gdoc_general` | Google Doc (template ID) | Google Docs Generator Skill (fallback) | Generic branded document |

### `document_templates` Table

| Field | Type | Required | Description |
|---|---|---|---|
| `template_id` | UUID | YES | PK |
| `template_type` | enum | YES | All types listed above |
| `name` | string | YES | Display name e.g., "MobileOptima Recommendation Deck v3" |
| `version_number` | integer | YES | Auto-incremented per template_type |
| `version_label` | string | YES | e.g., "v3.0 — Updated brand colors Feb 2026" |
| `format` | enum | YES | `pptx`, `google_doc` |
| `file_url` | string | | For PPTX: Cloud Storage URL of the `.pptx` template file |
| `google_doc_template_id` | string | | For Google Docs: the Drive ID of the template document (must be accessible by the service account) |
| `google_doc_template_url` | string | | Human-readable link for admin reference |
| `thumbnail_url` | string | | Preview image of the template (first slide for PPTX, first page preview for Docs) |
| `is_active` | boolean | YES | Only one active template per template_type at a time; activating a new version deactivates the previous |
| `notes` | text | | Usage notes for this template (e.g., "Use for Enterprise clients only") |
| `change_summary` | text | | What changed from the previous version |
| `uploaded_by_id` | UUID | YES | FK → users |
| `activated_at` | timestamp | | When this template was set as active |
| `activated_by_id` | UUID | | FK → users |
| `created_at` | timestamp | YES | Auto |
| `updated_at` | timestamp | YES | Auto |
| `deleted_at` | timestamp | | Soft delete |

### Template Library Page

**Route:** `/admin/template-library`

**Layout:** Tabs across the top by format: `All | PowerPoint | Google Docs`

Within each tab: sections grouped by template_type. Each section shows the active template and a version history list.

**Active template card:**
```
┌────────────────────────────────────────────────────────────────────┐
│  [Thumbnail]   MobileOptima Recommendation Deck v3               │
│                ✅ Active · pptx_recommendation · v3.0             │
│                Uploaded Feb 5, 2026 by Admin                     │
│                "Updated brand colors and new section layout"      │
│                                                                    │
│  [Preview]  [Download]  [Upload New Version]  [Deactivate]       │
└────────────────────────────────────────────────────────────────────┘
```

**Version history table** (below each active card):

| Version | Label | Status | Uploaded By | Date | Actions |
|---|---|---|---|---|---|
| v3.0 | Updated brand colors | ✅ Active | Admin | Feb 5, 2026 | Preview · Download |
| v2.1 | Minor text fixes | Superseded | Jillian | Jan 3, 2026 | Preview · Download · Restore |
| v2.0 | Full redesign | Superseded | Admin | Jun 10, 2025 | Preview · Download · Restore |

"Upload New Version" opens a form: file upload (drag-and-drop) · version label · change summary. On save, the new version becomes active automatically and the previous version becomes superseded. All future document generation uses the new template immediately. Historical records keep a `template_id` reference to the version that was used when they were generated.

**PPTX templates:** Upload a `.pptx` file. The system stores it in Cloud Storage. When generating a deck, the PowerPoint Generator Skill reads this file and uses it as the structural base — populating placeholders, inserting slides, applying brand styling.

**Google Doc templates:** The admin provides the Google Drive template document ID (the template must already exist in the shared MobileOptima Drive and be accessible by the system service account). The system stores the template ID. When generating a document, the Google Docs Generator Skill creates a copy of the template document and fills in the content.

### Template Knowledge Files

Each template type can have an associated **Knowledge File** — a structured text document that the AI skill reads when generating output using that template. The knowledge file tells the AI about the template's layout, sections, and any style rules.

Knowledge files are plain text (Markdown format) stored in the `document_templates.notes` field or as a separate rich text attachment on the template record. They are injected into the skill's prompt context alongside the template itself.

**Example knowledge file for `pptx_recommendation`:**

```
RECOMMENDATION DECK TEMPLATE — LAYOUT GUIDE

This template has 15 slide placeholders in this order:
1. Cover slide — fields: client_name, project_name, presenter_name, date
2. Agenda — fields: agenda_items[] (auto-populated from section headings)
3. Understanding Your Business — fields: business_summary, key_challenges[]
4. Current Challenges — fields: pain_points[] (from fit-gap analysis)
5. Proposed Solution Overview — fields: solution_summary, platforms_involved[]
6. Scope In-Scope / Out-of-Scope — fields: in_scope[], out_of_scope[]
7. Tarkie Feature Map — fields: features_table[]
8. Gap Analysis Summary — fields: gaps_table[]
9. Customization Requests — fields: customizations_table[] (or "None" if empty)
10. Implementation Timeline — fields: phases_table[]
11. Key Milestones — fields: milestones[]
12. Team Composition — fields: cst_team[], client_team_required[]
13. Client Deliverables — fields: client_deliverables[]
14. Next Steps — fields: next_steps[]
15. Q&A — no dynamic fields

STYLE RULES:
- Primary color: #2162F9 (blue-500). Use for headings and accent elements.
- Client name must appear on the Cover slide and the Scope slide.
- Never leave a placeholder empty. If a section has no content, use "N/A" or omit the slide entirely (for slide 9 — Customizations — if there are none).
- Table font size: 11pt. Body text: 12pt. Headings: 18pt.
- Max 6 bullet points per slide. If more are needed, split into two slides.
- Speaker notes: include on every slide for the presenter.
```

**Example knowledge file for `gdoc_brd`:**

```
BRD GOOGLE DOC TEMPLATE — SECTION GUIDE

The BRD template has the following named bookmarks. The system will
populate each bookmark with the corresponding BRD content field:

{{executive_summary}} — 2–3 paragraphs
{{project_background}} — narrative paragraph
{{objectives}} — bulleted list
{{scope_in_scope}} — bulleted list
{{scope_out_of_scope}} — bulleted list
{{stakeholders_table}} — table: Role | Name | Platform
{{current_process}} — narrative + Mermaid sequenceDiagram (rendered as image)
{{proposed_solution}} — narrative + Mermaid sequenceDiagram
{{fit_gap_table}} — table: Process Area | Current State | Capability | Gap | Recommendation | Type | Priority
{{functional_requirements_field_app}} — table: Req ID | Description | Priority
{{functional_requirements_dashboard}} — same table format
{{functional_requirements_manager_app}} — same table format
{{user_stories_by_role}} — table: Role | Story | Acceptance
{{acceptance_criteria}} — table: Platform | Criterion | Pass Condition
{{standardization_notes}} — paragraph
{{client_nuances}} — paragraph
{{priority_summary_high}} — bulleted list
{{priority_summary_nicetohaove}} — bulleted list
{{approval_prepared_by}}, {{approval_reviewed_by}}, {{approval_approved_by}}, {{approval_date}}

STYLE RULES:
- Heading 1: Section titles (18pt, blue-500, bold)
- Heading 2: Sub-section titles (14pt, gray-800, bold)
- Body: 11pt, gray-800
- Tables: header row in blue-500 background, white text; alternating row shading
- Client company name appears in the document title and the cover section
- Document footer: "Confidential — MobileOptima / [Client Name]"
- Page numbering: bottom right, format "Page X of Y"
```

---

# PART 7: PRE-LOADED SKILLS WITH CLAUDE.MD INSTRUCTIONS

The following 5 skills are seeded at system initialization. All are available in the AI Assistant chip picker and can be used in App configurations. Each has `is_system_skill: true` and cannot be deleted.

---

## Skill 1: System Record Populator

**Code:** `system-record-populator` · **Category:** `data_entry` · **Voice:** Yes

**Description:** Fill any system record by describing what you want in natural language. The skill knows every module, every field, and every relationship in the system.

### CLAUDE.md

```
ROLE

You are a data entry assistant for the CST OS. When the user describes what
they want to create or update, you identify the correct module, map their
description to the correct fields, confirm the intended values, and populate
the record.

You know the complete data model: users, clients, projects, milestones, tasks,
meetings, RFAs, BRDs, time logs, contacts, KYC records, courtesy calls, and
all their fields and relationships.

BEHAVIOR RULES

- Confirm before saving: always show the user a summary before committing.
  Exception: for simple single-field updates, confirm inline.
- Ask for missing required fields specifically — never guess them.
- Infer from context: if the user says "add a task to the AIMCO project",
  you know the project_id from context. Do not ask for it.
- Resolve ambiguity: if "AIMCO" matches multiple records, list them and ask.
- Use UI field labels in confirmations — not database column names
  (e.g., "End Date" not "end_date").

SUPPORTED ACTIONS

CREATE: tasks, subtasks, time log entries, meetings, RFAs, contacts,
        courtesy call notes, project notes, BRD comments
UPDATE: task status, assignee, end date, estimated hours, meeting status,
        project phase, client notes, contact details
QUERY: "what tasks do I have today?", "show me open RFAs for AIMCO",
       "what is the health score for FH Commercial?"

EXAMPLE FLOW

User: "Add a subtask to masterdata validation on AIMCO called 'prepare field
       mapping document', assign to me, due Friday, 2 hours"

You: "Creating subtask:
     → Title: Prepare field mapping document
     → Parent: Masterdata Validation (AIMCO Implementation)
     → Assigned to: [current user]
     → End Date: Friday, Feb 21, 2026
     → Est. Hours: 2h
     Confirm? [Create] [Edit]"
```

---

## Skill 2: Calendar & Meeting Scheduler

**Code:** `calendar-meeting-scheduler` · **Category:** `scheduling` · **Voice:** Yes

**Description:** Check availability, schedule meetings, create Zoom links, and set reminders through conversation.

### CLAUDE.md

```
ROLE

You are a scheduling assistant. You can check calendar availability, create
meeting records, generate Zoom links, and send invitations — all through
conversation.

You have access to: the user's calendar, all team members' calendars, all
meeting records, Philippine public holidays, and the Zoom API.

BEHAVIOR RULES

- Always check conflicts before confirming a meeting time
- For external meetings: check the client contact list for participant emails
- Propose alternatives if the requested time conflicts
- Always confirm full meeting details before creating the record
- After creating: offer to send invitations to all participants

CONFLICT CHECKING

When checking a time slot:
1. Read the requesting user's calendar (get_user_workload)
2. Read all specified attendees' calendars
3. Check Philippine public holidays
4. Check if it is a weekend
5. Report: available / conflicts with [what]

EXAMPLE FLOW

User: "Can you check if I can set a meeting on March 25 at 2pm with Mark
       and RD from AIMCO?"

You: [reads calendars]
"March 25, 2:00 PM:
 ✅ You: Available
 ✅ Mark Reyes: Available
 ✅ RD Llarena (AIMCO): No known conflicts
 ✅ Not a holiday

 Shall I schedule this? Tell me: meeting type, duration, Zoom or in-person?"

User: "UAT Walkthrough, 2 hours, Zoom."

You: "Creating:
     → Title: UAT Walkthrough — AIMCO Implementation
     → Type: uat_walkthrough · Date: March 25, 2:00 PM · 2 hours · Zoom
     → Participants: [You], Mark Reyes, RD Llarena (AIMCO)
     → Zoom meeting: auto-created via API
     Confirm? [Create & Send Invites] [Edit]"
```

---

## Skill 3: Team Coordination Messenger

**Code:** `team-coordination-messenger` · **Category:** `communication` · **Voice:** Yes

**Description:** Send structured coordination messages to team members — task assignments, support requests, meeting confirmations — through natural language.

### CLAUDE.md

```
ROLE

You are a team coordination assistant. You help the user send structured,
professional coordination messages to other team members via Team Chat or
in-app notification. You compose the message, identify recipient(s) from the
system, and send only after confirmation.

BEHAVIOR RULES

- Always confirm message content and recipients before sending
- Resolve names to system users: "Jillian" → Jillian Santos (user_id)
- If the coordination implies a task, offer to create a task record alongside
- For significant support requests, offer to create an RFA
- Draft in professional but direct tone

EXAMPLE FLOW

User: "Tell Jillian there's a support request from AIMCO for the Manager App
       dashboard — please handle it at 10 AM tomorrow."

You: "Draft message to Jillian Santos:

     '📌 Support Request — AIMCO
      Hi Jillian, there is a support request from AIMCO regarding their
      Manager App dashboard. Please attend to this tomorrow at 10:00 AM.
      Account: AIMCO Corp · Type: Technical Support
      Please confirm receipt.'

     Options: [Send via Chat] [Send as Notification] [Also create a task]"
```

---

## Skill 4: Smart Query & Report

**Code:** `smart-query-report` · **Category:** `reporting` · **Voice:** Yes

**Description:** Ask any question about your projects, accounts, team, or performance and get an instant, data-accurate answer.

### CLAUDE.md

```
ROLE

You are a data query assistant with read access to the full CST OS data model.
When the user asks a question, you fetch the relevant records and present a
clear, useful answer. You do not make up data — you only report what the system
actually contains. If data is not available, say so clearly.

EXAMPLE QUERIES

"What's my schedule for today?"
→ get_user_workload for today + meetings where user is participant

"How many overdue tasks does my team have?"
→ get_exception_report scoped to supervisor's direct reports

"What's the health score for FH Commercial?"
→ get_client → return health_score + top 2 signals driving it

"Who is the least loaded team member this week?"
→ get_team_workload_summary → rank by utilization % ascending

"What milestones are due this month across all projects?"
→ get_project_milestones where due_date in current month → group by project

BEHAVIOR RULES

- Present answers in a scannable format (table or bullets, not paragraphs)
- For counts: show the number prominently, offer to list details
- For lists: show max 5 items by default, "Show all [N]" link for more
- Always state the time scope: "As of today, Feb 18, 2026"
- Offer follow-up actions: "Would you like to open the overdue task list?"
```

---

## Skill 5: Email Sender

**Code:** `email-sender` · **Category:** `communication` · **Voice:** Yes

**Description:** Compose and send emails to clients or team members directly from the AI Assistant. The AI drafts the email, shows it for review, and sends only after explicit confirmation.

**Allowed Tools:** `get_client` · `get_client_contacts` · `get_project` · `get_project_milestones` · `send_email`

**New Agent Tool: `send_email`**

| Parameter | Type | Description |
|---|---|---|
| `to` | string[] | Recipient email addresses |
| `cc` | string[] | CC addresses |
| `bcc` | string[] | BCC addresses |
| `subject` | string | Subject line |
| `body_html` | string | Email body in HTML |
| `body_text` | string | Plain text fallback |
| `from_name` | string | Sender display name; defaults to current user's full name |
| `reply_to` | string | Defaults to sender's email |
| `attachments` | JSONB | [{filename, google_drive_url, mime_type}] — Drive links only |
| `linked_client_id` | UUID | FK → clients; auto-logs in client comms log |
| `linked_project_id` | UUID | FK → projects; auto-logs in project comms log |
| `script_template_id` | UUID | Optional; records which template was used |

Every email sent via this tool is automatically logged in `comms_log` with `sent_by = current_user`, `direction = outbound`, and linked client/project references.

### CLAUDE.md

```
ROLE

You are an Email Drafting Assistant in the CST OS. When the user asks you to
send an email, you: (1) identify the correct recipient(s), (2) draft a
professional email, (3) show the complete draft for user review, and (4) send
ONLY after explicit user confirmation. You never auto-send.

You write on behalf of the logged-in user. The email is sent from their
address and signed with their name.

RECIPIENT RESOLUTION

- "Send to RD at AIMCO" → get_client_contacts(AIMCO) → find RD Llarena →
  use contact.email
- "Send to Jillian" → look up users where name matches → use user.email
- "Send to the AIMCO team" → get_client_contacts(AIMCO) → present list,
  ask which contacts to include
- Multiple matches → list options, ask user to clarify
- No match → ask user for the email address directly

EMAIL STYLE RULES

- Professional but warm tone — represent MobileOptima well
- Subject: clear and specific; never vague like "Update" or "Hi"
- Salutation: "Hi [First Name]," — never "Dear Sir/Madam"
- Closing: "Best regards, [User Full Name] | [Role] | MobileOptima"
- Concise body — bullet points for lists of items
- Never include internal system data (KPI scores, workload %, health scores)
  in client-facing emails

ALWAYS SHOW THE DRAFT BEFORE SENDING

────────────────────────────────────────────
To: RD Llarena <rd.llarena@aimco.com>
CC: [none]
Subject: UAT Schedule Confirmation — AIMCO Implementation

Hi RD,

I hope you're doing well. I'm writing to confirm the upcoming UAT session.

UAT Session Details:
• Date: March 25, 2026
• Time: 2:00 PM – 4:00 PM
• Platform: Zoom (link to follow)
• Attendees: Jillian Santos (CST), RD Llarena (AIMCO)

Please let us know if this works for your team. We will send
the Zoom link 24 hours before the session.

Best regards,
Jillian Santos | Senior Business Analyst | MobileOptima
────────────────────────────────────────────

[Send Email]  [Edit]  [Cancel]

AFTER SENDING

Confirm: who it was sent to, that it was logged in the comms record.
Offer: "Would you like me to create a follow-up task to check for
RD's response by [3 days from now]?"
```

---

## Skill 6: PowerPoint Generator

**Code:** `powerpoint-generator` · **Category:** `document_generation` · **Voice:** No

**Feasibility:** Fully feasible. The tech stack already includes `pptxgenjs` — the same library used by the Recommendation Deck Generator and Training Deck Generator apps. This skill makes that generation capability available as a standalone, reusable building block that any App or workflow can call.

**Description:** Generate a branded PowerPoint presentation using the active template for the specified deck type. The skill reads the relevant template from the Template Library, reads the knowledge file for that template (slide layout, placeholders, style rules), and populates the deck with the provided content.

**Allowed Tools:** `get_project` · `get_client` · `get_project_brd` · `get_project_fit_gap` · `get_project_timeline` · `get_project_milestones` · `get_knowledge_base_articles` · `get_active_template` (new tool — returns the active `document_templates` record for a given template_type, including the knowledge file content)

**New Agent Tool: `get_active_template`**

| Parameter | Type | Description |
|---|---|---|
| `template_type` | enum | One of the template types from the Template Library |

Returns: `{template_id, name, format, file_url, google_doc_template_id, knowledge_file_content, version_label}`

**New Agent Tool: `generate_pptx`**

| Parameter | Type | Description |
|---|---|---|
| `template_type` | enum | Which PPTX template to use |
| `slide_data` | JSONB | Content for each slide placeholder, keyed by placeholder name from the knowledge file |
| `output_filename` | string | e.g., "AIMCO Recommendation Deck v1.pptx" |
| `linked_project_id` | UUID | FK → projects; the generated file is stored and linked here |
| `linked_client_id` | UUID | FK → clients |

Returns: `{file_url, filename}` — a Cloud Storage URL to the generated `.pptx` file.

### CLAUDE.md

```
ROLE

You are a PowerPoint Generation Specialist AI. Your job is to create
professional, branded PowerPoint presentations by reading the active template
from the Template Library, understanding its slide layout from the knowledge
file, and populating it with content from the system or from user input.

BEHAVIOR RULES

- Always read the knowledge file for the selected template type before
  generating. The knowledge file defines exactly which slide placeholders
  exist, what content goes in each, and the style rules to follow.
- Never exceed the bullet point limits defined in the knowledge file.
- The template file defines visual layout — you define the content.
- If a content section is empty (e.g., no customizations to show),
  either use "N/A" or omit the slide as the knowledge file instructs.
- Show a content outline to the user before generating the full deck:
  "Here is what each slide will contain — confirm before I generate."
- After generating, offer to open the file and/or share via Google Drive.

GENERATION PROCESS

1. Read the template knowledge file for the requested deck type
2. Read all relevant system data (project, client, BRD, timeline, etc.)
3. Map system data to slide placeholders as defined in the knowledge file
4. Identify any gaps: "Slide 9 (Customizations) — no RFAs found; will omit this slide"
5. Ask user to confirm or provide missing content
6. Call generate_pptx with the complete slide_data
7. Return download link: "✅ PPTX generated: [filename] [Download ↓]"

TEMPLATE TYPES YOU CAN GENERATE

- pptx_recommendation: Recommendation Deck (15 slides)
- pptx_training: Training Deck (admin and user training)
- pptx_proposal: Proposal Deck
- pptx_mom: MOM as slides (optional variant)
- pptx_general: Any other branded deck

FALLBACK

If no active template exists for the requested type:
"No template is configured for [type]. Please ask your admin to upload
one in Administration → Template Library."
```

---

## Skill 7: Google Docs Generator

**Code:** `google-docs-generator` · **Category:** `document_generation` · **Voice:** No

**Feasibility:** Fully feasible. The system already has Google Docs API integration used by the BRD Maker, MOM Generator, and KYC App. This skill makes the same Google Docs generation capability available as a standalone, reusable building block.

**How it works:** The skill reads the active Google Doc template for the requested document type from the Template Library. It then creates a copy of that template document in the client's project folder in Google Drive and populates the template's named bookmarks with content. The resulting document URL is stored on the relevant system record and a "Open in Google Docs ↗" link is shown to the user.

**Allowed Tools:** `get_project` · `get_client` · `get_client_contacts` · `get_project_brd` · `get_project_fit_gap` · `get_project_milestones` · `get_project_timeline` · `get_kyc_records` · `get_knowledge_base_articles` · `get_active_template` · `create_google_doc_from_template` (new tool)

**New Agent Tool: `create_google_doc_from_template`**

| Parameter | Type | Description |
|---|---|---|
| `template_type` | enum | Which Google Doc template to use |
| `document_title` | string | Name for the new document |
| `content_fields` | JSONB | Content for each bookmark, keyed by bookmark name from the knowledge file |
| `destination_folder_id` | string | Google Drive folder ID where the document will be created |
| `share_with` | string[] | Email addresses to share the document with (view access) |
| `linked_project_id` | UUID | FK → projects |
| `linked_client_id` | UUID | FK → clients |

Returns: `{google_doc_id, google_doc_url, document_title}` — stored on the relevant system record.

### CLAUDE.md

```
ROLE

You are a Google Docs Generation Specialist AI. Your job is to create
professional, branded Google Docs by reading the active template from the
Template Library, understanding its bookmark structure from the knowledge
file, and populating it with content from the system or from user input.

BEHAVIOR RULES

- Always read the knowledge file for the selected template type first.
  The knowledge file defines exactly which bookmarks exist and what
  content format each expects.
- Read all available system data before asking the user for anything.
  Only ask for information the system does not already have.
- Show a content summary before creating the document:
  "Here is what each section will contain — confirm before I create."
- After creating, provide the Google Docs link and store the doc_id
  on the relevant record in the system.
- Offer to share the document with client contacts.

GENERATION PROCESS

1. Read the template knowledge file for the requested document type
2. Read all relevant system data (project, client, BRD, fit-gap, etc.)
3. Map system data to template bookmarks as defined in the knowledge file
4. Identify any bookmarks with no data: ask user to provide or confirm
   using "N/A" or a placeholder
5. Show a section-by-section summary to the user for confirmation
6. Call create_google_doc_from_template with the complete content_fields
7. Store the google_doc_id and google_doc_url on the linked record
8. Return the link: "✅ Document created: [title] [Open in Google Docs ↗]"
   and offer to share with selected contacts

TEMPLATE TYPES YOU CAN GENERATE

- gdoc_brd: Business Requirements Document
- gdoc_mom: Minutes of Meeting
- gdoc_proposal: Proposal Document
- gdoc_kyc: Know Your Client Profile
- gdoc_uat: UAT Document
- gdoc_handover: Turnover Handover Document
- gdoc_general: Any other branded document

FALLBACK

If no active template exists for the requested type:
"No Google Doc template is configured for [type]. Please ask your admin
to set one up in Administration → Template Library."
```

---

## App 16: Proposal Maker

**App Code:** `proposal-maker`  
**Category:** `document_generation`  
**Icon:** 📋  
**Context Entity:** `client`  
**Output:** Proposal document (Google Doc + optional PPTX) + `project_recommendations` record  
**Required Roles:** sr_business_analyst, supervisor, manager

**What it does:** Generates a formal commercial proposal for a prospective or existing client — covering the proposed solution, implementation scope, investment summary, timeline, and team. The proposal is generated from the active `gdoc_proposal` or `pptx_proposal` template in the Template Library, pre-filled with all available system data.

This is different from the Recommendation Deck Generator, which is a technical presentation to an existing client after fit-gap. The Proposal Maker is a commercial document targeted at decision-makers, often created during the pre-sales or expansion stage.

**Allowed Tools:** `get_client` · `get_client_contacts` · `get_project` · `get_client_projects` · `get_project_fit_gap` · `get_project_timeline` · `get_timeline_baseline` · `get_pipeline_accounts` · `get_knowledge_base_articles` · `get_past_brds` · `get_active_template` · `create_google_doc_from_template` · `generate_pptx`

**Auto-Context:** Client record · Client contacts (decision maker) · Active or projected timeline · Any existing fit-gap analysis · Pipeline record (if applicable)

**Steps:**
1. Context & Format — confirm client, scope, and whether to produce a Google Doc, PPTX, or both
2. Executive Summary — client background and business problem statement
3. Proposed Solution — what Tarkie will do for this client
4. Scope & Inclusions — what is covered, what is excluded
5. Investment & Timeline — pricing summary (if applicable), implementation phases and timeline
6. Why MobileOptima — team credentials, past success stories, support commitments
7. Generate & Save — produces the document(s) using the active proposal template(s)

### CLAUDE.md — Proposal Maker

```
ROLE AND MISSION

You are a Senior Commercial Proposal Writer AI for MobileOptima. Your job
is to create compelling, professional proposals that convince client
decision-makers to move forward with a Tarkie implementation. You combine
business understanding, Tarkie's value proposition, and the specific context
of this client's challenges to create proposals that are both persuasive
and honest.

You generate proposals in two formats depending on what the user needs:
- Google Doc: for formal document proposals (using gdoc_proposal template)
- PowerPoint: for presentation-style proposals (using pptx_proposal template)
- Both: when the client needs a comprehensive proposal package

PROPOSAL STRUCTURE

SECTION 1: COVER
- Client company name + logo placement note
- "Proposal for Tarkie Implementation"
- Prepared by: [PM/BA Name], [Role], MobileOptima
- Date
- Confidentiality notice

SECTION 2: EXECUTIVE SUMMARY
- Client background (2–3 sentences from KYC/system data)
- The core problem this proposal addresses
- What MobileOptima proposes to do
- High-level expected outcome
(Max 1 page)

SECTION 3: UNDERSTANDING OF YOUR BUSINESS
- Industry and business size (from client record)
- Current operational challenges (from fit-gap / meeting transcripts / KYC)
- What success looks like for this client

SECTION 4: PROPOSED SOLUTION
- Which Tarkie platforms are included (Field App / Dashboard / Manager App)
- Key features and capabilities for this client
- How each challenge identified in Section 3 is addressed
- What is out of scope (important for managing expectations)

SECTION 5: IMPLEMENTATION APPROACH
- Project phases (from timeline baseline or active timeline)
- Estimated timeline: start → go-live
- Team composition: CST team members + what the client team must contribute
- Key milestones and what they mean for the client

SECTION 6: INVESTMENT SUMMARY
If pricing is available:
- Implementation fee
- Monthly subscription
- Optional customization items with indicative costs
If pricing is NOT available:
- "Investment details will be provided in a separate commercial agreement"
- Focus on timeline and scope clarity

SECTION 7: WHY MOBILEOPTIUMA
- Team credentials and experience
- Past similar implementations (anonymized if needed)
- Support commitments (SLA, hypercare, BAU)
- Contact: [PM/BA name and email]

SECTION 8: NEXT STEPS
- "To proceed, please: [step 1], [step 2], [step 3]"
- Proposal validity period: "This proposal is valid for 30 days from [date]"

BEHAVIOR RULES

- Read all available client data from the system before asking anything
- Only ask for information the system genuinely does not have
  (e.g., pricing, specific customization items, proposal validity dates)
- Never invent client company details, revenue, or industry claims
- Timeline estimates must come from the active template baseline norms —
  never estimate from memory
- The proposal must be readable by a non-technical CEO or CFO
  (no system jargon, no internal terminology)
- If pricing information is sensitive, instruct the user to fill in the
  Investment section manually after document creation
- After generating: always offer to share with the decision_maker contact

STEP 1 — CONTEXT & FORMAT

System has auto-loaded: client record, contacts, any existing projects,
fit-gap analysis, timeline data. Confirm, then collect:

1.1  Proposal format: Google Doc / PowerPoint / Both?
1.2  Is this a new client (acquisition) or existing client expansion?
1.3  What is the specific opportunity? (new NCI, customization, expansion)
1.4  Should investment / pricing be included? If yes, provide pricing details.
1.5  Proposal validity: 30 days from today? Or different?
1.6  Any specific strengths or past successes to highlight?

STEPS 2–6 — CONTENT COLLECTION

For each section, present what the system already knows and ask the user
to confirm or add details. Use system data wherever possible.

STEP 7 — GENERATE

Generate using the active proposal template from the Template Library.
If generating Google Doc: use gdoc_proposal template via create_google_doc_from_template.
If generating PPTX: use pptx_proposal template via generate_pptx.
If both: generate Doc first, then PPTX from the same content.

Save the document(s) as a project_recommendations record linked to this client.
Offer to share with the decision_maker contact.
```

---

# PART 8: ASSISTANT & CHAT

## 8.1 Cost Analysis

| Component | Monthly Cost (10-person team) | Notes |
|---|---|---|
| Team Chat infrastructure | ~$0 | Socket.io already in stack; PostgreSQL already in use; Firebase push notifications free up to 1M/month |
| AI Assistant (Claude calls) | ~$12–40 | Depends on usage intensity; 3–10 sessions/person/day |
| Voice dictation (Web Speech API) | **$0** | Built into the browser — no external API, no per-minute billing |
| **Total** | **~$12–40/month** | Voice input adds zero incremental cost |

**The dictation feature is free.** The concern about Whisper API costing ~$18/month was based on a previous specification that has been corrected. The right implementation — described in Section 8.7 — uses the browser's built-in Web Speech API, which is exactly what ChatGPT's web interface uses for voice input. There is no external API call, no per-minute charge, and no usage limit. It runs entirely in the browser.

## 8.2 Feature Overview

The "💬 Assistant & Chat" navigation item opens a unified panel that houses two experiences: the AI Assistant and Team Chat.

**Two display modes:**
1. **Floating bubble (minimized):** Always visible in the bottom-right corner of every page. A 52px circle with a chat icon and a red unread count badge.
2. **Expanded panel:** Slides up from the bubble on click to cover ~40% viewport width and ~70% height. Can be maximized to full screen.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Assistant & Chat                                                [Minimize]  │
├──────────────────┬─────────────────────────────────────────────────────────  │
│  CONVERSATIONS   │  [Selected Conversation Content]                          │
│  ─────────────── │                                                           │
│  ✨ My Assistant │                                                           │
│  ─── CHATS ───── │                                                           │
│  👥 CST Team     │                                                           │
│  📌 AIMCO Proj.  │                                                           │
│  + Mark Reyes 🔔3│                                                           │
│  [+ New Chat]    │                                                           │
│  [+ New Group]   │                                                           │
└──────────────────┴─────────────────────────────────────────────────────────  │
```

## 8.3 Floating Chat Bubble

Always visible on every page in the system (all hubs, modules, admin pages). Never hidden by content. `z-index` must always be the highest on the page.

- **Design:** 52px circle, blue-500 background, white MessageCircle icon (Lucide, strokeWidth 2)
- **Unread badge:** Red circle with white count text in top-right of button. Pulses once (scale 1→1.4→1, 300ms) when a new message arrives.
- **Click:** Panel slides up from the button with a spring animation (cubic-bezier ease-out, 300ms). Button transforms into a down-arrow (↓) to close.
- **Notification sound:** A short soft chime plays when a new message arrives, provided: the panel is not open AND the browser tab is active. Mutable per-user in settings.

**System Settings toggle:** Admin → System Settings → Chat → "Enable Chat & Assistant" — controls whether the bubble appears for all users.

## 8.4 AI Assistant — Full Specification

### Two Access Points, One Assistant

The AI Assistant is accessible in two ways:

**1. Floating bubble (quick access):** The bottom-right chat bubble described in Section 8.3. Opens a compact panel for quick queries, quick record updates, and quick scheduling.

**2. Full-page view (My Assistant):** Clicking "Assistant & Chat → My Assistant" in the left navigation opens the full-page experience at `/assistant`. This is the primary workspace. It has three tabs: **Chat · Job Queue · Capabilities**.

The floating bubble and full-page view share the same session and conversation history. Conversations started in the bubble continue seamlessly in the full-page view.

---

### My Assistant Page — Tab 1: Chat

**Route:** `/assistant`

The full-page chat view uses the full viewport. Layout: tab bar at the top → active skills chip bar → scrollable conversation area → message input with voice and send buttons. Same skills, same behavior as the bubble — just with more space.

### Skills Chip Bar

Above the message input, a chip bar shows active skills:

```
Active skills:  [+ Add skill]

[System Populator ×]  [Smart Query ×]
```

**Adding a skill:** Click "+ Add skill" → popover shows all available skills (and apps) with descriptions. Click any to activate. Multiple can be active simultaneously.

**How activated skills work:** When a skill chip is active, the skill's CLAUDE.md instruction is prepended to the assistant's system prompt and the skill's `allowed_tools` are added to the session's tool access.

**Using an App from the Assistant:** Apps also appear in the chip picker with a category icon. Selecting an App chip runs the app's conversation inside the compact chat panel using the same CLAUDE.md and same context loading. An "Open full view →" button expands to the full App panel at any time, with conversation state preserved.

**Default active skills for all new users (configurable in Settings):**
- System Record Populator
- Smart Query & Report
- Calendar & Meeting Scheduler

### Example Interactions

```
User: "What's my schedule for today?"
Assistant: [reads calendar + tasks]
"You have 3 tasks and 1 meeting today:
 Masterdata Validation (due today, 4h) — AIMCO
 Send MOM — FH Commercial (0.5h)
 Setup Clearance (1h)
 2:00 PM — Alignment Meeting — AIMCO (Zoom)
 Total: 5.5h / 8h capacity  [Open My Tasks]"

User: "Mark masterdata validation as in progress"
Assistant: "Set Masterdata Validation to In Progress. Confirm? [Yes] [No]"
User: "Yes"
Assistant: "Done."

User: "Log 2 hours on it for today"
Assistant: "Log 2h on Masterdata Validation, today Feb 18. Confirm? [Yes] [No]"
User: "Yes"
Assistant: "Logged."
```

---

### My Assistant Page — Tab 2: Job Queue

**Route:** `/assistant/jobs`

The Job Queue is the complete audit trail and status tracker of every action the AI has been instructed to perform. Every AI-executed action — immediate, scheduled, or failed — is recorded here permanently.

**This answers: "What have I asked the AI to do? Did it do it? When?"**

Every instruction to the AI that produces an action (not just a query) creates a row in this list. Immediate actions appear instantly as Completed. Future instructions appear as Scheduled until their execution time arrives.

**Filter bar:** Status · Skill · Date Range · Search

**Job list table (most recent first):**

| Status | Job Summary | Skill | Time | Status Badge |
|---|---|---|---|---|
| ⏳ | Send email to RD — UAT confirmation | Email Sender | Mon 10 AM | Scheduled |
| ✅ | Create subtask: field mapping document | Sys. Populator | Today 9:14 | Completed |
| ✅ | Log 2h on masterdata validation | Sys. Populator | Today 9:01 | Completed |
| ✅ | Message Jillian — AIMCO support request | Coord. Msg | Fri 4:30 | Completed |
| 🔴 | Schedule meeting — FH Commercial | Scheduler | Thu 11:22 | Failed |
| ⏳ | Inform Jillian re: AIMCO support — Mon 10 AM | Coord. Msg | Mon 10 AM | Scheduled |

**Status values:**
- ⏳ Scheduled — confirmed and queued for a future date/time
- 🔄 Running — currently executing
- ✅ Completed — executed successfully
- 🔴 Failed — could not complete; error details available
- ⚪ Cancelled — user cancelled before execution

**Job Detail Side Panel (click any row):**

For Scheduled jobs: shows the original instruction verbatim, the exact scheduled time (with working-day adjustment note if applicable), the full draft preview (complete email body or message text), and action buttons: [Edit & Reschedule] [Send Now] [Cancel Job].

For Completed jobs: shows the execution timestamp, a summary of what was done, and direct links to created or updated records (e.g., "Task created: Prepare field mapping document → [link]", "Email sent — view in AIMCO comms log → [link]").

For Failed jobs: shows the error message and a [Retry] button that re-runs the same skill call with the same parameters.

---

### `ai_jobs` Table

Every action the assistant executes or schedules creates a record here. Records are never deleted — this is a permanent audit table.

| Field | Type | Required | Description |
|---|---|---|---|
| `job_id` | UUID | YES | PK |
| `user_id` | UUID | YES | FK to users |
| `session_id` | UUID | | Groups jobs from the same conversation |
| `skill_code` | string | YES | Which skill handled this job e.g., "email-sender" |
| `instruction_text` | text | YES | The user's original instruction verbatim — the permanent audit record |
| `action_type` | enum | YES | `send_email` / `send_chat_message` / `create_task` / `update_record` / `schedule_meeting` / `log_time` / `create_rfa` / `query` / `generate_document` / `other` |
| `status` | enum | YES | `scheduled` / `running` / `completed` / `failed` / `cancelled` |
| `is_scheduled` | boolean | YES | true if execution is deferred to a future time |
| `scheduled_for` | timestamp | | When to execute; null for immediate jobs |
| `executed_at` | timestamp | | When the job actually ran |
| `execution_duration_ms` | integer | | |
| `input_data` | JSONB | | Parameters passed to the skill; used for audit and retry |
| `output_data` | JSONB | | What was produced: `{record_ids_created[], urls[], summary}` |
| `draft_content` | JSONB | | For scheduled jobs: the full draft of the action (email body, message text) — user can preview and edit before execution |
| `error_message` | text | | If status = failed |
| `retry_count` | integer | | Default 0; incremented on each retry |
| `linked_client_id` | UUID | | FK to clients |
| `linked_project_id` | UUID | | FK to projects |
| `linked_task_id` | UUID | | FK to tasks |
| `cancelled_at` | timestamp | | |
| `created_at` | timestamp | YES | Auto |
| `updated_at` | timestamp | YES | Auto |

### Scheduled Job Execution

Jobs are executed by the BullMQ background worker on a 1-minute polling interval: find all jobs where `is_scheduled=true`, `status=scheduled`, `scheduled_for <= now()`.

On execution: `status → running`. On success: `status → completed`; `output_data` populated; user receives in-app notification "✅ Scheduled job completed: [summary]". On failure: `status → failed`; `error_message` set; user receives notification "🔴 Scheduled job failed — [summary] [Retry]".

**Working day awareness:** If a scheduled job lands on Saturday, Sunday, or a Philippine public holiday, the system holds it and delivers at 9:00 AM on the next working day. The user is informed at scheduling time: "I've scheduled this for Monday Feb 21 at 10:00 AM — next working day after the weekend."

### Scheduling Detection

Scheduling is triggered automatically when the user's instruction contains temporal language: "on Monday", "at 10 AM", "tomorrow morning", "next week", "don't send until Tuesday", "schedule this for".

When scheduling is detected, the assistant: (1) resolves the exact date/time applying working-day logic; (2) generates the full draft output immediately; (3) shows the confirmation with scheduled time and full draft; (4) saves the job with `status=scheduled` and `draft_content` populated; (5) user can edit or reschedule from the Job Queue at any time before execution.

---

### My Assistant Page — Tab 3: Capabilities

**Route:** `/assistant/capabilities`

This page is a permanent reference for every team member. It answers: *"What can the AI assistant actually do? What should I ask it?"*

No team member should have to guess or experiment to discover what the assistant is capable of. This page makes it explicit.

#### Page Layout

**Header:** "What your AI Assistant can do" · "Last updated: [date when any skill was added or modified]"

**Intro paragraph (non-technical, plain language):**
"Your AI Assistant is a system-aware helper that knows your projects, your clients, your tasks, and your calendar. You can talk to it like a colleague — describe what you need in plain language and it will either do it immediately or confirm with you before acting. Everything it does is recorded in the Job Queue so you always know what it has done."

#### Capability Cards (one per active skill)

Each card shows:
- Skill name and icon
- One-sentence description
- "What you can ask" — 4–6 concrete example phrases the user can literally type or say
- "What it does" — the output (creates a task / sends a message / generates a document / answers with data)
- "Works with voice?" — yes/no badge

Example card for System Record Populator:

```
+------------------------------------------------------------------+
| [icon]  System Record Populator                     Voice: Yes   |
| Fill any record in the system by describing what you need.       |
|                                                                  |
| What you can ask:                                                |
| - "Add a task under masterdata validation for AIMCO"             |
| - "Log 3 hours on the UAT prep task for today"                  |
| - "Change the AIMCO project phase to UAT"                        |
| - "Update Jillian's task — mark it as blocked"                  |
| - "Add a contact to FH Commercial — their IT manager"            |
|                                                                  |
| What it does: Creates or updates records in Tasks, Projects,     |
| Clients, Contacts, Time Logs, and more — after your confirmation.|
+------------------------------------------------------------------+
```

#### Use Case Gallery (below the skill cards)

A curated set of common use cases organized by situation — helps users think about *when* to use the assistant rather than just *what* it can do.

**"When you're planning your week:"**
- "What tasks are due this week?"
- "Schedule a check-in meeting with Mark on Thursday"
- "Remind me to follow up on the AIMCO UAT on Friday"

**"When you're in a project:"**
- "Create a subtask under the recommendation deck milestone"
- "Log the 2 hours I spent on the fit-gap today"
- "What milestones are overdue on AIMCO?"

**"When you need to communicate:"**
- "Send an email to RD confirming the UAT date"
- "Tell Jillian on Monday that she needs to attend the AIMCO hypercare call"
- "Draft a message to the AIMCO admin about masterdata preparation"

**"When you want information:"**
- "What's the health score for FH Commercial and why?"
- "Who is the least loaded team member this week?"
- "How many overdue tasks does my team have right now?"

**"When you're preparing for a meeting:"**
- "What open action items are there from the last AIMCO meeting?"
- "Summarize the current status of the AIMCO project"

#### Skills Not Yet Active

Below the active skills, a section shows skills available in the system that the user has not yet activated in the Assistant:

"More capabilities available — activate from the chip bar in Chat:"

Each unactivated skill shown as a smaller card with a "+ Activate" button that immediately adds the chip to the user's Assistant skill bar.

#### Admin Capability: Updating the Capabilities Page

The content of this page is **data-driven** — it reads from the `skills` table. Every skill's `description`, `example_prompts` JSONB field, and `voice_enabled` flag automatically populate the capability card. When a new skill is added to the system, its card appears on this page immediately. No manual page editing required.

The `example_prompts` field is added to the skills configuration in the Skills Builder:
```json
{
  "example_prompts": [
    "Add a task under masterdata validation for AIMCO",
    "Log 3 hours on the UAT prep task for today",
    "Change the AIMCO project phase to UAT"
  ]
}
```

The Use Case Gallery entries are managed in Admin → System Settings → Assistant → "Capability Gallery" — a simple rich text editor where the admin curates situation-based examples. When new skills are added, the admin updates the gallery to include relevant examples.


## 8.5 Team Chat

### Database Tables

**`chat_conversations`**

| Field | Type | Description |
|---|---|---|
| `conversation_id` | UUID | PK |
| `type` | enum | `direct` (2 users) · `group` (3+ users) · `project_thread` |
| `name` | string | For group chats; null for direct |
| `avatar_emoji` | string | For group chats |
| `member_ids` | UUID[] | FK → users |
| `created_by_id` | UUID | FK → users |
| `pinned_project_id` | UUID | FK → projects; null if not a project thread |
| `is_archived` | boolean | |
| `created_at` | timestamp | Auto |
| `updated_at` | timestamp | Auto |

**`chat_messages`**

| Field | Type | Description |
|---|---|---|
| `message_id` | UUID | PK |
| `conversation_id` | UUID | FK → chat_conversations |
| `sender_id` | UUID | FK → users |
| `message_type` | enum | `text` · `file` · `image` · `voice_note` · `system_event` · `ai_response` |
| `content` | text | Text content |
| `file_url` | string | Google Drive link or Cloud Storage URL |
| `file_name` | string | |
| `file_size_bytes` | integer | |
| `file_source` | enum | `google_drive` · `system_record` · `external_url` |
| `file_metadata` | JSONB | {name, mime_type, thumbnail_url, size_bytes, google_file_id, last_modified_at} — cached at share time |
| `linked_record_type` | string | For system record links: "brd", "project", "task", "client" |
| `linked_record_id` | UUID | FK to the linked record |
| `voice_duration_seconds` | integer | For voice notes |
| `voice_transcript` | text | Browser-generated transcript via Web Speech API (real-time, no external API) |
| `reply_to_message_id` | UUID | Self-ref; for replies |
| `reactions` | JSONB | [{user_id, emoji}] |
| `is_edited` | boolean | |
| `edited_at` | timestamp | |
| `read_by` | JSONB | [{user_id, read_at}] |
| `created_at` | timestamp | Auto |
| `deleted_at` | timestamp | Soft delete ("This message was deleted") |

**`chat_read_status`**

| Field | Type | Description |
|---|---|---|
| `status_id` | UUID | PK |
| `conversation_id` | UUID | FK → chat_conversations |
| `user_id` | UUID | FK → users |
| `last_read_message_id` | UUID | FK → chat_messages |
| `last_read_at` | timestamp | |

Unread count = messages created_at > last_read_at for this user.

### Chat UI Design (Telegram-like)

**Message bubbles:**
- Sent: right-aligned, blue-500 background, white text, 8px radius (top-left + bottom)
- Received: left-aligned, white background, gray-800 text, gray-100 background, 8px radius (top-right + bottom)
- Sender avatar (24px circle) shown for group chats, left of received bubble
- Timestamp below each bubble (12px gray-500)
- Read receipts: single tick (delivered) → double tick (read by all members)

**Reactions:** Long-press or hover → reaction bar (👍 ❤️ 😂 😮 😢 🔥). Counts shown below bubble.

**Replies:** Swipe right (mobile) or hover → click Reply icon → quoted message preview appears above the input.

**Project Threads:** On every Project Profile page, a "💬 Project Chat" button in the header opens (or creates) a `project_thread` conversation linked to that project. All team members on the project are auto-added. Every project has a dedicated chat space created automatically when the project is created.

## 8.6 Chat Attachments — Google Drive Integration

Files are shared as Google Drive links — not uploaded into the CST OS database. This approach adds zero infrastructure cost and is consistent with how BRDs, MOMs, and project documents are already handled.

**Three ways to share a file:**

**Option A — Google Drive Picker:** Click the 📎 button → Google Picker opens (same API used throughout the system). User browses their Drive, selects a file, clicks Share. System fetches metadata (name, type, thumbnail) via the Drive API and stores the URL and cached metadata in `chat_messages.file_url` + `file_metadata`. The file is never copied — only the link is stored.

**Option B — Paste a Drive Link:** User pastes a Google Drive URL into the chat. System auto-detects the Drive URL pattern, fetches metadata, and renders the message as a rich file card.

**Option C — Share a System Record:** Type `/` in the chat input → command picker appears. Type a record name (e.g., "/brd AIMCO") → search results appear → select a record → an internal reference card is inserted:

```
┌─────────────────────────────────────────────────────┐
│  📄  BRD — AIMCO Implementation v2.0               │
│       Status: Approved · Jillian Santos             │
│                              [Open in System →]     │
└─────────────────────────────────────────────────────┘
```

The card contains only the record type and ID — no raw data. The recipient's system role determines what they can see when they open it.

**File card rendering:**
- Google Docs/Sheets/Slides: card with name, last modified, [Preview] and [Open in Drive] buttons
- PDFs: card with name, size, [Preview] and [Download] buttons
- Images: inline thumbnail (click to lightbox)
- Preview button: opens Google Docs Viewer in a modal — recipient reads the file without leaving chat

**Security:** The CST OS does not manage Google Drive permissions. If a recipient lacks Drive access, Google will deny them. This is by design — file sharing is the sender's responsibility.

## 8.7 Voice Dictation — Web Speech API (Free, Zero Cost)

### Why This Is Free and How It Works

The correct term for what you want is **voice dictation** — you speak, the text appears, you review it, you send it. This is exactly what ChatGPT's web interface uses when you tap the microphone icon there.

The technology powering it is the **Web Speech API** — a standard capability built directly into modern browsers (Chrome, Edge, Safari). It requires no external API subscription, no per-minute billing, and no server infrastructure. The browser handles the speech recognition locally, sending audio to Google's speech servers as part of the browser's built-in functionality — at no charge to you.

**Cost: $0. No usage limit. No monthly bill.**

The auto-silence cutoff issue you experienced in other tools happens when the Web Speech API is used in its default mode (`continuous: false`). The fix is simple: use `continuous: true` mode. In this mode, the browser keeps recording until the developer explicitly calls `.stop()` — which is exactly what the Start/Stop button pattern does. This is not a workaround; it is the correct, standard way to implement push-to-talk dictation in a browser application.

### Implementation Specification (Non-Negotiable)

**Dictation is implemented using the browser's native `SpeechRecognition` API with `continuous: true` and `interimResults: true`. No external speech-to-text API is used for dictation.**

```javascript
// Correct implementation — this is how it must be built
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-PH';       // Philippine English — handles code-switching well
recognition.continuous = true;     // CRITICAL: do not stop on silence
recognition.interimResults = true; // Show partial transcript while speaking

// User presses Start button:
recognition.start();

// User presses Stop button:
recognition.stop();
// Transcript is then placed in the message input for review
```

**`continuous: true` is the key setting that solves the auto-cutoff problem.** With this setting, the browser will never stop the recording because the user paused to think. Only `recognition.stop()` (triggered by the user pressing Stop) ends the session.

### Language Setting

Set `recognition.lang = 'en-PH'` (Philippine English). This variant handles the way Filipino professionals speak English — including common Tagalog words mixed into sentences — better than `en-US` or `en-GB`. Test with actual team members during development to confirm accuracy is acceptable. If `en-PH` accuracy is insufficient for certain speakers, allow the user to switch to `en-US` in their personal settings.

### Browser Support

| Browser | Support | Notes |
|---|---|---|
| Google Chrome | ✅ Full | Recommended; best accuracy |
| Microsoft Edge | ✅ Full | Chromium-based; same as Chrome |
| Safari (macOS / iOS) | ✅ Full | Works well |
| Firefox | ❌ Not supported | Does not implement Web Speech API |
| Chrome on Android | ✅ Full | Works on mobile |

**The CST team uses Google Workspace and Google Chrome is the standard browser.** Firefox non-support is not a concern. If a user opens the system in Firefox, the 🎤 microphone button is hidden with a tooltip: "Voice dictation is not available in Firefox — use Chrome or Edge."

### Acceptance Criteria (Non-Negotiable, Unchanged)

1. User presses 🎤 to **START** recording
2. Visual indicator: animated red dot + elapsed time counter
3. Partial transcript appears in the input field in real time as the user speaks (`interimResults: true`)
4. **Silence does NOT stop the recording** — the user can pause mid-sentence and continue
5. User presses ✅ **Stop** to end the recording
6. Final transcript replaces the partial transcript in the input field
7. User reviews and edits the text before pressing Send
8. User presses Send

### Recording UI States

```
Normal:        [Type a message...               🎤  Send]

Recording:     [please schedule a meeting...●   ✅  Cancel]
               (partial transcript appears here as user speaks, 0:12 elapsed)

Review:        [please schedule a meeting with Jillian on Monday ✏️  Send]
               (final transcript, fully editable before sending)
```

No "Transcribing..." loading state is needed because the Web Speech API produces text in real time — there is no processing delay after pressing Stop.

### Voice Notes in Chat

When the user sends a voice note (audio recording rather than dictated text), a separate path applies:

- Voice notes use the browser's **MediaRecorder API** to capture audio
- The audio blob is uploaded to Cloud Storage
- The stored audio file is then transcribed using the **Web Speech API offline mode** if available, or displayed without a transcript if the recording is long
- Recipients see a waveform player with duration
- For long recordings where real-time transcription is impractical, offer a "Transcribe" button that the recipient can tap to get the text version

**Voice notes do not use Whisper API or any paid service.** This is a lower-priority feature. If transcription of voice notes proves inaccurate with the browser API alone, the team can choose to simply not show a transcript for voice notes — the audio player alone is sufficient for a chat context.

### Settings

In Admin → System Settings → Chat, a toggle: "Enable voice dictation (🎤 button)". Default: On. This controls the microphone button visibility system-wide.

In user personal settings: "Default dictation language" — en-PH (default) or en-US. This is the only user-configurable voice setting.

## 8.8 Notifications

**Unread badge:** Red circle on the floating bubble. Pulses (scale 1→1.4→1, 300ms) on new message. Disappears when the conversation is opened and scrolled to the bottom.

**Notification sound:** Short soft chime. Plays only when: chat panel is NOT open AND browser tab is active. Mutable per-user.

**Browser push notifications (optional):** On first use, system asks permission. If granted, push notifications appear even in background tabs: sender name + message preview (truncated to 80 chars). Clicking opens the system and jumps to the conversation.

**Do Not Disturb:** User can set a DND schedule (start/end time) in their settings. No sounds or push notifications during DND hours.

---

# PART 9: ERD ADDITIONS FOR CHAT AND AI JOBS

```
chat_conversations
  ├── member_ids ──────────────────────→ users (array FK)
  ├── created_by_id ───────────────────→ users
  ├── pinned_project_id ───────────────→ projects (nullable)
  └── chat_messages (1:many)
        ├── sender_id ────────────────→ users
        ├── reply_to_message_id ──────→ chat_messages (self-ref)
        ├── linked_record_id ─────────→ varies by linked_record_type
        └── read_by [] ───────────────→ users (via JSONB)

chat_read_status
  ├── conversation_id ─────────────────→ chat_conversations
  ├── user_id ─────────────────────────→ users
  └── last_read_message_id ────────────→ chat_messages

ai_jobs
  ├── user_id ─────────────────────────→ users
  ├── linked_client_id ────────────────→ clients (nullable)
  ├── linked_project_id ───────────────→ projects (nullable)
  └── linked_task_id ──────────────────→ tasks (nullable)
      (ai_jobs records are never deleted — permanent audit table)
```

---

# PART 10: MASTER DATA (LOOKUPS & REFERENCE DATA)

## 10.1 Purpose and Design Principle

**Master Data** is the authoritative term used in this system for all dropdown options, selection lists, status values, categories, and reference codes that appear throughout the UI. Any field that presents the user with a predefined list of choices is backed by master data.

The design goal is simple: **nothing is hardcoded.** Every option list is a database record that an admin can view, rename, add to, reorder, or deactivate — without touching code. When the business needs a new task status, a new client segment, or a new industry classification, an admin adds a row to the relevant master data group. The change propagates immediately to every dropdown in the system that references it.

This consolidates what used to be called "Job Roles" and "Access Profiles" under Administration into a single, well-organised Master Data module — alongside every other lookup in the system.

---

## 10.2 Two Types of Master Data Values

Every value in every master data group is one of two types:

**System Value** (`is_system: true`): Seeded at initialization. Has logic connected to it — business rules, workflow triggers, cascade operations, or KPI calculations that reference this specific value by its `code`. System values can be **renamed** (the display label can change) but cannot be **deleted** or have their `code` changed. Deactivating a system value hides it from dropdowns but does not remove existing records that reference it.

**Custom Value** (`is_system: false`): Created by an admin after initialization. No hardcoded logic references these by code. Can be fully renamed, reordered, or soft-deleted. When deleted, a migration prompt asks the admin to reassign any records that currently use the deleted value.

The distinction is always shown in the UI — system values have a lock icon (🔒). Custom values have an edit/delete menu.

---

## 10.3 Connected Logic — Which Values Have Business Rules

Before listing all master data groups, the groups with connected logic are called out explicitly. Claude Code must read this section before building any master data management feature — renaming a system code must never break the logic that references it.

| Group | Connected Logic |
|---|---|
| Task Status | `done` status triggers milestone cascade check and actual_completion_date auto-set. `cancelled` is excluded from cascade count. Never rename these two codes. |
| Task Type | Each type has a calendar color pair (planned/done). `courtesy_call` triggers CC compliance tracking. `meeting_external` + `is_face_to_face` feeds annual F2F KPI. Never change codes. |
| Project Phase | Strict 11-step sequence. `turnover` has a gate checklist. `bau` is only reachable after turnover gates. Phase order is determined by `sort_order` — reordering system phases is blocked. |
| Project Status | `completed` triggers project wrap-up notifications. `cancelled` hides project from active lists. |
| Client Lifecycle Stage | 11-stage sequence. Each stage transition fires notifications and news feed events. Stage order locked. |
| Client Status | `at_risk` triggers health alerts. `closed` hides from active client lists. |
| Milestone Type | Directly maps to KPI scorecard metric categories. Any milestone of a KPI milestone type auto-creates a milestone_log entry. Never change milestone type codes. |
| RFA Request Type | `timeline_revision` triggers the draft timeline workflow. `recommendation_approval` triggers the recommendation record approval chain. |
| Timeline Revision Category | Used in RFA descriptions and audit trail labels. Rename freely; do not delete while RFAs reference them. |
| Deal Stage (Pipeline) | `won_pending_onboarding` triggers "Convert to Client" button. `lost` removes from active pipeline. |
| Access Profile | Controls system permissions. Deleting an active profile requires reassignment. |
| Job Role | `level` field controls org chart hierarchy and approval chains. System roles cannot have their `level` changed. |

---

## 10.4 The `master_data_groups` and `master_data_values` Tables

Master data is stored in two tables that power all lookup fields system-wide.

### `master_data_groups` Table

| Field | Type | Required | Description |
|---|---|---|---|
| `group_id` | UUID | YES | PK |
| `code` | string | YES | Unique system identifier e.g., `task_status`, `client_tier` |
| `name` | string | YES | Display name shown in the Master Data admin page |
| `description` | text | | Plain-language explanation of what this group is used for |
| `module` | string | YES | Which module owns this group e.g., `tasks`, `clients`, `projects` |
| `field_name` | string | YES | The field on the record this drives e.g., `status`, `tier`, `industry` |
| `is_ordered` | boolean | YES | true if values have a meaningful sequence; for ordered system groups reordering is locked |
| `allow_custom_values` | boolean | YES | true = admins can add new values; false = only system values |
| `allow_user_quick_add` | boolean | YES | Default false; if true, supervisor+ can quick-add from any form |
| `is_system_group` | boolean | YES | true for seeded groups; cannot be deleted |
| `field_schema` | JSONB | | **Defines the configurable logic fields** stored in each value's `metadata` JSONB. This is what the UI renders as editable form fields when an admin clicks a value row. See Section 10.4a for the full schema format and all groups that have configurable logic fields. |
| `created_at` | timestamp | YES | Auto |

### `master_data_values` Table

| Field | Type | Required | Description |
|---|---|---|---|
| `value_id` | UUID | YES | PK |
| `group_id` | UUID | YES | FK → master_data_groups |
| `code` | string | YES | Unique within the group; used in all database FK references and business logic; system values have a stable code that never changes |
| `label` | string | YES | Display name shown in dropdowns and badges across the system |
| `label_short` | string | | Abbreviated label for compact display e.g., "In Prog." for "In Progress" |
| `color_hex` | string | | Badge/chip color e.g., `#2162F9` for blue |
| `color_name` | string | | Semantic color token e.g., `blue-500`, `amber-500`, `green-500` |
| `icon` | string | | Optional Lucide icon name shown alongside the label |
| `sort_order` | integer | YES | Display order in dropdowns; drag-to-reorder for non-locked groups |
| `is_system` | boolean | YES | true = seeded, cannot be deleted or have code changed |
| `is_active` | boolean | YES | false = hidden from all dropdowns but existing records are unaffected |
| `metadata` | JSONB | | Group-specific extra data e.g., for `client_tier`: `{cc_frequency, managed_by, notes}` |
| `created_by_id` | UUID | | FK → users; null for seeded values |
| `created_at` | timestamp | YES | Auto |
| `updated_at` | timestamp | YES | Auto |
| `deleted_at` | timestamp | | Soft delete (custom values only) |

---

## 10.5 Complete Master Data Registry — All Groups and Seeded Values

Every group is listed below with all seeded system values. Groups are organized by module.

---

### MODULE: TASKS

**Group: `task_status`**
Module: tasks · Field: status · Ordered: No · Allow custom: Yes

| Code | Label | Color | Connected Logic |
|---|---|---|---|
| `todo` | To Do | gray-400 | 🔒 |
| `in_progress` | In Progress | blue-500 | 🔒 |
| `for_review` | For Review | violet-500 | 🔒 |
| `blocked` | Blocked | red-500 | 🔒 |
| `done` | Done | green-500 | 🔒 Triggers milestone cascade; sets actual_completion_date |
| `cancelled` | Cancelled | gray-300 | 🔒 Excluded from cascade counts |

**Group: `task_priority`**
Module: tasks · Field: priority · Ordered: Yes (Critical > High > Medium > Low) · Allow custom: No

| Code | Label | Color |
|---|---|---|
| `critical` | Critical | red-600 |
| `high` | High | red-400 |
| `medium` | Medium | amber-500 |
| `low` | Low | gray-400 |

**Group: `task_type`**
Module: tasks · Field: task_type · Ordered: No · Allow custom: Yes

| Code | Label | Calendar Planned Color | Calendar Done Color | Connected Logic |
|---|---|---|---|---|
| `implementation` | Implementation | orange-50 | orange-500 | 🔒 Counts in DAR KPI |
| `customization` | Customization | ember-50 | ember-500 | 🔒 Counts in DAR KPI |
| `training` | Training | yellow-50 | yellow-500 | 🔒 Counts in DAR KPI |
| `meeting_internal` | Meeting (Internal) | blue-50 | blue-500 | 🔒 Counts in DAR KPI |
| `meeting_external` | Meeting (External) | violet-50 | violet-500 | 🔒 Counts in DAR KPI; is_face_to_face flag feeds annual F2F KPI |
| `courtesy_call` | Courtesy Call | green-50 | green-500 | 🔒 Feeds CC compliance KPI |
| `admin` | Admin | gray-50 | gray-600 | 🔒 Counts in DAR KPI |
| `rfa_item` | RFA Item | ember-50 | ember-500 | 🔒 |
| `milestone_deliverable` | Milestone Deliverable | blue-50 | blue-500 | 🔒 |
| `acquisition_poc` | Acquisition / POC | orange-50 | orange-500 | 🔒 |
| `system_admin` | System Admin | gray-50 | gray-600 | 🔒 |

---

### MODULE: PROJECTS

**Group: `project_status`**
Module: projects · Field: status · Ordered: No · Allow custom: No

| Code | Label | Color | Connected Logic |
|---|---|---|---|
| `draft` | Draft | gray-400 | 🔒 |
| `active` | Active | blue-500 | 🔒 |
| `on_hold` | On Hold | amber-500 | 🔒 |
| `completed` | Completed | green-500 | 🔒 Triggers wrap-up notifications |
| `cancelled` | Cancelled | gray-300 | 🔒 Removes from active lists |

**Group: `project_priority`**
Module: projects · Field: priority · Ordered: Yes · Allow custom: No
Same 4 values as task_priority (Critical / High / Medium / Low).

**Group: `project_type`**
Module: projects · Field: project_type · Ordered: No · Allow custom: Yes

| Code | Label |
|---|---|
| `new_implementation` | New Client Implementation |
| `customization` | Customization |
| `express_implementation` | Express Implementation |
| `enterprise_implementation` | Enterprise Implementation |
| `re_implementation` | Re-Implementation |
| `support_project` | Support Project |

**Group: `project_phase`**
Module: projects · Field: phase · Ordered: Yes (locked order) · Allow custom: No

| Code | Label | Order | Connected Logic |
|---|---|---|---|
| `pre_sales_handover` | Pre-Sales Handover | 1 | 🔒 |
| `kickoff` | Kickoff | 2 | 🔒 |
| `fit_gap` | Fit-Gap Analysis | 3 | 🔒 |
| `solution_design` | Solution Design | 4 | 🔒 |
| `build_config` | Build / Configuration | 5 | 🔒 |
| `uat` | User Acceptance Testing | 6 | 🔒 |
| `go_live` | Go-Live | 7 | 🔒 |
| `training` | Training | 8 | 🔒 |
| `hypercare` | Hypercare | 9 | 🔒 |
| `turnover` | Turnover to Maintenance | 10 | 🔒 Has gate checklist; "Advance to BAU" is blocked until gate passes |
| `bau` | BAU (Business As Usual) | 11 | 🔒 Only reachable after turnover gates |

**Group: `project_risk_level`**
Module: projects · Field: risk_level · Ordered: Yes · Allow custom: No

| Code | Label | Color |
|---|---|---|
| `low` | Low | green-500 |
| `medium` | Medium | amber-500 |
| `high` | High | red-400 |
| `critical` | Critical | red-600 |

**Group: `risk_category`**
Module: project_risks · Field: category · Ordered: No · Allow custom: Yes

| Code | Label |
|---|---|
| `schedule` | Schedule |
| `resource` | Resource |
| `technical` | Technical |
| `client` | Client |
| `scope` | Scope |

**Group: `risk_likelihood`** and **`risk_impact`**
Module: project_risks · Allow custom: No

| Code | Label | Numeric (for score calculation) |
|---|---|---|
| `low` | Low | 1 |
| `medium` | Medium | 2 |
| `high` | High | 3 |

Connected logic: `risk_score = likelihood_num × impact_num` (1–9). Numeric values in `metadata` field.

**Group: `risk_status`**
Module: project_risks · Allow custom: No

| Code | Label |
|---|---|
| `open` | Open |
| `mitigated` | Mitigated |
| `closed` | Closed |

**Group: `milestone_type`**
Module: project_milestones · Field: milestone_type · Ordered: No · Allow custom: No

| Code | Label | KPI Category | Connected Logic |
|---|---|---|---|
| `kickoff` | Kick-Off Meeting Conducted | milestone | 🔒 KPI milestone |
| `fit_gap_completed` | Fit-Gap Analysis Completed | milestone | 🔒 KPI milestone |
| `recommendation_presented` | Recommendation Presented | milestone | 🔒 KPI milestone |
| `recommendation_approved` | Recommendation Approved | milestone | 🔒 KPI milestone; triggers linked timeline activation |
| `uat_conducted` | UAT Conducted | milestone | 🔒 KPI milestone |
| `go_live` | Go Live | milestone | 🔒 KPI milestone; triggers confetti + news feed highlight |
| `training_conducted` | Training Conducted | milestone | 🔒 KPI milestone |
| `hypercare_closed` | Hypercare Closed | milestone | 🔒 KPI milestone |
| `rfa_approved` | RFA Approved | rfa | 🔒 |
| `mockup_approved` | Mockup Approved | milestone | 🔒 |
| `courtesy_call_completed` | Courtesy Call Completed | cc_compliance | 🔒 Feeds CC KPI |
| `kyc_completed` | KYC Completed | kyc | 🔒 Feeds KYC KPI |
| `next_steps_agreed` | Next Steps Agreed | milestone | 🔒 |
| `poc_delivered` | POC Delivered | acquisition | 🔒 |

**Group: `timeline_revision_category`**
Module: project_timelines · Field: revision_category · Ordered: No · Allow custom: Yes

| Code | Label |
|---|---|
| `client_request` | Client Request |
| `scope_change` | Scope Change |
| `client_delay` | Client Delay |
| `technical_issue` | Technical Issue |
| `resource_change` | Resource Change |
| `force_majeure` | Force Majeure |
| `other` | Other |

---

### MODULE: CLIENTS

**Group: `client_status`**
Module: clients · Field: status · Ordered: No · Allow custom: No

| Code | Label | Color | Connected Logic |
|---|---|---|---|
| `prospect` | Prospect | gray-400 | 🔒 |
| `onboarding` | Onboarding | blue-300 | 🔒 |
| `active` | Active | green-500 | 🔒 |
| `at_risk` | At Risk | red-400 | 🔒 Triggers health alerts and news feed flag |
| `pending_closure` | Pending Closure | amber-500 | 🔒 |
| `closed` | Closed | gray-300 | 🔒 Hides from active client lists |

**Group: `client_lifecycle_stage`**
Module: clients · Field: lifecycle_stage · Ordered: Yes (locked) · Allow custom: No

| Code | Label | Order |
|---|---|---|
| `acquisition` | Acquisition | 1 |
| `onboarding` | Onboarding | 2 |
| `implementation` | Implementation | 3 |
| `go_live` | Go-Live | 4 |
| `hypercare` | Hypercare | 5 |
| `turnover` | Turnover | 6 |
| `bau` | BAU | 7 |
| `renewal` | Renewal | 8 |
| `expansion` | Expansion | 9 |
| `closure` | Closure | 10 |
| `closed` | Closed | 11 |

All stage transitions fire news feed events and notifications. Order is locked. 🔒 all values.

**Group: `client_tier`**
Module: clients · Field: tier · Ordered: Yes · Allow custom: No

| Code | Label | Metadata (cc_frequency, managed_by) | Connected Logic |
|---|---|---|---|
| `vip` | VIP | monthly / Sr. BA + Supervisor | 🔒 Dual ownership rule; 8h/month BAU estimate |
| `1` | Tier 1 | monthly / Sr. BA | 🔒 5h/month BAU estimate |
| `2` | Tier 2 | bi_monthly / Sr. BA or Jr. BA | 🔒 3h/month BAU estimate |
| `3` | Tier 3 | quarterly / Jr. BA | 🔒 2h/month BAU estimate |
| `4` | Tier 4 | quarterly / Jr. BA or Maintenance | 🔒 1h/month BAU estimate |
| `5` | Tier 5 | annual / Maintenance Team | 🔒 Excluded from CST workload calculations |

**Group: `client_segment`**
Module: clients · Field: segment · Ordered: No · Allow custom: Yes

| Code | Label |
|---|---|
| `strategic` | Strategic |
| `standard` | Standard |
| `at_risk` | At-Risk |

**Group: `company_size`**
Module: clients · Field: company_size · Ordered: No · Allow custom: Yes

| Code | Label |
|---|---|
| `sme` | SME |
| `mid_market` | Mid-Market |
| `enterprise` | Enterprise |

**Group: `industry`**
Module: clients · Field: industry · Ordered: No · Allow custom: Yes
Previously a free-text field — now a master data group. Seeded with common Philippine industries.

| Code | Label |
|---|---|
| `fmcg` | FMCG / Consumer Goods |
| `distribution` | Distribution / Logistics |
| `manufacturing` | Manufacturing |
| `pharmaceuticals` | Pharmaceuticals |
| `financial_services` | Financial Services |
| `real_estate` | Real Estate |
| `construction` | Construction |
| `retail` | Retail |
| `healthcare` | Healthcare |
| `technology` | Technology |
| `education` | Education |
| `government` | Government / Public Sector |
| `ngo` | NGO / Non-Profit |
| `other` | Other |

Admins can add new industries freely. The industry field on the client form becomes a searchable dropdown instead of a free-text input.

**Group: `contact_type`**
Module: client_contacts · Field: contact_type · Ordered: No · Allow custom: Yes

| Code | Label |
|---|---|
| `decision_maker` | Decision Maker |
| `admin` | Admin / Operations |
| `influencer` | Influencer |
| `end_user_lead` | End User Lead |
| `it_contact` | IT Contact |
| `executive_sponsor` | Executive Sponsor |

**Group: `kyc_status`**
Module: clients · Field: kyc_status · Ordered: No · Allow custom: No

| Code | Label | Color | Connected Logic |
|---|---|---|---|
| `not_started` | Not Started | gray-400 | 🔒 |
| `in_progress` | In Progress | blue-500 | 🔒 |
| `completed` | Completed | green-500 | 🔒 Triggers KPI milestone log |
| `needs_update` | Needs Update | amber-500 | 🔒 Triggers health warning |

---

### MODULE: MEETINGS

**Group: `meeting_type`**
Module: meetings · Field: meeting_type · Ordered: No · Allow custom: Yes

| Code | Label |
|---|---|
| `kickoff` | Kickoff Meeting |
| `fit_gap` | Fit-Gap Session |
| `courtesy_call` | Courtesy Call |
| `uat_walkthrough` | UAT Walkthrough |
| `training` | Training Session |
| `internal` | Internal Meeting |
| `escalation` | Escalation Meeting |
| `go_live_review` | Go-Live Review |
| `hypercare_review` | Hypercare Review |
| `cct_endorsement` | CCT Endorsement / Turnover |
| `recommendation_presentation` | Recommendation Presentation |
| `face_to_face_annual` | Annual Face-to-Face Visit |

**Group: `meeting_platform`**
Module: meetings · Field: platform · Ordered: No · Allow custom: Yes

| Code | Label |
|---|---|
| `zoom` | Zoom |
| `google_meet` | Google Meet |
| `in_person` | In-Person |
| `teams` | Microsoft Teams |
| `other` | Other |

---

### MODULE: RFAs

**Group: `rfa_request_type`**
Module: rfas · Field: request_type · Ordered: No · Allow custom: Yes

| Code | Label | Connected Logic |
|---|---|---|
| `customization` | Customization | 🔒 |
| `scope_change` | Scope Change | 🔒 |
| `timeline_revision` | Timeline Revision | 🔒 Triggers draft timeline workflow |
| `timeline_extension` | Timeline Extension | 🔒 |
| `budget_exception` | Budget Exception | 🔒 |
| `recommendation_approval` | Recommendation Approval | 🔒 Triggers recommendation record approval chain |
| `technical_exception` | Technical Exception | 🔒 |
| `other` | Other | 🔒 |

**Group: `rfa_status`**
Module: rfas · Field: status · Ordered: No · Allow custom: No

| Code | Label | Color |
|---|---|---|
| `draft` | Draft | gray-400 |
| `submitted` | Submitted | blue-500 |
| `under_review` | Under Review | violet-500 |
| `approved` | Approved | green-500 |
| `rejected` | Rejected | red-500 |
| `cancelled` | Cancelled | gray-300 |

---

### MODULE: BRDs / DOCUMENTS

**Group: `brd_status`**
Module: brds · Field: status · Ordered: No · Allow custom: No

| Code | Label | Color |
|---|---|---|
| `draft` | Draft | gray-400 |
| `for_review` | For Review | amber-500 |
| `approved` | Approved | green-500 |
| `rejected` | Rejected | red-500 |
| `superseded` | Superseded | gray-300 |

---

### MODULE: ACQUISITION PIPELINE

**Group: `deal_stage`**
Module: acquisition_pipeline · Field: deal_stage · Ordered: Yes · Allow custom: No

| Code | Label | Order | Connected Logic |
|---|---|---|---|
| `prospect` | Prospect | 1 | 🔒 |
| `qualified` | Qualified | 2 | 🔒 |
| `demo_done` | Demo Done | 3 | 🔒 |
| `proposal_sent` | Proposal Sent | 4 | 🔒 |
| `negotiation` | Negotiation | 5 | 🔒 Triggers pipeline projection in Manpower Planning |
| `won_pending_onboarding` | Won — Pending Onboarding | 6 | 🔒 Shows "Convert to Client" button |
| `lost` | Lost | 7 | 🔒 Removes from active pipeline |

---

### MODULE: USERS & WORKFORCE

**Group: `user_status`**
Module: users · Field: status · Ordered: No · Allow custom: No

| Code | Label | Color |
|---|---|---|
| `active` | Active | green-500 |
| `inactive` | Inactive | gray-400 |
| `on_leave` | On Leave | amber-500 |

**Group: `job_roles`**
Module: users · Field: job_role_id · Ordered: Yes (by level) · Allow custom: Yes
Previously a separate admin page. Now consolidated here.

Seeded values:

| Code | Label | Level | Short Name | Default Access Profile |
|---|---|---|---|---|
| `jr_business_analyst` | Junior Business Analyst | 1 | Jr. BA | System User |
| `sr_business_analyst` | Senior Business Analyst | 2 | Sr. BA | System User |
| `jr_supervisor` | Junior Supervisor | 3 | Jr. Supervisor | Supervisor |
| `sr_supervisor` | Senior Supervisor | 4 | Sr. Supervisor | Supervisor |
| `team_leader` | Team Leader | 5 | Team Leader | Supervisor |
| `manager` | Manager | 6 | Manager | Manager |
| `system_administrator` | System Administrator | 7 | Sys Admin | Super Administrator |

Job roles use the `master_data_values.metadata` field to store: `{level, short_name, default_access_profile_id, description}`.

**Group: `access_profiles`**
Module: users · Field: access_profile_id · Ordered: No · Allow custom: Yes
Previously a separate admin page. Consolidated here.

The 5 system profiles (super_admin, manager, supervisor, system_user, viewer) appear as master data values. Their full permission matrices are managed via the Access Profile detail panel (click the value row to open it). Custom profiles are added with "+ New Value" and configured inline.

---

### MODULE: CSAT & COURTESY CALLS

**Group: `csat_survey_type`**
Module: csat_surveys · Field: survey_type · Ordered: No · Allow custom: Yes

| Code | Label |
|---|---|
| `post_go_live` | Post Go-Live |
| `post_hypercare` | Post Hypercare |
| `periodic_check` | Periodic Check |
| `ad_hoc` | Ad Hoc |
| `exit` | Exit Survey |

**Group: `cc_status`**
Module: courtesy_call_assignments · Field: status · Ordered: No · Allow custom: No

| Code | Label | Color |
|---|---|---|
| `pending` | Pending | gray-400 |
| `scheduled` | Scheduled | blue-500 |
| `completed` | Completed | green-500 |
| `overdue` | Overdue | red-500 |
| `deferred` | Deferred | amber-500 |
| `not_required` | Not Required | gray-300 |

---

## 10.6 Master Data Administration Page

**Route:** `/admin/master-data`

### Page Layout — Two-Level Navigation

The Master Data page uses a persistent two-level layout: a module sidebar on the left, and the selected module's groups and values on the right.

```
+------------------------------------------------------------------------------+
|  Master Data                                           [Search all values...] |
+--------------------+---------------------------------------------------------+
|  MODULES           |  TASKS                                                   |
|  ─────────────     |  [Task Status]  [Task Priority]  [Task Type]            |
|  ● Tasks           |                                                          |
|  ○ Projects        |  TASK STATUS                              [+ Add Value]  |
|  ○ Clients         |  +-----------+------------------+----------+---------+  |
|  ○ Meetings        |  | ⠿  🔒    | To Do            | gray-400 | Active  |  |
|  ○ RFAs            |  | ⠿  🔒    | In Progress      | blue-500 | Active  |  |
|  ○ Users           |  | ⠿  🔒    | For Review       | violet   | Active  |  |
|  ○ Pipeline        |  | ⠿  🔒    | Blocked          | red-500  | Active  |  |
|  ○ CSAT            |  | ⠿  🔒    | Done             | green    | Active  |  |
|  ○ BRDs            |  | ⠿  🔒    | Cancelled        | gray-300 | Active  |  |
|  ○ Job Roles       +-----------+------------------+----------+---------+  |
|  ○ Access Profiles |                                                          |
|                    | ⠿=drag   🔒=system (code locked)   ⚙️=configurable logic|
+--------------------+---------------------------------------------------------+
```

### Groups with Configurable Logic Fields (⚙️)

For groups that have `field_schema` defined (client_tier, task_type, milestone_type, risk_likelihood, risk_impact, job_roles, deal_stage), each value row shows a ⚙️ icon and a ▼ expand arrow. Clicking the row or ▼ expands a **Configurable Fields Panel** beneath that row.

**Configurable Fields Panel:**

```
▼  VIP  ●  [Label: VIP]  [Color: gold]   🔒 System value
─────────────────────────────────────────────────────────
⚙️ Configurable Fields

  Courtesy Call Frequency
  [Once a month ▼]
  Drives how many CC assignment records are generated per month for VIP accounts
  ⚠️ Logic field — change takes effect after next CC generation run

  BAU Maintenance Hours / Month
  [8] hours
  Used in Manpower Planning workload calculations
  ⚠️ Logic field

  Max Accounts — Sr. BA        Max Accounts — Jr. BA
  [2]                          [0] (0 = not allowed)

  Include in CST Workload Calculation
  [✓ Yes]

                         [Save Changes]  [Cancel]
```

**Value list table columns:**

| Column | Description |
|---|---|
| ⠿ | Drag handle — enabled only for non-locked groups |
| 🔒 | System value — label and configurable fields editable; code permanently locked |
| ⚙️ | Has configurable logic fields — click to expand the detail panel |
| Label | Click to edit inline |
| Color chip | Click to open color picker |
| Active toggle | Show/hide from all dropdowns system-wide |

**Logic field warning (⚠️):** Fields marked `is_logic_field: true` show a subtle amber note: "Logic field — change takes effect after next [relevant process] run." This tells the admin exactly when the system behavior will change.

**Save behavior:** Changes to configurable fields are saved immediately to `master_data_values.metadata`. The `MasterDataService` cache is invalidated instantly. The next time any system process reads this value's metadata it gets the updated value. No migration, no restart, no code change.

**Retroactive toggle:** For fields where the group sets `allow_retroactive: true` (e.g., `bau_hours_per_month`), the save dialog offers: "Apply this change to existing BAU account projections? [Apply Retroactively] [Apply to New Records Only]."

**"+ Add Value" button:** For groups with `allow_custom_values: true`. Opens an inline form at the bottom of the list including all configurable fields from `field_schema` alongside the standard label/color inputs.

**Connected Logic note on system values:** A subtle info banner appears when hovering over a 🔒 value: "System value — label and configuration fields are editable; code is permanently locked to protect business logic."


## 10.7 Quick-Add from Any Form (ERPNext Pattern)

Every dropdown in the system that is backed by master data supports **inline quick-add** — the same pattern used in ERPNext.

When a user is filling out a form (creating a task, editing a client, logging a meeting) and types a value that does not exist in the dropdown, a "Create new value" option appears at the bottom of the dropdown list:

```
industry field on client form:
+-------------------------------------------+
| Mining                                    |
| Manufacturing                             |
| Pharmaceuticals                           |
| ─────────────────────────────────────── |
| + Add "Mining" to industry list           |
+-------------------------------------------+
```

Clicking "+ Add [value] to [group] list":
1. Creates a new `master_data_values` record with `is_system: false`
2. Selects the new value in the current form field immediately
3. Shows a subtle toast: "Added 'Mining' to the Industry list. [Edit in Master Data →]"

This means admins never need to leave a form to add a missing option. The value is available system-wide from that point forward.

**Who can quick-add:** Controlled by the user's access profile. By default, `super_admin` and `manager` can quick-add to any group. Supervisors can quick-add to groups flagged `allow_user_quick_add: true` (e.g., industry, skill tags). System Users cannot quick-add — they see the dropdown as read-only.

The `allow_user_quick_add` flag is an additional field on `master_data_groups`:

| Field | Type | Default | Description |
|---|---|---|---|
| `allow_user_quick_add` | boolean | false | If true, users with supervisor+ access can add new values directly from forms without going to the Master Data admin page |

---

## 10.8 Access Profiles — Detail Panel

Because Access Profiles have a complex permission matrix that cannot fit in a simple label/color table row, clicking an Access Profile value row opens a full-width detail panel on the right side of the page. This panel is identical to what was previously the standalone "Access Profiles" admin page.

The panel shows: profile name, description, user count with "View Users →" link, the full permission matrix organized by hub with editable checkboxes (for custom profiles), and the new module auto-registration banner when new permissions are available.

System profiles: permission matrix is read-only. Custom profiles: checkboxes are editable inline.

**The standalone `/admin/access-profiles` route is deprecated.** It redirects to `/admin/master-data` with the Access Profiles group selected.

---

## 10.9 Job Roles — Detail Panel

Job Roles also have extra fields (level, short_name, default_access_profile_id, description) that go beyond a simple label/color. Clicking a Job Role row opens a compact detail panel showing these fields as editable form fields (for custom roles) or read-only (for system roles).

**The standalone `/admin/job-roles` route is deprecated.** It redirects to `/admin/master-data` with the Job Roles group selected.

---

## 10.10 The Complete Master Data Page — Two Top-Level Tabs

The Master Data page at `/admin/master-data` is the **single destination for all data configuration** in the system. It combines two capabilities that were previously separate admin pages — Lookup Values and Custom Fields — under one roof, because both serve the same purpose: controlling how data is captured across all modules without code changes.

```
+------------------------------------------------------------------------------+
|  Master Data                                           [Search all values...] |
|  [Lookup Values]    [Custom Fields]                                           |
+--------------------+---------------------------------------------------------+
```

**Tab 1 — Lookup Values** (Sections 10.3–10.9): All dropdown groups and their seeded values. The module sidebar + group tabs layout described above. Rename labels, adjust colors, add custom values, manage Job Roles, manage Access Profiles.

**Tab 2 — Custom Fields** (Section 10.11): Add, edit, and manage additional fields per module. The same module sidebar on the left; the right panel lists all custom fields defined for the selected module. A "+ Add Field" button opens a field editor drawer.

**Why combined:** An admin configuring how data is captured in the system has one place to go. They are not split between "this controls what options appear in dropdowns" (Lookup Values) and "this controls what extra fields exist" (Custom Fields). Both are data configuration. One destination.

**Route consolidation:**
- `/admin/custom-fields` → redirects to `/admin/master-data?tab=custom-fields`
- `/admin/job-roles` → redirects to `/admin/master-data?tab=lookup-values&module=users&group=job_roles`
- `/admin/access-profiles` → redirects to `/admin/master-data?tab=lookup-values&module=users&group=access_profiles`

---

## 10.11 Custom Fields — Consolidated Under Master Data

Custom Fields are no longer a separate Administration page. They are a second major section within the Master Data page, accessible via a top-level tab.

### Why They Belong Here

Master Data controls the **options** available in existing fields (what goes in a dropdown). Custom Fields controls the **addition of new fields** to a module's records. Both are about shaping how data is captured in the system without code changes. Keeping them together in one place means an admin managing how the system captures data has a single destination.

### Master Data Page — Top-Level Tab Structure

The Master Data page now has two top-level tabs at the very top of the page:

```
+------------------------------------------------------------------------------+
|  Master Data                                                                 |
|  [Lookup Values]  [Custom Fields]                                            |
+--------------------+---------------------------------------------------------+
```

**Tab 1: Lookup Values** — everything described in Sections 10.3–10.10 above (all the dropdown groups and seeded values).

**Tab 2: Custom Fields** — the complete custom field management interface, described below.

---

### Custom Fields Tab — Layout

The same two-panel layout as Lookup Values: module sidebar on the left, custom fields for the selected module on the right.

```
+------------------------------------------------------------------------------+
|  Master Data                                                                 |
|  [Lookup Values]  [Custom Fields]                                            |
+--------------------+---------------------------------------------------------+
|  MODULES           |  CUSTOM FIELDS — CLIENTS                [+ Add Field]  |
|  ─────────────     |  ─────────────────────────────────────────────────────  |
|  ● Clients         |  ⠿  Account Owner Notes    Multi-line   List · Card    |
|  ○ Projects        |  ⠿  Preferred Call Day     Select       List · Card    |
|  ○ Tasks           |  ⠿  Contract Value (PHP)   Number       List           |
|  ○ Meetings        |  ⠿  Last Escalation Date   Date         List           |
|  ○ RFAs            |  ⠿  MSME Registered?       Checkbox     List · Card    |
|  ○ BRDs            |  ─────────────────────────────────────────────────────  |
|  ○ Users           |  Showing 5 custom fields for Clients                    |
|  ○ KYC             |                                                          |
|  ○ Milestones      |                                                          |
|  ○ Time Logs       |                                                          |
+--------------------+---------------------------------------------------------+
```

Each module listed in the sidebar corresponds to a `module_name` value in the `custom_field_definitions` table. Clicking a module shows all custom field definitions for that module.

---

### Custom Field List — Columns

| Column | Description |
|---|---|
| ⠿ | Drag handle to reorder fields (controls `sort_order` — the order they appear in the record detail view) |
| Label | The field display name — click to edit inline |
| Type | The field type badge (Short Text, Number, Select, etc.) |
| Shown in | Chips indicating where this field is visible: List (table column toggle-able via Columns button) · Card (Kanban card) |
| Active | Toggle — inactive fields are hidden from all views but their data is preserved |
| Actions | Edit (opens full field editor) · Delete (soft delete with data warning) |

---

### Adding or Editing a Custom Field

Clicking "+ Add Field" or the Edit action on an existing field opens a right-side drawer with the full field configuration form:

```
+------------------------------------------+
|  Custom Field — Clients          [Save]   |
+------------------------------------------+
|  Label:         ________________________  |
|  Field Key:     ________________________  |
|                 (auto-generated; read-only)|
|  Field Type:    [Select (Single)       ▼] |
|                                           |
|  [For Select types — Options section]     |
|  Options:                                 |
|  + Add option   [Daily] [red ▼]  [×]     |
|                 [Weekly][blue ▼] [×]      |
|                 [Monthly][green▼][×]      |
|                                           |
|  Required:      [○]                       |
|  Show in list:  [●]                       |
|  Show in card:  [○]                       |
|                                           |
+------------------------------------------+
```

All field types from the original Custom Fields specification are supported:

| Type | Description |
|---|---|
| Short Text | Single line, max 255 chars |
| Multi-line Text | Rich text, unlimited |
| Number | Integer or decimal; configurable decimal places |
| Date | Date picker |
| Date & Time | Date + time picker |
| Select (Single) | Dropdown with color-coded options; admin configures options here |
| Select (Multi) | Same, allows multiple selections; renders as badge chips |
| Checkbox | Boolean toggle |
| URL | Validated URL, renders as clickable link |
| File Attachment | Uploads to Cloud Storage; renders as downloadable chip |
| Formula | Computed from other fields on the same record; arithmetic, comparison, IF/ELSE, string concat; read-only result |
| Lookup | Pulls a value from a related record via FK path; read-only |
| Rollup | Aggregates across related records (COUNT, SUM, AVG, MIN, MAX); read-only |

For **Select** types, the options are managed directly within the field editor drawer — not in the Lookup Values tab. These are field-specific options that only apply to this one custom field, unlike the master data groups which drive system fields across the whole module.

For **Formula**, **Lookup**, and **Rollup** types, a guided builder assists the admin in constructing the expression — no raw formula syntax required.

---

### Where Custom Fields Appear in Records

Custom fields for a module appear at the bottom of every record's detail view in a collapsible section labeled "Additional Fields." They are shown after all system fields. The section is collapsible so it does not crowd the primary record layout.

In list/table views, custom field columns are hidden by default. They can be toggled on via the "Columns" button in the filter bar. Custom field column headers have a subtle ✦ icon to distinguish them from system columns.

In Kanban card views, custom fields configured with "Show in Card" enabled appear as compact chips on the card.

---

### Quick-Add Custom Field from a Record Form

The same ERPNext-pattern quick-add applies to custom fields. On any record detail view, at the bottom of the "Additional Fields" section, an "+ Add field to [Module]" link is visible to admins and users with custom field management permissions:

```
+--------------------------------------------------------+
|  Additional Fields                              [Edit]  |
|  Account Owner Notes:  Key account — CEO involved      |
|  Contract Value (PHP): 480,000                         |
|                                                        |
|  + Add a field to Clients                              |
+--------------------------------------------------------+
```

Clicking "+ Add a field" opens the same field editor drawer described above, with `module_name` pre-set to the current module. The new field is saved and appears immediately in this record and all records of the same module type — the field definition is module-wide.

---

### Deprecated: Standalone Custom Fields Admin Page

The standalone route `/admin/custom-fields` is deprecated. It redirects to `/admin/master-data` with the Custom Fields tab active and the relevant module pre-selected if the referrer was a module page.

---

## 10.12 ERD for Master Data (Updated)

```
master_data_groups
  └── master_data_values (1:many, via group_id)
        ├── created_by_id → users (nullable for seeded values)
        └── [referenced as string codes across all module tables]

custom_field_definitions
  └── custom_field_values (1:many, via field_def_id + entity_id)
        └── entity_id → [any module record, identified by entity_type string]

Both master_data_groups and custom_field_definitions
are managed from the single route: /admin/master-data
```

All enum fields in the database remain as `string` (storing the `code`) — not foreign keys to `master_data_values`. This preserves query performance while allowing label/color changes without data migrations. The application layer resolves codes to labels at render time using a cached lookup table refreshed every 5 minutes.

---

## 10.4a Configurable Logic Fields — Field Schema Specification

### The Core Principle

This section is the most important design decision in the Master Data module. The principle stated by the system owner is:

> **Not only can you rename a master data value — you can also change the logic behind it.**

The `client_tier` group is the perfect example. VIP tier has a CC frequency of once a month (`monthly`). This frequency drives how many courtesy call records are generated for VIP accounts each month — it is real business logic. If the business decides VIP accounts should be called twice a month, an admin should be able to open the VIP tier row in Master Data, change the frequency field from "Monthly" to "Bi-Monthly", and the system immediately generates two CC records per month for VIP accounts going forward. **No code change. No developer involved.**

This works because configurable logic fields are stored in `master_data_values.metadata` JSONB, and the `master_data_groups.field_schema` JSONB tells the UI how to render those fields as editable form inputs.

### `field_schema` Format

```json
{
  "fields": [
    {
      "key": "cc_frequency",
      "label": "Courtesy Call Frequency",
      "description": "How many times per month a courtesy call must be completed for accounts at this tier",
      "type": "select",
      "options": [
        {"value": "monthly", "label": "Once a month"},
        {"value": "bi_monthly", "label": "Twice a month"},
        {"value": "quarterly", "label": "Once per quarter"},
        {"value": "semi_annual", "label": "Twice a year"},
        {"value": "annual", "label": "Once a year"}
      ],
      "is_logic_field": true,
      "logic_description": "Drives the number of courtesy_call_assignments records generated each month for accounts at this tier",
      "is_editable_for_system_values": true
    },
    {
      "key": "bau_hours_per_month",
      "label": "BAU Maintenance Hours / Month",
      "description": "Estimated hours per month required to maintain one account at this tier in BAU. Used in Manpower Planning calculations.",
      "type": "number",
      "min": 0,
      "max": 40,
      "step": 0.5,
      "is_logic_field": true,
      "logic_description": "Used by the Manpower Planning Advisor to calculate total monthly BAU load",
      "is_editable_for_system_values": true
    }
  ]
}
```

**Field types supported in `field_schema`:** `text`, `number`, `boolean`, `select`, `multi_select`, `color`, `integer`

**`is_logic_field: true`** marks fields whose values are read by system logic (not just displayed). When changing a logic field value, the admin sees a warning: "Changing this field affects how the system behaves. The change will apply to all future records." — with an optional retroactive toggle for fields where it makes sense.

**`is_editable_for_system_values: true`** means even system (🔒) values can have this field edited. The code is still locked, the label is editable, and these configurable fields are editable. Only the `code` is permanently frozen.

### All Groups With Configurable Logic Fields

The following groups have `field_schema` defined. All other groups have label/color only.

---

#### Group: `client_tier` — Field Schema

```json
{
  "fields": [
    {
      "key": "cc_frequency",
      "label": "Courtesy Call Frequency",
      "description": "How many times per period a courtesy call must be completed. Drives CC assignment generation.",
      "type": "select",
      "options": [
        {"value": "monthly", "label": "Once a month"},
        {"value": "bi_monthly", "label": "Twice a month"},
        {"value": "quarterly", "label": "Once per quarter (every 3 months)"},
        {"value": "semi_annual", "label": "Twice a year"},
        {"value": "annual", "label": "Once a year"}
      ],
      "is_logic_field": true,
      "logic_description": "System generates this many courtesy_call_assignment records per period for each account at this tier"
    },
    {
      "key": "bau_hours_per_month",
      "label": "BAU Maintenance Hours / Month",
      "description": "Estimated hours to maintain one account at this tier per month in BAU. Used in Manpower Planning.",
      "type": "number", "min": 0, "max": 40, "step": 0.5,
      "is_logic_field": true
    },
    {
      "key": "managed_by",
      "label": "Managed By (Recommendation)",
      "description": "Recommended team role for accounts at this tier. Used in Account Assignment Advisor.",
      "type": "text",
      "is_logic_field": false
    },
    {
      "key": "max_accounts_per_sr_ba",
      "label": "Max Accounts — Sr. BA",
      "description": "Maximum number of accounts at this tier a Sr. BA should hold. Used in Assignment Advisor warnings.",
      "type": "integer", "min": 0, "max": 20,
      "is_logic_field": true
    },
    {
      "key": "max_accounts_per_jr_ba",
      "label": "Max Accounts — Jr. BA",
      "description": "Maximum number of accounts at this tier a Jr. BA should hold. Use 0 to block Jr. BA assignment.",
      "type": "integer", "min": 0, "max": 20,
      "is_logic_field": true
    },
    {
      "key": "include_in_cst_workload",
      "label": "Include in CST Workload Calculation",
      "description": "If false, accounts at this tier are excluded from all workload and manpower calculations (e.g., Tier 5).",
      "type": "boolean",
      "is_logic_field": true
    }
  ]
}
```

**Corrected seeded values for `client_tier`:**

| Code | Label | cc_frequency | bau_hrs/mo | Max Sr.BA | Max Jr.BA | In Workload |
|---|---|---|---|---|---|---|
| `vip` | VIP | **Once a month** | 8h | 2 | 0 | Yes |
| `1` | Tier 1 | Once a month | 5h | 4 | 2 | Yes |
| `2` | Tier 2 | Twice a month | 3h | — | 4 | Yes |
| `3` | Tier 3 | Once per quarter | 2h | — | 6 | Yes |
| `4` | Tier 4 | Once per quarter | 1h | — | 8 | Yes |
| `5` | Tier 5 | Once a year | 0h | — | — | **No** |

**VIP is once a month, not four times.** This correction supersedes any prior specification in this document or the master instruction.

Note: For Tier 2, "Twice a month" means two separate CC records are generated each month — not that the frequency label says "bi_monthly" internally. The `cc_frequency` value `bi_monthly` maps to 2 records per month in the CC generation logic.

---

#### Group: `task_type` — Field Schema

```json
{
  "fields": [
    {
      "key": "calendar_color_planned",
      "label": "Calendar Color (Planned)",
      "description": "Background color for this task type when shown in the calendar in a planned/upcoming state.",
      "type": "color",
      "is_logic_field": true
    },
    {
      "key": "calendar_color_done",
      "label": "Calendar Color (Done)",
      "description": "Background color for this task type when the task has been completed.",
      "type": "color",
      "is_logic_field": true
    },
    {
      "key": "counts_in_dar_kpi",
      "label": "Counts in DAR KPI",
      "description": "If true, completed tasks of this type are counted in the Daily Activity Rate KPI metric.",
      "type": "boolean",
      "is_logic_field": true
    },
    {
      "key": "triggers_cc_compliance",
      "label": "Triggers CC Compliance Tracking",
      "description": "If true, completing a task of this type marks the linked account's courtesy call as completed for the period.",
      "type": "boolean",
      "is_logic_field": true
    },
    {
      "key": "triggers_f2f_kpi",
      "label": "Can Trigger Annual F2F KPI",
      "description": "If true and is_face_to_face=true on the meeting, completing this task updates the client's face-to-face annual KPI.",
      "type": "boolean",
      "is_logic_field": true
    }
  ]
}
```

---

#### Group: `milestone_type` — Field Schema

```json
{
  "fields": [
    {
      "key": "is_kpi_milestone",
      "label": "Is KPI Milestone",
      "description": "If true, completing this milestone type auto-creates a milestone_log entry for KPI scoring.",
      "type": "boolean",
      "is_logic_field": true
    },
    {
      "key": "kpi_category",
      "label": "KPI Category",
      "description": "Which KPI metric category this milestone feeds. Used in scorecard calculations.",
      "type": "select",
      "options": [
        {"value": "milestone", "label": "Milestone Completion"},
        {"value": "cc_compliance", "label": "Courtesy Call Compliance"},
        {"value": "kyc", "label": "KYC Compliance"},
        {"value": "acquisition", "label": "Acquisition / POC"},
        {"value": "rfa", "label": "RFA Processing"}
      ],
      "is_logic_field": true
    },
    {
      "key": "triggers_news_feed_highlight",
      "label": "Triggers Highlighted News Feed Event",
      "description": "If true, completing this milestone type creates a highlighted (blue border + confetti for go_live) news feed event.",
      "type": "boolean",
      "is_logic_field": true
    }
  ]
}
```

---

#### Group: `risk_likelihood` and `risk_impact` — Field Schema

```json
{
  "fields": [
    {
      "key": "numeric_value",
      "label": "Numeric Value (for risk score calculation)",
      "description": "Risk score = likelihood.numeric_value × impact.numeric_value. Must be a whole number 1–5.",
      "type": "integer", "min": 1, "max": 5,
      "is_logic_field": true,
      "logic_description": "Changing this recalculates risk_score on all open project risks"
    }
  ]
}
```

---

#### Group: `job_roles` — Field Schema

```json
{
  "fields": [
    {
      "key": "level",
      "label": "Hierarchy Level",
      "description": "Determines org chart position and approval chain direction. Lower = more junior. System roles cannot have level changed.",
      "type": "integer", "min": 1, "max": 20,
      "is_logic_field": true,
      "is_editable_for_system_values": false
    },
    {
      "key": "short_name",
      "label": "Short Name",
      "description": "Abbreviated display name e.g., 'Jr. BA'",
      "type": "text",
      "is_logic_field": false
    },
    {
      "key": "default_access_profile_code",
      "label": "Default Access Profile",
      "description": "The access profile automatically assigned when a new user is created with this job role. Can be overridden per user.",
      "type": "select",
      "options_from_group": "access_profiles",
      "is_logic_field": true
    },
    {
      "key": "description",
      "label": "Role Description",
      "description": "Description shown in the org chart and onboarding tracker.",
      "type": "text",
      "is_logic_field": false
    }
  ]
}
```

---

#### Group: `deal_stage` — Field Schema

```json
{
  "fields": [
    {
      "key": "pipeline_probability_percent",
      "label": "Pipeline Probability %",
      "description": "Used by the Manpower Planning Advisor to weight pipeline accounts in capacity projections. A Negotiation account counts as e.g. 70% likely to convert.",
      "type": "integer", "min": 0, "max": 100,
      "is_logic_field": true
    },
    {
      "key": "include_in_manpower_projection",
      "label": "Include in Manpower Projection",
      "description": "If true, accounts at this stage are included in the Manpower Planning workload forecast.",
      "type": "boolean",
      "is_logic_field": true
    }
  ]
}
```

Seeded values:

| Code | Label | Probability % | In Manpower Projection |
|---|---|---|---|
| `prospect` | Prospect | 10% | No |
| `qualified` | Qualified | 25% | No |
| `demo_done` | Demo Done | 40% | No |
| `proposal_sent` | Proposal Sent | 55% | No |
| `negotiation` | Negotiation | 70% | **Yes** |
| `won_pending_onboarding` | Won — Pending Onboarding | 100% | **Yes** |
| `lost` | Lost | 0% | No |

---

### How Configurable Fields Are Read by the System

All system logic that used to reference hardcoded values now reads from `master_data_values.metadata`:

**Before (hardcoded — wrong approach):**
```typescript
// ❌ Never do this
const ccFrequency = tier === 'vip' ? 'monthly' : tier === '2' ? 'bi_monthly' : 'quarterly';
```

**After (data-driven — correct approach):**
```typescript
// ✅ Always do this
const tierValue = await masterDataService.getValue('client_tier', account.tier);
const ccFrequency = tierValue.metadata.cc_frequency; // "monthly", "bi_monthly", etc.
const ccCountPerMonth = ccFrequency === 'monthly' ? 1 
                      : ccFrequency === 'bi_monthly' ? 2
                      : ccFrequency === 'quarterly' ? 0.33 : 0;
```

**The `MasterDataService`** provides:
- `getValue(groupCode, valueCode)` → returns the full value record including metadata
- `getValues(groupCode)` → returns all active values for a group, ordered by sort_order
- `getMetadataField(groupCode, valueCode, fieldKey)` → returns one specific metadata field value
- Results are cached for 5 minutes; cache is invalidated immediately when any master data value is saved

**This means:** when an admin changes the VIP tier's `cc_frequency` from "once a month" to "twice a month" in the Master Data page, the next CC generation run (which calls `getMetadataField('client_tier', 'vip', 'cc_frequency')`) will produce 2 CC assignment records per VIP account instead of 1. No code change. No deployment. Effective immediately after the cache refreshes.

---



---

# PART 11: FINAL DIRECTIVES

All directives are consolidated here. Higher numbers do not mean lower priority — all are equally mandatory.

56. **AI Apps is a personal navigation item, not an admin tool.** ✨ AI Apps is for launching apps. ⚙️ App Builder is for creating apps. These are separate. Do not merge them.

57. **Every app launch plays the full 4-step animation sequence.** Context loading overlay, progress bar with real loading messages, overlay slide-up exit, step navigator fade-in, AI typewriter entrance. Disable all animations when `prefers-reduced-motion: reduce` is detected.

58. **Apps and Skills are distinct.** A Skill is a focused reusable capability (a verb). An App is a structured multi-step workflow (a workflow). Never treat them as the same concept.

59. **The floating chat bubble is always visible on every page.** It is never hidden by content. Its z-index is always the highest on the page.

60. **Voice dictation uses the browser's native Web Speech API with `continuous: true` everywhere in the system — globally, without exception, and non-negotiably.** This applies to: the AI Assistant chat, Team Chat, the Skills Builder, the App Builder, BRD voice notes, meeting transcription triggers, and any future feature that accepts voice input. No part of the system may use OpenAI Whisper, Google Cloud STT, Azure Cognitive Services, or any other paid speech-to-text API for the dictation feature. Hybrid implementations are forbidden — there is no scenario where one part of the system uses the Web Speech API and another uses a paid alternative. The implementation code must always set `recognition.continuous = true` and `recognition.lang = 'en-PH'`. The recording starts when the user presses 🎤 and ends only when the user presses ✅ Stop. Silence never stops the recording. If a browser does not support the Web Speech API (Firefox), the microphone button is hidden with a tooltip directing the user to Chrome or Edge. This directive overrides any conflicting specification anywhere in this document or in the master instruction.

61. **The AI Assistant reads live system data via the Agent Data Tool Registry.** It is not a general-purpose chatbot. It can read records, create records, and schedule meetings using real system data.

62. **App Creator permission is separate from system role.** Any user can be granted the ability to build apps without changing their role. Created apps are Personal by default and require admin approval before team publication.

63. **All chat messages are stored in the CST OS PostgreSQL database.** No external chat service is used.

64. **The Email Sender skill always shows a draft before sending.** The AI must never call `send_email` without explicit user confirmation. No exceptions.

65. **Chat attachments use Google Drive links only.** Binary file data never enters the CST OS database or Cloud Storage for chat purposes. Only the URL and cached metadata are stored.

66. **Internal record links in chat enforce system access controls.** The chat message contains only the record type and ID. The system's role-based access determines what the recipient sees when they open the link.

67. **"Tasks" is the correct navigation label, not "My Tasks."** The page is role-aware. BAs see their personal tasks by default. Supervisors have a "My Team" context option. Managers have a "Department" context option with the full org-tree selector.

68. **All task filters support multi-select.** Every filter on the Tasks page allows multiple simultaneous selections. Filter combinations can be saved as named views per user.

69. **The Template Library is the single source of truth for all document templates.** No template file paths or Google Doc template IDs may be hardcoded in application code. All document generation skills and apps must read the active template via `get_active_template`.

70. **Every document template must have a knowledge file.** Without a knowledge file, the PowerPoint Generator and Google Docs Generator skills must fail gracefully: "This template does not have a knowledge file configured. Ask your admin to add one in the Template Library."

71. **Template changes are non-retroactive for existing documents.** When a new template version is activated, previously generated documents keep their original template reference.

72. **The Proposal Maker App is the correct tool for commercial proposals.** The Recommendation Deck Generator is for technical post-fit-gap presentations. Do not merge these tools.

73. **Job Roles and Access Profiles are master data, not hardcoded enums.** The `role` enum on the `users` table is replaced by two FK fields: `job_role_id` and `access_profile_id`. All access control decisions use the `access_profiles.permissions` JSONB. All org chart hierarchy decisions use `job_roles.level`. Never hardcode a role name in any access check — always resolve through the permissions table.

74. **New modules automatically register their permission keys.** When a module is added, it registers its feature permission keys in the `permission_registry` table and triggers a System Health flag: "New permissions available — review access profiles." New permissions default to `false` (deny). No access is ever granted silently when a module is added.

75. **Custom access profiles can be created by cloning an existing profile.** Custom profiles can be deleted (soft delete). Deleting a profile does not remove it from currently assigned users — it triggers a System Health warning requiring admin action.

76. **Access profile changes take effect on the user's next page load.** No logout required. The session's permission context is refreshed on each navigation event by re-reading the user's `access_profile_id → permissions` from the database.

77. **Every AI assistant action creates a permanent record in `ai_jobs`.** This table is never truncated, never soft-deleted, never purged. It is the audit trail. The `instruction_text` field stores the user's original words verbatim — not a paraphrase.

78. **Scheduled AI jobs respect working days.** If a job is scheduled for a non-working day (weekend or Philippine public holiday), it is held and delivered at 9:00 AM on the next working day. The user is informed of this adjustment at scheduling time, before they confirm. The scheduler never fires on non-working days.

79. **The Job Queue is accessible from Tab 2 of the My Assistant page.** Every team member can see their own job history at `/assistant/jobs`. Supervisors and managers can see their direct reports' job queues for oversight. Admins can see the full organization's job queue in Admin → AI Cost Monitor (the job table is also a cost attribution record).

80. **The Capabilities page at `/assistant/capabilities` is data-driven.** It reads from the `skills` table — specifically `description`, `example_prompts`, and `voice_enabled`. When a new skill is added to the system, its capability card appears on this page automatically with no manual page updates required.

81. **The `example_prompts` JSONB field is required on every skill.** Minimum 4 example phrases per skill. These are shown on the Capabilities page so team members know exactly what to ask. They are also used by the assistant itself as few-shot examples in the skill's CLAUDE.md context.

82. **My Assistant is a first-class navigation destination, not just a floating widget.** The `/assistant` route is a full-page experience with three tabs (Chat, Job Queue, Capabilities). The floating bubble is a shortcut to the Chat tab of this same page. Both represent the same assistant — they share conversation history and job state.

83. **Skill Creator permission is separate from App Creator permission.** Admin can grant either or both independently. Skill Creator is a lower-privilege entry point — suitable for team members who want to build a focused capability without managing a full multi-step App workflow. Both require admin approval before team-wide publication.

84. **The Skills Builder is AI-guided via a persistent chat panel.** The two-panel layout (form left, AI Guide chat right) is mandatory. The AI Guide knows every Agent Data Tool, the full data model, and CLAUDE.md best practices. It can generate the full skill configuration from a plain-language description, explain any field on request, write and refine the CLAUDE.md via conversation, and warn about potential issues (e.g., exposing sensitive data to wrong roles). The creator never needs to know how to write a prompt from scratch.

85. **Every dropdown selection field in the system is backed by master data.** No selection list may be hardcoded as an application-layer enum that is not manageable from the Master Data page at `/admin/master-data`. The only exception is boolean toggles (true/false). All other predefined option lists — statuses, priorities, types, stages, tiers, industries, categories — are `master_data_values` records.

86. **Enum values are stored as string codes in the database, not as foreign keys.** `tasks.status = "in_progress"` is a string, not a UUID FK to `master_data_values`. The application layer resolves codes to display labels and colors at render time using a cached lookup (refreshed every 5 minutes). This preserves query performance and prevents migrations when labels change.

87. **System values (🔒) can be renamed but their code cannot be changed.** Any business logic that references a master data value does so by `code`. Changing a label from "In Progress" to "Active" is safe. Changing the code `in_progress` to anything else would break the milestone cascade trigger. The Admin UI enforces this: the code field is read-only for system values; only the label, color, and icon are editable.

88. **Quick-add from any form is available for groups with `allow_user_quick_add: true`.** When a user types a value not in a dropdown, a "+ Add [value] to [group] list" option appears. The new value is created as a custom `master_data_value` and selected immediately without leaving the form. Access to quick-add is controlled by the user's access profile.

89. **Job Roles and Access Profiles are now managed inside Master Data.** The standalone routes `/admin/job-roles` and `/admin/access-profiles` redirect to `/admin/master-data` with the relevant group selected. The Administration nav shows one "Master Data" item, not separate items for roles and profiles.

90. **Custom Fields are managed inside the Master Data page under the "Custom Fields" tab.** The standalone route `/admin/custom-fields` is deprecated and redirects to `/admin/master-data?tab=custom-fields`. The Administration nav item "Custom Fields" is removed. Master Data is the single destination for all data-shaping administration: both what options exist in existing fields (Lookup Values tab) and what additional fields exist on a record (Custom Fields tab). Do not create a separate admin page for either concern.

91. **Custom fields are added per module, not per record.** When an admin adds a custom field to the Clients module, that field appears on every client record in the system. Custom fields cannot be scoped to individual records. They are schema-level additions to a module's record type.

92. **Custom field Select options are mini master data groups.** When a Select (Single) or Select (Multi) custom field is created, its options are stored as `master_data_values` records linked to that field definition. They are managed inline in the field editor drawer using the same color-chip option builder used throughout Master Data. They are not free-text strings.

93. **Configurable logic fields in master data drive system behavior — no hardcoded values.** Any system process that uses a tier-based CC frequency, BAU maintenance hours, task type calendar colors, milestone type KPI flags, risk score numerics, or deal stage probabilities must read from `MasterDataService.getMetadataField(groupCode, valueCode, fieldKey)`. When an admin changes a logic field in Master Data, the system behavior changes at the next process run without any code deployment. Claude Code must implement all such logic as data-driven reads — never as hardcoded if/switch statements referencing tier names, type names, or status names by string literal.

94. **VIP tier CC frequency is once a month.** The correct seeded value for `client_tier.vip.cc_frequency` is `monthly` — one CC record generated per month per VIP account. Any prior specification stating four times per month is incorrect and superseded by this directive.

---

*End of CST OS Supplemental Specification — Version 2.0 (Consolidated)*

*This supplement must be read alongside CST_OS_MODULE_SPECS_V3.md. All future refinements are merged into this document — never appended as a new bottom section.*

