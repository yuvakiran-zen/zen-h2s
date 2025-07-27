import os
from typing import Dict, Any
from dataclasses import dataclass

@dataclass
class SystemConfig:
    """Centralized configuration management"""
    
    # API Configuration
    google_api_key: str = os.getenv("GOOGLE_API_KEY", "")
    use_vertex_ai: bool = os.getenv("GOOGLE_GENAI_USE_VERTEXAI", "FALSE").upper() == "TRUE"
    gcp_project: str = os.getenv("GOOGLE_CLOUD_PROJECT", "") 
    gcp_location: str = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")
    
    # MCP Configuration
    mcp_server_url: str = os.getenv("MCP_SERVER_URL", "http://localhost:8080/mcp/stream")
    mcp_timeout: int = int(os.getenv("MCP_SERVER_TIMEOUT", "30"))
    mcp_max_retries: int = int(os.getenv("MCP_MAX_RETRIES", "3"))
    
    # Performance Configuration
    max_concurrent_fetches: int = 6
    data_cache_ttl: int = int(os.getenv("DATA_CACHE_TTL", "300"))
    error_threshold: float = float(os.getenv("ERROR_THRESHOLD", "0.5"))
    
    # Monitoring Configuration
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    monitoring_enabled: bool = os.getenv("MONITORING_ENABLED", "true").lower() == "true"
    health_check_interval: int = int(os.getenv("HEALTH_CHECK_INTERVAL", "60"))
    
    def validate(self) -> bool:
        """Validate configuration"""
        if not self.google_api_key and not self.use_vertex_ai:
            raise ValueError("Either GOOGLE_API_KEY or Vertex AI configuration must be provided")
        
        if self.use_vertex_ai and not self.gcp_project:
            raise ValueError("GCP_PROJECT must be provided when using Vertex AI")
        
        return True

# Global configuration instance
config = SystemConfig()