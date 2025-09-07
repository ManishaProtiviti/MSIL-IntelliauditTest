from PIL import Image
import os
import pandas as pd
from pdf2image import convert_from_path
import shutil
from datetime import date
import distance
import numpy as np
import math
from itertools import combinations
import json
import sys

if len(sys.argv) < 2:
    print("Usage: python script.py '<json_string>'")
    sys.exit(1)
print(sys.argv[1])
try:
    config = json.loads(sys.argv[1])
except json.JSONDecodeError as e:
    print(f"[ERROR] Invalid JSON input: {e}")
    sys.exit(1)


current_folder = config['current_folder']
input_folder = config['input_folder']
image_folder = config['image_folder']
output_excel_path = config['output_excel']
poppler_path = config['poppler_path']

# current_folder="C:/Image Analytics/Enterprise Application Codes/API working/Claim Number/Current Data"
# input_folder="C:/Image Analytics/Enterprise Application Codes/API working/Claim Number/Duplicate Forgery/Input Files"
# image_folder="C:/Image Analytics/Enterprise Application Codes/API working/Claim Number/Duplicate Forgery/Image Files"
# poppler_path="C:/Image Analytics/Enterprise Application Codes/API working/Claim Number/Duplicate Forgery/Release-24.02.0-0/poppler-24.02.0/Library/bin"


def reset_folder(path):
    try:
        shutil.rmtree(path, ignore_errors=True)
        if not os.path.isdir(path):
            os.makedirs(path)
    except Exception as e:
        print(f"Error creating folder {path}: {e}")
        raise

try:
    # Step 1: Prepare input_folder and image_folder
    reset_folder(input_folder)
    reset_folder(image_folder)

    # Step 2: Copy only supported files into input_folder
    for file in os.listdir(current_folder):
        ext = file.split('.')[-1].upper()
        if ext in ("PNG", "JPEG", "JPG", "PDF"):
            src_file_path = os.path.join(current_folder, file)
            if os.path.getsize(src_file_path) == 0:
                print(f"[SKIPPED] Empty PDF file: {file}")
                continue
            try:
                shutil.copy(os.path.join(current_folder, file), os.path.join(input_folder, file))
            except Exception as e:
                    print(f"[ERROR] Failed to copy '{file}': {e}")

    # Step 3: From input_folder, copy images or split PDFs into image_folder
    for file in os.listdir(input_folder):
        file_path = os.path.join(input_folder, file)
        try:
            ext = file.split('.')[-1].upper()
            if ext in ("PNG", "JPEG", "JPG"):
                try:
                    shutil.copy(file_path, image_folder)
                except Exception as e:
                    print(f"[ERROR] Failed to copy '{file}': {e}")
            elif ext == "PDF":
                pages = convert_from_path(file_path, poppler_path=poppler_path)
                for idx, page in enumerate(pages):
                    page.save(os.path.join(image_folder, f"{file.split('.')[0]}^page{idx+1}.jpg"), 'JPEG')
        except Exception as e:
            print(f"[ERROR] Splitting {file}: {e}")
    # Step 4: Base Data Preparation
    files = os.listdir(image_folder)
    base_data = pd.DataFrame(files, columns=["Image_Name"])
  
except Exception as e:
    print(f"[ERROR] Main Function: {e}")


result = {
    "status": "done",
    "message": "No valid files were processed. Exiting cleanly."
}

try:
    if base_data.empty:
        print(json.dumps(result))
        sys.exit(0)
except NameError:
    # base_data is not defined at all
    print(json.dumps(result))
    sys.exit(0)


base_data.to_excel(output_excel_path+"/"+"Duplicate_Output.xlsx")
