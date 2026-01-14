# Calance Labs - Enterprise AI Platform

A stunning, immersive website showcasing AI capabilities with a 3D scrollytelling experience.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React Three Fiber](https://img.shields.io/badge/React%20Three%20Fiber-8.x-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38B2AC)

## ✨ Features

### 🎯 Interactive AI Sandbox
- **Conversational AI** - Real-time chat powered by Google Gemini
- **AI Agents** - Autonomous workflow execution demo
- **Computer Vision** - Image analysis and object detection
- **Document Intelligence** - Structured data extraction from documents
- **Predictive Analytics** - Data analysis and forecasting

### 🎨 Visual Experience
- **3D Particle System** - Morphs between 5 distinct formations as you scroll
- **GSAP ScrollTrigger** - Smooth, cinematic scroll animations
- **Lenis Smooth Scroll** - Buttery smooth scrolling experience
- **Post-Processing** - Bloom, noise, and vignette effects

### 🏢 Smart Discovery
- **Company Analysis** - Enter any company name for AI-powered insights
- **Mermaid Diagrams** - Auto-generated AI architecture visualizations
- **Industry Detection** - Automatic vertical classification
- **Custom Solutions** - Tailored AI recommendations per industry

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/calance-labs/website.git
cd website

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your NEXT_PUBLIC_GEMINI_API_KEY
```

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 🏗️ Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main page
│   └── globals.css         # Tailwind + custom styles
├── components/
│   ├── canvas/             # 3D Scene Components
│   │   ├── Scene.tsx       # R3F Canvas wrapper
│   │   ├── Experience.tsx  # Main scene controller
│   │   ├── ParticleSystem.tsx  # Morphing particles
│   │   └── Effects.tsx     # Post-processing
│   ├── sections/           # Page Sections
│   │   ├── Hero.tsx
│   │   ├── Discovery.tsx   # AI Blueprint Generator
│   │   ├── Sandbox.tsx     # Interactive AI Demos
│   │   ├── Work.tsx        # Case Studies Carousel
│   │   └── Contact.tsx
│   ├── ui/                 # Shared UI Components
│   │   └── MermaidRenderer.tsx
│   └── providers/
│       └── LenisProvider.tsx
├── store/
│   └── useStore.ts         # Zustand state management
├── services/
│   └── gemini.ts           # Google Gemini API service
└── lib/
    └── utils.ts
```

## 🎛️ Technologies

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| 3D Engine | React Three Fiber + Drei |
| Animation | GSAP + Framer Motion |
| Scroll | Lenis |
| State | Zustand |
| AI | Google Gemini API |
| Diagrams | Mermaid.js |

## 📊 Sections

### 1. Hero
- Large typography with ambient 3D particle background
- Scroll indicator animation
- CTA to Discovery section

### 2. Discovery
- Company name input
- AI-powered industry detection
- Mermaid diagram generation
- Solution recommendations

### 3. Sandbox
5 interactive AI capability demos:
- Conversational AI (RAG)
- AI Agents (Workflow automation)
- Computer Vision (Image analysis)
- Document Intelligence (Data extraction)
- Predictive Analytics (Forecasting)

### 4. Work
- Project carousel with 4 case studies
- Key metrics display
- Technology tags
- Smooth navigation

### 5. Contact
- Dual CTA buttons
- Personalized messaging
- Footer with company info

## 🔑 Environment Variables

```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

Get your API key at: https://makersuite.google.com/app/apikey

## 📖 Documentation

- [AI Integration Guide](./docs/AI_INTEGRATION.md) - Detailed API documentation

## 🎨 Design System

### Colors
- **Void**: `#0a0a0a` - Primary background
- **Cyan**: `#00D4FF` - Hero accent
- **Blue**: `#3B82F6` - Discovery accent
- **Purple**: `#A855F7` - Sandbox accent
- **Teal**: `#2DD4BF` - Work accent
- **Orange**: `#F97316` - Analytics accent

### Typography
- **Primary**: Inter (sans-serif)
- **Mono**: JetBrains Mono

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ by [Calance Labs](https://calancelabs.com)
