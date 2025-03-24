# app/models.py
from pydantic import BaseModel

class ConvertParams(BaseModel):
    inputFile: str
    outputFile: str
    dataFormat: str  # 'I2', 'I4' или 'R4'
    sorting: str     # 'SP', 'DP' или 'OP'
    preserveHeaders: bool
    byteSwap: bool
