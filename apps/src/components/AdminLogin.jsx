import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import styles from "../components/CSS/AdminLogin.module.css";

const API_URL = "http://localhost:5000"; // URL backend kamu

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Login hardcoded sementara
    if (username === "admin" && password === "admin123") {
      onLogin();
    } else {
      alert("Username atau password salah!");
    }

    // Kalau mau login ke server, bisa pakai ini:
    /*
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        onLogin();
      } else {
        alert(data.message || "Login gagal");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Terjadi kesalahan saat login");
    }
    */
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles["login-container"]}>
        <div className={styles["login-card"]}>
          <h2>ADMIN LOGIN</h2>

          <div className={styles["input-group"]}>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FaUser className={styles.icon} />
          </div>

          <div className={styles["input-group"]}>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className={styles.icon} />

          </div>

          <Button
            className={styles["login-button"]}
            onClick={handleLogin}
          >
            Login
          </Button>

        </div>
      </div>
    </div>
  );
}

export default AdminLogin;