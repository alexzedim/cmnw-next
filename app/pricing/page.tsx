"use client";

import { Card, CardBody, CardHeader, Button, Chip } from "@heroui/react";
import { title, subtitle } from "@/components/primitives";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "Character search",
      "Guild lookup",
      "Basic commodity tracking",
      "Realm gold prices",
      "Community support",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "Coming Soon",
    period: "",
    features: [
      "All Free features",
      "Advanced analytics",
      "Price history",
      "Export data",
      "Priority support",
      "API access",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Contact Us",
    period: "",
    features: [
      "All Pro features",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
      "Custom data retention",
      "White-label options",
    ],
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col gap-8 py-8 md:py-10">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className={title()}>Pricing</h1>
        <p className={subtitle({ class: "mt-4" })}>
          Choose the plan that fits your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${
              plan.popular
                ? "border-2 border-primary shadow-lg scale-105"
                : ""
            }`}
          >
            {plan.popular && (
              <Chip
                color="primary"
                className="absolute -top-3 left-1/2 -translate-x-1/2"
                size="sm"
              >
                Most Popular
              </Chip>
            )}
            <CardHeader className="flex flex-col items-start gap-2 pt-8">
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-default-500">/{plan.period}</span>
                )}
              </div>
            </CardHeader>
            <CardBody className="gap-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-default-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                color={plan.popular ? "primary" : "default"}
                variant={plan.popular ? "solid" : "bordered"}
                className="w-full mt-4"
                isDisabled={plan.name === "Pro"}
              >
                {plan.name === "Free"
                  ? "Get Started"
                  : plan.name === "Pro"
                    ? "Coming Soon"
                    : "Contact Sales"}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="max-w-4xl mx-auto text-center mt-8">
        <p className="text-default-600">
          All plans include access to our core features. Upgrade anytime as your
          needs grow.
        </p>
      </div>
    </div>
  );
}
