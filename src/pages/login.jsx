import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import logoImg from "../Images/bakkahimmobilier.JPG";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/login", { email, password });
      const { access_token, user } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userRole", user.role);

      // Navigation basée sur le rôle
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.email?.[0] || "Identifiants incorrects.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-glass-card">
        <img src={logoImg} alt="Bakkah Immobilier" className="login-logo" />
        <h1>Bienvenue</h1>
        <p className="subtitle">Connectez-vous pour suivre vos projets</p>
        
        {error && <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "15px" }}>{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="email">Adresse Email</label>
            <input
              type="email"
              id="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="login-form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        
        <p className="signup-link">
          Pas encore de compte ?
          <span onClick={() => navigate("/signup")} className="link-text">
            Créer un compte
          </span>
        </p>
        

      </div>
    </div>
  );
}
