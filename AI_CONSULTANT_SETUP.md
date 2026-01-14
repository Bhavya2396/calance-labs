# AI Business Consultant Feature - Setup Guide

## What This Does

The AI Business Consultant feature allows enterprise visitors to:
1. Enter their company name or website
2. Get instant AI analysis of their business
3. Receive personalized AI service recommendations from Calance Labs
4. See expected ROI and implementation approach for each service

This is powered by Gemini AI and showcases your AI capabilities while generating qualified leads.

## Setup Instructions

### 1. Create Environment File

Create a file named `.env.local` in the project root with your Gemini API key:

```bash
VITE_GEMINI_API_KEY=AIzaSyDfXzW5FoFLSgrBH8YqE53Q7FXumjUFDa8
```

**Important:** The file MUST be named `.env.local` (not `.env`) for Vite to load it properly.

### 2. Restart Dev Server

After creating the `.env.local` file:

```bash
npm run dev
```

### 3. Test the Feature

1. Open http://localhost:5173
2. Scroll to the Stats section (second section)
3. Enter a company name (e.g., "Tesla", "Microsoft", "General Motors")
4. Click "Get AI Strategy"
5. Wait 15-20 seconds for AI analysis
6. Review personalized recommendations

## How It Works

### AI Analysis Flow

```
User Input → Gemini Research → Business Analysis → Service Matching → Recommendations
```

1. **Research Phase:** Gemini identifies industry, products, scale, challenges
2. **Analysis Phase:** Maps company needs to your 5 AI capability categories:
   - Agentic Workflows
   - Vision AI
   - Cyber Security
   - Conversational AI
   - Embedded AI/IoT
3. **Recommendation Phase:** Generates 3-5 prioritized service recommendations
4. **ROI Phase:** Estimates impact, implementation approach, expected benefits

### What Gets Generated

For each recommended service:
- **Service Name & Category**
- **Description:** What the service does
- **Benefit:** How it specifically helps THIS company
- **Impact:** Expected ROI (e.g., "60% cost reduction", "10x faster")
- **Implementation:** Brief approach
- **Priority:** High/Medium/Low based on company needs

## Customization

### Modify AI Capabilities

Edit the prompt in `src/components/AIConsultant.jsx` to add/remove services:

```javascript
1. AGENTIC WORKFLOWS
   - Generative AI for analytics
   - Generate n8n/langflow workflows
   ...

2. VISION AI
   - Picture & Video Inferencing
   ...
```

### Adjust AI Model

Change the model for different speed/quality tradeoffs:

```javascript
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-exp"  // Fast & cost-effective
  // model: "gemini-pro"          // More accurate, slower
  // model: "gemini-ultra"        // Best quality, slowest
});
```

### Styling

Modify colors, spacing, and layout in `src/components/AIConsultant.css`

## Example Companies to Test

Try these to see different recommendations:
- **Manufacturing:** "Toyota", "General Electric", "3M"
- **Healthcare:** "Mayo Clinic", "Pfizer", "Medtronic"
- **Retail:** "Walmart", "Target", "Best Buy"
- **Finance:** "JPMorgan Chase", "Goldman Sachs"
- **Tech:** "Microsoft", "IBM", "Oracle"
- **Logistics:** "FedEx", "UPS", "Maersk"

## Performance

- **Analysis Time:** 15-25 seconds
- **API Cost:** ~$0.002 per analysis (Gemini 2.0 Flash)
- **Requests/Day:** Monitor Gemini API quota
- **Caching:** Consider caching results for common companies

## Security Notes

- ✅ API key is loaded from `.env.local` (not committed to git)
- ✅ Requests are client-side (no backend needed)
- ⚠️ Consider rate limiting for production
- ⚠️ Monitor API usage/costs in Google Cloud Console

## Troubleshooting

### "Unable to analyze company"
- Check API key is correct in `.env.local`
- Verify `.env.local` file exists in project root
- Restart dev server after creating/editing `.env.local`
- Check Gemini API is enabled in Google Cloud Console

### No results or timeout
- Check internet connection
- Try a more well-known company name
- Check browser console for errors
- Verify API key has proper permissions

### Unexpected recommendations
- AI responses can vary - try analyzing same company multiple times
- Modify the prompt in `AIConsultant.jsx` for more specific guidance
- Add examples to the prompt for better output format

## Production Deployment

Before deploying to production:

1. **Set up backend API endpoint** to hide API key
2. **Implement rate limiting** (e.g., 5 analyses per IP per day)
3. **Add analytics** to track which companies are being analyzed
4. **Cache common results** to save API costs
5. **Add lead capture** (email before showing results)
6. **Connect to CRM** to auto-create leads
7. **A/B test** different prompts and UI variations

## Future Enhancements

- [ ] Email results to user
- [ ] Generate downloadable PDF report
- [ ] Schedule follow-up call directly from results
- [ ] Compare multiple companies
- [ ] Industry-specific deep dives
- [ ] Competitive analysis
- [ ] Budget calculator
- [ ] Implementation timeline generator



