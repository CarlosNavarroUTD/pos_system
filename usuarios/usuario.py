from conexionDB import ConexionDB

class Usuario:
    def __init__(self, id=None, nombre=None, apellido=None, email=None, password=None):
        self.id = id
        self.nombre = nombre
        self.apellido = apellido
        self.email = email
        self.password = password
        self.db = ConexionDB()

    def crear(self):
        try:
            cursor = self.db.conexion.cursor()
            sql = """INSERT INTO usuarios (nombre, apellido, email, password) 
                     VALUES (%s, %s, %s, %s)"""
            valores = (self.nombre, self.apellido, self.email, self.password)
            cursor.execute(sql, valores)
            self.db.conexion.commit()
            self.id = cursor.lastrowid
            return True
        except Exception as e:
            print(f"Error al crear usuario: {e}")
            return False

    def leer(self, id=None):
        try:
            cursor = self.db.conexion.cursor()
            if id:
                sql = "SELECT * FROM usuarios WHERE id = %s"
                cursor.execute(sql, (id,))
                usuario = cursor.fetchone()
                if usuario:
                    self.id, self.nombre, self.apellido, self.email, self.password = usuario
                return usuario
            else:
                sql = "SELECT * FROM usuarios"
                cursor.execute(sql)
                return cursor.fetchall()
        except Exception as e:
            print(f"Error al leer usuario(s): {e}")
            return None

    def actualizar(self):
        try:
            cursor = self.db.conexion.cursor()
            sql = """UPDATE usuarios SET nombre = %s, apellido = %s, 
                     email = %s, password = %s WHERE id = %s"""
            valores = (self.nombre, self.apellido, self.email, self.password, self.id)
            cursor.execute(sql, valores)
            self.db.conexion.commit()
            return True
        except Exception as e:
            print(f"Error al actualizar usuario: {e}")
            return False

    def eliminar(self):
        try:
            cursor = self.db.conexion.cursor()
            sql = "DELETE FROM usuarios WHERE id = %s"
            cursor.execute(sql, (self.id,))
            self.db.conexion.commit()
            return True
        except Exception as e:
            print(f"Error al eliminar usuario: {e}")
            return False