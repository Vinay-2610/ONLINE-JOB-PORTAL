import requests
import json

# Test the chatbot endpoint
def test_chatbot():
    url = "http://127.0.0.1:8000/chatbot"
    
    test_message = "What are the highest paying IT jobs in 2024?"
    
    payload = {
        "message": test_message
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print(f"Testing chatbot with message: '{test_message}'")
        print("Sending request to:", url)
        
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ SUCCESS!")
            print("Status:", result.get('status'))
            print("Message:", result.get('message'))
            print("Timestamp:", result.get('timestamp'))
        else:
            print("❌ ERROR!")
            print("Response:", response.text)
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network Error: {e}")
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")

if __name__ == "__main__":
    test_chatbot()