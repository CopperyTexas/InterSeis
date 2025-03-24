# app/main.py
from fastapi import FastAPI
from backend.routes import conversion

app = FastAPI(
    title="InterSeis API",
    description="API для обработки сейсмических данных",
    version="1.0.0"
)

# Подключаем роутер для конвертации
app.include_router(conversion.router, prefix="/conversion", tags=["Conversion"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
