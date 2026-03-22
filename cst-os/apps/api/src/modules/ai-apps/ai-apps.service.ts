import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { AiSkillRunner } from '../../shared/ai/ai-skill.runner';
import { CreateSessionDto } from './dto/create-session.dto';
import { CreateAppDto } from './dto/create-app.dto';

// ── System app definitions ─────────────────────────────────────────────────────

const SYSTEM_APPS = [
  {
    code: 'brd-maker',
    name: 'BRD Maker',
    description: '6-step guided BRD generation with fit-gap integration and Google Docs output.',
    category: 'document_generation',
    icon: 'FileCode2',
    claudeMdInstruction: `You are the BRD Maker for CST OS. Guide the user step by step through creating a Business Requirements Document (BRD) for a Tarkie implementation project.

Steps:
1. **Setup** — Confirm project context (client, project type, scope)
2. **Deep Dive** — Gather business process details, stakeholders, and current pain points
3. **User Stories** — Co-create user stories per platform (Field App, Manager App, Dashboard, API)
4. **Acceptance Criteria** — Define measurable acceptance criteria for each user story
5. **Generate** — Draft the full BRD document in structured format
6. **Finalize** — Review, adjust, and confirm document for output

Be conversational, thorough, and ask clarifying questions at each step. When generating, follow BRD structure: Executive Summary → Background → Scope → Stakeholders → As-Is / To-Be → Fit-Gap → Functional Requirements → User Stories → Constraints → Priorities → Approval.`,
    steps: [
      { id: 'setup', label: 'Setup', prompt: 'Confirm project context' },
      { id: 'deep_dive', label: 'Deep Dive', prompt: 'Gather business process details' },
      { id: 'user_stories', label: 'User Stories', prompt: 'Create user stories' },
      { id: 'acceptance', label: 'Acceptance Criteria', prompt: 'Define acceptance criteria' },
      { id: 'generate', label: 'Generate', prompt: 'Draft BRD document' },
      { id: 'finalize', label: 'Finalize', prompt: 'Review and confirm output' },
    ],
  },
  {
    code: 'timeline-maker',
    name: 'Timeline Maker',
    description: 'Create official, projected, or revised project timelines using baseline norms and PH holidays.',
    category: 'planning',
    icon: 'Calendar',
    claudeMdInstruction: `You are the Timeline Maker for CST OS. Help create project timelines based on Tarkie implementation baseline norms.

Timeline scenarios:
- **New Projected** — Draft estimate before official kickoff
- **New Official** — Activated timeline that drives the project
- **Revision** — Adjust an existing timeline (requires RFA draft)

Always account for:
- Philippine non-working holidays
- Weekends excluded from working day counts
- Phase-specific working day norms (from baseline)
- Team capacity and concurrent projects

Output format: JSON with phase_dates, start_date, projected_go_live_date, total_working_days, and revision notes if applicable.`,
    steps: [
      { id: 'context', label: 'Project Context', prompt: 'Gather project and team details' },
      { id: 'scenario', label: 'Timeline Type', prompt: 'Select new/official/revision' },
      { id: 'phases', label: 'Phase Planning', prompt: 'Define phase durations' },
      { id: 'review', label: 'Review', prompt: 'Confirm timeline and output' },
    ],
  },
  {
    code: 'fit-gap-analyzer',
    name: 'Fit-Gap Analyzer',
    description: 'Classify business requirements as Fit / Partial Fit / Gap / Out of Scope, with auto-RFA creation.',
    category: 'analysis',
    icon: 'Layers',
    claudeMdInstruction: `You are the Fit-Gap Analyzer for CST OS. Analyze client business requirements against Tarkie's standard feature set.

Classification:
- **Fit** — Requirement fully covered by Tarkie standard features
- **Partial Fit** — Requirement partially covered; configuration or workaround possible
- **Gap** — Requirement not covered; customization or RFA needed
- **Out of Scope** — Requirement outside the agreed implementation scope

For each Gap or Partial Fit, flag whether an RFA should be created automatically.

Output: Structured fit-gap table with columns: Requirement, Classification, Tarkie Feature/Coverage, Gap Notes, RFA Required (Y/N).`,
    steps: [
      { id: 'context', label: 'Context', prompt: 'Gather client and project context' },
      { id: 'discovery', label: 'Process Discovery', prompt: 'List business requirements' },
      { id: 'analysis', label: 'Gap Analysis', prompt: 'Analyze each requirement' },
      { id: 'classify', label: 'Classification', prompt: 'Classify fit/gap/partial' },
      { id: 'table', label: 'Generate Table', prompt: 'Produce fit-gap table' },
      { id: 'rfas', label: 'Create RFAs', prompt: 'Auto-create RFAs for gaps' },
    ],
  },
  {
    code: 'kickoff-questionnaire',
    name: 'Kickoff Questionnaire Generator',
    description: 'Industry-specific questionnaire generator covering company overview, process deep-dive, and technical readiness.',
    category: 'document_generation',
    icon: 'CheckSquare',
    claudeMdInstruction: `You are the Kickoff Questionnaire Generator for CST OS. Create a structured pre-kickoff questionnaire tailored to the client's industry and project type.

Three sections:
1. **Company Overview** — Organization structure, key stakeholders, business model
2. **Current Process Deep Dive** — Existing workflows, pain points, manual processes being replaced
3. **Technical Readiness** — Device inventory, internet connectivity, IT resources, data migration scope

Tailor questions to the industry (logistics, FMCG, retail, services, etc.) and Tarkie deployment type (field force, merchandising, distribution).`,
    steps: [
      { id: 'context', label: 'Client Context', prompt: 'Gather industry and project type' },
      { id: 'generate', label: 'Generate', prompt: 'Produce questionnaire' },
      { id: 'review', label: 'Review', prompt: 'Finalize and output' },
    ],
  },
  {
    code: 'process-flow-generator',
    name: 'Process Flow Generator',
    description: 'Generate Mermaid diagrams for current-state, future-state, system, and data flows.',
    category: 'document_generation',
    icon: 'Network',
    claudeMdInstruction: `You are the Process Flow Generator for CST OS. Generate Mermaid diagram code for Tarkie implementation process flows.

Flow types:
- **Current State** — How the client's process works today (manual/existing system)
- **Future State** — How the process will work with Tarkie
- **System Flow** — Technical system interactions (API calls, data sync, integrations)
- **Data Flow** — How data moves through the system (input → processing → output)

Always output valid Mermaid flowchart or sequence diagram syntax. Label all nodes clearly.`,
    steps: [
      { id: 'context', label: 'Context', prompt: 'Identify process and flow type' },
      { id: 'discovery', label: 'Discovery', prompt: 'Map current process steps' },
      { id: 'design', label: 'Design', prompt: 'Design the target flow' },
      { id: 'generate', label: 'Generate Diagram', prompt: 'Output Mermaid code' },
    ],
  },
  {
    code: 'reco-deck-generator',
    name: 'Recommendation Deck Generator',
    description: '15-slide recommendation deck with Google Slides output.',
    category: 'document_generation',
    icon: 'BarChart3',
    claudeMdInstruction: `You are the Recommendation Deck Generator for CST OS. Create a structured 15-slide project recommendation deck.

Slide structure:
1. Cover, 2. Agenda, 3. Business Understanding, 4. Current Challenges, 5. Proposed Solution,
6. Scope, 7. Feature Map, 8. Gap Analysis Summary, 9. Customizations Required,
10. Implementation Timeline, 11. Milestones, 12. Proposed Team, 13. Client Deliverables,
14. Next Steps, 15. Q&A

For each slide, provide: slide title, key message (1-2 sentences), bullet points (3-5), and any suggested visuals.`,
    steps: [
      { id: 'context', label: 'Project Context', prompt: 'Gather client and solution context' },
      { id: 'content', label: 'Content Gathering', prompt: 'Collect details per slide section' },
      { id: 'generate', label: 'Generate Deck', prompt: 'Draft slide-by-slide content' },
      { id: 'finalize', label: 'Finalize', prompt: 'Review and output' },
    ],
  },
  {
    code: 'uat-generator',
    name: 'UAT Document Generator',
    description: 'UAT overview, test scenarios (happy path, edge, validation), issue log template, and sign-off.',
    category: 'document_generation',
    icon: 'FileText',
    claudeMdInstruction: `You are the UAT Document Generator for CST OS. Create a comprehensive User Acceptance Testing document.

Sections:
1. UAT Overview — Scope, objectives, entry/exit criteria, schedule
2. Test Environment — Devices, accounts, test data requirements
3. Test Scenarios — Happy path + edge cases + validation scenarios per platform
4. Issue Log Template — Issue ID, description, severity, steps to reproduce, status
5. Sign-off — CST and client sign-off blocks

Generate test scenarios covering: Field App workflows, Manager App workflows, Dashboard views, and API integrations based on the project's BRD scope.`,
    steps: [
      { id: 'context', label: 'Project Context', prompt: 'Gather scope and BRD reference' },
      { id: 'scenarios', label: 'Test Scenarios', prompt: 'Define test scenarios' },
      { id: 'generate', label: 'Generate Document', prompt: 'Draft full UAT document' },
      { id: 'review', label: 'Review', prompt: 'Finalize and output' },
    ],
  },
  {
    code: 'training-deck-generator',
    name: 'Training Deck Generator',
    description: 'Admin (12 slides) and User training decks with optional Tagalog-English code-switching.',
    category: 'document_generation',
    icon: 'BarChart3',
    claudeMdInstruction: `You are the Training Deck Generator for CST OS. Create training presentations for Tarkie end users.

Two types:
- **Admin Training** (12 slides): System configuration, user management, reports, troubleshooting
- **User Training** (variable): Step-by-step task walkthroughs in simple language

Language option: Tagalog-English code-switching (Taglish) for Philippine users — use conversational Taglish if requested.

Format each slide as: Title → Learning Objective → Step-by-step content → Practice exercise.`,
    steps: [
      { id: 'type', label: 'Training Type', prompt: 'Admin or User training? Language preference?' },
      { id: 'scope', label: 'Scope', prompt: 'Define modules/features to cover' },
      { id: 'generate', label: 'Generate', prompt: 'Draft training deck' },
      { id: 'review', label: 'Review', prompt: 'Finalize and output' },
    ],
  },
  {
    code: 'data-validator',
    name: 'Data Validation Tool',
    description: 'Validates employee, territory, product, and customer masterdata files row-by-row.',
    category: 'validation',
    icon: 'CheckSquare',
    claudeMdInstruction: `You are the Data Validation Tool for CST OS. Validate client masterdata files before Tarkie upload.

Validate these file types:
- **Employee** — Required: employee_id, full_name, email, role, supervisor_id
- **Territory** — Required: territory_code, territory_name, region
- **Product** — Required: product_code, product_name, category, price
- **Customer** — Required: customer_code, company_name, address, assigned_employee

Checks: required fields, no duplicates (by ID/code), date format (YYYY-MM-DD), email format, numeric fields, reference integrity (supervisor exists in employee list), UTF-8 encoding.

Output: JSON with valid_rows[], error_rows[] (with row_number and error_description), summary counts.`,
    steps: [
      { id: 'upload', label: 'Upload Data', prompt: 'Paste or describe the data to validate' },
      { id: 'validate', label: 'Validation', prompt: 'Run validation checks' },
      { id: 'report', label: 'Report', prompt: 'Review validation results' },
    ],
  },
  {
    code: 'kyc-generator',
    name: 'KYC Form Generator',
    description: '7-section KYC document with versioning, Google Docs output, and auto KYC milestone.',
    category: 'document_generation',
    icon: 'FileText',
    claudeMdInstruction: `You are the KYC Form Generator for CST OS. Generate a structured Know Your Client (KYC) document for Tarkie implementation clients.

7 sections:
1. **Company Profile** — Legal name, industry, address, company size, decision makers
2. **Subscription Details** — Plan, modules, number of users, contract dates
3. **Stakeholder Map** — Key contacts with roles, decision authority, communication preferences
4. **Tarkie Configuration** — Territory setup, workflow configuration, custom fields needed
5. **Relationship History** — How client was acquired, previous touchpoints, key milestones
6. **Account Health** — Current health score, risk indicators, CSAT history
7. **Account Notes** — Free-form internal notes and action items

Use all available context (client profile, projects, meetings, CSAT) to pre-fill where possible. Ask for missing information.`,
    steps: [
      { id: 'context', label: 'Client Context', prompt: 'Load client data and identify gaps' },
      { id: 'sections', label: 'Section Deep-Dive', prompt: 'Complete each KYC section' },
      { id: 'generate', label: 'Generate Document', prompt: 'Draft full KYC document' },
      { id: 'review', label: 'Review', prompt: 'Finalize and save as new version' },
    ],
  },
  {
    code: 'mom-generator',
    name: 'Meeting MOM Generator',
    description: '5-section MOM from transcript or notes: Objectives, Discussion, Decisions, Action Items, Next Steps.',
    category: 'document_generation',
    icon: 'MessageSquare',
    claudeMdInstruction: `You are the Meeting MOM Generator for CST OS. Extract and format a Minutes of Meeting (MOM) document from a meeting transcript or notes.

5 sections:
1. **Objectives** — Purpose and goals of the meeting
2. **Discussion Points** — Key topics discussed with brief summaries
3. **Decisions Made** — Specific decisions reached (who decided, what was decided)
4. **Action Items** — Task, owner, due date (formatted as table)
5. **Next Steps** — Follow-up meetings, pending items, upcoming milestones

Also extract:
- Extracted risks/issues (flag for project risk log)
- Quotes or key statements worth capturing

Output clean, professional MOM in plain language suitable for sharing with clients.`,
    steps: [
      { id: 'input', label: 'Meeting Input', prompt: 'Paste transcript or meeting notes' },
      { id: 'extract', label: 'Extract', prompt: 'Extract key points' },
      { id: 'generate', label: 'Generate MOM', prompt: 'Draft formatted MOM' },
      { id: 'review', label: 'Review', prompt: 'Finalize and save' },
    ],
  },
  {
    code: 'mockup-generator',
    name: 'Mockup Generator',
    description: 'UI/UX screen specifications for Tarkie Field App, Dashboard, and Manager App customizations.',
    category: 'design',
    icon: 'Layers',
    claudeMdInstruction: `You are the Mockup Generator for CST OS. Create detailed UI/UX screen specifications for Tarkie customizations.

Tarkie component library:
- **Field App** — Mobile screens: task list, customer visit, form submission, GPS tracking
- **Manager App** — Dashboard overview, team monitoring, approval workflows
- **Dashboard** — Web-based analytics, reports, territory maps

For each screen, provide:
- Screen name and navigation path
- Layout description (header, body, footer components)
- Interactive elements (buttons, forms, dropdowns)
- Data fields displayed
- User actions and their outcomes
- Edge cases and empty states

Output as structured specification, not actual design files.`,
    steps: [
      { id: 'context', label: 'Customization Context', prompt: 'What needs to be customized?' },
      { id: 'screens', label: 'Screen Planning', prompt: 'Identify screens needed' },
      { id: 'specs', label: 'Specifications', prompt: 'Describe each screen in detail' },
      { id: 'review', label: 'Review', prompt: 'Finalize mockup specs' },
    ],
  },
  {
    code: 'assignment-advisor',
    name: 'Account Assignment Advisor',
    description: 'AI-ranked account assignment recommendations based on workload, tier distribution, and capacity.',
    category: 'planning',
    icon: 'Users',
    claudeMdInstruction: `You are the Account Assignment Advisor for CST OS. Recommend optimal account-to-PM assignments based on team capacity and workload balance.

Ranking factors:
- Current workload (open projects × estimated hours)
- Tier distribution (A/B/C/D tier balance per PM)
- Industry experience match
- Geographic proximity (if applicable)
- Existing client relationships
- Capacity hours per week vs committed load

Always present as advisory (not auto-applied). Output ranked recommendation table with rationale for top recommendation.`,
    steps: [
      { id: 'context', label: 'Context', prompt: 'Which accounts need assignment?' },
      { id: 'analyze', label: 'Analyze Capacity', prompt: 'Review team workload and capacity' },
      { id: 'recommend', label: 'Recommend', prompt: 'Generate ranked recommendations' },
    ],
  },
  {
    code: 'progress-report',
    name: 'Progress Report Generator',
    description: '9-section project progress report pulling all task, milestone, and risk data automatically.',
    category: 'document_generation',
    icon: 'FileText',
    claudeMdInstruction: `You are the Progress Report Generator for CST OS. Generate a structured project progress report by pulling all available project data.

9 sections:
1. **Header** — Project name, client, reporting period, prepared by
2. **Executive Summary** — Overall status (🟢/🟡/🔴), 2-3 sentence summary
3. **Overall Status** — Phase, % complete, health score
4. **Milestone Table** — Planned vs actual dates, completion status, quality notes
5. **Accomplishments** — Key completions in this reporting period
6. **Next Period Plan** — Planned activities for next 2 weeks
7. **Issues & Risks** — Open risks, blockers, escalation items
8. **Hours Summary** — Logged vs estimated hours per phase
9. **Client Deliverables** — Pending and completed deliverables

Minimize manual input — read all data from the project record and ask only for what's missing.`,
    steps: [
      { id: 'load', label: 'Load Project', prompt: 'Select project to report on' },
      { id: 'period', label: 'Reporting Period', prompt: 'Confirm reporting period' },
      { id: 'gather', label: 'Data Gathering', prompt: 'Confirm any missing data' },
      { id: 'generate', label: 'Generate Report', prompt: 'Draft progress report' },
      { id: 'review', label: 'Review', prompt: 'Finalize and output' },
    ],
  },
  {
    code: 'manpower-advisor',
    name: 'Manpower Planning Advisor',
    description: '6-section capacity analysis: Current Load, Capacity, Pipeline Projection, Utilization, Assessment, Sensitivity.',
    category: 'planning',
    icon: 'Users',
    claudeMdInstruction: `You are the Manpower Planning Advisor for CST OS. Analyze current and projected team capacity to provide hiring and resource recommendations.

6 sections:
1. **Current Load** — Active projects × estimated hours per team member
2. **Team Capacity** — Hours/week × available weeks per member
3. **Pipeline Projection** — Potential projects from acquisition pipeline × estimated load
4. **Projected Utilization** — Combined current + pipeline load vs total capacity (%)
5. **Assessment** — Risk assessment: can the team absorb the pipeline without quality impact?
6. **Sensitivity Analysis** — What if 1-2 key staff leave? What triggers the hiring threshold?

Output hiring recommendation with specific role, timing, and rationale. Always note assumptions.`,
    steps: [
      { id: 'load', label: 'Current Load', prompt: 'Review current team commitments' },
      { id: 'capacity', label: 'Team Capacity', prompt: 'Assess individual capacities' },
      { id: 'pipeline', label: 'Pipeline Review', prompt: 'Review acquisition pipeline' },
      { id: 'projection', label: 'Utilization Projection', prompt: 'Calculate projected utilization' },
      { id: 'recommend', label: 'Recommendation', prompt: 'Generate hiring recommendation' },
      { id: 'sensitivity', label: 'Sensitivity Analysis', prompt: 'Run sensitivity scenarios' },
    ],
  },
];

@Injectable()
export class AiAppsService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private runner: AiSkillRunner,
  ) {}

  // ── Seed system apps on startup ─────────────────────────────────────────────

  async onModuleInit() {
    await this.seedSystemApps();
  }

  private async seedSystemApps() {
    for (const app of SYSTEM_APPS) {
      await this.prisma.aiApp.upsert({
        where: { id: app.code },
        update: {
          name: app.name,
          description: app.description,
          claudeMdInstruction: app.claudeMdInstruction,
          steps: app.steps,
          isSystemApp: true,
          canBeDeleted: false,
        },
        create: {
          id: app.code,
          name: app.name,
          description: app.description,
          icon: app.icon,
          category: app.category as any,
          claudeMdInstruction: app.claudeMdInstruction,
          steps: app.steps,
          isSystemApp: true,
          canBeDeleted: false,
        },
      });
    }
  }

  // ── App CRUD ─────────────────────────────────────────────────────────────────

  async findAll(userId?: string) {
    return this.prisma.aiApp.findMany({
      orderBy: [{ isSystemApp: 'desc' }, { name: 'asc' }],
      include: {
        createdBy: { select: { id: true, fullName: true } },
        shareGrants: { include: { user: { select: { id: true, fullName: true } } } },
        _count: { select: { sessions: true } },
      },
    });
  }

  async findMine(userId: string) {
    return this.prisma.aiApp.findMany({
      where: { createdById: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: { select: { id: true, fullName: true } },
        shareGrants: { include: { user: { select: { id: true, fullName: true } } } },
      },
    });
  }

  async findSharedWithMe(userId: string) {
    const grants = await this.prisma.appShareGrant.findMany({
      where: { userId },
      include: {
        app: {
          include: {
            createdBy: { select: { id: true, fullName: true } },
          },
        },
      },
    });
    return grants.map((g) => ({ ...g.app, permission: g.permission }));
  }

  async findOne(id: string) {
    const app = await this.prisma.aiApp.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, fullName: true } },
        shareGrants: { include: { user: { select: { id: true, fullName: true } } } },
      },
    });
    if (!app) throw new NotFoundException(`AI App '${id}' not found`);
    return app;
  }

  async create(dto: CreateAppDto, userId: string) {
    return this.prisma.aiApp.create({
      data: {
        name: dto.name,
        description: dto.description,
        icon: dto.icon,
        category: (dto.category as any) ?? 'document_generation',
        claudeMdInstruction: dto.claudeMdInstruction,
        steps: dto.steps,
        isSystemApp: false,
        canBeDeleted: true,
        createdById: userId,
        sharedWith: (dto as any).sharedWith ?? 'private',
      },
      include: { createdBy: { select: { id: true, fullName: true } } },
    });
  }

  async update(id: string, dto: Partial<CreateAppDto> & { sharedWith?: string; disabledReason?: string; disabled?: boolean; maxContextTokens?: number }) {
    await this.findOne(id);
    return this.prisma.aiApp.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.claudeMdInstruction !== undefined && { claudeMdInstruction: dto.claudeMdInstruction }),
        ...(dto.steps !== undefined && { steps: dto.steps }),
        ...(dto.sharedWith !== undefined && { sharedWith: dto.sharedWith }),
        ...(dto.maxContextTokens !== undefined && { maxContextTokens: dto.maxContextTokens }),
        ...(dto.disabled === true && { disabledAt: new Date(), disabledReason: dto.disabledReason ?? null }),
        ...(dto.disabled === false && { disabledAt: null, disabledReason: null }),
      },
    });
  }

  // ── Share grants ─────────────────────────────────────────────────────────────

  async grantShare(appId: string, userId: string, permission: string, grantedById: string) {
    return this.prisma.appShareGrant.upsert({
      where: { appId_userId: { appId, userId } },
      update: { permission, grantedById },
      create: { appId, userId, permission, grantedById },
      include: { user: { select: { id: true, fullName: true } } },
    });
  }

  async revokeShare(appId: string, userId: string) {
    await this.prisma.appShareGrant.deleteMany({ where: { appId, userId } });
    return { ok: true };
  }

  async getShareGrants(appId: string) {
    return this.prisma.appShareGrant.findMany({
      where: { appId },
      include: {
        user: { select: { id: true, fullName: true, role: true } },
        grantedBy: { select: { id: true, fullName: true } },
      },
    });
  }

  // ── Sessions ─────────────────────────────────────────────────────────────────

  async createSession(appCode: string, userId: string, dto: CreateSessionDto) {
    const app = await this.findOne(appCode);
    return this.prisma.aiAppSession.create({
      data: {
        appId: app.id,
        userId,
        projectId: dto.projectId,
        clientId: dto.clientId,
        taskId: dto.taskId,
        context: dto.context as any,
        messages: [],
        status: 'active',
      },
      include: { app: true },
    });
  }

  async getSession(sessionId: string) {
    const session = await this.prisma.aiAppSession.findUnique({
      where: { id: sessionId },
      include: { app: true },
    });
    if (!session) throw new NotFoundException('Session not found');
    return session;
  }

  async listSessions(userId: string) {
    return this.prisma.aiAppSession.findMany({
      where: { userId },
      include: { app: { select: { id: true, name: true, icon: true } } },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    });
  }

  // ── Streaming message ─────────────────────────────────────────────────────────

  async streamMessage(
    sessionId: string,
    content: string,
    onChunk: (chunk: string) => void,
  ): Promise<string> {
    const session = await this.getSession(sessionId);
    const app = session.app;

    // Build message history
    const history: { role: 'user' | 'assistant'; content: string }[] =
      Array.isArray(session.messages) ? (session.messages as any[]) : [];
    history.push({ role: 'user', content });

    let fullResponse = '';

    await this.runner.stream(
      {
        systemPrompt: app.claudeMdInstruction ?? `You are ${app.name}, an AI assistant for CST OS.`,
        messages: history,
        context: session.context as Record<string, unknown> | undefined,
      },
      (chunk) => {
        fullResponse += chunk;
        onChunk(chunk);
      },
    );

    // Persist updated messages
    const updated = [...history, { role: 'assistant' as const, content: fullResponse }];
    await this.prisma.aiAppSession.update({
      where: { id: sessionId },
      data: { messages: updated as any, output: fullResponse },
    });

    return fullResponse;
  }
}
