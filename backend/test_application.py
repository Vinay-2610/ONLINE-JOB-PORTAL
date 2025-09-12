import requests
import os

# Test job application submission
def test_job_application():
    url = "http://127.0.0.1:8000/apply"
    
    # Create a sample resume file for testing
    with open("test_resume.txt", "w") as f:
        f.write("John Smith\nSoftware Developer\n\nExperience:\n- 3 years Python development\n- Flask, MongoDB, REST APIs\n- React, Node.js")
    
    # Form data for job application
    data = {
        'job_id': 'test_job_123',
        'job_title': 'Python Developer',
        'company': 'Test Company Inc.',
        'name': 'John Smith',
        'email': 'john.smith@test.com',
        'cover_letter': 'I am very excited to apply for this Python Developer position. I have 3+ years of experience with Flask, MongoDB, and building REST APIs.'
    }
    
    # File to upload
    files = {
        'resume': ('test_resume.txt', open('test_resume.txt', 'rb'), 'text/plain')
    }
    
    try:
        response = requests.post(url, data=data, files=files)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 201:
            print("✅ Job application submitted successfully!")
        else:
            print("❌ Job application failed")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        # Clean up test file
        files['resume'][1].close()
        if os.path.exists('test_resume.txt'):
            os.remove('test_resume.txt')

# Test getting all applications
def test_get_applications():
    url = "http://127.0.0.1:8000/applications"
    
    try:
        response = requests.get(url)
        print(f"\n--- All Applications ---")
        print(f"Status Code: {response.status_code}")
        data = response.json()
        print(f"Total Applications: {data.get('count', 'N/A')}")
        
        if 'data' in data and data['data']:
            print("\nApplications:")
            for i, app in enumerate(data['data'], 1):
                print(f"{i}. {app['applicant']} - {app['job_title']} at {app['company']}")
                print(f"   Email: {app['email']}")
                print(f"   Applied: {app['appliedDate']}")
                print()
        
    except Exception as e:
        print(f"Error getting applications: {e}")

if __name__ == "__main__":
    print("🧪 Testing Job Application Submission...")
    test_job_application()
    test_get_applications()