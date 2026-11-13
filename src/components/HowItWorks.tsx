
import {
  ArrowRight,
  Bike,
  ChefHat,
  Check,
  Pizza,
  SlidersHorizontal,
} from "lucide-react";

import "./HowItWorks.css";

const steps = [
  {
    number: "01",
    icon: Pizza,
    title: "Choose Your Pizza",
    description:
      "Explore our signature collection and find the perfect pizza for your cravings.",
    detail: "EXPLORE",
  },
  {
    number: "02",
    icon: SlidersHorizontal,
    title: "Make It Yours",
    description:
      "Pick your preferred pizza size and quantity before adding it to your order.",
    detail: "CUSTOMIZE",
  },
  {
    number: "03",
    icon: ChefHat,
    title: "Freshly Prepared",
    description:
      "Every pizza is made with care, quality ingredients and our passion for flavour.",
    detail: "PREPARE",
  },
  {
    number: "04",
    icon: Bike,
    title: "Enjoy Every Slice",
    description:
      "Get ready to enjoy delicious, freshly baked pizza with the people you love.",
    detail: "ENJOY",
  },
];

export default function HowItWorks() {
  return (
    <section className="zesto-how" id="how-it-works">
      <div className="zesto-how-container">

        {/* SECTION HEADING */}
        <div className="zesto-how-heading">
          <div className="zesto-how-eyebrow">
            <span />
            SIMPLE STEPS. BIG FLAVOUR.
            <span />
          </div>

          <h2>
            How It <em>Works.</em>
          </h2>

          <p>
            Your pizza journey begins with a craving.
            Discover how we turn it into something
            unforgettable.
          </p>
        </div>

        {/* FOUR STEPS */}
        <div className="zesto-how-steps">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article
                className="zesto-how-step"
                key={step.number}
              >
                <div className="zesto-how-icon-area">
                  <div className="zesto-how-icon-halo" />

                  <div className="zesto-how-icon-ring">
                    <Icon
                      size={36}
                      strokeWidth={1.5}
                    />
                  </div>

                  <span className="zesto-how-step-number">
                    {step.number}
                  </span>
                </div>

                <div className="zesto-how-step-copy">
                  <span className="zesto-how-detail">
                    {step.detail}
                  </span>

                  <h3>{step.title}</h3>

                  <p>{step.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <span
                    className="zesto-how-connector"
                    aria-hidden="true"
                  >
                    <ArrowRight size={17} />
                  </span>
                )}
              </article>
            );
          })}
        </div>

        {/* BOTTOM CALL TO ACTION */}
        <div className="zesto-how-bottom">
          <div className="zesto-how-note">
            <span className="zesto-how-check">
              <Check size={17} />
            </span>

            <span>
              Fresh ingredients. Made with love.
              Crafted for every pizza moment.
            </span>
          </div>

          <a
            href="#menu"
            className="zesto-how-button"
          >
            Explore Our Menu
            <ArrowRight size={18} />
          </a>
        </div>

        {/* DECORATIVE BACKGROUND */}
        <div
          className="zesto-how-bg-glow"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
