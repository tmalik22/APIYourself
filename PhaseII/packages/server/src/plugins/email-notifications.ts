import { Router, Request, Response } from 'express';

const router = Router();

// Simple email queue (in-memory for demo)
const emailQueue: any[] = [];
const sentEmails: any[] = [];

// Email templates
const templates = new Map<string, any>();
templates.set('welcome', {
  subject: 'Welcome to {{appName}}!',
  html: `
    <h1>Welcome {{name}}!</h1>
    <p>Thank you for joining {{appName}}. We're excited to have you on board.</p>
    <p>Best regards,<br>The {{appName}} Team</p>
  `,
  text: 'Welcome {{name}}! Thank you for joining {{appName}}. We\'re excited to have you on board.'
});

templates.set('reset-password', {
  subject: 'Reset Your Password',
  html: `
    <h1>Password Reset Request</h1>
    <p>Hi {{name}},</p>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <p><a href="{{resetUrl}}">Reset Password</a></p>
    <p>If you didn't request this, please ignore this email.</p>
  `,
  text: 'Hi {{name}}, you requested a password reset. Visit this link: {{resetUrl}}'
});

templates.set('notification', {
  subject: '{{subject}}',
  html: `
    <h1>{{title}}</h1>
    <p>{{message}}</p>
    {{#if actionUrl}}
    <p><a href="{{actionUrl}}">{{actionText}}</a></p>
    {{/if}}
  `,
  text: '{{title}}\n\n{{message}}\n\n{{actionUrl}}'
});

// Template engine (simple string replacement)
function renderTemplate(template: string, variables: any): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, String(value));
  }
  return result;
}

// Mock email sending function
function sendEmail(email: any): Promise<boolean> {
  return new Promise((resolve) => {
    // Simulate email sending delay
    setTimeout(() => {
      console.log(`📧 Email sent to ${email.to}: ${email.subject}`);
      sentEmails.push({
        ...email,
        sentAt: new Date().toISOString(),
        id: Date.now().toString()
      });
      resolve(true);
    }, 1000);
  });
}

// Process email queue
async function processEmailQueue() {
  while (emailQueue.length > 0) {
    const email = emailQueue.shift();
    try {
      await sendEmail(email);
    } catch (error) {
      console.error('Failed to send email:', error);
      // Could implement retry logic here
    }
  }
}

// Start processing queue every 5 seconds
setInterval(processEmailQueue, 5000);

// Send email endpoint
router.post('/send', (req: Request, res: Response) => {
  const { to, template, variables, subject, html, text } = req.body;
  
  if (!to) {
    return res.status(400).json({ error: 'Recipient email required' });
  }
  
  let email: any = { to, queuedAt: new Date().toISOString() };
  
  if (template) {
    const emailTemplate = templates.get(template);
    if (!emailTemplate) {
      return res.status(400).json({ error: `Template '${template}' not found` });
    }
    
    email.subject = renderTemplate(emailTemplate.subject, variables || {});
    email.html = renderTemplate(emailTemplate.html, variables || {});
    email.text = renderTemplate(emailTemplate.text, variables || {});
    email.template = template;
  } else if (subject && (html || text)) {
    email.subject = subject;
    email.html = html;
    email.text = text;
  } else {
    return res.status(400).json({ error: 'Either template or subject+content required' });
  }
  
  emailQueue.push(email);
  
  res.json({
    success: true,
    message: 'Email queued for sending',
    queuePosition: emailQueue.length
  });
});

// Bulk send endpoint
router.post('/send-bulk', (req: Request, res: Response) => {
  const { recipients, template, variables, subject, html, text } = req.body;
  
  if (!recipients || !Array.isArray(recipients)) {
    return res.status(400).json({ error: 'Recipients array required' });
  }
  
  const emails = recipients.map((recipient: any) => {
    const to = typeof recipient === 'string' ? recipient : recipient.email;
    const recipientVars = typeof recipient === 'object' ? { ...variables, ...recipient } : variables;
    
    let email: any = { to, queuedAt: new Date().toISOString() };
    
    if (template) {
      const emailTemplate = templates.get(template);
      if (emailTemplate) {
        email.subject = renderTemplate(emailTemplate.subject, recipientVars || {});
        email.html = renderTemplate(emailTemplate.html, recipientVars || {});
        email.text = renderTemplate(emailTemplate.text, recipientVars || {});
        email.template = template;
      }
    } else {
      email.subject = subject;
      email.html = html;
      email.text = text;
    }
    
    return email;
  });
  
  emailQueue.push(...emails);
  
  res.json({
    success: true,
    message: `${emails.length} emails queued for sending`,
    queueLength: emailQueue.length
  });
});

// Get queue status
router.get('/queue', (req: Request, res: Response) => {
  res.json({
    pending: emailQueue.length,
    sent: sentEmails.length,
    queue: emailQueue.map(email => ({
      to: email.to,
      subject: email.subject,
      queuedAt: email.queuedAt
    }))
  });
});

// Get sent emails
router.get('/sent', (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 50;
  res.json({
    emails: sentEmails.slice(-limit).reverse()
  });
});

// Templates management
router.get('/templates', (req: Request, res: Response) => {
  const templateList = Array.from(templates.entries()).map(([name, template]) => ({
    name,
    subject: template.subject,
    hasHtml: !!template.html,
    hasText: !!template.text
  }));
  res.json({ templates: templateList });
});

router.post('/templates', (req: Request, res: Response) => {
  const { name, subject, html, text } = req.body;
  
  if (!name || !subject) {
    return res.status(400).json({ error: 'Name and subject required' });
  }
  
  templates.set(name, { subject, html, text });
  res.json({ success: true, message: `Template '${name}' created` });
});

router.get('/templates/:name', (req: Request, res: Response) => {
  const template = templates.get(req.params.name);
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  res.json(template);
});

export default router;
