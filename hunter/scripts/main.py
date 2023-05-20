import sys
from text_preprocessing import preprocess_text

# Check if the file path is provided as a command line argument
if len(sys.argv) > 1:
    file_path = sys.argv[1]
    words = preprocess_text(file_path)

    # Print the preprocessed words
    print(words)
else:
    print("Please provide a file path as a command line argument.")