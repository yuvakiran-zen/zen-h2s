import json
import asyncio
from typing import Any, Dict, List, Optional, Union, Callable
from datetime import datetime, timedelta
import functools
import logging

logger = logging.getLogger(__name__)

class DataValidator:
    """Utility class for data validation and sanitization"""
    
    @staticmethod
    def validate_financial_data(data: Dict[str, Any]) -> tuple[bool, List[str]]:
        """Validate financial data structure and content"""
        errors = []
        
        # Basic structure validation
        if not isinstance(data, dict):
            errors.append("Data must be a dictionary")
            return False, errors
        
        # Check for required timestamp
        if "timestamp" not in data:
            errors.append("Missing timestamp field")
        
        # Validate numerical fields
        numerical_fields = ["amount", "balance", "value", "price"]
        for field in numerical_fields:
            if field in data:
                try:
                    float(data[field])
                except (ValueError, TypeError):
                    errors.append(f"Invalid numerical value for {field}: {data[field]}")
        
        return len(errors) == 0, errors
    
    @staticmethod
    def sanitize_sensitive_data(data: Dict[str, Any]) -> Dict[str, Any]:
        """Remove or mask sensitive information"""
        sensitive_fields = [
            "account_number", "card_number", "ssn", "pan", 
            "password", "pin", "secret", "token"
        ]
        
        sanitized = data.copy()
        
        for field in sensitive_fields:
            if field in sanitized:
                if isinstance(sanitized[field], str) and len(sanitized[field]) > 4:
                    # Mask all but last 4 characters
                    sanitized[field] = "*" * (len(sanitized[field]) - 4) + sanitized[field][-4:]
                else:
                    sanitized[field] = "***MASKED***"
        
        return sanitized

def async_retry(max_retries: int = 3, delay: float = 1.0, exponential_backoff: bool = True):
    """Decorator for async function retry logic"""
    def decorator(func: Callable):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            last_exception = None
            
            for attempt in range(max_retries + 1):
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    
                    if attempt == max_retries:
                        logger.error(f"Function {func.__name__} failed after {max_retries} retries: {e}")
                        raise e
                    
                    wait_time = delay * (2 ** attempt) if exponential_backoff else delay
                    logger.warning(f"Attempt {attempt + 1} failed for {func.__name__}: {e}. Retrying in {wait_time}s...")
                    await asyncio.sleep(wait_time)
            
            raise last_exception
        
        return wrapper
    return decorator

def format_currency(amount: float, currency: str = "INR") -> str:
    """Format currency amounts for display"""
    if currency == "INR":
        # Indian formatting
        return f"₹{amount:,.2f}"
    elif currency == "USD":
        return f"${amount:,.2f}"
    else:
        return f"{amount:,.2f} {currency}"

def calculate_time_ago(timestamp: str) -> str:
    """Calculate human-readable time difference"""
    try:
        dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
        now = datetime.now(dt.tzinfo)
        diff = now - dt
        
        if diff.days > 0:
            return f"{diff.days} days ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} hours ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes} minutes ago"
        else:
            return "Just now"
    except Exception:
        return "Unknown"