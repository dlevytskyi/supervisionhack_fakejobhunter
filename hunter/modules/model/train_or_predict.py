from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from ... import dbconfig
from utils import remove_non_alphanumeric, create_unique_list_of_words, read_words_from_file, process_text, create_unique_bag_words, create_features_and_labels
import numpy as np
import joblib
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("generate", type=str, help="Set 'train' or 'predict'")
args = parser.parse_args()

bag_words = read_words_from_file("../../data/bag_words/tests.txt")
stop_words = read_words_from_file("../../data/stop_words.txt")

if args.generate=="train":
    offers = '../../tmp/offers_train.csv'
else:
    offers = '../../tmp/offers_predict.csv' # predict

features, labels, ids = create_features_and_labels(offers, stop_words)

unique_bag_words = create_unique_bag_words(bag_words, stop_words)

count_vectorizer = CountVectorizer(vocabulary=unique_bag_words, lowercase=True)
X_count = count_vectorizer.fit_transform(features)

if args.generate=="train":
    X = X_count
    y = np.array(labels)

    # TODO vectorizer to utils/train
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training set shape:", X_train.shape, y_train.shape)
    print("Testing set shape:", X_test.shape, y_test.shape)

    #Train a machine learning model
    model = SVC()
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

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

    #Evaluate the model
    accuracy = model.score(X_test, y_test)
    print("Accuracy:", accuracy)

    joblib.dump(model, '../../models/model.pkl')
else:
    loaded_model = joblib.load('../../models/model.pkl')
    cursor = db_conn()
    for i in range(len(features)):
        X_count = count_vectorizer.fit_transform([features[i]])
        predicted_label = loaded_model.predict(X_count)
        create_update = f"UPDATE OFFERS.OFFERS SET MODEL_DECISION = '{predicted_label}' WHERE ID = {ids[i]} "
        cursor.execute(create_update)
    cursor.close()