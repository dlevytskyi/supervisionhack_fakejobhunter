import psycopg2
import csv
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("generate", type=str, help="Set 'train' or 'predict'")
args = parser.parse_args()

def db_conn():
    conn = psycopg2.connect(
        host="localhost",
        port="6432",
        database="local",
        user="admin",
        password="admin"
    )

    return conn.cursor()

cursor = db_conn()

if args.generate=="train":
    where_condition = "analyst_decision is not null" # for train
else:
    where_condition = "processing_status like 'NEW'" # for predict
temp_table_name = "temp_filtered_data"
create_table_query = f"CREATE TEMPORARY TABLE {temp_table_name} AS SELECT ID, CONTENT, ANALYST_DECISION FROM offers.offers WHERE {where_condition}"
cursor.execute(create_table_query)

with open(f"tmp/offers_{args.generate}.csv", "w", encoding="utf-8", newline="") as csv_file:
    cursor.copy_expert(f"COPY {temp_table_name} TO STDOUT WITH CSV HEADER", csv_file)

cursor.close()
conn.close()


