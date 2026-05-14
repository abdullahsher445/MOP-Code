async def gen_prompt(data):
    
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
    
    return prompt