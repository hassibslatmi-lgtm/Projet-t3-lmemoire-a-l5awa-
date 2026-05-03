import os
import requests
import json

# OpenRouter integration
OPENAI_COMPATIBLE_ENDPOINT = os.getenv("AI_ENDPOINT_URL", "https://openrouter.ai/api/v1/chat/completions") 
AI_API_KEY = os.getenv("AI_API_KEY", "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")

def get_weather(location="Algiers"):
    """Fetches free weather data using wttr.in (No API Key needed)"""
    try:
        response = requests.get(f"https://wttr.in/{location}?format=j1")
        if response.status_code == 200:
            data = response.json()
            current = data['current_condition'][0]
            return f"Weather in {location}: {current['temp_C']}°C, {current['weatherDesc'][0]['value']}"
        return "Weather data currently unavailable."
    except Exception:
        return "Weather data currently unavailable."

def query_agribot_ai(system_prompt, context_data, user_message):
    """Queries the AI using an OpenAI-compatible REST API format."""
    
    # Combine system prompt with real-time RAG context
    full_system_prompt = f"{system_prompt}\n\n### CURRENT REAL-TIME DATABASE CONTEXT ###\n{context_data}"
    
    headers = {
        "Authorization": f"Bearer {AI_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8000",
        "X-Title": "AgriGov"
    }
    
    payload = {
        "model": "openai/gpt-oss-120b:free", # The model requested by the user
        "messages": [
            {"role": "system", "content": full_system_prompt},
            {"role": "user", "content": user_message}
        ],
        "temperature": 0.7,
        "max_tokens": 500
    }
    
    try:
        # Check if API Key is missing and return a helpful mock response to not break UI during development
        if not AI_API_KEY:
            return "(DEV MODE) AI_API_KEY is missing. But I received your message: " + user_message

        response = requests.post(OPENAI_COMPATIBLE_ENDPOINT, headers=headers, json=payload, timeout=15)
        response.raise_for_status()
        
        response_data = response.json()
        return response_data['choices'][0]['message']['content']
        
    except requests.exceptions.RequestException as e:
        print(f"AI API Error: {e}")
        return f"I'm sorry, I am having trouble connecting to my AI brain right now. ({str(e)})"
