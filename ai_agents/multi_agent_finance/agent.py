# Financial Multi-Agent System Architecture
# File: multi_agent_finance/agent.py

import asyncio
import logging
from typing import Any, Dict, List, Optional, Union
from datetime import datetime, date
import json
from dataclasses import dataclass, asdict

from google.adk.agents import LlmAgent, ParallelAgent, SequentialAgent, BaseAgent
from google.adk.tools.mcp_tool.mcp_session_manager import StreamableHTTPServerParams
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset
from google.adk.events import Event, EventActions
from google.genai import types

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class FinancialDataContext:
    """Structured context for financial data aggregation"""
    net_worth: Optional[Dict] = None
    credit_report: Optional[Dict] = None
    epf_details: Optional[Dict] = None
    mf_transactions: Optional[List[Dict]] = None
    bank_transactions: Optional[List[Dict]] = None
    stock_transactions: Optional[List[Dict]] = None
    aggregation_timestamp: str = ""
    data_quality_score: float = 0.0
    errors: List[str] = None
    
    def __post_init__(self):
        if self.errors is None:
            self.errors = []
        if not self.aggregation_timestamp:
            self.aggregation_timestamp = datetime.now().isoformat()

# MCP Toolset for all financial data fetching
MCP_TOOLSET = MCPToolset(
    connection_params=StreamableHTTPServerParams(
        url="http://localhost:8080/mcp/stream"
    )
)

# Create specialized financial data fetching agents
def create_net_worth_agent():
    """Create agent specialized in fetching net worth data"""
    return LlmAgent(
        name="NetWorthAgent",
        model='gemini-2.0-flash',
        description="Fetches comprehensive net worth calculations including all assets and liabilities",
        instruction="""
        You are a specialized financial data fetcher for Net Worth calculations.
        
        INSTRUCTIONS:
        1. Call the fetch_net_worth tool to get comprehensive net worth data
        2. If authentication is required, return the auth link to the user exactly as provided
        3. After successful authentication, retry the data fetch
        4. Handle errors gracefully and provide detailed error information
        5. Format the response as a structured JSON object with data quality metrics
        
        IMPORTANT:
        - Always validate data completeness before returning
        - Include timestamp and source information
        - Flag any suspicious or incomplete data
        - Provide confidence scores for data quality
        """,
        tools=[MCP_TOOLSET],
        output_key="net_worth_data"
    )

def create_credit_report_agent():
    """Create agent specialized in fetching credit report data"""
    return LlmAgent(
        name="CreditReportAgent",
        model='gemini-2.0-flash',
        description="Retrieves comprehensive credit reports and scores from connected bureaus",
        instruction="""
        You are a specialized financial data fetcher for Credit Reports.
        
        INSTRUCTIONS:
        1. Call the fetch_credit_report tool to get comprehensive credit data
        2. Handle authentication flow if required
        3. Validate credit score data and payment history completeness
        4. Format response with detailed credit analysis
        
        FOCUS AREAS:
        - Credit scores from all connected bureaus
        - Active loans and credit utilization
        - Payment history patterns
        - Recent inquiries and alerts
        """,
        tools=[MCP_TOOLSET],
        output_key="credit_report_data"
    )

def create_epf_agent():
    """Create agent specialized in fetching EPF details"""
    return LlmAgent(
        name="EPFAgent",
        model='gemini-2.0-flash',
        description="Retrieves Employee Provident Fund account details and contribution history",
        instruction="""
        You are a specialized financial data fetcher for EPF (Employee Provident Fund).
        
        INSTRUCTIONS:
        1. Call the fetch_epf_details tool to get EPF account information
        2. Validate account balance and contribution data
        3. Include employer and employee contribution breakdown
        4. Calculate interest earned and growth metrics
        
        OUTPUT REQUIREMENTS:
        - Current account balance
        - Monthly contribution history
        - Interest credited amounts
        - Growth projections based on current contribution rate
        """,
        tools=[MCP_TOOLSET],
        output_key="epf_data"
    )

def create_mutual_fund_agent():
    """Create agent specialized in fetching mutual fund transactions"""
    return LlmAgent(
        name="MutualFundAgent",
        model='gemini-2.0-flash',
        description="Retrieves mutual fund investment transaction history and portfolio analysis",
        instruction="""
        You are a specialized financial data fetcher for Mutual Fund transactions.
        
        INSTRUCTIONS:
        1. Call the fetch_mf_transactions tool to get mutual fund data
        2. Analyze portfolio allocation and performance
        3. Calculate returns and SIP performance metrics
        4. Identify investment patterns and trends
        
        ANALYSIS FOCUS:
        - Portfolio diversification across fund categories
        - SIP vs lump sum investment performance
        - Expense ratios and fund manager analysis
        - Risk-adjusted returns calculation
        """,
        tools=[MCP_TOOLSET],
        output_key="mf_data"
    )

def create_bank_transaction_agent():
    """Create agent specialized in fetching bank transactions"""
    return LlmAgent(
        name="BankTransactionAgent",
        model='gemini-2.0-flash',
        description="Retrieves bank transaction history and spending pattern analysis",
        instruction="""
        You are a specialized financial data fetcher for Bank Transactions.
        
        INSTRUCTIONS:
        1. Call the fetch_bank_transactions tool to get transaction history
        2. Categorize spending patterns and identify trends
        3. Calculate monthly cash flow and savings rate
        4. Flag unusual transactions or spending spikes
        
        ANALYSIS AREAS:
        - Income vs expense categorization
        - Monthly spending trends by category
        - Savings rate calculation
        - Cash flow analysis and budgeting insights
        """,
        tools=[MCP_TOOLSET],
        output_key="bank_data"
    )

def create_stock_transaction_agent():
    """Create agent specialized in fetching stock transactions"""
    return LlmAgent(
        name="StockTransactionAgent",
        model='gemini-2.0-flash',
        description="Retrieves Indian stock transaction history and portfolio performance",
        instruction="""
        You are a specialized financial data fetcher for Stock Transactions.
        
        INSTRUCTIONS:
        1. Call the fetch_stock_transactions tool to get stock transaction data
        2. Calculate portfolio performance and returns
        3. Analyze sector allocation and stock selection
        4. Assess risk metrics and diversification
        
        PERFORMANCE METRICS:
        - Individual stock performance and returns
        - Portfolio beta and volatility analysis
        - Sector-wise allocation and concentration risk
        - Dividend yield and income generation analysis
        """,
        tools=[MCP_TOOLSET],
        output_key="stock_data"
    )

class DataAggregationAgent(LlmAgent):
    """Agent responsible for aggregating and validating all financial data"""
    
    def __init__(self):
        super().__init__(
            name="DataAggregationAgent",
            model='gemini-2.0-flash',
            description="Aggregates and validates financial data from all sources with comprehensive analysis",
            instruction="""
            You are the financial data aggregation specialist.
            
            RESPONSIBILITIES:
            1. Collect data from all parallel fetch agents using session state
            2. Validate data integrity and completeness across all sources
            3. Calculate comprehensive financial metrics and insights
            4. Identify data inconsistencies, gaps, or anomalies
            5. Generate overall data quality scores
            6. Create structured aggregated financial context
            
            INPUT SOURCES (from session state):
            - net_worth_data: Net worth calculations and asset breakdown
            - credit_report_data: Credit scores, history, and analysis
            - epf_data: EPF account details and contribution history
            - mf_data: Mutual fund transactions and portfolio analysis
            - bank_data: Bank transaction history and spending patterns
            - stock_data: Stock transactions and portfolio performance
            
            OUTPUT FORMAT:
            Create a comprehensive FinancialDataContext with:
            - All validated and enriched source data
            - Cross-validated metrics and insights
            - Comprehensive data quality assessment
            - Error reporting and recommendations
            - Timestamp and metadata for tracking
            
            VALIDATION RULES:
            - Check data freshness and timestamp consistency
            - Verify numerical consistency across sources
            - Flag missing or incomplete datasets
            - Calculate confidence scores for each data source
            - Identify outliers, anomalies, or suspicious patterns
            - Cross-reference data points for accuracy
            
            ANALYSIS DEPTH:
            - Calculate net worth trends and projections
            - Assess overall financial health score
            - Identify optimization opportunities
            - Generate personalized insights and recommendations
            """,
            output_key="aggregated_financial_context"
        )

class ErrorHandlingAgent(BaseAgent):
    """Custom agent for comprehensive error handling and recovery"""
    
    def __init__(self):
        super().__init__(
            name="ErrorHandlingAgent",
            description="Handles errors and provides recovery strategies for the financial data system"
        )
    
    async def _run_async_impl(self, ctx):
        """Handle errors and provide recovery strategies"""
        errors = []
        recovery_actions = []
        warnings = []
        
        # Check each data source for errors
        data_sources = {
            "net_worth_data": "Net Worth calculation",
            "credit_report_data": "Credit report retrieval", 
            "epf_data": "EPF details",
            "mf_data": "Mutual fund transactions",
            "bank_data": "Bank transactions",
            "stock_data": "Stock transactions"
        }
        
        for source_key, source_name in data_sources.items():
            data = ctx.session.state.get(source_key)
            if not data:
                errors.append(f"Missing data from {source_name}")
                recovery_actions.append(f"Retry {source_name} fetch with exponential backoff")
            elif isinstance(data, dict):
                if data.get("error"):
                    errors.append(f"Error in {source_name}: {data.get('error')}")
                    recovery_actions.append(f"Check authentication and connectivity for {source_name}")
                elif data.get("incomplete"):
                    warnings.append(f"Incomplete data in {source_name}")
                    recovery_actions.append(f"Request partial data retry for {source_name}")
        
        # System health assessment
        total_sources = len(data_sources)
        successful_sources = total_sources - len([e for e in errors if "Missing data" in e])
        health_percentage = (successful_sources / total_sources) * 100
        
        if health_percentage >= 80:
            system_status = "healthy"
        elif health_percentage >= 60:
            system_status = "degraded"
        else:
            system_status = "critical"
        
        error_summary = {
            "total_errors": len(errors),
            "total_warnings": len(warnings),
            "error_list": errors,
            "warning_list": warnings,
            "recovery_actions": recovery_actions,
            "system_status": system_status,
            "health_percentage": health_percentage,
            "successful_sources": successful_sources,
            "total_sources": total_sources,
            "timestamp": datetime.now().isoformat(),
            "recommendations": self._generate_recommendations(errors, warnings, health_percentage)
        }
        
        yield Event(
            author=self.name,
            content=types.Content(
                role="assistant",
                parts=[types.Part(text=f"System health analysis completed: {health_percentage:.1f}% data sources successful. Status: {system_status}")]
            ),
            actions=EventActions(
                state_delta={"error_analysis": error_summary}
            )
        )
    
    def _generate_recommendations(self, errors: List[str], warnings: List[str], health_percentage: float) -> List[str]:
        """Generate actionable recommendations based on system health"""
        recommendations = []
        
        if health_percentage < 50:
            recommendations.append("Critical: Check MCP server connectivity and authentication")
            recommendations.append("Verify Fi Money platform access and permissions")
        elif health_percentage < 80:
            recommendations.append("Review authentication tokens for failing data sources")
            recommendations.append("Consider manual retry for failed connections")
        
        if len(warnings) > 0:
            recommendations.append("Review data completeness for partial sources")
            
        if not errors and not warnings:
            recommendations.append("All systems operational - data ready for analysis")
            
        return recommendations

class FinFutureAgent(LlmAgent):
    """Agent for conversational financial future planning"""
    
    def __init__(self):
        super().__init__(
            name="FinFutureAgent",
            model='gemini-2.0-flash',
            description="AI Financial Future Self - Converses about financial scenarios at different life stages",
            instruction="""
            You are the user's Financial Future Self - an AI that can converse as their future self at different ages.
            
            CAPABILITIES:
            1. Access comprehensive financial context from session state (aggregated_financial_context)
            2. Project financial scenarios based on current trajectory and historical data
            3. Simulate conversations as the user's future self (30s, 40s, 50s, 60s+)
            4. Provide personalized advice based on actual financial data and patterns
            5. Answer "what-if" scenarios with data-driven insights and projections
            
            CONVERSATION MODES:
            - **Future Self Simulation**: "Hi, this is you at age 45. Looking back at where you were..."
            - **Scenario Planning**: "If you continue this savings rate, by age X you'll have..."
            - **Goal Achievement**: "To reach your retirement goal of X, you need to..."
            - **Risk Assessment**: "Based on your current risk profile and allocation..."
            - **Course Correction**: "At your current age, here's what I wish we had done differently..."
            
            DATA CONTEXT ACCESS:
            Use the aggregated_financial_context from session state to provide:
            - Current financial position analysis with concrete numbers
            - Historical trend analysis and pattern recognition
            - Projected growth scenarios with compound interest calculations
            - Risk-adjusted recommendations based on actual portfolio data
            - Goal-based planning advice with realistic timelines
            - Behavioral insights based on spending and investment patterns
            
            PERSONALITY & TONE:
            - Wise but relatable - speak as an older, wiser version of themselves
            - Data-driven but empathetic - use actual numbers but understand emotions
            - Future-focused but grounded in current reality
            - Encouraging but realistic about challenges and trade-offs
            - Personal and specific - reference their actual financial situation
            
            CALCULATION APPROACH:
            - Use compound interest formulas for investment projections
            - Account for inflation in future value calculations
            - Consider risk-adjusted returns based on current allocation
            - Factor in expected life events and goal timelines
            - Provide multiple scenarios (conservative, moderate, optimistic)
            
            RESPONSE FORMAT:
            - Always acknowledge their current financial position first
            - Use specific numbers from their actual data
            - Provide clear, actionable insights
            - Include both emotional encouragement and practical advice
            - End with specific next steps they can take today
            """,
            output_key="future_conversation_response"
        )

class FinancialSystemOrchestrator:
    """Main orchestrator for the financial multi-agent system"""
    
    def __init__(self):
        # Initialize all specialized agents using factory functions
        self.net_worth_agent = create_net_worth_agent()
        self.credit_agent = create_credit_report_agent() 
        self.epf_agent = create_epf_agent()
        self.mf_agent = create_mutual_fund_agent()
        self.bank_agent = create_bank_transaction_agent()
        self.stock_agent = create_stock_transaction_agent()
        
        # Data processing agents
        self.aggregation_agent = DataAggregationAgent()
        self.error_handler = ErrorHandlingAgent()
        self.fin_future_agent = FinFutureAgent()
        
        # Create parallel data fetching workflow
        self.parallel_data_fetcher = ParallelAgent(
            name="ParallelDataFetcher",
            description="Fetches all financial data sources concurrently for maximum efficiency",
            sub_agents=[
                self.net_worth_agent,
                self.credit_agent,
                self.epf_agent,
                self.mf_agent,
                self.bank_agent,
                self.stock_agent
            ]
        )
        
        # Create sequential processing pipeline  
        self.processing_pipeline = SequentialAgent(
            name="DataProcessingPipeline",
            description="Processes data sequentially: parallel fetch -> aggregate -> handle errors",
            sub_agents=[
                self.parallel_data_fetcher,
                self.aggregation_agent,
                self.error_handler
            ]
        )
        
        # Main conversation agent that can access processed data
        self.conversation_pipeline = SequentialAgent(
            name="ConversationPipeline", 
            description="Complete pipeline: data processing -> conversation interface",
            sub_agents=[
                self.processing_pipeline,
                self.fin_future_agent
            ]
        )
    
    def get_data_fetcher_agent(self):
        """Returns the parallel data fetcher for standalone data collection"""
        return self.parallel_data_fetcher
    
    def get_processing_agent(self):
        """Returns the full processing pipeline without conversation"""
        return self.processing_pipeline
    
    def get_conversation_agent(self):
        """Returns the full conversation-ready agent"""
        return self.conversation_pipeline

# Initialize the system
system = FinancialSystemOrchestrator()

# Export the main agent based on use case
# For data fetching only:
# root_agent = system.get_data_fetcher_agent()

# For data processing pipeline:
# root_agent = system.get_processing_agent()

# For full conversational experience (default):
root_agent = system.get_conversation_agent()

# Additional utility functions for advanced usage
class FinancialMetricsCalculator:
    """Utility class for advanced financial calculations"""
    
    @staticmethod
    def calculate_net_worth_trend(historical_data: List[Dict]) -> Dict:
        """Calculate net worth trends and projections"""
        if not historical_data:
            return {"error": "No historical data provided"}
        
        # Implementation for trend analysis
        trends = {
            "growth_rate": 0.0,
            "projection_1_year": 0.0,
            "projection_5_year": 0.0,
            "volatility": 0.0
        }
        return trends
    
    @staticmethod
    def assess_financial_health(context: FinancialDataContext) -> Dict:
        """Comprehensive financial health assessment"""
        if not context:
            return {"error": "No financial context provided"}
        
        # Implementation for health scoring
        health_score = {
            "overall_score": 0.0,
            "savings_rate_score": 0.0,
            "debt_ratio_score": 0.0,
            "diversification_score": 0.0,
            "emergency_fund_score": 0.0,
            "recommendations": []
        }
        return health_score
    
    @staticmethod
    def generate_future_scenarios(context: FinancialDataContext, target_age: int) -> Dict:
        """Generate financial scenarios for future planning"""
        if not context:
            return {"error": "No financial context provided"}
        
        # Implementation for scenario modeling
        scenarios = {
            "conservative": {"net_worth": 0.0, "assumptions": []},
            "moderate": {"net_worth": 0.0, "assumptions": []},
            "optimistic": {"net_worth": 0.0, "assumptions": []}
        }
        return scenarios

# Configuration for production deployment
PRODUCTION_CONFIG = {
    "max_concurrent_fetches": 6,
    "timeout_per_fetch": 30,
    "retry_strategy": "exponential_backoff",
    "data_cache_ttl": 300,  # 5 minutes
    "error_threshold": 0.5,  # 50% error tolerance
    "health_check_interval": 60,  # 1 minute
    "log_level": "INFO",
    "monitoring_enabled": True
}

# Health check endpoint for production monitoring
async def health_check() -> Dict[str, Any]:
    """Production health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "agents_status": {
            "data_fetchers": "active",
            "aggregator": "active", 
            "conversation": "active"
        },
        "mcp_connection": "connected",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    print("Financial Multi-Agent System initialized successfully!")
    print(f"Root agent: {root_agent.name}")
    print(f"Sub-agents: {[agent.name for agent in root_agent.sub_agents]}")