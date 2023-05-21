from database import db_conn, db_close

db_conn()

def create_tmp_data_from_db():
    where_condition = "processing_status = 'NEW'"  # Replace with your own condition
    temp_table_name = "temp_filtered_data"
    create_table_query = f"CREATE TEMPORARY TABLE {temp_table_name} AS SELECT * FROM offers.offers WHERE {where_condition}"
    cursor.execute(create_table_query)

    with open("tmp/offers.csv", "w", encoding="utf-8", newline="") as csv_file:
        cursor.copy_expert(f"COPY {temp_table_name} TO STDOUT WITH CSV HEADER", csv_file)

db_close()
