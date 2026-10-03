from pydantic import BaseModel
from typing import Optional, List

class AIRequest(BaseModel):
    animalType: Optional[str] = None
    breed: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    symptoms: Optional[str] = None
    behaviourChanges: Optional[str] = None
    duration: Optional[str] = None
    temperature: Optional[float] = None
    photoPath: Optional[str] = None
    animalId: Optional[int] = None
    weight: Optional[float] = None
    symptomDescription: Optional[str] = None
    activityLevel: Optional[str] = None
    appetite: Optional[str] = None
    eatingBehaviour: Optional[str] = None
    otherBehaviour: Optional[str] = None

class AIResponse(BaseModel):
    riskLevel: str
    predictedCondition: str
    severity: str
    confidence: float
    recommendations: List[str]
    veterinarianNeeded: bool
    matchedSymptoms: List[str]
    matchedBehaviourChanges: List[str]
    explanation: str
    disclaimer: str
