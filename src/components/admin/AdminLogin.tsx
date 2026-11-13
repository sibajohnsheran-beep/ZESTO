
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import "./AdminLogin.css";

// ========================================
// ADMIN LOGIN CONFIGURATION
// FRONTEND PREVIEW ONLY
// ========================================

const ADMIN_EMAIL = "sheran@gmail.com";
const ADMIN_PASSWORD = "123456";

const DEMO_SESSION_KEY = "zesto-admin-demo-access";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // ========================================
  // ADMIN LOGIN HANDLER
  // ========================================

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const enteredEmail = email.trim().toLowerCase();

    // Frontend-only preview validation.
    // Replace with secure backend authentication
    // before production deployment.

    if (
      enteredEmail !== ADMIN_EMAIL ||
      password !== ADMIN_PASSWORD
    ) {
      setError("Invalid email address or password.");
      return;
    }

    sessionStorage.setItem(
      DEMO_SESSION_KEY,
      "true"
    );

    setPassword("");

    navigate("/admin/dashboard", {
      replace: true,
    });
  };

  return (
    <main className="za-login-page">
      <div
        className="za-login-glow"
        aria-hidden="true"
      />

      {/* =====================================
          TOP NAVIGATION
      ===================================== */}

      <header className="za-login-topbar">
        <a
          href="/"
          className="za-login-brand"
        >
          <img
            src="/images/zesto-logo.png"
            alt="ZESTO Pizza"
          />

          <span>
            ZESTO
            <small>ADMIN PORTAL</small>
          </span>
        </a>

        <a
          href="/"
          className="za-login-back"
        >
          <ArrowLeft size={17} />
          Back to Website
        </a>
      </header>

      {/* =====================================
          MAIN LOGIN LAYOUT
      ===================================== */}

      <div className="za-login-layout">

        {/* LEFT SIDE - SHOWCASE */}

        <section className="za-login-showcase">
          <div className="za-login-eyebrow">
            <Sparkles size={16} />
            RESTAURANT MANAGEMENT
          </div>

          <h1>
            Behind Every
            <br />
            Great <em>Slice.</em>
          </h1>

          <p>
            Welcome to the ZESTO management
            experience. A dedicated workspace
            for your restaurant, orders and menu.
          </p>

          <div className="za-login-image-wrap">
            <div className="za-login-image-glow" />

            <img
              src="/images/pizzas/pepperoni.png"
              alt="ZESTO Pepperoni Pizza"
            />

            <div className="za-login-image-label">
              <span />
              PREMIUM PIZZA EXPERIENCE
            </div>
          </div>

          <div className="za-login-showcase-bottom">
            <span>
              CRAFTED WITH PASSION
            </span>

            <span>
              MANAGED WITH PRECISION
            </span>
          </div>
        </section>

        {/* =====================================
            RIGHT SIDE - LOGIN FORM
        ===================================== */}

        <section className="za-login-form-section">
          <div className="za-login-card">

            {/* LOGIN ICON */}

            <div className="za-login-lock">
              <LockKeyhole
                size={26}
                strokeWidth={1.7}
              />
            </div>

            {/* LOGIN HEADING */}

            <div className="za-login-card-heading">
              <span>
                AUTHORIZED ACCESS ONLY
              </span>

              <h2>
                Admin <em>Login.</em>
              </h2>

              <p>
                Enter your administrator credentials
                to access the ZESTO management
                dashboard.
              </p>
            </div>

            {/* =====================================
                LOGIN FORM
            ===================================== */}

            <form
              className="za-login-form"
              onSubmit={handleSubmit}
            >

              {/* EMAIL ADDRESS */}

              <label htmlFor="za-admin-email">
                EMAIL ADDRESS
              </label>

              <div className="za-login-input-wrap">
                <Mail size={19} />

                <input
                  id="za-admin-email"
                  type="email"
                  name="email"
                  autoComplete="username"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  required
                />
              </div>

              {/* PASSWORD */}

              <label htmlFor="za-admin-password">
                PASSWORD
              </label>

              <div className="za-login-input-wrap">
                <LockKeyhole size={19} />

                <input
                  id="za-admin-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  required
                />

                <button
                  type="button"
                  className="za-login-password-toggle"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {/* SIGN IN BUTTON */}

              <button
                type="submit"
                className="za-login-submit"
              >
                Sign In to Dashboard

                <ArrowRight size={19} />
              </button>

              {/* LOGIN ERROR */}

              {error && (
                <p
                  className="za-login-notice"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </form>

            {/* SECURITY INFORMATION */}

            <div className="za-login-security">
              <ShieldCheck size={19} />

              <span>
                ZESTO Admin Portal — Frontend
                preview. Secure backend authentication
                will be integrated before production.
              </span>
            </div>

          </div>
        </section>
      </div>

      {/* =====================================
          FOOTER
      ===================================== */}

      <footer className="za-login-footer">
        <span>
          © {new Date().getFullYear()} ZESTO Pizza
        </span>

        <span>
          Developed by <strong>NeirahTech</strong>
        </span>
      </footer>
    </main>
  );
}
