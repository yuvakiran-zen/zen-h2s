#!/usr/bin/env python3
"""
MongoDB Query Utilities for Financial System
File: multi_agent_finance/query_utils.py

Utilities for querying and analyzing stored financial summaries.
"""

import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dataclasses import asdict
import json

from .agent import UserFinancialSummary, MONGO_CONFIG

logger = logging.getLogger(__name__)

class FinancialQueryManager:
    """Manages complex queries on stored financial summaries"""
    
    def __init__(self, config: Dict[str, str] = None):
        self.config = config or MONGO_CONFIG
        self.client = None
        self.database = None
        self.collection = None
        self._connect()
    
    def _connect(self):
        """Establish MongoDB connection"""
        try:
            self.client = MongoClient(
                self.config["connection_string"],
                serverSelectionTimeoutMS=5000
            )
            self.client.admin.command('ping')
            self.database = self.client[self.config["database_name"]]
            self.collection = self.database[self.config["collection_name"]]
            logger.info("Connected to MongoDB for querying")
        except ConnectionFailure as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise
    
    def get_user_financial_history(self, user_id: str, days: int = 30) -> List[UserFinancialSummary]:
        """Get user's financial history for the last N days"""
        try:
            cutoff_date = datetime.now() - timedelta(days=days)
            
            cursor = self.collection.find({
                "user_id": user_id,
                "timestamp": {"$gte": cutoff_date.isoformat()}
            }).sort("timestamp", -1)
            
            summaries = []
            for doc in cursor:
                doc.pop('_id', None)
                summaries.append(UserFinancialSummary(**doc))
            
            return summaries
        except Exception as e:
            logger.error(f"Failed to get user history: {e}")
            return []
    
    def search_financial_summaries(self, search_text: str, limit: int = 10) -> List[UserFinancialSummary]:
        """Search financial summaries using text search"""
        try:
            cursor = self.collection.find(
                {"$text": {"$search": search_text}},
                {"score": {"$meta": "textScore"}}
            ).sort([("score", {"$meta": "textScore"})]).limit(limit)
            
            summaries = []
            for doc in cursor:
                doc.pop('_id', None)
                doc.pop('score', None)  # Remove search score
                summaries.append(UserFinancialSummary(**doc))
            
            return summaries
        except Exception as e:
            logger.error(f"Failed to search summaries: {e}")
            return []
    
    def get_users_by_health_score_range(self, min_score: float, max_score: float) -> List[UserFinancialSummary]:
        """Get users within a specific financial health score range"""
        try:
            cursor = self.collection.find({
                "financial_health_score": {
                    "$gte": min_score,
                    "$lte": max_score
                }
            }).sort("financial_health_score", -1)
            
            summaries = []
            for doc in cursor:
                doc.pop('_id', None)
                summaries.append(UserFinancialSummary(**doc))
            
            return summaries
        except Exception as e:
            logger.error(f"Failed to get users by health score: {e}")
            return []
    
    def get_top_performing_users(self, limit: int = 10) -> List[UserFinancialSummary]:
        """Get top performing users by financial health score"""
        return self.get_users_by_health_score_range(80.0, 100.0)[:limit]
    
    def get_users_needing_attention(self, limit: int = 10) -> List[UserFinancialSummary]:
        """Get users with low financial health scores who need attention"""
        return self.get_users_by_health_score_range(0.0, 50.0)[:limit]
    
    def get_financial_analytics(self) -> Dict[str, Any]:
        """Get comprehensive analytics on all stored financial summaries"""
        try:
            # Aggregation pipeline for analytics
            pipeline = [
                {
                    "$group": {
                        "_id": None,
                        "total_users": {"$sum": 1},
                        "avg_health_score": {"$avg": "$financial_health_score"},
                        "max_health_score": {"$max": "$financial_health_score"},
                        "min_health_score": {"$min": "$financial_health_score"},
                        "users_over_80": {
                            "$sum": {
                                "$cond": [{"$gte": ["$financial_health_score", 80]}, 1, 0]
                            }
                        },
                        "users_under_50": {
                            "$sum": {
                                "$cond": [{"$lt": ["$financial_health_score", 50]}, 1, 0]
                            }
                        }
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "total_users": 1,
                        "avg_health_score": {"$round": ["$avg_health_score", 2]},
                        "max_health_score": 1,
                        "min_health_score": 1,
                        "users_over_80": 1,
                        "users_under_50": 1,
                        "healthy_users_percentage": {
                            "$round": [
                                {"$multiply": [
                                    {"$divide": ["$users_over_80", "$total_users"]},
                                    100
                                ]},
                                2
                            ]
                        },
                        "at_risk_users_percentage": {
                            "$round": [
                                {"$multiply": [
                                    {"$divide": ["$users_under_50", "$total_users"]},
                                    100
                                ]},
                                2
                            ]
                        }
                    }
                }
            ]
            
            result = list(self.collection.aggregate(pipeline))
            
            if result:
                analytics = result[0]
                analytics["timestamp"] = datetime.now().isoformat()
                return analytics
            else:
                return {
                    "total_users": 0,
                    "avg_health_score": 0.0,
                    "message": "No data available",
                    "timestamp": datetime.now().isoformat()
                }
        
        except Exception as e:
            logger.error(f"Failed to get analytics: {e}")
            return {"error": str(e)}
    
    def get_common_recommendations(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get most common financial recommendations across all users"""
        try:
            pipeline = [
                {"$unwind": "$recommendations"},
                {"$group": {
                    "_id": "$recommendations",
                    "count": {"$sum": 1},
                    "users": {"$addToSet": "$user_id"}
                }},
                {"$sort": {"count": -1}},
                {"$limit": limit},
                {"$project": {
                    "recommendation": "$_id",
                    "count": 1,
                    "user_count": {"$size": "$users"},
                    "_id": 0
                }}
            ]
            
            results = list(self.collection.aggregate(pipeline))
            return results
        
        except Exception as e:
            logger.error(f"Failed to get common recommendations: {e}")
            return []
    
    def get_data_source_coverage(self) -> Dict[str, Any]:
        """Analyze which data sources are most/least covered across users"""
        try:
            pipeline = [
                {"$unwind": "$data_sources"},
                {"$group": {
                    "_id": "$data_sources",
                    "user_count": {"$sum": 1},
                    "users": {"$addToSet": "$user_id"}
                }},
                {"$sort": {"user_count": -1}},
                {"$project": {
                    "data_source": "$_id",
                    "user_count": 1,
                    "coverage_percentage": {
                        "$multiply": [
                            {"$divide": ["$user_count", {"$literal": self.get_total_users()}]},
                            100
                        ]
                    },
                    "_id": 0
                }}
            ]
            
            results = list(self.collection.aggregate(pipeline))
            return {
                "data_sources": results,
                "total_users": self.get_total_users(),
                "timestamp": datetime.now().isoformat()
            }
        
        except Exception as e:
            logger.error(f"Failed to get data source coverage: {e}")
            return {"error": str(e)}
    
    def get_total_users(self) -> int:
        """Get total number of unique users"""
        try:
            return self.collection.distinct("user_id").__len__()
        except Exception as e:
            logger.error(f"Failed to get total users: {e}")
            return 0
    
    def export_user_data(self, user_id: str) -> Optional[str]:
        """Export all data for a specific user as JSON"""
        try:
            summaries = self.get_user_financial_history(user_id, days=365)  # Get last year
            
            if not summaries:
                return None
            
            export_data = {
                "user_id": user_id,
                "export_timestamp": datetime.now().isoformat(),
                "total_summaries": len(summaries),
                "summaries": [asdict(summary) for summary in summaries]
            }
            
            return json.dumps(export_data, indent=2)
        
        except Exception as e:
            logger.error(f"Failed to export user data: {e}")
            return None
    
    def get_health_score_distribution(self) -> Dict[str, int]:
        """Get distribution of financial health scores"""
        try:
            pipeline = [
                {
                    "$bucket": {
                        "groupBy": "$financial_health_score",
                        "boundaries": [0, 20, 40, 60, 80, 100],
                        "default": "Other",
                        "output": {
                            "count": {"$sum": 1},
                            "users": {"$push": "$user_id"}
                        }
                    }
                }
            ]
            
            results = list(self.collection.aggregate(pipeline))
            
            distribution = {}
            for bucket in results:
                min_score = bucket["_id"]
                if min_score == "Other":
                    distribution["100+"] = bucket["count"]
                else:
                    max_score = min_score + 20
                    distribution[f"{min_score}-{max_score}"] = bucket["count"]
            
            return distribution
        
        except Exception as e:
            logger.error(f"Failed to get health score distribution: {e}")
            return {}
    
    def close(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            logger.info("Query manager connection closed")

# Utility functions for easy access
def quick_user_lookup(user_id: str) -> Optional[UserFinancialSummary]:
    """Quick utility to lookup a user's latest financial summary"""
    query_manager = FinancialQueryManager()
    try:
        summaries = query_manager.get_user_financial_history(user_id, days=30)
        return summaries[0] if summaries else None
    finally:
        query_manager.close()

def get_system_analytics() -> Dict[str, Any]:
    """Quick utility to get system-wide financial analytics"""
    query_manager = FinancialQueryManager()
    try:
        return query_manager.get_financial_analytics()
    finally:
        query_manager.close()

def search_users(search_term: str) -> List[UserFinancialSummary]:
    """Quick utility to search users by financial content"""
    query_manager = FinancialQueryManager()
    try:
        return query_manager.search_financial_summaries(search_term)
    finally:
        query_manager.close()

if __name__ == "__main__":
    # Example usage and testing
    query_manager = FinancialQueryManager()
    
    try:
        print("Financial Query Manager - Test Run")
        print("=" * 40)
        
        # Get analytics
        analytics = query_manager.get_financial_analytics()
        print(f"System Analytics: {analytics}")
        
        # Get health score distribution
        distribution = query_manager.get_health_score_distribution()
        print(f"Health Score Distribution: {distribution}")
        
        # Get common recommendations
        recommendations = query_manager.get_common_recommendations(5)
        print(f"Top 5 Common Recommendations: {recommendations}")
        
        # Get data source coverage
        coverage = query_manager.get_data_source_coverage()
        print(f"Data Source Coverage: {coverage}")
        
    finally:
        query_manager.close()
