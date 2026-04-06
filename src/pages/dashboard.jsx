import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./dashboard.css";
import logoImg from "../Images/bakkahimmobilier.JPG";
import luxuryApartment from "../Images/luxury_apartment.png";
import mohammadiaImg from "../Images/appartment_mohammedia.jpg";
import villaRabatImg from "../Images/villa-Rabat.jpg";
import luxuryVilla from "../Images/luxury_villa.png";
import cfcTowerImg from "../Images/Cfc.jpg";
import businessCenter from "../Images/business_center.png";
import aboutTeam from "../Images/about_team.png";
import api from "../api";
import {
  Home,
  Info,
  Settings,
  Search,
  Bell,
  MapPin,
  TrendingUp,
  Layout,
  ShieldCheck,
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  ExternalLink,
  Clock,
  CheckCircle2,
  Calendar,
  LogOut,
  Lock,
  Mail,
  Phone,
  FileText,
  Building,
} from "lucide-react";

function ContactForm() {
  const [subject, setSubject] = useState("Renseignements projet");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Veuillez écrire un message.");
      return;
    }
    setSending(true);
    try {
      await api.post("/contact", { subject, message });
      toast.success("Message envoyé avec succès !");
      setMessage("");
    } catch (error) {
      toast.error(
        "Erreur lors de l'envoi : " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      style={{
        background: "rgba(255,255,255,0.03)",
        padding: "30px",
        borderRadius: "24px",
        border: "1px solid var(--glass-border)",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
      onSubmit={handleSubmit}
    >
      <h3 style={{ fontSize: "20px" }}>Envoyez-nous un message</h3>

      <div className="s-group">
        <label>Sujet</label>
        <select
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--glass-border)",
            borderRadius: "12px",
            color: "white",
            outline: "none",
            cursor: "pointer",
          }}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option style={{ background: "#1a1a2e", color: "white" }}>
            Renseignements projet
          </option>
          <option style={{ background: "#1a1a2e", color: "white" }}>
            Support technique
          </option>
          <option style={{ background: "#1a1a2e", color: "white" }}>
            Prise de rendez-vous
          </option>
          <option style={{ background: "#1a1a2e", color: "white" }}>
            Autre
          </option>
        </select>
      </div>

      <div className="s-group">
        <label>Message</label>
        <textarea
          rows="5"
          placeholder="Comment pouvons-nous vous aider ?"
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--glass-border)",
            borderRadius: "12px",
            color: "white",
            outline: "none",
            resize: "vertical",
          }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
      </div>

      <button type="submit" className="save-btn" disabled={sending}>
        {sending ? "Envoi..." : "Envoyer le message"}
      </button>
    </form>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeMenu, setActiveMenu] = useState("accueil");
  const [showAI, setShowAI] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Bonjour ! Je suis votre assistant Bakkah Immobilier. Comment puis-je vous aider aujourd'hui ?",
      sender: "ai",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const initialProjectsData = [
    {
      id: "cfc-tower",
      name: "Immeuble CFC Tower",
      location: "Casablanca, CFC",
      progress: 65,
      status: "Gros ï¿½uvre en cours",
      total_value: 45000000,
      delivery_date: "2026-12-31",
      image_path: "Cfc.jpg",
      image: cfcTowerImg,
      type: "Bureaux",
      steps: [
        { id: "s1", label: "Terrassement", status: "completed", order_num: 1 },
        { id: "s2", label: "Fondations", status: "completed", order_num: 2 },
        { id: "s3", label: "Gros ï¿½uvre", status: "in-progress", order_num: 3 },
        { id: "s4", label: "ï¿½0tanchéité", status: "pending", order_num: 4 },
      ],
    },
  ];

  const [projects, setProjects] = useState(initialProjectsData);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // User Profile State
  const [profile, setProfile] = useState({
    name: "Chargement...",
    email: "",
    phone: "",
    avatar: "?",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setProfile({
          name: user.name || "Utilisateur",
          email: user.email || "",
          phone: user.phone || "",
          avatar: user.name
            ? user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .substring(0, 2)
            : "U",
        });
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
    fetchUserProjects();
  }, []);

  const fetchUserProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await api.get("/projects");
      if (response.data && response.data.length > 0) {
        // Mapping pour les images locales basées sur image_path de la DB
        const mappedProjects = response.data.map((p) => ({
          ...p,
          name:
            p.image_path === "luxury_apartment.png"
              ? "appartement mohammadia"
              : p.name,
          location:
            p.image_path === "luxury_apartment.png"
              ? "Mohammadia"
              : p.image_path === "luxury_villa.png"
                ? "Rabat, Maroc"
                : p.location,
          image:
            p.image_path === "luxury_apartment.png" ||
            p.image_path === "appartment_mohammedia.jpg"
              ? mohammadiaImg
              : p.image_path === "luxury_villa.png" ||
                  p.image_path === "villa-Rabat.jpg"
                ? villaRabatImg
                : p.image_path === "business_center.png"
                  ? businessCenter
                  : p.image_path === "Cfc.jpg" ||
                      p.image_path === "cfc_tower.jpg"
                    ? cfcTowerImg
                    : luxuryApartment,
          type:
            p.image_path === "business_center.png" ? "Bureaux" : "Résidentiel",
        }));
        setProjects([...initialProjectsData, ...mappedProjects]);
      } else {
        setProjects(initialProjectsData);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects(initialProjectsData);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear localStorage et rediriger
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      navigate("/login");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("/user/profile", {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
      });

      // Update local storage
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, ...response.data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update generic generic avatar if needed
      setProfile((prev) => ({
        ...prev,
        ...response.data.user,
        avatar: response.data.user.name
          ? response.data.user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .substring(0, 2)
          : "U",
      }));

      toast.success(response.data.message || "Profil mis à jour avec succès");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Erreur : " + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error("La confirmation du mot de passe ne correspond pas.");
      return;
    }

    try {
      await api.put("/user/password", {
        current_password: passwords.current,
        new_password: passwords.new,
        new_password_confirmation: passwords.confirm,
      });

      toast.success("Mot de passe mis à jour avec succès");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error) {
      console.error("Password update error:", error);
      toast.error("Erreur : " + (error.response?.data?.message || error.message));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMessage = { text: inputValue, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await api.post("/chat", { message: userMessage.text });
      setMessages((prev) => [
        ...prev,
        { text: response.data.answer, sender: "ai" },
      ]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Erreur inconnue";
      setMessages((prev) => [
        ...prev,
        {
          text: `Désolé, une erreur est survenue (${errorMessage}). Veuillez réessayer plus tard.`,
          sender: "ai",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const filteredProjects = (projects || []).filter((p) => {
    const name = p?.name || "";
    const location = p?.location || "";
    const query = searchQuery?.toLowerCase() || "";

    return (
      name.toLowerCase().includes(query) ||
      location.toLowerCase().includes(query)
    );
  });

  return (
    <div className="dashboard-wrapper">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={logoImg} alt="Logo" />
          <span>Bakkah Immobilier</span>
        </div>

        <nav className="sidebar-menu">
          <div
            className={`nav-item ${activeMenu === "accueil" ? "active" : ""}`}
            onClick={() => setActiveMenu("accueil")}
          >
            <Home size={20} />
            <span>Accueil</span>
          </div>
          <div
            className={`nav-item ${activeMenu === "about" ? "active" : ""}`}
            onClick={() => setActiveMenu("about")}
          >
            <Info size={20} />
            <span>Qui sommes-nous</span>
          </div>
          <div
            className={`nav-item ${activeMenu === "projects" ? "active" : ""}`}
            onClick={() => setActiveMenu("projects")}
          >
            <Layout size={20} />
            <span>Mes Projets</span>
          </div>
          <div
            className={`nav-item ${activeMenu === "contact" ? "active" : ""}`}
            onClick={() => setActiveMenu("contact")}
          >
            <Mail size={20} />
            <span>Contact</span>
          </div>
          <div
            className={`nav-item ${activeMenu === "settings" ? "active" : ""}`}
            onClick={() => setActiveMenu("settings")}
          >
            <Settings size={20} />
            <span>Paramètres</span>
          </div>
        </nav>

        <div style={{ marginTop: "auto" }}>
          <div
            className="nav-item logout"
            onClick={handleLogout}
            style={{ color: "#f87171" }}
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </div>
        </div>
      </aside>

      <main className="dashboard-main">
        {/* TOP NAV */}
        <header className="top-nav">
          <div className="search-bar">
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="user-profile" style={{ position: "relative" }}>
            <div
              className="avatar"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ cursor: "pointer" }}
            >
              {profile.avatar}
            </div>

            {showProfileMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "8px",
                  background: "#0f0f1b",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "12px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                  padding: "8px",
                  zIndex: 100,
                  width: "160px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  animation: "fadeIn 0.2s ease-out"
                }}
              >
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setActiveMenu("settings");
                    setShowProfileMenu(false);
                  }}
                >
                  <Settings size={16} /> Mon Profil
                </div>
                <div
                  className="dropdown-item logout-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    handleLogout();
                  }}
                >
                  <LogOut size={16} /> Déconnexion
                </div>
              </div>
            )}
          </div>
        </header>

        {/* CONTENT */}
        <div className="dashboard-content">
          {activeMenu === "accueil" && (
            <>
              <section className="welcome-section">
                <h1>Bienvenue sur votre Dashboard</h1>
                <p>
                  Suivez l'évolution de vos investissements immobiliers en temps
                  réel.
                </p>
              </section>

              {/* STATS */}
              <section className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <Layout size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>{projects.length}</h3>
                    <p>Projets Totaux</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div
                    className="stat-icon"
                    style={{
                      background: "rgba(16, 185, 129, 0.1)",
                      color: "#10b981",
                    }}
                  >
                    <TrendingUp size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>
                      {projects.length > 0
                        ? Math.round(
                            projects.reduce((acc, p) => acc + p.progress, 0) /
                              projects.length,
                          )
                        : 0}
                      %
                    </h3>
                    <p>Moyenne Avancement</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div
                    className="stat-icon"
                    style={{
                      background: "rgba(245, 158, 11, 0.1)",
                      color: "#f59e0b",
                    }}
                  >
                    <Clock size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>{projects.filter((p) => p.progress < 100).length}</h3>
                    <p>En construction</p>
                  </div>
                </div>
              </section>

              {/* PROJECTS HEADER */}
              <div className="section-head">
                <h2>Nos Projets en cours</h2>
                <button className="text-btn">Voir tout</button>
              </div>

              {/* Grid */}
              <div className="projects-grid">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="project-card">
                    <div className="project-image-wrapper">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="project-image"
                      />
                      <span className="project-tag">{project.type}</span>
                    </div>

                    <div className="project-body">
                      <h3 className="project-title">{project.name}</h3>
                      <div className="project-loc">
                        <MapPin size={14} />
                        <span>{project.location}</span>
                      </div>

                      <div className="project-progress-mini">
                        <div className="progress-label">
                          <span>Avancement</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="mini-bar">
                          <div
                            className="mini-bar-fill"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <button
                        className="action-btn"
                        onClick={() => setSelectedProject(project)}
                      >
                        Suivre l'avancement
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeMenu === "projects" && (
            <div className="projects-page">
              <div className="section-head">
                <div>
                  <h1>Mes Projets</h1>
                  <p>Liste complète de vos acquisitions immobilières.</p>
                </div>
              </div>

              {projects.length === 0 ? (
                <div
                  className="empty-state"
                  style={{
                    padding: "60px",
                    textAlign: "center",
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: "24px",
                    marginTop: "20px",
                  }}
                >
                  <Building
                    size={48}
                    color="#475569"
                    style={{ marginBottom: "16px" }}
                  />
                  <h3>Aucun projet trouvé</h3>
                  <p>Vous n'avez pas encore de projet lié à votre compte.</p>
                </div>
              ) : (
                <div className="projects-grid" style={{ marginTop: "24px" }}>
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="project-card">
                      <div className="project-image-wrapper">
                        <img
                          src={project.image}
                          alt={project.name}
                          className="project-image"
                        />
                        <span className="project-tag">{project.type}</span>
                      </div>
                      <div className="project-body">
                        <h3 className="project-title">{project.name}</h3>
                        <div className="project-loc">
                          <MapPin size={14} />
                          <span>{project.location}</span>
                        </div>
                        <div className="project-progress-mini">
                          <div className="progress-label">
                            <span>Avancement</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="mini-bar">
                            <div
                              className="mini-bar-fill"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <button
                          className="action-btn"
                          onClick={() => setSelectedProject(project)}
                        >
                          Suivre l'avancement
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeMenu === "about" && (
            <div className="about-page">
              <section className="about-hero">
                <div className="hero-content">
                  <span className="badge">Notre Histoire</span>
                  <h1>
                    Bâtir l'Excellence, <br />
                    Signer l'Avenir.
                  </h1>
                  <p>
                    Depuis plus de 10 ans, Bakkah Immobilier transforme le
                    paysage urbain marocain avec des réalisations qui allient
                    luxe, confort et durabilité.
                  </p>
                </div>
                <div className="hero-image">
                  <img src={aboutTeam} alt="Notre équipe" />
                </div>
              </section>

              <section className="about-stats">
                <div className="a-stat">
                  <h2>10+</h2>
                  <p>Années d'expérience</p>
                </div>
                <div className="a-stat">
                  <h2>500+</h2>
                  <p>Logements livrés</p>
                </div>
                <div className="a-stat">
                  <h2>15</h2>
                  <p>Projets en cours</p>
                </div>
                <div className="a-stat">
                  <h2>98%</h2>
                  <p>Clients satisfaits</p>
                </div>
              </section>

              <section className="about-values">
                <div className="section-title-alt">
                  <h2>Nos Valeurs Fondamentales</h2>
                  <p>Ce qui nous guide dans chaque brique que nous posons.</p>
                </div>
                <div className="values-grid">
                  <div className="value-card">
                    <ShieldCheck size={32} color="var(--primary-light)" />
                    <h3>Qualité Sans Compromis</h3>
                    <p>
                      Nous sélectionnons les meilleurs matériaux et artisans
                      pour garantir des finitions irréprochables.
                    </p>
                  </div>
                  <div className="value-card">
                    <TrendingUp size={32} color="var(--primary-light)" />
                    <h3>Innovation</h3>
                    <p>
                      Utilisation de technologies modernes pour un suivi de
                      chantier transparent et efficace.
                    </p>
                  </div>
                  <div className="value-card">
                    <Home size={32} color="var(--primary-light)" />
                    <h3>Durabilité</h3>
                    <p>
                      Conception raisonnée pour des habitations respectueuses de
                      l'environnement.
                    </p>
                  </div>
                </div>
              </section>

              <section className="about-vision">
                <div className="vision-text">
                  <h2>Notre Vision</h2>
                  <p>
                    Devenir le leader de l'immobilier premium au Maroc en
                    proposant non seulement des bâtiments, mais de véritables
                    styles de vie. Nous croyons que chaque foyer mérite une
                    attention particulière.
                  </p>
                  <button
                    className="icon-btn-large"
                    onClick={() => setActiveMenu("contact")}
                  >
                    Contactez notre équipe de direction
                  </button>
                </div>
              </section>
            </div>
          )}

          {activeMenu === "settings" && (
            <div className="settings-page">
              <div className="settings-header">
                <h1>Paramètres du Compte</h1>
                <p>
                  Gérez vos informations personnelles et la sécurité de votre
                  compte.
                </p>
              </div>

              <div className="settings-grid">
                {/* Profile Card */}
                <div className="settings-card">
                  <div className="card-top">
                    <div className="settings-avatar">{profile.avatar}</div>
                    <div className="avatar-info">
                      <h3>{profile.name}</h3>
                      <p>Client Privilège</p>
                    </div>
                  </div>

                  <form
                    className="settings-form"
                    onSubmit={handleUpdateProfile}
                  >
                    <div className="s-group">
                      <label>
                        <User size={16} /> Nom Complet
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="s-group">
                      <label>
                        <Mail size={16} /> Email
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="s-group">
                      <label>
                        <Phone size={16} /> Téléphone
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                      />
                    </div>
                    <button type="submit" className="save-btn">
                      Enregistrer les modifications
                    </button>
                  </form>
                </div>

                {/* Security Card */}
                <div className="settings-card">
                  <div className="card-top">
                    <div className="icon-circle">
                      <Lock size={20} />
                    </div>
                    <div className="avatar-info">
                      <h3>Sécurité</h3>
                      <p>Changer votre mot de passe</p>
                    </div>
                  </div>

                  <form
                    className="settings-form"
                    onSubmit={handleUpdatePassword}
                  >
                    <div className="s-group">
                      <label>Mot de passe actuel</label>
                      <input
                        type="password"
                        placeholder="********"
                        value={passwords.current}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            current: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="s-group">
                      <label>Nouveau mot de passe</label>
                      <input
                        type="password"
                        placeholder="********"
                        value={passwords.new}
                        onChange={(e) =>
                          setPasswords({ ...passwords, new: e.target.value })
                        }
                      />
                    </div>
                    <div className="s-group">
                      <label>Confirmer le mot de passe</label>
                      <input
                        type="password"
                        placeholder="********"
                        value={passwords.confirm}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            confirm: e.target.value,
                          })
                        }
                      />
                    </div>
                    <button type="submit" className="save-btn secondary">
                      Mettre à jour le mot de passe
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeMenu === "contact" && (
            <div className="contact-page">
              <div className="section-head">
                <h1>Contactez-nous</h1>
                <p>
                  Notre équipe est à votre écoute pour répondre à toutes vos
                  questions.
                </p>
              </div>

              <div
                className="contact-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "40px",
                  marginTop: "40px",
                }}
              >
                <div className="contact-info">
                  <div
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      padding: "30px",
                      borderRadius: "24px",
                      border: "1px solid var(--glass-border)",
                    }}
                  >
                    <h3 style={{ marginBottom: "20px", fontSize: "20px" }}>
                      Informations de contact
                    </h3>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "24px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          style={{
                            background: "var(--primary)",
                            padding: "10px",
                            borderRadius: "12px",
                          }}
                        >
                          <MapPin size={24} color="white" />
                        </div>
                        <div>
                          <h4 style={{ marginBottom: "4px" }}>Notre Bureau</h4>
                          <p style={{ color: "#94a3b8", lineHeight: "1.6" }}>
                            App 11 rue goulmima residence le louvre 4eme etage
                            <br />
                            Casablanca
                          </p>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            background: "var(--primary)",
                            padding: "10px",
                            borderRadius: "12px",
                          }}
                        >
                          <Phone size={24} color="white" />
                        </div>
                        <div>
                          <h4 style={{ marginBottom: "4px" }}>Téléphone</h4>
                          <p style={{ color: "#94a3b8" }}>
                            +212 661323293
                          </p>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            background: "var(--primary)",
                            padding: "10px",
                            borderRadius: "12px",
                          }}
                        >
                          <Mail size={24} color="white" />
                        </div>
                        <div>
                          <h4 style={{ marginBottom: "4px" }}>Email</h4>
                          <p style={{ color: "#94a3b8" }}>
                            contact@bakkah.immo
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="contact-form-container">
                  <ContactForm />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-content">
            <p>
              &copy; 2026 Bakkah Immobilier. Plateforme de suivi immobilière
              premium.
            </p>
            <ul className="footer-links">
              <li>Accueil</li>
              <li>Projets</li>
              <li>Contact</li>
              <li>Mentions Légales</li>
            </ul>
          </div>
        </footer>
      </main>

      {/* DETAIL MODAL */}
      {selectedProject && (
        <div
          className="detail-overlay"
          onClick={() => setSelectedProject(null)}
        >
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-modal"
              onClick={() => setSelectedProject(null)}
            >
              <X size={24} />
            </button>

            <div className="modal-top">
              <div className="modal-header-main">
                <span className="badge">{selectedProject.type}</span>
                <h2>{selectedProject.name}</h2>
                <p className="project-loc">
                  <MapPin size={16} /> {selectedProject.location}
                </p>
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-visuals">
                <img
                  src={selectedProject.image}
                  alt=""
                  style={{ width: "100%", borderRadius: "20px" }}
                />
              </div>

              <div className="detail-info">
                <div className="progress-header-large">
                  <div className="label-row">
                    <h3>Progression globale</h3>
                    <span className="percent">
                      {selectedProject?.progress || 0}%
                    </span>
                  </div>
                  <div className="large-bar">
                    <div
                      className="large-bar-fill"
                      style={{ width: `${selectedProject?.progress || 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="info-cards">
                  <div className="i-card">
                    <Clock size={22} />
                    <div className="i-details">
                      <p>Livraison prévue</p>
                      <strong>{selectedProject.date || "2026"}</strong>
                    </div>
                  </div>
                  <div className="i-card">
                    <CheckCircle2 size={22} color="#10b981" />
                    <div className="i-details">
                      <p>Statut actuel</p>
                      <strong>{selectedProject.status}</strong>
                    </div>
                  </div>
                  {selectedProject.document_path && (
                    <div
                      className="i-card document-card"
                      style={{
                        gridColumn: "span 2",
                        background: "rgba(59, 130, 246, 0.05)",
                        cursor: "pointer",
                        border: "1px dashed rgba(59, 130, 246, 0.3)"
                      }}
                      onClick={() =>
                        window.open(selectedProject.document_path, "_blank")
                      }
                    >
                      <FileText size={24} color="#3b82f6" />
                      <div className="i-details">
                        <p>Document Technique</p>
                        <strong style={{ color: "#3b82f6" }}>
                          Télécharger le plan (PDF)
                        </strong>
                      </div>
                    </div>
                  )}
                </div>

                <div className="timeline">
                  <h4>ï¿½0tapes de construction</h4>
                  {!selectedProject.steps ||
                  selectedProject.steps.length === 0 ? (
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#64748b",
                        marginTop: "10px",
                      }}
                    >
                      Aucune étape définie pour ce projet.
                    </p>
                  ) : (
                    selectedProject.steps
                      .sort((a, b) => a.order_num - b.order_num)
                      .map((step, idx) => (
                        <div
                          key={idx}
                          className={`timeline-item ${step.status.replace("_", "-")}`}
                        >
                          <div className="dot"></div>
                          <div className="step-details">
                            <span className="step-name">{step.label}</span>
                            <span className="step-date">
                              {step.status === "completed"
                                ? "Terminé"
                                : step.status === "in_progress"
                                  ? "En cours"
                                  : "À venir"}
                            </span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI ASSISTANT */}
      <div className="ai-container">
        {showAI && (
          <div className="ai-panel">
            <div
              className="ai-chat-header"
              style={{
                padding: "20px",
                borderBottom: "1px solid var(--glass-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Bot size={20} color="var(--primary-light)" />
                <span style={{ fontWeight: "700" }}>Assistant Bakkah</span>
              </div>
              <button
                onClick={() => setShowAI(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div
              className="ai-chat-messages"
              style={{
                flex: 1,
                padding: "20px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    alignSelf: msg.sender === "ai" ? "flex-start" : "flex-end",
                    background:
                      msg.sender === "ai"
                        ? "rgba(255,255,255,0.05)"
                        : "var(--primary)",
                    padding: "12px 16px",
                    borderRadius:
                      msg.sender === "ai"
                        ? "16px 16px 16px 4px"
                        : "16px 16px 4px 16px",
                    maxWidth: "85%",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: msg.sender === "ai"
                      ? msg.text
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/\n/g, '<br/>')
                      : msg.text
                  }}
                />
              ))}
              {isTyping && (
                <div
                  style={{
                    alignSelf: "flex-start",
                    background: "rgba(255,255,255,0.05)",
                    padding: "12px 20px",
                    borderRadius: "16px 16px 16px 4px",
                    fontSize: "14px",
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                  }}
                >
                  <span className="typing-dot" style={{ animationDelay: "0s" }}>ï¿½ï¿½</span>
                  <span className="typing-dot" style={{ animationDelay: "0.2s" }}>ï¿½ï¿½</span>
                  <span className="typing-dot" style={{ animationDelay: "0.4s" }}>ï¿½ï¿½</span>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSendMessage}
              style={{
                padding: "20px",
                background: "rgba(255,255,255,0.02)",
                display: "flex",
                gap: "10px",
              }}
            >
              <input
                type="text"
                placeholder="Posez votre question..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--glass-border)",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  color: "white",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "var(--primary)",
                  border: "none",
                  color: "white",
                  padding: "10px",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        )}

        <button className="ai-launcher" onClick={() => setShowAI(!showAI)}>
          {showAI ? <X size={28} /> : <Bot size={28} />}
        </button>
      </div>
    </div>
  );
}


