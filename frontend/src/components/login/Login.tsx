import { useState, type ChangeEvent, type FormEvent } from 'react';
import styles from './Login.module.css';
import { Link } from 'react-router';

interface FormData {
  name: string;
  email: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Please sign in to continue</p>

        <div className={styles.inputGroup}>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label>Name</label>
        </div>
        <div className={styles.inputGroup}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label>Email</label>
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label>Password</label>
        </div>

        <button type="submit" className={styles.button}>
          Sign In
        </button>

        <div className={styles.footer}>
          <span>Don't have an account?</span>  <Link to="login" className={styles.loginLink}> Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;