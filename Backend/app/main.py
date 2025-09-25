from fastapi import FastAPI
from app.routers import submissions, portfolio, analysis
from app.models.database import Base, engine
from aiengine.risk_analyzer import initialize_risk_analyzer

app = FastAPI(
    title="ReSure-AI API",
    description="API for submissions, portfolio analytics, and reporting",
    version="1.0.0",
)

Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(submissions.router, prefix="/submissions", tags=["Submissions"])
app.include_router(portfolio.router, prefix="/portfolio", tags=["Portfolio"])  
app.include_router(analysis.router, prefix="/analysis", tags=["Analysis"])

# Initialize analyzer (no training or batch processing)
analyzer = None
try:
    analyzer = initialize_risk_analyzer("aiengine/models/risk_model.pkl")
    if analyzer.model is not None:
        print("Risk analyzer loaded successfully")
        print(f"Model features: {analyzer.feature_columns}")
    else:
        print("Warning: No trained model found. Run 'python train.py' first.")
except Exception as e:
    print(f"Warning: Could not load risk analyzer: {e}")

@app.get("/")
def root():
    return {"message": "ReSure AI backend is running"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": analyzer is not None and analyzer.model is not None
    }

@app.post("/predict-risk")
async def predict_risk(submission: dict):
    """Predict risk for a submission"""
    if analyzer is None or analyzer.model is None:
        return {"error": "Risk model not available. Train the model first."}
    
    try:
        prediction = analyzer.predict(submission)
        probabilities = analyzer.predict_proba(submission)
        return {
            "predicted_risk": prediction,
            "probabilities": probabilities,
            "model_features": analyzer.feature_columns
        }
    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}