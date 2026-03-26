import psycopg2

passwords = ['', 'password', 'postgres', 'admin', '1234', '123456', 'root']
for pwd in passwords:
    try:
        conn = psycopg2.connect(f'postgresql://postgres:{pwd}@localhost:5432/postgres')
        print(f'SUCCESS with password: "{pwd}"')
        conn.close()
        break
    except Exception as e:
        print(f'FAILED with password "{pwd}": {str(e)[:80]}')
