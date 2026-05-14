from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn
from python.response import LLM_response

app = FastAPI()

@app.get("/")
async def health_check():
    return JSONResponse(content={"status":"API Running"} ,status_code=200 )


class Request(BaseModel):
    uploaded_image: str
    streetlight_count: str
    on:str
    dim:str
    off:str
    details:str

@app.post("/report")
async def generate_report(data: Request):

    try:
        res = await LLM_response(data)
        return res
    except Exception as ex:
        raise HTTPException(status_code=500, detail="Internal server error. Please try again")

if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=5000, reload=True)