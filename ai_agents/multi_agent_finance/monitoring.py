import logging
import time
import asyncio
from typing import Dict, Any, List
from datetime import datetime, timedelta
from dataclasses import dataclass, field

@dataclass
class AgentMetrics:
    """Metrics for individual agents"""
    agent_name: str
    total_requests: int = 0
    successful_requests: int = 0
    failed_requests: int = 0
    avg_response_time: float = 0.0
    last_request_time: datetime = field(default_factory=datetime.now)
    error_rate: float = 0.0

class SystemMonitor:
    """Production monitoring and metrics collection"""
    
    def __init__(self):
        self.agent_metrics: Dict[str, AgentMetrics] = {}
        self.system_start_time = datetime.now()
        self.health_status = "healthy"
        
    def record_agent_request(self, agent_name: str, success: bool, response_time: float):
        """Record metrics for agent requests"""
        if agent_name not in self.agent_metrics:
            self.agent_metrics[agent_name] = AgentMetrics(agent_name=agent_name)
        
        metrics = self.agent_metrics[agent_name]
        metrics.total_requests += 1
        metrics.last_request_time = datetime.now()
        
        if success:
            metrics.successful_requests += 1
        else:
            metrics.failed_requests += 1
        
        # Update averages
        metrics.avg_response_time = (
            (metrics.avg_response_time * (metrics.total_requests - 1) + response_time) 
            / metrics.total_requests
        )
        
        metrics.error_rate = metrics.failed_requests / metrics.total_requests
    
    def get_system_metrics(self) -> Dict[str, Any]:
        """Get comprehensive system metrics"""
        uptime = datetime.now() - self.system_start_time
        
        return {
            "system": {
                "status": self.health_status,
                "uptime_seconds": uptime.total_seconds(),
                "uptime_human": str(uptime),
                "start_time": self.system_start_time.isoformat()
            },
            "agents": {
                name: {
                    "total_requests": metrics.total_requests,
                    "success_rate": (metrics.successful_requests / max(metrics.total_requests, 1)) * 100,
                    "error_rate": metrics.error_rate * 100,
                    "avg_response_time": metrics.avg_response_time,
                    "last_request": metrics.last_request_time.isoformat()
                }
                for name, metrics in self.agent_metrics.items()
            }
        }
    
    async def health_check(self) -> Dict[str, Any]:
        """Comprehensive health check"""
        try:
            metrics = self.get_system_metrics()
            
            # Determine overall health
            healthy = True
            issues = []
            
            for agent_name, agent_metrics in metrics["agents"].items():
                if agent_metrics["error_rate"] > 50:  # 50% error rate threshold
                    healthy = False
                    issues.append(f"{agent_name} has high error rate: {agent_metrics['error_rate']:.1f}%")
                
                if agent_metrics["avg_response_time"] > 30:  # 30 second threshold
                    issues.append(f"{agent_name} has slow response time: {agent_metrics['avg_response_time']:.1f}s")
            
            self.health_status = "healthy" if healthy else "degraded"
            
            return {
                "status": self.health_status,
                "timestamp": datetime.now().isoformat(),
                "issues": issues,
                "metrics": metrics
            }
            
        except Exception as e:
            self.health_status = "unhealthy"
            return {
                "status": "unhealthy",
                "timestamp": datetime.now().isoformat(),
                "error": str(e)
            }

# Global monitor instance
monitor = SystemMonitor()