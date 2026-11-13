
import {
  ArrowRight,
  ArrowUp,
  Heart,
  Phone,
} from "lucide-react";

import "./Footer.css";

const footerLinks = [
  { name: "Home", href: "#home" },
  { name: "Our Story", href: "#about" },
  { name: "Pizza Menu", href: "#menu" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Special Offers", href: "#offers" },
];

export default function Footer() {
  return (
    <footer className="zesto-footer" id="contact">
      <div className="zesto-footer-container">

        {/* MAIN FOOTER */}
        <div className="zesto-footer-main">

          {/* BRAND */}
          <div className="zesto-footer-brand">
            <a href="#home" className="zesto-footer-logo">
              <img
                src="/images/zesto-logo.png"
                alt="ZESTO Pizza"
              />
            </a>

            <p>
              Fresh ingredients. Authentic recipes.
              Unforgettable flavour. Every slice is
              crafted with passion.
            </p>

            <div className="zesto-footer-brand-label">
              <span className="zesto-footer-dot" />
              FRESHLY BAKED. MADE WITH LOVE.
            </div>
          </div>

          {/* EXPLORE LINKS */}
          <div className="zesto-footer-links">
            <h3>Explore</h3>

            <nav aria-label="Footer navigation">
              {footerLinks.map((link) => (
                <a href={link.href} key={link.name}>
                  <ArrowRight size={14} />
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* CONTACT */}
          <div className="zesto-footer-contact">
            <h3>Get In Touch</h3>

            <p>
              Have a question about this website?
              Get in touch with our development team.
            </p>

            <a
              href="tel:+94760041594"
              className="zesto-footer-phone"
            >
              <span className="zesto-footer-phone-icon">
                <Phone size={20} />
              </span>

              <span className="zesto-footer-phone-copy">
                <small>DEVELOPER CONTACT</small>
                <strong>+94 76 004 1594</strong>
              </span>
            </a>
          </div>
        </div>

        <div className="zesto-footer-divider" />

        {/* BOTTOM FOOTER */}
        <div className="zesto-footer-bottom">

          <div className="zesto-footer-copyright">
            © {new Date().getFullYear()} ZESTO.
            All Rights Reserved.
          </div>

          <div className="zesto-footer-developer">
            <span>Developed with</span>

            <Heart
              size={13}
              fill="currentColor"
              className="zesto-footer-heart"
            />

            <span>by</span>
            <strong>NeirahTech</strong>
          </div>

          <a
            href="#home"
            className="zesto-footer-backtop"
            aria-label="Back to top"
          >
            <ArrowUp size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
