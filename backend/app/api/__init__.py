from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.profile import router as profile_router
from app.api.projects import router as projects_router
from app.api.research import router as research_router
from app.api.experience import router as experience_router
from app.api.education import router as education_router
from app.api.conferences import router as conferences_router
from app.api.certifications import router as certifications_router
from app.api.awards import router as awards_router
from app.api.skills import router as skills_router
from app.api.media import router as media_router
from app.api.cv import router as cv_router
from app.api.inquiries import router as inquiries_router
from app.api.settings import router as settings_router
from app.api.stats import router as stats_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(profile_router)
api_router.include_router(projects_router)
api_router.include_router(research_router)
api_router.include_router(experience_router)
api_router.include_router(education_router)
api_router.include_router(conferences_router)
api_router.include_router(certifications_router)
api_router.include_router(awards_router)
api_router.include_router(skills_router)
api_router.include_router(media_router)
api_router.include_router(cv_router)
api_router.include_router(inquiries_router)
api_router.include_router(settings_router)
api_router.include_router(stats_router)
