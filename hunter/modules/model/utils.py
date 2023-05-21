import re
import csv
import json

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

def create_unique_bag_words(bag_words, stop_words):
    words = []
    for text in bag_words:
        text = text.lower()
        text = remove_non_alphanumeric(text)
        words.extend(text.split())
        filtered_bag_words = [word for word in words if word not in stop_words]
        unique_bag_words = create_unique_list_of_words(filtered_bag_words)
    return unique_bag_words

def create_features_and_labels(offers,stop_words):
    features = []
    labels = []
    ids = []
    with open(offers, 'r', encoding='utf-8') as file:
        reader = csv.reader(file)
        next(reader)  # Skip the header row if present

        for row in reader:
            id = row[0] 
            content = row[1]
            decision = row[2]

            # Convert JSON content to text
            content = json.loads(content)['content']

            # Remove non-alphanumeric and non-whitespace characters
            content = remove_non_alphanumeric(content)

            # Process the text
            processed_text = process_text(content, stop_words)

            features.append(processed_text)
            labels.append(decision)
            ids.append(id)
    return features, labels, ids
