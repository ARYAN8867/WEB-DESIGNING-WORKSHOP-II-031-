import React from "react";

export default function App() {
  const products = [
    {
      name: "Wireless Mouse",
      price: "₹799",
      category: "Electronics",
      color: "blue",
      bg: "#cfe8f3",
    },
    {
      name: "Running Shoes",
      price: "₹2499",
      category: "Footwear",
      color: "green",
      bg: "#b8f5b8",
    },
    {
      name: "Smart Watch",
      price: "₹3999",
      category: "Gadgets",
      color: "red",
      bg: "#ffc0cb",
    },
  ];

  return (
    <div
      style={{
        background: "#f5f3dc",
        minHeight: "100vh",
        textAlign: "center",
        padding: "30px",
      }}
    >
      <h1 style={{ color: "maroon" }}>Product Showcase</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          flexWrap: "wrap",
          marginTop: "40px",
        }}
      >
        {products.map((item, index) => (
          <div
            key={index}
            style={{
              width: "300px",
              padding: "20px",
              border: `3px solid ${item.color}`,
              borderRadius: "20px",
              background: item.bg,
            }}
          >
            <h2>{item.name}</h2>
            <h3>Price: {item.price}</h3>
            <h3>Category: {item.category}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}