import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";
import logoImg from "../Images/bakkahimmobilier.JPG";
import api from "../api";

export default function Signup() {
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/register", {
        name: nom,
        email: email,
        password: password,
        phone: telephone
      });

      const { access_token, user } = response.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userRole", user.role);

      // Redirection vers le dashboard approprié
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.email?.[0] || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-glass-card">
        <img src={logoImg} alt="Bakkah Immobilier" className="signup-logo" />
        <h1>Inscription</h1>
        <p className="subtitle">Créez votre compte pour suivre vos futurs projets</p>
        
        {error && <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "15px" }}>{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="signup-form-grid">
            <div className="signup-form-group">
              <label htmlFor="nom">Nom complet</label>
              <input
                type="text"
                id="nom"
                placeholder="Ex: Ahmed Alaoui"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="signup-form-group">
              <label htmlFor="telephone">Téléphone</label>
              <input
                type="tel"
                id="telephone"
                placeholder="06 XX XX XX XX"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="signup-form-group">
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
            <div className="signup-form-group">
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
          </div>
          
          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>
        
        <p className="login-link">
          Vous avez déjà un compte ?
          <span onClick={() => navigate("/login")} className="link-text">
            Se connecter
          </span>
        </p>
      </div>
    </div>
  );
}
