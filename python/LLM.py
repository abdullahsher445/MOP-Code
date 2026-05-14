import os
import json
from openai import AsyncOpenAI

from dotenv import load_dotenv
load_dotenv()


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
gpt_client = AsyncOpenAI(api_key=OPENAI_API_KEY)


async def gpt(prompt, base64_image):
    
    chat_prompt = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
            ]
        }
    ]

    completion = await gpt_client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=chat_prompt,
        max_tokens=800,
        temperature=0,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )

    response = completion.choices[0].message.content
    return json.loads(response)
