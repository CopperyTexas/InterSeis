import struct
from pathlib import Path

def parse_pc_file_preview(file_path, trace_count=3, trace_header_size=240, header_size=256):
    result = {}
    file_path = Path(file_path)

    if not file_path.exists():
        raise FileNotFoundError(f"Файл не найден: {file_path}")

    with open(file_path, "rb") as f:
        # Читаем заголовок файла (256 байт)
        header_data = f.read(header_size)
        result["header_hex"] = header_data.hex()

        traces = []
        for _ in range(trace_count):
            trace = {}
            # Читаем заголовок трассы (240 байт)
            trace_header = f.read(trace_header_size)
            if not trace_header:
                break
            trace["trace_header_hex"] = trace_header.hex()

            # Пробуем считать первые 10 float32 сэмплов
            sample_data = f.read(4 * 10)
            if not sample_data:
                break
            samples = struct.unpack("<10f", sample_data)
            trace["samples_preview"] = samples

            traces.append(trace)

        result["traces"] = traces

    return result

# Пример использования:
if __name__ == "__main__":
    file_path = "C:\\Users\\Глебов\\Desktop\\InterSeis\\src\\app\\procedures\\6224b2.pc"
  # Укажи путь к своему .pc-файлу
    parsed = parse_pc_file_preview(file_path)

    print("=== Заголовок файла ===")
    print(parsed["header_hex"][:128], "...")  # первые 64 байта в hex

    for i, tr in enumerate(parsed["traces"]):
        print(f"\n=== Трасса {i+1} ===")
        print("Заголовок трассы (hex):", tr["trace_header_hex"][:64], "...")
        print("Первые 10 сэмплов:", tr["samples_preview"])
