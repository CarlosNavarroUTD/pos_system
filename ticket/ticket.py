from conexionDB import create_connection, close_connection
from cliente.cliente import Cliente

class Ticket:
    def __init__(self, usuario_id, cliente_id, productos):
        self.usuario_id = usuario_id
        self.cliente_id = cliente_id
        self.productos = productos
        self.total = 0
        self.fecha = None

    def generar_ticket(self):
        self.total = self.calcular_total()
        self.fecha = datetime.now()
        cursor, connection = create_connection()
        if cursor is None or connection is None:
            return False

        try:
            query = "INSERT INTO tickets (usuario_id, cliente_id, total, fecha) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (self.usuario_id, self.cliente_id, self.total, self.fecha))
            ticket_id = cursor.lastrowid

            for producto in self.productos:
                query = "INSERT INTO ticket_productos (ticket_id, producto_id, cantidad) VALUES (%s, %s, %s)"
                cursor.execute(query, (ticket_id, producto['id'], producto['cantidad']))

            connection.commit()
            self.aplicar_puntos()
            return True
        except mysql.connector.Error as err:
            print(f"Error al generar el ticket: {err}")
            return False
        finally:
            close_connection(connection, cursor)

    def calcular_total(self):
        total = 0
        for producto in self.productos:
            total += producto['precio'] * producto['cantidad']
        return total

    def aplicar_puntos(self):
        cliente = self.obtener_cliente(self.cliente_id)
        if cliente:
            cliente.acumular_puntos(self.total)

    def obtener_cliente(self, cliente_id):
        cursor, connection = create_connection()
        if cursor is None or connection is None:
            return None

        try:
            query = "SELECT * FROM clientes WHERE id = %s"
            cursor.execute(query, (cliente_id,))
            result = cursor.fetchone()
            if result:
                return Cliente(result[1], result[2], result[3], result[4], result[5])
            return None
        except mysql.connector.Error as err:
            print(f"Error al obtener el cliente: {err}")
            return None
        finally:
            close_connection(connection, cursor)
