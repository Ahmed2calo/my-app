import React, { useState } from "react";

function Color() {
  const [color, setColor] = useState("");

  function handleColorChange(event) {
    setColor(event.target.value);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6 bg-gray-100">
      <h1 className="text-2xl font-bold">Color Picker</h1>

      <div
        className="w-64 h-32 rounded"
        style={{ backgroundColor: color }}
      >
        <p className="text-center mt-10 text-white">Selected Color: {color}</p>
      </div>

      <label className="text-lg font-medium" >Select color:</label>
      <input
        type="color"
        value={color}
        onChange={handleColorChange}
        className="w-16 h-10"
      />
    </div>
  );
}

export default Color;