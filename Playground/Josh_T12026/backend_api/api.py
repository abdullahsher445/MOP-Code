import sqlite3
import json
import os 
from datetime import datetime
from fastapi import FastAPI, UploadFile, File
from typing import List
from fastapi.staticfiles import StaticFiles
from backend_api.models.cv_model import analyse_image
from LLM.llm_reporting import llm_reporting
import base64

#start API app
app = FastAPI()

#store image uploads
upload_directory = "uploads"
os.makedirs(upload_directory, exist_ok = True)

app.mount("/uploads", StaticFiles(directory = "uploads"), name = "uploads")

#database path
db_path = "reports.db"

def init_db():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    #create new database to store CV model analysis and LLM report 
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            report_id TEXT,
            timestamp TEXT,
            results TEXT
        )
    """)

    conn.commit()
    conn.close()
    
init_db()

@app.get("/")
def root():
    return {"backend": "working"}

#DETECTION ENDPOINT FOR CV
@app.post("/detect")
async def detect_lights(files: List[UploadFile] = File(...)):
    #create unique report folders for each individual report formatted y/m/d (year month day) and h/m/s (hours minutes seconds)
    report_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_path = os.path.join(upload_directory, report_id)
    os.makedirs(report_path, exist_ok = True)
    
    #for storing in the database and displaying results 
    saved_files = []
    results = []
    
    #process each individual file 
    for file in files: 
        contents = await file.read() 

        file_path = os.path.join(report_path, file.filename)

        #write uploaded image to the disk 
        with open(file_path, "wb") as f: 
            f.write(contents)

        #run CV model analysis
        analysis = analyse_image(file_path)

        #store result for a specific image, image = original file name and analysis = CV model analysis 
        results.append({
            "image": file.filename,
            "analysis": analysis, 
            "uploaded_img": base64.b64encode(contents).decode("utf-8")
        })

        saved_files.append(file.filename)
    
    #return final response 
    return {        
        "report_id": report_id, 
        "results": results
    }
    
#REPORT ENDPOINT FOR LLM 
@app.post("/report")
async def generate_report(data: dict): 
    #get unique report ids 
    report_id = data["report_id"]

    final_results = []

    #loop through each image 
    for item in data["results"]:

        analysis = item["analysis"]

        #send analysis to LLM for report generation 
        llm_result = await llm_reporting({
            "analysis": analysis,
            "uploaded_img": item.get("uploaded_img")
        })

        #store results 
        final_results.append({
            "image": item["image"],
            "analysis": analysis,
            "report": llm_result["output"]
        })
        
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    #store values of analysis 
    cursor.execute("""
        INSERT INTO reports (report_id, timestamp, results)
        VALUES (?, ?, ?)
    """, (
        report_id,
        datetime.now().isoformat(),
        json.dumps(final_results)
    ))

    conn.commit()
    conn.close()
        
    #send response to the client 
    return {
        "report_id": report_id,
        "results": final_results
    }
    
@app.get("/reports")
def get_reports(): 
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    #fetch all reports with the most recent first
    cursor.execute("""
        SELECT report_id, timestamp, results
        FROM reports
        ORDER BY id DESC
    """)
    
    rows = cursor.fetchall()
    conn.close()
    
    #convert rows to JSON format for API 
    reports = []
    for row in rows:
        reports.append({ 
            "report_id": row[0],
            "timestamp": row[1],
            "results": json.loads(row[2])
        })
    
    #return all reports 
    return {"reports": reports}
