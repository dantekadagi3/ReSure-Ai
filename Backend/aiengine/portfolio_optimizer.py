import cvxpy as cp
import numpy as np

class PortfolioOptimizer:
    """
    Optimizes portfolio exposures by adjusting deal shares.
    Includes Risk, ESG, and Catastrophe considerations.
    """

    def __init__(self, capital: float = 1.0):
        self.capital = capital

    def optimize(self, submissions: list) -> dict:
        """
        Optimize portfolio allocation.

        Args:
            submissions: List of dicts with
                {"Cedant": str, "SumInsured": float, "NormalizedRiskScore": float,
                 "ESGScore": float, "CatastropheExposure": float}

        Returns:
            Dict {submission_id: recommended_share}
        """
        n = len(submissions)
        if n == 0:
            return {}

        ids = [sub.get("Cedant", f"sub_{i}") for i, sub in enumerate(submissions)]
        risk_scores = np.array([sub.get("NormalizedRiskScore", 5) for sub in submissions], dtype=float)
        sums = np.array([sub.get("SumInsured", 1) for sub in submissions], dtype=float)
        esg_scores = np.array([sub.get("ESGScore", 0.5) for sub in submissions], dtype=float)
        cat_scores = np.array([sub.get("CatastropheExposure", 0.5) for sub in submissions], dtype=float)

        # Decision variable: allocation % per deal
        x = cp.Variable(n)

        # Objective: Minimize (Risk + ESG penalty + Cat penalty)
        objective = cp.Minimize(
            cp.sum(cp.multiply(risk_scores, sums) @ x) +
            0.3 * cp.sum(cp.multiply(esg_scores, sums) @ x) +
            0.5 * cp.sum(cp.multiply(cat_scores, sums) @ x)
        )

        # Constraints: 0 <= x <= 1, total allocation <= capital
        constraints = [x >= 0, x <= 1, cp.sum(x) <= self.capital]

        prob = cp.Problem(objective, constraints)
        prob.solve()

        return dict(zip(ids, np.round(x.value, 2)))
