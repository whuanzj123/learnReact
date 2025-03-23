import { useState } from 'react';
import './TokenForm.css';

function TokenForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    roles: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert roles string to array for the API
    const userData = {
      ...formData,
      roles: formData.roles ? formData.roles.split(',').map(role => role.trim()) : []
    };
    
    onSubmit(userData);
  };

  return (
    <div className="form-container">
      <h2>Create Your Digital ID</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username*</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Enter your username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="full_name">Full Name</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="roles">Roles (comma separated)</label>
          <input
            type="text"
            id="roles"
            name="roles"
            value={formData.roles}
            onChange={handleChange}
            placeholder="e.g., admin, user, editor"
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Generating...' : 'Generate ID Card'}
        </button>
      </form>
    </div>
  );
}

export default TokenForm;