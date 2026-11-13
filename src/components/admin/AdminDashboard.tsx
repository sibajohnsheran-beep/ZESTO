
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  Download,
  ExternalLink,
  Eye,
  Layers3,
  LayoutDashboard,
  Menu,
  Package,
  Pizza,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  SlidersHorizontal,
  Trophy,
  Users,
  Wallet,
  X,
} from "lucide-react";

import "./AdminDashboard.css";

// ==========================================
// TYPES
// ==========================================

type OrderStatus =
  | "Pending"
  | "Preparing"
  | "Ready"
  | "Delivered";

type Order = {
  id: string;
  customer: string;
  items: string;
  total: number;
  status: OrderStatus;
};

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
};

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Orders", icon: ClipboardList },
  { label: "Menu & Products", icon: Pizza },
  { label: "Categories", icon: Layers3 },
  { label: "Customers", icon: Users },
  { label: "Reports & Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
] as const;

type AdminPage = (typeof navigation)[number]["label"];

const statuses: OrderStatus[] = [
  "Pending",
  "Preparing",
  "Ready",
  "Delivered",
];

const statusColors: Record<OrderStatus, string> = {
  Pending: "#ef6d43",
  Preparing: "#f3aa35",
  Ready: "#9661dc",
  Delivered: "#30c87e",
};

// ==========================================
// DEMO DATA
// Backend integration will replace this.
// ==========================================

const initialOrders: Order[] = [
  {
    id: "ZST-1006",
    customer: "Demo Customer A",
    items: "Pepperoni Feast × 1",
    total: 2950,
    status: "Pending",
  },
  {
    id: "ZST-1005",
    customer: "Demo Customer B",
    items: "Classic Margherita × 2",
    total: 3300,
    status: "Preparing",
  },
  {
    id: "ZST-1004",
    customer: "Demo Customer C",
    items: "Smoky BBQ Chicken × 1",
    total: 2450,
    status: "Ready",
  },
  {
    id: "ZST-1003",
    customer: "Demo Customer D",
    items: "Four Cheese Melt × 1",
    total: 2350,
    status: "Delivered",
  },
  {
    id: "ZST-1002",
    customer: "Demo Customer E",
    items: "Garden Supreme × 1",
    total: 1950,
    status: "Delivered",
  },
  {
    id: "ZST-1001",
    customer: "Demo Customer F",
    items: "Spicy Volcano × 1",
    total: 2550,
    status: "Pending",
  },
];

const initialProducts: Product[] = [
  {
    id: "pepperoni",
    name: "Pepperoni Feast",
    category: "Signature",
    price: 2250,
    image: "/images/pizzas/pepperoni.png",
  },
  {
    id: "margherita",
    name: "Classic Margherita",
    category: "Classic",
    price: 1650,
    image: "/images/pizzas/margherita.png",
  },
  {
    id: "bbq-chicken",
    name: "Smoky BBQ Chicken",
    category: "Signature",
    price: 2450,
    image: "/images/pizzas/bbq-chicken.png",
  },
  {
    id: "garden",
    name: "Garden Supreme",
    category: "Vegetarian",
    price: 1950,
    image: "/images/pizzas/garden-supreme.png",
  },
  {
    id: "four-cheese",
    name: "Four Cheese Melt",
    category: "Vegetarian",
    price: 2350,
    image: "/images/pizzas/four-cheese.png",
  },
  {
    id: "spicy-volcano",
    name: "Spicy Volcano",
    category: "Signature",
    price: 2550,
    image: "/images/pizzas/spicy-volcano.png",
  },
];

// Aggregated sample figures for the UI mockup.
// Not actual restaurant business records.
const demoAnalytics = {
  "7": {
    orders: 142,
    revenue: 86450,
    customers: 98,
    pending: 6,
    preparing: 18,
    ready: 24,
    delivered: 94,
    revenueSeries: [
      4200, 7800, 7200, 6400, 11200, 17800, 12500,
    ],
    orderSeries: [12, 19, 17, 15, 23, 32, 24],
  },
  "30": {
    orders: 542,
    revenue: 326400,
    customers: 311,
    pending: 18,
    preparing: 63,
    ready: 77,
    delivered: 384,
    revenueSeries: [
      28000, 35000, 31000, 41000,
      49000, 57000, 44000,
    ],
    orderSeries: [52, 66, 61, 74, 88, 108, 93],
  },
};

type DateRange = keyof typeof demoAnalytics;
type ChartMetric = "Revenue" | "Orders";

function formatLKR(value: number) {
  return `Rs. ${value.toLocaleString("en-LK")}`;
}

// ==========================================
// ORDER TABLE
// ==========================================

type OrderTableProps = {
  orders: Order[];
  onView: (order: Order) => void;
  onStatusChange?: (
    id: string,
    status: OrderStatus
  ) => void;
};

function OrderTable({
  orders,
  onView,
  onStatusChange,
}: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="za-empty">
        No matching demo orders found.
      </div>
    );
  }

  return (
    <div className="za-table-scroll">
      <table className="za-orders-table">
        <thead>
          <tr>
            <th>ORDER ID</th>
            <th>CUSTOMER</th>
            <th>ITEMS</th>
            <th>TOTAL</th>
            <th>STATUS</th>
            <th>ACTION</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="za-order-id">
                {order.id}
              </td>

              <td>{order.customer}</td>

              <td className="za-order-item">
                {order.items}
              </td>

              <td className="za-order-price">
                {formatLKR(order.total)}
              </td>

              <td>
                {onStatusChange ? (
                  <select
                    aria-label={`Status of ${order.id}`}
                    className={`za-status-select ${order.status.toLowerCase()}`}
                    value={order.status}
                    onChange={(event) =>
                      onStatusChange(
                        order.id,
                        event.target.value as OrderStatus
                      )
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span
                    className={`za-status ${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                )}
              </td>

              <td>
                <button
                  type="button"
                  className="za-view-btn"
                  aria-label={`View ${order.id}`}
                  onClick={() => onView(order)}
                >
                  <Eye size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ==========================================
// SALES CHART (SVG - NO EXTRA PACKAGE)
// ==========================================

function SalesChart({
  values,
  metric,
}: {
  values: number[];
  metric: ChartMetric;
}) {
  const days = [
    "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun",
  ];

  const maxValue = Math.max(
    1,
    Math.ceil(Math.max(...values) / 5) * 5
  );

  const points = values.map((value, index) => ({
    x: 64 + index * 88,
    y: 216 - (value / maxValue) * 160,
    value,
  }));

  const linePath = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const first = points[0];
  const last = points[points.length - 1];

  const areaPath =
    `${linePath} L ${last.x} 216 L ${first.x} 216 Z`;

  return (
    <div className="za-sales-chart">
      <svg
        viewBox="0 0 660 270"
        role="img"
        aria-label={`Demo ${metric.toLowerCase()} graph`}
      >
        <defs>
          <linearGradient
            id="zestoSalesFill"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#ed4b2f"
              stopOpacity="0.54"
            />
            <stop
              offset="100%"
              stopColor="#ed4b2f"
              stopOpacity="0.015"
            />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3, 4].map((level) => {
          const y = 216 - level * 40;
          const tick = (maxValue / 4) * level;

          return (
            <g key={level}>
              <line
                x1="64"
                x2="592"
                y1={y}
                y2={y}
                stroke="rgba(255,205,166,0.12)"
                strokeWidth="1"
              />

              <text
                x="53"
                y={y + 4}
                textAnchor="end"
                className="za-chart-axis"
              >
                {metric === "Revenue"
                  ? `${Math.round(tick / 1000)}K`
                  : Math.round(tick)}
              </text>
            </g>
          );
        })}

        <path
          d={areaPath}
          fill="url(#zestoSalesFill)"
        />

        <path
          d={linePath}
          fill="none"
          stroke="#ff6843"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point, index) => (
          <g key={days[index]}>
            <circle
              cx={point.x}
              cy={point.y}
              r="5"
              fill="#ff593a"
              stroke="#ffcfac"
              strokeWidth="2"
            />

            <text
              x={point.x}
              y="251"
              textAnchor="middle"
              className="za-chart-axis"
            >
              {days[index]}
            </text>

            <title>
              {`${days[index]}: ${
                metric === "Revenue"
                  ? formatLKR(point.value)
                  : `${point.value} orders`
              }`}
            </title>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ==========================================
// ADMIN DASHBOARD
// ==========================================

export default function AdminDashboard() {
  const [page, setPage] =
    useState<AdminPage>("Dashboard");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [dateRange, setDateRange] =
    useState<DateRange>("7");

  const [chartMetric, setChartMetric] =
    useState<ChartMetric>("Revenue");

  const [orders, setOrders] =
    useState<Order[]>(initialOrders);

  const [products, setProducts] =
    useState<Product[]>(initialProducts);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [showAddProduct, setShowAddProduct] =
    useState(false);

  const [newProductName, setNewProductName] =
    useState("");

  const [newProductCategory, setNewProductCategory] =
    useState("Signature");

  const [newProductPrice, setNewProductPrice] =
    useState("");

  const [notice, setNotice] = useState("");
  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const analytics = demoAnalytics[dateRange];

  const statusData = statuses.map((status) => ({
    label: status,
    value:
      status === "Pending"
        ? analytics.pending
        : status === "Preparing"
          ? analytics.preparing
          : status === "Ready"
            ? analytics.ready
            : analytics.delivered,
    color: statusColors[status],
  }));

  let cumulative = 0;

  const donutSegments = statusData.map((item) => {
    const start = cumulative;
    cumulative += (item.value / analytics.orders) * 100;

    return `${item.color} ${start}% ${cumulative}%`;
  });

  const donutBackground =
    `conic-gradient(${donutSegments.join(", ")})`;

  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase().trim();

    const matchesText =
      order.id.toLowerCase().includes(query) ||
      order.customer.toLowerCase().includes(query) ||
      order.items.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" ||
      order.status === statusFilter;

    return matchesText && matchesStatus;
  });

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(
        search.toLowerCase().trim()
      ) ||
      product.category.toLowerCase().includes(
        search.toLowerCase().trim()
      )
  );

  const bestSellers = [
    {
      name: "Pepperoni Feast",
      image: "/images/pizzas/pepperoni.png",
      orders: dateRange === "7" ? 48 : 173,
      price: 2250,
    },
    {
      name: "Smoky BBQ Chicken",
      image: "/images/pizzas/bbq-chicken.png",
      orders: dateRange === "7" ? 32 : 124,
      price: 2450,
    },
    {
      name: "Classic Margherita",
      image: "/images/pizzas/margherita.png",
      orders: dateRange === "7" ? 28 : 98,
      price: 1650,
    },
  ];

  const stats = [
    {
      label: "Total Orders",
      value: analytics.orders.toLocaleString("en-LK"),
      change: "+12%",
      icon: ShoppingCart,
    },
    {
      label: "Total Revenue",
      value: formatLKR(analytics.revenue),
      change: "+18%",
      icon: Wallet,
    },
    {
      label: "Total Customers",
      value: analytics.customers.toLocaleString("en-LK"),
      change: "+9%",
      icon: Users,
    },
    {
      label: "Menu Items",
      value: String(products.length),
      change: "Demo products",
      icon: Pizza,
    },
  ];

  // ========================================
  // ACTIONS
  // ========================================

  const navigate = (destination: AdminPage) => {
    setPage(destination);
    setSearch("");
    setStatusFilter("All");
    setSidebarOpen(false);
    setNotificationsOpen(false);
  };

  const updateOrderStatus = (
    orderId: string,
    nextStatus: OrderStatus
  ) => {
    setOrders((previous) =>
      previous.map((order) =>
        order.id === orderId
          ? { ...order, status: nextStatus }
          : order
      )
    );

    setSelectedOrder((previous) =>
      previous?.id === orderId
        ? { ...previous, status: nextStatus }
        : previous
    );

    setNotice(
      `${orderId} updated to ${nextStatus} (demo only).`
    );
  };

  const addProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = newProductName.trim();
    const price = Number(newProductPrice);

    if (!name || !Number.isFinite(price) || price <= 0) {
      setNotice("Enter a valid pizza name and price.");
      return;
    }

    setProducts((previous) => [
      ...previous,
      {
        id: `demo-${Date.now()}`,
        name,
        category: newProductCategory,
        price,
        image: "",
      },
    ]);

    setShowAddProduct(false);
    setNewProductName("");
    setNewProductPrice("");
    setNotice(
      `${name} added to the admin demo. Customer menu is unchanged.`
    );
    navigate("Menu & Products");
  };

  const downloadDemoReport = () => {
    const rows = [
      ["Order ID", "Customer", "Items", "Total LKR", "Status"],
      ...orders.map((order) => [
        order.id,
        order.customer,
        order.items,
        String(order.total),
        order.status,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((field) =>
            `"${field.replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "ZESTO_Demo_Orders.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setNotice("Demo order report exported.");
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="za-dashboard">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <button
          type="button"
          className="za-sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ====================================
          SIDEBAR
      ==================================== */}

      <aside
        className={`za-sidebar ${
          sidebarOpen ? "is-open" : ""
        }`}
      >
        <div className="za-brand">
          <img
            src="/images/zesto-logo.png"
            alt="ZESTO"
          />

          <div className="za-brand-text">
            <strong>ZESTO</strong>
            <span>— PIZZA —</span>
          </div>

          <button
            type="button"
            className="za-close-sidebar"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={21} />
          </button>
        </div>

        <div className="za-admin-label">
          ADMIN PANEL
        </div>

        <nav
          className="za-navigation"
          aria-label="Admin sections"
        >
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                type="button"
                key={item.label}
                className={`za-nav-item ${
                  page === item.label ? "active" : ""
                }`}
                onClick={() => navigate(item.label)}
              >
                <Icon size={20} strokeWidth={1.8} />

                <span>{item.label}</span>

                {item.label === "Orders" && (
                  <b>{analytics.pending}</b>
                )}
              </button>
            );
          })}
        </nav>

        <div className="za-sidebar-bottom">
          <div className="za-sidebar-promo">
            <strong>ZESTO Management</strong>

            <p>
              Manage orders, products and grow
              your pizza business.
            </p>

            <img
              src="/images/pizzas/pepperoni.png"
              alt=""
              aria-hidden="true"
            />
          </div>

          <a
            href="/"
            className="za-visit-site"
          >
            <ExternalLink size={16} />
            View Customer Website
          </a>

          <div className="za-developer">
            <span className="za-code-icon">
              {"</>"}
            </span>

            <span>
              Developed by
              <strong>NeirahTech</strong>
            </span>
          </div>
        </div>
      </aside>

      {/* ====================================
          MAIN AREA
      ==================================== */}

      <div className="za-main">

        {/* TOPBAR */}

        <header className="za-topbar">
          <div className="za-topbar-left">
            <button
              type="button"
              className="za-sidebar-toggle"
              aria-label="Open sidebar"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={23} />
            </button>

            <span className="za-topbar-divider" />

            <strong>
              ZESTO Admin Dashboard
            </strong>
          </div>

          <div className="za-topbar-right">
            <span className="za-demo-indicator">
              DEMO
            </span>

            <div className="za-notification-wrap">
              <button
                type="button"
                className="za-icon-button"
                aria-label="Demo notifications"
                aria-expanded={notificationsOpen}
                onClick={() =>
                  setNotificationsOpen((previous) => !previous)
                }
              >
                <Bell size={21} />
                <span className="za-notification-dot" />
              </button>

              {notificationsOpen && (
                <div className="za-notification-menu">
                  <strong>Demo Notifications</strong>
                  <p>
                    Sample orders are available in
                    the Orders tab.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("Orders")}
                  >
                    View Orders
                    <ArrowRight size={15} />
                  </button>
                </div>
              )}
            </div>

            <span className="za-topbar-divider" />

            <div className="za-avatar">AD</div>

            <div className="za-admin-profile">
              <strong>Admin</strong>
              <small>Restaurant Manager</small>
            </div>
          </div>
        </header>

        {/* ====================================
            DASHBOARD CONTENT
        ==================================== */}

        <main className="za-content">

          {/* HEADER */}

          <div className="za-page-heading">
            <div>
              <span className="za-eyebrow">
                WELCOME BACK, ADMIN
              </span>

              <h1>
                {page === "Dashboard" ? (
                  <>
                    Dashboard <em>Overview</em>
                  </>
                ) : (
                  page
                )}
              </h1>

              <p>
                {page === "Dashboard"
                  ? "Here's a preview of ZESTO's restaurant management experience."
                  : "ZESTO admin workspace — frontend demo mode."}
              </p>
            </div>

            {page === "Dashboard" && (
              <label className="za-date-filter">
                <CalendarDays size={18} />

                <select
                  aria-label="Analytics date range"
                  value={dateRange}
                  onChange={(event) =>
                    setDateRange(
                      event.target.value as DateRange
                    )
                  }
                >
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                </select>

                <ChevronDown size={16} />
              </label>
            )}
          </div>

          {/* DEMO DISCLAIMER */}

          <div className="za-demo-notice">
            <span />
            Sample statistics and orders for the
            dashboard preview. No live customer
            data is connected.
          </div>

          {/* ====================================
              DASHBOARD OVERVIEW
          ==================================== */}

          {page === "Dashboard" && (
            <>
              {/* KPI CARDS */}

              <div className="za-stats-grid">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;

                  return (
                    <article
                      className="za-stat-card"
                      key={stat.label}
                    >
                      <div className="za-stat-icon">
                        <Icon size={28} strokeWidth={1.7} />
                      </div>

                      <div className="za-stat-info">
                        <span>{stat.label}</span>

                        <strong>{stat.value}</strong>

                        <small
                          className={
                            index < 3
                              ? "za-trend-positive"
                              : "za-trend-neutral"
                          }
                        >
                          {index < 3 && (
                            <ArrowUpRight size={14} />
                          )}

                          {stat.change}

                          {index < 3 && (
                            <span>sample trend</span>
                          )}
                        </small>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* MIDDLE CONTENT */}

              <div className="za-analytics-grid">

                {/* SALES GRAPH */}

                <section className="za-panel za-sales-panel">
                  <div className="za-panel-header">
                    <h2>
                      <BarChart3 size={21} />
                      Sales Performance
                    </h2>

                    <div className="za-chart-tabs">
                      {(["Orders", "Revenue"] as const).map(
                        (metric) => (
                          <button
                            key={metric}
                            type="button"
                            className={
                              chartMetric === metric
                                ? "active"
                                : ""
                            }
                            onClick={() =>
                              setChartMetric(metric)
                            }
                          >
                            {metric}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <SalesChart
                    metric={chartMetric}
                    values={
                      chartMetric === "Revenue"
                        ? analytics.revenueSeries
                        : analytics.orderSeries
                    }
                  />
                </section>

                {/* ORDER STATUS */}

                <section className="za-panel za-status-panel">
                  <div className="za-panel-header">
                    <h2>
                      <Package size={21} />
                      Order Status
                    </h2>
                  </div>

                  <div className="za-status-content">
                    <div
                      className="za-donut"
                      style={{
                        background: donutBackground,
                      }}
                      role="img"
                      aria-label="Demo order status distribution"
                    >
                      <div className="za-donut-center">
                        <strong>{analytics.orders}</strong>
                        <span>Orders</span>
                      </div>
                    </div>

                    <div className="za-status-legend">
                      {statusData.map((item) => (
                        <div
                          className="za-legend-row"
                          key={item.label}
                        >
                          <span
                            className="za-legend-dot"
                            style={{
                              backgroundColor: item.color,
                            }}
                          />

                          <span>{item.label}</span>

                          <strong>{item.value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* QUICK ACTIONS */}

                <section className="za-panel za-actions-panel">
                  <div className="za-panel-header">
                    <h2>
                      <SlidersHorizontal size={21} />
                      Quick Actions
                    </h2>
                  </div>

                  <div className="za-quick-actions">
                    <button
                      type="button"
                      className="za-action-primary"
                      onClick={() =>
                        setShowAddProduct(true)
                      }
                    >
                      <Plus size={19} />
                      Add New Pizza
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("Orders")}
                    >
                      <ClipboardList size={18} />
                      View All Orders
                    </button>

                    <button
                      type="button"
                      onClick={downloadDemoReport}
                    >
                      <Download size={18} />
                      Generate Report
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        navigate("Categories")
                      }
                    >
                      <Layers3 size={18} />
                      Manage Categories
                    </button>
                  </div>
                </section>
              </div>

              {/* BOTTOM CONTENT */}

              <div className="za-bottom-grid">

                {/* RECENT ORDERS */}

                <section className="za-panel za-recent-orders">
                  <div className="za-panel-header">
                    <h2>
                      <Clock3 size={21} />
                      Recent Orders
                    </h2>

                    <button
                      type="button"
                      className="za-panel-link"
                      onClick={() => navigate("Orders")}
                    >
                      View All Orders
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  <OrderTable
                    orders={orders.slice(0, 4)}
                    onView={setSelectedOrder}
                  />
                </section>

                {/* BEST SELLERS */}

                <section className="za-panel za-best-sellers">
                  <div className="za-panel-header">
                    <h2>
                      <Trophy size={21} />
                      Best Selling Pizzas
                    </h2>

                    <button
                      type="button"
                      className="za-panel-link"
                      onClick={() =>
                        navigate("Menu & Products")
                      }
                    >
                      View Menu
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  <div className="za-best-list">
                    {bestSellers.map((pizza, index) => (
                      <div
                        className="za-best-item"
                        key={pizza.name}
                      >
                        <span className="za-best-rank">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <img
                          src={pizza.image}
                          alt={pizza.name}
                          loading="lazy"
                        />

                        <div>
                          <strong>{pizza.name}</strong>
                          <small>
                            {pizza.orders} demo orders
                          </small>
                        </div>

                        <b>{formatLKR(pizza.price)}</b>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}

          {/* ====================================
              ORDERS PAGE
          ==================================== */}

          {page === "Orders" && (
            <section className="za-panel za-page-panel">
              <div className="za-panel-header">
                <h2>
                  <ClipboardList size={21} />
                  Order Management
                </h2>

                <span className="za-small-label">
                  {filteredOrders.length} DEMO ORDERS
                </span>
              </div>

              <div className="za-toolbar">
                <label className="za-search-box">
                  <Search size={18} />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search demo orders..."
                  />
                </label>

                <select
                  className="za-filter-select"
                  aria-label="Filter by status"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                >
                  <option value="All">All Statuses</option>

                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <OrderTable
                orders={filteredOrders}
                onView={setSelectedOrder}
                onStatusChange={updateOrderStatus}
              />

              <p className="za-helper-text">
                Order status edits are temporary demo
                changes and reset after refresh.
              </p>
            </section>
          )}

          {/* ====================================
              PRODUCTS PAGE
          ==================================== */}

          {page === "Menu & Products" && (
            <section className="za-panel za-page-panel">
              <div className="za-panel-header">
                <h2>
                  <Pizza size={21} />
                  Pizza Products
                </h2>

                <button
                  type="button"
                  className="za-small-add"
                  onClick={() =>
                    setShowAddProduct(true)
                  }
                >
                  <Plus size={17} />
                  Add Pizza
                </button>
              </div>

              <div className="za-toolbar">
                <label className="za-search-box">
                  <Search size={18} />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search pizzas..."
                  />
                </label>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="za-products-grid">
                  {filteredProducts.map((product) => (
                    <article
                      className="za-product-card"
                      key={product.id}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                        />
                      ) : (
                        <div className="za-product-placeholder">
                          <Pizza size={55} />
                        </div>
                      )}

                      <div className="za-product-body">
                        <small>{product.category}</small>
                        <h3>{product.name}</h3>

                        <strong>
                          {formatLKR(product.price)}
                        </strong>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="za-empty">
                  No matching pizzas.
                </div>
              )}

              <p className="za-helper-text">
                Changes here affect the admin demo
                only, not the customer pizza menu.
              </p>
            </section>
          )}

          {/* ====================================
              CATEGORIES PAGE
          ==================================== */}

          {page === "Categories" && (
            <section className="za-panel za-page-panel">
              <div className="za-panel-header">
                <h2>
                  <Layers3 size={21} />
                  Pizza Categories
                </h2>
              </div>

              <div className="za-category-grid">
                {["Signature", "Classic", "Vegetarian"].map(
                  (category) => (
                    <div
                      className="za-category-card"
                      key={category}
                    >
                      <Pizza size={28} />

                      <strong>{category}</strong>

                      <span>
                        {
                          products.filter(
                            (product) =>
                              product.category === category
                          ).length
                        }{" "}
                        demo products
                      </span>
                    </div>
                  )
                )}
              </div>

              <p className="za-helper-text">
                Category editing and synchronization
                will be added with the backend.
              </p>
            </section>
          )}

          {/* ====================================
              FUTURE MANAGEMENT PAGES
          ==================================== */}

          {(page === "Customers" ||
            page === "Reports & Analytics" ||
            page === "Settings") && (
            <section className="za-panel za-coming-panel">
              <div className="za-coming-icon">
                {page === "Customers" ? (
                  <Users size={36} />
                ) : page === "Reports & Analytics" ? (
                  <BarChart3 size={36} />
                ) : (
                  <Settings size={36} />
                )}
              </div>

              <h2>{page}</h2>

              <p>
                This management module is planned for
                the next development phase. It will
                connect to real data after admin
                authentication and backend setup.
              </p>

              <button
                type="button"
                className="za-back-dashboard"
                onClick={() => navigate("Dashboard")}
              >
                Back to Dashboard
                <ArrowRight size={17} />
              </button>
            </section>
          )}

          {/* FOOTER */}

          <footer className="za-content-footer">
            <span>
              ZESTO Admin Dashboard · Demo Preview
            </span>

            <span>
              Developed by <strong>NeirahTech</strong>
            </span>
          </footer>

        </main>
      </div>

      {/* ====================================
          ORDER DETAILS MODAL
      ==================================== */}

      {selectedOrder && (
        <div
          className="za-modal-backdrop"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="za-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="za-order-modal-title"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="za-modal-close"
              aria-label="Close order"
              onClick={() => setSelectedOrder(null)}
            >
              <X size={19} />
            </button>

            <span className="za-eyebrow">
              DEMO ORDER DETAILS
            </span>

            <h2 id="za-order-modal-title">
              {selectedOrder.id}
            </h2>

            <div className="za-detail-row">
              <span>Customer</span>
              <strong>{selectedOrder.customer}</strong>
            </div>

            <div className="za-detail-row">
              <span>Items</span>
              <strong>{selectedOrder.items}</strong>
            </div>

            <div className="za-detail-row">
              <span>Total</span>
              <strong>
                {formatLKR(selectedOrder.total)}
              </strong>
            </div>

            <div className="za-detail-row">
              <span>Status</span>
              <span
                className={`za-status ${selectedOrder.status.toLowerCase()}`}
              >
                {selectedOrder.status}
              </span>
            </div>

            <button
              type="button"
              className="za-modal-submit"
              onClick={() => {
                setSelectedOrder(null);
                navigate("Orders");
              }}
            >
              Manage Orders
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      )}

      {/* ====================================
          ADD PRODUCT MODAL
      ==================================== */}

      {showAddProduct && (
        <div
          className="za-modal-backdrop"
          onClick={() => setShowAddProduct(false)}
        >
          <div
            className="za-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="za-product-modal-title"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="za-modal-close"
              aria-label="Close add product"
              onClick={() =>
                setShowAddProduct(false)
              }
            >
              <X size={19} />
            </button>

            <span className="za-eyebrow">
              ADMIN DEMO
            </span>

            <h2 id="za-product-modal-title">
              Add New Pizza
            </h2>

            <p className="za-modal-description">
              This adds a temporary product to the
              admin dashboard preview only.
            </p>

            <form
              className="za-product-form"
              onSubmit={addProduct}
            >
              <label>
                Pizza Name

                <input
                  value={newProductName}
                  onChange={(event) =>
                    setNewProductName(event.target.value)
                  }
                  placeholder="Pizza name"
                  required
                />
              </label>

              <label>
                Category

                <select
                  value={newProductCategory}
                  onChange={(event) =>
                    setNewProductCategory(
                      event.target.value
                    )
                  }
                >
                  <option>Signature</option>
                  <option>Classic</option>
                  <option>Vegetarian</option>
                </select>
              </label>

              <label>
                Base Price (LKR)

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={newProductPrice}
                  onChange={(event) =>
                    setNewProductPrice(event.target.value)
                  }
                  placeholder="2250"
                  required
                />
              </label>

              <button
                type="submit"
                className="za-modal-submit"
              >
                <Plus size={17} />
                Add Demo Pizza
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DEMO FEEDBACK */}

      {notice && (
        <div className="za-toast" role="status">
          <CheckCircle2 size={19} />

          <span>{notice}</span>

          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            <X size={16} />
          </button>
        </div>
      )}

    </div>
  );
}
