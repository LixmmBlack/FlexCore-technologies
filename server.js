const express = require("express");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

const plans = [
  {
    id: "plan-basic",
    name: "Basic",
    price: 1500,
    speed: "10 Mbps",
    dataLimit: "Unlimited",
    durationDays: 30,
    description: "Entry-level home plan for browsing and social media."
  },
  {
    id: "plan-plus",
    name: "Plus",
    price: 2500,
    speed: "25 Mbps",
    dataLimit: "Unlimited",
    durationDays: 30,
    description: "Balanced plan for streaming, work calls, and online classes."
  },
  {
    id: "plan-premium",
    name: "Premium",
    price: 4500,
    speed: "50 Mbps",
    dataLimit: "Unlimited",
    durationDays: 30,
    description: "High-speed plan for households and small businesses."
  }
];

const customers = [
  {
    id: "C-1001",
    name: "Amina Yusuf",
    phone: "+254712345678",
    deviceId: "WIFI-001",
    planId: "plan-basic",
    status: "active",
    startedAt: "2026-10-01T08:00:00.000Z",
    expiresAt: "2026-10-31T08:00:00.000Z",
    balance: 0,
    package: "Basic"
  },
  {
    id: "C-1002",
    name: "Brian Kariuki",
    phone: "+254710987654",
    deviceId: "WIFI-002",
    planId: "plan-plus",
    status: "active",
    startedAt: "2026-09-20T08:00:00.000Z",
    expiresAt: "2026-10-20T08:00:00.000Z",
    balance: 500,
    package: "Plus"
  },
  {
    id: "C-1003",
    name: "Mary Njeri",
    phone: "+254711223344",
    deviceId: "WIFI-003",
    planId: "plan-premium",
    status: "pending",
    startedAt: "2026-10-07T08:00:00.000Z",
    expiresAt: "2026-11-06T08:00:00.000Z",
    balance: 4500,
    package: "Premium"
  }
];

const transactions = [
  { id: "TX-101", customerId: "C-1001", customerName: "Amina Yusuf", amount: 1500, type: "subscription", method: "M-Pesa", status: "paid", createdAt: "2026-10-01T08:15:00.000Z" },
  { id: "TX-102", customerId: "C-1002", customerName: "Brian Kariuki", amount: 2500, type: "subscription", method: "Cash", status: "paid", createdAt: "2026-09-20T08:15:00.000Z" },
  { id: "TX-103", customerId: "C-1003", customerName: "Mary Njeri", amount: 4500, type: "subscription", method: "M-Pesa", status: "pending", createdAt: "2026-10-07T08:20:00.000Z" }
];

function buildDashboard() {
  const totalRevenue = customers.reduce((sum, customer) => {
    const plan = plans.find(item => item.id === customer.planId);
    return sum + (plan ? plan.price : 0);
  }, 0);

  const activeCustomers = customers.filter(customer => customer.status === "active").length;
  const pendingPayments = customers.filter(customer => customer.balance > 0).length;
  const avgPlanPrice = plans.reduce((sum, plan) => sum + plan.price, 0) / plans.length;

  return {
    summary: {
      totalRevenue,
      activeCustomers,
      pendingPayments,
      avgPlanPrice
    },
    plans,
    customers,
    transactions: transactions.slice(0, 6)
  };
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "FlexCore Technologies",
    module: "wifi-billing"
  });
});

app.get("/api/dashboard", (req, res) => {
  res.json(buildDashboard());
});

app.get("/api/plans", (req, res) => {
  res.json(plans);
});

app.get("/api/customers", (req, res) => {
  res.json(customers);
});

app.post("/api/customers", (req, res) => {
  const { name, phone, deviceId, planId } = req.body;

  if (!name || !phone || !deviceId || !planId) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const plan = plans.find(item => item.id === planId);
  if (!plan) {
    return res.status(400).json({ error: "Unknown plan selected." });
  }

  const id = `C-${String(customers.length + 1001).padStart(4, "0")}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000).toISOString();

  const customer = {
    id,
    name,
    phone,
    deviceId,
    planId,
    status: "active",
    startedAt: now.toISOString(),
    expiresAt,
    balance: 0,
    package: plan.name
  };

  customers.unshift(customer);

  transactions.unshift({
    id: `TX-${Date.now()}`,
    customerId: id,
    customerName: name,
    amount: plan.price,
    type: "subscription",
    method: "M-Pesa",
    status: "paid",
    createdAt: now.toISOString()
  });

  return res.status(201).json(customer);
});

app.post("/api/payments", (req, res) => {
  const { customerId, amount, method } = req.body;

  if (!customerId || !amount || !method) {
    return res.status(400).json({ error: "Customer, amount and payment method are required." });
  }

  const customer = customers.find(item => item.id === customerId);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found." });
  }

  const payment = {
    id: `TX-${Date.now()}`,
    customerId,
    customerName: customer.name,
    amount: Number(amount),
    type: "payment",
    method,
    status: "paid",
    createdAt: new Date().toISOString()
  };

  transactions.unshift(payment);
  customer.balance = Math.max(0, customer.balance - Number(amount));

  res.status(201).json(payment);
});

app.listen(PORT, HOST, () => {
  console.log(`FlexCore Technologies running on ${HOST}:${PORT}`);
});
