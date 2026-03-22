-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ceo', 'super_admin', 'manager', 'supervisor', 'sr_business_analyst', 'jr_business_analyst', 'viewer', 'pending_setup');

-- CreateEnum
CREATE TYPE "OrgLevel" AS ENUM ('ceo', 'manager', 'supervisor', 'sr_ba', 'jr_ba', 'support');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive', 'on_leave');

-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('prospect', 'onboarding', 'active', 'at_risk', 'churned');

-- CreateEnum
CREATE TYPE "ClientSegment" AS ENUM ('Strategic', 'Standard', 'AtRisk');

-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('SME', 'MidMarket', 'Enterprise');

-- CreateEnum
CREATE TYPE "AccountLifecycleStage" AS ENUM ('acquisition', 'onboarding', 'implementation', 'go_live', 'hypercare', 'turnover', 'bau', 'renewal', 'expansion', 'closure', 'closed');

-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('decision_maker', 'admin', 'influencer', 'end_user_lead', 'it_contact', 'executive_sponsor');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('draft', 'active', 'on_hold', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "ProjectPhase" AS ENUM ('pre_sales_handover', 'kickoff', 'fit_gap', 'solution_design', 'build_config', 'uat', 'go_live', 'hypercare', 'turnover_to_maintenance', 'bau');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('new_implementation', 're_implementation', 'expansion', 'customization');

-- CreateEnum
CREATE TYPE "TemplateCode" AS ENUM ('NCI_STD', 'CUST_PRJ', 'EXPRESS', 'BAU_SUPPORT');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('critical', 'high', 'medium', 'low');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('todo', 'in_progress', 'for_review', 'blocked', 'done', 'cancelled');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('implementation', 'customization', 'training', 'meeting', 'admin', 'rfa', 'acquisition_poc', 'system_admin');

-- CreateEnum
CREATE TYPE "MilestoneType" AS ENUM ('kickoff', 'fit_gap_completed', 'recommendation_presented', 'recommendation_approved', 'uat_conducted', 'go_live', 'training_conducted', 'hypercare_closed', 'rfa_approved', 'mockup_approved', 'courtesy_call_completed', 'kyc_completed', 'next_steps_agreed', 'dar_submitted');

-- CreateEnum
CREATE TYPE "RfaStatus" AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'cancelled');

-- CreateEnum
CREATE TYPE "RfaRequestType" AS ENUM ('customization', 'scope_change', 'timeline_extension', 'budget_exception', 'technical_exception', 'other');

-- CreateEnum
CREATE TYPE "RfaAiReviewGrade" AS ENUM ('approved_recommended', 'approved_with_conditions', 'needs_clarification', 'rejected_recommended');

-- CreateEnum
CREATE TYPE "ApproverAgreement" AS ENUM ('agreed', 'partially_agreed', 'disagreed');

-- CreateEnum
CREATE TYPE "MeetingType" AS ENUM ('kickoff', 'fit_gap', 'courtesy_call', 'uat_walkthrough', 'training', 'internal', 'escalation', 'go_live_review', 'hypercare_review', 'external');

-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');

-- CreateEnum
CREATE TYPE "BrdStatus" AS ENUM ('draft', 'for_review', 'approved', 'rejected', 'superseded');

-- CreateEnum
CREATE TYPE "FitGapStatus" AS ENUM ('draft', 'for_review', 'approved');

-- CreateEnum
CREATE TYPE "KbCategory" AS ENUM ('sop', 'playbook', 'troubleshooting', 'faq', 'best_practice', 'product_guide', 'training_material');

-- CreateEnum
CREATE TYPE "KbStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE', 'ASSIGN', 'UNASSIGN');

-- CreateEnum
CREATE TYPE "AiAppCategory" AS ENUM ('document_generation', 'analysis', 'communication', 'design', 'validation', 'planning');

-- CreateEnum
CREATE TYPE "AiAppStatus" AS ENUM ('active', 'inactive', 'testing');

-- CreateEnum
CREATE TYPE "ProcessFlowType" AS ENUM ('current_state', 'future_state', 'system_flow', 'data_flow');

-- CreateEnum
CREATE TYPE "LearningCategory" AS ENUM ('process', 'technical', 'client_handling', 'configuration', 'change_management', 'communication', 'estimation');

-- CreateEnum
CREATE TYPE "ImpactLevel" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "CsatSurveyType" AS ENUM ('post_go_live', 'post_hypercare', 'periodic_check', 'post_training', 'ad_hoc');

-- CreateEnum
CREATE TYPE "HolidayType" AS ENUM ('regular_holiday', 'special_nonworking', 'special_working');

-- CreateEnum
CREATE TYPE "CourtesyCallStatus" AS ENUM ('pending', 'in_progress', 'completed', 'missed');

-- CreateEnum
CREATE TYPE "ClosureReason" AS ENUM ('client_request', 'non_payment', 'business_closure', 'competitor_switch', 'product_mismatch', 'contract_end_no_renewal', 'other');

-- CreateEnum
CREATE TYPE "DealStage" AS ENUM ('initial_contact', 'demo_scheduled', 'demo_done', 'proposal_sent', 'negotiation', 'verbal_agreement', 'contract_pending', 'won', 'lost');

-- CreateEnum
CREATE TYPE "KpiPeriodStatus" AS ENUM ('open', 'locked', 'finalized');

-- CreateEnum
CREATE TYPE "KpiMetricFormula" AS ENUM ('MILESTONE_COMPLETION_RATE', 'KYC_COMPLETION_RATE', 'TASK_COMPLETION_RATE', 'USAGE_SUPPORT_RATE', 'PROJECT_WORK_SCORE', 'MANUAL_SCORE', 'WEIGHTED_AVERAGE');

-- CreateEnum
CREATE TYPE "FeedEventType" AS ENUM ('task_completed', 'milestone_reached', 'project_phase_advanced', 'brd_approved', 'rfa_submitted', 'rfa_approved', 'project_created', 'courtesy_call_done', 'csat_received', 'go_live', 'training_done', 'account_onboarded', 'comment_mention', 'kpi_score_updated', 'poc_delivered', 'holiday_reminder', 'team_announcement');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'pending_setup',
    "orgLevel" "OrgLevel",
    "skills" TEXT[],
    "capacityHoursPerWeek" INTEGER NOT NULL DEFAULT 40,
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "profilePhotoUrl" TEXT,
    "department" TEXT,
    "dateJoined" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "googleId" TEXT,
    "managerId" TEXT,
    "reportsToId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "industry" TEXT,
    "companySize" "CompanySize",
    "subscriptionPlan" TEXT,
    "contractStartDate" TIMESTAMP(3),
    "contractEndDate" TIMESTAMP(3),
    "status" "ClientStatus" NOT NULL DEFAULT 'prospect',
    "lifecycleStage" "AccountLifecycleStage" NOT NULL DEFAULT 'acquisition',
    "clientHealthScore" INTEGER,
    "assignedAccountManagerId" TEXT,
    "courtesyCallTierId" TEXT,
    "address" TEXT,
    "website" TEXT,
    "primaryContactName" TEXT,
    "primaryContactEmail" TEXT,
    "primaryContactPhone" TEXT,
    "tags" TEXT[],
    "segment" "ClientSegment",
    "notes" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_team_members" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "client_team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_contacts" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "position" TEXT,
    "department" TEXT,
    "email" TEXT,
    "mobile" TEXT,
    "contactType" "ContactType" NOT NULL DEFAULT 'end_user_lead',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "projectType" "ProjectType" NOT NULL,
    "templateId" TEXT,
    "startDate" TIMESTAMP(3),
    "targetGoLiveDate" TIMESTAMP(3),
    "actualGoLiveDate" TIMESTAMP(3),
    "status" "ProjectStatus" NOT NULL DEFAULT 'draft',
    "phase" "ProjectPhase" NOT NULL DEFAULT 'pre_sales_handover',
    "lifecycleStage" "AccountLifecycleStage" NOT NULL DEFAULT 'onboarding',
    "priority" "Priority" NOT NULL DEFAULT 'medium',
    "assignedPmId" TEXT,
    "estimatedManhours" INTEGER,
    "actualManhours" INTEGER,
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'low',
    "riskNotes" TEXT,
    "scopeDescription" TEXT,
    "tags" TEXT[],
    "baselineSnapshot" JSONB,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_team_members" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "project_team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestones" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "phase" "ProjectPhase",
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "projectId" TEXT,
    "milestoneId" TEXT,
    "rfaId" TEXT,
    "parentTaskId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'todo',
    "priority" "Priority" NOT NULL DEFAULT 'medium',
    "assignedToId" TEXT,
    "createdById" TEXT,
    "startDate" TIMESTAMP(3),
    "scheduledDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "timeBlockStart" TIMESTAMP(3),
    "timeBlockEnd" TIMESTAMP(3),
    "estimatedHours" DECIMAL(65,30),
    "actualHours" DECIMAL(65,30),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "dependencyTaskIds" TEXT[],
    "tags" TEXT[],
    "type" "TaskType" NOT NULL DEFAULT 'implementation',
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrenceRule" TEXT,
    "isMilestone" BOOLEAN NOT NULL DEFAULT false,
    "milestoneType" "MilestoneType",
    "linkedAppIds" TEXT[],
    "communicationTriggerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subtasks" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "subtasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_logs" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hours" DECIMAL(65,30) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "time_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfas" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "requestType" "RfaRequestType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" "Priority" NOT NULL DEFAULT 'medium',
    "requestedById" TEXT,
    "slaDays" INTEGER,
    "submittedAt" TIMESTAMP(3),
    "approvedById" TEXT,
    "status" "RfaStatus" NOT NULL DEFAULT 'draft',
    "approvalNotes" TEXT,
    "estimatedEffortHours" DECIMAL(65,30),
    "actualManhours" DECIMAL(65,30),
    "turnaroundTimeDays" INTEGER,
    "completionDate" TIMESTAMP(3),
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rfas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meetings" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "projectId" TEXT,
    "title" TEXT NOT NULL,
    "meetingType" "MeetingType" NOT NULL,
    "meetingDate" TIMESTAMP(3) NOT NULL,
    "participants" JSONB,
    "recordingUrl" TEXT,
    "transcriptRaw" TEXT,
    "transcriptFormatted" TEXT,
    "aiSummary" TEXT,
    "actionItems" JSONB,
    "decisions" JSONB,
    "painPoints" JSONB,
    "requirements" JSONB,
    "risksIdentified" JSONB,
    "followUpMeetingId" TEXT,
    "status" "MeetingStatus" NOT NULL DEFAULT 'scheduled',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brds" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT 'v1.0',
    "status" "BrdStatus" NOT NULL DEFAULT 'draft',
    "title" TEXT NOT NULL,
    "createdById" TEXT,
    "approvedById" TEXT,
    "linkedMeetingIds" TEXT[],
    "linkedFitGapId" TEXT,
    "content" JSONB,
    "googleDocId" TEXT,
    "googleDocUrl" TEXT,
    "submittedForReviewAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fit_gap_analyses" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "meetingId" TEXT,
    "status" "FitGapStatus" NOT NULL DEFAULT 'draft',
    "createdById" TEXT,
    "rows" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fit_gap_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_flows" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "brdId" TEXT,
    "meetingId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "flowType" "ProcessFlowType" NOT NULL,
    "generatedBy" TEXT NOT NULL DEFAULT 'ai',
    "sourceText" TEXT,
    "diagramDefinition" TEXT,
    "diagramSvgUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "version" TEXT NOT NULL DEFAULT 'v1.0',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "process_flows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_base" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "KbCategory" NOT NULL,
    "content" TEXT,
    "tags" TEXT[],
    "productArea" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "ownerId" TEXT,
    "status" "KbStatus" NOT NULL DEFAULT 'draft',
    "isAiIndexed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knowledge_base_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_learnings" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "category" "LearningCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "whatHappened" TEXT,
    "rootCause" TEXT,
    "resolution" TEXT,
    "recommendation" TEXT,
    "impactLevel" "ImpactLevel" NOT NULL DEFAULT 'medium',
    "tags" TEXT[],
    "createdById" TEXT,
    "isAiIndexed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_learnings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_items" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "likelihood" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "riskScore" INTEGER,
    "mitigationPlan" TEXT,
    "ownerId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "risk_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_apps" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "category" "AiAppCategory" NOT NULL,
    "status" "AiAppStatus" NOT NULL DEFAULT 'active',
    "requiredRoles" TEXT[],
    "claudeMdInstruction" TEXT,
    "claudeMdVersion" TEXT NOT NULL DEFAULT '1.0.0',
    "steps" JSONB,
    "skillId" TEXT,
    "knowledgeSources" JSONB,
    "outputFormat" TEXT,
    "outputTemplateId" TEXT,
    "postOutputActions" JSONB,
    "isSystemApp" BOOLEAN NOT NULL DEFAULT false,
    "canBeDeleted" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_app_sessions" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,
    "clientId" TEXT,
    "taskId" TEXT,
    "context" JSONB,
    "messages" JSONB,
    "output" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_app_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "fieldName" TEXT,
    "oldValue" JSONB,
    "newValue" JSONB,
    "performedBy" TEXT,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "metadata" JSONB,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "parentId" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "reactions" JSONB,
    "editHistory" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "csat_surveys" (
    "id" TEXT NOT NULL,
    "surveyRef" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "projectId" TEXT,
    "surveyType" "CsatSurveyType" NOT NULL,
    "token" TEXT NOT NULL,
    "respondentEmail" TEXT,
    "respondentName" TEXT,
    "scoreAppAndDashboard" INTEGER,
    "scoreImplementationManager" INTEGER,
    "scoreOverallRecommendation" INTEGER,
    "comments" TEXT,
    "respondedAt" TIMESTAMP(3),
    "reminderSentAt" TIMESTAMP(3),
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "csat_surveys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courtesy_call_tiers" (
    "id" TEXT NOT NULL,
    "tierName" TEXT NOT NULL,
    "tierNumber" INTEGER NOT NULL,
    "callFrequency" TEXT NOT NULL,
    "callsPerPeriod" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "courtesy_call_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courtesy_call_assignments" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "assignedToId" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "targetMonth" TIMESTAMP(3) NOT NULL,
    "plannedCallCount" INTEGER NOT NULL,
    "completedCallCount" INTEGER NOT NULL DEFAULT 0,
    "status" "CourtesyCallStatus" NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courtesy_call_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ph_holidays" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "localName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "holidayType" "HolidayType" NOT NULL,
    "year" INTEGER NOT NULL,
    "isAdminOverride" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,

    CONSTRAINT "ph_holidays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turnover_records" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "cstHandlerId" TEXT,
    "cctReceiverId" TEXT,
    "endorsementMeetingId" TEXT,
    "slaDocumentUrl" TEXT,
    "handoverDocUrl" TEXT,
    "cctSignedOff" BOOLEAN NOT NULL DEFAULT false,
    "cstSupervisorSignedOff" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "checklistState" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "turnover_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_closures" (
    "id" TEXT NOT NULL,
    "closureRef" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "closureReason" "ClosureReason" NOT NULL,
    "requestedById" TEXT,
    "checklistState" JSONB,
    "outstandingBalance" DECIMAL(65,30),
    "managerApprovedById" TEXT,
    "managerApprovedAt" TIMESTAMP(3),
    "financeApprovedById" TEXT,
    "financeApprovedAt" TIMESTAMP(3),
    "ceoApprovedById" TEXT,
    "ceoApprovedAt" TIMESTAMP(3),
    "closureDate" TIMESTAMP(3),
    "financeBlockedReason" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_closures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acquisition_pipeline" (
    "id" TEXT NOT NULL,
    "pipelineRef" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "dealStage" "DealStage" NOT NULL DEFAULT 'initial_contact',
    "probability" INTEGER NOT NULL DEFAULT 0,
    "estimatedGoLiveDate" TIMESTAMP(3),
    "targetCstAssignmentDate" TIMESTAMP(3),
    "projectedAssignedToId" TEXT,
    "requiresPoc" BOOLEAN NOT NULL DEFAULT false,
    "pocDescription" TEXT,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "industry" TEXT,
    "notes" TEXT,
    "convertedClientId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "acquisition_pipeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_feed_events" (
    "id" TEXT NOT NULL,
    "eventType" "FeedEventType" NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "actorId" TEXT,
    "content" TEXT,
    "metadata" JSONB,
    "reactions" JSONB,
    "visibility" TEXT NOT NULL DEFAULT 'all',
    "isAnnouncement" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_feed_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpi_periods" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "status" "KpiPeriodStatus" NOT NULL DEFAULT 'open',
    "lockedAt" TIMESTAMP(3),
    "finalizedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kpi_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpi_scorecard_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "targetRole" "UserRole" NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kpi_scorecard_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpi_categories" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weight" DECIMAL(65,30) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "kpi_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpi_metrics" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "formula" "KpiMetricFormula" NOT NULL,
    "weight" DECIMAL(65,30) NOT NULL,
    "target" DECIMAL(65,30),
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "kpi_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpi_scorecard_instances" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "totalScore" DECIMAL(65,30),
    "status" "KpiPeriodStatus" NOT NULL DEFAULT 'open',
    "lastCalcAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kpi_scorecard_instances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metric_scores" (
    "id" TEXT NOT NULL,
    "instanceId" TEXT NOT NULL,
    "metricId" TEXT NOT NULL,
    "rawScore" DECIMAL(65,30),
    "weightedScore" DECIMAL(65,30),
    "detailRows" JSONB,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metric_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestone_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT,
    "projectId" TEXT,
    "clientId" TEXT,
    "milestoneType" "MilestoneType" NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "timeliness" TEXT,
    "qualityScore" DECIMAL(65,30),
    "kpiPeriodId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "milestone_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_targets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "fieldAppTarget" INTEGER NOT NULL DEFAULT 0,
    "managerAppTarget" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usage_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_actuals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "fieldAppActual" INTEGER NOT NULL DEFAULT 0,
    "managerAppActual" INTEGER NOT NULL DEFAULT 0,
    "fieldResult" DECIMAL(65,30),
    "combinedResult" DECIMAL(65,30),
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usage_actuals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "script_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "mergeFields" TEXT[],
    "triggerEvent" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "script_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automation_rules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "triggerEvent" TEXT NOT NULL,
    "triggerCondition" JSONB,
    "scriptTemplateId" TEXT,
    "targetRecipients" JSONB,
    "delayMinutes" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automation_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comms_logs" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "projectId" TEXT,
    "rfaId" TEXT,
    "sentById" TEXT,
    "channel" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT,
    "recipientEmail" TEXT,
    "recipientName" TEXT,
    "templateId" TEXT,
    "automationRuleId" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "openedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'sent',
    "metadata" JSONB,

    CONSTRAINT "comms_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfa_ai_reviews" (
    "id" TEXT NOT NULL,
    "rfaId" TEXT NOT NULL,
    "summary" TEXT,
    "assessment" JSONB,
    "grade" "RfaAiReviewGrade",
    "completenessScore" DECIMAL(65,30),
    "flags" TEXT[],
    "precedentAnalysis" TEXT,
    "approverAgreement" "ApproverAgreement",
    "reviewedAt" TIMESTAMP(3),
    "approverReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rfa_ai_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_templates" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "projectType" "ProjectType" NOT NULL,
    "totalHours" DECIMAL(65,30),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_template_phases" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "phase" "ProjectPhase" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "project_template_phases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_template_milestones" (
    "id" TEXT NOT NULL,
    "phaseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "project_template_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "default_tasks" (
    "id" TEXT NOT NULL,
    "milestoneId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "taskType" "TaskType" NOT NULL,
    "estimatedHours" DECIMAL(65,30) NOT NULL,
    "assignedRoleDefault" "UserRole",
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "linkedAppIds" TEXT[],
    "description" TEXT,

    CONSTRAINT "default_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "client_team_members_clientId_userId_key" ON "client_team_members"("clientId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "project_team_members_projectId_userId_key" ON "project_team_members"("projectId", "userId");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_performedBy_idx" ON "audit_logs"("performedBy");

-- CreateIndex
CREATE INDEX "comments_entityType_entityId_idx" ON "comments"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "csat_surveys_surveyRef_key" ON "csat_surveys"("surveyRef");

-- CreateIndex
CREATE UNIQUE INDEX "csat_surveys_token_key" ON "csat_surveys"("token");

-- CreateIndex
CREATE UNIQUE INDEX "courtesy_call_tiers_tierNumber_key" ON "courtesy_call_tiers"("tierNumber");

-- CreateIndex
CREATE UNIQUE INDEX "courtesy_call_assignments_clientId_assignedToId_targetMonth_key" ON "courtesy_call_assignments"("clientId", "assignedToId", "targetMonth");

-- CreateIndex
CREATE INDEX "ph_holidays_year_idx" ON "ph_holidays"("year");

-- CreateIndex
CREATE UNIQUE INDEX "ph_holidays_date_holidayType_key" ON "ph_holidays"("date", "holidayType");

-- CreateIndex
CREATE UNIQUE INDEX "turnover_records_projectId_key" ON "turnover_records"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "turnover_records_endorsementMeetingId_key" ON "turnover_records"("endorsementMeetingId");

-- CreateIndex
CREATE UNIQUE INDEX "account_closures_closureRef_key" ON "account_closures"("closureRef");

-- CreateIndex
CREATE UNIQUE INDEX "acquisition_pipeline_pipelineRef_key" ON "acquisition_pipeline"("pipelineRef");

-- CreateIndex
CREATE INDEX "news_feed_events_createdAt_idx" ON "news_feed_events"("createdAt");

-- CreateIndex
CREATE INDEX "news_feed_events_eventType_idx" ON "news_feed_events"("eventType");

-- CreateIndex
CREATE UNIQUE INDEX "kpi_periods_year_month_key" ON "kpi_periods"("year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "kpi_scorecard_instances_userId_periodId_key" ON "kpi_scorecard_instances"("userId", "periodId");

-- CreateIndex
CREATE UNIQUE INDEX "metric_scores_instanceId_metricId_key" ON "metric_scores"("instanceId", "metricId");

-- CreateIndex
CREATE UNIQUE INDEX "usage_targets_userId_periodId_key" ON "usage_targets"("userId", "periodId");

-- CreateIndex
CREATE UNIQUE INDEX "usage_actuals_userId_periodId_key" ON "usage_actuals"("userId", "periodId");

-- CreateIndex
CREATE UNIQUE INDEX "rfa_ai_reviews_rfaId_key" ON "rfa_ai_reviews"("rfaId");

-- CreateIndex
CREATE UNIQUE INDEX "project_templates_code_key" ON "project_templates"("code");

-- CreateIndex
CREATE UNIQUE INDEX "default_tasks_code_key" ON "default_tasks"("code");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_assignedAccountManagerId_fkey" FOREIGN KEY ("assignedAccountManagerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_courtesyCallTierId_fkey" FOREIGN KEY ("courtesyCallTierId") REFERENCES "courtesy_call_tiers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_team_members" ADD CONSTRAINT "client_team_members_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_team_members" ADD CONSTRAINT "client_team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_contacts" ADD CONSTRAINT "client_contacts_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_assignedPmId_fkey" FOREIGN KEY ("assignedPmId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_team_members" ADD CONSTRAINT "project_team_members_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_team_members" ADD CONSTRAINT "project_team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "milestones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_rfaId_fkey" FOREIGN KEY ("rfaId") REFERENCES "rfas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_parentTaskId_fkey" FOREIGN KEY ("parentTaskId") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subtasks" ADD CONSTRAINT "subtasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_logs" ADD CONSTRAINT "time_logs_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_logs" ADD CONSTRAINT "time_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfas" ADD CONSTRAINT "rfas_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfas" ADD CONSTRAINT "rfas_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfas" ADD CONSTRAINT "rfas_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfas" ADD CONSTRAINT "rfas_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brds" ADD CONSTRAINT "brds_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brds" ADD CONSTRAINT "brds_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brds" ADD CONSTRAINT "brds_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brds" ADD CONSTRAINT "brds_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brds" ADD CONSTRAINT "brds_linkedFitGapId_fkey" FOREIGN KEY ("linkedFitGapId") REFERENCES "fit_gap_analyses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fit_gap_analyses" ADD CONSTRAINT "fit_gap_analyses_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fit_gap_analyses" ADD CONSTRAINT "fit_gap_analyses_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fit_gap_analyses" ADD CONSTRAINT "fit_gap_analyses_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fit_gap_analyses" ADD CONSTRAINT "fit_gap_analyses_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_flows" ADD CONSTRAINT "process_flows_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_flows" ADD CONSTRAINT "process_flows_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_flows" ADD CONSTRAINT "process_flows_brdId_fkey" FOREIGN KEY ("brdId") REFERENCES "brds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_flows" ADD CONSTRAINT "process_flows_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_base" ADD CONSTRAINT "knowledge_base_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_learnings" ADD CONSTRAINT "project_learnings_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_learnings" ADD CONSTRAINT "project_learnings_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_learnings" ADD CONSTRAINT "project_learnings_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_items" ADD CONSTRAINT "risk_items_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_items" ADD CONSTRAINT "risk_items_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_app_sessions" ADD CONSTRAINT "ai_app_sessions_appId_fkey" FOREIGN KEY ("appId") REFERENCES "ai_apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_app_sessions" ADD CONSTRAINT "ai_app_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_app_sessions" ADD CONSTRAINT "ai_app_sessions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_app_sessions" ADD CONSTRAINT "ai_app_sessions_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "csat_surveys" ADD CONSTRAINT "csat_surveys_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "csat_surveys" ADD CONSTRAINT "csat_surveys_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "csat_surveys" ADD CONSTRAINT "csat_surveys_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courtesy_call_assignments" ADD CONSTRAINT "courtesy_call_assignments_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courtesy_call_assignments" ADD CONSTRAINT "courtesy_call_assignments_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courtesy_call_assignments" ADD CONSTRAINT "courtesy_call_assignments_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "courtesy_call_tiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turnover_records" ADD CONSTRAINT "turnover_records_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turnover_records" ADD CONSTRAINT "turnover_records_cstHandlerId_fkey" FOREIGN KEY ("cstHandlerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turnover_records" ADD CONSTRAINT "turnover_records_cctReceiverId_fkey" FOREIGN KEY ("cctReceiverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turnover_records" ADD CONSTRAINT "turnover_records_endorsementMeetingId_fkey" FOREIGN KEY ("endorsementMeetingId") REFERENCES "meetings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_closures" ADD CONSTRAINT "account_closures_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_closures" ADD CONSTRAINT "account_closures_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_closures" ADD CONSTRAINT "account_closures_managerApprovedById_fkey" FOREIGN KEY ("managerApprovedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_closures" ADD CONSTRAINT "account_closures_financeApprovedById_fkey" FOREIGN KEY ("financeApprovedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_closures" ADD CONSTRAINT "account_closures_ceoApprovedById_fkey" FOREIGN KEY ("ceoApprovedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acquisition_pipeline" ADD CONSTRAINT "acquisition_pipeline_projectedAssignedToId_fkey" FOREIGN KEY ("projectedAssignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acquisition_pipeline" ADD CONSTRAINT "acquisition_pipeline_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_feed_events" ADD CONSTRAINT "news_feed_events_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpi_categories" ADD CONSTRAINT "kpi_categories_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "kpi_scorecard_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpi_metrics" ADD CONSTRAINT "kpi_metrics_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "kpi_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpi_scorecard_instances" ADD CONSTRAINT "kpi_scorecard_instances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpi_scorecard_instances" ADD CONSTRAINT "kpi_scorecard_instances_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "kpi_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpi_scorecard_instances" ADD CONSTRAINT "kpi_scorecard_instances_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "kpi_scorecard_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metric_scores" ADD CONSTRAINT "metric_scores_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "kpi_scorecard_instances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metric_scores" ADD CONSTRAINT "metric_scores_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "kpi_metrics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_logs" ADD CONSTRAINT "milestone_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_logs" ADD CONSTRAINT "milestone_logs_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_logs" ADD CONSTRAINT "milestone_logs_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_logs" ADD CONSTRAINT "milestone_logs_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_logs" ADD CONSTRAINT "milestone_logs_kpiPeriodId_fkey" FOREIGN KEY ("kpiPeriodId") REFERENCES "kpi_periods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_targets" ADD CONSTRAINT "usage_targets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_targets" ADD CONSTRAINT "usage_targets_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "kpi_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_actuals" ADD CONSTRAINT "usage_actuals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_actuals" ADD CONSTRAINT "usage_actuals_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "kpi_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "script_templates" ADD CONSTRAINT "script_templates_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comms_logs" ADD CONSTRAINT "comms_logs_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comms_logs" ADD CONSTRAINT "comms_logs_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comms_logs" ADD CONSTRAINT "comms_logs_rfaId_fkey" FOREIGN KEY ("rfaId") REFERENCES "rfas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comms_logs" ADD CONSTRAINT "comms_logs_sentById_fkey" FOREIGN KEY ("sentById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfa_ai_reviews" ADD CONSTRAINT "rfa_ai_reviews_rfaId_fkey" FOREIGN KEY ("rfaId") REFERENCES "rfas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_template_phases" ADD CONSTRAINT "project_template_phases_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "project_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_template_milestones" ADD CONSTRAINT "project_template_milestones_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "project_template_phases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "default_tasks" ADD CONSTRAINT "default_tasks_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "project_template_milestones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
