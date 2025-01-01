import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    maxMonthlyBudget: 0,
    description: '',
    role: '',
    skills: '',
    contact: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: '',
    head: '',
  });

  const navigate = useNavigate(); // Replaced useHistory with useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, maxMonthlyBudget, description, role, skills, contact } = formData;

    // Simple validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters long.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Make an API call for sign-up (replace with actual API endpoint)
      const response = await fetch('http://localhost:5000/api/auth/createuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          maxMonthlyBudget,
          description,
          role,
          skills: skills.split(','),
          contact,
        }),
      });

      const json = await response.json();
      console.log(json);

      if (response.ok) {
        // Store the authentication token in localStorage (or cookies)
        localStorage.setItem('authToken', json.authToken);

        setAlert({
          show: true,
          message: 'Sign-up successful!',
          type: 'success',
          head: 'Success',
        });

        // Navigate to home or dashboard page after successful sign-up
        setTimeout(() => {
          navigate('/'); // Redirect to home page or dashboard
        }, 500); // Delay navigation to allow the user to see the success alert
      } else {
        setAlert({
          show: true,
          message: json.message || 'Something went wrong. Please try again.',
          type: 'danger',
          head: 'Error',
        });
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      setAlert({
        show: true,
        message: 'An error occurred. Please try again later.',
        type: 'danger',
        head: 'Error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4" style={{ width: '100%', maxWidth: '450px' }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        {alert.show && (
          <div className={`alert alert-${alert.type}`}>
            <strong>{alert.head}!</strong> {alert.message}
          </div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-control"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {/* New input fields */}
          <div className="mb-3">
            <label htmlFor="maxMonthlyBudget" className="form-label">Max Monthly Budget</label>
            <input
              type="number"
              id="maxMonthlyBudget"
              name="maxMonthlyBudget"
              className="form-control"
              placeholder="Enter max monthly budget"
              value={formData.maxMonthlyBudget}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              placeholder="Enter a short description about yourself"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="role" className="form-label">Role</label>
            <input
              type="text"
              id="role"
              name="role"
              className="form-control"
              placeholder="Enter your role (e.g., Student, Developer)"
              value={formData.role}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="skills" className="form-label">Skills</label>
            <input
              type="text"
              id="skills"
              name="skills"
              className="form-control"
              placeholder="Enter your skills, separated by commas"
              value={formData.skills}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="contact" className="form-label">Contact Number</label>
            <input
              type="text"
              id="contact"
              name="contact"
              className="form-control"
              placeholder="Enter your contact number"
              value={formData.contact}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <a href="/login" className="text-success">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
