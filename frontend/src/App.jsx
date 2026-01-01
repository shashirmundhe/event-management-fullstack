import React, { useEffect, useState } from 'react';
import axios from 'axios';

// --- CONFIGURATION ---
// This allows your app to work on your computer AND on the internet later
const API_URL = "http://localhost:8081/api/events";

function App() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [newEvent, setNewEvent] = useState({ title: '', category: '', imageUrl: '', description: '' });
  const [loading, setLoading] = useState(true); // NEW: Track loading status

  // --- ADMIN AUTH STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const loadData = () => {
    setLoading(true);
    axios.get(API_URL)
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Backend offline!", err);
        setLoading(false);
      });
  };

  useEffect(() => { loadData(); }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminPassword === "admin123") {
      setIsLoggedIn(true);
      setAdminPassword('');
    } else {
      alert("Incorrect Admin Password!");
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    axios.post(API_URL, newEvent)
      .then(() => {
        loadData();
        setNewEvent({ title: '', category: '', imageUrl: '', description: '' });
        alert("Portfolio updated successfully!");
      })
      .catch(() => alert("Error uploading. Is the server running?"));
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this project from your portfolio?")) {
      axios.delete(`${API_URL}/${id}`).then(() => loadData());
    }
  };

  const handleWhatsApp = (title) => {
    const myNumber = "918956776400";
    const msg = `Hi! I'm interested in your ${title} decoration. Can you share the price?`;
    window.open(`https://wa.me/${myNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', padding: '20px', fontFamily: 'Segoe UI' }}>

      {/* Logout Button */}
      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        {isLoggedIn && (
          <button onClick={() => setIsLoggedIn(false)} style={{ color: '#e74c3c', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            Logout Admin
          </button>
        )}
      </div>

      <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '10px' }}>Bliss Events & Decor</h1>
      <p style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '30px' }}>Luxury Decorations for Every Occasion</p>

      {/* --- ADMIN FORM --- */}
      {isLoggedIn && (
        <div style={{ maxWidth: '600px', margin: '0 auto 40px auto', background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, textAlign: 'center' }}>Admin Control: Upload New Work</h3>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input style={{ padding: '12px' }} type="text" placeholder="Title (e.g. Royal Stage Decor)" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} required />
            <select style={{ padding: '12px' }} value={newEvent.category} onChange={e => setNewEvent({ ...newEvent, category: e.target.value })} required>
              <option value="">Select Category</option>
              <option value="Wedding">Wedding</option>
              <option value="Birthday">Birthday</option>
              <option value="Balloon Decor">Balloon Decor</option>
              <option value="Name Opening">Name Opening</option>
            </select>
            <input style={{ padding: '12px' }} type="text" placeholder="Image URL" value={newEvent.imageUrl} onChange={e => setNewEvent({ ...newEvent, imageUrl: e.target.value })} required />
            <textarea style={{ padding: '12px', minHeight: '80px' }} placeholder="Short Description" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} required />
            <button style={{ padding: '15px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }} type="submit">Publish to Portfolio</button>
          </form>
        </div>
      )}

      {/* --- SEARCH BAR --- */}
      <div style={{ maxWidth: '700px', margin: '0 auto 25px auto' }}>
        <input
          type="text"
          placeholder="🔍 Search decorations (e.g. 'Pink', 'Stage', 'Entry')..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '15px 25px', borderRadius: '30px', border: '1px solid #ddd', fontSize: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', outline: 'none' }}
        />
      </div>

      {/* --- FILTER BUTTONS --- */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
        {['All', 'Wedding', 'Birthday', 'Balloon Decor', 'Name Opening'].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{ padding: '10px 22px', borderRadius: '25px', border: 'none', background: filter === cat ? '#3498db' : '#fff', color: filter === cat ? 'white' : '#3498db', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>{cat}</button>
        ))}
      </div>

      {/* --- GALLERY GRID --- */}
      {loading ? (
        <p style={{ textAlign: 'center' }}>Connecting to database...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          {events
            .filter(item => (filter === 'All' || item.category === filter) &&
              (item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase())))
            .map(item => (
              <div key={item.id} style={{ background: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                <img src={item.imageUrl} style={{ width: '100%', height: '240px', objectFit: 'cover' }} alt="work" />
                <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', background: '#e1f5fe', color: '#0288d1', padding: '4px 10px', borderRadius: '10px', fontWeight: 'bold', width: 'fit-content' }}>{item.category}</span>
                  <h4 style={{ margin: '15px 0 10px 0', fontSize: '1.2rem' }}>{item.title}</h4>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', lineHeight: '1.4' }}>{item.description}</p>

                  <div style={{ marginTop: 'auto' }}>
                    <button onClick={() => handleWhatsApp(item.title)} style={{ width: '100%', background: '#25D366', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                      Inquire on WhatsApp
                    </button>

                    {isLoggedIn && (
                      <button onClick={() => handleDelete(item.id)} style={{ width: '100%', background: 'none', color: '#ff7675', border: '1px solid #ff7675', padding: '8px', borderRadius: '8px', cursor: 'pointer', marginTop: '10px', fontSize: '13px' }}>Remove From Portfolio</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* --- ADMIN LOGIN FOOTER --- */}
      {!isLoggedIn && (
        <div style={{ marginTop: '100px', textAlign: 'center', borderTop: '1px solid #ddd', padding: '40px 20px' }}>
          <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Admin access only below</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <input
              type="password"
              placeholder="Admin Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', width: '200px' }}
            />
            <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#2c3e50', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Login</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;