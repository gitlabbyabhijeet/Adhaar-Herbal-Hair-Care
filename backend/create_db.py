import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

conn = psycopg2.connect('postgresql://postgres:1234@localhost:5432/postgres')
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
cur = conn.cursor()

cur.execute("SELECT 1 FROM pg_database WHERE datname = 'adhaar_db'")
exists = cur.fetchone()
if not exists:
    cur.execute("CREATE DATABASE adhaar_db")
    print("Database 'adhaar_db' created successfully!")
else:
    print("Database 'adhaar_db' already exists.")

cur.close()
conn.close()
