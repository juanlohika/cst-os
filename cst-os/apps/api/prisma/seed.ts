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

  // ── Master Data Groups & Values ───────────────────────────────────────────

  // client_tier
  const clientTierGroup = await prisma.masterDataGroup.upsert({
    where: { code: 'client_tier' },
    create: { code: 'client_tier', label: 'Client Tier', description: 'Client segmentation tier', isSystem: true, sortOrder: 0 },
    update: {},
  });
  const clientTierValues = [
    { code: 'enterprise', label: 'Enterprise', color: 'blue', sortOrder: 0, metadata: { cc_frequency: 'monthly', bau_hours_per_month: 20, monthly_csat_required: true } },
    { code: 'premium', label: 'Premium', color: 'violet', sortOrder: 1, metadata: { cc_frequency: 'bi-monthly', bau_hours_per_month: 10, monthly_csat_required: false } },
    { code: 'standard', label: 'Standard', color: 'gray', sortOrder: 2, metadata: { cc_frequency: 'quarterly', bau_hours_per_month: 5, monthly_csat_required: false } },
  ];
  for (const v of clientTierValues) {
    await prisma.masterDataValue.upsert({
      where: { groupId_code: { groupId: clientTierGroup.id, code: v.code } },
      create: { groupId: clientTierGroup.id, ...v, isSystem: true },
      update: { label: v.label, color: v.color, metadata: v.metadata },
    });
  }

  // deal_stage
  const dealStageGroup = await prisma.masterDataGroup.upsert({
    where: { code: 'deal_stage' },
    create: { code: 'deal_stage', label: 'Deal Stage', description: 'Sales pipeline stage', isSystem: true, sortOrder: 1 },
    update: {},
  });
  const dealStageValues = [
    { code: 'prospect', label: 'Prospect', color: 'gray', sortOrder: 0 },
    { code: 'qualified', label: 'Qualified', color: 'blue', sortOrder: 1 },
    { code: 'proposal_sent', label: 'Proposal Sent', color: 'yellow', sortOrder: 2 },
    { code: 'negotiation', label: 'Negotiation', color: 'orange', sortOrder: 3 },
    { code: 'onboarding', label: 'Onboarding', color: 'violet', sortOrder: 4 },
    { code: 'won', label: 'Won', color: 'green', sortOrder: 5 },
    { code: 'lost', label: 'Lost', color: 'red', sortOrder: 6 },
  ];
  for (const v of dealStageValues) {
    await prisma.masterDataValue.upsert({
      where: { groupId_code: { groupId: dealStageGroup.id, code: v.code } },
      create: { groupId: dealStageGroup.id, ...v, isSystem: true },
      update: { label: v.label, color: v.color },
    });
  }

  // project_type
  const projectTypeGroup = await prisma.masterDataGroup.upsert({
    where: { code: 'project_type' },
    create: { code: 'project_type', label: 'Project Type', description: 'Type of project engagement', isSystem: true, sortOrder: 2 },
    update: {},
  });
  const projectTypeValues = [
    { code: 'implementation', label: 'Implementation', color: 'blue', sortOrder: 0, metadata: { standard_wdays: { kickoff: 3, requirements: 10, build: 30, uat: 14, go_live: 3, hypercare: 14 } } },
    { code: 'enhancement', label: 'Enhancement', color: 'violet', sortOrder: 1, metadata: { standard_wdays: { kickoff: 1, requirements: 5, build: 14, uat: 7, go_live: 1, hypercare: 7 } } },
    { code: 'data_migration', label: 'Data Migration', color: 'orange', sortOrder: 2 },
    { code: 'integration', label: 'Integration', color: 'yellow', sortOrder: 3 },
  ];
  for (const v of projectTypeValues) {
    await prisma.masterDataValue.upsert({
      where: { groupId_code: { groupId: projectTypeGroup.id, code: v.code } },
      create: { groupId: projectTypeGroup.id, ...v, isSystem: true },
      update: { label: v.label, color: v.color, metadata: (v as any).metadata },
    });
  }

  // lifecycle_stage
  const lifecycleStageGroup = await prisma.masterDataGroup.upsert({
    where: { code: 'lifecycle_stage' },
    create: { code: 'lifecycle_stage', label: 'Lifecycle Stage', description: 'Client account lifecycle stage', isSystem: true, sortOrder: 3 },
    update: {},
  });
  const lifecycleStageValues = [
    { code: 'onboarding', label: 'Onboarding', color: 'blue', sortOrder: 0 },
    { code: 'active', label: 'Active', color: 'green', sortOrder: 1 },
    { code: 'at_risk', label: 'At Risk', color: 'red', sortOrder: 2 },
    { code: 'churned', label: 'Churned', color: 'gray', sortOrder: 3 },
    { code: 'up_for_renewal', label: 'Up for Renewal', color: 'yellow', sortOrder: 4 },
  ];
  for (const v of lifecycleStageValues) {
    await prisma.masterDataValue.upsert({
      where: { groupId_code: { groupId: lifecycleStageGroup.id, code: v.code } },
      create: { groupId: lifecycleStageGroup.id, ...v, isSystem: true },
      update: { label: v.label, color: v.color },
    });
  }

  // task_priority
  const taskPriorityGroup = await prisma.masterDataGroup.upsert({
    where: { code: 'task_priority' },
    create: { code: 'task_priority', label: 'Task Priority', description: 'Task priority levels', isSystem: true, sortOrder: 4 },
    update: {},
  });
  const taskPriorityValues = [
    { code: 'critical', label: 'Critical', color: 'red', sortOrder: 0 },
    { code: 'high', label: 'High', color: 'orange', sortOrder: 1 },
    { code: 'medium', label: 'Medium', color: 'yellow', sortOrder: 2 },
    { code: 'low', label: 'Low', color: 'gray', sortOrder: 3 },
  ];
  for (const v of taskPriorityValues) {
    await prisma.masterDataValue.upsert({
      where: { groupId_code: { groupId: taskPriorityGroup.id, code: v.code } },
      create: { groupId: taskPriorityGroup.id, ...v, isSystem: true },
      update: { label: v.label, color: v.color },
    });
  }

  // meeting_type
  const meetingTypeGroup = await prisma.masterDataGroup.upsert({
    where: { code: 'meeting_type' },
    create: { code: 'meeting_type', label: 'Meeting Type', description: 'Types of client meetings', isSystem: true, sortOrder: 5 },
    update: {},
  });
  const meetingTypeValues = [
    { code: 'courtesy_call', label: 'Courtesy Call', color: 'blue', sortOrder: 0 },
    { code: 'kickoff', label: 'Kickoff', color: 'green', sortOrder: 1 },
    { code: 'uat_walkthrough', label: 'UAT Walkthrough', color: 'violet', sortOrder: 2 },
    { code: 'internal_sync', label: 'Internal Sync', color: 'gray', sortOrder: 3 },
    { code: 'go_live', label: 'Go Live', color: 'green', sortOrder: 4 },
    { code: 'training', label: 'Training', color: 'yellow', sortOrder: 5 },
  ];
  for (const v of meetingTypeValues) {
    await prisma.masterDataValue.upsert({
      where: { groupId_code: { groupId: meetingTypeGroup.id, code: v.code } },
      create: { groupId: meetingTypeGroup.id, ...v, isSystem: true },
      update: { label: v.label, color: v.color },
    });
  }

  // rfa_type
  const rfaTypeGroup = await prisma.masterDataGroup.upsert({
    where: { code: 'rfa_type' },
    create: { code: 'rfa_type', label: 'RFA Type', description: 'Types of Request for Action', isSystem: true, sortOrder: 6 },
    update: {},
  });
  const rfaTypeValues = [
    { code: 'change_request', label: 'Change Request', color: 'orange', sortOrder: 0 },
    { code: 'bug_report', label: 'Bug Report', color: 'red', sortOrder: 1 },
    { code: 'data_fix', label: 'Data Fix', color: 'yellow', sortOrder: 2 },
    { code: 'new_requirement', label: 'New Requirement', color: 'blue', sortOrder: 3 },
    { code: 'integration_request', label: 'Integration Request', color: 'violet', sortOrder: 4 },
  ];
  for (const v of rfaTypeValues) {
    await prisma.masterDataValue.upsert({
      where: { groupId_code: { groupId: rfaTypeGroup.id, code: v.code } },
      create: { groupId: rfaTypeGroup.id, ...v, isSystem: true },
      update: { label: v.label, color: v.color },
    });
  }

  // industry
  const industryGroup = await prisma.masterDataGroup.upsert({
    where: { code: 'industry' },
    create: { code: 'industry', label: 'Industry', description: 'Client industry classification', isSystem: true, sortOrder: 7 },
    update: {},
  });
  const industryValues = [
    { code: 'retail', label: 'Retail', color: 'blue', sortOrder: 0 },
    { code: 'fmcg', label: 'FMCG', color: 'green', sortOrder: 1 },
    { code: 'distribution', label: 'Distribution', color: 'yellow', sortOrder: 2 },
    { code: 'manufacturing', label: 'Manufacturing', color: 'orange', sortOrder: 3 },
    { code: 'services', label: 'Services', color: 'gray', sortOrder: 4 },
    { code: 'fintech', label: 'Fintech', color: 'violet', sortOrder: 5 },
  ];
  for (const v of industryValues) {
    await prisma.masterDataValue.upsert({
      where: { groupId_code: { groupId: industryGroup.id, code: v.code } },
      create: { groupId: industryGroup.id, ...v, isSystem: true },
      update: { label: v.label, color: v.color },
    });
  }

  console.log('✅ Master Data Groups & Values (8 groups)');

  // ── AI Apps v2 (upsert by skillId) ────────────────────────────────────────
  const aiAppsV2 = [
    {
      skillId: 'brd-maker',
      name: 'BRD Maker',
      description: 'Generate a Business Requirements Document collaboratively using project context.',
      icon: '📄',
      category: 'document_generation' as const,
      claudeMdInstruction: "# BRD Maker\nYou are an expert BRD writer for MobileOptima's CST. Use project context to pre-fill sections. Walk through each section collaboratively. Output: Executive Summary, Project Background, Stakeholders, Scope, Current State, Future State, Functional Requirements, Non-Functional Requirements, Assumptions & Constraints, Appendix.",
      steps: ['Project Overview', 'Stakeholders & Scope', 'Current Process', 'Requirements Gathering', 'Gap Analysis', 'BRD Draft & Review'],
      requiredRoles: ['sr_business_analyst', 'jr_business_analyst', 'supervisor', 'manager'],
      isSystemApp: true,
      canBeDeleted: false,
    },
    {
      skillId: 'timeline-maker',
      name: 'Timeline Maker',
      description: 'Calculate project phase dates based on project type and working day norms.',
      icon: '📅',
      category: 'planning' as const,
      claudeMdInstruction: "# Timeline Maker\nCalculate project phase dates based on project type and working day norms. Exclude PH holidays and weekends. Phases: Kickoff → Requirements → Build/Config → UAT → Go-Live → Hypercare. Output as a phase table.",
      steps: ['Project Type & Constraints', 'Phase Date Calculation', 'Milestone Mapping', 'Timeline Review'],
      requiredRoles: ['sr_business_analyst', 'jr_business_analyst', 'supervisor', 'manager'],
      isSystemApp: false,
      canBeDeleted: true,
    },
    {
      skillId: 'fit-gap-analyzer',
      name: 'Fit-Gap Analyzer',
      description: 'Analyze requirements against Tarkie capabilities and output a structured fit-gap table',
      icon: '🔍',
      category: 'analysis' as const,
      claudeMdInstruction: "# Fit-Gap Analyzer\nAnalyze client requirements vs Tarkie capabilities. Classify each as Fit/Partial Fit/Gap. For each Gap, draft an RFA. Output: Fit-Gap matrix table + RFA drafts + risk summary.",
      steps: ['Client Requirements Upload', 'Tarkie Capability Mapping', 'Gap Identification', 'Risk Assessment', 'RFA Draft Creation', 'Summary Report'],
      requiredRoles: ['sr_business_analyst', 'jr_business_analyst', 'supervisor'],
      isSystemApp: true,
      canBeDeleted: false,
    },
    {
      skillId: 'kickoff-questionnaire-generator',
      name: 'Kickoff Questionnaire Generator',
      description: 'Generate tailored kickoff questionnaires based on client industry and tier.',
      icon: '❓',
      category: 'document_generation' as const,
      claudeMdInstruction: "# Kickoff Questionnaire Generator\nGenerate tailored kickoff questionnaires. Sections: Company Background, Current Process, Data & Integration, Users & Access, Timeline & Go-Live. Tailor to client industry and tier.",
      steps: ['Project Context Review', 'Questionnaire Generation', 'Review & Edit', 'Export'],
      requiredRoles: ['sr_business_analyst', 'jr_business_analyst', 'supervisor'],
      isSystemApp: false,
      canBeDeleted: true,
    },
    {
      skillId: 'process-flow-generator',
      name: 'Process Flow Generator',
      description: 'Convert business process descriptions into Mermaid.js flowchart diagrams.',
      icon: '🔄',
      category: 'document_generation' as const,
      claudeMdInstruction: "# Process Flow Generator\nConvert business process descriptions into Mermaid.js flowchart diagrams. Use flowchart TD format. Include subgraphs for different actors. Always output valid Mermaid syntax.",
      steps: ['Process Description', 'Flow Mapping', 'Mermaid Diagram', 'Review & Export'],
      requiredRoles: ['sr_business_analyst', 'jr_business_analyst', 'supervisor'],
      isSystemApp: false,
      canBeDeleted: true,
    },
    {
      skillId: 'recommendation-deck-generator',
      name: 'Recommendation Deck Generator',
      description: 'Generate fit-gap recommendation presentation for client approval',
      icon: '📊',
      category: 'document_generation' as const,
      claudeMdInstruction: "# Recommendation Deck Generator\nCreate professional recommendation decks. Slide structure: Title, Executive Summary, Current State (3 slides), Findings (3 slides), Recommendations (3 slides), Action Plan table, Next Steps.",
      steps: ['Executive Summary', 'Current State Analysis', 'Findings & Observations', 'Recommendations', 'Action Plan', 'Deck Review'],
      requiredRoles: ['sr_business_analyst', 'supervisor'],
      isSystemApp: false,
      canBeDeleted: true,
    },
    {
      skillId: 'uat-guide-generator',
      name: 'UAT Document Generator',
      description: 'Generate a structured UAT test script and sign-off document based on BRD and project configuration.',
      icon: '✅',
      category: 'validation' as const,
      claudeMdInstruction: "# UAT Document Generator\nGenerate UAT test scripts and sign-off documents. Test cases per module: ID, Description, Pre-conditions, Steps, Expected Result, Actual Result (blank), Pass/Fail (blank). Include sign-off page.",
      steps: ['Scope Definition', 'Test Case Generation', 'Sign-Off Template', 'Review & Export'],
      requiredRoles: ['sr_business_analyst', 'jr_business_analyst', 'supervisor'],
      isSystemApp: false,
      canBeDeleted: true,
    },
    {
      skillId: 'training-deck-generator',
      name: 'Training Deck Generator',
      description: 'Create training presentation slides for client end-user training',
      icon: '🎓',
      category: 'document_generation' as const,
      claudeMdInstruction: "# Training Deck Generator\nCreate end-user training materials for Tarkie modules. Tailor to audience level (power user/standard/manager). Per module: Overview, Navigation, Key Workflows, Tips, Common Mistakes, Practice Exercise.",
      steps: ['Module Selection', 'Audience & Level', 'Content Outline', 'Slide Content', 'Review & Export'],
      requiredRoles: ['sr_business_analyst', 'jr_business_analyst', 'supervisor'],
      isSystemApp: false,
      canBeDeleted: true,
    },
    {
      skillId: 'data-validation-tool',
      name: 'Data Validation Tool',
      description: 'Validate client master data files for Tarkie import readiness.',
      icon: '🗃️',
      category: 'validation' as const,
      claudeMdInstruction: "# Data Validation Tool\nValidate client master data files for Tarkie import readiness. Check required fields, code values vs master data, date formats (YYYY-MM-DD), numeric formats. Output: error table + summary stats + top 5 common errors.",
      steps: ['Data Upload', 'Validation Rules', 'Error Report', 'Correction Guidance'],
      requiredRoles: ['sr_business_analyst', 'jr_business_analyst', 'supervisor'],
      isSystemApp: false,
      canBeDeleted: true,
    },
    {
      skillId: 'kyc-generator',
      name: 'KYC Form Generator',
      description: 'Generate a structured Know Your Client document from initial client data',
      icon: '📋',
      category: 'document_generation' as const,
      claudeMdInstruction: "# KYC Form Generator\nGenerate Know Your Client forms. Sections: Company Information, Key Contacts, Business Operations, Financial Profile, IT Infrastructure, Tarkie Requirements. Tailor to client industry. Output as fillable form structure.",
      steps: ['Client Profile Review', 'KYC Form Generation', 'Review & Edit', 'Export'],
      requiredRoles: ['sr_business_analyst', 'jr_business_analyst', 'supervisor'],
      isSystemApp: false,
      canBeDeleted: true,
    },
    {
      skillId: 'meeting-summarizer',
      name: 'Meeting MOM Generator',
      description: 'Extract Minutes of Meeting, action items, decisions, and pain points from transcripts',
      icon: '📝',
      category: 'document_generation' as const,
      claudeMdInstruction: "# Meeting MOM Generator\nGenerate Minutes of Meeting from transcripts. Extract decisions, action items (with owner + due date), issues raised. Output: MOM Header, Agenda Items, Decisions (bulleted), Action Items table, Issues, Next Meeting.",
      steps: ['Meeting Context', 'Transcript Processing', 'MOM Draft', 'Review & Send'],
      requiredRoles: ['sr_business_analyst', 'jr_business_analyst', 'supervisor', 'manager'],
      isSystemApp: true,
      canBeDeleted: false,
    },
    {
      skillId: 'mockup-generator',
      name: 'Mockup Generator',
      description: 'Generate UI mockup specifications based on Tarkie design system (design.md)',
      icon: '🎨',
      category: 'design' as const,
      claudeMdInstruction: "# Mockup Generator\nCreate UI mockup descriptions for Tarkie screens. Per screen: layout description, key UI elements, sample data using client-specific examples, navigation flows. Output as ASCII wireframes + descriptive text.",
      steps: ['Screen Identification', 'Layout Description', 'Content Specification', 'Review & Export'],
      requiredRoles: ['sr_business_analyst', 'supervisor'],
      isSystemApp: false,
      canBeDeleted: true,
    },
  ];

  for (const app of aiAppsV2) {
    const existing = await prisma.aiApp.findFirst({ where: { skillId: app.skillId } });
    if (existing) {
      await prisma.aiApp.update({
        where: { id: existing.id },
        data: {
          name: app.name,
          description: app.description,
          icon: app.icon,
          category: app.category,
          claudeMdInstruction: app.claudeMdInstruction,
          steps: app.steps,
          requiredRoles: app.requiredRoles,
          isSystemApp: app.isSystemApp,
          canBeDeleted: app.canBeDeleted,
        },
      });
    } else {
      await prisma.aiApp.create({ data: app });
    }
  }
  console.log('✅ AI Apps v2 (12 apps upserted)');

  // ── Skills ────────────────────────────────────────────────────────────────
  const skills = [
    {
      skillCode: 'system-record-populator',
      name: 'System Record Populator',
      category: 'data_entry' as const,
      voiceEnabled: true,
      allowedTools: ['create_task', 'update_task_status', 'create_timelog'],
      publishScope: 'team' as const,
      isSystemSkill: true,
      isActive: true,
      claudeMd: "# System Record Populator\nHelp create/update records through conversation. Ask for required fields one at a time. Validate inputs. Confirm before creating. Show summary of what was created. Support voice input.",
    },
    {
      skillCode: 'calendar-meeting-scheduler',
      name: 'Calendar & Meeting Scheduler',
      category: 'scheduling' as const,
      voiceEnabled: true,
      allowedTools: ['get_meeting', 'get_project', 'get_client'],
      publishScope: 'team' as const,
      isSystemSkill: true,
      isActive: true,
      claudeMd: "# Calendar & Meeting Scheduler\nSchedule meetings via natural language. Understand date/time expressions. Ask for: type, attendees, platform, agenda. Confirm before creating. Voice-friendly confirmations.",
    },
    {
      skillCode: 'smart-query',
      name: 'Smart Query',
      category: 'reporting' as const,
      voiceEnabled: true,
      allowedTools: ['get_client', 'get_project', 'list_clients', 'list_projects', 'list_tasks'],
      publishScope: 'team' as const,
      isSystemSkill: true,
      isActive: true,
      claudeMd: "# Smart Query\nAnswer questions about CST OS data in natural language. Call appropriate data tools. Present results as tables or bullets. Ask one clarifying question for ambiguous queries.",
    },
    {
      skillCode: 'email-drafter',
      name: 'Email Drafter',
      category: 'communication' as const,
      voiceEnabled: false,
      allowedTools: ['get_client', 'get_project'],
      publishScope: 'team' as const,
      isSystemSkill: true,
      isActive: true,
      claudeMd: "# Email Drafter\nDraft professional emails for client communication. Ask: recipient, purpose, tone. Use client context if available. Output: subject line + full email body. Offer to adjust tone or length.",
    },
    {
      skillCode: 'health-score-analyzer',
      name: 'Health Score Analyzer',
      category: 'analysis' as const,
      voiceEnabled: false,
      allowedTools: ['get_client', 'list_projects'],
      publishScope: 'team' as const,
      isSystemSkill: true,
      isActive: true,
      claudeMd: "# Health Score Analyzer\nAnalyze client health scores and recommend improvements. Break down: CSAT, CC compliance, KYC status, project progress, engagement. Output: Score Breakdown → Risk Factors → Recommended Actions (3-5 specific steps).",
    },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { skillCode: skill.skillCode },
      create: skill,
      update: {
        name: skill.name,
        category: skill.category,
        voiceEnabled: skill.voiceEnabled,
        allowedTools: skill.allowedTools,
        publishScope: skill.publishScope,
        isSystemSkill: skill.isSystemSkill,
        isActive: skill.isActive,
        claudeMd: skill.claudeMd,
      },
    });
  }
  console.log('✅ Skills (5 skills upserted)');

  console.log('\n🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
