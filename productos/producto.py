from conexionDB import create_connection, close_connection

class Producto:
    def __init__(self, nombre, descripcion, precio, stock):
        self.nombre = nombre
        self.descripcion = descripcion
        self.precio = precio
        self.stock = stock

    def crear_producto(self):
        cursor, connection = create_connection()
        if cursor is None or connection is None:
            return False
        
        try:
            query = "INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (self.nombre, self.descripcion, self.precio, self.stock))
            connection.commit()
            return True
        except mysql.connector.Error as err:
            print(f"Error al crear el producto: {err}")
            return False
        finally:
            close_connection(connection, cursor)

    @staticmethod
    def leer_productos():
        cursor, connection = create_connection()
        if cursor is None or connection is None:
            return None
        
        try:
            query = "SELECT * FROM productos"
            cursor.execute(query)
            productos = cursor.fetchall()
            return productos
        except mysql.connector.Error as err:
            print(f"Error al leer los productos: {err}")
            return None
        finally:
            close_connection(connection, cursor)

    @staticmethod
    def actualizar_producto(producto_id, nombre, descripcion, precio, stock):
        cursor, connection = create_connection()
        if cursor is None or connection is None:
            return False
        
        try:
            query = "UPDATE productos SET nombre = %s, descripcion = %s, precio = %s, stock = %s WHERE id = %s"
            cursor.execute(query, (nombre, descripcion, precio, stock, producto_id))
            connection.commit()
            return cursor.rowcount > 0
        except mysql.connector.Error as err:
            print(f"Error al actualizar el producto: {err}")
            return False
        finally:
            close_connection(connection, cursor)

    @staticmethod
    def borrar_producto(producto_id):
        cursor, connection = create_connection()
        if cursor is None or connection is None:
            return False
        
        try:
            query = "DELETE FROM productos WHERE id = %s"
            cursor.execute(query, (producto_id,))
            connection.commit()
            return cursor.rowcount > 0
        except mysql.connector.Error as err:
            print(f"Error al borrar el producto: {err}")
            return False
        finally:
            close_connection(connection, cursor)
