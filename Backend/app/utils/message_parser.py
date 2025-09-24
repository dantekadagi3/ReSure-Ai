import extract_msg
import os

# Define attachments folder
attachments_dir = os.path.join(os.path.dirname(__file__), "attachments")

# Create the folder if it doesn’t exist
os.makedirs(attachments_dir, exist_ok=True)

# Load the .msg file
msg_path = os.path.join(os.path.dirname(__file__), "messages", "submission_example.msg")
msg = extract_msg.Message(msg_path)

# Extract core fields
print("Subject:", msg.subject)
print("From:", msg.sender)
print("To:", msg.to)
print("Date:", msg.date)

# Extract body
print("\nBody:\n", msg.body)

# Extract attachments
if msg.attachments:
    print("\nAttachments:")
    for att in msg.attachments:
        print(" -", att.longFilename)

        # Build full path (ensures folder exists)
        save_path = os.path.join(attachments_dir, att.longFilename)

        # Create subfolder if needed (sometimes filenames have subpaths)
        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        # Save the file
        att.save(customPath=attachments_dir)

        print(f"Attachment saved to {save_path}")
