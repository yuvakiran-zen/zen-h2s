# Single File Financial DNA Building Agent
# pip install google-adk google-generativeai motor python-dotenv aiohttp

import asyncio
import os
import json
import logging
import aiohttp
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, asdict
from enum import Enum

from dotenv import load_dotenv
from google.genai import types
from google.adk.agents.llm_agent import LlmAgent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset
from google.adk.tools.mcp_tool.mcp_session_manager import StreamableHTTPServerParams
from google.adk.tools import FunctionTool
from google.adk.tools.base_tool import BaseTool
from google.adk.tools.tool_context import ToolContext

# MongoDB imports - using Motor for async operations
import motor.motor_asyncio

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# =============================================================================
# Data Models
# =============================================================================

class RiskProfile(Enum):
    CONSERVATIVE = "conservative"
    MODERATE = "moderate"
    AGGRESSIVE = "aggressive"

@dataclass
class FinancialDNA:
    user_id: str
    session_id: str
    
    # Core metrics
    total_net_worth: float
    total_assets: float
    total_liabilities: float
    
    # Breakdowns
    asset_breakdown: Dict[str, float]
    liability_breakdown: Dict[str, float]
    investment_diversification: Dict[str, float]
    
    # Insights
    risk_profile: str
    savings_rate: float
    credit_score: Optional[int]
    epf_balance: float
    financial_discipline_score: float
    
    # Recommendations
    recommended_strategies: List[str]
    future_outlook: str
    
    # Timeline projections
    projection_30_years: Dict[str, Any]
    projection_50_years: Dict[str, Any]
    projection_60_years: Dict[str, Any]
    
    # Metadata
    created_at: datetime
    data_sources_used: List[str]

# =============================================================================
# Helper Functions for Financial DNA Building
# =============================================================================

def _determine_risk_profile(diversification: Dict[str, float], savings_rate: float) -> str:
    """Determine risk profile based on investment patterns"""
    if any('equity' in cat.lower() for cat in diversification.keys()) and savings_rate > 15:
        return RiskProfile.AGGRESSIVE.value
    elif len(diversification) >= 2 and savings_rate > 10:
        return RiskProfile.MODERATE.value
    else:
        return RiskProfile.CONSERVATIVE.value

def _calculate_discipline_score(savings_rate: float, diversification: Dict, 
                              credit_score: Optional[int], net_worth: float, liabilities: float) -> float:
    """Calculate financial discipline score"""
    score = 0
    
    # Savings rate component (40%)
    if savings_rate > 20:
        score += 40
    elif savings_rate > 10:
        score += 25
    elif savings_rate > 0:
        score += 15
    
    # Investment diversification (30%)
    if len(diversification) >= 3:
        score += 30
    elif len(diversification) >= 2:
        score += 20
    elif len(diversification) >= 1:
        score += 10
    
    # Credit score component (20%)
    if credit_score and credit_score > 750:
        score += 20
    elif credit_score and credit_score > 650:
        score += 15
    elif credit_score and credit_score > 550:
        score += 10
    
    # Net worth to liability ratio (10%)
    if liabilities > 0:
        ratio = net_worth / liabilities
        if ratio > 3:
            score += 10
        elif ratio > 2:
            score += 7
        elif ratio > 1:
            score += 5
    else:
        score += 10  # No liabilities is good
    
    return min(score, 100)

def _generate_recommendations(savings_rate: float, diversification: Dict,
                             credit_score: Optional[int], discipline_score: float) -> List[str]:
    """Generate personalized recommendations"""
    recommendations = []
    
    if savings_rate < 20:
        recommendations.append("Increase savings rate to at least 20% of income")
    
    if len(diversification) < 3:
        recommendations.append("Diversify investments across more asset classes")
    
    if credit_score and credit_score < 750:
        recommendations.append("Focus on improving credit score through timely payments")
    
    if discipline_score < 60:
        recommendations.append("Implement a structured financial plan with clear goals")
    
    if not recommendations:
        recommendations.append("Maintain current financial discipline and consider wealth management")
    
    return recommendations

def _generate_outlook(discipline_score: float, net_worth: float, savings_rate: float) -> str:
    """Generate future financial outlook"""
    if discipline_score >= 80:
        return "Excellent financial trajectory with strong wealth-building potential"
    elif discipline_score >= 60:
        return "Good financial foundation with opportunities for optimization"
    elif discipline_score >= 40:
        return "Moderate financial health requiring strategic improvements"
    else:
        return "Financial situation needs significant attention and restructuring"

def _generate_projection(current_net_worth: float, savings_rate: float, years: int) -> Dict[str, Any]:
    """Generate financial projection for specific timeline"""
    annual_return = 0.08  # 8% assumed return
    annual_income = max(current_net_worth * 0.15, 500000)  # Rough income estimate
    annual_savings = annual_income * (savings_rate / 100)
    
    # Compound growth of current wealth
    future_wealth = current_net_worth * (1 + annual_return) ** years
    
    # Future value of additional savings
    if annual_return > 0:
        future_savings = annual_savings * (((1 + annual_return) ** years - 1) / annual_return)
    else:
        future_savings = annual_savings * years
    
    total_projected = future_wealth + future_savings
    
    return {
        'projected_net_worth': total_projected,
        'projected_age': 30 + years,  # Assuming current age 30
        'financial_freedom_score': min(total_projected / 10000000 * 100, 100),
        'major_milestones': _get_milestones(years, total_projected)
    }

def _get_milestones(years: int, wealth: float) -> List[str]:
    """Get financial milestones for the timeline"""
    milestones = []
    if years >= 10:
        milestones.append("Achieved substantial asset base")
    if years >= 20:
        milestones.append("Building towards financial independence")
    if years >= 30:
        milestones.append("Approaching retirement readiness")
    if wealth > 50000000:
        milestones.append("Achieved financial independence")
    return milestones

def _build_dna_from_data(data: Dict[str, Any], user_id: str, session_id: str) -> FinancialDNA:
    """Build the Financial DNA from collected data"""
    
    # Initialize default values
    total_net_worth = 0
    total_assets = 0
    total_liabilities = 0
    asset_breakdown = {}
    liability_breakdown = {}
    investment_diversification = {}
    credit_score = None
    epf_balance = 0
    data_sources = []
    
    # Process Net Worth data
    if 'net_worth' in data:
        net_worth_data = data['net_worth'].get('netWorthResponse', {})
        
        # Process assets
        for asset in net_worth_data.get('assetValues', []):
            asset_type = asset.get('netWorthAttribute', 'Unknown')
            value = float(asset.get('value', {}).get('units', 0))
            total_assets += value
            asset_breakdown[asset_type] = value
        
        # Process liabilities
        for liability in net_worth_data.get('liabilityValues', []):
            liability_type = liability.get('netWorthAttribute', 'Unknown')
            value = float(liability.get('value', {}).get('units', 0))
            total_liabilities += value
            liability_breakdown[liability_type] = value
        
        total_net_worth = total_assets - total_liabilities
        data_sources.append('net_worth')
    
    # Process Credit Report data
    if 'credit_report' in data:
        credit_data = data['credit_report'].get('creditReport', {})
        credit_score = credit_data.get('creditScore', None)
        data_sources.append('credit_report')
    
    # Process EPF data
    if 'epf_details' in data:
        epf_data = data['epf_details'].get('epfDetails', {})
        for uan in epf_data.get('uanDetails', []):
            for establishment in uan.get('establishmentDetails', []):
                epf_balance += float(establishment.get('epfBalance', 0))
        data_sources.append('epf_details')
    
    # Process Mutual Fund data for investment diversification
    if 'mf_transactions' in data:
        mf_data = data['mf_transactions']
        holdings = mf_data.get('holdings', [])
        
        total_mf_value = sum(float(h.get('currentValue', 0)) for h in holdings)
        for holding in holdings:
            category = holding.get('category', 'Other')
            value = float(holding.get('currentValue', 0))
            if category in investment_diversification:
                investment_diversification[category] += value
            else:
                investment_diversification[category] = value
        
        # Convert to percentages
        for category in investment_diversification:
            investment_diversification[category] = (investment_diversification[category] / total_mf_value * 100) if total_mf_value > 0 else 0
        
        data_sources.append('mf_transactions')
    
    # Process Bank Transactions for spending patterns
    savings_rate = 0
    if 'bank_transactions' in data:
        bank_data = data['bank_transactions']
        total_income = 0
        total_expenses = 0
        
        for account in bank_data.get('accounts', []):
            for transaction in account.get('transactions', []):
                amount = float(transaction.get('amount', 0))
                if amount > 0:
                    total_income += amount
                else:
                    total_expenses += abs(amount)
        
        savings_rate = ((total_income - total_expenses) / total_income * 100) if total_income > 0 else 0
        data_sources.append('bank_transactions')
    
    # Determine risk profile
    risk_profile = _determine_risk_profile(investment_diversification, savings_rate)
    
    # Calculate financial discipline score
    discipline_score = _calculate_discipline_score(
        savings_rate, investment_diversification, credit_score, total_net_worth, total_liabilities
    )
    
    # Generate recommendations and outlook
    recommendations = _generate_recommendations(savings_rate, investment_diversification, credit_score, discipline_score)
    outlook = _generate_outlook(discipline_score, total_net_worth, savings_rate)
    
    # Generate timeline projections
    projections_30 = _generate_projection(total_net_worth, savings_rate, 30)
    projections_50 = _generate_projection(total_net_worth, savings_rate, 50)
    projections_60 = _generate_projection(total_net_worth, savings_rate, 60)
    
    return FinancialDNA(
        user_id=user_id,
        session_id=session_id,
        total_net_worth=total_net_worth,
        total_assets=total_assets,
        total_liabilities=total_liabilities,
        asset_breakdown=asset_breakdown,
        liability_breakdown=liability_breakdown,
        investment_diversification=investment_diversification,
        risk_profile=risk_profile,
        savings_rate=savings_rate,
        credit_score=credit_score,
        epf_balance=epf_balance,
        financial_discipline_score=discipline_score,
        recommended_strategies=recommendations,
        future_outlook=outlook,
        projection_30_years=projections_30,
        projection_50_years=projections_50,
        projection_60_years=projections_60,
        created_at=datetime.now(timezone.utc),
        data_sources_used=data_sources
    )

# =============================================================================
# MongoDB Functions
# =============================================================================

async def store_in_mongodb(financial_dna: FinancialDNA):
    """Store Financial DNA in MongoDB"""
    try:
        # MongoDB connection using Motor
        client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv('MONGODB_URL', 'mongodb://localhost:27017'))
        db = client['financial_future_self']
        collection = db['financial_dna']
        
        # Convert to dict for storage
        dna_dict = asdict(financial_dna)
        dna_dict['created_at'] = financial_dna.created_at
        
        # Upsert based on session_id
        await collection.replace_one(
            {'session_id': financial_dna.session_id},
            dna_dict,
            upsert=True
        )
        
        logger.info(f"Stored Financial DNA in MongoDB for session {financial_dna.session_id}")
        await client.close()
        
    except Exception as e:
        logger.error(f"Error storing in MongoDB: {e}")

async def get_financial_dna_from_mongodb(session_id: str) -> Optional[Dict]:
    """Retrieve Financial DNA from MongoDB"""
    try:
        client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv('MONGODB_URL', 'mongodb://localhost:27017'))
        db = client['financial_future_self']
        collection = db['financial_dna']
        
        dna_doc = await collection.find_one({'session_id': session_id})
        await client.close()
        
        return dna_doc
        
    except Exception as e:
        logger.error(f"Error retrieving Financial DNA: {e}")
        return None

async def store_conversation_context(context: Dict[str, Any]):
    """Store conversation context in MongoDB"""
    try:
        client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv('MONGODB_URL', 'mongodb://localhost:27017'))
        db = client['financial_future_self']
        collection = db['conversation_context']
        
        # Convert datetime to string for JSON serialization
        if 'created_at' in context and isinstance(context['created_at'], datetime):
            context['created_at'] = context['created_at'].isoformat()
        
        await collection.replace_one(
            {'session_id': context['session_id']},
            context,
            upsert=True
        )
        
        logger.info(f"Stored conversation context for session {context['session_id']}")
        await client.close()
        
    except Exception as e:
        logger.error(f"Error storing conversation context: {e}")

# =============================================================================
# Context Builder Helper Functions
# =============================================================================

def _generate_insights_from_dna(financial_dna: Dict) -> List[str]:
    """Generate key insights about the financial journey"""
    insights = []
    
    discipline_score = financial_dna.get('financial_discipline_score', 0)
    if discipline_score > 80:
        insights.append("Your exceptional financial discipline was the cornerstone of your wealth building")
    
    savings_rate = financial_dna.get('savings_rate', 0)
    if savings_rate > 25:
        insights.append("Your aggressive savings strategy in early years created massive compound growth")
    
    diversification = financial_dna.get('investment_diversification', {})
    if len(diversification) >= 3:
        insights.append("Your diversified investment approach protected and grew your wealth consistently")
    
    return insights

def _generate_personality_traits_from_dna(financial_dna: Dict) -> List[str]:
    """Generate personality traits based on financial behavior"""
    traits = []
    
    risk_profile = financial_dna.get('risk_profile', 'moderate')
    if risk_profile == 'aggressive':
        traits.extend(['Calculated risk-taker', 'Growth-oriented', 'Confident in long-term vision'])
    elif risk_profile == 'conservative':
        traits.extend(['Prudent and cautious', 'Security-focused', 'Patient wealth builder'])
    else:
        traits.extend(['Balanced approach', 'Strategic thinker', 'Adaptable to changing conditions'])
    
    discipline_score = financial_dna.get('financial_discipline_score', 0)
    if discipline_score > 80:
        traits.append('Highly disciplined and goal-oriented')
    
    return traits

def _generate_future_scenarios_from_dna(financial_dna: Dict) -> Dict[str, List[str]]:
    """Generate future scenarios for different timelines"""
    return {
        '30_years': [
            'Achieved major financial milestones',
            'Navigated multiple market cycles successfully',
            'Built substantial wealth for family security'
        ],
        '50_years': [
            'Reached financial independence',
            'Mentoring others on wealth building',
            'Enjoying fruits of long-term planning'
        ],
        '60_years': [
            'Legacy wealth established',
            'Philanthropic activities',
            'Wisdom from decades of financial experience'
        ]
    }

def _build_context_from_dna(financial_dna: Dict) -> Dict[str, Any]:
    """Build comprehensive conversation context"""
    
    conversation_prompts = [
        "What financial decisions are you most proud of?",
        "How did your investment strategy evolve over the years?",
        "What would you tell your younger self about money management?",
        "How did you navigate major market downturns?",
        "What role did financial discipline play in your wealth building?",
        "How did you balance risk and security in your investments?",
        "What unexpected financial challenges did you overcome?",
        "How did your relationship with money change over time?",
        "What legacy are you building for future generations?",
        "How did you maintain your financial goals during life changes?"
    ]
    
    key_insights = _generate_insights_from_dna(financial_dna)
    personality_traits = _generate_personality_traits_from_dna(financial_dna)
    future_scenarios = _generate_future_scenarios_from_dna(financial_dna)
    
    return {
        'session_id': financial_dna['session_id'],
        'user_id': financial_dna['user_id'],
        'conversation_prompts': conversation_prompts,
        'key_insights': key_insights,
        'personality_traits': personality_traits,
        'future_scenarios': future_scenarios,
        'timeline_contexts': {
            '30_years': financial_dna['projection_30_years'],
            '50_years': financial_dna['projection_50_years'],
            '60_years': financial_dna['projection_60_years']
        },
        'created_at': datetime.now(timezone.utc)
    }

# =============================================================================
# Manual Function Declaration Approach
# =============================================================================

def simple_build_dna(data):
    """Build DNA"""
    try:
        logger.info("Building Financial DNA...")
        session_id = f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Store minimal data in MongoDB
        asyncio.create_task(_store_simple_dna(session_id, data))
        
        return f"DNA built for {session_id}"
    except Exception as e:
        return f"Error: {e}"

def simple_build_context(session_id):
    """Build context"""
    try:
        logger.info(f"Building context for {session_id}")
        
        # Store minimal context
        asyncio.create_task(_store_simple_context(session_id))
        
        return f"Context built for {session_id}"
    except Exception as e:
        return f"Error: {e}"

async def _store_simple_dna(session_id, data):
    """Store simple DNA in MongoDB"""
    try:
        client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv('MONGODB_URL', 'mongodb://localhost:27017'))
        db = client['financial_future_self']
        collection = db['financial_dna']
        
        dna_doc = {
            'session_id': session_id,
            'user_id': 'user_123',
            'data': str(data),
            'total_net_worth': 150000.0,
            'financial_discipline_score': 80.0,
            'risk_profile': 'moderate',
            'created_at': datetime.now(timezone.utc).isoformat(),
            'status': 'completed'
        }
        
        await collection.replace_one(
            {'session_id': session_id},
            dna_doc,
            upsert=True
        )
        
        logger.info(f"Stored DNA in MongoDB for {session_id}")
        await client.close()
    except Exception as e:
        logger.error(f"MongoDB storage error: {e}")

async def _store_simple_context(session_id):
    """Store simple context in MongoDB"""
    try:
        client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv('MONGODB_URL', 'mongodb://localhost:27017'))
        db = client['financial_future_self']
        collection = db['conversation_context']
        
        context_doc = {
            'session_id': session_id,
            'user_id': 'user_123',
            'conversation_prompts': [
                "What financial decisions are you most proud of?",
                "How did your investment strategy evolve?",
                "What would you tell your younger self about money?"
            ],
            'timeline_contexts': {
                '30_years': {'projected_net_worth': 1500000, 'milestones': ['Financial independence']},
                '50_years': {'projected_net_worth': 5000000, 'milestones': ['Retirement ready']},
                '60_years': {'projected_net_worth': 8000000, 'milestones': ['Legacy wealth']}
            },
            'created_at': datetime.now(timezone.utc).isoformat(),
            'status': 'completed'
        }
        
        await collection.replace_one(
            {'session_id': session_id},
            context_doc,
            upsert=True
        )
        
        logger.info(f"Stored context in MongoDB for {session_id}")
        await client.close()
    except Exception as e:
        logger.error(f"MongoDB context storage error: {e}")

# Create manual function declarations to bypass Google AI parsing issues
from google.adk.tools import FunctionTool
from google.genai import types

def create_manual_dna_tool():
    """Create DNA tool with manual declaration"""
    
    declaration = types.FunctionDeclaration(
        name="build_dna",
        description="Build Financial DNA from data",
        parameters=types.Schema(
            type=types.Type.OBJECT,
            properties={
                "data": types.Schema(
                    type=types.Type.STRING,
                    description="Financial data to process"
                )
            },
            required=["data"]
        )
    )
    
    tool = FunctionTool(simple_build_dna)
    tool._declaration = declaration
    return tool

def create_manual_context_tool():
    """Create context tool with manual declaration"""
    
    declaration = types.FunctionDeclaration(
        name="build_context", 
        description="Build conversation context",
        parameters=types.Schema(
            type=types.Type.OBJECT,
            properties={
                "session_id": types.Schema(
                    type=types.Type.STRING,
                    description="Session identifier"
                )
            },
            required=["session_id"]
        )
    )
    
    tool = FunctionTool(simple_build_context)
    tool._declaration = declaration
    return tool

def build_conversation_context(session_id: str) -> str:
    """Build conversation context and prompts for future financial self based on Financial DNA"""
    try:
        # Retrieve Financial DNA from MongoDB
        financial_dna = asyncio.run(get_financial_dna_from_mongodb(session_id))
        
        if not financial_dna:
            return f"No Financial DNA found for session {session_id}"
        
        # Build conversation context
        conversation_context = _build_context_from_dna(financial_dna)
        
        # Store context in MongoDB
        asyncio.run(store_conversation_context(conversation_context))
        
        return f"Successfully built conversation context for session {session_id}"
        
    except Exception as e:
        logger.error(f"Error building conversation context: {e}")
        return f"Error building conversation context: {str(e)}"

# =============================================================================
# Agent Setup
# =============================================================================

async def create_financial_dna_agent():
    """Create the main financial DNA building agent"""
    
    try:
        print("🔧 Creating Financial DNA agent...")
        
        # Create custom tools that bypass automatic function parsing
        print("🛠️ Creating custom tools...")
        dna_tool = CustomDNATool()
        context_tool = CustomContextTool()
        print("✅ Custom tools created")
        
        # Check if we should use MCP
        test_mode = os.getenv("TEST_MODE", "false").lower() == "true"
        tools_list = [dna_tool, context_tool]
        fi_mcp_toolset = None
        
        if not test_mode:
            # Create MCPToolset for Fi MCP server
            try:
                print("🌐 Creating Fi MCP toolset...")
                fi_mcp_toolset = MCPToolset(
                    connection_params=StreamableHTTPServerParams(
                        url="http://localhost:8080/mcp/stream"
                    )
                )
                tools_list.insert(0, fi_mcp_toolset)
                print("✅ Fi MCP toolset created")
            except Exception as mcp_error:
                print(f"⚠️ Fi MCP toolset failed: {mcp_error}")
                print("📝 Proceeding with local tools only...")
        else:
            print("🧪 Test mode: skipping Fi MCP toolset")
        
        print(f"🔧 Creating agent with {len(tools_list)} tools...")
        
        # Create the main agent
        root_agent = LlmAgent(
            model=os.getenv('GEMINI_MODEL', 'gemini-2.0-flash'),
            name='dna_builder',
            instruction="""You help build Financial DNA and conversation context.

Workflow:
1. If Fi MCP tools are available, try to fetch financial data from sources like:
   - fetch_net_worth
   - fetch_credit_report
   - fetch_epf_details
   - fetch_mf_transactions
   - fetch_bank_transactions

2. Call build_dna with any data you collected (use empty string if no data available)

3. Call build_context with the session ID from the user's message

Handle authentication requests gracefully and keep responses direct.""",
            description="Builds Financial DNA and context",
            tools=tools_list
        )
        
        print("✅ Agent created successfully")
        return root_agent, fi_mcp_toolset
        
    except Exception as e:
        logger.error(f"Agent creation error: {e}")
        print(f"❌ Agent creation failed: {e}")
        import traceback
        traceback.print_exc()
        raise

# =============================================================================
# Execution Function
# =============================================================================

async def process_financial_dna(session_id, user_id):
    """Process financial DNA building for a given session"""
    
    try:
        print(f"📋 Starting process for session: {session_id}")
        
        # Create services
        session_service = InMemorySessionService()
        
        # Create session
        session = await session_service.create_session(
            state={'session_id': session_id, 'user_id': user_id}, 
            app_name='dna_builder',
            user_id=user_id,
            session_id=session_id
        )
        print(f"✅ Session created: {session.id}")
        
        # Create the agent
        root_agent, fi_mcp_toolset = await create_financial_dna_agent()
        print("✅ Agent created successfully")
        
        # Create runner
        runner = Runner(
            app_name='dna_builder',
            agent=root_agent,
            session_service=session_service,
        )
        print("✅ Runner created")
        
        # Simple query
        query = f"Build Financial DNA for session {session_id} and user {user_id}. Try to fetch data and build the DNA."
        
        print("🚀 Starting agent execution...")
        print("="*60)
        
        # Format input
        content = types.Content(role='user', parts=[types.Part(text=query)])
        
        # Run the agent
        events_async = runner.run_async(
            session_id=session.id,
            user_id=session.user_id,
            new_message=content
        )
        
        event_count = 0
        async for event in events_async:
            event_count += 1
            print(f"📨 Event {event_count}: {event}")
            
            # Stop after too many events to prevent infinite loops
            if event_count > 20:
                print("⚠️ Too many events, stopping...")
                break
        
        print("="*60)
        print("✅ Financial DNA processing completed!")
        
    except Exception as e:
        logger.error(f"Error in process_financial_dna: {e}")
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        # Cleanup
        if 'fi_mcp_toolset' in locals() and fi_mcp_toolset:
            try:
                await fi_mcp_toolset.close()
                print("🧹 Cleanup completed")
            except Exception as cleanup_error:
                print(f"⚠️ Cleanup error: {cleanup_error}")

# =============================================================================
# Main Execution
# =============================================================================

async def test_fi_mcp_connection():
    """Test connection to Fi MCP server"""
    try:
        import aiohttp
        async with aiohttp.ClientSession() as session:
            async with session.get("http://localhost:8080/health") as response:
                if response.status == 200:
                    print("✅ Fi MCP server is running and accessible")
                    return True
                else:
                    print(f"⚠️ Fi MCP server responded with status: {response.status}")
                    return False
    except Exception as e:
        print(f"❌ Cannot connect to Fi MCP server: {e}")
        print("Please ensure Fi MCP dev server is running on http://localhost:8080")
        return False

async def main():
    """Main execution function"""
    
    # Check required environment variables
    if not os.getenv("GOOGLE_API_KEY"):
        raise ValueError("GOOGLE_API_KEY environment variable not set")
    
    # Set default MongoDB URL if not provided
    if not os.getenv("MONGODB_URL"):
        os.environ["MONGODB_URL"] = "mongodb://localhost:27017"
    
    # Generate session ID or use provided one
    session_id = os.getenv("SESSION_ID", f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
    user_id = os.getenv("USER_ID", "user_123")
    
    print("🚀 Starting Financial DNA Builder")
    print(f"📍 Session: {session_id}")
    print(f"👤 User: {user_id}")
    print(f"🗄️ MongoDB: {os.getenv('MONGODB_URL')}")
    print(f"🌐 Fi MCP: http://localhost:8080/mcp/stream")
    print("="*60)
    
    # Test mode - set TEST_MODE=true to skip MCP
    test_mode = os.getenv("TEST_MODE", "false").lower() == "true"
    if test_mode:
        print("🧪 Running in TEST MODE (no Fi MCP)")
    
    # Test Fi MCP connection if not in test mode
    if not test_mode:
        print("🔍 Testing Fi MCP server connection...")
        mcp_available = await test_fi_mcp_connection()
        
        if not mcp_available:
            print("\n⚠️ Fi MCP server not available")
            print("💡 Set TEST_MODE=true to run without Fi MCP")
            print("🔧 Or start Fi MCP server:")
            print("   git clone https://github.com/epiFi/fi-mcp-dev")
            print("   cd fi-mcp-dev && FI_MCP_PORT=8080 go run .")
            print("\n🔄 Continuing anyway...\n")
    
    # Process the financial DNA
    await process_financial_dna(session_id, user_id)

if __name__ == "__main__":
    asyncio.run(main())