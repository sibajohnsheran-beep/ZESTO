
import {
  ArrowRight,
  ArrowUpRight,
  ChefHat,
  Flame,
  Heart,
  Sparkles,
} from "lucide-react";

import "./SpecialOffers.css";

export default function SpecialOffers() {
  return (
    <section
      className="zesto-offers"
      id="offers"
      aria-labelledby="zesto-offers-heading"
    >
      <div className="zesto-offers-container">

        {/* SECTION HEADING */}

        <div className="zesto-offers-heading">
          <div className="zesto-offers-heading-main">
            <span className="zesto-offers-eyebrow">
              <span className="zesto-offers-line" />
              THE ZESTO EXPERIENCE
            </span>

            <h2 id="zesto-offers-heading">
              Something <em>Special.</em>
            </h2>
          </div>

          <p>
            Some flavours deserve the spotlight.
            Discover our favourite creations and
            find your next pizza obsession.
          </p>
        </div>

        {/* EDITORIAL OFFER PANELS */}

        <div className="zesto-offers-grid">

          {/* FIRST FEATURE - PEPPERONI */}

          <article className="zesto-offer-feature">
            <div className="zesto-offer-feature-image">
              <img
                src="/images/pizzas/pepperoni.png"
                alt="Premium Pepperoni Feast pizza"
                loading="lazy"
              />
            </div>

            <div className="zesto-offer-feature-shade" />

            <div className="zesto-offer-topline">
              <span className="zesto-offer-pill">
                <Flame size={15} />
                SIGNATURE SPOTLIGHT
              </span>

              <span className="zesto-offer-index">
                01 / 02
              </span>
            </div>

            <div className="zesto-offer-feature-content">
              <div className="zesto-offer-mini-label">
                THE CROWD FAVOURITE
              </div>

              <h3>
                The Signature
                <em> Craving.</em>
              </h3>

              <p>
                Rich mozzarella. Bold pepperoni.
                Golden-baked perfection. One pizza,
                unforgettable flavour.
              </p>

              <div className="zesto-offer-feature-bottom">
                <span className="zesto-offer-product">
                  PEPPERONI FEAST
                </span>

                <a
                  href="#menu"
                  className="zesto-offer-link"
                >
                  Explore Menu
                  <ArrowUpRight size={19} />
                </a>
              </div>
            </div>
          </article>

          {/* SECOND FEATURE - PIZZA PAIRING */}

          <article className="zesto-offer-pair">
            <div className="zesto-offer-pair-topline">
              <span className="zesto-offer-pill zesto-offer-pill-gold">
                <Heart size={15} />
                MADE FOR SHARING
              </span>

              <span className="zesto-offer-index">
                02 / 02
              </span>
            </div>

            <div className="zesto-offer-pair-visual">
              <div className="zesto-offer-pair-glow" />

              <img
                className="zesto-offer-pizza-first"
                src="/images/pizzas/bbq-chicken.png"
                alt="Smoky BBQ Chicken pizza"
                loading="lazy"
              />

              <img
                className="zesto-offer-pizza-second"
                src="/images/pizzas/four-cheese.png"
                alt="Four Cheese Melt pizza"
                loading="lazy"
              />

              <span className="zesto-offer-pair-symbol">
                +
              </span>
            </div>

            <div className="zesto-offer-pair-content">
              <div className="zesto-offer-mini-label">
                TWO FLAVOURS. ONE GREAT MOMENT.
              </div>

              <h3>
                Better
                <em> Together.</em>
              </h3>

              <p>
                Smoky BBQ Chicken meets the rich,
                creamy Four Cheese Melt. A pairing
                worth sharing.
              </p>

              <div className="zesto-offer-pair-footer">
                <span>
                  EXPLORE THE COLLECTION
                </span>

                <a
                  href="#menu"
                  className="zesto-offer-circle-link"
                  aria-label="Explore pizza menu"
                >
                  <ArrowRight size={21} />
                </a>
              </div>
            </div>
          </article>
        </div>

        {/* SECTION BOTTOM FEATURES */}

        <div className="zesto-offers-benefits">
          <div className="zesto-offers-benefit">
            <ChefHat size={23} strokeWidth={1.5} />
            <span>Handcrafted With Passion</span>
          </div>

          <span className="zesto-offers-benefit-divider" />

          <div className="zesto-offers-benefit">
            <Sparkles size={23} strokeWidth={1.5} />
            <span>Premium Ingredients</span>
          </div>

          <span className="zesto-offers-benefit-divider" />

          <div className="zesto-offers-benefit">
            <Heart size={23} strokeWidth={1.5} />
            <span>Made For Every Moment</span>
          </div>
        </div>

      </div>
    </section>
  );
}
