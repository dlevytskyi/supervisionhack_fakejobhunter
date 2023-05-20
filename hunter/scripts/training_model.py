from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
import joblib
from sklearn.feature_extraction.text import CountVectorizer
from vectorizer import prepare_words, read_words_from_file, create_unique_list_of_words
import numpy as np
import os
fake_dir = "../data/processed/fake"
genuine_dir = "../data/processed/genuine"

features = []
labels = []

def add_files_from_dir_to_model(offer_dir, label, features, labels):
    for filename in os.listdir(offer_dir):
        file_path = os.path.join(offer_dir, filename)
        if os.path.isfile(file_path):
            words = read_words_from_file(file_path)
            # print(words)
            prep_words = prepare_words(words)
            # print(prep_words)
            features.append(prep_words)
            labels.append(label)  
            # Open the file and read its contents
            # with open(file_path, 'r', encoding="utf-8", errors="ignore") as file:
            #     # Read the contents and append them to the list
            #     features.append(file.read())
            #     labels.append(label)
                
training_lists = add_files_from_dir_to_model(fake_dir, "fake", features, labels)
training_lists = add_files_from_dir_to_model(genuine_dir, "ok", features, labels)

features_as_strings = [' '.join(words) for words in features]
bag_words = read_words_from_file("C:/Users/jacek/OneDrive/Pulpit/hunter/supervisionhack_fakejobhunter/hunter/data/bag_words/tests.txt")
prepared_bag_words = prepare_words(bag_words)
unique_bag_words = create_unique_list_of_words(prepared_bag_words)
# prepared_bag_words = [' '.join(words) for words in prepared_bag_words]
# print(unique_bag_words)

count_vectorizer = CountVectorizer(vocabulary=unique_bag_words, lowercase=True)
X_count = count_vectorizer.fit_transform(features_as_strings)

X = X_count
y = np.array(labels)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)

print("Training set shape:", X_train.shape, y_train.shape)
print("Testing set shape:", X_test.shape, y_test.shape)

#Train a machine learning model
model = SVC()
model.fit(X_train, y_train)

#Evaluate the model
accuracy = model.score(X_test, y_test)
print("Accuracy:", accuracy)

joblib.dump(model, 'C:/Users/jacek/OneDrive/Pulpit/hunter/supervisionhack_fakejobhunter/hunter/data/models/model.pkl')

