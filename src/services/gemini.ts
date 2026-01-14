import { GoogleGenerativeAI } from '@google/generative-ai'
import type { CompanyData, Solution } from '@/store/useStore'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '')

// ========================================
// TYPES
// ========================================

export interface AnalysisContext {
  company: string
  industry: string
}

export interface VisionResult {
  description: string
  objects: string[]
  confidence: number
  insights: string[]
}

export interface DocumentResult {
  extractedFields: Record<string, string>
  confidence: number
  documentType: string
}

export interface AnalyticsResult {
  insights: string[]
  trends: string[]
  forecast: string
  recommendation: string
}

export interface WorkflowStep {
  step: number
  action: string
  status: 'pending' | 'running' | 'complete' | 'error'
  result?: string
}

// ========================================
// INDUSTRY TEMPLATES
// ========================================

const INDUSTRY_TEMPLATES: Record<string, { solutions: Partial<Solution>[], mermaidTemplate: string }> = {
  retail: {
    solutions: [
      { name: 'Smart Customer Support', type: 'nlp', description: 'Handle product inquiries, order tracking, and returns 24/7', impact: '60% cost reduction' },
      { name: 'Visual Quality Control', type: 'vision', description: 'Automated product inspection and defect detection', impact: '99% accuracy' },
      { name: 'Demand Forecasting', type: 'analytics', description: 'Predict inventory needs by location and season', impact: '30% less waste' },
      { name: 'Supply Chain Automation', type: 'agentic', description: 'Automate reordering and vendor communication', impact: '40% faster' },
    ],
    mermaidTemplate: `graph TD
A[Retail Business] --> B[Customer Experience]
A --> C[Operations]
A --> D[Supply Chain]
A --> E[Analytics]
B --> F[24/7 AI Support]
B --> G[Personalization]
C --> H[Visual QC]
C --> I[Auto Inventory]
D --> J[Demand Forecast]
D --> K[Vendor Automation]
E --> L[Sales Insights]`
  },
  healthcare: {
    solutions: [
      { name: 'Clinical Document Processing', type: 'nlp', description: 'Extract patient data from forms and reports', impact: '80% time saved' },
      { name: 'Medical Image Analysis', type: 'vision', description: 'Assist radiologists with scan interpretation', impact: '94% accuracy' },
      { name: 'Patient Triage Assistant', type: 'nlp', description: 'Initial symptom assessment and routing', impact: '50% faster triage' },
      { name: 'Insurance Verification', type: 'agentic', description: 'Automate eligibility checks and pre-authorization', impact: '90% automation' },
    ],
    mermaidTemplate: `graph TD
A[Healthcare] --> B[Patient Care]
A --> C[Operations]
A --> D[Analytics]
B --> E[AI Triage]
B --> F[Diagnosis Support]
C --> G[Doc Processing]
C --> H[Scheduling]
D --> I[Predictive Health]
D --> J[Resource Planning]`
  },
  finance: {
    solutions: [
      { name: 'Loan Document Processing', type: 'nlp', description: 'Extract and verify data from applications', impact: '70% faster processing' },
      { name: 'Fraud Detection', type: 'analytics', description: 'Real-time transaction anomaly detection', impact: '99.5% detection' },
      { name: 'Financial Advisory Bot', type: 'nlp', description: 'Answer account and investment questions', impact: '24/7 availability' },
      { name: 'Compliance Monitoring', type: 'agentic', description: 'Automated regulatory report generation', impact: '100% compliance' },
    ],
    mermaidTemplate: `graph TD
A[Finance] --> B[Risk Management]
A --> C[Customer Service]
A --> D[Operations]
B --> E[Fraud Detection]
B --> F[Credit Scoring]
C --> G[Advisory Bot]
C --> H[Account Support]
D --> I[Doc Processing]
D --> J[Compliance AI]`
  },
  manufacturing: {
    solutions: [
      { name: 'Quality Inspection AI', type: 'vision', description: 'Automated visual quality control on production line', impact: '99.9% accuracy' },
      { name: 'Predictive Maintenance', type: 'analytics', description: 'Prevent equipment failures before they happen', impact: '40% less downtime' },
      { name: 'Production Scheduling', type: 'agentic', description: 'Optimize production workflows automatically', impact: '25% efficiency gain' },
      { name: 'Compliance Documentation', type: 'nlp', description: 'Automate safety and compliance reports', impact: '100% audit-ready' },
    ],
    mermaidTemplate: `graph TD
A[Manufacturing] --> B[Production]
A --> C[Quality]
A --> D[Maintenance]
B --> E[Smart Scheduling]
B --> F[Resource Optimization]
C --> G[Visual Inspection]
C --> H[Defect Detection]
D --> I[Predictive AI]
D --> J[Asset Tracking]`
  },
  technology: {
    solutions: [
      { name: 'Intelligent Code Assistant', type: 'nlp', description: 'AI-powered code generation and review', impact: '50% faster dev' },
      { name: 'Customer Success Bot', type: 'nlp', description: 'Technical support and documentation queries', impact: '80% self-service' },
      { name: 'Infrastructure Monitoring', type: 'analytics', description: 'Predict and prevent system issues', impact: '99.9% uptime' },
      { name: 'DevOps Automation', type: 'agentic', description: 'Automate deployment and incident response', impact: '70% faster MTTR' },
    ],
    mermaidTemplate: `graph TD
A[Technology] --> B[Development]
A --> C[Support]
A --> D[Infrastructure]
B --> E[Code Assistant]
B --> F[Code Review AI]
C --> G[Support Bot]
C --> H[Knowledge Base]
D --> I[Monitoring AI]
D --> J[Auto Scaling]`
  },
}

// ========================================
// COMPANY ANALYSIS (Discovery Section)
// ========================================

export async function generateBlueprint(companyName: string): Promise<CompanyData> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const prompt = `You are an expert AI solutions architect at a leading AI consultancy. Research and analyze "${companyName}" thoroughly.

STEP 1: Understand the company
- What does ${companyName} actually do?
- What industry are they in?
- What are their core business processes?
- Who are their customers?
- What challenges do companies like them typically face?

STEP 2: Design AI solutions that make REAL business sense
Think about:
- Customer Experience: How can AI improve how they serve customers?
- Operations: What processes can be automated or optimized?
- Data & Insights: What business intelligence can AI unlock?
- Growth: How can AI help them scale or enter new markets?

Return ONLY valid JSON:
{
  "company": "${companyName}",
  "industry": "retail|healthcare|finance|manufacturing|technology|logistics|education|hospitality|media|other",
  "summary": "A compelling sentence about THE SPECIFIC AI opportunity for THIS company based on what they actually do",
  "solutions": [
    {
      "name": "Specific Solution Name relevant to their business",
      "type": "agentic|vision|nlp|analytics|automation",
      "description": "Exactly how this helps their specific business",
      "impact": "Specific business benefit like 'Faster customer resolution' or 'Reduced operational costs'"
    }
  ],
  "mermaidDiagram": "DETAILED diagram showing data flow and AI integration points"
}

FOR THE MERMAID DIAGRAM - BE CREATIVE AND SPECIFIC:
Create a flowchart that shows HOW AI integrates into ${companyName}'s actual business:

Example structure for a retail company:
graph TD
A[Customer Touchpoints] --> B[AI Layer]
B --> C[Personalization Engine]
B --> D[Support Automation]
B --> E[Inventory Intelligence]
C --> F[Product Recommendations]
C --> G[Dynamic Pricing]
D --> H[Chatbot Support]
D --> I[Ticket Routing]
E --> J[Demand Forecasting]
E --> K[Stock Optimization]
F --> L[Increased Conversions]
H --> L
J --> M[Reduced Waste]

Rules:
- Use "graph TD" (top-down)
- Simple IDs: A, B, C, D, E, F, G, H, I, J, K, L, M, N
- Labels in brackets: A[Label]
- Arrows: -->
- 12-15 nodes showing real data/process flow
- Use \\n for newlines
- NO special characters or quotes in labels
- Show: Inputs → AI Processing → Outputs → Business Value

Make solutions and diagram SPECIFIC to what ${companyName} actually does. Generic AI solutions are not acceptable.

Return ONLY the JSON object.`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const data = JSON.parse(jsonMatch[0])
    
    // Validate and return
    return {
      company: data.company || companyName,
      industry: data.industry || 'technology',
      summary: data.summary || `AI-powered transformation for ${companyName}`,
      solutions: (data.solutions || []).map((s: Partial<Solution>) => ({
        name: s.name || 'AI Solution',
        type: s.type || 'automation',
        description: s.description || 'Intelligent automation',
        impact: s.impact || 'Improved efficiency',
      })),
      mermaidDiagram: data.mermaidDiagram || INDUSTRY_TEMPLATES.technology.mermaidTemplate,
    }
  } catch (error) {
    console.error('Gemini API error:', error)
    
    // Fallback to template
    const template = INDUSTRY_TEMPLATES.technology
    return {
      company: companyName,
      industry: 'technology',
      summary: `AI can automate workflows and unlock insights from ${companyName}'s data.`,
      solutions: template.solutions as Solution[],
      mermaidDiagram: template.mermaidTemplate.replace('Tech Stack', companyName),
    }
  }
}

// ========================================
// CONVERSATIONAL AI (Chat Demo)
// ========================================

export async function chat(
  message: string,
  context?: AnalysisContext
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const systemPrompt = context
      ? `You are an AI assistant for ${context.company} in the ${context.industry} industry. 
         Be helpful, professional, and concise (2-3 sentences max). 
         Focus on topics relevant to their business.
         If asked about products/services, give plausible examples for a ${context.industry} company.`
      : `You are a helpful AI assistant demonstrating conversational AI capabilities. 
         Be concise (2-3 sentences max) and professional.`

    const result = await model.generateContent(`${systemPrompt}\n\nUser: ${message}`)
    return result.response.text()
  } catch (error) {
    console.error('Chat error:', error)
    return "I'd be happy to help with that. Could you provide more details about your specific needs?"
  }
}

// ========================================
// AI AGENTS (Workflow Demo)
// ========================================

export async function executeAgentWorkflow(
  task: string,
  context?: AnalysisContext
): Promise<WorkflowStep[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const prompt = `You are simulating an AI agent workflow for ${context?.company || 'a company'} in ${context?.industry || 'business'}.

Task: "${task}"

Generate a realistic 5-step workflow that an AI agent would execute autonomously.
Return ONLY valid JSON array (no markdown, no extra text):

[
  {"step": 1, "action": "Specific action description", "result": "What was accomplished"},
  {"step": 2, "action": "...", "result": "..."},
  ...
]

Make each step specific and realistic for the industry.`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) throw new Error('No JSON array found')
    
    const steps = JSON.parse(jsonMatch[0])
    return steps.map((s: { step: number; action: string; result?: string }) => ({
      step: s.step,
      action: s.action,
      status: 'complete' as const,
      result: s.result,
    }))
  } catch (error) {
    console.error('Agent workflow error:', error)
    
    // Fallback steps
    return [
      { step: 1, action: 'Analyzing task requirements...', status: 'complete', result: 'Task parsed successfully' },
      { step: 2, action: 'Gathering relevant data...', status: 'complete', result: 'Data retrieved from systems' },
      { step: 3, action: 'Processing with AI models...', status: 'complete', result: 'Analysis complete' },
      { step: 4, action: 'Executing automated actions...', status: 'complete', result: 'Actions executed' },
      { step: 5, action: 'Generating summary report...', status: 'complete', result: 'Task completed successfully' },
    ]
  }
}

// ========================================
// COMPUTER VISION (Image Analysis Demo)
// ========================================

export async function analyzeImage(
  imageBase64: string,
  mimeType: string,
  context?: AnalysisContext
): Promise<VisionResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const industryContext = context?.industry || 'general'
    const prompt = `Analyze this image for a ${industryContext} use case.

Return ONLY valid JSON (no markdown):
{
  "description": "Brief description of what you see",
  "objects": ["object1", "object2", "object3"],
  "confidence": 95,
  "insights": ["insight1", "insight2", "insight3"]
}

For ${industryContext}:
- Retail: focus on products, packaging, shelf placement
- Healthcare: focus on medical relevance (general, not diagnosis)
- Manufacturing: focus on quality, defects, components
- Other: provide general analysis`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      },
    ])

    const text = result.response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found')
    
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Vision error:', error)
    return {
      description: 'Image analysis completed',
      objects: ['Object detected'],
      confidence: 85,
      insights: ['Analysis available for uploaded images'],
    }
  }
}

// ========================================
// DOCUMENT INTELLIGENCE (Document Processing Demo)
// ========================================

export async function processDocument(
  documentText: string,
  documentType: string,
  context?: AnalysisContext
): Promise<DocumentResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const industryFields: Record<string, string[]> = {
      healthcare: ['Patient Name', 'Date of Birth', 'Diagnosis', 'Treatment Plan', 'Medications'],
      finance: ['Applicant Name', 'Account Number', 'Amount', 'Date', 'Status'],
      legal: ['Parties Involved', 'Contract Date', 'Terms', 'Obligations', 'Signatures'],
      general: ['Document Type', 'Key Entities', 'Date', 'Summary', 'Action Items'],
    }

    const fields = industryFields[context?.industry || 'general'] || industryFields.general

    const prompt = `Extract structured information from this ${documentType} document for ${context?.company || 'a company'}.

Document content:
${documentText}

Extract these fields: ${fields.join(', ')}

Return ONLY valid JSON (no markdown):
{
  "extractedFields": {
    "Field Name": "extracted value",
    ...
  },
  "confidence": 92,
  "documentType": "${documentType}"
}`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found')
    
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Document processing error:', error)
    return {
      extractedFields: { 'Status': 'Document processed' },
      confidence: 75,
      documentType: documentType,
    }
  }
}

// ========================================
// PREDICTIVE ANALYTICS (Data Analysis Demo)
// ========================================

export async function analyzeData(
  query: string,
  context?: AnalysisContext,
  csvData?: string
): Promise<AnalyticsResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const dataContext = csvData ? `\n\nCSV Data to analyze:\n${csvData.slice(0, 5000)}` : ''

    const prompt = `You are a data analyst AI for ${context?.company || 'an enterprise'} in ${context?.industry || 'business'}.

Query: "${query}"${dataContext}

Provide a realistic analysis response. Return ONLY valid JSON (no markdown):
{
  "insights": ["Key insight 1 with specific numbers", "Key insight 2", "Key insight 3"],
  "trends": ["Trend 1 with data", "Trend 2"],
  "forecast": "Brief forecast statement",
  "recommendation": "Actionable recommendation"
}

${csvData ? 'Analyze the actual CSV data provided above.' : `Make the response specific to ${context?.industry || 'business'} industry.`}`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found')
    
    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Analytics error:', error)
    return {
      insights: ['Data analysis capabilities demonstrated', 'Pattern recognition active'],
      trends: ['Positive growth trajectory', 'Seasonal variations detected'],
      forecast: 'Continued growth expected with strategic AI implementation',
      recommendation: 'Consider expanding AI capabilities for maximum ROI',
    }
  }
}

// ========================================
// INDUSTRY-SPECIFIC EXAMPLE PROMPTS
// ========================================

export function getContextualPrompts(industry: string, demoType: string, company?: string): string[] {
  const prompts: Record<string, Record<string, string[]>> = {
    retail: {
      vision: [
        'Analyze this product image for quality defects',
        'Check if this returned item shows signs of tampering',
        'Identify the product type and condition from shelf image',
      ],
      document: [
        'Extract order details from invoice',
        'Process return request form',
        'Parse supplier delivery receipt',
      ],
      analytics: [
        'Analyze sales trends from past 3 months',
        'Predict inventory needs for next quarter',
        'Identify slow-moving products',
      ],
    },
    healthcare: {
      vision: [
        'Analyze medical equipment for damage',
        'Check prescription label for completeness',
        'Verify medical supply packaging integrity',
      ],
      document: [
        'Extract patient information from intake form',
        'Process insurance claim document',
        'Parse lab test results',
      ],
      analytics: [
        'Analyze patient wait times',
        'Predict appointment no-shows',
        'Identify resource utilization patterns',
      ],
    },
    finance: {
      vision: [
        'Verify check for authenticity',
        'Analyze document for signatures',
        'Check ID document quality',
      ],
      document: [
        'Extract data from loan application',
        'Process bank statement',
        'Parse financial report',
      ],
      analytics: [
        'Detect fraudulent transaction patterns',
        'Analyze spending trends',
        'Forecast cash flow',
      ],
    },
    manufacturing: {
      vision: [
        'Inspect product for manufacturing defects',
        'Analyze assembly line quality',
        'Check component alignment',
      ],
      document: [
        'Process quality control report',
        'Extract data from work order',
        'Parse equipment maintenance log',
      ],
      analytics: [
        'Predict equipment maintenance needs',
        'Analyze production efficiency',
        'Identify quality control patterns',
      ],
    },
  }

  const industryPrompts = prompts[industry] || prompts.retail
  return industryPrompts[demoType] || [
    'Analyze this data',
    'Process this information',
    'Generate insights',
  ]
}

export function getUploadSuggestion(industry: string, company?: string): string {
  const suggestions: Record<string, string> = {
    retail: `Upload your orders CSV (e.g., past_orders.csv with columns: order_id, date, product, quantity, revenue) or product images for quality inspection.`,
    healthcare: `Upload patient intake forms, insurance documents, or medical supply images for analysis.`,
    finance: `Upload transaction data CSV, financial statements, or check images for processing.`,
    manufacturing: `Upload production logs CSV, quality control images, or maintenance records.`,
  }

  return suggestions[industry] || `Upload relevant documents or images for ${company || 'your business'}.`
}
