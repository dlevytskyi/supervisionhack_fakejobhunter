def preprocess_text(file_path):
    with open(file_path, "r", encoding="utf-8", errors="ignore") as file:
        content = file.read()

    lowercase_text = content.lower()
    words = lowercase_text.split()

    return print(words)