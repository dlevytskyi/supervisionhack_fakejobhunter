from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
import joblib
from sklearn.feature_extraction.text import CountVectorizer
from vectorizer import prepare_words, read_words_from_file, create_unique_list_of_words
import numpy as np
import os
import pandas as pd
import re
import json

# TODO to config.py
# fake_dir = "../data/processed/fake"
# genuine_dir = "../data/processed/genuine"

features = []
labels = []
list_of_words = []

data = pd.read_csv('../../tmp/offers.csv')
pattern = r'[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]'  # Remove non-alphanumeric and non-whitespace characters

def create_unique_list_of_words(words_list):
    unique_list = list(set(words_list))
    return unique_list

def lower_and_split(text):
    #lower and split
    text = [document.lower().split() for document in text]
    return text

for index, row in data.iterrows():
    # Access the values of each column
    json_string1 = row['content']
    # Remove special characters using regular expressions
    data1 = json.loads(json_string1)
    content1 = data1['content']
    # Remove special characters using regular expressions
    cleaned_text = re.sub(pattern, '', content1)
    for document in cleaned_text:
        # Extend the list_of_words with the words from the document
        list_of_words.extend(document)

    features.append(content1)
    # print(column1_value)
    labels.append(row['analist_decision'])

print(features)

# TODO to utils
# def add_files_from_dir_to_model(offer_dir, label, features, labels):
#     for filename in os.listdir(offer_dir):
#         file_path = os.path.join(offer_dir, filename)
#         if os.path.isfile(file_path):
#             words = read_words_from_file(file_path)
#             # print(words)
#             prep_words = prepare_words(words)
#             # print(prep_words)
#             features.append(prep_words)
#             labels.append(label)  
            # Open the file and read its contents
            # with open(file_path, 'r', encoding="utf-8", errors="ignore") as file:
            #     # Read the contents and append them to the list
            #     features.append(file.read())
            #     labels.append(label)
                
# TODO to model, generate features and labels for model 
# training_lists = add_files_from_dir_to_model(fake_dir, "fake", features, labels)
# training_lists = add_files_from_dir_to_model(genuine_dir, "ok", features, labels)

features_as_strings = [' '.join(words) for words in features]
# TODO bag_words to config.py
# TODO prepare bag words to model/bag_words/file.py
bag_words = read_words_from_file("C:/Users/jacek/OneDrive/Pulpit/hunter/supervisionhack_fakejobhunter/hunter/data/bag_words/tests.txt")
prepared_bag_words = prepare_words(bag_words)
unique_bag_words = create_unique_list_of_words(prepared_bag_words)
# prepared_bag_words = [' '.join(words) for words in prepared_bag_words]
# print(unique_bag_words)

# TODO vectorizer to model/prepare_data
count_vectorizer = CountVectorizer(vocabulary=unique_bag_words, lowercase=True)
X_count = count_vectorizer.fit_transform(features_as_strings)

X = X_count
y = np.array(labels)

# TODO vectorizer to utils/train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Training set shape:", X_train.shape, y_train.shape)
print("Testing set shape:", X_test.shape, y_test.shape)

#Train a machine learning model
model = SVC()

model.fit(X_train, y_train)

# TODO vectorizer to utils/predict
y_pred = model.predict(X_test)

# TODO use case create_model with all this steps

# Compare the predicted labels with the actual labels
for i in range(len(y_pred)):
    if y_pred[i] == y_test[i]:
        print("Correct prediction:")
    else:
        print("Incorrect prediction:")
    print("Job offer:", X_test[i])  # Print the details of the job offer
    print("Predicted label:", y_pred[i])  # Print the predicted label
    print("Actual label:", y_test[i])  # Print the actual label
    print("--------------------")

# TODO model

#Evaluate the model
accuracy = model.score(X_test, y_test)
print("Accuracy:", accuracy)

joblib.dump(model, 'C:/Users/jacek/OneDrive/Pulpit/hunter/supervisionhack_fakejobhunter/hunter/data/models/model.pkl')

