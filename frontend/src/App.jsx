import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('All'); // For filtering categories
  const [newEvent, setNewEvent] = useState({ title: '', category: '', imageUrl: '', description: '' });

  const loadData = () => {
    axios.get('http://localhost:8081/api/events')
      .then(res => setEvents(res.data))
      .catch(err => console.error("Backend offline!", err));
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/api/events', newEvent)
      .then(() => {
        loadData();
        setNewEvent({ title: '', category: '', imageUrl: '', description: '' });
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this project from your portfolio?")) {
      axios.delete(`http://localhost:8081/api/events/${id}`).then(() => loadData());
    }
  };

  // NEW: WhatsApp Inquiry Function
  const handleWhatsApp = (title) => {
    const myNumber = "918956776400"; // <-- CHANGE THIS to your 10-digit mobile number
    const msg = `Hi! I'm interested in your ${title} decoration. Can you share the price?`;
    window.open(`https://wa.me/${myNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', padding: '20px', fontFamily: 'Segoe UI' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>Event Management Portfolio</h1>

      {/* --- ADMIN FORM --- */}
      <div style={{ maxWidth: '500px', margin: '0 auto 30px auto', background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0 }}>Upload New Work</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input style={{ padding: '10px' }} type="text" placeholder="Title" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} required />
          <select style={{ padding: '10px' }} value={newEvent.category} onChange={e => setNewEvent({ ...newEvent, category: e.target.value })} required>
            <option value="">Select Category</option>
            <option value="Wedding">Wedding</option>
            <option value="Birthday">Birthday</option>
            <option value="Balloon Decor">Balloon Decor</option>
            <option value="Name Opening">Name Opening</option>
          </select>
          <input style={{ padding: '10px' }} type="text" placeholder="Image URL (Link)" value={newEvent.imageUrl} onChange={e => setNewEvent({ ...newEvent, imageUrl: e.target.value })} required />
          <textarea style={{ padding: '10px' }} placeholder="Short Description" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} required />
          <button style={{ padding: '12px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }} type="submit">Publish to Portfolio</button>
        </form>
      </div>

      {/* --- FILTER BUTTONS --- */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {['All', 'Wedding', 'Birthday', 'Balloon Decor', 'Name Opening'].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{ padding: '8px 15px', borderRadius: '20px', border: 'none', background: filter === cat ? '#3498db' : '#ddd', color: filter === cat ? 'white' : 'black', cursor: 'pointer' }}>{cat}</button>
        ))}
      </div>

      {/* --- GALLERY --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
        {events
          .filter(item => filter === 'All' || item.category === filter) // Apply Filter logic
          .map(item => (
            <div key={item.id} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <img src={item.imageUrl} style={{ width: '100%', height: '200px', objectFit: 'cover' }} alt="work" />
              <div style={{ padding: '15px' }}>
                <span style={{ fontSize: '11px', background: '#e1f5fe', color: '#0288d1', padding: '3px 8px', borderRadius: '10px', fontWeight: 'bold' }}>{item.category}</span>
                <h4 style={{ margin: '10px 0 5px 0' }}>{item.title}</h4>
                <p style={{ fontSize: '13px', color: '#666', height: '40px', overflow: 'hidden' }}>{item.description}</p>

                {/* WHATSAPP BUTTON */}
                <button onClick={() => handleWhatsApp(item.title)} style={{ width: '100%', background: '#25D366', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                  Inquire on WhatsApp
                </button>

                <button onClick={() => handleDelete(item.id)} style={{ width: '100%', background: 'none', color: '#ff7675', border: '1px solid #ff7675', padding: '5px', borderRadius: '5px', cursor: 'pointer', marginTop: '8px', fontSize: '12px' }}>Remove From Portfolio</button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;