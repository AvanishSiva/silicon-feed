from firebase_utils import initialize_firebase, upload_image_from_url
import os

# Initialize
json_path = '../serviceAccountKey.json'
if not os.path.exists(json_path):
    print("Error: serviceAccountKey.json not found!")
    exit(1)

print("Initializing Firebase...")
success = initialize_firebase(json_path)
if not success:
    print("Failed to initialize Firebase.")
    exit(1)

# Test Image URL (A placeholder image)
test_image_url = "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
print(f"Attempting to upload test image from: {test_image_url}")

# Upload
public_url = upload_image_from_url(test_image_url, "test_uploads/verify_test.png")

if public_url:
    print("\nSUCCESS! Image uploaded successfully.")
    print(f"Public Link: {public_url}")
    print("\nPlease click the link above to verify the image loads.")
else:
    print("\nFAILURE: Image upload returned None.")
