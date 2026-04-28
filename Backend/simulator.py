import requests
import time
import random

# --- CONFIGURATION ---
BASE_URL = "http://127.0.0.1:8000"
TOKEN = "e4f5c9a2d1c37ae3201ebb54ee0feb24dc5f1a22" 
ANIMAL_ID = 2  # Updated to ID 2 as requested

# Starting coordinates (Annaba)
current_lat = 36.9000
current_lng = 7.7500

def update_iot_location(animal_id, lat, lng):
    url = f"{BASE_URL}/api/iot/animals/{animal_id}/update-location/"
    payload = {
        "latitude": lat,
        "longitude": lng
    }
    
    headers = {
        "Authorization": f"Token {TOKEN}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.patch(url, json=payload, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            # Explicitly showing which ID was updated in the simulator log
            print(f"[{time.strftime('%H:%M:%S')}] ✅ IoT Update Success (Target ID #{animal_id})!")
            print(f"   🐾 DB Returned ID: {data.get('internal_id', 'Unknown')}")
            print(f"   🌍 Location: {data.get('region', 'Unknown')} ({data.get('location_name', 'Unknown')})")
        elif response.status_code == 404:
            print(f"❌ Error 404: Animal ID #{animal_id} not found in the database.")
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
    except Exception as e:
        print(f"❌ Connection Error: {str(e)}")

def simulate():
    global current_lat, current_lng
    print(f"🚀 AgriGov IoT Simulator: Testing Animal #{ANIMAL_ID} in Annaba")
    print(f"📡 API URL: {BASE_URL}/api/iot/animals/{ANIMAL_ID}/update-location/")
    print("-------------------------------------------------------")
    
    while True:
        # Small movement
        current_lat += random.uniform(-0.0001, 0.0001)
        current_lng += random.uniform(-0.0001, 0.0001)
        
        # Simulate suspicious transport
        if random.random() < 0.05:
            print("\n⚠️ ALERT: Rapid Transport Simulated!")
            current_lat += 0.05
            current_lng += 0.05
            
        update_iot_location(ANIMAL_ID, current_lat, current_lng)
        time.sleep(10)

if __name__ == "__main__":
    simulate()
