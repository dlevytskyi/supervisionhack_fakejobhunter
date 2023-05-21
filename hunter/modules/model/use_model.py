from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
import joblib
from vectorizer import prepare_words, read_words_from_file, create_unique_list_of_words
from sklearn.feature_extraction.text import CountVectorizer
import pandas as pd

# Read the CSV file
data = read_words_from_file("C:/Users/jacek/OneDrive/Pulpit/hunter/supervisionhack_fakejobhunter/hunter/data/processed/fake/job_offer_21.txt")
# data = pd.read_csv('C:/Users/jacek/OneDrive/Pulpit/hunter/supervisionhack_fakejobhunter/hunter/data/raw/test/offers.csv')

loaded_model = joblib.load('C:/Users/jacek/OneDrive/Pulpit/hunter/supervisionhack_fakejobhunter/hunter/data/models/model.pkl')
# Set the variable to data from a specific column

def analyse_data(content):
    features = []
    # Preprocess the new dataset
    # words = read_words_from_file("C:/Users/jacek/OneDrive/Pulpit/hunter/supervisionhack_fakejobhunter/hunter/data/raw/test/new_one.txt")
    prep_words = prepare_words(content)
    features.append(prep_words)
    features_as_strings = [' '.join(words) for words in features]

    bag_words = read_words_from_file("C:/Users/jacek/OneDrive/Pulpit/hunter/supervisionhack_fakejobhunter/hunter/data/bag_words/tests.txt")
    prepared_bag_words = prepare_words(bag_words)
    unique_bag_words = create_unique_list_of_words(prepared_bag_words)

    count_vectorizer = CountVectorizer(vocabulary=unique_bag_words, lowercase=True)
    X_count = count_vectorizer.fit_transform(features_as_strings)

    predicted_labels = loaded_model.predict(X_count)

    print(predicted_labels)
    
    return predicted_labels

# for index, row in data.iterrows():
#     # Access the values of each column
#     column1_value = row['content']
#     # print(column1_value)
#     column2_value = row['url']
#     # Perform operations with the values or do something else
#     score = analyse_data(column1_value)
#     if score=="fake":
#         # Print the values of each column
#         print("Row", index, "- content:", column1_value, "url:", column2_value)


score = analyse_data(data)

# count_vectorizer = CountVectorizer(vocabulary=unique_bag_words, lowercase=True)
# X_count = count_vectorizer.fit_transform(features_as_strings)

# X = X_count


# # Transform the preprocessed data into numerical features
# numerical_features = vectorizer.transform(preprocessed_data)

# # Use the loaded model to predict labels