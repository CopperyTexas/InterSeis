import struct

import numpy as np
import segyio


def convert_pc_to_segy(pc_filename: str, segy_filename: str,
                       data_format: str = 'I4', sorting: str = 'SP',
                       preserve_headers: bool = True, byte_swap: bool = False,
                       header_size: int = 3200, trace_header_size: int = 240,
                       sample_count: int = 1500):
  """
  Конвертирует PC-файл в SEG-Y с базовыми настройками.

  :param pc_filename: путь к входному PC-файлу
  :param segy_filename: путь к выходному SEG-Y файлу
  :param data_format: 'I2', 'I4' или 'R4'
  :param sorting: 'SP', 'DP' или 'OP' (для сортировки трасс; пример сортировки берется из байтов 20-24 заголовка)
  :param preserve_headers: сохранять ли текстовый заголовок
  :param byte_swap: выполнять ли перестановку байт
  :param header_size: размер текстового заголовка (обычно 3200 байт)
  :param trace_header_size: размер заголовка каждой трассы (обычно 240 байт)
  :param sample_count: число отсчетов в трассе (например, 1500)
  """
  # Выбор типа данных
  if data_format.upper() == 'I2':
    sample_dtype = np.int16
    segy_format = 1
  elif data_format.upper() == 'I4':
    sample_dtype = np.int32
    segy_format = 2
  elif data_format.upper() == 'R4':
    sample_dtype = np.float32
    segy_format = 5
  else:
    raise ValueError("Неверный формат данных: ожидается I2, I4 или R4")

  # Чтение входного файла
  with open(pc_filename, 'rb') as f:
    text_header = f.read(header_size)
    if preserve_headers:
      segy_text_header = text_header
    else:
      segy_text_header = b' ' * header_size

    trace_headers = []
    traces = []
    trace_index = 0
    while True:
      trace_header = f.read(trace_header_size)
      if len(trace_header) < trace_header_size:
        break
      num_bytes = sample_count * np.dtype(sample_dtype).itemsize
      trace_data_bytes = f.read(num_bytes)
      if len(trace_data_bytes) < num_bytes:
        break
      # Создаем массив, копируя данные, чтобы его можно было менять
      trace_data = np.frombuffer(trace_data_bytes, dtype=sample_dtype).copy()
      if byte_swap:
        trace_data.byteswap(inplace=True)
        trace_data = trace_data.view(trace_data.dtype.newbyteorder('>'))
      traces.append(trace_data)
      trace_headers.append(trace_header)
      trace_index += 1

  print(f"Прочитано трасс: {len(traces)}")

  # Сортировка трасс по выбранному критерию (пример: значение, извлеченное из байтов 20-24 заголовка)
  if sorting.upper() in ['SP', 'DP', 'OP']:
    def get_sort_value(header):
      # Пример: извлечение 4-байтового целого числа из байтов 20-24
      return struct.unpack('i', header[20:24])[0]

    indices = sorted(range(len(traces)), key=lambda i: get_sort_value(trace_headers[i]))
    traces = [traces[i] for i in indices]
    trace_headers = [trace_headers[i] for i in indices]

  # Создание спецификации для SEG-Y файла
  spec = segyio.spec()
  spec.format = segy_format
  spec.tracecount = len(traces)
  spec.samples = list(range(sample_count))

  # Запись SEG-Y файла
  with segyio.create(segy_filename, spec) as segyfile:
    # Записываем текстовый заголовок: segyio ожидает строку длиной 3200 символов.
    try:
      segyfile.text[0] = segy_text_header.decode('ascii', errors='replace')
    except Exception as e:
      print("Ошибка при декодировании текстового заголовка:", e)
      segyfile.text[0] = ' ' * header_size

    # Записываем трассы
    for i, trace_data in enumerate(traces):
      trace_num = struct.unpack('i', trace_headers[i][:4])[0]
      segyfile.header[i][segyio.TraceField.TRACE_SEQUENCE_LINE] = trace_num
      segyfile.trace[i] = trace_data

  print(f"Конвертация завершена: {pc_filename} -> {segy_filename}")


if __name__ == "__main__":
  # Пример вызова функции.
  # Задайте пути согласно вашей файловой системе:
  input_file = r"C:\\Users\\Глебов\\Desktop\\InterSeis\\src\\app\\procedures\\6424b2.pc"
  output_file = r"C:\\Users\\Глебов\\Desktop\\InterSeis\\src\\app\\procedures\\6424b2.sgy"

  convert_pc_to_segy(
    pc_filename=input_file,
    segy_filename=output_file,
    data_format="I4",
    sorting="SP",
    preserve_headers=True,
    byte_swap=True,
    header_size=3200,
    trace_header_size=240,
    sample_count=1500
  )
