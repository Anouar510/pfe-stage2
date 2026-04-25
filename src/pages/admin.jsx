import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./admin.css";
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  Plus,
  Pencil,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  X,
  LogOut,
  Mail,
  Lock,
  Smartphone,
  Building,
  Shield,
  TrendingUp,
} from "lucide-react";

import logoImg from "../Images/bakkahimmobilier.JPG";

// Reuse images
import luxuryApartment from "../Images/luxury_apartment.png";
import luxuryVilla from "../Images/luxury_villa.png";
import businessCenter from "../Images/business_center.png";
import cfcTowerImg from "../Images/Cfc.jpg";

import api from "../api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [users, setUsers] = useState([]);

  const initialProjectsData = [
    {
      id: "cfc-tower",
      name: "Immeuble CFC Tower",
      location: "Casablanca, CFC",
      progress: 65,
      status: "Gros œuvre en cours",
      total_value: 45000000,
      delivery_date: "2026-12-31",
      image_path: "Cfc.jpg",
      steps: [
        { id: "s1", label: "Terrassement", status: "completed", order_num: 1 },
        { id: "s2", label: "Fondations", status: "completed", order_num: 2 },
        { id: "s3", label: "Gros œuvre", status: "in-progress", order_num: 3 },
        { id: "s4", label: "Étanchéité", status: "pending", order_num: 4 },
      ],
    },
  ];

  const [projectsList, setProjectsList] = useState(initialProjectsData);
  const [activities, setActivities] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Step Management State
  const [showStepsModal, setShowStepsModal] = useState(false);
  const [selectedProjectForSteps, setSelectedProjectForSteps] = useState(null);
  const [stepForm, setStepForm] = useState({
    label: "",
    status: "pending",
    order_num: 1,
  });
  const [isSubmittingStep, setIsSubmittingStep] = useState(false);
  const [editingStep, setEditingStep] = useState(null);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    phone: "",
  });

  const [projectForm, setProjectForm] = useState({
    user_id: "",
    name: "",
    location: "",
    progress: 0,
    status: "",
    total_value: "",
    delivery_date: "",
    image_path: "",
  });

  // Admin Profile State
  const [adminProfile, setAdminProfile] = useState({
    name: "Admin",
    email: "admin@bakkah.com",
    role: "Administrateur",
    phone: "0600000000",
  });

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAdminProfile({
          name: user.name || "Admin",
          email: user.email || "",
          phone: user.phone || "",
          role: user.role === "admin" ? "Super Administrateur" : "Administrateur",
        });
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
    fetchUsers();
    fetchProjects();
  }, []);

  React.useEffect(() => {
    if (
      activeTab === "users" ||
      activeTab === "admins" ||
      activeTab === "projects" ||
      activeTab === "stats"
    ) {
      setSearchTerm(""); // Reset search when changing tabs
    }
    if (activeTab === "users" || activeTab === "admins") {
      fetchUsers();
    }
    if (activeTab === "projects" || activeTab === "stats") {
      fetchProjects();
    }
    if (activeTab === "stats") {
      fetchActivities();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
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

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await api.get("/projects");
      if (response.data && response.data.length > 0) {
        const mappedFromDB = response.data.map((p) => ({
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
          image_path:
            p.image_path === "luxury_apartment.png"
              ? "appartment_mohammedia.jpg"
              : p.image_path === "luxury_villa.png"
                ? "villa-Rabat.jpg"
                : p.image_path,
        }));
        setProjectsList([...initialProjectsData, ...mappedFromDB]);
      } else {
        setProjectsList(initialProjectsData);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjectsList(initialProjectsData);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await api.get("/admin/stats");
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "à l'instant";
    if (diffInSeconds < 3600)
      return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400)
      return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
    return `Il y a ${Math.floor(diffInSeconds / 86400)} jours`;
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/admin/users/${editingUser.id}`, userForm);
      } else {
        await api.post("/admin/users", userForm);
      }
      setShowUserModal(false);
      fetchUsers();
      setUserForm({
        name: "",
        email: "",
        password: "",
        role: "admin",
        phone: "",
      });
      setEditingUser(null);
      toast.success("Utilisateur enregistré avec succès");
    } catch (error) {
      toast.error("Erreur : " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteUser = async (id) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      try {
        await api.delete(`/admin/users/${id}`);
        fetchUsers();
        toast.success("Utilisateur supprimé avec succès");
      } catch (error) {
        toast.error(error.response?.data?.message || "Erreur lors de la suppression");
      }
    }
  };

  const handleExportProjects = async () => {
    try {
      const response = await api.get("/projects/export-pdf", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `projets_bakkah_${new Date().toISOString().split("T")[0]}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Exportation réussie");
    } catch (error) {
      toast.error("Erreur lors de l'exportation");
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      // Intercepter les projets virtuels
      if (
        editingProject &&
        typeof editingProject.id === "string" &&
        (editingProject.id.startsWith("cfc-") ||
          editingProject.id.startsWith("app-"))
      ) {
        const selectedUser = users.find(
          (u) => u.id.toString() === projectForm.user_id.toString(),
        );

        const updatedList = projectsList.map((p) =>
          p.id === editingProject.id
            ? { ...p, ...projectForm, user: selectedUser }
            : p,
        );
        setProjectsList(updatedList);
        setShowAddModal(false);
        setEditingProject(null);
        return;
      }

      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, projectForm);
      } else {
        await api.post("/projects", projectForm);
      }
      setShowAddModal(false);
      fetchProjects();
      setProjectForm({
        user_id: "",
        name: "",
        location: "",
        progress: 0,
        status: "",
        total_value: "",
        delivery_date: "",
        image_path: "",
      });
      setEditingProject(null);
      toast.success("Projet enregistré avec succès");
    } catch (error) {
      toast.error("Erreur : " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Supprimer ce projet ?")) {
      try {
        if (
          typeof id === "string" &&
          (id.startsWith("cfc-") || id.startsWith("app-"))
        ) {
          setProjectsList(projectsList.filter((p) => p.id !== id));
          return;
        }
        await api.delete(`/projects/${id}`);
        fetchProjects();
        toast.success("Projet supprimé avec succès");
      } catch (error) {
        toast.error("Erreur de suppression");
      }
    }
  };

  const openStepsModal = (proj) => {
    setSelectedProjectForSteps(proj);
    setShowStepsModal(true);
    // Find highest order_num to suggest next
    const lastOrder =
      proj.steps?.length > 0
        ? Math.max(...proj.steps.map((s) => s.order_num))
        : 0;
    setStepForm({ label: "", status: "pending", order_num: lastOrder + 1 });
  };

  const handleAddStep = async (e) => {
    e.preventDefault();
    setIsSubmittingStep(true);
    try {
      if (editingStep) {
        await api.put(`/steps/${editingStep.id}`, {
          ...stepForm,
          project_id: selectedProjectForSteps.id,
        });
      } else {
        await api.post("/steps", {
          ...stepForm,
          project_id: selectedProjectForSteps.id,
        });
      }

      // Manually update the local state for better UX
      const response = await api.get("/projects");
      setProjectsList(response.data);
      const updatedProj = response.data.find(
        (p) => p.id === selectedProjectForSteps.id,
      );
      setSelectedProjectForSteps(updatedProj);

      setStepForm({
        label: "",
        status: "pending",
        order_num: stepForm.order_num + 1,
      });
      setEditingStep(null);
      toast.success("Étape enregistrée avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement de l'étape");
    } finally {
      setIsSubmittingStep(false);
    }
  };

  const handleEditStep = (step) => {
    setEditingStep(step);
    setStepForm({
      label: step.label,
      status: step.status,
      order_num: step.order_num,
    });
  };

  const handleDeleteStep = async (stepId) => {
    if (!confirm("Supprimer cette étape ?")) return;
    try {
      await api.delete(`/steps/${stepId}`);

      const response = await api.get("/projects");
      setProjectsList(response.data);
      const updatedProj = response.data.find(
        (p) => p.id === selectedProjectForSteps.id,
      );
      setSelectedProjectForSteps(updatedProj);
      toast.success("Étape supprimée avec succès");
    } catch (error) {
      toast.error("Erreur");
    }
  };

  const openUserModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setUserForm({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
        phone: user.phone || "",
      });
    } else {
      setEditingUser(null);
      setUserForm({
        name: "",
        email: "",
        password: "",
        role: activeTab === "admins" ? "admin" : "client",
        phone: "",
      });
    }
    setShowUserModal(true);
  };

  const openProjectModal = (proj = null) => {
    if (proj) {
      setEditingProject(proj);
      setProjectForm({
        user_id: proj.user_id,
        name: proj.name,
        location: proj.location,
        progress: proj.progress,
        status: proj.status,
        total_value: proj.total_value,
        delivery_date: proj.delivery_date,
        image_path: proj.image_path || "",
      });
    } else {
      setEditingProject(null);
      setProjectForm({
        user_id: "",
        name: "",
        location: "",
        progress: 0,
        status: "",
        total_value: "",
        delivery_date: "",
        image_path: "",
      });
    }
    setShowAddModal(true);
  };

  const [adminPasswords, setAdminPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("/user/profile", {
        name: adminProfile.name,
        email: adminProfile.email,
        phone: adminProfile.phone,
      });

      const updatedUserFromBackend = response.data.user;
      
      // Update local storage
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUserForStorage = { ...currentUser, ...updatedUserFromBackend };
      localStorage.setItem("user", JSON.stringify(updatedUserForStorage));

      // Update local state to reflect changes and include the phone
      setAdminProfile({
        name: updatedUserFromBackend.name,
        email: updatedUserFromBackend.email,
        phone: updatedUserFromBackend.phone || "",
        role: updatedUserFromBackend.role === "admin" ? "Super Administrateur" : "Administrateur",
      });

      toast.success(response.data.message || "Profil mis à jour avec succès");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Erreur : " + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (adminPasswords.new !== adminPasswords.confirm) {
      toast.error("La confirmation du mot de passe ne correspond pas.");
      return;
    }

    try {
      await api.put("/user/password", {
        current_password: adminPasswords.current,
        new_password: adminPasswords.new,
        new_password_confirmation: adminPasswords.confirm,
      });

      toast.success("Mot de passe mis à jour avec succès");
      setAdminPasswords({ current: "", new: "", confirm: "" });
    } catch (error) {
      console.error("Password update error:", error);
      toast.error("Erreur : " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <img src={logoImg} alt="Bakkah Immobilier" />
          <span>Bakkah Admin</span>
        </div>

        <ul className="admin-nav">
          <li
            className={`admin-nav-item ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            <LayoutDashboard size={20} />
            Tableau de Bord
          </li>
          <li
            className={`admin-nav-item ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => setActiveTab("projects")}
          >
            <Building2 size={20} />
            Gérer Projets
          </li>
          <li
            className={`admin-nav-item ${activeTab === "admins" ? "active" : ""}`}
            onClick={() => setActiveTab("admins")}
          >
            <Shield size={20} />
            Gérer Admins
          </li>
          <li
            className={`admin-nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <Users size={20} />
            Gérer Clients
          </li>
          <li
            className={`admin-nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={20} />
            Paramètres
          </li>
        </ul>

        <div style={{ marginTop: "auto" }}>
          <li
            className="admin-nav-item"
            onClick={handleLogout}
            style={{ color: "#f87171" }}
          >
            <LogOut size={20} />
            Déconnexion
          </li>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>
              {activeTab === "projects"
                ? "Gestion des Projets"
                : activeTab === "users"
                  ? "Gestion des Clients"
                  : activeTab === "admins"
                    ? "Gestion des Administrateurs"
                    : activeTab === "stats"
                      ? "Vue d'ensemble"
                      : activeTab === "settings"
                        ? "Paramètres"
                        : "Dashboard"}
            </h1>
            <p style={{ color: "#64748b" }}>Bienvenue, Administrateur</p>
          </div>
          <div
            className="admin-user-profile"
            style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}
          >
            <div
              className="admin-avatar-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              {adminProfile.name.charAt(0).toUpperCase()}
            </div>
            
            {showProfileMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "8px",
                  background: "white",
                  border: "1px solid var(--admin-border)",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
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
                  className="admin-dropdown-item"
                  onClick={() => {
                    setActiveTab("settings");
                    setShowProfileMenu(false);
                  }}
                >
                  <Settings size={16} /> Mon Profil
                </div>
                <div
                  className="admin-dropdown-item logout-item"
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

        {(activeTab === "projects" || activeTab === "stats") && (
          <>
            <section className="admin-stats">
              <div className="admin-stat-card">
                <h3>Projets Actifs</h3>
                <p className="value">{projectsList.length}</p>
              </div>
              <div className="admin-stat-card">
                <h3>Total Utilisateurs</h3>
                <p className="value">{users.length || "..."}</p>
              </div>
              <div className="admin-stat-card">
                <h3>CA Total</h3>
                <p className="value">
                  {projectsList
                    .reduce((acc, curr) => acc + Number(curr.total_value), 0)
                    .toLocaleString()}{" "}
                  Dh
                </p>
              </div>
              <div className="admin-stat-card">
                <h3>Moyenne Progress.</h3>
                <p className="value">
                  {projectsList.length > 0
                    ? Math.round(
                        projectsList.reduce(
                          (acc, curr) => acc + curr.progress,
                          0,
                        ) / projectsList.length,
                      )
                    : 0}
                  %
                </p>
              </div>
            </section>

            {activeTab === "stats" && (
              <div className="admin-dashboard-grid">
                {/* Revenue Overview Chart (Simulated) */}
                <div className="admin-content-card">
                  <div className="card-header">
                    <h3>Aperçu des Revenus</h3>
                    <select className="admin-select">
                      <option>6 derniers mois</option>
                      <option>Cette année</option>
                    </select>
                  </div>
                  <div className="card-body">
                    <div
                      className="revenue-chart-sim"
                      style={{
                        height: "100%",
                        minHeight: "250px",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-around",
                      }}
                    >
                      {[45, 60, 40, 85, 70, 95].map((h, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "8px",
                            width: "40px",
                          }}
                        >
                          <div
                            style={{
                              height: `${h}%`,
                              width: "100%",
                              background: "var(--admin-primary)",
                              borderRadius: "6px 6px 0 0",
                              opacity: i === 5 ? 1 : 0.6,
                            }}
                          ></div>
                          <span style={{ fontSize: "11px", color: "#64748b" }}>
                            {["Sep", "Oct", "Nov", "Dec", "Jan", "Féb"][i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Project Distribution */}
                <div className="admin-content-card">
                  <div className="card-header">
                    <h3>Répartition</h3>
                  </div>
                  <div className="card-body">
                    <div style={{ marginBottom: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                          fontSize: "13px",
                        }}
                      >
                        <span>Villas</span>
                        <span style={{ fontWeight: "700" }}>42%</span>
                      </div>
                      <div
                        style={{
                          height: "8px",
                          background: "#f1f5f9",
                          borderRadius: "4px",
                        }}
                      >
                        <div
                          style={{
                            width: "42%",
                            height: "100%",
                            background: "#8b5cf6",
                            borderRadius: "4px",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                          fontSize: "13px",
                        }}
                      >
                        <span>Appartements</span>
                        <span style={{ fontWeight: "700" }}>38%</span>
                      </div>
                      <div
                        style={{
                          height: "8px",
                          background: "#f1f5f9",
                          borderRadius: "4px",
                        }}
                      >
                        <div
                          style={{
                            width: "38%",
                            height: "100%",
                            background: "#3b82f6",
                            borderRadius: "4px",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                          fontSize: "13px",
                        }}
                      >
                        <span>Bureaux</span>
                        <span style={{ fontWeight: "700" }}>20%</span>
                      </div>
                      <div
                        style={{
                          height: "8px",
                          background: "#f1f5f9",
                          borderRadius: "4px",
                        }}
                      >
                        <div
                          style={{
                            width: "20%",
                            height: "100%",
                            background: "#10b981",
                            borderRadius: "4px",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="admin-content-card recent-activities-card">
                  <div className="card-header">
                    <h3>Activités Récentes</h3>
                    <button className="text-btn">
                      Voir tout
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="activity-list">
                      {activities.length === 0 ? (
                        <p
                          style={{
                            padding: "20px",
                            textAlign: "center",
                            color: "#94a3b8",
                          }}
                        >
                          Aucune activité récente
                        </p>
                      ) : (
                        activities.map((act, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "16px",
                              padding: "16px 0",
                              borderBottom:
                                i === activities.length - 1
                                  ? "none"
                                  : "1px solid #f1f5f9",
                            }}
                          >
                            <div
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "10px",
                                background: `${act.color}15`,
                                color: act.color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {act.type === "project_created" && (
                                <Plus size={16} />
                              )}
                              {act.type === "step_completed" && (
                                <CheckCircle2 size={16} />
                              )}
                              {act.type === "user_registered" && (
                                <Users size={16} />
                              )}
                              {![
                                "project_created",
                                "step_completed",
                                "user_registered",
                              ].includes(act.type) && <TrendingUp size={16} />}
                            </div>
                            <div style={{ flex: 1 }}>
                              <p
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "600",
                                  marginBottom: "2px",
                                }}
                              >
                                {act.title}
                              </p>
                              <p style={{ fontSize: "12px", color: "#64748b" }}>
                                Par {act.user}
                              </p>
                            </div>
                            <span
                              style={{ fontSize: "12px", color: "#94a3b8" }}
                            >
                              {formatTimeAgo(act.time)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="admin-content-card">
                <div className="card-header">
                  <div className="admin-search-wrapper">
                    <Search size={18} />
                    <input
                      type="text"
                      placeholder="Rechercher un projet..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      className="btn-secondary"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                      onClick={handleExportProjects}
                    >
                      <LayoutDashboard size={18} />
                      Exporter PDF
                    </button>
                    <button
                      className="btn-primary"
                      onClick={() => openProjectModal()}
                    >
                      <Plus size={20} />
                      Nouveau Projet
                    </button>
                  </div>
                </div>

                {loadingProjects ? (
                  <div style={{ padding: "40px", textAlign: "center" }}>
                    Chargement...
                  </div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>PROJET</th>
                        <th>CLIENT</th>
                        <th>LOCALISATION</th>
                        <th>AVANCEMENT</th>
                        <th>STATUT</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectsList
                        .filter((p) => {
                          const name = p?.name?.toLowerCase() || "";
                          const loc = p?.location?.toLowerCase() || "";
                          const search = searchTerm?.toLowerCase() || "";
                          const clientName = p?.user?.name?.toLowerCase() || "";

                          return (
                            name.includes(search) ||
                            loc.includes(search) ||
                            clientName.includes(search)
                          );
                        })
                        .map((p) => (
                          <tr key={p.id}>
                            <td>
                              <div className="project-info">
                                <div
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    background: "#f1f5f9",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Building
                                    size={20}
                                    color="var(--admin-primary)"
                                  />
                                </div>
                                <span style={{ fontWeight: "600" }}>
                                  {p.name}
                                </span>
                              </div>
                            </td>
                            <td>{p.user?.name || "N/A"}</td>
                            <td>{p.location}</td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <div
                                  style={{
                                    flex: 1,
                                    height: "6px",
                                    background: "#f1f5f9",
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: `${p.progress}%`,
                                      height: "100%",
                                      background: "var(--admin-primary)",
                                    }}
                                  ></div>
                                </div>
                                <span
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "700",
                                  }}
                                >
                                  {p.progress}%
                                </span>
                              </div>
                            </td>
                            <td>
                              <span
                                className={`status-badge ${p.progress === 100 ? "completed" : "in-progress"}`}
                              >
                                {p.status}
                              </span>
                            </td>
                            <td>
                              <div className="action-btns">
                                <button
                                  className="btn-icon"
                                  style={{ color: "#6366f1" }}
                                  onClick={() => openStepsModal(p)}
                                  title="Gérer les étapes"
                                >
                                  <LayoutDashboard size={16} />
                                </button>
                                <button
                                  className="btn-icon btn-edit"
                                  onClick={() => openProjectModal(p)}
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  className="btn-icon btn-delete"
                                  onClick={() => handleDeleteProject(p.id)}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}

        {(activeTab === "users" || activeTab === "admins") && (
          <div className="admin-content-card">
            <div className="card-header">
              <div className="admin-search-wrapper">
                <Search size={18} />
                <input
                  type="text"
                  placeholder={`Rechercher un ${activeTab === "admins" ? "administrateur" : "client"}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn-primary" onClick={() => openUserModal()}>
                <Plus size={20} />
                {activeTab === "admins" ? "Nouveau Admin" : "Nouveau Client"}
              </button>
            </div>

            {loadingUsers ? (
              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "#64748b",
                }}
              >
                Chargement...
              </div>
            ) : users.filter((u) =>
                activeTab === "admins"
                  ? u.role === "admin"
                  : u.role === "client",
              ).length === 0 ? (
              <div style={{ padding: "60px", textAlign: "center" }}>
                <Users
                  size={64}
                  color="#CBD5E1"
                  style={{ marginBottom: "20px" }}
                />
                <h2>
                  Aucun {activeTab === "admins" ? "administrateur" : "client"}
                </h2>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>NOM</th>
                    <th>EMAIL</th>
                    <th>RÔLE</th>
                    <th>TÉLÉPHONE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((u) =>
                      activeTab === "admins"
                        ? u.role === "admin"
                        : u.role === "client",
                    )
                    .filter((u) => {
                      const name = u?.name?.toLowerCase() || "";
                      const email = u?.email?.toLowerCase() || "";
                      const search = searchTerm?.toLowerCase() || "";
                      return name.includes(search) || email.includes(search);
                    })
                    .map((c) => (
                      <tr key={c.id}>
                        <td>
                          <div className="project-info">
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                background:
                                  c.role === "admin" ? "#dcfce7" : "#e2e8f0",
                                color:
                                  c.role === "admin" ? "#166534" : "inherit",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "800",
                                fontSize: "12px",
                                marginRight: "10px",
                              }}
                            >
                              {c.name.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: "600" }}>{c.name}</span>
                          </div>
                        </td>
                        <td>{c.email}</td>
                        <td>
                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: "700",
                              textTransform: "uppercase",
                              background:
                                c.role === "admin" ? "#dcfce7" : "#f1f5f9",
                              color: c.role === "admin" ? "#166534" : "#64748b",
                            }}
                          >
                            {c.role}
                          </span>
                        </td>
                        <td>{c.phone || "-"}</td>
                        <td>
                          <div className="action-btns">
                            <button
                              className="btn-icon btn-edit"
                              onClick={() => openUserModal(c)}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="btn-icon btn-delete"
                              onClick={() => handleDeleteUser(c.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="dark-settings-wrapper">
            <div className="dark-settings-header">
              <h2>Paramètres du Compte</h2>
              <p>
                Gérez vos informations personnelles et la sécurité de votre
                compte.
              </p>
            </div>

            <div className="dark-settings-grid">
              {/* Profile Card */}
              <div className="dark-card">
                <div className="profile-header">
                  <div className="profile-avatar">
                    {adminProfile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="profile-info">
                    <h4>{adminProfile.name}</h4>
                    <span>{adminProfile.role}</span>
                  </div>
                </div>

                <form
                  onSubmit={handleUpdateProfile}
                  style={{ display: "flex", flexDirection: "column", flex: 1 }}
                >
                  <div className="dark-form-group">
                    <label>
                      <Users
                        size={14}
                        style={{ verticalAlign: "middle", marginRight: "6px" }}
                      />{" "}
                      Nom Complet
                    </label>
                    <input
                      type="text"
                      className="dark-input"
                      value={adminProfile.name}
                      onChange={(e) =>
                        setAdminProfile({
                          ...adminProfile,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="dark-form-group">
                    <label>
                      <Mail
                        size={14}
                        style={{ verticalAlign: "middle", marginRight: "6px" }}
                      />{" "}
                      Email
                    </label>
                    <input
                      type="email"
                      className="dark-input"
                      value={adminProfile.email}
                      onChange={(e) =>
                        setAdminProfile({
                          ...adminProfile,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="dark-form-group">
                    <label>
                      <Smartphone
                        size={14}
                        style={{ verticalAlign: "middle", marginRight: "6px" }}
                      />{" "}
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      className="dark-input"
                      value={adminProfile.phone}
                      onChange={(e) =>
                        setAdminProfile({
                          ...adminProfile,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>

                  <button type="submit" className="btn-large-primary">
                    Enregistrer les modifications
                  </button>
                </form>
              </div>

              {/* Security Card */}
              <div className="dark-card">
                <h3>
                  <div className="dark-card-icon">
                    <Lock size={20} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "white",
                      }}
                    >
                      Sécurité
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#94a3b8",
                        fontWeight: "400",
                      }}
                    >
                      Changer votre mot de passe
                    </div>
                  </div>
                </h3>

                <form
                  onSubmit={handleUpdatePassword}
                  style={{ display: "flex", flexDirection: "column", flex: 1 }}
                >
                  <div className="dark-form-group">
                    <label>Mot de passe actuel</label>
                    <input
                      type="password"
                      className="dark-input"
                      placeholder="********"
                      value={adminPasswords.current}
                      onChange={(e) =>
                        setAdminPasswords({
                          ...adminPasswords,
                          current: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="dark-form-group">
                    <label>Nouveau mot de passe</label>
                    <input
                      type="password"
                      className="dark-input"
                      placeholder="********"
                      value={adminPasswords.new}
                      onChange={(e) =>
                        setAdminPasswords({
                          ...adminPasswords,
                          new: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="dark-form-group">
                    <label>Confirmer le mot de passe</label>
                    <input
                      type="password"
                      className="dark-input"
                      placeholder="********"
                      value={adminPasswords.confirm}
                      onChange={(e) =>
                        setAdminPasswords({
                          ...adminPasswords,
                          confirm: e.target.value,
                        })
                      }
                    />
                  </div>

                  <button type="submit" className="btn-large-dark">
                    Mettre à jour le mot de passe
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* PROJECT MODAL */}
        {showAddModal && (
          <div className="admin-modal-overlay">
            <div className="admin-modal">
              <button
                className="close-modal"
                onClick={() => setShowAddModal(false)}
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "20px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={24} color="#64748b" />
              </button>
              <h2>
                {editingProject
                  ? "Modifier le Projet"
                  : "Créer un Nouveau Projet"}
              </h2>
              <p style={{ color: "#64748b" }}>
                Remplissez les informations pour le chantier.
              </p>

              <form className="row g-3 mt-2" onSubmit={handleProjectSubmit}>
                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    Nom du Projet
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={projectForm.name}
                    required
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, name: e.target.value })
                    }
                    placeholder="Ex: Résidence Oasis"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    Client Attribué
                  </label>
                  <select
                    className="form-select"
                    value={projectForm.user_id}
                    required
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        user_id: e.target.value,
                      })
                    }
                  >
                    <option value="">Sélectionner un client</option>
                    {users
                      .filter((u) =>
                        (u.role || "").toLowerCase().includes("client"),
                      )
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    Localisation
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={projectForm.location}
                    required
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        location: e.target.value,
                      })
                    }
                    placeholder="Ville, Quartier"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    Progression (%)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={projectForm.progress}
                    min="0"
                    max="100"
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        progress: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small">Statut</label>
                  <input
                    type="text"
                    className="form-control"
                    value={projectForm.status}
                    required
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, status: e.target.value })
                    }
                    placeholder="Ex: Gros œuvre"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    Valeur Totale (Dh)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={projectForm.total_value}
                    required
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        total_value: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small">
                    Image du Projet (Ex: Cfc.jpg)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={projectForm.image_path}
                    required
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        image_path: e.target.value,
                      })
                    }
                    placeholder="nom-image.jpg"
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label fw-bold small">
                    Date de Livraison
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={projectForm.delivery_date}
                    required
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        delivery_date: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setShowAddModal(false)}
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    {editingProject ? "Mettre à jour" : "Créer le Projet"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* USER MODAL */}
        {showUserModal && (
          <div className="admin-modal-overlay">
            <div className="admin-modal" style={{ maxWidth: "500px" }}>
              <button
                className="close-modal"
                onClick={() => setShowUserModal(false)}
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "20px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={24} color="#64748b" />
              </button>
              <h2>
                {editingUser ? "Modifier l'utilisateur" : "Nouveau Utilisateur"}
              </h2>

              <form onSubmit={handleUserSubmit} className="mt-3">
                <div className="mb-3">
                  <label className="form-label fw-bold small">
                    Nom Complet
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={userForm.name}
                    required
                    onChange={(e) =>
                      setUserForm({ ...userForm, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold small">
                    Adresse Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={userForm.email}
                    required
                    onChange={(e) =>
                      setUserForm({ ...userForm, email: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold small">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    value={userForm.phone}
                    onChange={(e) =>
                      setUserForm({ ...userForm, phone: e.target.value })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold small">
                    Mot de passe{" "}
                    {editingUser && "(laisser vide pour ne pas changer)"}
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={userForm.password}
                    required={!editingUser}
                    onChange={(e) =>
                      setUserForm({ ...userForm, password: e.target.value })
                    }
                  />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setShowUserModal(false)}
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    Valider
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* STEPS MODAL */}
        {showStepsModal && selectedProjectForSteps && (
          <div className="admin-modal-overlay">
            <div className="admin-modal" style={{ maxWidth: "700px" }}>
              <button
                className="close-modal"
                onClick={() => setShowStepsModal(false)}
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "20px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={24} color="#64748b" />
              </button>
              <h2>Gestion des Étapes : {selectedProjectForSteps.name}</h2>

              <div style={{ marginTop: "20px" }}>
                <form
                  onSubmit={handleAddStep}
                  className="row g-2 mb-4 align-items-end"
                >
                  <div className="col-md-5">
                    <label
                      className="form-label mb-1 fw-bold"
                      style={{ fontSize: "13px" }}
                    >
                      {editingStep ? "Modifier l'Étape" : "Ajouter une Étape"}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ex: Fondations"
                      value={stepForm.label}
                      onChange={(e) =>
                        setStepForm({ ...stepForm, label: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label
                      className="form-label mb-1 fw-bold"
                      style={{ fontSize: "13px" }}
                    >
                      Statut
                    </label>
                    <select
                      className="form-select"
                      value={stepForm.status}
                      onChange={(e) =>
                        setStepForm({ ...stepForm, status: e.target.value })
                      }
                    >
                      <option value="pending">ì venir</option>
                      <option value="in_progress">En cours</option>
                      <option value="completed">Terminé</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label
                      className="form-label mb-1 fw-bold"
                      style={{ fontSize: "13px" }}
                    >
                      Ordre
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={stepForm.order_num}
                      onChange={(e) =>
                        setStepForm({ ...stepForm, order_num: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-2 d-flex gap-1">
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={isSubmittingStep}
                      style={{
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {editingStep ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <Plus size={20} />
                      )}
                    </button>
                    {editingStep && (
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => {
                          setEditingStep(null);
                          setStepForm({
                            label: "",
                            status: "pending",
                            order_num: selectedProjectForSteps.steps.length + 1,
                          });
                        }}
                        style={{ height: "40px" }}
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                </form>

                <div
                  className="steps-list"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  {selectedProjectForSteps.steps
                    ?.sort((a, b) => a.order_num - b.order_num)
                    .map((step) => (
                      <div
                        key={step.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px",
                          background: "#f8fafc",
                          borderRadius: "10px",
                          marginBottom: "8px",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: "800",
                              color: "#64748b",
                              fontSize: "12px",
                            }}
                          >
                            #{step.order_num}
                          </span>
                          <span style={{ fontWeight: "600" }}>
                            {step.label}
                          </span>
                          <span
                            style={{
                              fontSize: "10px",
                              padding: "2px 8px",
                              borderRadius: "100px",
                              background:
                                step.status === "completed"
                                  ? "#dcfce7"
                                  : step.status === "in_progress"
                                    ? "#fef3c7"
                                    : "#f1f5f9",
                              color:
                                step.status === "completed"
                                  ? "#166534"
                                  : step.status === "in_progress"
                                    ? "#92400e"
                                    : "#64748b",
                            }}
                          >
                            {step.status === "completed"
                              ? "Terminé"
                              : step.status === "in_progress"
                                ? "En cours"
                                : "ì venir"}
                          </span>
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => handleEditStep(step)}
                            style={{
                              color: "#6366f1",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                            title="Modifier l'étape"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteStep(step.id)}
                            style={{
                              color: "#ef4444",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                            title="Supprimer l'étape"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  {(!selectedProjectForSteps.steps ||
                    selectedProjectForSteps.steps.length === 1) && (
                    <p
                      style={{
                        textAlign: "center",
                        color: "#94a3b8",
                        padding: "20px",
                      }}
                    >
                      Aucune étape définie.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


