def open_file(file_path):
    with open(file_path, "r", encoding="utf-8", errors="ignore") as file:
        content = file.read()

def add_files_from_directory_to_database(file_dir):
    data = open_file(file_dir)
    