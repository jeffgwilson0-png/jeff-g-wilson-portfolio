from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.project import Project
from app.models.research import Research
from app.models.skill import Skill
from app.models.experience import Experience
from app.models.conference import Conference
from app.models.certification import Certification
from app.models.award import Award
from app.models.inquiry import Inquiry
from app.models.user import User
from app.schemas.stats import AdminStatsResponse, ActivityItem
from app.auth.deps import get_current_user

router = APIRouter(prefix="/admin/stats", tags=["Admin Statistics"])

@router.get("", response_model=AdminStatsResponse)
def get_admin_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total_projects = db.query(Project).count()
    total_research = db.query(Research).count()
    total_skills = db.query(Skill).count()
    total_experience = db.query(Experience).count()
    total_conferences = db.query(Conference).count()
    total_certifications = db.query(Certification).count()
    total_awards = db.query(Award).count()
    total_inquiries = db.query(Inquiry).count()
    unread_inquiries = db.query(Inquiry).filter(Inquiry.status == "new").count()

    # Inquiry categories breakdown
    inquiries = db.query(Inquiry).all()
    categories_count = {"research": 0, "web": 0, "mobile": 0, "general": 0}
    for inq in inquiries:
        cat = (inq.category or "general").lower()
        if cat in categories_count:
            categories_count[cat] += 1
        else:
            categories_count[cat] = 1

    # Recent activities (combined from newest items)
    activities = []
    
    # Recent projects
    recent_projects = db.query(Project).order_by(Project.created_at.desc()).limit(2).all()
    for p in recent_projects:
        activities.append(ActivityItem(
            id=f"proj-{p.id}",
            title=f"Project added: \"{p.title}\"",
            type="project",
            description=p.short_description[:80] + "...",
            timestamp=p.created_at.strftime("%b %d, %Y")
        ))
        
    # Recent research
    recent_research = db.query(Research).order_by(Research.created_at.desc()).limit(2).all()
    for r in recent_research:
        activities.append(ActivityItem(
            id=f"res-{r.id}",
            title=f"Research paper added: \"{r.title[:45]}...\"",
            type="research",
            description=f"Status: {r.publication_status}",
            timestamp=r.created_at.strftime("%b %d, %Y")
        ))
        
    # Recent inquiries
    recent_inquiries = db.query(Inquiry).order_by(Inquiry.created_at.desc()).limit(3).all()
    for i in recent_inquiries:
        activities.append(ActivityItem(
            id=f"inq-{i.id}",
            title=f"Inquiry received from {i.full_name} ({i.category.title()})",
            type="inquiry",
            description=i.description_or_message[:70] + "...",
            timestamp=i.created_at.strftime("%b %d, %Y")
        ))

    # Sort activities by timestamp descending or keep order
    return AdminStatsResponse(
        total_projects=total_projects,
        total_research=total_research,
        total_skills=total_skills,
        total_experience=total_experience,
        total_conferences=total_conferences,
        total_certifications=total_certifications,
        total_awards=total_awards,
        unread_inquiries=unread_inquiries,
        total_inquiries=total_inquiries,
        inquiry_categories=categories_count,
        recent_activities=activities[:6]
    )
