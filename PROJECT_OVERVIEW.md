# Calance Labs - Project Overview

## What We're Building

**Calance Labs** is an immersive, storytelling website for an AI solutions company that builds enterprise AI systems. The website features:

1. **Scroll-synchronized 3D background** that morphs and changes colors as you scroll
2. **Interactive AI blueprint generator** using Google Gemini API that creates custom Mermaid diagrams
3. **Live sandbox demos** showing AI capabilities (Chat, Agents, Vision, Analytics)
4. **Smooth scroll experience** with section snapping
5. **Cohesive visual narrative** that guides users from discovery to conversion

---

## Section-by-Section Content

### 1. HERO Section
**Purpose:** Opening statement and value proposition

**Content:**
- **Tag:** "CALANCE LABS"
- **Headline:** "Enterprise AI that transforms."
- **Description:** "We build intelligent systems that create lasting competitive advantage."
- **CTA Button:** "Discover Your AI Potential"
- **Scroll Indicator:** "SCROLL"

---

### 2. DISCOVERY Section (AI Blueprint Generator)
**Purpose:** Lead generation tool - users enter company name, get personalized AI blueprint

**Content:**
- **Section Tag:** "AI BLUEPRINT"
- **Headline:** "See what AI can do for you."
- **Subtitle:** "Enter your company name and our AI will generate a custom integration blueprint."
- **Input Placeholder:** "Enter your company name..."
- **Button:** "Generate Blueprint" (shows "Analyzing..." when loading)

**What it does:**
- Uses Google Gemini API to analyze the company
- Generates:
  - Industry detection
  - AI solutions recommendations (with types: agentic, vision, nlp, analytics, automation)
  - A Mermaid diagram showing AI architecture flow
- **CTA Button:** "Try These Solutions in Sandbox →" (appears after blueprint is generated)

**Right Side:** 
- Shows Mermaid diagram visualization (or placeholder: "Your AI architecture will appear here")

---

### 3. SANDBOX Section (Interactive Demos)
**Purpose:** Let users try AI capabilities hands-on

**Content:**
- **Section Tag:** "AI SANDBOX" (or "SANDBOX FOR [COMPANY NAME]" if company data exists)
- **Headline:** "Try it yourself."
- **Navigation Tabs:** 4 capabilities
  1. **Conversational AI**
     - Description: "Natural language interfaces that understand context and provide intelligent responses."
     - Demo: Live chat interface powered by Gemini API (context-aware if company data exists)
  
  2. **AI Agents**
     - Description: "Autonomous systems that execute complex multi-step workflows."
     - Demo: Simulated agent execution with step-by-step progress
  
  3. **Computer Vision**
     - Description: "Visual intelligence for quality control, object detection, and automation."
     - Demo: Image analysis simulation with scan animation and results
  
  4. **Predictive Analytics**
     - Description: "Data-driven forecasting and trend analysis for proactive decision making."
     - Demo: Animated bar chart with growth metrics

---

### 4. WORK Section (Case Studies)
**Purpose:** Proof of capability - showcase real projects

**Content:**
- **Section Tag:** "CASE STUDIES"
- **Headline:** "Proof of impact."
- **Projects (carousel with 4 projects):**

  1. **Ujjain Kumbh Mela**
     - Client: Government of India
     - Year: 2024
     - Description: "Digital twin simulation for real-time crowd management at the world's largest religious gathering. AI-powered analytics helped coordinate movement of 25M+ pilgrims safely."
     - Metric: "25M+ visitors"
     - Tags: Digital Twin, Crowd Analytics, Real-time

  2. **Immersive Learning Platform**
     - Client: NCERT
     - Year: 2023
     - Description: "3D interactive educational content for K-12 students across India. AI-driven personalization increased learning retention by 40%."
     - Metric: "+40% retention"
     - Tags: 3D Visualization, EdTech, Personalization

  3. **AuRA Research Assistant**
     - Client: Research
     - Year: 2024
     - Description: "AI system that validates scientific hypotheses by synthesizing insights from millions of academic papers. Accelerates research discovery."
     - Metric: "1M+ papers"
     - Tags: NLP, Research AI, Knowledge Graph

  4. **Clinical Trial IDP**
     - Client: Pharma
     - Year: 2023
     - Description: "Intelligent document processing for pharmaceutical research with FDA compliance. Automated extraction and validation of clinical data."
     - Metric: "99.2% accuracy"
     - Tags: Document AI, Healthcare, Compliance

**Navigation:** Arrow buttons and dot indicators to navigate between projects

---

### 5. CONTACT Section (Final CTA)
**Purpose:** Conversion - get users to reach out

**Content:**
- **Section Tag:** "GET STARTED"
- **Headline:** "Ready to build something great?"
- **Description:** "Let's discuss how AI can transform your business. We'll help you find the right solutions."
- **CTA Buttons:**
  - Primary: "Start a Conversation" (links to: mailto:hello@calancelabs.com)
  - Secondary: "Generate AI Blueprint" (links to: #discovery)

---

## Key Features & Technologies

1. **3D Background (SpatialCanvas)**
   - Scroll-synchronized 3D scene
   - Color transitions between sections
   - Camera movements
   - Particle systems and ambient nodes

2. **Google Gemini API Integration**
   - Company analysis in Discovery section
   - Mermaid diagram generation
   - Context-aware chat in Sandbox

3. **Smooth Scrolling (Lenis)**
   - Section snapping
   - Scroll progress tracking
   - Smooth transitions

4. **Interactive Elements**
   - Live AI demos
   - Animated transitions
   - Scroll-triggered animations (Framer Motion)

---

## User Journey Flow

1. **Hero** → User sees value proposition
2. **Discovery** → User enters company name → Gets personalized AI blueprint with Mermaid diagram
3. **Sandbox** → User tries AI capabilities (context-aware if they entered company)
4. **Work** → User sees proof/credibility
5. **Contact** → User converts (email or returns to Discovery)

---

## Technical Stack

- **React** + **Vite**
- **Three.js** (via @react-three/fiber) - 3D graphics
- **Framer Motion** - Animations
- **Lenis** - Smooth scrolling
- **Google Gemini API** - AI capabilities
- **Mermaid** - Diagram rendering
- **CSS** - Styling
