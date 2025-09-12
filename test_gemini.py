import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print(f"API Key loaded: {'Yes' if GEMINI_API_KEY else 'No'}")
print(f"API Key (first 15 chars): {GEMINI_API_KEY[:15] if GEMINI_API_KEY else 'None'}...")

if GEMINI_API_KEY:
    # Test the Gemini API
    gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    
    payload = {
        "contents": [{
            "parts": [{
                "text": "What are the latest job trends in IT? Keep it brief."
            }]
        }]
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print("Making API request to Gemini...")
        response = requests.post(gemini_url, json=payload, headers=headers, timeout=30)
        print(f"Response Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            if 'candidates' in result and len(result['candidates']) > 0:
                generated_text = result['candidates'][0]['content']['parts'][0]['text']
                print("✅ Gemini API is working!")
                print("Response:", generated_text[:200] + "..." if len(generated_text) > 200 else generated_text)
            else:
                print("❌ No response generated")
                print("Response:", result)
        else:
            print("❌ API Error:")
            print("Response:", response.text)
            
    except requests.exceptions.Timeout:
        print("❌ Request timeout")
    except Exception as e:
        print(f"❌ Error: {e}")
else:
    print("❌ No API key found")