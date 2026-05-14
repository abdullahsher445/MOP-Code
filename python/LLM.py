# Import required libraries
import os
import json
from openai import AsyncOpenAI

from dotenv import load_dotenv  # Load environment variables from .env file
load_dotenv()


# Retrieve OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# Initialize AsyncOpenAI clien
gpt_client = AsyncOpenAI(api_key=OPENAI_API_KEY)


# Function to image and text analysis for llm reporting using gpt 4.1 mini
async def gpt(prompt, base64_image):
    """
    Sends a prompt and image to GPT-4 Vision model for analysis.
    
    This function:
    - Constructs achat prompt with text prompt and image
    - Sends request to llm model asynchronously
    - Parses the JSON response from the model
    
    Args:
        prompt (str): The text prompt/instruction for the model
        base64_image (str): Base64 encoded image data
        
    Returns:
        dict: Parsed JSON response from the model
    """
    
    # message array with user content (text + image)
    chat_prompt = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
            ]
        }
    ]

    # Make async call
    completion = await gpt_client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=chat_prompt,
        max_tokens=800,
        temperature=0,
        top_p=1,
        frequency_penalty=0, 
        presence_penalty=0
    )

    # Extract the text content from the API response
    response = completion.choices[0].message.content
    return json.loads(response)
