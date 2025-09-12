import requests
import json
import time

def test_multiple_questions():
    url = "http://127.0.0.1:8000/chatbot"
    headers = {"Content-Type": "application/json"}
    
    questions = [
        "Which companies are actively hiring freshers right now?",
        "What skills should I learn to get a software developer job?",
        "How can I improve my resume for tech jobs?",
        "What are common interview questions for data science roles?"
    ]
    
    for i, question in enumerate(questions, 1):
        print(f"\n{i}. Testing: '{question}'")
        payload = {"message": question}
        
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Status: {result.get('status')}")
                # Show first 100 characters of the response
                message = result.get('message', '')[:100] + "..." if len(result.get('message', '')) > 100 else result.get('message', '')
                print(f"📝 Response: {message}")
            else:
                print(f"❌ Error {response.status_code}: {response.text}")
        except Exception as e:
            print(f"❌ Error: {e}")
        
        # Small delay between requests
        time.sleep(1)
    
    print("\n🎉 All tests completed!")

if __name__ == "__main__":
    test_multiple_questions()