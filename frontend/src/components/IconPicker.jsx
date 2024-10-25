import React, { useState } from "react";
import { FaBeer, FaCoffee, FaApple, FaSmile } from "react-icons/fa"; // Ejemplos de íconos

const IconPicker = () => {
  const [isOpen, setIsOpen] = useState(false); // Controla si el popup está abierto o cerrado
  const [selectedIcon, setSelectedIcon] = useState(null); // Almacena el ícono seleccionado

  const icons = [FaBeer, FaCoffee, FaApple, FaSmile]; // Lista de íconos disponibles

  // Abre o cierra el popup
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  // Selecciona un ícono y cierra el popup
  const handleIconClick = (Icon) => {
    setSelectedIcon(<Icon />);
    setIsOpen(false);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Botón que muestra el ícono seleccionado o texto si no hay selección */}
      <button onClick={togglePopup} style={{ padding: "10px", fontSize: "20px" }}>
        {selectedIcon ? selectedIcon : "Seleccionar Ícono"}
      </button>

      {/* Ventana emergente para seleccionar el ícono */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "10px",
            zIndex: 1000,
            display: "grid",
            gridTemplateColumns: "repeat(4, 50px)", // Cambiar el número para más o menos íconos por fila
            gap: "10px",
          }}
        >
          {icons.map((Icon, index) => (
            <button
              key={index}
              onClick={() => handleIconClick(Icon)}
              style={{
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                fontSize: "24px",
              }}
            >
              <Icon />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default IconPicker;
