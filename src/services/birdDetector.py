import cv2
import numpy as np
from datetime import datetime
import os
import json

class BirdDetector:
    def __init__(self, model_path="models/yolov3.weights", config_path="models/yolov3.cfg", labels_path="models/coco.names"):
        # Load YOLO model
        self.net = cv2.dnn.readNet(model_path, config_path)
        
        # Read class labels
        with open(labels_path, 'r') as f:
            self.classes = [line.strip() for line in f.readlines()]
        
        # Get output layers
        self.layer_names = self.net.getLayerNames()
        self.output_layers = [self.layer_names[i - 1] for i in self.net.getUnconnectedOutLayers()]
        
        # Set detection threshold
        self.confidence_threshold = 0.5
        
    def detect_birds(self, image_path):
        # Read image
        image = cv2.imread(image_path)
        height, width = image.shape[:2]
        
        # Prepare image for YOLO model
        blob = cv2.dnn.blobFromImage(image, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
        self.net.setInput(blob)
        
        # Get detections
        outs = self.net.forward(self.output_layers)
        
        # Initialize lists for detections
        class_ids = []
        confidences = []
        boxes = []
        
        # Process detections
        for out in outs:
            for detection in out:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]
                
                # Filter for birds (class ID 14 in COCO dataset)
                if class_id == 14 and confidence > self.confidence_threshold:
                    # Get bounding box coordinates
                    center_x = int(detection[0] * width)
                    center_y = int(detection[1] * height)
                    w = int(detection[2] * width)
                    h = int(detection[3] * height)
                    
                    # Rectangle coordinates
                    x = int(center_x - w / 2)
                    y = int(center_y - h / 2)
                    
                    boxes.append([x, y, w, h])
                    confidences.append(float(confidence))
                    class_ids.append(class_id)
        
        # Apply non-maximum suppression
        indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)
        
        detections = []
        # Draw bounding boxes and save detection info
        for i in range(len(boxes)):
            if i in indexes:
                x, y, w, h = boxes[i]
                confidence = confidences[i]
                
                # Draw bounding box
                cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)
                cv2.putText(image, f'Bird {confidence:.2f}', (x, y - 10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                
                # Save detection info
                detection = {
                    "confidence": round(confidence * 100, 2),
                    "bbox": [x, y, w, h],
                    "timestamp": datetime.now().isoformat()
                }
                detections.append(detection)
        
        # Save annotated image
        output_path = f"detections/detected_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        os.makedirs("detections", exist_ok=True)
        cv2.imwrite(output_path, image)
        
        return {
            "detections": detections,
            "image_path": output_path,
            "total_birds": len(indexes)
        }

    def process_video_stream(self, camera_id, zone_name):
        cap = cv2.VideoCapture(camera_id)
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
                
            # Create blob and get detections
            blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
            self.net.setInput(blob)
            outs = self.net.forward(self.output_layers)
            
            height, width = frame.shape[:2]
            
            # Process detections
            confidences = []
            boxes = []
            
            for out in outs:
                for detection in out:
                    scores = detection[5:]
                    class_id = np.argmax(scores)
                    confidence = scores[class_id]
                    
                    # Filter for birds
                    if class_id == 14 and confidence > self.confidence_threshold:
                        center_x = int(detection[0] * width)
                        center_y = int(detection[1] * height)
                        w = int(detection[2] * width)
                        h = int(detection[3] * height)
                        
                        x = int(center_x - w / 2)
                        y = int(center_y - h / 2)
                        
                        boxes.append([x, y, w, h])
                        confidences.append(float(confidence))
            
            # Apply non-maximum suppression
            indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)
            
            # Process valid detections
            for i in range(len(boxes)):
                if i in indexes:
                    x, y, w, h = boxes[i]
                    confidence = confidences[i]
                    
                    # Draw bounding box
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                    cv2.putText(frame, f'Bird {confidence:.2f}', (x, y - 10), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                    
                    # If bird detected with high confidence, save frame and detection info
                    if confidence > 0.7:  # High confidence threshold
                        timestamp = datetime.now()
                        image_name = f"detections/zone_{zone_name}_{timestamp.strftime('%Y%m%d_%H%M%S')}.jpg"
                        os.makedirs("detections", exist_ok=True)
                        cv2.imwrite(image_name, frame)
                        
                        detection_info = {
                            "zone": zone_name,
                            "confidence": round(confidence * 100, 2),
                            "timestamp": timestamp.isoformat(),
                            "imageUrl": image_name
                        }
                        
                        # Save detection info to JSON file
                        with open("detections/detections.json", "a") as f:
                            json.dump(detection_info, f)
                            f.write('\n')
                        
                        yield detection_info
            
            # Display the frame
            cv2.imshow('Bird Detection', frame)
            
            # Break if 'q' is pressed
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        
        cap.release()
        cv2.destroyAllWindows()

# Example usage
if __name__ == "__main__":
    detector = BirdDetector()
    
    # For image detection
    result = detector.detect_birds("test_image.jpg")
    print(f"Found {result['total_birds']} birds in the image")
    print(f"Detections saved to {result['image_path']}")
    
    # For video stream
    for detection in detector.process_video_stream(0, "backyard"):  # 0 is the default camera
        print(f"Bird detected in {detection['zone']} with {detection['confidence']}% confidence")
        print(f"Image saved to {detection['imageUrl']}")
