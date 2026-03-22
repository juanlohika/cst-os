import { Injectable } from '@nestjs/common';
import { AgentDataService } from './agent-data.service';

export type ToolName =
  | 'get_client' | 'get_project' | 'get_task' | 'get_meeting'
  | 'list_clients' | 'list_projects' | 'list_tasks'
  | 'create_task' | 'update_task_status' | 'create_timelog'
  | 'get_master_data';

export interface AnthropicToolDefinition {
  name: string;
  description: string;
  input_schema: { type: 'object'; properties: Record<string, unknown>; required: string[] };
}

const ALL_TOOL_DEFINITIONS: AnthropicToolDefinition[] = [
  { name: 'get_client', description: 'Retrieve full client profile by ID', input_schema: { type: 'object', properties: { client_id: { type: 'string', description: 'UUID of the client' } }, required: ['client_id'] } },
  { name: 'get_project', description: 'Retrieve full project details by ID', input_schema: { type: 'object', properties: { project_id: { type: 'string', description: 'UUID of the project' } }, required: ['project_id'] } },
  { name: 'get_task', description: 'Retrieve a specific task by ID', input_schema: { type: 'object', properties: { task_id: { type: 'string', description: 'UUID of the task' } }, required: ['task_id'] } },
  { name: 'get_meeting', description: 'Retrieve a meeting with transcript and attendees by ID', input_schema: { type: 'object', properties: { meeting_id: { type: 'string', description: 'UUID of the meeting' } }, required: ['meeting_id'] } },
  { name: 'list_clients', description: 'List clients with optional filters', input_schema: { type: 'object', properties: { tier: { type: 'string' }, lifecycle_stage: { type: 'string' }, assigned_am_id: { type: 'string' } }, required: [] } },
  { name: 'list_projects', description: 'List projects with optional filters', input_schema: { type: 'object', properties: { status: { type: 'string' }, phase: { type: 'string' }, client_id: { type: 'string' } }, required: [] } },
  { name: 'list_tasks', description: 'List tasks with optional filters', input_schema: { type: 'object', properties: { status: { type: 'string' }, priority: { type: 'string' }, assignee_id: { type: 'string' }, project_id: { type: 'string' } }, required: [] } },
  { name: 'create_task', description: 'Create a new task in the system', input_schema: { type: 'object', properties: { title: { type: 'string' }, project_id: { type: 'string' }, assignee_id: { type: 'string' }, priority: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] }, due_date: { type: 'string', description: 'ISO 8601 date string' }, estimated_hours: { type: 'number' } }, required: ['title'] } },
  { name: 'update_task_status', description: 'Update the status of a task', input_schema: { type: 'object', properties: { task_id: { type: 'string' }, status: { type: 'string', enum: ['todo', 'in_progress', 'review', 'done', 'cancelled'] } }, required: ['task_id', 'status'] } },
  { name: 'create_timelog', description: 'Log time spent on a task', input_schema: { type: 'object', properties: { task_id: { type: 'string' }, user_id: { type: 'string' }, hours: { type: 'number' }, description: { type: 'string' }, is_billable: { type: 'boolean' } }, required: ['task_id', 'user_id', 'hours'] } },
  { name: 'get_master_data', description: 'Get master data group values by code (e.g. client_tier, deal_stage)', input_schema: { type: 'object', properties: { group_code: { type: 'string', description: 'The master data group code' } }, required: ['group_code'] } },
];

@Injectable()
export class AgentToolRegistry {
  isAllowed(toolName: ToolName, allowedTools: string[]): boolean {
    return allowedTools.includes(toolName);
  }

  getToolDefinitions(allowedTools: string[]): AnthropicToolDefinition[] {
    return ALL_TOOL_DEFINITIONS.filter(t => allowedTools.includes(t.name));
  }

  async executeToolCall(
    toolName: ToolName,
    input: Record<string, unknown>,
    agentDataService: AgentDataService,
  ): Promise<unknown> {
    switch (toolName) {
      case 'get_client':         return agentDataService.getClient(input.client_id as string);
      case 'get_project':        return agentDataService.getProject(input.project_id as string);
      case 'get_task':           return agentDataService.getTask(input.task_id as string);
      case 'get_meeting':        return agentDataService.getMeeting(input.meeting_id as string);
      case 'list_clients':       return agentDataService.listClients({ tier: input.tier as string, lifecycleStage: input.lifecycle_stage as string, assignedAmId: input.assigned_am_id as string });
      case 'list_projects':      return agentDataService.listProjects({ status: input.status as string, phase: input.phase as string, clientId: input.client_id as string });
      case 'list_tasks':         return agentDataService.listTasks({ status: input.status as string, priority: input.priority as string, assigneeId: input.assignee_id as string, projectId: input.project_id as string });
      case 'create_task':        await agentDataService.createTask({ title: input.title as string, projectId: input.project_id as string, assigneeId: input.assignee_id as string, priority: input.priority as string, dueDate: input.due_date ? new Date(input.due_date as string) : undefined, estimatedHours: input.estimated_hours as number }); return { success: true };
      case 'update_task_status': await agentDataService.updateTaskStatus(input.task_id as string, input.status as string); return { success: true };
      case 'create_timelog':     await agentDataService.createTimelog({ taskId: input.task_id as string, userId: input.user_id as string, hours: input.hours as number, description: input.description as string, isBillable: input.is_billable as boolean }); return { success: true };
      case 'get_master_data':    return agentDataService.getMasterDataGroup(input.group_code as string);
      default:                   return { error: `Unknown tool: ${toolName}` };
    }
  }
}
