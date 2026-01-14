# Calance Labs - AI Integration Documentation

## 🎯 Overview

Calance Labs features an intelligent, context-aware AI sandbox that dynamically configures based on the visitor's company and industry. This creates a personalized demo experience showcasing exactly how AI can transform their specific business.

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User Journey                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. HERO          →  First impression, CTA to Discovery      │
│                                                              │
│  2. DISCOVERY     →  Company Analysis + Mermaid Diagram      │
│     • User enters company name                               │
│     • Gemini analyzes industry, challenges, opportunities    │
│     • Generates AI architecture diagram (Mermaid)            │
│     • Recommends 3-4 specific AI solutions                   │
│                                                              │
│  3. SANDBOX       →  Live AI Demos (Context-Aware)           │
│     • Tabs configured based on recommended solutions         │
│     • Each demo uses company-specific prompts                │
│     • Real API calls, not mock data                          │
│                                                              │
│  4. WORK          →  Case Studies (Proof of Impact)          │
│                                                              │
│  5. CONTACT       →  CTA with personalized copy              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 API Integration

### Primary: Google Gemini API

**Model:** `gemini-2.0-flash-exp` (or `gemini-2.5-flash` when available)

**Capabilities Used:**
| Feature | Gemini Capability | Use Case |
|---------|------------------|----------|
| Company Analysis | Text Generation + Search Grounding | Detect industry, generate solutions |
| Mermaid Generation | Structured Output | Architecture diagrams |
| Conversational AI | Multi-turn Chat | Customer support demo |
| AI Agents | Function Calling | Workflow automation demo |
| Computer Vision | Multimodal (Image) | Visual analysis demo |
| Document Intelligence | PDF Processing | Document extraction demo |
| Predictive Analytics | Code Execution | Data analysis + charts |

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🏆 Sandbox Capabilities

### Tier 1: Essential (Must Have)

#### 1. Conversational AI with RAG
**Why:** #1 ROI use case - every enterprise needs customer support automation

```typescript
{
  feature: "conversational_ai",
  api: "Gemini 2.0 Flash",
  capabilities: [
    "Context-aware responses",
    "Multi-turn conversations",
    "Company-specific knowledge",
    "Real-time grounding"
  ],
  industries: ["All"]
}
```

#### 2. AI Agents (Agentic Workflows)
**Why:** 62% of enterprises experimenting with AI agents in 2025

```typescript
{
  feature: "ai_agents",
  api: "Gemini with Function Calling",
  capabilities: [
    "Multi-step reasoning",
    "Autonomous task execution",
    "Tool/API integration",
    "Workflow orchestration"
  ],
  industries: ["Operations", "Logistics", "Finance", "HR"]
}
```

#### 3. Document Intelligence (IDP)
**Why:** Manual document processing is #1 bottleneck in enterprise operations

```typescript
{
  feature: "document_intelligence",
  api: "Gemini Multimodal",
  capabilities: [
    "PDF/DOCX processing",
    "Structured data extraction",
    "Form recognition",
    "Compliance validation"
  ],
  industries: ["Healthcare", "Legal", "Finance", "Government"]
}
```

#### 4. Computer Vision
**Why:** Visual AI reduces human error by 90%+ in quality control

```typescript
{
  feature: "computer_vision",
  api: "Gemini Vision",
  capabilities: [
    "Image classification",
    "Object detection",
    "Quality inspection",
    "OCR from images"
  ],
  industries: ["Manufacturing", "Retail", "Healthcare", "Security"]
}
```

#### 5. Predictive Analytics
**Why:** Data-driven forecasting essential for strategic planning

```typescript
{
  feature: "predictive_analytics",
  api: "Gemini + Code Execution",
  capabilities: [
    "Time-series forecasting",
    "Trend analysis",
    "Anomaly detection",
    "What-if modeling"
  ],
  industries: ["Retail", "Finance", "Supply Chain"]
}
```

---

## 🎨 Industry-Specific Templates

### Retail
```json
{
  "industry": "retail",
  "solutions": [
    { "type": "conversational_ai", "title": "Smart Customer Support" },
    { "type": "computer_vision", "title": "Visual Quality Control" },
    { "type": "predictive_analytics", "title": "Demand Forecasting" },
    { "type": "ai_agents", "title": "Supply Chain Automation" }
  ]
}
```

### Healthcare
```json
{
  "industry": "healthcare",
  "solutions": [
    { "type": "document_intelligence", "title": "Clinical Documentation" },
    { "type": "computer_vision", "title": "Medical Imaging AI" },
    { "type": "conversational_ai", "title": "Patient Triage Assistant" },
    { "type": "ai_agents", "title": "Insurance Verification" }
  ]
}
```

### Finance
```json
{
  "industry": "finance",
  "solutions": [
    { "type": "document_intelligence", "title": "Loan Document Processing" },
    { "type": "predictive_analytics", "title": "Fraud Detection" },
    { "type": "conversational_ai", "title": "Financial Advisory Bot" },
    { "type": "ai_agents", "title": "Compliance Monitoring" }
  ]
}
```

### Manufacturing
```json
{
  "industry": "manufacturing",
  "solutions": [
    { "type": "computer_vision", "title": "Quality Inspection AI" },
    { "type": "predictive_analytics", "title": "Predictive Maintenance" },
    { "type": "ai_agents", "title": "Production Scheduling" },
    { "type": "document_intelligence", "title": "Compliance Documentation" }
  ]
}
```

---

## 📊 Data Flow

```
User Input (Company Name)
         │
         ▼
┌─────────────────────┐
│   Gemini Analysis   │
│  • Industry detect  │
│  • Challenge map    │
│  • Solution match   │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Mermaid Diagram    │
│  • Data sources     │
│  • AI layer         │
│  • Outcomes         │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Sandbox Config     │
│  • Relevant tabs    │
│  • Custom prompts   │
│  • Industry context │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│   Live Demos        │
│  • Real API calls   │
│  • Actual results   │
│  • No mock data     │
└─────────────────────┘
```

---

## 🔐 Security Considerations

1. **API Key Protection**
   - Store in environment variables
   - Never expose in client-side code (use NEXT_PUBLIC_ prefix carefully)
   - Consider server-side API routes for production

2. **Rate Limiting**
   - Implement request throttling
   - Cache common responses
   - Show loading states during API calls

3. **Input Validation**
   - Sanitize user inputs before API calls
   - Limit prompt injection risks
   - Validate file uploads (for vision/document demos)

---

## 📈 Success Metrics

Track these KPIs:
- % of visitors who enter company name
- Time spent in sandbox per capability
- Demo interactions per session
- Industry distribution of visitors
- Conversion rate: sandbox → contact form

---

## 🚀 Future Enhancements

### Phase 2: Advanced Features
- [ ] Real-time Voice AI (Gemini Live API)
- [ ] Multimodal input (voice + image + text)
- [ ] Code generation demos
- [ ] Knowledge graph RAG

### Phase 3: Enterprise Features
- [ ] Saved demo sessions
- [ ] PDF report generation
- [ ] CRM integration
- [ ] A/B testing framework

---

## 📚 API Reference

### `generateBlueprint(companyName: string)`
Analyzes company and returns AI integration recommendations.

**Returns:**
```typescript
{
  company: string;
  industry: string;
  summary: string;
  solutions: Solution[];
  mermaidDiagram: string;
}
```

### `chat(message: string, context?: CompanyContext)`
Sends message to conversational AI with optional company context.

**Returns:** `string` - AI response

### Additional endpoints (in enhanced version):
- `analyzeImage(image: File, prompt: string)`
- `processDocument(file: File, extractionFields: string[])`
- `runAnalytics(data: object, query: string)`
- `executeWorkflow(steps: string[])`

---

## 🔗 Resources

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Mermaid.js Documentation](https://mermaid.js.org/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
