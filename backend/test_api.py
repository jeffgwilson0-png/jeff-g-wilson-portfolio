import urllib.request
import json

def test_api():
    base = "http://127.0.0.1:8000/api"
    print("=== Testing FastAPI & SQLite Database Endpoints ===")

    # 1. Profile
    req = urllib.request.urlopen(f"{base}/profile")
    profile = json.loads(req.read().decode('utf-8'))
    print(f"[OK] Profile: {profile['name']} - {profile['headline']}")

    # 2. Projects
    req = urllib.request.urlopen(f"{base}/projects")
    projects = json.loads(req.read().decode('utf-8'))
    print(f"[OK] Projects Count: {len(projects)}")
    for p in projects:
        print(f"     * {p['title']} [{p['category']}] (slug: {p['slug']})")

    # 3. Research
    req = urllib.request.urlopen(f"{base}/research")
    research = json.loads(req.read().decode('utf-8'))
    print(f"[OK] Research Count: {len(research)}")
    for r in research:
        print(f"     * {r['title']} - {r['publication_status']}")

    # 4. Work With Me Inquiry Submission
    inquiry_data = json.dumps({
        "category": "research",
        "full_name": "Dr. Sarah Jenkins",
        "email": "s.jenkins@stanford.edu",
        "company_or_institution": "Stanford AI Lab",
        "project_title_or_name": "Trustworthy RAG in Medical Diagnostics",
        "research_area": "Retrieval-Augmented Generation (RAG)",
        "description_or_message": "We would like to collaborate on evaluating the TrustRAG framework against multimodal clinical benchmark datasets."
    }).encode('utf-8')
    
    inq_req = urllib.request.Request(f"{base}/inquiries", data=inquiry_data, headers={'Content-Type': 'application/json'})
    inq_res = json.loads(urllib.request.urlopen(inq_req).read().decode('utf-8'))
    print(f"[OK] Inquiry Submitted: ID {inq_res['id']}, Status: {inq_res['status']}")

    # 5. Auth Login
    login_data = json.dumps({
        "email": "admin@jeffgwilson.com",
        "password": "AdminPass123!"
    }).encode('utf-8')
    login_req = urllib.request.Request(f"{base}/auth/login", data=login_data, headers={'Content-Type': 'application/json'})
    login_res = json.loads(urllib.request.urlopen(login_req).read().decode('utf-8'))
    token = login_res['access_token']
    print(f"[OK] Admin Login: Success, JWT Token {token[:25]}...")

    # 6. Admin Dashboard Stats
    stats_req = urllib.request.Request(f"{base}/admin/stats", headers={'Authorization': f'Bearer {token}'})
    stats = json.loads(urllib.request.urlopen(stats_req).read().decode('utf-8'))
    print(f"[OK] Dashboard Stats: {stats['total_projects']} projects, {stats['total_research']} papers, {stats['total_inquiries']} inquiries (Unread: {stats['unread_inquiries']})")
    print(f"     Inquiry Categories Breakdown: {stats['inquiry_categories']}")

    print("\nALL BACKEND API AND DATABASE TESTS PASSED WITH 100% SUCCESS!")

if __name__ == "__main__":
    test_api()
