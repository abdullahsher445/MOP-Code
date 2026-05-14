# generate a detailed prompt for AI model analysis
async def gen_prompt(data):
    """
    Generates a comprehensive prompt for GPT-4 Vision to analyze streetlight images.
    
    This function:
    - Creates a detailed system prompt with context and instructions
    - Inserts ML detection results (counts and details)
    - Specifies output format requirements (JSON)
    - Guides the AI to produce professional, human-readable reports
    
    Args:
        data (dict): Dictionary containing:
            - streetlight_count: Total streetlights detected
            - on: Count of operational lights
            - dim: Count of dimmed lights
            - off: Count of faulty/off lights
            - details: Additional ML detection metadata
            
    Returns:
        str: Formatted prompt string for GPT-4 Vision model
    """
    
    # Create the prompt template with instructions for AI analysis
    prompt = f"""
        You are an AI-powered streetlight monitoring assistant.

        An uploaded streetlight image is provided together with ML detection results.
        Use both the image and the detection data to generate a professional, human-readable report.

        ML Detection Results:
        - Total Streetlights: {data["streetlight_count"]}
        - ON Lights: {data["on"]}
        - DIM Lights: {data["dim"]}
        - OFF Lights: {data["off"]}
        - Detection Details: {data["details"]}

        Instructions:
        - Analyze the uploaded image together with the ML output.
        - Describe the overall streetlight condition naturally.
        - Mention operational, dim, and faulty streetlights.
        - Highlight maintenance concerns if necessary.
        - Keep the response concise, professional, and humanized.
        - Do not mention Base64 data in the response.

        Return ONLY in this JSON format:

        {{
        "output": "your human-readable report here"
        }}
    """
    
    # Return the formatted prompt
    return prompt