import os   
import pickle
import pandas as pd
import sys
import json
import re
import pymysql
import pandas as pd
import numpy as np

if len(sys.argv) < 2:
    print("Usage: python script.py '<json_string>'")
    sys.exit(1)
print(sys.argv[1])
try:
    config = json.loads(sys.argv[1])
except json.JSONDecodeError as e:
    print(f"[ERROR] Invalid JSON input: {e}")
    sys.exit(1)


Session_ID=config["Session_ID"]
Employee_ID=config["Employee_ID"]
Process_Timestamp=config["Process_Timestamp"]

current_folder=config['current_folder']
output_excel_path = config['output_excel']

# current_folder="C:/MSIL/Enterprise Application/Session_ID/Current Data"
# output_excel_path="C:/MSIL/Enterprise Application/Session_ID/Excel Output"

# current_folder="C:/Image Analytics/Enterprise Application Codes/API working/Claim Number/Current Data"
# output_excel_path="C:/Image Analytics/Enterprise Application Codes/API working/Claim Number/Excel Output"


# /*******************Create dataframe for current data folder files*********/
files=os.listdir(current_folder)

# def transform_base_data(file_name):
#     if '^' in file_name:
#         return file_name.split('^')[-1]
#     else:
#         return file_name
    
base_data = pd.DataFrame(files, columns=["File_Name"])


# base_data['File_Name'] = base_data['File_Name'].apply(transform_base_data)



duplicate_output_path = os.path.join(output_excel_path,"Duplicate_Output.pkl")

def transform_output(file_name):
    if file_name.endswith('^page1.jpg'):
        return file_name.replace('^page1.jpg','.pdf')
    # elif '^' in file_name:
    #     return file_name.split('^')[-1]
    else:
        return file_name
        

# /********************Import duplicate output if exist*******************/
if os.path.exists(duplicate_output_path):
    # Duplicate_Output=pd.read_excel(duplicate_output_path)
    Duplicate_Output=pd.read_pickle(duplicate_output_path)
    print("Pickle file loaded successfully.")
    Duplicate_Output['% Match'] = Duplicate_Output['% Match'].astype(float).astype(int)
    # /*******************Rules set***********************/
    # Duplicate_Output_v1=Duplicate_Output.loc[(Duplicate_Output['Exception_Category']=="Exact Duplicate Match"),:]\
    Duplicate_Output_v1 = Duplicate_Output[(Duplicate_Output['Exception_Category'].isin(['Exact Duplicate Match', 'Potential Duplicate Match'])) & (Duplicate_Output['% Match'] == 100)]    
    Duplicate_Output_v2 = Duplicate_Output_v1.loc[
        Duplicate_Output_v1['Primary_DocName_Page'].str.endswith('page1.jpg', na=False) |
        ~Duplicate_Output_v1['Primary_DocName_Page'].str.contains(r'page\d+\.jpg$', case=False, na=False) |
        Duplicate_Output_v1['Secondary_DocName_Page'].str.endswith('page1.jpg', na=False) |
        ~Duplicate_Output_v1['Secondary_DocName_Page'].str.contains(r'page\d+\.jpg$', case=False, na=False)
    ]
    Duplicate_Output_v2.drop_duplicates(subset=["Exception_ID"],inplace=True)
    Duplicate_Output_v2['Primary_DocName_Page'] = Duplicate_Output_v2['Primary_DocName_Page'].apply(transform_output)
    Duplicate_Output_v2['Secondary_DocName_Page'] = Duplicate_Output_v2['Secondary_DocName_Page'].apply(transform_output)
    Combined_Duplicate_Output = pd.concat([
        Duplicate_Output_v2[['Primary_DocName_Page', 'Exception_Category']].rename(columns={'Primary_DocName_Page': 'DocName'}),
        Duplicate_Output_v2[['Secondary_DocName_Page', 'Exception_Category']].rename(columns={'Secondary_DocName_Page': 'DocName'})
    ])
    Combined_Duplicate_Output.columns=["File_Name","Exception_Category"]
    Combined_Duplicate_Output["Duplicate_Exception_Flag"]="Yes"


else:
    print("Pickle file not found.")
    
    
# /******************Merge Duplicate output with base data**************/
if 'Combined_Duplicate_Output' in locals() and  isinstance(Combined_Duplicate_Output, pd.DataFrame):
       base_data_v1 = pd.merge(base_data, Combined_Duplicate_Output, on='File_Name', how='left')
       base_data_v1["Exception_Category"].fillna("NA",inplace=True)
       base_data_v1["Duplicate_Exception_Flag"].fillna("No",inplace=True)
else:
        base_data_v1 = base_data.copy()
        base_data_v1["Exception_Category"]="-"
        base_data_v1["Duplicate_Exception_Flag"]="-"

# /***********************End of Duplicate Output code*****************/

# /********************Start of Meta Data Output Code*******************/

# Step 1: Create the reference rules list
pdf_metadata_rules = [
    {"Creator": "PDFium", "Producer": "PDFium", "Software": None},
    {"Creator": None, "Producer": "Microsoft Print to PDF", "Software": None},
    {"Creator": None, "Producer": "iLovePDF", "Software": None},
    {"Creator": "Microsoft® Word 2016", "Producer": "www.ilovepdf.com", "Software": None},
    {"Creator": "PScript5.dll Version 5.2.2", "Producer": "GPL Ghostscript 8.15", "Software": None},
    {"Creator": "Adobe Acrobat 11.0.10", "Producer": "GPL Ghostscript 9.06", "Software": None},
    {"Creator": None, "Producer": "GPL Ghostscript 9.52", "Software": None},
    {"Creator": "Microsoft® Word for Microsoft 365", "Producer": "Microsoft® Word for Microsoft 365", "Software": None},
    {"Creator": "Microsoft® Word 2016", "Producer": "Microsoft® Word 2016", "Software": None},
    {"Creator": "Microsoft® Word 2019", "Producer": "Microsoft® Word 2019", "Software": None},
    {"Creator": "Microsoft® Excel® LTSC", "Producer": "Microsoft® Excel® LTSC", "Software": None},
    {"Creator": "Canva", "Producer": "Canva", "Software": None},
    {"Creator": None, "Producer": "3.0.26 (5.1.10)", "Software": None},
    {"Creator": "Chromium", "Producer": "3.0.24 (5.1.9)", "Software": None},
    {"Creator": "Chromium", "Producer": "3.0.22 (5.1.7)", "Software": None},
    {"Creator": None, "Producer": "3.0.21 (5.1.6)", "Software": None},
    {"Creator": None, "Producer": "3.0.24 (5.1.8)", "Software": None},
    {"Creator": None, "Producer": None, "Software": "Adobe Photoshop 7.0"}
]

def row_matches_rule(row, rules):
    creator = str(row.get("Creator", "")).lower()
    producer = str(row.get("Producer", "")).lower()
    software = str(row.get("Software", "")).lower()

    # Only trigger exception if Word or Excel found in creator/producer
    if any(term in creator for term in ["word", "excel","ilovepdf"]) or any(term in producer for term in ["word", "excel","ilovepdf"]):
        return "Yes"

    # Trigger exception if Photoshop found in software
    if "photoshop" in software:
        return "Yes"

    # Now check exact match with provided rules
    for rule in rules:
        if all(
            rule.get(key) is None or str(row.get(key)) == str(rule.get(key))
            for key in ["Creator", "Producer", "Software"]
        ):
            return "Yes"

    # If none matched
    return "No"


# /********************Import MetaData output if exist*******************/

metadata_output_path = os.path.join(output_excel_path,"Meta_Data_Output.pkl")

if os.path.exists(metadata_output_path):
    MetaData_Output=pd.read_pickle(metadata_output_path)
    print("Pickle file loaded successfully.")
    # Step 3: Add a Software column if not present
    if "Creator" not in MetaData_Output.columns:
        MetaData_Output["Creator"] = None  # All None, as in your rule list
    if "Producer" not in MetaData_Output.columns:
        MetaData_Output["Producer"] = None  # All None, as in your rule list    
    if "Software" not in MetaData_Output.columns:
        MetaData_Output["Software"] = None  # All None, as in your rule list
    MetaData_Output["MetaData_Exception_Flag"] = MetaData_Output.apply(lambda row: row_matches_rule(row, pdf_metadata_rules), axis=1)

else:
    print("Pickle file not found.")
    

if 'MetaData_Output' in locals() and  isinstance(MetaData_Output, pd.DataFrame):
       base_data_v1 = pd.merge(base_data_v1, MetaData_Output[["File_Name","MetaData_Exception_Flag"]], on='File_Name', how='left')
       base_data_v1["MetaData_Exception_Flag"].fillna("No",inplace=True)
else:
        base_data_v1["MetaData_Exception_Flag"]="-"
        
# /***********************End of MetaData Output code*****************/


# /********************Import PDF Edit output if exist*******************/
        
Pdf_Edit_output_path = os.path.join(output_excel_path,"PDF_Edit_Output.pkl")

if os.path.exists(Pdf_Edit_output_path):
    PDF_Edit_Output=pd.read_pickle(Pdf_Edit_output_path)
    print("Pickle file loaded successfully.")
    PDF_Edit_Output.drop(["Edited_File_Name"],inplace=True,axis=1)
    PDF_Edit_Output["PDF_Edit_Exception_Flag"]=PDF_Edit_Output["Edited_Flag"].apply(lambda x:"Yes" if x=="YES" else x)
else:
    print("Pickle file not found.")
    
    

if 'PDF_Edit_Output' in locals() and  isinstance(PDF_Edit_Output, pd.DataFrame):
       base_data_v1 = pd.merge(base_data_v1, PDF_Edit_Output[["File_Name","PDF_Edit_Exception_Flag"]], on='File_Name', how='left')
       base_data_v1["PDF_Edit_Exception_Flag"].fillna("No",inplace=True)
else:
        base_data_v1["PDF_Edit_Exception_Flag"]="-"
                
# /********************End of PDF EDit Forgery Code****************************/

# /********************Import Image Edit output if exist*******************/

Image_Edit_output_path = os.path.join(output_excel_path,"Image_Edit_Output.pkl")

if os.path.exists(Image_Edit_output_path):
    Image_Edit_Output=pd.read_pickle(Image_Edit_output_path)
    Image_Edit_Output["File_Name"] = Image_Edit_Output["File_Name"].apply(lambda x: re.sub(r"\^page\d+\.jpg$", ".pdf", x))    
    Image_Edit_Output.drop_duplicates(subset=None,inplace=True)
    print("Pickle file loaded successfully.")
else:
    print("Pickle file not found.")
    

if 'Image_Edit_Output' in locals() and  isinstance(Image_Edit_Output, pd.DataFrame):
       base_data_v1 = pd.merge(base_data_v1, Image_Edit_Output[["File_Name","Image_Edit_Exception_Flag"]], on='File_Name', how='left')
       base_data_v1["Image_Edit_Exception_Flag"].fillna("No",inplace=True)
else:
        base_data_v1["Image_Edit_Exception_Flag"]="-"
                  
        
# /********************End of Image Edit Forgery Code****************************/        
        
# /********************Import Copy_Move output if exist*******************/

Copy_Move_output_path = os.path.join(output_excel_path,"Copy_Move_Output.pkl")

if os.path.exists(Copy_Move_output_path):
    Copy_Move_Output=pd.read_pickle(Copy_Move_output_path)
    Copy_Move_Output["Copy_Move_Exception_Flag"]=Copy_Move_Output["Forge_Output"].apply(lambda x:"Yes" if x=="Forged Document" else "No")
    Copy_Move_Output["File_Name"] = Copy_Move_Output["File_Name"].apply(lambda x: re.sub(r"\^page\d+\.jpg$", ".pdf", x))    
    Copy_Move_Output.drop_duplicates(subset=None,inplace=True)
    Copy_Move_Output.drop(["Forge_Output"],axis=1,inplace=True)
    print("Pickle file loaded successfully.")
else:
    print("Pickle file not found.")
    

if 'Copy_Move_Output' in locals() and  isinstance(Copy_Move_Output, pd.DataFrame):
       base_data_v1 = pd.merge(base_data_v1, Copy_Move_Output[["File_Name","Copy_Move_Exception_Flag"]], on='File_Name', how='left')
       base_data_v1["Copy_Move_Exception_Flag"].fillna("No",inplace=True)
else:
        base_data_v1["Copy_Move_Exception_Flag"]="-"


# /********************End of Copy_Move Forgery Code****************************/      


# /********************Import QR_Code output if exist*******************/

QR_Code_output_path = os.path.join(output_excel_path,"QR_Code_Output.pkl")

if os.path.exists(QR_Code_output_path):
    QR_Code_Output=pd.read_pickle(QR_Code_output_path)
    QR_Code_Output["QR_Code_Exception_Flag"]="Yes"
    QR_Code_Output["File_Name"] = Copy_Move_Output["File_Name"].apply(lambda x: re.sub(r"\^page\d+\.jpg$", ".pdf", x))    
    print("Pickle file loaded successfully.")
else:
    print("Pickle file not found.")
    

if 'QR_Code_Output' in locals() and  isinstance(QR_Code_Output, pd.DataFrame):
       base_data_v1 = pd.merge(base_data_v1, QR_Code_Output[["File_Name","QR_Code_Exception_Flag"]], on='File_Name', how='left')
       base_data_v1["QR_Code_Exception_Flag"].fillna("No",inplace=True)
else:
        base_data_v1["QR_Code_Exception_Flag"]="-"


# /***************************Risk Profiling************************/


def risk_flag(rows):
    if rows["Exception_Category"]=="Exact Duplicate Match":
        return "High"
    elif rows["Exception_Category"]=="Potential Duplicate Match" and rows["MetaData_Exception_Flag"]=="Yes":
        return "High"
    else:
        return "Low"
        
base_data_v1["Risk_Flag"]= base_data_v1[["Exception_Category","MetaData_Exception_Flag"]].apply(risk_flag,axis=1)       
        
base_data_v1.drop(['Exception_Category'],axis=1,inplace=True)

base_data_v1["Session_ID"]=Session_ID
base_data_v1["Employee_ID"]=Employee_ID
base_data_v1["Process_Timestamp"]=Process_Timestamp

# base_data_v1["Session_ID"]="msil_il_143278"
# base_data_v1["Employee_ID"]="M43267"
# base_data_v1["Process_Timestamp"]="7/1/2025  9:35:34 AM"

base_data_v1.rename(columns={"File_Name":"Document_Name"},inplace=True)

cols=['Employee_ID',
      'Session_ID',
      'Process_Timestamp',
      'Document_Name',
 'Duplicate_Exception_Flag',
 'PDF_Edit_Exception_Flag',
 'MetaData_Exception_Flag',
 'Copy_Move_Exception_Flag',
 'Image_Edit_Exception_Flag',
 'QR_Code_Exception_Flag',
 'Risk_Flag']

base_data_v1=base_data_v1.loc[:,cols]

# /********************Exporting Data into Database***************/
conn = pymysql.connect(host="intelliaudit-dev-mysql.c9ygm4w2aore.ap-south-1.rds.amazonaws.com", user="admin", password="8<LsUmQg9hkA", database="intelliaudit_db")
cursor = conn.cursor()


# login_table=pd.read_excel("C:/MSIL/Enterprise Application/Session_ID/Login_data.xlsx")
# Login_insert_query = """
# INSERT INTO Login_Table
# (Employee_ID, Session_ID, Employee_Name,
# Login_Timestamp, Employee_Department, Access_Type,
# Logout_Timestamp,Total_Documents_Upload,Total_Size_Upload,
# MetaData_Upload_Flag)
# VALUES (%s, %s, %s, %s, %s, %s, %s,%s,%s,%s)
# """
# cursor.executemany(Login_insert_query, login_table.to_records(index=False).tolist())
# base_data_v1.to_excel("C:/MSIL/Enterprise Application/Session_ID/Excel Output/test.xlsx")

Transaction_insert_query = """
INSERT INTO Transaction_Output
(Employee_ID,Session_ID,Process_Timestamp,Document_Name,
Duplicate_Exception_Flag,PDF_Edit_Exception_Flag,
MetaData_Exception_Flag,Copy_Move_Exception_Flag ,
Image_Edit_Exception_Flag,QR_Code_Exception_Flag ,Risk_Flag)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""
cursor.executemany(Transaction_insert_query, base_data_v1.to_records(index=False).tolist())

if 'Duplicate_Output_v2' in locals() and  isinstance(Duplicate_Output_v2, pd.DataFrame):
    Duplicate_Output_v2["Employee_ID"]=Employee_ID
    Duplicate_Output_v2["Session_ID"]=Session_ID
    Duplicate_Output_v2.rename(columns={"Primary_DocName_Page":"Primary_Document","Secondary_DocName_Page":"Secondary_Document","% Match":"Percentage_Match"},inplace=True)
    cols=["Employee_ID","Session_ID",'Exception_ID','Exception_Category', 'Primary_Document', 'Secondary_Document', 'Percentage_Match']
    Duplicate_Output_v2=Duplicate_Output_v2.loc[:,cols]
    Duplicate_insert_query = """
    INSERT INTO Duplicate_Table
    (Employee_ID, Session_ID, Exception_ID, Exception_Category, Primary_Document, Secondary_Document, Percentage_Match)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """  
    cursor.executemany(Duplicate_insert_query, Duplicate_Output_v2.to_records(index=False).tolist())
    # Duplicate_Output_v2.to_excel("C:/MSIL/Enterprise Application/Session_ID/Excel Output/test1.xlsx")

else:
    print("Duplicate check not selected.")


if 'MetaData_Output' in locals() and  isinstance(MetaData_Output, pd.DataFrame):
    cols=['Employee_ID',
          'Session_ID',
          'Creator',
     'Creation_Date',
     'File_Name',
     'Format',
     'Producer',
     'Software',
     'Modified_Date',
     'Author',
     'Title']
    MetaData_Output_v1=MetaData_Output.loc[MetaData_Output["MetaData_Exception_Flag"]=="Yes"]
    MetaData_Output_v1["Employee_ID"]=Employee_ID
    MetaData_Output_v1["Session_ID"]=Session_ID
    # Add any missing columns with blank values
    for col in cols:
        if col not in MetaData_Output_v1.columns:
            MetaData_Output_v1[col] = ""
    MetaData_Output_v1=MetaData_Output_v1.loc[:,cols]
    MetaData_Output_v1.fillna("NA",inplace=True)
    MetaData_insert_query = """
    INSERT INTO MetaData_Table
    (Employee_ID, Session_ID, File_Name, Creator, Creation_Date,
    Producer, Software, Modified_Date, Title, Author, Document_Type)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.executemany(MetaData_insert_query, MetaData_Output_v1.to_records(index=False).tolist())
    # MetaData_Output_v1.to_excel("C:/MSIL/Enterprise Application/Session_ID/Excel Output/test2.xlsx")

else:
    print("MetaData check not selected.")

if 'PDF_Edit_Output' in locals() and  isinstance(PDF_Edit_Output, pd.DataFrame):
    PDF_Edit_Output["Employee_ID"]=Employee_ID
    PDF_Edit_Output["Session_ID"]=Session_ID
    PDF_Edit_Output_v1=PDF_Edit_Output.rename(columns={"PDF_Edit_Exception_Flag":"PDF_Edited_Flag"})
    PDF_Edit_Output_v1["Input_File_Name"]=PDF_Edit_Output_v1["File_Name"].apply(lambda x:x)
    PDF_Edit_Output_v1["Output_File_Name"]=PDF_Edit_Output_v1["File_Name"].apply(lambda x:x)
    PDF_Edit_Output_v1.drop(["Edited_Flag","File_Name"],axis=1,inplace=True)
    cols=["Employee_ID","Session_ID",'Input_File_Name','Output_File_Name','PDF_Edited_Flag','Edited_Text']
    PDF_Edit_Output_v1=PDF_Edit_Output_v1.loc[:,cols]
    PDF_Edit_insert_query = """
    INSERT INTO PDF_Edit_Table
    (Employee_ID, Session_ID, Input_File_Name, Output_File_Name,
    PDF_Edited_Flag, Edited_Text)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor.executemany(PDF_Edit_insert_query, PDF_Edit_Output_v1.to_records(index=False).tolist())
    # PDF_Edit_Output_v1.to_excel("C:/MSIL/Enterprise Application/Session_ID/Excel Output/test3.xlsx")

else:
    print("PDF Edit check not selected.")

conn.commit()
cursor.close()
conn.close()



# # cursor.execute("DESCRIBE  Login_Table")
# # columns = cursor.fetchall()
# # for column in columns:
# #     print(column[0], column[1])

# table_name = "Transaction_Output"

# # Query to fetch all rows
# query = f"SELECT * FROM {table_name}"

# cursor.execute(query)

# # Fetch all rows
# rows = cursor.fetchall()

# # table_name = "Transaction_Output"

# # # Drop table query
# # drop_query = f"DROP TABLE IF EXISTS {table_name}"

# # # Execute the query
# # cursor.execute(drop_query)







# Image_Edit_insert_query = """
# INSERT INTO Image_Edit
# (Employee_ID, Session_ID, Input_File_Name, Output_File_Name,
# Image_Edit_Flag)
# VALUES (%s, %s, %s, %s, %s)
# """

# Copy_Move_insert_query = """
# INSERT INTO Copy_Move
# (Employee_ID, Session_ID, Input_File_Name, Output_File_Name,
# CopyMove_Edit_Flag)
# VALUES (%s, %s, %s, %s, %s)
# """

# QR_Code_insert_query = """
# INSERT INTO QR_Code
# (Employee_ID, Session_ID, Input_File_Name, QR_Data, URL_Present,
# URL_Open)
# VALUES (%s, %s, %s, %s, %s, %s)
# """





# cursor.executemany(Image_Edit_insert_query, Image_Edit_Output.to_records(index=False).tolist())
# cursor.executemany(Copy_Move_insert_query, Copy_Move_Output.to_records(index=False).tolist())
# cursor.executemany(QR_Code_insert_query, QR_Code_Output.to_records(index=False).tolist())



# list(base_data_v1)
