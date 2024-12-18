# -*- coding: utf-8 -*-
"""Ensembled_models.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1b718av2ts5Ft1KhxH7skVJKILJHeYXbn
"""

# import pandas as pd

# # Load CSV file into a DataFrame
# df = pd.read_csv('combine.csv')

# # Display the first few rows of the DataFrame
# print(df.head())

import yfinance as yf
from sklearn.preprocessing import MinMaxScaler         #Extracting Stock data from yahoo finance
stock = yf.Ticker("ADANIPORTS.NS")
print(stock)
stock.history(period='5d')

"""# LSTM"""

df=stock.history(start='2000-11-01', end='2024-04-01', actions=False)   # Data Verification
print(df.shape)
df.head()

print(df.isnull().sum())
df=df.drop(['Open','High','Volume','Low'],axis=1)   # Data Preprocessing
df.head()

import matplotlib.pyplot as plt
plt.figure(figsize=(20,10))
plt.title("Price of the Stock over the years")   #Plotting the Data
plt.plot(df['2000-11-01':'2024-02-06'])
plt.ylabel("Price in INR")
plt.xlabel("Time")

plt.figure(figsize=(20,10))
plt.title("Price of stock in year 2023")
plt.plot(df['2023-02-06':'2024-02-06'])   #Plotting 1 year data
plt.ylabel("Price in INR")
plt.xlabel("Time")

data=df.values
print(len(data)) #Data Segregation
data

import math
train_len=math.ceil(len(data)*0.96)  #Determining Training Length
train_len

min_max_scalar=MinMaxScaler(feature_range=(0,1))
scaled_data=min_max_scalar.fit_transform(data)  #Scaling data to Decimals
print(len(scaled_data))
scaled_data

train_data=scaled_data[0:train_len,:]
print(len(train_data))                      #Storing training data
train_data

x_train=[]
y_train=[]
interval=60
for i in range(interval,len(train_data)):            #Determining the X_train and Y_train
    x_train.append(train_data[i-interval:i,0])
    y_train.append(train_data[i,0])

x_train

y_train

import numpy as np
x_train,y_train=np.array(x_train),np.array(y_train)
x_train=np.reshape(x_train,(x_train.shape[0],x_train.shape[1],1))  #Data Reshaping
print(x_train.shape)
x_train

import tensorflow as tf
import keras
from keras.preprocessing import image
from keras.models import Sequential
from keras.layers import Conv2D, MaxPool2D, Flatten,Dense,Dropout,BatchNormalization,LSTM
from keras import regularizers
from tensorflow.keras.optimizers import Adam,RMSprop,SGD,Adamax

model=Sequential()
# model.add(LSTM(100,return_sequences=True,input_shape=(x_train.shape[1],1)))
# model.add(LSTM(150,return_sequences=True,input_shape=(x_train.shape[1],1)))
# model.add(LSTM(75,return_sequences=True))
model.add(LSTM(128,return_sequences=True,input_shape=(x_train.shape[1],1)))
# model.add(Dropout(0.2))
# model.add(LSTM(units=50, return_sequences=True))
# model.add(Dropout(0.2))

# model.add(LSTM(units=50, return_sequences=True))
# model.add(Dropout(0.2))

model.add(LSTM(units=64))
# model.add(Dropout(0.2))
# model.add(LSTM(50,return_sequences=False))
model.add(Dense(50))
# model.add(drop)
# model.add(Dense(25))
model.add(Dense(1))
model.compile(optimizer='adam', loss='mean_squared_error')

history=model.fit(x_train,y_train,batch_size=128,epochs=100)
import matplotlib.pyplot as plt

# Plot training loss values
plt.plot(history.history['loss'])
plt.title('Model Training Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.show()

test_data=scaled_data[train_len-interval:,:]
x_test=[]
y_test=data[train_len:,:]
for i in range(interval,len(test_data)):              #Preparing test Data
  x_test.append(test_data[i-interval:i,0])

y_test

x_test=np.array(x_test)
x_test=np.reshape(x_test,(x_test.shape[0],x_test.shape[1],1))
x_test

predictions=model.predict(x_test)
predictions=min_max_scalar.inverse_transform(predictions) #Predictions
predictions[0:5]

rmse_error=np.sqrt(np.mean(predictions-y_test)**2)   # Root Mean Square Error
rmse_error

train_data=df[0:train_len]
valid_data=df[train_len:]                     #Combining Actual and Predicted Values
valid_data['predictions']=predictions
valid_data

plt.figure(figsize=(20,10))
plt.title("Model Prediction vs Actual Price")
plt.xlabel("Date",fontsize=18)
plt.ylabel("Price in INR(in Million)",fontsize=18)
plt.plot(train_data['Close'])
plt.plot(valid_data['Close'])
plt.plot(valid_data['predictions'])
plt.legend(['Train','Actual Price','Model Prediction'],loc='lower right',fontsize=15)
plt.show()

plt.figure(figsize=(20,10))
plt.title("Model Prediction vs Actual Price")
plt.xlabel("Date",fontsize=18)
plt.ylabel("Price in INR(in Million)",fontsize=18)
# plt.plot(train_data['Close'])
plt.plot(valid_data['Close'])                                                        #Comparison Graph
plt.plot(valid_data['predictions'])
plt.legend(['Actual Price','Model Prediction'],loc='lower right',fontsize=15)
plt.show()

close = valid_data['Close']
prediction = valid_data['predictions']
count = 0
risk = 0.01
for i in range(len(valid_data)):
  allowed_error = close[i]*risk
  difference = abs(prediction[i]-close[i])
  if difference < allowed_error:
    count=count+1
Accuracy = (count/len(valid_data))*100
print("Accuarcy: ",Accuracy)

# amount = float(input("Enter the amount you want to invest: "))
# time_period = int(input("Enter the time period for investment (in days): "))
# risk_percent = float(input("Enter the risk percent you are willing to take: "))

# # total_days = valid_data.shape[0]
# data = valid_data['predictions']
# index= [data.iloc[1:time_period].idxmax()]
# userdays = index
# useramount = amount

# count = useramount/valid_data['Close'][0]
# profit  = (data[userdays] * count) - useramount
# profit

# islow = False;
# ishigh = False;

# predictions = valid_data['predictions']
# actual = valid_data['Close']

# left = predictions[0]
# number  = amount / left
# profit = 0 ;
# transactions =0
# arr =[]
# for x in range(time_period):
#   if(abs(left-actual[x])>= left*2/100):
#     profit = profit + abs(left-actual[x])*number
#     arr.append(abs(left-actual[x])*number)
#     left = actual[x]
#     number = amount/left
#     transactions = transactions+1
# print(transactions)
# for x in arr:
#   print(x)
# print("Profit Amount: ",profit)

"""# RNN"""

data=df.values
import math
train_len=math.ceil(len(data)*0.96)  #Determining Training Length
train_len
min_max_scalar=MinMaxScaler(feature_range=(0,1))
scaled_data=min_max_scalar.fit_transform(data)
train_data=scaled_data[0:train_len,:]
x_train=[]
y_train=[]
interval=60
for i in range(interval,len(train_data)):            #Determining the X_train and Y_train
    x_train.append(train_data[i-interval:i,0])
    y_train.append(train_data[i,0])
import numpy as np
x_train,y_train=np.array(x_train),np.array(y_train)
x_train=np.reshape(x_train,(x_train.shape[0],x_train.shape[1],1))  #Data Reshaping

from keras.models import Sequential
from keras.layers import SimpleRNN, Dense

rnnmodel = Sequential()
rnnmodel.add(SimpleRNN(128, return_sequences=True, input_shape=(x_train.shape[1], 1)))
rnnmodel.add(SimpleRNN(64))
rnnmodel.add(Dense(50))
rnnmodel.add(Dense(1))
rnnmodel.compile(optimizer='adam', loss='mean_squared_error')

history = rnnmodel.fit(x_train, y_train, batch_size=128, epochs=100)

import matplotlib.pyplot as plt

# Plot training loss values
plt.plot(history.history['loss'])
plt.title('RNN Model Training Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.show()

test_data=scaled_data[train_len-interval:,:]
x_test=[]
y_test=data[train_len:,:]
for i in range(interval,len(test_data)):              #Preparing test Data
  x_test.append(test_data[i-interval:i,0])

x_test=np.array(x_test)
x_test=np.reshape(x_test,(x_test.shape[0],x_test.shape[1],1))
x_test

predict_rnn = rnnmodel.predict(x_test)
predict_rnn = min_max_scalar.inverse_transform(predict_rnn)  # Predictions
predict_rnn[0:5]

rmse_error=np.sqrt(np.mean(predict_rnn-y_test)**2)   # Root Mean Square Error
rmse_error

train_data=df[0:train_len]
valid_data_rnn=df[train_len:]                     #Combining Actual and Predicted Values
valid_data_rnn['predictions']=predict_rnn
valid_data_rnn

plt.figure(figsize=(20,10))
plt.title("Model Prediction vs Actual Price")
plt.xlabel("Date",fontsize=18)
plt.ylabel("Price in INR(in Million)",fontsize=18)
plt.plot(train_data['Close'])
plt.plot(valid_data_rnn['Close'])
plt.plot(valid_data_rnn['predictions'])
plt.legend(['Train','Actual Price','Model Prediction'],loc='lower right',fontsize=15)
plt.show()

closernn = valid_data_rnn['Close']
predictionrnn = valid_data_rnn['predictions']
count = 0
risk = 0.01
for i in range(len(valid_data_rnn)):
  allowed_error = close[i]*risk
  difference = abs(predictionrnn[i]-closernn[i])
  if difference < allowed_error:
    count=count+1
Accuracy = (count/len(valid_data_rnn))*100
print("Accuarcy: ",Accuracy)

# amount = float(input("Enter the amount you want to invest: "))
# time_period = int(input("Enter the time period for investment (in days): "))
# risk_percent = float(input("Enter the risk percent you are willing to take: "))

# # total_days = valid_data.shape[0]
# data = valid_data_rnn['predictions']
# index= [data.iloc[1:time_period].idxmax()]
# userdays = index
# useramount = amount

# count = useramount/valid_data_rnn['Close'][0]
# profit  = (data[userdays] * count) - useramount
# profit

# count = useramount/valid_data_rnn['Close'][0]
# profit  = (data[userdays] * count) - useramount
# profit

# islow = False;
# ishigh = False;

# predictions = valid_data_rnn['predictions']
# actual = valid_data_rnn['Close']

# left = predictionrnn[0]
# number  = amount / left
# profit = 0 ;
# transactions =0
# arr =[]
# for x in range(time_period):
#   if(abs(left-actual[x])>= left*2/100):
#     profit = profit + abs(left-actual[x])*number
#     arr.append(abs(left-actual[x])*number)
#     left = actual[x]
#     number = amount/left
#     transactions = transactions+1
# print(transactions)
# for x in arr:
#   print(x)
# print("Profit Amount: ",profit)

"""# GRU"""

data=df.values
import math
train_len=math.ceil(len(data)*0.96)  #Determining Training Length
train_len
min_max_scalar=MinMaxScaler(feature_range=(0,1))
scaled_data=min_max_scalar.fit_transform(data)
train_data=scaled_data[0:train_len,:]
x_train=[]
y_train=[]
interval=60
for i in range(interval,len(train_data)):            #Determining the X_train and Y_train
    x_train.append(train_data[i-interval:i,0])
    y_train.append(train_data[i,0])
import numpy as np
x_train,y_train=np.array(x_train),np.array(y_train)
x_train=np.reshape(x_train,(x_train.shape[0],x_train.shape[1],1))  #Data Reshaping

from keras.models import Sequential
from keras.layers import GRU, Dense

grumodel = Sequential()
grumodel.add(GRU(128, return_sequences=True, input_shape=(x_train.shape[1], 1)))
grumodel.add(GRU(64))
grumodel.add(Dense(50))
grumodel.add(Dense(1))
grumodel.compile(optimizer='adam', loss='mean_squared_error')

history = grumodel.fit(x_train, y_train, batch_size=128, epochs=100)

# Plot training loss values
plt.plot(history.history['loss'])
plt.title('GRU Model Training Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.show()

test_data = scaled_data[train_len - interval:, :]
x_test = []
y_test = data[train_len:, :]
for i in range(interval, len(test_data)):              # Preparing test Data
    x_test.append(test_data[i - interval:i, 0])

x_test=np.array(x_test)
x_test=np.reshape(x_test,(x_test.shape[0],x_test.shape[1],1))

predict_gru = grumodel.predict(x_test)
predict_gru = min_max_scalar.inverse_transform(predict_gru)  # Predictions
predict_gru[0:5]

rmse_error=np.sqrt(np.mean(predict_gru-y_test)**2)   # Root Mean Square Error
rmse_error

train_data=df[0:train_len]
valid_data_gru=df[train_len:]                     #Combining Actual and Predicted Values
valid_data_gru['predictions']=predict_gru
valid_data_gru

plt.figure(figsize=(20,10))
plt.title("Model Prediction vs Actual Price")
plt.xlabel("Date",fontsize=18)
plt.ylabel("Price in INR(in Million)",fontsize=18)
plt.plot(train_data['Close'])
plt.plot(valid_data_gru['Close'])
plt.plot(valid_data_gru['predictions'])
plt.legend(['Train','Actual Price','Model Prediction'],loc='lower right',fontsize=15)
plt.show()

risk = 0.01
for i in range(len(valid_data_gru)):
  allowed_error = close[i]*risk
  difference = abs(predict_gru[i]-close[i])
  if difference < allowed_error:
    count=count+1
Accuracy = (count/len(valid_data_gru))*100
print("Accuarcy: ",Accuracy)

# amount = float(input("Enter the amount you want to invest: "))
# time_period = int(input("Enter the time period for investment (in days): "))
# risk_percent = float(input("Enter the risk percent you are willing to take: "))

# # total_days = valid_data.shape[0]
# data = valid_data_gru['predictions']
# index= [data.iloc[1:time_period].idxmax()]
# userdays = index
# useramount = amount

# count = useramount/valid_data_gru['Close'][0]
# profit  = (data[userdays] * count) - useramount
# profit

# islow = False;
# ishigh = False;

# predictions = valid_data_gru['predictions']
# actual = valid_data_gru['Close']

# left = predict_gru[0]
# number  = amount / left
# profit = 0 ;
# transactions =0
# arr =[]
# for x in range(time_period):
#   if(abs(left-actual[x])>= left*2/100):
#     profit = profit + abs(left-actual[x])*number
#     arr.append(abs(left-actual[x])*number)
#     left = actual[x]
#     number = amount/left
#     transactions = transactions+1
# print(transactions)
# for x in arr:
#   print(x)
# print("Profit Amount: ",profit)

plt.figure(figsize=(20,10))
plt.title("Model Prediction vs Actual Price")
plt.xlabel("Date",fontsize=18)
plt.ylabel("Price in INR(in Million)",fontsize=18)
# plt.plot(train_data['Close'])
plt.plot(valid_data_gru['Close'])                                                        #Comparison Graph
plt.plot(valid_data_gru['predictions'])
plt.legend(['Actual Price','Model Prediction'],loc='lower right',fontsize=15)
plt.show()

"""## *BIDIRECTIONAL*"""

data=df.values
print(len(data)) #Data Segregation

import math
train_len=math.ceil(len(data)*0.96)  #Determining Training Length
train_len

min_max_scalar=MinMaxScaler(feature_range=(0,1))
scaled_data=min_max_scalar.fit_transform(data)  #Scaling data to Decimals
print(len(scaled_data))
scaled_data

train_data=scaled_data[0:train_len,:]
print(len(train_data))                      #Storing training data
train_data

x_train=[]
y_train=[]
interval=60
for i in range(interval,len(train_data)):            #Determining the X_train and Y_train
    x_train.append(train_data[i-interval:i,0])
    y_train.append(train_data[i,0])


import numpy as np
x_train,y_train=np.array(x_train),np.array(y_train)
x_train=np.reshape(x_train,(x_train.shape[0],x_train.shape[1],1))  #Data Reshaping
print(x_train.shape)
x_train

import tensorflow as tf
import keras
from keras.preprocessing import image
from keras.models import Sequential
from keras.layers import Conv2D, MaxPool2D, Flatten,Dense,Dropout,BatchNormalization,LSTM
from keras import regularizers
from tensorflow.keras.optimizers import Adam,RMSprop,SGD,Adamax

from keras.layers import Conv2D, MaxPool2D, Flatten, Dense, Dropout, BatchNormalization, LSTM, Bidirectional
bilstm_model = Sequential()
bilstm_model.add(Bidirectional(LSTM(128, return_sequences=True, input_shape=(x_train.shape[1], 1))))

bilstm_model.add(Bidirectional(LSTM(units=64)))
bilstm_model.add(Dense(50))
bilstm_model.add(Dense(1))
bilstm_model.compile(optimizer='adam', loss='mean_squared_error')

bilstm_history = bilstm_model.fit(x_train, y_train, batch_size=128, epochs=100)
# Plot training loss values
plt.plot(bilstm_history.history['loss'])
plt.title('Model Training Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.show()

test_data=scaled_data[train_len-interval:,:]
x_test=[]
y_test=data[train_len:,:]
for i in range(interval,len(test_data)):              #Preparing test Data
  x_test.append(test_data[i-interval:i,0])

y_test
x_test=np.array(x_test)
x_test=np.reshape(x_test,(x_test.shape[0],x_test.shape[1],1))
x_test

bilstm_predictions=bilstm_model.predict(x_test)
bilstm_predictions=min_max_scalar.inverse_transform(bilstm_predictions) #Predictions
bilstm_predictions[0:5]

bilstm_rmse_error=np.sqrt(np.mean(bilstm_predictions-y_test)**2)   # Root Mean Square Error
bilstm_rmse_error

valid_databi=df[train_len:]                     #Combining Actual and Predicted Values
valid_databi['bilstm_predictions']=bilstm_predictions
valid_databi

close = valid_databi['Close']
prediction = valid_databi['bilstm_predictions']
count = 0
risk = 0.01
for i in range(len(valid_data)):
  allowed_error = close[i]*risk
  difference = abs(prediction[i]-close[i])
  if difference < allowed_error:
    count=count+1
Accuracy = (count/len(valid_databi))*100
print("Accuarcy: ",Accuracy)



"""# ENSEMBLING: AVERAGE"""

import numpy as np

# Assuming predictions, predict_rnn, and predict_gru are pandas Series
# predictions_np = predictions.to_numpy()
# predict_rnn_np = predict_rnn.to_numpy()
# predict_gru_np = predict_gru.to_numpy()

combined_predictions = (valid_data['predictions']+valid_data_gru['predictions']+valid_data_rnn['predictions']+valid_databi['bilstm_predictions']) / 4
# combined_predictions = combined_predictions.reshape(-1)

combined_predictions

# combined_predictions
combine=df[train_len:]
combine['predgru'] = valid_data_gru['predictions']
combine['predrnn'] = valid_data_rnn['predictions']
combine['predlstm'] = valid_data['predictions']
combine['predbilstm']=valid_databi['bilstm_predictions']
combine['combined_predictions'] = combined_predictions

combine

from sklearn.metrics import mean_squared_error
import numpy as np

# Assuming y_test is the actual target values
# Calculate RMSE for combined predictions
rmse_combined = np.sqrt(mean_squared_error(y_test, combined_predictions))

print("RMSE for combined predictions:", rmse_combined)

close = valid_data['Close']
prediction = combine['combined_predictions']
count = 0
risk = 0.01
for i in range(len(valid_data)):
  allowed_error = close[i]*risk
  difference = abs(prediction[i]-close[i])
  if difference < allowed_error:
    count=count+1
Accuracy = (count/len(valid_data))*100
print("Accuarcy: ",Accuracy)

# amount = float(input("Enter the amount you want to invest: "))
# time_period = int(input("Enter the time period for investment (in days): "))
# risk_percent = float(input("Enter the risk percent you are willing to take: "))

# # total_days = valid_data.shape[0]
# data = combine['combined_predictions']
# index= [data.iloc[1:time_period].idxmax()]
# userdays = index
# useramount = amount

# count = useramount/combine['combined_predictions'][0]
# profit  = (data[userdays] * count) - useramount
# profit

# islow = False;
# ishigh = False;

# predictions = combine['combined_predictions']
# actual = valid_data['Close']

# left = predictions[0]
# number  = amount / left
# profit = 0 ;
# transactions =0
# arr =[]
# for x in range(time_period):
#   if(abs(left-actual[x])>= left*2/100):
#     profit = profit + abs(left-actual[x])*number
#     arr.append(abs(left-actual[x])*number)
#     left = actual[x]
#     number = amount/left
#     transactions = transactions+1
# print(transactions)
# for x in arr:
#   print(x)
# print("Profit Amount: ",profit)

"""# ENSEMBLING: STACKING"""

# from sklearn.ensemble import StackingRegressor
# from sklearn.linear_model import Ridge


# stacked_predictions = np.column_stack((combine['predgru'],combine['predlstm'],combine['predrnn']))
# meta_model = Ridge()
# stacked_model = StackingRegressor(estimators=[('lstm', meta_model), ('rnn', meta_model), ('gru', meta_model)], final_estimator=meta_model)

# # Use the stacked model to make final predictions
# final_predictions = stacked_model.predict(stacked_predictions)

# # Calculate RMSE for the stacked predictions
# from sklearn.metrics import mean_squared_error
# rmse_stacked = np.sqrt(mean_squared_error(y_test, final_predictions))
# print("RMSE for stacked predictions:", rmse_stacked)

from sklearn.linear_model import Ridge
from sklearn.metrics import mean_squared_error
import numpy as np

# Assuming combine['predgru'], combine['predlstm'], combine['predrnn'] are your model predictions
# and y_test is your actual target values for the test set

# Stack your predictions as features
X_stacked = np.column_stack((combine['predgru'], combine['predlstm'], combine['predrnn'],combine['predbilstm']))

# Ensure y_test is in the correct format, e.g., a numpy array
y_test = y_test.values if hasattr(y_test, 'values') else y_test

# Define and fit the meta-model on your stacked predictions
meta_model = Ridge()
meta_model.fit(X_stacked, y_test)  # Note: In practice, you should fit on a training set, not the test set

# Since we fit directly on the test set (for demonstration), we skip a split here
# Predict on the same stacked features to evaluate (in practice, predict on a separate validation set)
final_predictions = meta_model.predict(X_stacked)
combine['finalstack'] = final_predictions
# Calculate RMSE for the stacked predictions
rmse_stacked = np.sqrt(mean_squared_error(y_test, final_predictions))
print("RMSE for stacked predictions:", rmse_stacked)

combine

# Accuracy = 0
count = 0
close = valid_data['Close']
prediction = combine['finalstack']
risk = 0.01
for i in range(len(final_predictions)):
  allowed_error = close[i]*risk
  difference = abs(final_predictions[i]-close[i])
  if difference < allowed_error:
    count=count+1
Accuracy_final = (count/len(final_predictions))*100
print("Accuarcy: ",Accuracy_final)

# amount = float(input("Enter the amount you want to invest: "))
# time_period = int(input("Enter the time period for investment (in days): "))
# risk_percent = float(input("Enter the risk percent you are willing to take: "))

# # total_days = valid_data.shape[0]
# data = combine['finalstack']
# index= [data.iloc[1:time_period].idxmax()]
# userdays = index
# useramount = amount

# count = useramount/combine['finalstack'][0]
# profit  = (data[userdays] * count) - useramount
# profit

# islow = False
# ishigh = False

# predictions = combine['finalstack']
# actual = valid_data['Close']

# # x = (combine['finalstack'][x],combine['predgru'][x],combine['predrnn'][x],combine['predlstm'][x],combine['predbilstm'][x],combine['combined_predictions'][x])

# left = predictions[0]
# number  = amount / left
# profit = 0
# transactions =0
# arr =[]
# for x in range(time_period):
#   if(max(abs(actual[x]-max(combine['finalstack'][x],combine['predgru'][x],combine['predrnn'][x],combine['predlstm'][x],combine['predbilstm'][x],combine['combined_predictions'][x])),abs(actual[x]-min(combine['finalstack'][x],combine['predgru'][x],combine['predrnn'][x],combine['predlstm'][x],combine['predbilstm'][x],combine['combined_predictions'][x])))>= left*2/100):
#     profit = profit + max(abs(actual[x]-max(combine['finalstack'][x],combine['predgru'][x],combine['predrnn'][x],combine['predlstm'][x],combine['predbilstm'][x],combine['combined_predictions'][x])),abs(actual[x]-min(combine['finalstack'][x],combine['predgru'][x],combine['predrnn'][x],combine['predlstm'][x],combine['predbilstm'][x],combine['combined_predictions'][x])))*number
#     arr.append(max(abs(actual[x]-max(combine['finalstack'][x],combine['predgru'][x],combine['predrnn'][x],combine['predlstm'][x],combine['predbilstm'][x],combine['combined_predictions'][x])),abs(actual[x]-min(combine['finalstack'][x],combine['predgru'][x],combine['predrnn'][x],combine['predlstm'][x],combine['predbilstm'][x],combine['combined_predictions'][x])))*number)
#     left = actual[x]
#     amount = amount + profit
#     number = amount/left
#     transactions = transactions+1
# print(transactions)
# for x in arr:
#   print(x)
# print("Profit Amount: ",profit)


# # islow = False;
# # ishigh = False;

# # predictions = combine['combined_predictions']
# # actual = valid_data['Close']

# # left = predictions[0]
# # number  = amount / left
# # profit = 0 ;
# # transactions =0
# # arr =[]
# # for x in range(time_period):
# #   if(abs(left-actual[x])>= left*2/100):
# #     profit = profit + abs(left-actual[x])*number
# #     arr.append(abs(left-actual[x])*number)
# #     left = actual[x]
# #     number = amount/left
# #     transactions = transactions+1
# # print(transactions)
# # for x in arr:
# #   print(x)
# # print("Profit Amount: ",profit)

"""# ADABOOST"""

from sklearn.ensemble import AdaBoostRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_squared_error
import numpy as np

# Assuming combine['predgru'], combine['predlstm'], combine['predrnn'] are your model predictions
# and y_test is your actual target values for the test set

# Stack your predictions as features
X_stacked = np.column_stack((combine['predgru'], combine['predlstm'], combine['predrnn']))

# Ensure y_test is in the correct format, e.g., a numpy array
y_testtrail = y_test.values if hasattr(y_test, 'values') else y_test

# Initialize AdaBoost with a base estimator (DecisionTreeRegressor is commonly used)
base_estimator = DecisionTreeRegressor(max_depth=3)  # Adjust max_depth as needed
adaboost_model = AdaBoostRegressor(base_estimator=base_estimator, n_estimators=50, learning_rate=1.0, random_state=42)

# Fit AdaBoost on the stacked predictions
adaboost_model.fit(X_stacked, y_test)  # Note: In practice, you should fit on a training set, not the test set

# Predict using the AdaBoost model
final_predictions_boost = adaboost_model.predict(X_stacked)
combine['finalboost'] = final_predictions_boost
# Calculate RMSE for the predictions
rmse_adaboost = np.sqrt(mean_squared_error(y_testtrail, final_predictions_boost))
print("RMSE for AdaBoost predictions:", rmse_adaboost)

# Accuracy = 0
count = 0
close = valid_data['Close']
prediction = combine['finalboost']
risk = 0.5
for i in range(len(final_predictions_boost)):
  allowed_error = close[i]*risk
  difference = abs(final_predictions_boost[i]-close[i])
  if difference < allowed_error:
    count=count+1
Accuracy_final = (count/len(final_predictions_boost))*100
print("Accuarcy: ",Accuracy_final)

islow = False
ishigh = False

predictions = combine['finalboost']
actual = predictions
amount = 100000
time_period = 100
# x = (combine['finalstack'][x],combine['predgru'][x],combine['predrnn'][x],combine['predlstm'][x],combine['predbilstm'][x],combine['combined_predictions'][x])

left = predictions[0]
number  = amount / left
profit = 0
transactions =0
arr =[]
for x in range(time_period):
  if(abs(left-actual[x])>= left*2/100):
    profit = profit + abs(left-actual[x])*number
    arr.append(abs(left-actual[x])*number)
    left = actual[x]
    amount = amount + abs(left-actual[x])*number
    number = amount/left
    transactions = transactions+1
print(transactions)
for x in arr:
  print(x)
print("Profit Amount: ",profit)

import xgboost
from xgboost import XGBRegressor

# Initialize XGBoost regressor
xgb_model = XGBRegressor(objective='reg:squarederror', n_estimators=100, learning_rate=0.1, random_state=42)

# Fit XGBoost on the stacked predictions
xgb_model.fit(X_stacked, y_testtrail)  # Note: In practice, you should fit on a training set, not the test set

# Predict using the XGBoost model
final_predictions_xgb = xgb_model.predict(X_stacked)
combine['finalxgb'] = final_predictions_xgb

# Calculate RMSE for the predictions
rmse_xgb = np.sqrt(mean_squared_error(y_testtrail, final_predictions_xgb))
print("RMSE for XGBoost predictions:", rmse_xgb)

# Accuracy = 0
count = 0
close = valid_data['Close']
prediction = combine['finalboost']
risk = 0.01
for i in range(len(final_predictions_boost)):
  allowed_error = close[i]*risk
  difference = abs(final_predictions_boost[i]-close[i])
  if difference < allowed_error:
    count=count+1
Accuracy_final = (count/len(final_predictions_boost))*100
print("Accuarcy: ",Accuracy_final)

combine
combine.to_csv('ADANIPORTS_output.csv', index=False)