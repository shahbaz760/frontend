


import React, { useState } from "react";

const ProductRow = ({ product, onQuantityChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState(product.quantity || 1);

  const handleQuantityChange = (e) => {
    const newQuantity = +e.target.value;

    if (newQuantity >= 1 && newQuantity <= 999999) { // Restrict between 1 and 6
      setQuantity(newQuantity);

      if (onQuantityChange) {
        onQuantityChange(product.id, newQuantity);
      }
    }
  };

  return (
    <div className="flex items-center gap-x-2 text-[#757982]">
      <label className="text-[14px] font-medium">Quantity:</label>
      {isEditing ? (
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          onBlur={() => setIsEditing(false)}
          className="h-[30px] p-2 border border-gray-300 rounded w-[70px] text-center"
          autoFocus
          min="1" 
          max="999999" 
        />
      ) : (
        <span
          className="h-[30px] rounded border px-8 py-2 text-center cursor-pointer flex items-center justify-center"
          onClick={() => setIsEditing(true)}
        >
          {quantity}
        </span>
      )}
    </div>
  );
};

export default ProductRow;
