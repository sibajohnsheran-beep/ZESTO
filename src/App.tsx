
import { useEffect, useState } from "react";

import {
  ArrowRight,
  ChevronDown,
  LockKeyhole,
  Menu,
  Play,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";

import HeroPizza3D from "./components/HeroPizza3D";
import OurStory from "./components/OurStory";
import FreshIngredients from "./components/FreshIngredients";
import HowItWorks from "./components/HowItWorks";
import SpecialOffers from "./components/SpecialOffers";
import Footer from "./components/Footer";

import PizzaMenu, {
  formatLKR,
  type CartSelection,
} from "./components/PizzaMenu";

// ========================================
// NAVIGATION LINKS
// ========================================

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Menu", href: "#menu" },
  { name: "About", href: "#about" },
  { name: "Offers", href: "#offers" },
  { name: "Contact", href: "#contact" },
];

const CART_STORAGE_KEY = "zesto-cart-v1";

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");

  const [cartItems, setCartItems] = useState<
    CartSelection[]
  >(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);

      if (!saved) return [];

      const parsed: unknown = JSON.parse(saved);

      return Array.isArray(parsed)
        ? (parsed as CartSelection[])
        : [];
    } catch {
      return [];
    }
  });

  // ========================================
  // SAVE CART DATA
  // ========================================

  useEffect(() => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  // ========================================
  // HIDE NOTIFICATION AUTOMATICALLY
  // ========================================

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast("");
    }, 2800);

    return () => window.clearTimeout(timer);
  }, [toast]);

  // ========================================
  // CLOSE CART WITH ESCAPE KEY
  // ========================================

  useEffect(() => {
    if (!cartOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCartOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () =>
      window.removeEventListener(
        "keydown",
        closeOnEscape
      );
  }, [cartOpen]);

  // ========================================
  // CART COUNT AND TOTAL
  // ========================================

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // ========================================
  // SCROLL TO PIZZA MENU
  // ========================================

  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setMobileOpen(false);
    setCartOpen(false);
  };

  // ========================================
  // ADD PIZZA TO CART
  // ========================================

  const handleAddToCart = (
    selection: CartSelection
  ) => {
    setCartItems((previous) => {
      const existing = previous.find(
        (item) =>
          item.id === selection.id &&
          item.size === selection.size
      );

      if (existing) {
        return previous.map((item) =>
          item.id === selection.id &&
          item.size === selection.size
            ? {
                ...item,
                quantity:
                  item.quantity + selection.quantity,
              }
            : item
        );
      }

      return [...previous, selection];
    });

    setToast(
      `${selection.quantity} × ${selection.name} added to cart!`
    );
  };

  // ========================================
  // REMOVE PIZZA FROM CART
  // ========================================

  const removeCartItem = (
    id: string,
    size: string
  ) => {
    setCartItems((previous) =>
      previous.filter(
        (item) =>
          !(item.id === id && item.size === size)
      )
    );
  };

  return (
    <div className="website">

      {/* =====================================
          NAVBAR
      ===================================== */}

      <header className="navbar">
        <a
          className="brand"
          href="#home"
          aria-label="ZESTO Home"
        >
          <img
            src="/images/zesto-logo.png"
            alt="ZESTO"
            className="brand-logo"
            onError={(event) => {
              event.currentTarget.style.display = "none";

              const fallback =
                event.currentTarget.nextElementSibling;

              if (fallback instanceof HTMLElement) {
                fallback.style.display = "block";
              }
            }}
          />

          <span className="brand-fallback">
            ZESTO
          </span>
        </a>

        {/* DESKTOP NAVIGATION */}

        <nav
          className="desktop-nav"
          aria-label="Main navigation"
        >
          {navLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              className={
                index === 0
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* =====================================
            NAVBAR ACTIONS
        ===================================== */}

        <div className="nav-actions">

          {/* =====================================
              NEW ADMIN LOGIN ICON
              BEFORE SEARCH ICON
          ===================================== */}

          <a
            href="/admin/login"
            className="icon-button admin-login-button"
            title="Admin Login"
            aria-label="Admin Login"
          >
            <LockKeyhole
              size={21}
              strokeWidth={1.9}
            />
          </a>

          {/* SEARCH ICON */}

          <button
            type="button"
            className="icon-button search-button"
            title="Search will be added later"
            aria-label="Search coming soon"
            disabled
          >
            <Search size={21} />
          </button>

          {/* CART ICON */}

          <button
            type="button"
            className="icon-button cart-icon"
            title="Open your cart"
            aria-label={`Open cart with ${cartCount} items`}
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart size={22} />

            <span className="cart-count">
              {cartCount}
            </span>
          </button>

          {/* ORDER NOW BUTTON */}

          <button
            type="button"
            className="order-button"
            onClick={scrollToMenu}
          >
            Order Now
            <ArrowRight size={18} />
          </button>

          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            className="mobile-toggle"
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X size={25} />
            ) : (
              <Menu size={25} />
            )}
          </button>
        </div>

        {/* MOBILE NAVIGATION */}

        {mobileOpen && (
          <nav
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() =>
                  setMobileOpen(false)
                }
              >
                {link.name}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* =====================================
          MAIN WEBSITE CONTENT
      ===================================== */}

      <main>

        {/* =====================================
            PART 01 - HERO SECTION
        ===================================== */}

        <section className="hero" id="home">
          <div
            className="hero-glow hero-glow-one"
            aria-hidden="true"
          />

          <div
            className="hero-glow hero-glow-two"
            aria-hidden="true"
          />

          {/* LEFT SIDE CONTENT */}

          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              <span>PREMIUM PIZZA</span>
              <span className="eyebrow-line" />
            </div>

            <h1 className="hero-title">
              <span>ZESTO</span>
              <em>Pizza</em>
            </h1>

            <p className="hero-description">
              Fresh Ingredients. Authentic Recipes.
              <br />
              Irresistible Taste.
            </p>

            {/* HERO BUTTONS */}

            <div className="hero-buttons">
              <button
                type="button"
                className="primary-button"
                onClick={scrollToMenu}
              >
                Order Now
                <ArrowRight size={19} />
              </button>

              <button
                type="button"
                className="outline-button"
                onClick={scrollToMenu}
              >
                Explore Menu

                <Play
                  size={15}
                  fill="currentColor"
                />
              </button>
            </div>

            {/* SOCIAL PROOF */}

            <div className="hero-social-proof">
              <div className="avatar-stack">
                <span>🍕</span>
                <span>❤️</span>
                <span>⭐</span>
              </div>

              <div className="proof-copy">
                <strong>Made with Love</strong>
                <small>Freshly crafted pizza</small>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - 3D PIZZA */}

          <div className="hero-visual">
            <div
              className="pizza-backlight"
              aria-hidden="true"
            />

            <div className="pizza-scene">
              <HeroPizza3D />
            </div>

            <div className="hero-visual-label">
              <span className="visual-label-line" />
              FRESHLY BAKED
            </div>

            <div className="pizza-quality">
              <span className="quality-icon">
                ✦
              </span>

              <div>
                <strong>Premium Quality</strong>
                <small>Every Slice, Perfected</small>
              </div>
            </div>
          </div>

          {/* SCROLL INDICATOR */}

          <a
            className="scroll-indicator"
            href="#menu"
          >
            <span className="mouse-outline">
              <span className="mouse-wheel" />
            </span>

            <span>Scroll to Explore</span>
            <ChevronDown size={16} />
          </a>

          <div
            className="hero-bottom-glow"
            aria-hidden="true"
          />
        </section>

        {/* =====================================
            PART 02 - OUR STORY 3D
        ===================================== */}

        <OurStory />

        {/* =====================================
            PART 03 - FRESH INGREDIENTS 3D
        ===================================== */}

        <FreshIngredients />

        {/* =====================================
            PART 04 - PREMIUM PIZZA MENU
        ===================================== */}

        <PizzaMenu
          onAddToCart={handleAddToCart}
        />

        {/* =====================================
            PART 05 - HOW IT WORKS
        ===================================== */}

        <HowItWorks />

        {/* =====================================
            PART 06 - SPECIAL OFFERS
        ===================================== */}

        <SpecialOffers />

      </main>

      {/* =====================================
          PART 07 - PREMIUM FOOTER
      ===================================== */}

      <Footer />

      {/* =====================================
          SHOPPING CART DRAWER
      ===================================== */}

      {cartOpen && (
        <div
          className="zesto-cart-scrim"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="zesto-cart-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="zesto-cart-title"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* CART HEADER */}

            <div className="zesto-cart-panel-header">
              <h2 id="zesto-cart-title">
                Your Cart ({cartCount})
              </h2>

              <button
                type="button"
                className="zesto-cart-close"
                aria-label="Close cart"
                onClick={() =>
                  setCartOpen(false)
                }
              >
                <X size={19} />
              </button>
            </div>

            {/* CART ITEMS */}

            {cartItems.length === 0 ? (
              <div className="zesto-cart-empty">
                <ShoppingCart
                  size={40}
                  style={{
                    margin: "0 auto 15px",
                  }}
                />

                <p>
                  Your cart is empty.
                  <br />
                  Time to pick your favourite pizza!
                </p>
              </div>
            ) : (
              <div className="zesto-cart-items">
                {cartItems.map((item) => (
                  <div
                    className="zesto-cart-item"
                    key={`${item.id}-${item.size}`}
                  >
                    <div className="zesto-cart-item-info">
                      <strong>
                        {item.name}
                      </strong>

                      <small>
                        {item.size} × {item.quantity}
                      </small>

                      <span>
                        {formatLKR(
                          item.price * item.quantity
                        )}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="zesto-cart-remove"
                      onClick={() =>
                        removeCartItem(
                          item.id,
                          item.size
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* CART FOOTER */}

            <div className="zesto-cart-footer">
              <div className="zesto-cart-total">
                <span>Subtotal</span>

                <strong>
                  {formatLKR(cartTotal)}
                </strong>
              </div>

              <button
                type="button"
                className="zesto-cart-continue"
                onClick={scrollToMenu}
              >
                Continue Shopping
              </button>

              <p className="zesto-cart-note">
                Checkout will be added in the next phase.
              </p>
            </div>
          </aside>
        </div>
      )}

      {/* =====================================
          ADD TO CART NOTIFICATION
      ===================================== */}

      {toast && (
        <div
          className="zesto-cart-toast"
          role="status"
          aria-live="polite"
        >
          ✓ {toast}
        </div>
      )}

    </div>
  );
}

export default App;
