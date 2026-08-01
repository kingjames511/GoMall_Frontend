export const navLinks = [
  { label: "Products", href: "/products" },
  { label: "Stores", href: "/stores" },
  { label: "About Us", href: "/about" },
  { label: "FAQs", href: "/faqs" },
  { label: "Support", href: "/support" },
  { label: "My Orders", href: "/orders" },
];

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    id: 1,
    question: "How Do I Shop On GoMall?",
    answer:
      "Simply search for products or browse stores, add your desired items to your cart, proceed to checkout, and choose your preferred payment and delivery options.",
  },
  {
    id: 2,
    question: "Can I Buy Products From Multiple Stores?",
    answer:
      "Yes, GoMall allows you to shop from different stores, compare prices, and purchase products from multiple merchants all in one platform.",
  },
  {
    id: 3,
    question: "How Can I Track My Delivery?",
    answer:
      "After your order is assigned to a rider, you can track your package in real time and receive updates until it arrives at your destination.",
  },
  {
    id: 4,
    question: "Are Payments On GoMall Secure?",
    answer:
      "Yes, GoMall supports secure payment methods through trusted payment platforms, ensuring your transactions are safe and reliable.",
  },
  {
    id: 5,
    question: "How Do I Become A Vendor On GoMall?",
    answer:
      "Sign up on the GoMall merchant platform, complete your business verification, and start selling your products to customers nationwide.",
  },
  {
    id: 6,
    question: "What Happens If I Face An Issue During A Delivery?",
    answer:
      "You can contact in-app support for quick assistance at any time.",
  },
];

export const features = [
  {
    id: 1,
    title: "Original Products",
    description:
      "Shop authentic and high-quality products from trusted stores and verified sellers.",
    icon: "shield-check",
  },
  {
    id: 2,
    title: "Shop from Multiple Stores",
    description:
      "Browse thousands of products from trusted merchants and find everything you need in one place.",
    icon: "store",
  },
  {
    id: 3,
    title: "Satisfaction Guarantee",
    description:
      "We ensure money-back guarantee if the product is counterfeit",
    icon: "thumbs-up",
  },
  {
    id: 4,
    title: "Fast & Reliable Delivery",
    description:
      "We ensure money-back guarantee if the product is counterfeit",
    icon: "truck",
  },
];
