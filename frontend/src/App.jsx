import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:8081/api/events";

// --- CLOUDINARY CONFIG (Put your details here) ---
const CLOUD_NAME = "your_cloud_name";
const UPLOAD_PRESET = "your_preset_name";

function App() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [newEvent, setNewEvent] = useState({ title: '', category: '', imageUrl: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); // Track image upload status

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const loadData = () => {
    setLoading(true);
    axios.get(API_URL)
      .then(res => { setEvents(res.data); setLoading(false); })
      .catch(err => { console.error("Backend offline!", err); setLoading(false); });
  };

  useEffect(() => { loadData(); }, []);

  // --- NEW: DIRECT IMAGE UPLOAD FUNCTION ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    setUploading(true);
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );
      setNewEvent({ ...newEvent, imageUrl: response.data.secure_url });
      setUploading(false);
    } catch (error) {
      console.error("Upload error", error);
      setUploading(false);
      alert("Image upload failed!");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminPassword === "admin123") { setIsLoggedIn(true); setAdminPassword(''); }
    else { alert("Incorrect Admin Password!"); }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newEvent.imageUrl) return alert("Please upload an image first!");

    axios.post(API_URL, newEvent).then(() => {
      loadData();
      setNewEvent({ title: '', category: '', imageUrl: '', description: '' });
      alert("Portfolio updated!");
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this project?")) {
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

      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        {isLoggedIn && <button onClick={() => setIsLoggedIn(false)} style={{ color: '#e74c3c', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Logout Admin</button>}
      </div>

      <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '10px' }}>Bliss Events & Decor</h1>
      <p style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '30px' }}>Luxury Decorations for Every Occasion</p>

      {/* --- ADMIN FORM --- */}
      {isLoggedIn && (
        <div style={{ maxWidth: '600px', margin: '0 auto 40px auto', background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, textAlign: 'center' }}>Admin: Upload New Work</h3>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input style={{ padding: '12px' }} type="text" placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} required />

            <select style={{ padding: '12px' }} value={newEvent.category} onChange={e => setNewEvent({ ...newEvent, category: e.target.value })} required>
              <option value="">Select Category</option>
              <option value="Wedding">Wedding</option>
              <option value="Birthday">Birthday</option>
              <option value="Balloon Decor">Balloon Decor</option>
              <option value="Name Opening">Name Opening</option>
            </select>

            {/* DIRECT FILE UPLOAD BUTTON */}
            <div style={{ border: '1px dashed #ccc', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Upload Photo:</p>
              <input type="file" onChange={handleImageUpload} accept="image/*" />
              {uploading && <p style={{ color: 'blue', fontSize: '12px' }}>Uploading to cloud...</p>}
              {newEvent.imageUrl && <p style={{ color: 'green', fontSize: '12px' }}>✅ Image Ready</p>}
            </div>

            <textarea style={{ padding: '12px', minHeight: '80px' }} placeholder="Short Description" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} required />
            <button disabled={uploading} style={{ padding: '15px', background: uploading ? '#ccc' : '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }} type="submit">Publish to Portfolio</button>
          </form>
        </div>
      )}

      {/* --- SEARCH & FILTERS --- */}
      <div style={{ maxWidth: '700px', margin: '0 auto 25px auto' }}>
        <input type="text" placeholder="🔍 Search decorations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '15px 25px', borderRadius: '30px', border: '1px solid #ddd', fontSize: '16px', outline: 'none' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
        {['All', 'Wedding', 'Birthday', 'Balloon Decor', 'Name Opening'].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{ padding: '10px 22px', borderRadius: '25px', border: 'none', background: filter === cat ? '#3498db' : '#fff', color: filter === cat ? 'white' : '#3498db', cursor: 'pointer', fontWeight: 'bold' }}>{cat}</button>
        ))}
      </div>

      {/* --- GALLERY --- */}
      {loading ? <p style={{ textAlign: 'center' }}>Loading Gallery...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          {events
            .filter(item => (filter === 'All' || item.category === filter) && (item.title.toLowerCase().includes(searchTerm.toLowerCase())))
            .map(item => (
              <div key={item.id} style={{ background: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <img src={item.imageUrl} style={{ width: '100%', height: '240px', objectFit: 'cover' }} alt="work" />
                <div style={{ padding: '20px' }}>
                  <span style={{ fontSize: '11px', background: '#e1f5fe', color: '#0288d1', padding: '4px 10px', borderRadius: '10px', fontWeight: 'bold' }}>{item.category}</span>
                  <h4 style={{ margin: '15px 0 10px 0' }}>{item.title}</h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>{item.description}</p>
                  <button onClick={() => handleWhatsApp(item.title)} style={{ width: '100%', background: '#25D366', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>Inquire on WhatsApp</button>
                  {isLoggedIn && <button onClick={() => handleDelete(item.id)} style={{ width: '100%', background: 'none', color: '#ff7675', border: '1px solid #ff7675', padding: '8px', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}>Remove</button>}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* --- LOGIN --- */}
      {!isLoggedIn && (
        <div style={{ marginTop: '100px', textAlign: 'center', borderTop: '1px solid #ddd', padding: '40px' }}>
          <form onSubmit={handleLogin}>
            <input type="password" placeholder="Admin Password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
            <button type="submit" style={{ marginLeft: '10px', padding: '10px 20px', borderRadius: '8px', background: '#2c3e50', color: 'white' }}>Login</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;