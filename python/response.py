from python.prompt import gen_prompt
from python.LLM import gpt

async def LLM_response(inputData):
    
    base64_image = inputData["uploaded_image"]
    prompt = await gen_prompt(inputData)
    response = await gpt(prompt, base64_image)
    
    final_res = {
        "llm_response": response["output"],
    }
    
    return final_res