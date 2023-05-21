import csv
import json
import re
from sklearn.feature_extraction.text import CountVectorizer
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC

features = []
labels = []
words = []

def remove_non_alphanumeric(text):
    # Remove non-alphanumeric and non-whitespace characters, including Polish letters
    return re.sub(r'[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]', '', text)

def create_unique_list_of_words(words_list):
    unique_list = list(set(words_list))
    return unique_list

def read_words_from_file(file_dir):
    try:
        with open(file_dir, 'r', encoding='utf-8') as file:
            words = file.read().splitlines()
    except FileNotFoundError:
        print("file not found.")
        exit(1)
    return words

def process_text(text, stop_words):
    # Convert the text to lowercase
    text = text.lower()

    # Split the text into individual words
    words = text.split()

    # Remove stop words
    words = [word for word in words if word.lower() not in stop_words]

    # Concatenate the words back into a single text
    processed_text = ' '.join(words)
    return processed_text.lower()

# Read the CSV file
with open('../../tmp/offers.csv', 'r', encoding='utf-8') as file:
    reader = csv.reader(file)
    next(reader)  # Skip the header row if present

    for row in reader:
        content = row[0]
        decision = row[1]

        # Convert JSON content to text
        content = json.loads(content)['content']

        # Remove non-alphanumeric and non-whitespace characters
        content = remove_non_alphanumeric(content)

        # Process the text
        stop_words = read_words_from_file("../../data/stop_words.txt")
        processed_text = process_text(content, stop_words)

        features.append(processed_text)
        labels.append(decision)

        # print(f"Processed Text: {processed_text}")
        # print(f"Analyst Decision: {decision}")
        # print("---")
    
bag_words = read_words_from_file("../../data/bag_words/tests.txt")

for text in bag_words:
    text = text.lower()
    text = remove_non_alphanumeric(text)
    words.extend(text.split())
    filtered_bag_words = [word for word in words if word not in stop_words]
    unique_bag_words = create_unique_list_of_words(filtered_bag_words)

print(unique_bag_words)
print(features)
count_vectorizer = CountVectorizer(vocabulary=unique_bag_words, lowercase=True)
X_count = count_vectorizer.fit_transform(features)

X = X_count
y = np.array(labels)

# TODO vectorizer to utils/train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Training set shape:", X_train.shape, y_train.shape)
print("Testing set shape:", X_test.shape, y_test.shape)

#Train a machine learning model
model = SVC()
model.fit(X_train, y_train)