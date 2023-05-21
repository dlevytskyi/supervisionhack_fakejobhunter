# -*- coding: utf-8 -*-

from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
#from spacy.lang.pl import Polish
# import argparse
import re

# parser = argparse.ArgumentParser()
# parser.add_argument("bag_words_dir", type=str, help="Path to the bag words file")
# parser.add_argument("stop_words_dir", type=str, help="Path to the stop words file")
# args = parser.parse_args()

# Read the stop words from the file
def read_words_from_file(file_dir):
    try:
        with open(file_dir, 'r', encoding='utf-8') as file:
            words = file.read().splitlines()
    except FileNotFoundError:
        print("file not found.")
        exit(1)
    return words

stop_words = read_words_from_file("C:/Users/jacek/OneDrive/Pulpit/hunter/supervisionhack_fakejobhunter/hunter/data/stop_words.txt")
bag_words = read_words_from_file("C:/Users/jacek/OneDrive/Pulpit/hunter/supervisionhack_fakejobhunter/hunter/data/bag_words/required.txt")

# def remove_extra_whitespace_tabs(text):
#     pattern = r'^/s|\s\s'
#     x = re.sub(pattern, ' ', text).strip()
#     return x

def lower_and_split(text):
    #lower and split
    text = [document.lower().split() for document in text]
    return text

def remove_special_characters(text):
    # Define the pattern to match special characters
    pattern = r'[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]'  # Remove non-alphanumeric and non-whitespace characters

    # Remove special characters using regular expressions
    cleaned_text = re.sub(pattern, '', text)

    return cleaned_text  

def extend_to_list_of_words(text):
    # return [word for word in words if word.casefold() not in stop_words]
    # Create an empty list to store the words
    list_of_words = []
    # Iterate over each document
    for document in text:
        # Extend the list_of_words with the words from the document
        list_of_words.extend(document)
    return list_of_words

def remove_stop_words(words):
    result = []
    for word in words:
        if word.casefold() not in stop_words:
            result.append(remove_special_characters(word))
    return result

def create_unique_list_of_words(words_list):
    unique_list = list(set(words_list))
    return unique_list

def prepare_words(words):
    # words = remove_special_characters(words)
    text = lower_and_split(words)
    # text = remove_extra_whitespace_tabs(text)
    list_of_words = extend_to_list_of_words(text)
    list_of_words_after_remove = remove_stop_words(list_of_words)
    # unique_list = create_unique_list_of_words(list_of_words_after_remove)
    return list_of_words_after_remove

# count_vectorizer = CountVectorizer(vocabulary=prepared_bag_words, lowercase=True)
# X_count = count_vectorizer.fit_transform(prepared_words)

# Download stopwords if not already downloaded
#nltk.download('stopwords')
            
# print(f"list_of_words after stoopwords: {result}")
# CountVectorizer with custom bag words


# # TfidfVectorizer with custom bag words
# tfidf_vectorizer = TfidfVectorizer(vocabulary=bag_words, lowercase=True)
# X_tfidf = tfidf_vectorizer.fit_transform(result)

# # Access the feature names and the transformed feature vectors
# feature_names_count = count_vectorizer.get_feature_names_out()
# print("CountVectorizer feature names:", feature_names_count)
# print("CountVectorizer feature vectors:\n", X_count.toarray())

# feature_names_tfidf = tfidf_vectorizer.get_feature_names_out()
# print("TfidfVectorizer feature names:", feature_names_tfidf)
# print("TfidfVectorizer feature vectors:\n", X_tfidf.toarray())