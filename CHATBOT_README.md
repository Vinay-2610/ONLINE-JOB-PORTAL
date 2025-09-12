# SkillMate Chatbot Assistant 🤖

A floating AI-powered chatbot assistant for the SkillMate Job Portal that helps users with career advice, job trends, and hiring insights.

## Features

✅ **Floating Button**: Always-visible chatbot button in bottom-right corner  
✅ **Modern UI**: Beautiful, responsive chat interface with smooth animations  
✅ **AI-Powered**: Integrated with Google Gemini API for intelligent responses  
✅ **Job-Focused**: Specialized in career advice and job market insights  
✅ **Real-time Chat**: Instant responses with typing indicators  
✅ **Quick Questions**: Pre-defined questions for easy interaction  

## Components

### Frontend Components
- **`ChatbotButton.js`** - Floating chat button with animations and tooltip
- **`ChatWindow.js`** - Complete chat interface with message history
- **`api.js`** - API service function for chatbot communication

### Backend Route
- **`/chatbot`** - Flask endpoint that proxies requests to Gemini API

## Setup Instructions

### 1. Get Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key for environment setup

### 2. Configure Environment Variables
```bash
# Add to your .env file
GEMINI_API_KEY=your-gemini-api-key-here
```

### 3. Install Dependencies
```bash
# Backend (already included in requirements.txt)
pip install requests

# Frontend (already included)
# No additional packages needed
```

### 4. Test the Chatbot
1. Start the backend server:
   ```bash
   cd backend
   python main.py
   ```

2. Start the frontend:
   ```bash
   cd frontend  
   npm start
   ```

3. Look for the floating chat button in bottom-right corner
4. Click to open chat window
5. Try asking: "What are the latest job trends in IT?"

## Usage Examples

### Sample Questions the Chatbot Can Answer:
- **Job Trends**: "What are the latest job trends in IT?"
- **Company Insights**: "Which companies are hiring the most freshers?"
- **Market Demand**: "What jobs are currently in high demand?"
- **Career Advice**: "How can I improve my resume for tech jobs?"
- **Skills Development**: "What skills should I learn for software development?"
- **Interview Tips**: "How do I prepare for a technical interview?"

## Architecture

```
Frontend (React) → Flask Backend → Google Gemini API
     ↓
ChatbotButton.js → /chatbot endpoint → AI Response
     ↓
ChatWindow.js ← JSON Response ← Processed Answer
```

## Styling & Design

- **Modern Design**: Gradient backgrounds, rounded corners, shadows
- **Responsive**: Works on desktop and mobile devices
- **Animations**: Smooth transitions, hover effects, loading indicators
- **Accessibility**: Keyboard navigation, ARIA labels, focus management

## API Response Format

### Request
```json
{
  "message": "What are the latest job trends in IT?"
}
```

### Response
```json
{
  "status": "success",
  "message": "The latest IT job trends include...",
  "timestamp": "2025-09-12T10:30:00Z"
}
```

## Error Handling

- **Network Errors**: Graceful fallback messages
- **API Limits**: Rate limiting awareness
- **Timeouts**: 30-second timeout with user feedback
- **Invalid Responses**: Error message display

## Customization

### Change Chatbot Personality
Edit the `system_context` in `backend/main.py`:

```python
system_context = """You are SkillMate Assistant, a helpful career and job search chatbot...
```

### Modify Quick Questions
Update `quickQuestions` array in `ChatWindow.js`:

```javascript
const quickQuestions = [
  "Your custom question 1",
  "Your custom question 2",
  // ...
];
```

### Style Customization
Modify Tailwind classes in the components:
- Button colors: `bg-gradient-to-r from-blue-500 to-purple-600`
- Chat bubble colors: `bg-blue-500 text-white`
- Animations: `transition-all duration-300`

## Deployment Notes

### Environment Variables in Production
- Set `GEMINI_API_KEY` in your deployment platform
- Ensure API key has proper permissions
- Monitor usage and quotas

### Security Considerations
- API key is only accessible on backend
- Frontend never directly calls Gemini API
- Rate limiting on chatbot endpoint recommended

## Troubleshooting

### Common Issues:

**Chatbot not responding:**
- Check GEMINI_API_KEY is set correctly
- Verify backend server is running
- Check browser console for errors

**API errors:**
- Verify Gemini API key is valid
- Check API quotas and limits
- Ensure network connectivity

**UI issues:**
- Clear browser cache
- Check for console errors
- Verify all components are imported correctly

## Future Enhancements

🔮 **Planned Features:**
- [ ] Chat history persistence
- [ ] Voice messaging support
- [ ] Multi-language support
- [ ] Custom knowledge base integration
- [ ] Analytics and usage tracking
- [ ] Mobile app integration

---

**Built with ❤️ for SkillMate Job Portal**