
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/challenges";

const emptyForm = {
  title: "",
  description: "",
  duration: 7,
  difficulty: "Easy",
  participants: 0,
};

function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  async function loadChallenges() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Could not load challenges.");

      const data = await response.json();
      setChallenges(data);
    } catch {
      setError("Backend connect aagala. Backend server running-la irukka nu check pannu.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadChallenges();
  }, []);

  function openCreate() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowForm(true);
    setError("");
  }

  function openEdit(challenge) {
    setForm({
      title: challenge.title,
      description: challenge.description,
      duration: challenge.duration,
      difficulty: challenge.difficulty,
      participants: challenge.participants ?? 0,
    });
    setEditingId(challenge._id);
    setShowForm(true);
    setError("");
  }

  async function saveChallenge(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Save failed.");

      await loadChallenges();
      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyForm });
    } catch (err) {
      setError(err.message || "Challenge save panna mudiyala.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteChallenge(id) {
    if (!window.confirm("Indha challenge-a delete pannava?")) return;

    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Delete failed.");

      setChallenges((current) =>
        current.filter((challenge) => challenge._id !== id)
      );
    } catch (err) {
      setError(err.message || "Delete panna mudiyala.");
    }
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]:
        name === "duration" || name === "participants"
          ? Number(value)
          : value,
    }));
  }

  const visibleChallenges = challenges.filter((challenge) =>
    challenge.title.toLowerCase().includes(search.toLowerCase())
  );

  const participants = challenges.reduce(
    (sum, challenge) => sum + (Number(challenge.participants) || 0),
    0
  );

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="logo">FitTrack<span>+</span></h2>
        <p className="menu-label">MENU</p>

        {["Dashboard", "My Challenges", "Activity", "Achievements"].map(
          (item) => (
            <button
              key={item}
              className={`nav-item ${activeTab === item ? "active" : ""}`}
              onClick={() => setActiveTab(item)}
            >
              {item === "Dashboard" && "▦"}
              {item === "My Challenges" && "🎯"}
              {item === "Activity" && "📈"}
              {item === "Achievements" && "🏆"}
              <span>{item}</span>
            </button>
          )
        )}

        <div className="sidebar-bottom">
          <div className="avatar">A</div>
          <div>
            <strong>Fitness Member</strong>
            <p>FitTrack+ User</p>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">FITNESS CHALLENGE TRACKER</p>
            <h1>{activeTab}</h1>
          </div>
          <button
            className="profile-button"
            onClick={() => window.alert("Welcome to FitTrack+!")}
          >
            👤 My Profile
          </button>
        </header>

        <section className="welcome">
          <div>
            <p className="eyebrow light">YOUR FITNESS JOURNEY</p>
            <h2>Keep moving forward! 💪</h2>
            <p>Small steps every day lead to big results.</p>
          </div>
          <div className="welcome-icon">🏃</div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <span className="stat-icon purple">🎯</span>
            <p>Total Challenges</p>
            <h2>{challenges.length}</h2>
            <small>Loaded from MongoDB API</small>
          </div>
          <div className="stat-card">
            <span className="stat-icon green">✅</span>
            <p>Easy Challenges</p>
            <h2>{challenges.filter((c) => c.difficulty === "Easy").length}</h2>
            <small>Start at your own pace</small>
          </div>
          <div className="stat-card">
            <span className="stat-icon orange">🔥</span>
            <p>Hard Challenges</p>
            <h2>{challenges.filter((c) => c.difficulty === "Hard").length}</h2>
            <small>Keep challenging yourself</small>
          </div>
          <div className="stat-card">
            <span className="stat-icon blue">👥</span>
            <p>Total Participants</p>
            <h2>{participants}</h2>
            <small>Across all challenges</small>
          </div>
        </section>

        <section className="section-heading">
          <div>
            <h2>My Challenges</h2>
            <p>Manage challenges stored in your database.</p>
          </div>
          <button className="primary-button" onClick={openCreate}>
            + Add Challenge
          </button>
        </section>

        <div className="challenge-toolbar">
          <input
            className="search-input"
            type="search"
            placeholder="Search challenges..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button className="refresh-button" onClick={loadChallenges}>
            ↻ Refresh
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <p className="status-message">Loading challenges...</p>
        ) : visibleChallenges.length === 0 ? (
          <div className="empty-state">
            <div>🎯</div>
            <h3>No challenges found</h3>
            <p>Add a new challenge or change your search.</p>
            <button className="primary-button" onClick={openCreate}>
              + Create Challenge
            </button>
          </div>
        ) : (
          <section className="challenge-list">
            {visibleChallenges.map((challenge) => (
              <article className="challenge-card" key={challenge._id}>
                <div className="challenge-icon">
                  {challenge.difficulty === "Hard"
                    ? "💪"
                    : challenge.difficulty === "Medium"
                    ? "🏃"
                    : "🚶"}
                </div>

                <div className="challenge-info">
                  <span className="category">
                    {challenge.difficulty === "Hard"
                      ? "FULL BODY"
                      : challenge.difficulty === "Medium"
                      ? "CARDIO"
                      : "HEALTH"}
                  </span>
                  <h3>{challenge.title}</h3>
                  <p>{challenge.description}</p>
                  <p>
                    {challenge.duration} days · {challenge.participants ?? 0} participants
                  </p>
                  <span className={`difficulty difficulty-${challenge.difficulty.toLowerCase()}`}>
                    {challenge.difficulty}
                  </span>
                </div>

                <div className="challenge-actions">
                  <button className="edit-button" onClick={() => openEdit(challenge)}>
                    Edit
                  </button>
                  <button className="delete-button" onClick={() => deleteChallenge(challenge._id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}

        <footer>© 2026 FitTrack+ · Your journey, your progress.</footer>
      </main>

      {showForm && (
        <div className="modal-overlay">
          <form className="challenge-form" onSubmit={saveChallenge}>
            <h2>{editingId ? "Edit Challenge" : "Create Challenge"}</h2>
            <p>Enter your challenge details.</p>

            <label htmlFor="title">Challenge title</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={updateField}
              required
              maxLength={100}
              placeholder="e.g. 7-Day Walking Challenge"
            />

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={updateField}
              required
              rows={3}
              placeholder="Describe the challenge"
            />

            <label htmlFor="duration">Duration (days)</label>
            <input
              id="duration"
              name="duration"
              type="number"
              min="1"
              max="365"
              value={form.duration}
              onChange={updateField}
              required
            />

            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              name="difficulty"
              value={form.difficulty}
              onChange={updateField}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <label htmlFor="participants">Participants</label>
            <input
              id="participants"
              name="participants"
              type="number"
              min="0"
              value={form.participants}
              onChange={updateField}
              required
            />

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                disabled={saving}
              >
                Cancel
              </button>
              <button className="primary-button" type="submit" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Save Changes" : "Create Challenge"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
