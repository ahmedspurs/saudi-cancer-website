import { createWebHistory, createRouter } from "vue-router";
import request from "../services/request";
import HomePage from "../views/Home/Home.vue";
import About from "../views/About/About.vue";
import Programs from "../views/Programs/Programs.vue";
import Partners from "../views/Programs/Partners.vue";
import Health from "../views/Health/Health.vue";
import News from "../views/News/News.vue";
import Login from "../views/Auth/Login.vue";
import Register from "../views/Auth/Register.vue";
import GiftDonation from "../views/Store/GiftDonation.vue";
import DonationCases from "../views/Store/DonationCases.vue";
import Cart from "../views/Store/Cart.vue";
import Checkout from "../views/Checkout/Checkout.vue";
import ErrorPage from "../views/Auth/Error.vue"; // Add this component
import DonationSuccess from "../views/Checkout/DonationSuccess.vue";
import ContactUs from "../views/ContactUs/ContactUs.vue";
// Assume axios instance is imported or configured
import axios from "axios"; // Adjust based on your setup
import BankAccounts from "../views/Store/BankAccounts.vue";
import Profile from "../views/Auth/Profile.vue";
import DonationReciept from "../views/Checkout/DonationReciept.vue";
const routes = [
  {
    path: "/",
    redirect: "/donation-cases/urgent",
    props: true, // Pass route params as props to the component
  },
  { path: "/about", component: About },
  { path: "/programs", component: Programs },
  { path: "/partners", component: Partners },
  { path: "/health", component: Health },
  { path: "/news", component: News },
  { path: "/login", component: Login },
  { path: "/profile", component: Profile, meta: { requiresAuth: true } },
  { path: "/contact", component: ContactUs },
  { path: "/register", component: Register },
  { path: "/gift-donation", component: GiftDonation },
  { path: "/bank-accounts", component: BankAccounts },
  { path: "/donation-reciept", component: DonationReciept },
  {
    path: "/donation-cases/:type",
    name: "DonationCases",
    component: DonationCases,
    props: true, // Pass route params as props to the component
  },
  { path: "/cart", component: Cart },
  { path: "/checkout", component: Checkout },
  {
    path: "/payment-callback",
    component: DonationSuccess,
  },
  { path: "/error", component: ErrorPage }, // Add error route
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Auth guard
router.beforeEach(async (to, from, next) => {
  // Check if the route requires authentication
  const requiresAuth = to.meta.requiresAuth;

  if (!requiresAuth) {
    return next(); // Allow access to public routes
  }

  // Check if user is authenticated
  const loggedToken = localStorage.getItem("accessToken");
  if (!loggedToken) {
    return next({
      path: "/login",
      query: { redirect: to.fullPath, error: "not_authenticated" },
    });
  }

  try {
    // Fetch user data to verify token
    const response = await request.get("tokens/me"); // Adjust endpoint as needed
    const user = response.data;

    if (user) {
      return next(); // User is authenticated, proceed
    }
  } catch (error) {
    console.error("Auth guard error:", {
      message: error.message,
      status: error.response?.status,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken"); // Clear invalid token
      return next({
        path: "/login",
        query: { redirect: to.fullPath, error: "session_expired" },
      });
    }

    // Handle other errors
    return next({
      path: "/error",
      query: { error: "server_error" },
    });
  }
});

// Optional: Add scroll behavior globally
router.afterEach(() => {
  window.scrollTo(0, 0); // Reset scroll position after navigation
});
