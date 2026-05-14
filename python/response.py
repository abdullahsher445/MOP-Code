# Import required modules
from python.prompt import gen_prompt 
from python.LLM import gpt


# Main function to orchestrate the complete LLM response pipeline
async def LLM_response(inputData):
    """
    Orchestrates the complete workflow for generating LLM-powered reports.
    
    Workflow:
    1. Extracts the base64 encoded image from input
    2. Generates a detailed prompt using ML detection data
    3. Sends prompt and image to GPT model for analysis
    4. Formats and returns the generated report
    
    Args:
        inputData (dict): Input data containing:
            - uploaded_image: Base64 encoded image
            - streetlight_count: Total streetlights
            - on: ON lights count
            - dim: DIM lights count
            - off: OFF lights count
            - details: ML detection details
            
    Returns:
        dict: Response containing the AI-generated report in the format:
              {"llm_response": "human-readable report text"}
    """
    
    # Extract base64 encoded image data from input
    base64_image = inputData["uploaded_image"]
    
    # Generate a detailed prompt using the ML detection data
    prompt = await gen_prompt(inputData)
    
    # Send the prompt and image to llm for analysis
    response = await gpt(prompt, base64_image)
    
    # Format the final response with the AI-generated report
    final_res = {
        "llm_response": response["output"],  # Extract the "output" field from GPT response
    }
    
    # Return the formatted response containing the generated report
    return final_res