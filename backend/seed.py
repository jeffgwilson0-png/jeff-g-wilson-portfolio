import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.database import SessionLocal, engine, Base
from app.models import (
    User, Profile, Project, Research, Experience, Education,
    Conference, Certification, Award, Skill, CV, Inquiry, SiteSetting
)
from app.auth.jwt import get_password_hash
from app.config import settings

def seed():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Admin User
        admin_email = settings.FIRST_SUPERUSER_EMAIL
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            print(f"Creating superuser: {admin_email}")
            admin = User(
                email=admin_email,
                hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                full_name="Jeff G. Wilson",
                is_active=True,
                is_superuser=True
            )
            db.add(admin)
        else:
            admin.hashed_password = get_password_hash(settings.FIRST_SUPERUSER_PASSWORD)

        # 2. Profile
        profile = db.query(Profile).first()
        if not profile:
            print("Creating profile for Jeff G. Wilson...")
            profile = Profile(
                name="Jeff G. Wilson",
                headline="Computer Engineer | Data Scientist | AI / ML Researcher",
                titles="Computer Engineer,Data Scientist,AI/ML Researcher,Software Developer",
                short_bio="I build intelligent software, data-driven systems, and research-driven AI solutions. Exploring the intersection of high-performance computing and machine learning.",
                full_bio="I am a Computer Engineering graduate and currently pursuing my M.Tech in Data Science at Marwadi University. My academic and professional journey is driven by a deep fascination with how complex data can be transformed into actionable intelligence. Beyond academia, I am deeply involved in practical software development and AI research, aiming to bridge the gap between theoretical algorithms and scalable, real-world applications.",
                status_text="STATUS: ONLINE",
                currently_exploring="Advanced RAG Architectures & Multimodal Verification",
                email="jeffgwilson@example.com",
                phone="+91 98765 43210",
                location="Rajkot, Gujarat, India",
                github_url="https://github.com",
                linkedin_url="https://linkedin.com",
                instagram_url="https://instagram.com",
                twitter_url="https://x.com"
            )
            db.add(profile)

        # 3. Projects
        if db.query(Project).count() == 0:
            print("Seeding initial projects...")
            projects_data = [
                {
                    "title": "TrustRAG: Multimodal Misinformation Detection",
                    "slug": "trustrag-multimodal-framework",
                    "short_description": "A trustworthy retrieval-augmented multimodal framework for real-time AI-generated misinformation detection.",
                    "full_description": "TrustRAG is a novel architectural framework designed to mitigate hallucination and detect AI-generated misinformation across multimodal streams (text and image). By integrating knowledge graphs and cross-modal verification directly into retrieval pipelines, TrustRAG achieves significantly higher factual consistency.",
                    "image_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
                    "category": "AI Research",
                    "technologies": "Python,PyTorch,Transformers,RAG,LangChain,FastAPI,Knowledge Graphs",
                    "github_url": "https://github.com",
                    "live_demo_url": "https://demo.example.com",
                    "research_url": "/research/trustrag-multimodal-framework",
                    "featured": True,
                    "published": True,
                    "order_index": 1
                },
                {
                    "title": "Liberia Opportunities Hub",
                    "slug": "liberia-opportunities-hub",
                    "short_description": "A scalable, cloud-native web platform connecting citizens and talent with educational, career, funding, and project opportunities in Liberia.",
                    "full_description": "A centralized digital ecosystem tailored for Liberia, featuring dynamic category matching for jobs, internships, volunteer opportunities, skills training, professional development, and final-year research support. Built with a responsive glassmorphic UI and high-performance backend.",
                    "image_url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
                    "category": "Web Application",
                    "technologies": "React,TypeScript,FastAPI,PostgreSQL,Tailwind CSS,Docker",
                    "github_url": "https://github.com",
                    "live_demo_url": "https://demo.example.com",
                    "featured": True,
                    "published": True,
                    "order_index": 2
                },
                {
                    "title": "NGO Connect",
                    "slug": "ngo-connect",
                    "short_description": "A collaborative technology platform connecting non-governmental organizations, volunteers, and communities to streamline logistics and resource allocation.",
                    "full_description": "NGO Connect provides a centralized data hub, real-time messaging, and resource distribution tracking for non-governmental organizations operating in diverse and low-bandwidth environments. Implements robust caching and offline-first data sync capabilities.",
                    "image_url": "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
                    "category": "Data Platform",
                    "technologies": "Python,FastAPI,WebSockets,PostgreSQL,React,Redis",
                    "github_url": "https://github.com",
                    "live_demo_url": "https://demo.example.com",
                    "featured": True,
                    "published": True,
                    "order_index": 3
                },
                {
                    "title": "High-Volume E-Commerce Platform",
                    "slug": "e-commerce-website",
                    "short_description": "A scalable full-stack e-commerce solution architected for high concurrent user loads with headless checkout and analytics.",
                    "full_description": "Features real-time inventory management, automated payment processing via Stripe, role-based admin dashboard, and fluid glassmorphic product visualizers.",
                    "image_url": "https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&w=1200&q=80",
                    "category": "Web Application",
                    "technologies": "Next.js,Node.js,PostgreSQL,Stripe API,Tailwind CSS",
                    "github_url": "https://github.com",
                    "live_demo_url": "https://demo.example.com",
                    "featured": False,
                    "published": True,
                    "order_index": 4
                },
                {
                    "title": "House Price Prediction Pipeline",
                    "slug": "house-price-prediction",
                    "short_description": "A machine learning pipeline utilizing gradient boosting algorithms to forecast real estate valuations based on geospatial feature engineering.",
                    "full_description": "End-to-end data science project utilizing XGBoost, LightGBM, and Scikit-Learn to analyze historical pricing trends, macroeconomic variables, and geographical distance matrices.",
                    "image_url": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
                    "category": "ML System",
                    "technologies": "Python,Scikit-Learn,XGBoost,Pandas,NumPy,FastAPI",
                    "github_url": "https://github.com",
                    "live_demo_url": None,
                    "featured": False,
                    "published": True,
                    "order_index": 5
                },
                {
                    "title": "Automatic Scheduling Generator",
                    "slug": "automatic-scheduling-generator",
                    "short_description": "A constraint satisfaction solver designed for complex institutional timetabling using genetic algorithms and graph coloring.",
                    "full_description": "Solves complex NP-hard scheduling constraints across professors, lecture halls, and student cohorts, minimizing time conflicts and maximizing resource utilization efficiency.",
                    "image_url": "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80",
                    "category": "Algorithms",
                    "technologies": "C++,Algorithms,Optimization,Graph Theory,Data Structures",
                    "github_url": "https://github.com",
                    "live_demo_url": None,
                    "featured": False,
                    "published": True,
                    "order_index": 6
                }
            ]
            for p_data in projects_data:
                db.add(Project(**p_data))

        # 4. Research
        if db.query(Research).count() == 0:
            print("Seeding research papers...")
            research_data = [
                {
                    "title": "TrustRAG: A Trustworthy Retrieval-Augmented Multimodal Framework for Real-Time AI-Generated Misinformation Detection",
                    "slug": "trustrag-multimodal-framework",
                    "authors": "Jeff G. Wilson, Academic Collaborators",
                    "abstract": "This paper introduces TrustRAG, a novel architectural framework designed to mitigate hallucination in generative AI models and detect synthetic misinformation by integrating knowledge graphs and cross-modal verification directly into the retrieval pipeline. By enforcing strict semantic boundaries, the system achieves significantly higher factual consistency in domain-specific querying scenarios.",
                    "research_area": "Artificial Intelligence / Multimodal AI / RAG / NLP",
                    "methodology": "Graph-augmented retrieval with cross-attention cross-modal verification layers and confidence scoring.",
                    "technologies": "PyTorch, Transformers, Knowledge Graphs, Vector Databases, Python",
                    "conference_journal": "IEEE Gujarat Section",
                    "publication_status": "Submitted / Under Review",
                    "year": "2024 - 2026",
                    "featured": True,
                    "published": True,
                    "order_index": 1
                }
            ]
            for r_data in research_data:
                db.add(Research(**r_data))

        # 5. Experience
        if db.query(Experience).count() == 0:
            print("Seeding experience...")
            experiences_data = [
                {
                    "role": "University Teaching Assistant",
                    "company": "Marwadi University",
                    "location": "Rajkot, India",
                    "start_date": "April 2026",
                    "end_date": "Present",
                    "is_current": True,
                    "description": "* Assist faculty in laboratory-based instruction and student learning in technical subjects.\n* Explain algorithmic and programming concepts and support students in solving computational problems.\n* Assist students with implementation, debugging, and understanding of programming exercises.\n* Develop technical communication, mentoring, and collaborative problem-solving skills through academic interaction.",
                    "technologies": "Laboratory Instruction, Algorithms, Problem Solving, Academic Mentoring",
                    "published": True,
                    "order_index": 1
                },
                {
                    "role": "Graphic Designer & Media Team Member",
                    "company": "Christ Fellowship",
                    "location": "Rajkot, India",
                    "start_date": "June 2024",
                    "end_date": "December 2025",
                    "is_current": False,
                    "description": "",
                    "technologies": "Graphic Design, Visual Media, Digital Content",
                    "published": True,
                    "order_index": 2
                },
                {
                    "role": "Graphic Designer",
                    "company": "Flow Liberia",
                    "location": "Monrovia, Liberia",
                    "start_date": "March 2021",
                    "end_date": "September 2021",
                    "is_current": False,
                    "description": "",
                    "technologies": "Graphic Design, Brand Identity, Visual Assets",
                    "published": True,
                    "order_index": 3
                },
                {
                    "role": "Queue Controller",
                    "company": "National Election Commission",
                    "location": "Liberia",
                    "start_date": "April 2021",
                    "end_date": None,
                    "is_current": False,
                    "description": "",
                    "technologies": "Crowd Management, Operations, Public Service",
                    "published": True,
                    "order_index": 4
                },
                {
                    "role": "Data Entry Clerk",
                    "company": "Comnet IT Solution",
                    "location": "Monrovia, Liberia",
                    "start_date": "July 2019",
                    "end_date": "February 2020",
                    "is_current": False,
                    "description": "",
                    "technologies": "Data Entry, Records Management, Quality Assurance",
                    "published": True,
                    "order_index": 5
                }
            ]
            for exp_data in experiences_data:
                db.add(Experience(**exp_data))

        # 6. Education
        if db.query(Education).count() == 0:
            print("Seeding education...")
            educations_data = [
                {
                    "degree": "M.Tech. in Data Science",
                    "field_of_study": "Data Science",
                    "institution": "Marwadi University",
                    "location": "Rajkot, India",
                    "start_date": "July 2025",
                    "end_date": "Expected February 2027",
                    "is_current": True,
                    "published": True,
                    "order_index": 1
                },
                {
                    "degree": "Bachelor's Degree in Computer Engineering",
                    "field_of_study": "Computer Engineering",
                    "institution": "Marwadi University",
                    "location": "Rajkot, India",
                    "start_date": "September 2021",
                    "end_date": "November 2025",
                    "is_current": False,
                    "published": True,
                    "order_index": 2
                },
                {
                    "degree": "Diploma in Electronics",
                    "field_of_study": "Electronics",
                    "institution": "Booker Washington Institute",
                    "location": "Liberia",
                    "start_date": "July 2016",
                    "end_date": "September 2020",
                    "is_current": False,
                    "published": True,
                    "order_index": 3
                }
            ]
            for edu_data in educations_data:
                db.add(Education(**edu_data))

        # 7. Conferences
        if db.query(Conference).count() == 0:
            print("Seeding conferences...")
            conferences_data = [
                {
                    "event_name": "Vibrant Gujarat Regional Conference (Saurashtra & Kutch)",
                    "location": "Saurashtra & Kutch, Gujarat, India",
                    "date_string": "January 2026",
                    "role": "Volunteer — Documentation Committee",
                    "description": "Active volunteer in the Documentation Committee, managing technological documentation, stakeholder session summaries, and event media records.",
                    "featured": True,
                    "published": True,
                    "order_index": 1
                }
            ]
            for conf_data in conferences_data:
                db.add(Conference(**conf_data))

        # 8. Skills
        if db.query(Skill).count() == 0:
            print("Seeding skills...")
            skills_data = [
                # Machine Learning & AI
                {"name": "Machine Learning", "category": "Machine Learning & AI", "proficiency": 95, "icon_name": "Brain", "featured": True, "order_index": 1},
                {"name": "Predictive Modelling", "category": "Machine Learning & AI", "proficiency": 92, "icon_name": "TrendingUp", "featured": True, "order_index": 2},
                {"name": "Natural Language Processing", "category": "Machine Learning & AI", "proficiency": 90, "icon_name": "FileText", "featured": True, "order_index": 3},
                {"name": "Multimodal Learning", "category": "Machine Learning & AI", "proficiency": 92, "icon_name": "Layers", "featured": True, "order_index": 4},
                {"name": "Trustworthy AI", "category": "Machine Learning & AI", "proficiency": 95, "icon_name": "ShieldCheck", "featured": True, "order_index": 5},
                # Optimization & Computational Methods
                {"name": "Genetic Algorithms", "category": "Optimization & Computational Methods", "proficiency": 92, "icon_name": "Cpu", "featured": True, "order_index": 6},
                {"name": "Constraint-Based Optimization", "category": "Optimization & Computational Methods", "proficiency": 90, "icon_name": "Sliders", "featured": True, "order_index": 7},
                {"name": "Algorithmic Problem Solving", "category": "Optimization & Computational Methods", "proficiency": 94, "icon_name": "Code", "featured": True, "order_index": 8},
                {"name": "Data Preprocessing", "category": "Optimization & Computational Methods", "proficiency": 92, "icon_name": "Filter", "featured": True, "order_index": 9},
                # Programming
                {"name": "Python", "category": "Programming", "proficiency": 98, "icon_name": "Terminal", "featured": True, "order_index": 10},
                {"name": "Java", "category": "Programming", "proficiency": 88, "icon_name": "Code2", "featured": True, "order_index": 11},
                {"name": "JavaScript", "category": "Programming", "proficiency": 90, "icon_name": "FileCode", "featured": True, "order_index": 12},
                # Data Science
                {"name": "Data Analytics", "category": "Data Science", "proficiency": 92, "icon_name": "BarChart3", "featured": True, "order_index": 13},
                {"name": "Statistical Evaluation", "category": "Data Science", "proficiency": 90, "icon_name": "Binary", "featured": True, "order_index": 14},
                {"name": "Machine Learning with Python", "category": "Data Science", "proficiency": 96, "icon_name": "Terminal", "featured": True, "order_index": 15},
                # Frameworks & Tools
                {"name": "NLTK", "category": "Frameworks & Tools", "proficiency": 90, "icon_name": "BookOpen", "featured": True, "order_index": 16},
                {"name": "Django", "category": "Frameworks & Tools", "proficiency": 88, "icon_name": "Server", "featured": True, "order_index": 17},
                {"name": "OpenCV", "category": "Frameworks & Tools", "proficiency": 86, "icon_name": "Eye", "featured": True, "order_index": 18},
                {"name": "ChromaDB", "category": "Frameworks & Tools", "proficiency": 92, "icon_name": "Database", "featured": True, "order_index": 19},
                # Cloud & Systems
                {"name": "AWS", "category": "Cloud & Systems", "proficiency": 86, "icon_name": "Cloud", "featured": True, "order_index": 20},
                {"name": "Microsoft Azure", "category": "Cloud & Systems", "proficiency": 84, "icon_name": "CloudRain", "featured": True, "order_index": 21},
                {"name": "Google Cloud Platform", "category": "Cloud & Systems", "proficiency": 85, "icon_name": "CloudLightning", "featured": True, "order_index": 22},
                {"name": "Linux", "category": "Cloud & Systems", "proficiency": 90, "icon_name": "TerminalSquare", "featured": True, "order_index": 23},
                {"name": "Windows", "category": "Cloud & Systems", "proficiency": 92, "icon_name": "Monitor", "featured": True, "order_index": 24},
            ]
            for s_data in skills_data:
                db.add(Skill(**s_data))

        # 9. Initial CV Record
        if db.query(CV).count() == 0:
            print("Seeding CV entry...")
            initial_cv = CV(
                title="Jeff_G_Wilson_Resume_2026.pdf",
                filename="Jeff_G_Wilson_Resume_2026.pdf",
                file_url="/uploads/cv/Jeff_G_Wilson_Resume_2026.pdf",
                file_size=1024 * 320,
                version="2026.1",
                is_active=True
            )
            db.add(initial_cv)

        # 10. Sample Inquiry
        if db.query(Inquiry).count() == 0:
            print("Seeding initial inquiries...")
            inquiries_data = [
                {
                    "category": "research",
                    "full_name": "Dr. Sarah Chen",
                    "email": "sarah.chen@ai-institute.org",
                    "company_or_institution": "International AI Research Center",
                    "research_area": "Multimodal Retrieval-Augmented Generation",
                    "project_title_or_name": "Cross-Modal Factuality Verification in LLMs",
                    "description_or_message": "Hello Jeff, we read your work on the TrustRAG framework and would like to invite you for a collaborative research session on graph-based grounding.",
                    "status": "new"
                },
                {
                    "category": "web",
                    "full_name": "Alexander Vance",
                    "email": "a.vance@techventures.io",
                    "company_or_institution": "TechVentures Global",
                    "project_type": "saas",
                    "project_title_or_name": "Next-Gen Analytics Engine",
                    "budget": "$10k - $25k",
                    "timeline": "3 months",
                    "description_or_message": "Looking to build a high-performance analytics web dashboard with real-time streaming and modern glassmorphic interface.",
                    "status": "in_discussion"
                }
            ]
            for inq_data in inquiries_data:
                db.add(Inquiry(**inq_data))

        # 11. Site Settings
        if db.query(SiteSetting).count() == 0:
            print("Seeding site settings...")
            settings_dict = {
                "site_title": "Jeff G. Wilson — Portfolio & AI Research",
                "site_tagline": "Computer Engineer | Data Scientist | AI/ML Researcher",
                "meta_description": "Official personal portfolio and research portal of Jeff G. Wilson. Specializing in high-performance software, data science, RAG architectures, and AI systems.",
                "keywords": "Jeff G. Wilson, Computer Engineer, Data Scientist, AI Researcher, Machine Learning, TrustRAG, Liberia Opportunities Hub, NGO Connect",
                "contact_email": "jeffgwilson@example.com",
                "primary_accent": "#adc6ff",
                "secondary_accent": "#d0bcff",
                "default_theme": "dark"
            }
            for k, v in settings_dict.items():
                db.add(SiteSetting(key=k, value=v))

        db.commit()
        print("[SUCCESS] Database seeding completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error during database seeding: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed()
