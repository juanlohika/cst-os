import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Courtesy Call Tiers ────────────────────────────────────────────────────
  await prisma.courtesyCallTier.upsert({
    where: { tierNumber: 1 },
    create: { tierNumber: 1, tierName: 'VIP', callFrequency: 'monthly', callsPerPeriod: 1, description: 'Monthly calls' },
    update: {},
  });
  await prisma.courtesyCallTier.upsert({
    where: { tierNumber: 2 },
    create: { tierNumber: 2, tierName: 'Tier 2', callFrequency: 'bi-monthly', callsPerPeriod: 1, description: 'Every 2 months' },
    update: {},
  });
  await prisma.courtesyCallTier.upsert({
    where: { tierNumber: 3 },
    create: { tierNumber: 3, tierName: 'Tier 3', callFrequency: 'quarterly', callsPerPeriod: 1, description: 'Quarterly' },
    update: {},
  });
  await prisma.courtesyCallTier.upsert({
    where: { tierNumber: 4 },
    create: { tierNumber: 4, tierName: 'Tier 4', callFrequency: 'quarterly', callsPerPeriod: 1, description: 'Quarterly – standard' },
    update: {},
  });
  console.log('✅ Courtesy call tiers');

  // ── Project Templates ──────────────────────────────────────────────────────
  const nciStd = await prisma.projectTemplate.upsert({
    where: { code_version: { code: 'NCI-STD', version: 1 } },
    create: {
      code: 'NCI-STD',
      version: 1,
      status: 'published',
      name: 'New Client Implementation (Standard)',
      description: 'Standard 9-phase new implementation for Tarkie clients',
      projectType: 'new_implementation',
      totalHours: 44,
    },
    update: {},
  });

  const custPrj = await prisma.projectTemplate.upsert({
    where: { code_version: { code: 'CUST-PRJ', version: 1 } },
    create: {
      code: 'CUST-PRJ',
      version: 1,
      status: 'published',
      name: 'Customization Project',
      description: 'Standard customization project template',
      projectType: 'customization',
      totalHours: 37,
    },
    update: {},
  });
  console.log('✅ Project templates');

  // ── NCI-STD: Phases & Tasks ────────────────────────────────────────────────
  type SeedTask = {
    code: string;
    title: string;
    taskType: string;
    estimatedHours: number;
    linkedAppIds?: string[];
    isMilestone?: boolean;
    isExternal?: boolean;
  };

  const nciPhases: { phase: 'kickoff' | 'fit_gap' | 'solution_design' | 'build_config' | 'uat' | 'go_live' | 'hypercare'; milestones: { title: string; tasks: SeedTask[] }[] }[] = [
    { phase: 'kickoff', milestones: [
      { title: 'Kickoff Preparation', tasks: [
        { code: 'CST-CORE-TASK-TEMPLATE-0001', title: 'KYC – Know Your Client', taskType: 'admin', estimatedHours: 1 },
        { code: 'CST-CORE-TASK-TEMPLATE-0002', title: 'Kickoff Meeting', taskType: 'meeting', estimatedHours: 2, isExternal: true },
        { code: 'CST-CORE-TASK-TEMPLATE-0003', title: 'Agree Next Steps', taskType: 'admin', estimatedHours: 0.5 },
        { code: 'CST-CORE-TASK-TEMPLATE-0003M', title: 'Kickoff Meeting Completed', taskType: 'admin', estimatedHours: 0, isMilestone: true, isExternal: false },
      ]},
    ]},
    { phase: 'fit_gap', milestones: [
      { title: 'Fit-Gap Analysis', tasks: [
        { code: 'CST-CORE-TASK-TEMPLATE-0004', title: 'Conduct Fit-Gap Session', taskType: 'meeting', estimatedHours: 3 },
        { code: 'CST-CORE-TASK-TEMPLATE-0005', title: 'Submit Fit-Gap Report', taskType: 'admin', estimatedHours: 2 },
        { code: 'CST-CORE-TASK-TEMPLATE-0006', title: 'Present Recommendation to Client', taskType: 'meeting', estimatedHours: 2 },
        { code: 'CST-CORE-TASK-TEMPLATE-0007', title: 'Get Recommendation Approval', taskType: 'admin', estimatedHours: 0.5, isExternal: true },
        { code: 'CST-CORE-TASK-TEMPLATE-0007M', title: 'Discovery Complete', taskType: 'admin', estimatedHours: 0, isMilestone: true },
        { code: 'CST-CORE-TASK-TEMPLATE-0007D', title: 'Data Mapping', taskType: 'implementation', estimatedHours: 2 },
        { code: 'CST-CORE-TASK-TEMPLATE-0007R', title: 'Requirement Sign-off', taskType: 'admin', estimatedHours: 0.5, isExternal: true },
      ]},
    ]},
    { phase: 'solution_design', milestones: [
      { title: 'Solution Design', tasks: [
        { code: 'CST-CORE-TASK-TEMPLATE-0008F', title: 'Fit-Gap Analysis', taskType: 'implementation', estimatedHours: 3 },
        { code: 'CST-CORE-TASK-TEMPLATE-0008C', title: 'Config Design', taskType: 'implementation', estimatedHours: 3 },
        { code: 'CST-CORE-TASK-TEMPLATE-0008M', title: 'Design Approval', taskType: 'admin', estimatedHours: 0, isMilestone: true, isExternal: true },
      ]},
    ]},
    { phase: 'build_config', milestones: [
      { title: 'Configuration', tasks: [
        { code: 'CST-CORE-TASK-TEMPLATE-0008', title: 'Configure Tarkie Platform', taskType: 'implementation', estimatedHours: 6 },
        { code: 'CST-CORE-TASK-TEMPLATE-0009', title: 'Create BRD', taskType: 'implementation', estimatedHours: 3, linkedAppIds: ['brd-maker'] },
        { code: 'CST-CORE-TASK-TEMPLATE-0010', title: 'Get BRD Approval', taskType: 'admin', estimatedHours: 0.5 },
        { code: 'CST-CORE-TASK-TEMPLATE-0011', title: 'Build Mockup / Process Design', taskType: 'implementation', estimatedHours: 4, linkedAppIds: ['mockup-generator'] },
        { code: 'CST-CORE-TASK-TEMPLATE-0012', title: 'Get Mockup Approval', taskType: 'admin', estimatedHours: 0.5 },
        { code: 'CST-CORE-TASK-TEMPLATE-0012M', title: 'Development Complete', taskType: 'admin', estimatedHours: 0, isMilestone: true },
        { code: 'CST-CORE-TASK-TEMPLATE-0012S', title: 'System Configuration', taskType: 'implementation', estimatedHours: 4 },
        { code: 'CST-CORE-TASK-TEMPLATE-0012D', title: 'Data Migration Setup', taskType: 'implementation', estimatedHours: 3 },
      ]},
    ]},
    { phase: 'uat', milestones: [
      { title: 'User Acceptance Testing', tasks: [
        { code: 'CST-CORE-TASK-TEMPLATE-0013', title: 'Conduct UAT Session', taskType: 'training', estimatedHours: 4, linkedAppIds: ['uat-guide-generator'] },
        { code: 'CST-CORE-TASK-TEMPLATE-0014', title: 'Process UAT Feedback', taskType: 'implementation', estimatedHours: 2 },
        { code: 'CST-CORE-TASK-TEMPLATE-0015', title: 'Submit DAR', taskType: 'admin', estimatedHours: 0.5 },
        { code: 'CST-CORE-TASK-TEMPLATE-0015S', title: 'SIT Execution', taskType: 'implementation', estimatedHours: 3 },
        { code: 'CST-CORE-TASK-TEMPLATE-0015B', title: 'Bug Fixes', taskType: 'implementation', estimatedHours: 3 },
        { code: 'CST-CORE-TASK-TEMPLATE-0015M', title: 'SIT Complete', taskType: 'admin', estimatedHours: 0, isMilestone: true },
      ]},
      { title: 'UAT with Client', tasks: [
        { code: 'CST-CORE-TASK-TEMPLATE-0015U', title: 'UAT Execution', taskType: 'training', estimatedHours: 4 },
        { code: 'CST-CORE-TASK-TEMPLATE-0015I', title: 'Issue Resolution', taskType: 'implementation', estimatedHours: 2 },
        { code: 'CST-CORE-TASK-TEMPLATE-0015UM', title: 'UAT Sign-off', taskType: 'admin', estimatedHours: 0, isMilestone: true, isExternal: true },
      ]},
    ]},
    { phase: 'go_live', milestones: [
      { title: 'Training & Go-Live', tasks: [
        { code: 'CST-CORE-TASK-TEMPLATE-0016', title: 'Conduct Training', taskType: 'training', estimatedHours: 4, linkedAppIds: ['training-deck-generator'] },
        { code: 'CST-CORE-TASK-TEMPLATE-0016A', title: 'Admin Training', taskType: 'training', estimatedHours: 2 },
        { code: 'CST-CORE-TASK-TEMPLATE-0016U', title: 'User Training', taskType: 'training', estimatedHours: 3 },
        { code: 'CST-CORE-TASK-TEMPLATE-0016M', title: 'Training Complete', taskType: 'admin', estimatedHours: 0, isMilestone: true, isExternal: true },
        { code: 'CST-CORE-TASK-TEMPLATE-0017', title: 'Go-Live Support', taskType: 'implementation', estimatedHours: 3 },
        { code: 'CST-CORE-TASK-TEMPLATE-0017E', title: 'Go-Live Execution', taskType: 'implementation', estimatedHours: 3 },
        { code: 'CST-CORE-TASK-TEMPLATE-0018', title: 'Submit DAR – Go-Live', taskType: 'admin', estimatedHours: 0.5 },
        { code: 'CST-CORE-TASK-TEMPLATE-0018H', title: 'Hypercare Handoff', taskType: 'admin', estimatedHours: 1 },
        { code: 'CST-CORE-TASK-TEMPLATE-0018M', title: 'Go-Live', taskType: 'admin', estimatedHours: 0, isMilestone: true, isExternal: true },
      ]},
    ]},
    { phase: 'hypercare', milestones: [
      { title: 'Hypercare & Closure', tasks: [
        { code: 'CST-CORE-TASK-TEMPLATE-0019', title: 'Hypercare Check-In Meeting', taskType: 'meeting', estimatedHours: 2 },
        { code: 'CST-CORE-TASK-TEMPLATE-0019D', title: 'Daily Check-ins', taskType: 'meeting', estimatedHours: 1 },
        { code: 'CST-CORE-TASK-TEMPLATE-0020', title: 'Resolve Hypercare Issues', taskType: 'implementation', estimatedHours: 3 },
        { code: 'CST-CORE-TASK-TEMPLATE-0020I', title: 'Issue Resolution', taskType: 'implementation', estimatedHours: 2 },
        { code: 'CST-CORE-TASK-TEMPLATE-0021', title: 'Close Hypercare – Handover', taskType: 'admin', estimatedHours: 1 },
        { code: 'CST-CORE-TASK-TEMPLATE-0021M', title: 'Hypercare Complete', taskType: 'admin', estimatedHours: 0, isMilestone: true },
      ]},
    ]},
  ];

  for (let pi = 0; pi < nciPhases.length; pi++) {
    const { phase, milestones } = nciPhases[pi];
    const templatePhase = await prisma.projectTemplatePhase.upsert({
      where: { id: `nci-${phase}` },
      create: { id: `nci-${phase}`, templateId: nciStd.id, phase, sortOrder: pi },
      update: {},
    });

    for (let mi = 0; mi < milestones.length; mi++) {
      const ms = milestones[mi];
      const milestone = await prisma.projectTemplateMilestone.upsert({
        where: { id: `nci-${phase}-${ms.title.replace(/\s/g, '-').toLowerCase()}` },
        create: {
          id: `nci-${phase}-${ms.title.replace(/\s/g, '-').toLowerCase()}`,
          phaseId: templatePhase.id,
          title: ms.title,
          sortOrder: mi,
        },
        update: {},
      });

      for (let ti = 0; ti < ms.tasks.length; ti++) {
        const task = ms.tasks[ti];
        await prisma.defaultTask.upsert({
          where: { code: task.code },
          create: {
            milestoneId: milestone.id,
            code: task.code,
            title: task.title,
            taskType: task.taskType as any,
            estimatedHours: task.estimatedHours,
            sortOrder: ti,
            linkedAppIds: task.linkedAppIds ?? [],
            isMilestone: task.isMilestone ?? false,
            isExternal: task.isExternal ?? false,
          },
          update: {},
        });
      }
    }
  }
  console.log('✅ NCI-STD template with milestone-flagged tasks');

  // ── CUST-PRJ Tasks ─────────────────────────────────────────────────────────
  const custPhase = await prisma.projectTemplatePhase.upsert({
    where: { id: 'cust-kickoff' },
    create: { id: 'cust-kickoff', templateId: custPrj.id, phase: 'kickoff', sortOrder: 0 },
    update: {},
  });
  const custMs = await prisma.projectTemplateMilestone.upsert({
    where: { id: 'cust-kickoff-main' },
    create: { id: 'cust-kickoff-main', phaseId: custPhase.id, title: 'Customization Delivery', sortOrder: 0 },
    update: {},
  });

  const custTasks = [
    { code: 'CST-CUSTOM-TASK-TEMPLATE-0001', title: 'Receive & Validate RFA', taskType: 'rfa', estimatedHours: 1 },
    { code: 'CST-CUSTOM-TASK-TEMPLATE-0002', title: 'Kickoff / Discovery Meeting', taskType: 'meeting', estimatedHours: 2 },
    { code: 'CST-CUSTOM-TASK-TEMPLATE-0003', title: 'Conduct Fit-Gap (Custom Scope)', taskType: 'meeting', estimatedHours: 3 },
    { code: 'CST-CUSTOM-TASK-TEMPLATE-0004', title: 'Create BRD (Custom)', taskType: 'implementation', estimatedHours: 3, linkedAppIds: ['brd-maker'] },
    { code: 'CST-CUSTOM-TASK-TEMPLATE-0005', title: 'Get BRD Approval', taskType: 'admin', estimatedHours: 0.5 },
    { code: 'CST-CUSTOM-TASK-TEMPLATE-0006', title: 'Design Mockup', taskType: 'implementation', estimatedHours: 4, linkedAppIds: ['mockup-generator'] },
    { code: 'CST-CUSTOM-TASK-TEMPLATE-0007', title: 'Get Mockup Approval', taskType: 'admin', estimatedHours: 0.5 },
    { code: 'CST-CUSTOM-TASK-TEMPLATE-0008', title: 'Configure / Build', taskType: 'implementation', estimatedHours: 8 },
    { code: 'CST-CUSTOM-TASK-TEMPLATE-0009', title: 'Internal QA', taskType: 'implementation', estimatedHours: 2 },
    { code: 'CST-CUSTOM-TASK-TEMPLATE-0010', title: 'UAT with Client', taskType: 'training', estimatedHours: 3 },
    { code: 'CST-CUSTOM-TASK-TEMPLATE-0011', title: 'Process UAT Feedback', taskType: 'implementation', estimatedHours: 2 },
    { code: 'CST-CUSTOM-TASK-TEMPLATE-0012', title: 'Deliver & Demo', taskType: 'meeting', estimatedHours: 2 },
    { code: 'CST-CUSTOM-TASK-TEMPLATE-0013', title: 'Client Sign-Off', taskType: 'admin', estimatedHours: 0.5 },
    { code: 'CST-CUSTOM-TASK-TEMPLATE-0014', title: 'Submit DAR', taskType: 'admin', estimatedHours: 0.5 },
  ] as const;

  for (const [i, task] of custTasks.entries()) {
    await prisma.defaultTask.upsert({
      where: { code: task.code },
      create: {
        milestoneId: custMs.id,
        code: task.code,
        title: task.title,
        taskType: task.taskType,
        estimatedHours: task.estimatedHours,
        sortOrder: i,
        linkedAppIds: (task as any).linkedAppIds ?? [],
      },
      update: {},
    });
  }
  console.log('✅ CUST-PRJ template with 14 tasks');

  // ── AI Apps ────────────────────────────────────────────────────────────────
  const aiApps = [
    {
      name: 'BRD Maker',
      description: 'Generate a Business Requirements Document from meeting transcripts and fit-gap data',
      icon: '📄',
      category: 'document_generation' as const,
      skillId: 'brd-writer',
      requiredRoles: ['sr_business_analyst', 'jr_business_analyst', 'supervisor', 'manager'],
      isSystemApp: true,
      canBeDeleted: false,
    },
    {
      name: 'Meeting MOM Generator',
      description: 'Extract Minutes of Meeting, action items, decisions, and pain points from transcripts',
      icon: '📝',
      category: 'document_generation' as const,
      skillId: 'meeting-summarizer',
      requiredRoles: ['sr_business_analyst', 'jr_business_analyst', 'supervisor', 'manager'],
      isSystemApp: true,
      canBeDeleted: false,
    },
    {
      name: 'Fit-Gap Analyzer',
      description: 'Analyze requirements against Tarkie capabilities and output a structured fit-gap table',
      icon: '🔍',
      category: 'analysis' as const,
      skillId: 'fit-gap-analyzer',
      requiredRoles: ['sr_business_analyst', 'jr_business_analyst', 'supervisor'],
      isSystemApp: true,
      canBeDeleted: false,
    },
    {
      name: 'Kickoff Questionnaire Generator',
      description: 'Generate tailored discovery questions for the kickoff meeting based on client industry and plan',
      icon: '❓',
      category: 'planning' as const,
      skillId: 'kickoff-questionnaire-generator',
      requiredRoles: ['sr_business_analyst', 'jr_business_analyst', 'supervisor'],
      isSystemApp: false,
      canBeDeleted: true,
    },
    {
      name: 'Proposal Generator',
      description: 'Create a professional proposal deck from client and project data',
      icon: '📊',
      category: 'document_generation' as const,
      skillId: 'proposal-generator',
      requiredRoles: ['supervisor', 'manager'],
      isSystemApp: false,
      canBeDeleted: true,
    },
    {
      name: 'UAT Guide Generator',
      description: 'Generate a structured UAT test script based on BRD and project configuration',
      icon: '🧪',
      category: 'validation' as const,
      skillId: 'uat-guide-generator',
      requiredRoles: ['sr_business_analyst', 'jr_business_analyst', 'supervisor'],
      isSystemApp: false,
      canBeDeleted: true,
    },
    {
      name: 'Training Deck Generator',
      description: 'Create training presentation slides for client end-user training',
      icon: '🎓',
      category: 'document_generation' as const,
      skillId: 'training-deck-generator',
      requiredRoles: ['sr_business_analyst', 'jr_business_analyst', 'supervisor'],
      isSystemApp: false,
      canBeDeleted: true,
    },
    {
      name: 'Mockup Generator',
      description: 'Generate UI mockup specifications based on Tarkie design system (design.md)',
      icon: '🎨',
      category: 'design' as const,
      skillId: 'mockup-generator',
      requiredRoles: ['sr_business_analyst', 'supervisor'],
      isSystemApp: false,
      canBeDeleted: true,
    },
    {
      name: 'KYC Generator',
      description: 'Generate a structured Know Your Client document from initial client data',
      icon: '🏢',
      category: 'document_generation' as const,
      skillId: 'kyc-generator',
      requiredRoles: ['sr_business_analyst', 'jr_business_analyst', 'supervisor'],
      isSystemApp: false,
      canBeDeleted: true,
    },
    {
      name: 'Recommendation Deck Generator',
      description: 'Generate fit-gap recommendation presentation for client approval',
      icon: '✅',
      category: 'document_generation' as const,
      skillId: 'recommendation-deck-generator',
      requiredRoles: ['sr_business_analyst', 'supervisor'],
      isSystemApp: false,
      canBeDeleted: true,
    },
    {
      name: 'Handover Document Generator',
      description: 'Create the Turnover to Maintenance handover document for CCT',
      icon: '🤝',
      category: 'document_generation' as const,
      skillId: 'handover-doc-writer',
      requiredRoles: ['sr_business_analyst', 'supervisor', 'manager'],
      isSystemApp: true,
      canBeDeleted: false,
    },
    {
      name: 'Final Account Documentation Generator',
      description: 'Generate closure documentation package for account closure process',
      icon: '📁',
      category: 'document_generation' as const,
      skillId: 'account-closure-doc-generator',
      requiredRoles: ['supervisor', 'manager'],
      isSystemApp: true,
      canBeDeleted: false,
    },
  ];

  for (const app of aiApps) {
    const existing = await prisma.aiApp.findFirst({ where: { skillId: app.skillId } });
    if (!existing) {
      await prisma.aiApp.create({ data: app });
    }
  }
  console.log('✅ AI Apps (12 apps)');

  // ── KPI Scorecard Template — Jr. BA Standard ──────────────────────────────
  let jrBaTemplate = await prisma.kpiScorecardTemplate.findFirst({
    where: { name: 'Jr. BA Standard Scorecard' },
  });

  if (!jrBaTemplate) {
    jrBaTemplate = await prisma.kpiScorecardTemplate.create({
      data: {
        name: 'Jr. BA Standard Scorecard',
        targetRole: 'jr_business_analyst',
        isDefault: true,
        version: '1.0',
      },
    });

    // RM Category (30%)
    const rmCat = await prisma.kpiCategory.create({
      data: {
        templateId: jrBaTemplate.id,
        name: 'Relationship Management (RM)',
        weight: 30,
        sortOrder: 0,
      },
    });
    await prisma.kpiMetric.createMany({
      data: [
        { categoryId: rmCat.id, name: 'KYC Completion Rate', formula: 'KYC_COMPLETION_RATE', weight: 5, target: 100, sortOrder: 0 },
        { categoryId: rmCat.id, name: 'Courtesy Call Compliance', formula: 'MILESTONE_COMPLETION_RATE', weight: 10, target: 100, sortOrder: 1 },
        { categoryId: rmCat.id, name: 'Next Steps Agreement Rate', formula: 'MILESTONE_COMPLETION_RATE', weight: 15, target: 100, sortOrder: 2 },
      ],
    });

    // PM/BA Category (50%)
    const pmCat = await prisma.kpiCategory.create({
      data: {
        templateId: jrBaTemplate.id,
        name: 'Project Management / BA Work (PM/BA)',
        weight: 50,
        sortOrder: 1,
      },
    });
    await prisma.kpiMetric.create({
      data: { categoryId: pmCat.id, name: 'Project Work Score', formula: 'PROJECT_WORK_SCORE', weight: 50, target: 100, sortOrder: 0 },
    });

    // CST Category (20%)
    const cstCat = await prisma.kpiCategory.create({
      data: {
        templateId: jrBaTemplate.id,
        name: 'CST Compliance',
        weight: 20,
        sortOrder: 2,
      },
    });
    await prisma.kpiMetric.createMany({
      data: [
        { categoryId: cstCat.id, name: 'DAR Submission Rate', formula: 'TASK_COMPLETION_RATE', weight: 10, target: 100, sortOrder: 0 },
        { categoryId: cstCat.id, name: 'Usage Support Rate', formula: 'USAGE_SUPPORT_RATE', weight: 10, target: 100, sortOrder: 1 },
      ],
    });

    console.log('✅ Jr. BA Standard KPI Scorecard template');
  }

  // ── Script Templates ───────────────────────────────────────────────────────
  const scripts = [
    {
      name: 'Welcome Email – New Client',
      category: 'email',
      subject: 'Welcome to Tarkie! Your implementation journey begins',
      body: 'Dear {{contact.decision_maker.full_name}},\n\nWelcome to Tarkie! We\'re excited to start this journey with {{client.company_name}}.\n\nYour dedicated implementation manager {{user.full_name}} will be your primary point of contact.\n\nPlease find below the next steps:\n{{project.next_steps}}\n\nBest regards,\n{{user.full_name}}\n{{company.name}} Customer Success Team',
      mergeFields: ['contact.decision_maker.full_name', 'client.company_name', 'user.full_name', 'project.next_steps'],
      triggerEvent: 'project.created',
    },
    {
      name: 'Kickoff Meeting Invite',
      category: 'email',
      subject: 'Kickoff Meeting – {{project.name}} | {{client.company_name}}',
      body: 'Dear {{client.primary_contact_name}},\n\nThis is to formally invite you to our Kickoff Meeting for {{project.name}}.\n\nDate & Time: {{meeting.date}}\nVenue: {{meeting.venue}}\nAgenda: {{meeting.agenda}}\n\nPlease confirm your attendance at your earliest convenience.\n\nBest regards,\n{{user.full_name}}',
      mergeFields: ['project.name', 'client.company_name', 'client.primary_contact_name', 'meeting.date', 'meeting.venue', 'meeting.agenda', 'user.full_name'],
      triggerEvent: 'meeting.kickoff.scheduled',
    },
    {
      name: 'RFA Submission Acknowledgement',
      category: 'email',
      subject: 'RFA Received: {{rfa.title}} | Ref: {{rfa.id}}',
      body: 'Dear {{client.primary_contact_name}},\n\nThank you for submitting your Request for Action.\n\nRFA Reference: {{rfa.id}}\nTitle: {{rfa.title}}\nType: {{rfa.request_type}}\nSLA: {{rfa.sla_days}} business days\n\nOur team will review this and get back to you within the SLA period.\n\nBest regards,\n{{user.full_name}}',
      mergeFields: ['client.primary_contact_name', 'rfa.id', 'rfa.title', 'rfa.request_type', 'rfa.sla_days', 'user.full_name'],
      triggerEvent: 'rfa.submitted',
    },
    {
      name: 'Go-Live Congratulations',
      category: 'email',
      subject: '🎉 Congratulations on your Go-Live! – {{client.company_name}}',
      body: 'Dear {{contact.decision_maker.full_name}},\n\nCongratulations! {{client.company_name}} is now live on Tarkie!\n\nThis is a major milestone and we are thrilled to be part of your journey.\n\nOver the next {{hypercare.duration_weeks}} weeks, your team will be in Hypercare mode. We will be checking in regularly to ensure a smooth transition.\n\nYour dedicated support contact: {{user.full_name}}\n\nWelcome to Tarkie! 🚀',
      mergeFields: ['contact.decision_maker.full_name', 'client.company_name', 'hypercare.duration_weeks', 'user.full_name'],
      triggerEvent: 'project.go_live',
    },
    {
      name: 'Monthly Courtesy Call Reminder',
      category: 'email',
      subject: 'Checking In – {{client.company_name}}',
      body: 'Dear {{client.primary_contact_name}},\n\nI hope this message finds you well. This is {{user.full_name}} from the Tarkie Customer Success Team.\n\nI would like to schedule a brief check-in call to discuss how things are going and address any questions you may have.\n\nWould you be available for a {{call.duration_minutes}}-minute call this week?\n\nBest regards,\n{{user.full_name}}',
      mergeFields: ['client.primary_contact_name', 'user.full_name', 'call.duration_minutes'],
      triggerEvent: 'courtesy_call.due',
    },
  ];

  for (const script of scripts) {
    const existing = await prisma.scriptTemplate.findFirst({ where: { name: script.name } });
    if (!existing) {
      await prisma.scriptTemplate.create({ data: { ...script, isActive: true } });
    }
  }
  console.log('✅ Script templates (5 templates)');

  console.log('\n🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
