import psycopg2
import csv

conn = psycopg2.connect(
    host="localhost",
    port="6432",
    database="local",
    user="admin",
    password="admin"
)

cursor = conn.cursor()

where_condition = "MODEL_DECISION IS NULL"  # Replace with your own condition
temp_table_name = "temp_filtered_data"
create_table_query = f"CREATE TEMPORARY TABLE {temp_table_name} AS SELECT CONTENT, ANALIST_DECISION FROM offers.offers WHERE {where_condition}"
cursor.execute(create_table_query)

with open("tmp/offers.csv", "w", encoding="utf-8", newline="") as csv_file:
    cursor.copy_expert(f"COPY {temp_table_name} TO STDOUT WITH CSV HEADER", csv_file)

cursor.close()
conn.close()


