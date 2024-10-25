import React, { useState, useEffect } from 'react';

const Tooltip = ({ message, position }) => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    if (position) {
      setStyle({
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y - 30}px`,
      });
    }
  }, [position]);

  return (
    <div className="bg-black text-white text-xs rounded py-1 px-2 absolute z-10" style={style}>
      {message}
    </div>
  );
};

export default Tooltip;