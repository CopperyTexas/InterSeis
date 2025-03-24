import numpy as np
import segyio
import struct


def convert_pc_to_segy(pc_filename: str, segy_filename: str,
                       data_format: str = 'I4', sorting: str = 'SP',
                       preserve_headers: bool = True, byte_swap: bool = False):
  header_size = 3200
  trace_header_size = 240
  sample_count = 1500  # пример

  if data_format.upper() == 'I2':
    sample_dtype = np.int16
    segy_format = 1  # Код формата SEG‑Y для int16
  elif data_format.upper() == 'I4':
    sample_dtype = np.int32
    segy_format = 2  # Код формата SEG‑Y для int32
  elif data_format.upper() == 'R4':
    sample_dtype = np.float32
    segy_format = 5  # Код формата SEG‑Y для float32
  else:
    raise ValueError("Неверный формат данных: I2, I4 или R4")

  # Читаем входной файл ...
  traces = []
  trace_headers = []
  with open(pc_filename, 'rb') as f:
    text_header = f.read(header_size)
    segy_text_header = text_header if preserve_headers else b' ' * header_size

    while True:
      trace_header = f.read(trace_header_size)
      if len(trace_header) < trace_header_size:
        break
      num_bytes = sample_count * np.dtype(sample_dtype).itemsize
      trace_data_bytes = f.read(num_bytes)
      if len(trace_data_bytes) < num_bytes:
        break
      
      trace_data = np.frombuffer(trace_data_bytes, dtype=sample_dtype).copy()
      if byte_swap:
        trace_data.byteswap(inplace=True)
        trace_data = trace_data.view(trace_data.dtype.newbyteorder('>'))
      traces.append(trace_data)
      trace_headers.append(trace_header)

  # Сортировка ...
  if sorting.upper() in ['SP', 'DP', 'OP']:
    def get_sort_value(header):
      return struct.unpack('i', header[20:24])[0]  # пример

    indices = sorted(range(len(traces)), key=lambda i: get_sort_value(trace_headers[i]))
    traces = [traces[i] for i in indices]
    trace_headers = [trace_headers[i] for i in indices]

  # Готовим спецификацию
  spec = segyio.spec()
  spec.format = segy_format  # Присваиваем целое число (1, 2 или 5)
  spec.tracecount = len(traces)
  spec.samples = list(range(sample_count))

  with segyio.create(segy_filename, spec) as segyfile:
    # Запись текстового заголовка
    segyfile.text[0] = segy_text_header.decode('ascii', errors='replace')

    # Запись трасс
    for i, trace_data in enumerate(traces):
      # Можно извлечь номер трассы из trace_headers[i], если нужно
      # trace_num = struct.unpack('i', trace_headers[i][:4])[0]
      # segyfile.header[i] = {"trace_sequence_number_within_line": trace_num}
      segyfile.trace[i] = trace_data

  print(f"Конвертация завершена: {pc_filename} -> {segy_filename}")
