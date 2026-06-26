import "server-only";

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const PLAN_PRCE_ID = {
  free: "price_1TmCNDHE1aRpzyeZaoyQhKwn",
  pro: "price_1TkOC7HE1aRpzyeZIZMMN1YG",
  premium: "price_1TmCPmHE1aRpzyeZ6nhMrHFZ",
};
