import {
  Bot,
  MessageSquare,
  Zap,
  Sparkles,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import appConfig from "./appConfig";

export const homepageConfig = {
  navTabs: ["Home", "Pricing", "Docs", "About Us", "Contact Us"],
  navbar: {
    signIn: { label: "Sign In", to: "/signin" },
    getStarted: { label: "Get Started", to: "/signup" },
  },
  branding: {
    logoIcon: Bot,
    appName: appConfig.appName,
    logo: appConfig.logo,
  },
  hero: {
    headline: "Build AI chatbots in minutes",
    highlight: "AI chatbots",
    description:
      "Create powerful AI chatbots with natural language processing, custom training, and seamless integrations. No coding required.",
    cta: [
      { label: "Start Building", to: "/signup", primary: true },
      { label: "View Demo", to: "#", primary: false },
    ],
  },
  features: [
    {
      icon: MessageSquare,
      title: "Structured Data Querying",
      description:
        "Query SQL or NoSQL databases in natural language. Automatically generates safe, validated SQL queries.",
    },
    {
      icon: Zap,
      title: "Unstructured Documents",
      description:
        "Query text, PDF, Word, CSV, and Markdown documents using Retrieval-Augmented Generation (RAG).",
    },
    {
      icon: Sparkles,
      title: "Web & API Support",
      description:
        "Extract and answer questions from indexed website data or internal/external APIs.",
    },
  ],
  templates: [
    {
      image: "/placeholder.svg?height=225&width=400",
      alt: "Customer Support Bot",
      title: "Customer Support Bot",
      description:
        "Handle customer inquiries and provide instant support 24/7.",
    },
    {
      image: "/placeholder.svg?height=225&width=400",
      alt: "Sales Assistant Bot",
      title: "Sales Assistant Bot",
      description:
        "Guide customers through your products and boost conversions.",
    },
    {
      image: "/placeholder.svg?height=225&width=400",
      alt: "FAQ Bot",
      title: "FAQ Bot",
      description: "Answer frequently asked questions instantly.",
    },
    {
      image: "/placeholder.svg?height=225&width=400",
      alt: "Lead Generation Bot",
      title: "Lead Generation Bot",
      description: "Capture and qualify leads automatically.",
    },
    {
      image: "/placeholder.svg?height=225&width=400",
      alt: "Booking Bot",
      title: "Booking Bot",
      description: "Schedule appointments and manage bookings effortlessly.",
    },
    {
      image: "/placeholder.svg?height=225&width=400",
      alt: "AI Assistant Bot",
      title: "AI Assistant Bot",
      description: "Advanced AI assistant for complex tasks and conversations.",
    },
  ],
  testimonials: [
    {
      initials: "SJ",
      name: "Sarah Johnson",
      role: "CEO, TechStart",
      quote:
        '"Our customer support response time improved by 80% after implementing this AI chatbot. It handles complex queries effortlessly."',
    },
    {
      initials: "MC",
      name: "Mike Chen",
      role: "CTO, DataFlow",
      quote:
        '"The database querying feature is incredible. Our team can now access insights from our SQL databases using plain English."',
    },
    {
      initials: "AL",
      name: "Anna Lopez",
      role: "Marketing Director, GrowthCo",
      quote:
        '"Lead generation increased by 150% with our AI chatbot. It qualifies prospects perfectly and integrates seamlessly with our CRM."',
    },
  ],
  cta: {
    headline: "Ready to build your chatbot?",
    description:
      "Join thousands of businesses automating customer interactions with AI.",
    actions: [
      { label: "Start Building", to: "/signup", primary: true },
      { label: "View Documentation", to: "#", primary: false },
    ],
  },
  footer: {
    branding: {
      logoIcon: Bot,
      appName: appConfig.appName,
      logo: appConfig.logo,
      description:
        "Build powerful AI chatbots with natural language processing, custom training, and seamless integrations.",
    },
    social: [
      { icon: Github, url: "https://github.com/your-repo", label: "GitHub" },
      {
        icon: Twitter,
        url: "https://twitter.com/your-handle",
        label: "Twitter",
      },
      {
        icon: Linkedin,
        url: "https://linkedin.com/your-profile",
        label: "LinkedIn",
      },
    ],
    columns: [
      {
        heading: "Pages",
        links: [
          { label: "Home", to: "/" },
          { label: "Pricing", to: "/pricing" },
          { label: "Docs", to: "/docs" },
          { label: "About Us", to: "/about-us" },
          { label: "Contact Us", to: "/contact-us" },
        ],
      },
    ],
    copyright:
      '&copy; 2024 <span class="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent font-medium">' +
      appConfig.appName +
      "</span>. All rights reserved.",
  },
  demoSection: {
    title: "AI Chatbot Builder",
    userPrompt: "How can I help you today?",
    aiIntro:
      "I'm your AI assistant! I can help you with questions, provide information, and assist with various tasks. What would you like to know?",
    quickActions: ["Ask about products", "Get support", "Book a demo"],
  },
  featuresSection: {
    label: "Features",
    heading: "Everything you need to build chatbots",
    subheading:
      "From simple FAQ bots to complex AI assistants, our platform provides all the tools you need.",
  },
  templatesSection: {
    heading: "Chatbot templates for every use case",
    subheading: "Get started quickly with our pre-built chatbot templates.",
    viewAllLabel: "View All Templates",
    useTemplateLabel: "Use Template",
  },
  testimonialsSection: {
    heading: "Trusted by thousands of businesses",
    subheading:
      "See what our customers are saying about their chatbot experiences.",
  },
};
