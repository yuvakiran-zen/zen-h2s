"""
Financial Multi-Agent System
Production-grade agent workflow for comprehensive financial data aggregation and analysis.
"""

__version__ = "1.0.0"
__author__ = "Financial AI Team"

from .agent import (
    root_agent,
    FinancialSystemOrchestrator,
    FinancialDataContext,
    FinancialMetricsCalculator,
    health_check,
    PRODUCTION_CONFIG
)

__all__ = [
    "root_agent",
    "FinancialSystemOrchestrator", 
    "FinancialDataContext",
    "FinancialMetricsCalculator",
    "health_check",
    "PRODUCTION_CONFIG"
]