import argparse
from text_preprocessing import preprocess_text

parser = argparse.ArgumentParser(description="Separate job offers into individual files.")
parser.add_argument("file_path", type=str, help="Path to the file containing basic files")
parser.add_argument("delimiter", type=str, help="Delimiter indicating the start of each job offer")
parser.add_argument("folder_name", type=str, help="Path where to add the processed files")
args = parser.parse_args()


with open(args.file_path, "r", encoding="utf-8", errors="ignore") as file:
    content = file.read()

job_offers = content.split(args.delimiter)  # Split the content based on the delimiter
job_offers = content.split("OPIS")  # Split the content based on the delimiter

# Iterate over the job offers and write each offer to a separate file
for i, offer in enumerate(job_offers):
    offer_file_path = f"../data/processed/{args.folder_name}/job_offer_{i+1}.txt"  # File name for each offer
    with open(offer_file_path, "w", encoding="utf-8") as offer_file:
        offer_file.write(offer.strip())
    print(f"Job offer {i+1} saved to {offer_file_path}.")
    words = preprocess_text(f"../data/processed/{args.folder_name}/job_offer_{i+1}.txt")
    print(words)

