from fastapi import FastAPI
from routers import prediction

app = FastAPI(title="PashuCare AI Service")

app.include_router(prediction.router)

@app.get("/health")
def health_check():
    return {"status": "up", "message": "PashuCare AI Service is running"}

