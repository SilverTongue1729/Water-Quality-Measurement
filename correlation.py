import pandas as pd
import csv

tds = []
temp = []
turbidity = []
ph = []

with open('sensor_data.csv', mode='r') as file:
    csvFile = csv.reader(file)
    i = 0
    for lines in csvFile:
      if i == 0:
        i += 1
        continue
      tds.append(float(lines[2]))
      temp.append(float(lines[3]))
      turbidity.append(float(lines[4]))
      ph.append(float(lines[5]))
      i += 1


data = pd.DataFrame({
    "tds": tds,
    "temp": temp,
    "turbidity": turbidity,
    "ph": ph
})

print(data)

print("correlation temp and tds: ",data['temp'].corr(data['tds']))
print("correlation temp and ph: ",data['temp'].corr(data['ph']))
print("correlation temp and turbidity: ",data['temp'].corr(data['turbidity']))
print(data.describe())

