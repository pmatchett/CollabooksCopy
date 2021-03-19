COPY user_table (email,password,user_lon,user_lat,user_type,user_status,first_name,last_name)
FROM 'C:\Projects\CollabooksCopy\DB_Population.csv'
DELIMITER ','
CSV HEADER;

COPY book_table (title,author,isbn,genre,owner_id)
FROM 'C:\Projects\CollabooksCopy\DB_Books.csv'
DELIMITER ','
CSV HEADER;
