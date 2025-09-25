from fastapi import FastAPI
from .routers import submissions, portfolio, analysis

app = FastAPI(title="Facultative AI System")

# include routers
app.include_router(submissions.router, prefix="/submissions", tags=["Submissions"])
app.include_router(portfolio.router, prefix="/portfolio", tags=["Portfolio"])
app.include_router(analysis.router, prefix="/analysis", tags=["Analysis"])

@app.get("/")
def root():
    return {"message": "Facultative AI System Backend is running"}
