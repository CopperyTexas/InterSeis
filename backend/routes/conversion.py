# app/routes/conversion.py
from fastapi import APIRouter, HTTPException
from backend.models import ConvertParams
import os
from backend.utils.conversion_utils import convert_pc_to_segy

router = APIRouter()

@router.post("/")
async def convert(params: ConvertParams):
    # Проверяем наличие входного файла
    if not os.path.exists(params.inputFile):
        raise HTTPException(status_code=400, detail="Входной файл не найден")
    try:
        # Вызываем функцию конвертации
        convert_pc_to_segy(
            pc_filename=params.inputFile,
            segy_filename=params.outputFile,
            data_format=params.dataFormat,
            sorting=params.sorting,
            preserve_headers=params.preserveHeaders,
            byte_swap=params.byteSwap
        )
        return {"status": "success", "message": f"Файл сконвертирован: {params.outputFile}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
