type ServiceSeed = {
  name: string;
  description: string;
  category: string;
  icon?: string | null;
  monthlyLimit: number;
};

type SubscriptionPlanSeed = {
  name: string;
  price: number;
  features: string[];
};

const serviceSeedBlueprint: ServiceSeed[] = [
  {
    name: "WhatsApp Automation",
    description: "Automated WhatsApp messaging and chatbots for customer engagement",
    category: "Communication",
    monthlyLimit: 1000,
  },
  {
    name: "Email Automation",
    description: "Smart email campaigns with AI-powered personalization",
    category: "Communication",
    monthlyLimit: 5000,
  },
  {
    name: "Data Analytics",
    description: "Real-time business intelligence and predictive analytics",
    category: "Analytics",
    monthlyLimit: 100,
  },
  {
    name: "Workflow Automation",
    description: "Custom workflow automation with n8n integration",
    category: "Workflow",
    monthlyLimit: 500,
  },
  {
    name: "AI Chatbot",
    description: "Intelligent chatbot for customer support and lead generation",
    category: "Communication",
    monthlyLimit: 2000,
  },
  {
    name: "Document Processing",
    description: "Automated document extraction and processing with AI",
    category: "Workflow",
    monthlyLimit: 200,
  },
];

const subscriptionPlanSeedBlueprint: SubscriptionPlanSeed[] = [
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

export function buildServiceSeedRows() {
  return serviceSeedBlueprint.map((service) => ({
    ...service,
    icon: service.icon ?? null,
    createdAt: new Date().toISOString(),
  }));
}

export function buildSubscriptionPlanSeedRows() {
  return subscriptionPlanSeedBlueprint.map((plan) => ({
    ...plan,
    features: JSON.stringify(plan.features),
    createdAt: new Date().toISOString(),
  }));
}
