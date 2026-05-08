import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const [name, setName] = useState("");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "300px" }}>
        <h1>Register</h1>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "20px",
          }}
        />

        <p>{name}</p>
      </div>
    </div>
  );
}