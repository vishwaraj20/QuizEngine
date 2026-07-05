import gdown
import json
import os

folder_id = "1NC5wLHUMUye5_5zHzSgTgXDUdVmh43ZU"
output_file = "placement_drive_files.json"

print(f"Fetching file list for folder ID: {folder_id}...")
try:
    files = gdown.download_folder(id=folder_id, skip_download=True, quiet=False)
    
    file_list = []
    companies = set()
    
    for f in files:
        file_list.append({
            "id": f.id,
            "path": f.path,
            "local_path": f.local_path
        })
        parts = f.path.split('/')
        if len(parts) > 0 and parts[0]:
            companies.add(parts[0])
            
    with open(output_file, 'w', encoding='utf-8') as out:
        json.dump(file_list, out, indent=2)
        
    print(f"Successfully fetched {len(file_list)} files across {len(companies)} company folders!")
    print("Companies found:", sorted(list(companies)))
except Exception as e:
    print("Error fetching folder list:", e)
