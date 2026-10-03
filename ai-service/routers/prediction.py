from fastapi import APIRouter
from schemas.ai_prediction import AIRequest, AIResponse
from services.health_assessment_service import assess_health

router = APIRouter(
    prefix="/api/v1",
    tags=["Prediction"]
)

@router.post("/predict", response_model=AIResponse)
async def get_prediction(request: AIRequest):
    return assess_health(request)
