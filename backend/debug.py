import segyio

print("Доступные поля заголовков трасс в segyio.TraceField:\n")

for attr in dir(segyio.TraceField):
    if not attr.startswith('_'):
        value = getattr(segyio.TraceField, attr)
        print(f"{attr}: {value}")
