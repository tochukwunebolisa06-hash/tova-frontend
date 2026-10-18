// In production builds, fall back to the Railway backend if VITE_API_URL
// wasn't available at build time. Locally, it falls back to Django on :8000.
const BASE_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://web-production-27082.up.railway.app/api"
    : "http://localhost:8000/api")
).replace(/\/+$/, "");

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // No JSON body (e.g. a network-level failure) — leave data as null.
  }

  if (!res.ok) {
    const message =
      (data && (data.detail || Object.values(data)[0])) || "Something went wrong. Please try again.";
    throw new Error(Array.isArray(message) ? message[0] : message);
  }

  return data;
}

// Pass an email, a phone number, or both. Empty values are left out of the request.
export function joinWaitlist({ email, phone, name }) {
  const body = {};
  if (email) body.email = email;
  if (phone) body.phone = phone;
  if (name) body.name = name;

  return request("/waitlist/", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function fetchWaitlistCount() {
  return request("/waitlist/count/");
}

export function fetchFaqs() {
  return request("/faqs/");
}

export function askFaqQuestion({ question, email }) {
  return request("/faqs/ask/", {
    method: "POST",
    body: JSON.stringify({ question, email }),
  });
}

export function fetchTestimonials() {
  return request("/testimonials/");
}

// category: "student" | "leader". role is shown under a church leader's name.
export function submitTestimonial({ name, quote, rating, university, category, role }) {
  const body = { name, quote, rating };
  if (university) body.university = university;
  if (category) body.category = category;
  if (role) body.role = role;

  return request("/testimonials/submit/", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function fetchPartners() {
  return request("/partners/");
}

export function submitPartnershipInquiry({ church_name, contact_name, email, phone, message }) {
  const body = { church_name, contact_name, email };
  if (phone) body.phone = phone;
  if (message) body.message = message;

  return request("/partners/inquire/", {
    method: "POST",
    body: JSON.stringify(body),
  });
}