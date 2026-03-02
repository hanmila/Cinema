import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import AdminHeader from "../components/AdminHeader";
import "../css/LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Простая проверка логина
    const correctEmail = "shfe-diplom@netology.ru";
    const correctPassword = "shfe-diplom";

    if (email === correctEmail && password === correctPassword) {
      navigate("/admin");
    } else {
      alert("Неверный email или пароль!");
    }
  };

  return (
    <AdminLayout>
      <AdminHeader />

      <div className="login-container">
        <section className="login-form-frame">
          <div className="frame-header">
            <div className="heading">
              <h2 className="login-form-heading">Авторизация</h2>
            </div>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <label className="form__field form__field--long">
              <span className="form__label">E-mail</span>
              <input
                type="email"
                placeholder="example@domain.xyz"
                className="form__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="form__field form__field--long">
              <span className="form__label">Пароль</span>
              <input
                type="password"
                className="form__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <div className="text-center">
              <button type="submit" className="login-form__btn">
                Авторизоваться
              </button>
            </div>
          </form>
        </section>
      </div>
    </AdminLayout>
  );
};

export default LoginPage;