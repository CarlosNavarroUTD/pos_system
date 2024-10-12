CREATE TABLE `Usuario` (
  `id_usuario` integer PRIMARY KEY,
  `nombre_usuario` varchar(255) UNIQUE,
  `email` varchar(255) UNIQUE,
  `contrasena` varchar(255),
  `tipo_usuario` ENUM(administrador,cajero)
);

CREATE TABLE `Persona` (
  `id_persona` integer PRIMARY KEY,
  `id_usuario` integer UNIQUE,
  `nombre` varchar(255),
  `apellido` varchar(255)
);

CREATE TABLE `Cliente` (
  `id_cliente` integer PRIMARY KEY,
  `nombre` varchar(255),
  `apellido` varchar(255),
  `email` varchar(255),
  `telefono` varchar(255),
  `direccion` text
);

CREATE TABLE `Producto` (
  `id_producto` integer PRIMARY KEY,
  `nombre` varchar(255),
  `descripcion` text,
  `precio` decimal(10,2),
  `stock` integer,
  `estado` ENUM(activo,inactivo)
);

CREATE TABLE `Venta` (
  `id_venta` integer PRIMARY KEY,
  `id_usuario` integer,
  `id_cliente` integer,
  `fecha` date,
  `total` decimal(10,2),
  `metodo_pago` ENUM(efectivo,tarjeta,transferencia),
  `estado` ENUM(completada,cancelada)
);

CREATE TABLE `Detalle_Venta` (
  `id_detalle` integer PRIMARY KEY,
  `id_venta` integer,
  `id_producto` integer,
  `cantidad` integer,
  `precio_unitario` decimal(10,2),
  `subtotal` decimal(10,2)
);

CREATE TABLE `Movimiento_Inventario` (
  `id_movimiento` integer PRIMARY KEY,
  `id_producto` integer,
  `id_usuario` integer,
  `tipo_movimiento` ENUM(entrada,salida),
  `cantidad` integer,
  `fecha_movimiento` date,
  `descripcion` text
);

ALTER TABLE `Persona` ADD FOREIGN KEY (`id_usuario`) REFERENCES `Usuario` (`id_usuario`);

ALTER TABLE `Venta` ADD FOREIGN KEY (`id_usuario`) REFERENCES `Usuario` (`id_usuario`);

ALTER TABLE `Venta` ADD FOREIGN KEY (`id_cliente`) REFERENCES `Cliente` (`id_cliente`);

ALTER TABLE `Detalle_Venta` ADD FOREIGN KEY (`id_venta`) REFERENCES `Venta` (`id_venta`);

ALTER TABLE `Detalle_Venta` ADD FOREIGN KEY (`id_producto`) REFERENCES `Producto` (`id_producto`);

ALTER TABLE `Movimiento_Inventario` ADD FOREIGN KEY (`id_producto`) REFERENCES `Producto` (`id_producto`);

ALTER TABLE `Movimiento_Inventario` ADD FOREIGN KEY (`id_usuario`) REFERENCES `Usuario` (`id_usuario`);

ALTER TABLE `Producto` ADD FOREIGN KEY (`descripcion`) REFERENCES `Movimiento_Inventario` (`descripcion`);
