# Import necessary libraries for API development and data validation
from fastapi import FastAPI, HTTPException 
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn 
from python.response import LLM_response

# Initialize FastAPI application instance
app = FastAPI()

# Health check endpoint - verifies if API is running and responsive
@app.get("/")
async def health_check():
    """
    Health check endpoint to verify API status.
    Returns: JSON response with status "API Running" and HTTP 200 status code.
    """
    return JSONResponse(content={"status":"API Running"} ,status_code=200 )


# Define the request data model using Pydantic for input validation
class Request(BaseModel):
    """
    Pydantic model for validating incoming API request data.
    Ensures all required fields are present and properly formatted.
    """
    uploaded_image: str
    streetlight_count: str
    on: str
    dim: str
    off: str
    details: str

# Report generation endpoint - main endpoint for processing streetlight data
@app.post("/report")
async def generate_report(data: Request):
    """
    POST endpoint that generates a human-readable report from streetlight detection data.
    
    Process:
    1. Receives validated Request data containing image and detection results
    2. Passes data to LLM_response function for AI-powered report generation
    3. Returns the generated report or error message
    
    Args:
        data (Request): Pydantic model containing request data
        
    Returns:
        JSON response with LLM-generated report
        
    Raises:
        HTTPException: If any error occurs during processing
    """

    try:
        # Call LLM_response to generate AI-powered report
        res = await LLM_response(data)
        return res
    except Exception as ex:
        # Handle any exceptions and return HTTP 500 error with descriptive message
        raise HTTPException(status_code=500, detail="Internal server error. Please try again")


# Entry point
if __name__ == "__main__":
    """
    Main execution block:
    - Runs uvicorn ASGI server
    - Sets host to localhost (127.0.0.1) for local development
    - Sets port to 5000 for API access
    - Enables auto-reload for development convenience
    """
    uvicorn.run("main:app", host="localhost", port=5000, reload=True)