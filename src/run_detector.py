import os
from services.birdDetector import BirdDetector
import requests
import asyncio
import json
from datetime import datetime

class BirdDetectionService:
    def __init__(self, supabase_url, supabase_key):
        self.detector = BirdDetector()
        self.supabase_url = supabase_url
        self.supabase_key = supabase_key
        
    async def notify_detection(self, detection):
        """Send detection to Supabase Edge Function"""
        headers = {
            "Authorization": f"Bearer {self.supabase_key}",
            "Content-Type": "application/json"
        }
        
        # Upload the image to Supabase Storage
        with open(detection["imageUrl"], "rb") as img_file:
            upload_url = f"{self.supabase_url}/storage/v1/object/public/detections/{os.path.basename(detection['imageUrl'])}"
            files = {"file": img_file}
            response = requests.post(upload_url, headers=headers, files=files)
            if response.status_code == 200:
                detection["imageUrl"] = response.json()["publicUrl"]
        
        # Send notifications through Edge Functions
        endpoints = ["send-email", "send-sms", "send-whatsapp"]
        for endpoint in endpoints:
            try:
                url = f"{self.supabase_url}/functions/v1/{endpoint}"
                response = requests.post(url, headers=headers, json=detection)
                print(f"Notification sent via {endpoint}: {response.status_code}")
            except Exception as e:
                print(f"Error sending {endpoint} notification: {str(e)}")

    async def process_image(self, image_path):
        """Process a single image"""
        result = self.detector.detect_birds(image_path)
        print(f"Found {result['total_birds']} birds in the image")
        
        for detection in result["detections"]:
            print(f"Bird detected with {detection['confidence']}% confidence")
            await self.notify_detection(detection)
        
        return result

    async def monitor_camera(self, camera_id, zone_name):
        """Monitor live camera feed"""
        for detection in self.detector.process_video_stream(camera_id, zone_name):
            print(f"Bird detected in {detection['zone']} with {detection['confidence']}% confidence")
            await self.notify_detection(detection)
            
async def main():
    # Initialize the service with Supabase credentials
    service = BirdDetectionService(
        supabase_url=os.getenv("SUPABASE_URL", "https://uozcfpvkexesggtkfdtg.supabase.co"),
        supabase_key=os.getenv("SUPABASE_ANON_KEY")
    )
    
    # Process a single image
    test_image = "test_image.jpg"  # Replace with your test image path
    if os.path.exists(test_image):
        print("\nProcessing single image:")
        await service.process_image(test_image)
    
    # Monitor live camera feed
    print("\nStarting camera monitoring:")
    await service.monitor_camera(0, "backyard")  # 0 is default camera

if __name__ == "__main__":
    asyncio.run(main())
