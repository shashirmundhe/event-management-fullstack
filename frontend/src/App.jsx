import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = "http://localhost:8081/api/events";
const BASE_URL = "http://localhost:8081";

function App() {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('gallery'); // Toggle between gallery and admin
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', category: '', description: '', file: null });

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = () => {
    axios.get(API_URL).then(res => setEvents(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', newEvent.title);
    data.append('category', newEvent.category);
    data.append('description', newEvent.description);
    data.append('file', newEvent.file);

    await axios.post(API_URL, data);
    alert("Project Published!");
    fetchEvents();
    setView('gallery');
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="brand">TOM & JERRY EVENTS 4008</div>
        <div className="menu">
          <button onClick={() => setView('gallery')}>Portfolio</button>
          <button onClick={() => setView('admin')} className="admin-btn">Admin Suite</button>
        </div>
      </nav>

      {view === 'gallery' ? (
        <section className="gallery">
          <header className="hero">
            <h1>Luxury Decor & Event Planning</h1>
            <p>We create memories that last a lifetime.</p>
          </header>
          <div className="grid">
            {events.map(item => (
              <div key={item.id} className="card">
                <img src={`${BASE_URL}${item.imageUrl}`} alt={item.title} />
                <div className="card-info">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <button onClick={() => window.open(`https://wa.me/918956776400`)}>Inquire Now</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="admin-suite">
          <h2>Management Dashboard</h2>
          <form onSubmit={handleSubmit} className="upload-form">
            <input type="text" placeholder="Title" onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} required />
            <select onChange={e => setNewEvent({ ...newEvent, category: e.target.value })} required>
              <option value="">Category</option>
              <option value="Wedding">Wedding</option>
              <option value="Corporate">Corporate</option>
            </select>
            <input type="file" onChange={e => setNewEvent({ ...newEvent, file: e.target.files[0] })} required />
            <textarea placeholder="Description" onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}></textarea>
            <button type="submit">Upload to Local System</button>
          </form>
        </section>
      )}
    </div>
  );
}

export default App;