import os


def analyze_pc_file(filename):
  filesize = os.path.getsize(filename)
  print(f"Размер файла: {filesize} байт")

  with open(filename, 'rb') as f:
    # Читаем текстовый заголовок
    header_size = 3200
    text_header = f.read(header_size)
    try:
      text = text_header.decode('ascii')
    except UnicodeDecodeError:
      text = text_header.decode('latin1', errors='replace')
    print("Первые 500 символов текстового заголовка:")
    print(text[:500])

    # Читаем заголовок первой трассы
    trace_header_size = 240
    trace_header = f.read(trace_header_size)
    if len(trace_header) < trace_header_size:
      print("Не удалось прочитать заголовок первой трассы.")
      return

    # Выводим первые несколько байт заголовка трассы в hex
    print("Заголовок первой трассы (первые 32 байта):")
    print(' '.join(f'{b:02x}' for b in trace_header[:32]))

    # Определяем, сколько байт осталось для данных трасс
    remaining = filesize - header_size - trace_header_size
    print(f"Остаток после заголовка и первого заголовка трассы: {remaining} байт")

    # Если предполагается, что каждый trace имеет фиксированное число отсчетов,
    # то можно решить уравнение:
    #   remaining = (trace_header_size + sample_count * bytes_per_sample) * (количество трасс - 1)
    # (В данном примере мы прочитали только первый trace_header, поэтому это только отправная точка.)

    # Если известно, что bytes_per_sample для, например, float32 = 4, то:
    bytes_per_sample = 4
    # Попробуем предположить, что стандартное значение sample_count = 1500
    expected_trace_block = trace_header_size + 1500 * bytes_per_sample
    print(f"Ожидаемый размер одного trace блока (240 + 1500*4): {expected_trace_block} байт")

    # Если файловый размер минус 3200 не кратен ожидаемому размеру, возможно, нужно скорректировать sample_count.
    num_traces = (filesize - header_size) // expected_trace_block
    print(f"Предполагаемое число трасс: {num_traces}")


if __name__ == "__main__":
  analyze_pc_file(r"C:\Users\Глебов\Desktop\InterSeis\src\app\procedures\6424b2.pc")
