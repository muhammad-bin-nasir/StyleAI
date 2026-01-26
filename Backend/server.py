import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import json

# --- CONFIG ---
GROQ_API_KEY = "" # <--- Keep your key here!
client = Groq(api_key=GROQ_API_KEY)

app = Flask(__name__)
CORS(app) 

# --- WEATHER SERVICE ---
def get_weather(location, time_of_day="Morning"):
    loc_lower = location.lower()
    time_lower = time_of_day.lower()
    
    # Check if it's dark outside
    is_night = "night" in time_lower or "evening" in time_lower

    if "london" in loc_lower or "uk" in loc_lower:
        return "Rainy, 12°C" if not is_night else "Misty Night, 10°C"
    
    elif "dubai" in loc_lower or "uae" in loc_lower:
        return "Sunny, 40°C" if not is_night else "Clear Night, 28°C"
    
    elif "paris" in loc_lower:
        return "Cloudy, 18°C" if not is_night else "Chilly Breeze, 14°C"
    
    else:
        return "Clear Sky, 25°C" if not is_night else "Starry, 20°C"

# --- AI INTEGRATION (Updated Prompt) ---
def ask_groq(profile, context, weather):
    # You can use "llama-3.3-70b-versatile" or "llama3-8b-8192"
    model_id = "llama-3.3-70b-versatile" 

    prompt = f"""
    You are a professional fashion stylist API.
    
    USER DATA:
    - Gender: {profile.get('gender', 'N/A')}
    - Style: {profile.get('style', 'Casual')}
    
    SCENARIO:
    - Location: {context.get('location', 'Unknown')}
    - Occasion: {context.get('occasion', 'General')}
    - Time of Day: {context.get('time', 'Day')}
    - Weather Condition: {weather}
    
    STRICT INSTRUCTIONS:
    1. Generate exactly 3 distinct outfit options.
    2. CLOTHING MUST MATCH THE WEATHER. 
       - If {weather} implies rain, suggest waterproof layers.
       - If {weather} implies heat, suggest breathable fabrics (linen, cotton).
       - If {weather} implies cold, suggest wool/layers.
    3. Adjust for Time of Day (e.g., darker colors for Night, fresher looks for Morning).

    RESPONSE FORMAT:
    Return ONLY a raw JSON array. No markdown.
    [
      {{
        "id": 1,
        "title": "Outfit Name",
        "description": "Short explanation of why this fits the weather/occasion.",
        "items": ["Item 1", "Item 2", "Item 3", "Item 4"],
        "image": "https://via.placeholder.com/300"
      }}
    ]
    """

    try:
        print(f"--- Asking Groq for {context['location']} ({weather}) ---")
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=model_id,
        )
        response_text = chat_completion.choices[0].message.content
        
        # Clean up Markdown wrappers if AI adds them
        clean_text = response_text.replace("```json", "").replace("```", "").strip()
        
        return json.loads(clean_text)

    except Exception as e:
        print(f"!!! GROQ ERROR: {e} !!!")
        return []

@app.route('/api/recommend', methods=['POST'])
def recommend():
    data = request.json
    user_profile = data.get('userProfile', {})
    context_data = data.get('contextData', {})
    
    # Get Weather based on Location AND Time
    time_of_day = context_data.get('time', 'Day')
    weather = get_weather(context_data.get('location', ''), time_of_day)
    
    recommendations = ask_groq(user_profile, context_data, weather)
    
    return jsonify({
        "weather_summary": weather,
        "recommendations": recommendations
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

