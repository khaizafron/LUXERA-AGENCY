const path = require("node:path");
const Database = require("better-sqlite3");

const dbPath =
  process.env.DATABASE_URL?.replace(/^file:/i, "") ||
  path.resolve(process.cwd(), "luxera.db");

const services = [
  {
    name: "WhatsApp Automation",
    description:
      "Automated WhatsApp messaging and chatbots for customer engagement",
    category: "Communication",
    monthly_limit: 1000,
  },
  {
    name: "Email Automation",
    description: "Smart email campaigns with AI-powered personalization",
    category: "Communication",
    monthly_limit: 5000,
  },
  {
    name: "Data Analytics",
    description: "Real-time business intelligence and predictive analytics",
    category: "Analytics",
    monthly_limit: 100,
  },
  {
    name: "Workflow Automation",
    description: "Custom workflow automation with n8n integration",
    category: "Workflow",
    monthly_limit: 500,
  },
  {
    name: "AI Chatbot",
    description:
      "Intelligent chatbot for customer support and lead generation",
    category: "Communication",
    monthly_limit: 2000,
  },
  {
    name: "Document Processing",
    description: "Automated document extraction and processing with AI",
    category: "Workflow",
    monthly_limit: 200,
  },
];

const plans = [
  {
    name: "Free",
    price: 0,
    features: ["5 Automations/month", "Basic Support", "1 User"],
  },
  {
    name: "Starter",
    price: 29,
    features: [
      "50 Automations/month",
      "Email Support",
      "3 Users",
      "Analytics Dashboard",
    ],
  },
  {
    name: "Pro",
    price: 99,
    features: [
      "500 Automations/month",
      "Priority Support",
      "10 Users",
      "Advanced Analytics",
      "Custom Integrations",
    ],
  },
  {
    name: "Enterprise",
    price: 299,
    features: [
      "Unlimited Automations",
      "24/7 Support",
      "Unlimited Users",
      "White Label",
      "Dedicated Account Manager",
    ],
  },
];

function seed() {
  const db = new Database(dbPath);
  const now = new Date().toISOString();

  const serviceCount =
    db.prepare("SELECT COUNT(*) as count FROM services").get()?.count ?? 0;
  if (serviceCount === 0) {
    const insertService = db.prepare(
      `INSERT INTO services
       (name, description, category, icon, monthly_limit, created_at)
       VALUES (@name, @description, @category, NULL, @monthly_limit, @created_at)`
    );

    const serviceRows = services.map((svc) => ({
      ...svc,
      created_at: now,
    }));

    const insertMany = db.transaction((rows) => {
      for (const row of rows) {
        insertService.run(row);
      }
    });
    insertMany(serviceRows);
    console.log(`Seeded ${serviceRows.length} services.`);
  } else {
    console.log("Services table already has data, skipping.");
  }

  const planCount =
    db
      .prepare("SELECT COUNT(*) as count FROM subscription_plans")
      .get()?.count ?? 0;
  if (planCount === 0) {
    const insertPlan = db.prepare(
      `INSERT INTO subscription_plans
       (name, price, features, created_at)
       VALUES (@name, @price, @features, @created_at)`
    );

    const planRows = plans.map((plan) => ({
      ...plan,
      features: JSON.stringify(plan.features),
      created_at: now,
    }));

    const insertPlanMany = db.transaction((rows) => {
      for (const row of rows) {
        insertPlan.run(row);
      }
    });
    insertPlanMany(planRows);
    console.log(`Seeded ${planRows.length} subscription plans.`);
  } else {
    console.log("Subscription plans table already has data, skipping.");
  }
}

seed();
