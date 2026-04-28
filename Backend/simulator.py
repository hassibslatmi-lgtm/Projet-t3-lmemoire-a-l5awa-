import requests
import time
import random

# --- CONFIGURATION ---
BASE_URL = "http://127.0.0.1:8000"
# Get a token from your login response or create a superuser/farmer token
TOKEN = "YOUR_FARMER_OR_ADMIN_TOKEN_HERE" 
ANIMAL_ID = 1  # Change this to an existing animal ID in your database

# Starting coordinates (Set these to a realistic starting point)
# Example: Algiers region
current_lat = 36.7538
current_lng = 3.0588

HEADERS = {
    "Authorization": f"Token {TOKEN}",
    "Content-Type": "application/json"
}

def update_iot_location(animal_id, lat, lng):
    url = f"{BASE_URL}/api/iot/animals/{animal_id}/update-location/"
    payload = {
        "latitude": lat,
        "longitude": lng
    }
    
    try:
        response = requests.patch(url, json=payload, headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            print(f"[{time.strftime('%H:%M:%S')}] ✅ Success!")
            print(f"   📍 New Location: {lat:.5f}, {lng:.5f}")
            print(f"   🚨 Suspicious Movement: {'YES' if data.get('suspicious_movement') else 'No'}")
            if 'distance_moved_km' in data:
                print(f"   📏 Distance: {data['distance_moved_km']:.2f} km")
        elif response.status_code == 401:
            print("❌ Error: Unauthorized. Check your TOKEN.")
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
    except Exception as e:
        print(f"❌ Connection Error: {str(e)}")

def simulate():
    global current_lat, current_lng
    print(f"🚀 Starting Smart Ear Tag Simulator for Animal #{ANIMAL_ID}")
    print("Press Ctrl+C to stop.")
    
    while True:
        # Simulate realistic grazing movement (small random change)
        # 0.0001 is roughly 10 meters
        current_lat += random.uniform(-0.0002, 0.0002)
        current_lng += random.uniform(-0.0002, 0.0002)
        
        # Randomly trigger suspicious movement (5% chance)
        if random.random() < 0.05:
            print("\n⚠️ Simulating a fast move (Truck transport)...")
            current_lat += 0.15  # ~16km jump
            current_lng += 0.15
            
        update_iot_location(ANIMAL_ID, current_lat, current_lng)
        
        # Send update every 10 seconds (adjust as needed)
        time.sleep(10)

if __name__ == "__main__":
    simulate()
