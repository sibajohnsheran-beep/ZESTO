
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Flame,
  Leaf,
  Minus,
  Plus,
  ShoppingBag,
  Star,
} from "lucide-react";

import "./PizzaMenu.css";

// =======================================
// TYPES
// =======================================

export type PizzaSize = "Regular" | "Medium" | "Large";

export type CartSelection = {
  id: string;
  name: string;
  size: PizzaSize;
  price: number;
  quantity: number;
};

type Category = "Classic" | "Signature" | "Vegetarian";

type Pizza = {
  id: string;
  name: string;
  category: Category;
  description: string;
  ingredients: string[];
  basePrice: number;
  image: string;
  label?: string;
  spicy?: boolean;
  vegetarian?: boolean;
};

type PizzaMenuProps = {
  onAddToCart: (selection: CartSelection) => void;
};

// =======================================
// PIZZA DATA
// =======================================

const pizzas: Pizza[] = [
  {
    id: "pepperoni",
    name: "Pepperoni Feast",
    category: "Signature",
    description:
      "A bold and delicious classic, generously layered with premium pepperoni, rich tomato sauce and perfectly melted mozzarella.",
    ingredients: [
      "Pepperoni",
      "Mozzarella",
      "Tomato Sauce",
      "Oregano",
    ],
    basePrice: 2250,
    image: "/images/pizzas/pepperoni.png",
    label: "ZESTO FAVOURITE",
  },
  {
    id: "margherita",
    name: "Classic Margherita",
    category: "Classic",
    description:
      "Simple, timeless and full of flavour. A golden crust topped with creamy mozzarella, vibrant tomato sauce and fragrant basil.",
    ingredients: [
      "Mozzarella",
      "Tomato",
      "Fresh Basil",
      "Olive Oil",
    ],
    basePrice: 1650,
    image: "/images/pizzas/margherita.png",
    vegetarian: true,
  },
  {
    id: "bbq-chicken",
    name: "Smoky BBQ Chicken",
    category: "Signature",
    description:
      "Tender chicken, sweet smoky barbecue sauce, onions and a generous layer of melted cheese for a rich and satisfying bite.",
    ingredients: [
      "Chicken",
      "BBQ Sauce",
      "Mozzarella",
      "Onions",
    ],
    basePrice: 2450,
    image: "/images/pizzas/bbq-chicken.png",
    label: "CHEF'S SPECIAL",
  },
  {
    id: "garden",
    name: "Garden Supreme",
    category: "Vegetarian",
    description:
      "A colourful combination of freshly selected vegetables, fragrant herbs and creamy mozzarella on our signature pizza base.",
    ingredients: [
      "Mushrooms",
      "Bell Peppers",
      "Tomatoes",
      "Basil",
    ],
    basePrice: 1950,
    image: "/images/pizzas/garden-supreme.png",
    vegetarian: true,
  },
  {
    id: "four-cheese",
    name: "Four Cheese Melt",
    category: "Vegetarian",
    description:
      "A luxurious combination of rich and creamy cheeses, baked until golden for an irresistible melt-in-your-mouth experience.",
    ingredients: [
      "Mozzarella",
      "Cheddar",
      "Parmesan",
      "Cream Cheese",
    ],
    basePrice: 2350,
    image: "/images/pizzas/four-cheese.png",
    vegetarian: true,
    label: "EXTRA CHEESY",
  },
  {
    id: "spicy-volcano",
    name: "Spicy Volcano",
    category: "Signature",
    description:
      "Made for spice lovers. Bold pepperoni, fiery chilli and our signature spicy tomato sauce create an unforgettable flavour.",
    ingredients: [
      "Pepperoni",
      "Chilli",
      "Mozzarella",
      "Spicy Sauce",
    ],
    basePrice: 2550,
    image: "/images/pizzas/spicy-volcano.png",
    spicy: true,
    label: "SPICY SPECIAL",
  },
];

const categories = [
  "All",
  "Signature",
  "Classic",
  "Vegetarian",
] as const;

type FilterCategory = (typeof categories)[number];

const sizes: PizzaSize[] = [
  "Regular",
  "Medium",
  "Large",
];

const sizeMultipliers: Record<PizzaSize, number> = {
  Regular: 1,
  Medium: 1.3,
  Large: 1.6,
};

export function formatLKR(amount: number) {
  return `Rs. ${amount.toLocaleString("en-LK")}`;
}

function calculatePrice(pizza: Pizza, size: PizzaSize) {
  return (
    Math.round(
      (pizza.basePrice * sizeMultipliers[size]) / 50
    ) * 50
  );
}

// =======================================
// PIZZA MENU COMPONENT
// =======================================

export default function PizzaMenu({
  onAddToCart,
}: PizzaMenuProps) {
  const [activeCategory, setActiveCategory] =
    useState<FilterCategory>("All");

  const [selectedId, setSelectedId] =
    useState("pepperoni");

  const [selectedSize, setSelectedSize] =
    useState<PizzaSize>("Medium");

  const [quantity, setQuantity] = useState(1);

  // Filter pizzas
  const filteredPizzas = pizzas.filter(
    (pizza) =>
      activeCategory === "All" ||
      pizza.category === activeCategory
  );

  // Current selected pizza
  const selectedPizza =
    filteredPizzas.find(
      (pizza) => pizza.id === selectedId
    ) ?? filteredPizzas[0];

  const selectedIndex = filteredPizzas.findIndex(
    (pizza) => pizza.id === selectedPizza?.id
  );

  // Change category
  const handleCategoryChange = (
    category: FilterCategory
  ) => {
    setActiveCategory(category);

    const firstPizza = pizzas.find(
      (pizza) =>
        category === "All" ||
        pizza.category === category
    );

    if (firstPizza) {
      setSelectedId(firstPizza.id);
    }

    setSelectedSize("Medium");
    setQuantity(1);
  };

  // Select a pizza
  const handlePizzaSelect = (id: string) => {
    setSelectedId(id);
    setSelectedSize("Medium");
    setQuantity(1);
  };

  // Add selected pizza to cart
  const handleAddToCart = () => {
    if (!selectedPizza) return;

    onAddToCart({
      id: selectedPizza.id,
      name: selectedPizza.name,
      size: selectedSize,
      price: calculatePrice(
        selectedPizza,
        selectedSize
      ),
      quantity,
    });
  };

  if (!selectedPizza) return null;

  const unitPrice = calculatePrice(
    selectedPizza,
    selectedSize
  );

  const totalPrice = unitPrice * quantity;

  return (
    <section className="zesto-menu" id="menu">
      <div className="zesto-menu-container">

        {/* ===============================
            SECTION HEADING
        =============================== */}

        <div className="zesto-menu-intro">
          <div>
            <div className="zesto-menu-kicker">
              <span />
              HANDCRAFTED WITH PASSION
            </div>

            <h2>
              Explore Our
              <em> Menu.</em>
            </h2>
          </div>

          <p>
            Authentic flavours. Fresh ingredients.
            Unforgettable moments. Discover the
            perfect pizza for every craving.
          </p>
        </div>

        {/* ===============================
            CATEGORY FILTERS
        =============================== */}

        <div
          className="zesto-menu-categories"
          aria-label="Pizza categories"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory === category
                  ? "zesto-menu-category is-active"
                  : "zesto-menu-category"
              }
              aria-pressed={
                activeCategory === category
              }
              onClick={() =>
                handleCategoryChange(category)
              }
            >
              {category === "All"
                ? "All Pizzas"
                : category}
            </button>
          ))}
        </div>

        {/* ===============================
            MAIN MENU LAYOUT
        =============================== */}

        <div className="zesto-menu-layout">

          {/* LEFT - PIZZA LIST */}
          <div className="zesto-menu-list">

            <div className="zesto-menu-list-heading">
              <span>THE ZESTO COLLECTION</span>

              <span>
                {String(
                  filteredPizzas.length
                ).padStart(2, "0")}{" "}
                SELECTIONS
              </span>
            </div>

            {filteredPizzas.map((pizza, index) => {
              const isSelected =
                pizza.id === selectedPizza.id;

              return (
                <button
                  key={pizza.id}
                  type="button"
                  className={
                    isSelected
                      ? "zesto-menu-item is-selected"
                      : "zesto-menu-item"
                  }
                  aria-pressed={isSelected}
                  onClick={() =>
                    handlePizzaSelect(pizza.id)
                  }
                >

                  {/* NUMBER */}
                  <span className="zesto-menu-item-number">
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  {/* SMALL PIZZA PHOTO */}
                  <span className="zesto-menu-item-image">
                    <img
                      src={pizza.image}
                      alt={pizza.name}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>

                  {/* NAME & INGREDIENTS */}
                  <span className="zesto-menu-item-main">
                    <span className="zesto-menu-item-category">
                      {pizza.category}

                      {pizza.spicy && (
                        <Flame size={13} />
                      )}

                      {pizza.vegetarian && (
                        <Leaf size={13} />
                      )}
                    </span>

                    <strong>{pizza.name}</strong>

                    <small>
                      {pizza.ingredients.join(" · ")}
                    </small>
                  </span>

                  {/* PRICE & ARROW */}
                  <span className="zesto-menu-item-end">
                    <strong>
                      {formatLKR(pizza.basePrice)}
                    </strong>

                    <ArrowUpRight size={19} />
                  </span>

                </button>
              );
            })}

            <p className="zesto-menu-list-note">
              Every great pizza tells a story.
              Select your favourite to make it yours.
            </p>
          </div>

          {/* ===============================
              RIGHT - SELECTED PIZZA
          =============================== */}

          <div className="zesto-menu-selected">

            <div
              className="zesto-menu-watermark"
              aria-hidden="true"
            >
              Z
            </div>

            <div className="zesto-menu-selected-top">
              <span>SELECTED PIZZA</span>

              <span>
                {String(
                  selectedIndex + 1
                ).padStart(2, "0")}
                {" / "}
                {String(
                  filteredPizzas.length
                ).padStart(2, "0")}
              </span>
            </div>

            {/* =================================
                UPDATED CINEMATIC PIZZA IMAGE
                Full background + sharp pizza
            ================================= */}

            <div className="zesto-menu-selected-visual">

              {/* Full-width blurred background */}
              <div
                className="zesto-menu-selected-bg"
                aria-hidden="true"
                style={{
                  backgroundImage:
                    `url("${selectedPizza.image}")`,
                }}
              />

              {/* Dark cinematic overlay */}
              <div
                className="zesto-menu-selected-overlay"
                aria-hidden="true"
              />

              {/* Soft warm glow */}
              <div
                className="zesto-menu-image-glow"
                aria-hidden="true"
              />

              {/* Full pizza without cropping */}
              <img
                key={selectedPizza.id}
                src={selectedPizza.image}
                alt={`${selectedPizza.name} pizza`}
                className="zesto-menu-selected-image"
                loading="lazy"
                decoding="async"
              />

              {/* Image caption */}
              <span className="zesto-menu-image-caption">
                FRESHLY BAKED • ZESTO
              </span>

            </div>

            {/* ===============================
                PIZZA LABEL
            =============================== */}

            {selectedPizza.label && (
              <div className="zesto-menu-pizza-label">
                <Star
                  size={13}
                  fill="currentColor"
                />

                {selectedPizza.label}
              </div>
            )}

            {/* PIZZA TITLE */}
            <h3>{selectedPizza.name}</h3>

            {/* DESCRIPTION */}
            <p className="zesto-menu-selected-description">
              {selectedPizza.description}
            </p>

            {/* INGREDIENTS */}
            <div className="zesto-menu-ingredient-title">
              MADE WITH
            </div>

            <div className="zesto-menu-ingredient-tags">
              {selectedPizza.ingredients.map(
                (ingredient) => (
                  <span key={ingredient}>
                    {ingredient}
                  </span>
                )
              )}
            </div>

            {/* ===============================
                SIZE SELECTION
            =============================== */}

            <div className="zesto-menu-customize">
              <span className="zesto-menu-field-label">
                CHOOSE YOUR SIZE
              </span>

              <div className="zesto-menu-size-options">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={
                      selectedSize === size
                        ? "zesto-menu-size is-active"
                        : "zesto-menu-size"
                    }
                    aria-pressed={
                      selectedSize === size
                    }
                    onClick={() =>
                      setSelectedSize(size)
                    }
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* ===============================
                PRICE AND QUANTITY
            =============================== */}

            <div className="zesto-menu-order-details">

              <div className="zesto-menu-price">
                <small>PRICE PER PIZZA</small>

                <strong>
                  {formatLKR(unitPrice)}
                </strong>
              </div>

              <div className="zesto-menu-quantity">

                <button
                  type="button"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  onClick={() =>
                    setQuantity((value) =>
                      Math.max(1, value - 1)
                    )
                  }
                >
                  <Minus size={16} />
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  disabled={quantity >= 9}
                  aria-label="Increase quantity"
                  onClick={() =>
                    setQuantity((value) =>
                      Math.min(9, value + 1)
                    )
                  }
                >
                  <Plus size={16} />
                </button>

              </div>
            </div>

            {/* ===============================
                ADD TO ORDER
            =============================== */}

            <button
              type="button"
              className="zesto-menu-order-button"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={18} />

              Add to Order

              <span>
                {formatLKR(totalPrice)}
              </span>

              <ArrowRight size={18} />
            </button>

            <div className="zesto-menu-selected-footer">
              <span className="zesto-menu-sparkle">
                ✦
              </span>

              Freshly prepared. Made with love.
            </div>

          </div>
        </div>

        <p className="zesto-menu-disclaimer">
          Menu prices are sample values for the
          frontend preview.
        </p>

      </div>
    </section>
  );
}
