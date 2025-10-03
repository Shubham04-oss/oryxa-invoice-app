// Automation Engine - Event-driven workflow execution

import { PrismaClient } from '@prisma/client';
import { EventEmitter } from 'events';
import { enqueueJob } from '../shared/queue/jobQueue.js';

const prisma = new PrismaClient();
const automationBus = new EventEmitter();

/**
 * Trigger automation workflows based on event
 */
export async function triggerAutomation({ tenantId, trigger, data, simulate = false }) {
  const startTime = Date.now();

  // Find matching automations
  const automations = await prisma.automation.findMany({
    where: {
      tenantId,
      enabled: true,
    },
  });

  const matchingAutomations = automations.filter((automation) => {
    return automation.trigger.type === trigger;
  });

  if (matchingAutomations.length === 0) {
    return {
      success: true,
      actions: [],
      message: 'No matching automations found',
      duration: Date.now() - startTime,
    };
  }

  const results = [];

  for (const automation of matchingAutomations) {
    // Check if conditions match
    if (!evaluateConditions(automation.trigger.conditions, data)) {
      continue;
    }

    // Execute actions
    for (const action of automation.actions) {
      const actionResult = await executeAction({
        action,
        data,
        tenantId,
        simulate,
      });

      results.push({
        automationId: automation.id,
        automationName: automation.name,
        ...actionResult,
      });
    }

    // Log execution
    if (!simulate) {
      await prisma.automationExecution.create({
        data: {
          automationId: automation.id,
          status: 'success',
          triggerData: data,
          results: results,
          startedAt: new Date(startTime),
          completedAt: new Date(),
          duration: Date.now() - startTime,
        },
      });

      // Update automation stats
      await prisma.automation.update({
        where: { id: automation.id },
        data: {
          runCount: { increment: 1 },
          lastRunAt: new Date(),
        },
      });
    }
  }

  return {
    success: true,
    actions: results,
    duration: Date.now() - startTime,
  };
}

/**
 * Execute a single action
 */
async function executeAction({ action, data, tenantId, simulate }) {
  const { type, config } = action;

  const actionMap = {
    send_email: handleSendEmail,
    send_whatsapp: handleSendWhatsApp,
    send_webhook: handleSendWebhook,
    update_field: handleUpdateField,
    create_task: handleCreateTask,
  };

  const handler = actionMap[type];
  if (!handler) {
    return {
      type,
      status: 'failed',
      error: `Unknown action type: ${type}`,
    };
  }

  try {
    const result = await handler({ config, data, tenantId, simulate });
    return {
      type,
      status: simulate ? 'simulated' : 'queued',
      ...result,
    };
  } catch (error) {
    return {
      type,
      status: 'failed',
      error: error.message,
    };
  }
}

/**
 * Action Handlers
 */

async function handleSendEmail({ config, data, tenantId, simulate }) {
  const { to, subject, template } = config;
  
  const recipient = to || data.clientEmail;
  const emailSubject = replaceVariables(subject, data);
  const emailBody = replaceVariables(template, data);

  if (simulate) {
    return {
      recipient,
      subject: emailSubject,
      preview: emailBody.substring(0, 100) + '...',
    };
  }

  const jobId = await enqueueJob({
    type: 'send_email',
    priority: 'normal',
    payload: {
      to: recipient,
      subject: emailSubject,
      html: emailBody,
      tenantId,
    },
  });

  return { jobId, recipient };
}

async function handleSendWhatsApp({ config, data, tenantId, simulate }) {
  const { to, message } = config;
  
  const recipient = to || data.clientPhone;
  const messageText = replaceVariables(message, data);

  if (simulate) {
    return {
      recipient,
      preview: messageText.substring(0, 100) + '...',
    };
  }

  const jobId = await enqueueJob({
    type: 'send_whatsapp',
    priority: 'normal',
    payload: {
      to: recipient,
      message: messageText,
      tenantId,
    },
  });

  return { jobId, recipient };
}

async function handleSendWebhook({ config, data, tenantId, simulate }) {
  const { url, method = 'POST', headers = {} } = config;

  if (simulate) {
    return {
      url,
      method,
      payload: data,
    };
  }

  const jobId = await enqueueJob({
    type: 'send_webhook',
    priority: 'low',
    payload: {
      url,
      method,
      headers,
      body: data,
      tenantId,
    },
  });

  return { jobId, url };
}

async function handleUpdateField({ config, data, tenantId, simulate }) {
  const { entityType, entityId, field, value } = config;

  if (simulate) {
    return {
      entityType,
      entityId: entityId || data.invoiceId,
      field,
      value,
    };
  }

  // Update entity (e.g., invoice status)
  if (entityType === 'invoice') {
    await prisma.invoice.update({
      where: { id: entityId || data.invoiceId },
      data: { [field]: value },
    });
  }

  return {
    entityType,
    entityId: entityId || data.invoiceId,
    updated: true,
  };
}

async function handleCreateTask({ config, data, tenantId, simulate }) {
  const { title, description, assignee } = config;

  if (simulate) {
    return {
      title: replaceVariables(title, data),
      description: replaceVariables(description, data),
      assignee,
    };
  }

  // Create task (implement based on your task management system)
  return {
    title: replaceVariables(title, data),
    created: true,
  };
}

/**
 * Helper Functions
 */

function evaluateConditions(conditions, data) {
  if (!conditions || Object.keys(conditions).length === 0) {
    return true;
  }

  // Simple condition evaluation
  // Example: { field: "status", operator: "equals", value: "overdue" }
  for (const condition of conditions) {
    const { field, operator, value } = condition;
    const dataValue = data[field];

    const operators = {
      equals: (a, b) => a === b,
      not_equals: (a, b) => a !== b,
      contains: (a, b) => a.includes(b),
      greater_than: (a, b) => a > b,
      less_than: (a, b) => a < b,
    };

    const operatorFn = operators[operator];
    if (!operatorFn || !operatorFn(dataValue, value)) {
      return false;
    }
  }

  return true;
}

function replaceVariables(template, data) {
  if (!template) return '';
  
  let result = template;
  
  // Replace {{variableName}} with data values
  const matches = template.match(/\{\{(\w+)\}\}/g);
  if (matches) {
    matches.forEach((match) => {
      const variable = match.replace(/\{\{|\}\}/g, '');
      const value = data[variable] || '';
      result = result.replace(match, value);
    });
  }

  return result;
}

/**
 * Event bus for cross-module communication
 */
export function emitAutomationEvent(trigger, data) {
  automationBus.emit(trigger, data);
}

export function onAutomationEvent(trigger, callback) {
  automationBus.on(trigger, callback);
}

export default automationBus;
