import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import styles from "../components/CSS/AdminLogin.module.css";

const API_URL = "http://localhost:5000";

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg(""); // clear error dulu

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Simpan token + username
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);

        // Redirect (panggil parent function)
        onLogin();
      } else {
        setErrorMsg(data.message || "Login gagal, cek username/password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Terjadi kesalahan koneksi ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles["login-container"]}>
        <div className={styles["login-card"]}>
          <h2>ADMIN LOGIN</h2>

          {errorMsg && (
            <div className="text-red-500 text-center mb-4">{errorMsg}</div>
          )}

          <div className={styles["input-group"]}>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FaUser className={styles.icon} />
          </div>

          <div className={styles["input-group"]}>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className={styles.icon} />
          </div>

          <Button
            className={styles["login-button"]}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
