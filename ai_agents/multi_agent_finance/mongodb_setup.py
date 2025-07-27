#!/usr/bin/env python3
"""
MongoDB Setup and Configuration Script
File: multi_agent_finance/mongodb_setup.py

This script helps set up MongoDB for the financial multi-agent system.
It creates the necessary database, collection, and indexes for optimal performance.
"""

import os
import logging
from typing import Dict, Any, Optional
from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from datetime import datetime

# Configuration
DEFAULT_MONGO_CONFIG = {
    "connection_string": "mongodb://localhost:27017/",
    "database_name": "financial_system",
    "collection_name": "user_financial_summaries"
}

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MongoDBSetup:
    """MongoDB setup and configuration utility"""
    
    def __init__(self, config: Dict[str, str] = None):
        self.config = config or DEFAULT_MONGO_CONFIG
        self.client = None
        self.database = None
        self.collection = None
    
    def connect(self) -> bool:
        """Establish connection to MongoDB"""
        try:
            logger.info(f"Connecting to MongoDB at {self.config['connection_string']}")
            self.client = MongoClient(
                self.config["connection_string"],
                serverSelectionTimeoutMS=10000  # 10 second timeout
            )
            
            # Test the connection
            self.client.admin.command('ping')
            logger.info("MongoDB connection successful")
            
            self.database = self.client[self.config["database_name"]]
            self.collection = self.database[self.config["collection_name"]]
            
            return True
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            return False
    
    def create_database_and_collection(self) -> bool:
        """Create database and collection if they don't exist"""
        try:
            # MongoDB creates databases and collections lazily, so we insert a temporary document
            temp_doc = {
                "_setup": True,
                "created_at": datetime.now(),
                "message": "Database and collection setup completed"
            }
            
            result = self.collection.insert_one(temp_doc)
            logger.info(f"Database '{self.config['database_name']}' and collection '{self.config['collection_name']}' created")
            
            # Remove the temporary document
            self.collection.delete_one({"_id": result.inserted_id})
            
            return True
        except Exception as e:
            logger.error(f"Failed to create database and collection: {e}")
            return False
    
    def create_indexes(self) -> bool:
        """Create performance-optimized indexes"""
        try:
            # Create index on user_id for fast lookups
            self.collection.create_index(
                [("user_id", ASCENDING)],
                unique=True,
                name="user_id_unique"
            )
            logger.info("Created unique index on user_id")
            
            # Create index on timestamp for chronological queries
            self.collection.create_index(
                [("timestamp", DESCENDING)],
                name="timestamp_desc"
            )
            logger.info("Created descending index on timestamp")
            
            # Create compound index for user queries with timestamp
            self.collection.create_index(
                [("user_id", ASCENDING), ("timestamp", DESCENDING)],
                name="user_timestamp"
            )
            logger.info("Created compound index on user_id and timestamp")
            
            # Create index on financial_health_score for analytics
            self.collection.create_index(
                [("financial_health_score", DESCENDING)],
                name="health_score_desc"
            )
            logger.info("Created descending index on financial_health_score")
            
            # Create text index for searching in summaries
            self.collection.create_index(
                [
                    ("financial_overview", "text"),
                    ("recommendations", "text"),
                    ("net_worth_summary", "text"),
                    ("investment_summary", "text"),
                    ("spending_patterns", "text")
                ],
                name="text_search_index"
            )
            logger.info("Created text search index for financial summaries")
            
            return True
        except Exception as e:
            logger.error(f"Failed to create indexes: {e}")
            return False
    
    def verify_setup(self) -> Dict[str, Any]:
        """Verify the MongoDB setup is working correctly"""
        verification_results = {
            "connection": False,
            "database_exists": False,
            "collection_exists": False,
            "indexes_count": 0,
            "sample_insert_test": False,
            "sample_query_test": False
        }
        
        try:
            # Test connection
            self.client.admin.command('ping')
            verification_results["connection"] = True
            logger.info("✓ Connection test passed")
            
            # Check if database exists
            if self.config["database_name"] in self.client.list_database_names():
                verification_results["database_exists"] = True
                logger.info(f"✓ Database '{self.config['database_name']}' exists")
            
            # Check if collection exists
            if self.config["collection_name"] in self.database.list_collection_names():
                verification_results["collection_exists"] = True
                logger.info(f"✓ Collection '{self.config['collection_name']}' exists")
            
            # Count indexes
            indexes = list(self.collection.list_indexes())
            verification_results["indexes_count"] = len(indexes)
            logger.info(f"✓ Found {len(indexes)} indexes")
            
            # Test sample insert
            test_doc = {
                "user_id": "test_user_setup",
                "financial_overview": "Test setup verification",
                "key_metrics": {"test": True},
                "net_worth_summary": "Test",
                "investment_summary": "Test",
                "spending_patterns": "Test",
                "financial_health_score": 100.0,
                "recommendations": ["Test recommendation"],
                "timestamp": datetime.now().isoformat(),
                "data_sources": ["setup_test"]
            }
            
            result = self.collection.insert_one(test_doc)
            if result.inserted_id:
                verification_results["sample_insert_test"] = True
                logger.info("✓ Sample insert test passed")
                
                # Test sample query
                found_doc = self.collection.find_one({"user_id": "test_user_setup"})
                if found_doc:
                    verification_results["sample_query_test"] = True
                    logger.info("✓ Sample query test passed")
                
                # Clean up test document
                self.collection.delete_one({"_id": result.inserted_id})
                logger.info("✓ Test document cleaned up")
        
        except Exception as e:
            logger.error(f"Verification failed: {e}")
        
        # Summary
        passed_tests = sum(1 for v in verification_results.values() if v is True)
        total_tests = len([k for k, v in verification_results.items() if isinstance(v, bool)])
        
        logger.info(f"Setup verification completed: {passed_tests}/{total_tests} tests passed")
        
        return verification_results
    
    def get_collection_stats(self) -> Dict[str, Any]:
        """Get collection statistics"""
        try:
            stats = self.database.command("collStats", self.config["collection_name"])
            return {
                "count": stats.get("count", 0),
                "size": stats.get("size", 0),
                "average_size": stats.get("avgObjSize", 0),
                "storage_size": stats.get("storageSize", 0),
                "indexes": stats.get("nindexes", 0),
                "total_index_size": stats.get("totalIndexSize", 0)
            }
        except Exception as e:
            logger.error(f"Failed to get collection stats: {e}")
            return {}
    
    def close(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")

def setup_mongodb(config: Dict[str, str] = None) -> bool:
    """Main setup function"""
    logger.info("Starting MongoDB setup for Financial Multi-Agent System")
    
    setup = MongoDBSetup(config)
    
    # Connect to MongoDB
    if not setup.connect():
        logger.error("Setup failed: Could not connect to MongoDB")
        return False
    
    # Create database and collection
    if not setup.create_database_and_collection():
        logger.error("Setup failed: Could not create database and collection")
        return False
    
    # Create indexes
    if not setup.create_indexes():
        logger.error("Setup failed: Could not create indexes")
        return False
    
    # Verify setup
    verification_results = setup.verify_setup()
    
    # Get collection stats
    stats = setup.get_collection_stats()
    if stats:
        logger.info(f"Collection statistics: {stats}")
    
    setup.close()
    
    # Check if setup was successful
    success = all([
        verification_results.get("connection", False),
        verification_results.get("database_exists", False),
        verification_results.get("collection_exists", False),
        verification_results.get("sample_insert_test", False),
        verification_results.get("sample_query_test", False)
    ])
    
    if success:
        logger.info("✅ MongoDB setup completed successfully!")
        logger.info("Your financial multi-agent system is ready to store user summaries.")
    else:
        logger.error("❌ MongoDB setup failed. Please check the errors above.")
    
    return success

if __name__ == "__main__":
    # Get MongoDB configuration from environment variables or use defaults
    mongo_config = {
        "connection_string": os.getenv("MONGODB_CONNECTION_STRING", DEFAULT_MONGO_CONFIG["connection_string"]),
        "database_name": os.getenv("MONGODB_DATABASE", DEFAULT_MONGO_CONFIG["database_name"]),
        "collection_name": os.getenv("MONGODB_COLLECTION", DEFAULT_MONGO_CONFIG["collection_name"])
    }
    
    print("Financial Multi-Agent System - MongoDB Setup")
    print("="*50)
    print(f"Connection String: {mongo_config['connection_string']}")
    print(f"Database: {mongo_config['database_name']}")
    print(f"Collection: {mongo_config['collection_name']}")
    print("="*50)
    
    success = setup_mongodb(mongo_config)
    
    if success:
        print("\n🎉 Setup completed! You can now run your financial multi-agent system.")
    else:
        print("\n💥 Setup failed! Please check the logs and fix any issues.")
