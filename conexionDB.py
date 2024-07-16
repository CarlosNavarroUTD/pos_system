import mysql.connector

def connection():
    try:
        conexion = mysql.connector.connect(
            host='localhost',
            user='root',
            password='2014',
            database='bd_notas',
            charset='utf8mb4',
            collation='utf8mb4_general_ci'
        )
        return conexion





    except mysql.connector.Error as e:
        print(f"Error al conectar a MySQL: {e}")
        return None
    except Exception as e:
        print(f"Ocurrió un problema inesperado: {e}")
        return None