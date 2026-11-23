"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Clock,
  Search,
  Check,
  MapPin,
  MessageCircle,
  ShoppingBag,
  FileSpreadsheet,
  TrendingUp,
  SlidersHorizontal,
  Send,
  Smartphone,
  Lightbulb,
  ExternalLink,
  ShieldCheck,
  Phone,
  ChevronRight,
  PackageCheck,
  Zap,
  Link,
  Package,
  Copy,
  FileText,
  Activity,
  CheckCheck,
  Truck,
  Newspaper,
  Bell,
  Radio,
  EyeOff,
  MessageSquare,
  Globe,
  Layers,
  Award,
  HeartHandshake,
  FileCheck,
  Eye,
  Shield,
  RotateCcw,
  AlertTriangle,
  UserCheck,
  PhoneOff,
  Video,
  Film,
  Share2,
  ChevronLeft,
} from "lucide-react";


export interface AgentShowcaseItem {
  id: string;
  name: string;
  tag: string;
  badge: "Active" | "Coming Soon";
  isComingSoon?: boolean;
  avatarColor: string;
  roleSummary: string;
  primaryCapabilities: string[];
  executionSpeed: string;
  accuracyRate: string;
  setupTime: string;
  mascot: string;
  mascotGlow: string;
  howItWorks: {
    step: string;
    title: string;
    description: string;
  }[];
  businessBenefits: string[];
}

export const AGENT_SHOWCASE_DATA: AgentShowcaseItem[] = [
  {
    id: "product-strategist",
    name: "Product Strategist Agent",
    tag: "9-Phase DTC Research, Cannes Engine & Native Derja Ad Scripts",
    badge: "Active",
    avatarColor: "from-amber-500 to-rose-500",
    mascot: "/mascots/strategist.webp",
    mascotGlow: "from-amber-500/50 via-rose-500/40 to-transparent",
    roleSummary:
      "Feed it your product's name and image. It autonomously executes a 9-phase intelligence pipeline: scrapes 2,000+ Reddit comments, spies on competitor funnels, extracts 8 core product mechanisms, reverse-engineers Meta Ads creatives & hooks, auto-generates 9 strategic foundation documents, runs Cannes & Prism creative engines, and composes viral ad scripts natively in Tunisian Arabic (Derja) ready for teleprompter.",
    primaryCapabilities: [
      "Reddit VOC Scraping (Up to 2,000 Real Customer Reviews)",
      "Competitor Landing Page & Funnel Angle Teardown",
      "8-Category AI Product Mechanism Extraction",
      "Meta Ads Spy (Competitor Creatives, Video Hooks & Fatigue Status)",
      "One-Shot Generation of 9 Strategic Foundation Briefs",
      "Cannes & Prism Creative Engines + Native Tunisian Derja Scripts",
    ],
    executionSpeed: "9 Phases in < 90s",
    accuracyRate: "100% Native Dialect & 9+ Cannes Score",
    setupTime: "Product Name + Photo Only",
    howItWorks: [
      {
        step: "01",
        title: "Input Product & Scrape Intelligence",
        description:
          "Provide the product name and image. Phases 1, 2, and 3 run concurrently to scrape 2,000 Reddit comments, spy on competitor funnels, and extract 8 core product mechanisms.",
      },
      {
        step: "02",
        title: "Meta Ads Spy & 9 Foundation Briefs",
        description:
          "Phase 4 dissects active Meta Ads Library video hooks and angles. Phase 5 synthesizes 9 strategic briefs in one shot. Phases 6, 7, and 8 run Cannes Engine (9+ score ideation), Valence Engine (audience psychology), and Prism Engine (bundle architecture).",
      },
      {
        step: "03",
        title: "Teleprompter-Ready Derja Scripts",
        description:
          "Phase 9 uses Google AI Studio to compose authentic Tunisian Arabic (Derja) ad scripts directly with quality gates, Arabizi prevention, and scene-by-scene timestamps.",
      },
    ],
    businessBenefits: [
      "Turns a simple product name and image into a complete DTC launch strategy in 90 seconds",
      "Uncovers authentic customer pain points and objections from 2,000+ real Reddit reviews",
      "Cannes & Valence engines generate award-winning viral hooks calibrated against 569 top campaigns",
      "Authentic Tunisian Arabic (Derja) scripts ready to film immediately—no clunky English translations",
    ],
  },
  {
    id: "lead-agent",
    name: "Lead Generation Agent",
    tag: "Finds Local Clients on Google Maps & Tunisie Freelance",
    badge: "Active",
    avatarColor: "from-blue-500 to-cyan-400",
    mascot: "/mascots/freelancer.webp",
    mascotGlow: "from-blue-500/50 via-cyan-400/40 to-transparent",
    roleSummary:
      "Searches Google Maps and monitors Tunisie Freelance around the clock for missions matching your exact specialization. Extracts businesses needing your services, automatically analyzes offer requirements, customizes your proposal pitch dynamically to fit each specific project, and applies or outreaches via WhatsApp and Gmail.",
    primaryCapabilities: [
      "Tunisie Freelance Real-Time Offer Scanner",
      "Dynamic Proposal Pitch Adaptation by Project",
      "Google Maps & Web Business Search",
      "Spots Companies Without a Website",
      "Collects Verified Names, Phone Numbers & Addresses",
      "Auto-Outreach via WhatsApp, Gmail & Auto-Apply",
    ],
    executionSpeed: "Runs 24/7 on autopilot",
    accuracyRate: "100% Verified Phone & Matched Offers",
    setupTime: "Ready in 2 minutes",
    howItWorks: [
      {
        step: "01",
        title: "Define What You Offer",
        description:
          "Tell the agent your freelance specialization (e.g. web dev, mobile app, design, SEO) and target location.",
      },
      {
        step: "02",
        title: "Scans Maps & Tunisie Freelance",
        description:
          "The agent searches Google Maps for local businesses and scans Tunisie Freelance continuously for newly posted projects.",
      },
      {
        step: "03",
        title: "Tailors Proposal & Applies",
        description:
          "Dynamically customizes your proposal text to match each specific offer's requirements and sends offers via WhatsApp, Gmail, or platform application.",
      },
    ],
    businessBenefits: [
      "Real-time alerts & automatic applications on Tunisie Freelance",
      "AI adjusts your proposal pitch specifically to each mission's criteria",
      "Find hundreds of qualified local business leads on Google Maps in minutes",
      "Neat export to CSV with 100% verified phones and emails",
    ],
  },
  {
    id: "sales-agent",
    name: "Sales Agent",
    tag: "Replies on WhatsApp, Instagram & Messenger",
    badge: "Active",
    avatarColor: "from-emerald-500 to-teal-400",
    mascot: "/mascots/sales.webp",
    mascotGlow: "from-emerald-500/50 via-teal-400/40 to-transparent",
    roleSummary:
      "Connects to your favorite chat apps (WhatsApp, Instagram, Messenger) to reply to customers and close sales 24/7. Auto-replies to Facebook comments and DMs buyers instantly, while automatically detecting and hiding comments with phone numbers to protect buyer leads from competitors.",
    primaryCapabilities: [
      "24/7 Auto-Reply on WhatsApp, Instagram & Messenger",
      "Facebook Post & Reel Comment Auto-Reply with Instant DM",
      "Auto-Hides Comments with Phone Numbers (Lead Privacy Shield)",
      "Reads Your Product List, Prices & Stock in Real-Time",
      "Follows Your Tone & Discount Instructions",
      "Confirms Orders & Obtains Client Address",
      "Uploads Verified Orders to Converty & Store CRM",
    ],
    executionSpeed: "Instant (< 2s reply time)",
    accuracyRate: "Zero Missed Customer Messages",
    setupTime: "1-Click Chat Link",
    howItWorks: [
      {
        step: "01",
        title: "Connect Your Chat Platforms",
        description:
          "Link your Instagram DM, WhatsApp Business, or Facebook Messenger with a simple click.",
      },
      {
        step: "02",
        title: "Add Products & Instructions",
        description:
          "Provide your product catalog and instructions on how to speak, offer discounts, and recommend bestsellers.",
      },
      {
        step: "03",
        title: "Protects Leads & Closes Orders",
        description:
          "The agent answers comments, auto-hides buyer phone numbers from competitors, and sends verified orders to Converty or your store CRM.",
      },
    ],
    businessBenefits: [
      "Never lose a buyer because you took too long to answer a DM",
      "Automatically hides comments with phone numbers to prevent competitor poaching",
      "Answers questions about stock, sizes, and pricing instantly",
      "Applies promotional discounts and upsells additional products",
      "Automatically uploads verified orders to Converty or your store dashboard",
    ],
  },
  {
    id: "auto-dm",
    name: "Auto DM Agent",
    tag: "Zero-Cost ManyChat Alternative for Instagram Comments & Reels",
    badge: "Active",
    avatarColor: "bg-accent text-white",
    mascot: "/mascots/auto.webp",
    mascotGlow: "bg-accent/30",
    roleSummary:
      "Instantly convert Instagram comments into direct sales. When followers drop trigger keywords on your Posts or Reels, the agent immediately replies and delivers your exact product links straight to their DM—100% predictable, fast, and with zero AI costs.",
    primaryCapabilities: [
      "Instant Keyword Triggers on Posts & Reels ('LINK', 'PRIX', 'PROMO', 'GUIDE')",
      "Instant Public Comment Reply with Automatic @user Tagging",
      "Automated Private DM Delivery with Exact Links, PDFs or Offers",
      "100% Deterministic & Rule-Based (Zero AI Hallucinations)",
      "Zero Monthly Contact Fees & No Third-Party Watermarks",
      "Full Multi-Campaign & Multi-Keyword Support",
    ],
    executionSpeed: "Instant (< 500ms response)",
    accuracyRate: "100% Predictable Rule Execution",
    setupTime: "30 Seconds Setup",
    howItWorks: [
      {
        step: "01",
        title: "Define Trigger Keywords",
        description:
          "Set up trigger keywords like 'PRIX', 'LINK', 'INFO', or 'GUIDE' that your followers comment on your Instagram Reels or Posts.",
      },
      {
        step: "02",
        title: "Craft Public Reply & Private DM",
        description:
          "Write the public reply to boost engagement in the comments, and configure the exact link or message dispatched to their direct inbox.",
      },
      {
        step: "03",
        title: "Zero-Compute Instant Conversion",
        description:
          "Followers get their resource or checkout link in seconds, boosting engagement algorithms and conversions with zero AI costs.",
      },
    ],
    businessBenefits: [
      "Replaces expensive ManyChat subscriptions with zero per-contact fees",
      "Massively increases Instagram algorithmic reach through comment velocity",
      "Delivers product links, lead magnets, and catalog files straight to DMs",
      "100% predictable, exact responses with no compute latency",
    ],
  },
  {
    id: "delivery-agent",
    name: "SMS Delivery Agent",
    tag: "Automates real-time SMS order status and tracking updates directly from your store to your customers.",
    badge: "Active",
    avatarColor: "from-blue-500 to-cyan-500",
    mascot: "/mascots/delivery.webp",
    mascotGlow: "from-blue-500/50 via-cyan-500/40 to-transparent",
    roleSummary:
      "Keeps your buyers informed at every stage of shipment with instant, automated SMS alerts—from warehouse dispatch to out-for-delivery. Reduce delivery returns and support tickets effortlessly by syncing order tracking in real time.",
    primaryCapabilities: [
      "Real-time Order Sync: Triggers automated SMS notifications on every status change (dispatched, in transit, ready for delivery).",
      "Return Rate Reduction: Cuts down delivery failures and boosts customer trust through proactive shipping updates.",
      "Seamless E-commerce Integration: Connects instantly with your store checkout and courier pipelines.",
    ],
    executionSpeed: "Instant SMS Dispatch (< 2s)",
    accuracyRate: "99.8% Delivery Tracking Sync",
    setupTime: "1-Click Store & Carrier Connect",
    howItWorks: [
      {
        step: "01",
        title: "Connect Store & Courier",
        description:
          "Integrate directly with your store (YouCan, Converty, Shopify) and delivery courier (Shipper, TikTak, etc.) in one click.",
      },
      {
        step: "02",
        title: "Real-time Order Sync & Tracking",
        description:
          "The agent listens to delivery status events across warehouse dispatch, in-transit handover, and out-for-delivery.",
      },
      {
        step: "03",
        title: "Instant Customer SMS Alerts",
        description:
          "Sends automated branded SMS messages with live package tracking links directly to the customer's phone.",
      },
    ],
    businessBenefits: [
      "Real-time Order Sync: Triggers automated SMS notifications on every status change (dispatched, in transit, ready for delivery)",
      "Return Rate Reduction: Cuts down delivery failures and boosts customer trust through proactive shipping updates",
      "Seamless E-commerce Integration: Connects instantly with your store checkout and courier pipelines",
      "Drastically minimizes 'Where is my order?' support tickets across WhatsApp and Instagram",
    ],
  },
  {
    id: "news-agent",
    name: "News Agent",
    tag: "Tracks Industry Developments, Filters Noise & Delivers 3-Point Actionable Briefings",
    badge: "Active",
    avatarColor: "from-amber-500 to-orange-500",
    mascot: "/mascots/news.webp",
    mascotGlow: "from-amber-500/50 via-orange-500/40 to-transparent",
    roleSummary:
      "The News Agent continuously tracks your industry to filter out internet noise and highlight only high-impact developments tailored to your business interests. Rather than flooding you with articles, it delivers a direct three-point briefing explaining what happened, why it matters to your business, and what immediate action you should take. It alerts you instantly via your preferred messaging channel for critical emergencies, while compiling routine market updates into a concise periodic briefing.",
    primaryCapabilities: [
      "Industry Noise Filter & High-Impact Trend Detection",
      "Direct 3-Point Briefings (What Happened, Why It Matters, Immediate Action)",
      "Instant Emergency Notifications via Preferred Channels",
      "Concise Routine Market Intelligence & Competitive Digests",
      "Autonomous 24/7 Web & Media Tracking (Zero Setup or Integrations Required)",
    ],
    executionSpeed: "Real-time Monitoring & Instant Alerts",
    accuracyRate: "100% Curated & Noise-Free",
    setupTime: "Ready Instantly (No Integrations Needed)",
    howItWorks: [
      {
        step: "01",
        title: "Continuous Industry Tracking",
        description:
          "Continuously scans trade publications, global feeds, regulatory updates, and market intelligence 24/7 without requiring external integrations.",
      },
      {
        step: "02",
        title: "Noise Filtering & 3-Point Synthesis",
        description:
          "Discards clickbait and distills high-impact events into a structured 3-point briefing: What Happened, Why It Matters, and Next Steps.",
      },
      {
        step: "03",
        title: "Instant Alerts & Routine Briefings",
        description:
          "Notifies you immediately for critical emergencies, while delivering routine summaries directly when you need them.",
      },
    ],
    businessBenefits: [
      "Saves hours of doomscrolling by filtering 99% of useless internet noise",
      "Actionable 3-point briefings give you immediate tactical clarity in under 30 seconds",
      "Instant critical notifications protect your business from sudden market or policy shifts",
      "Completely standalone with zero complex software integrations to configure or maintain",
    ],
  },
  {
    id: "live-catch",
    name: "Live Catch Agent",
    tag: "Facebook Live Comment Listener & Instant Order Extractor",
    badge: "Active",
    avatarColor: "from-rose-500 to-amber-500",
    mascot: "/mascots/live.webp",
    mascotGlow: "from-rose-500/50 via-amber-500/40 to-transparent",
    roleSummary:
      "Autonomous e-commerce agent that monitors Facebook Live video streams in real time. It instantly detects and extracts customer phone numbers, delivery addresses, and product orders directly from streaming comments into an organized database without manual effort, while auto-hiding sensitive customer data from competitors and triggering immediate public and private Messenger replies.",
    primaryCapabilities: [
      "Real-Time Facebook Live Comment Stream Monitoring",
      "Smart Phone & Address Parsing (Digits, Spaces & Spelled-out Numbers)",
      "Automated Order Categorization Linked to Profiles & Timestamps",
      "Instant Comment Auto-Hide to Prevent Competitor Lead Theft",
      "Automated Public Replies & Messenger Direct Closing Messages",
    ],
    executionSpeed: "Real-time (< 1s from comment post)",
    accuracyRate: "100% Phone Validation & Extraction",
    setupTime: "1-Click Facebook Page Connect",
    howItWorks: [
      {
        step: "01",
        title: "Connect to Facebook Live",
        description:
          "Connects directly to your store's page to monitor incoming comments during product showcases without missing high-velocity viewer traffic.",
      },
      {
        step: "02",
        title: "Extract, Validate & Auto-Hide",
        description:
          "Instantly identifies phone numbers, delivery addresses, and quantities, then auto-hides the comment to protect buyer details from competitors.",
      },
      {
        step: "03",
        title: "Log Orders & Close via Messenger",
        description:
          "Saves validated records directly into your order database, posts randomized public acknowledgments, and opens private Messenger chats to finalize delivery.",
      },
    ],
    businessBenefits: [
      "Completely eliminates lost orders and ends the hassle of sorting through thousands of live comments",
      "Accelerates fulfillment by delivering an organized order database the second the live broadcast ends",
      "Prevents customer theft by instantly hiding sensitive numbers and addresses from predatory competitors",
      "Dramatically increases confirmation rates by triggering instant Messenger replies within the 24-hour window",
    ],
  },
  {
    id: "ads-shield",
    name: "Ads Shield Agent",
    tag: "Real-Time Ad Comments Protection, AI Toxicity Filter & Conversion Guard",
    badge: "Active",
    avatarColor: "from-emerald-500 to-teal-500",
    mascot: "/mascots/shield.webp",
    mascotGlow: "from-emerald-500/50 via-teal-500/40 to-transparent",
    roleSummary:
      "Protects paid ad spend and conversion rates in real time. Autonomously inspects incoming comments on Meta Ads with a high-speed toxicity and spam model. Instantly auto-hides insults, scam accusations, competitor links, and spam, while intelligently triaging legitimate customer inquiries to deliver diplomatic, brand-building replies or alert the merchant immediately.",
    primaryCapabilities: [
      "Real-Time Meta Ads Comment Stream & Toxicity Analysis",
      "Instant Auto-Hiding of Insults, Competitor Links & Price Trolling",
      "Customer Privacy Shield (Hiding Phone Numbers & Order Details)",
      "Smart Inquiry Triage (Distinguishing Hate vs. Genuine Product Questions)",
      "Automated Diplomatic Brand Replies for Legitimate Objections",
      "Instant Merchant Alert Notifications for Urgent Issues",
    ],
    executionSpeed: "Real-time (< 800ms per comment)",
    accuracyRate: "99.4% Spam & Toxicity Detection",
    setupTime: "1-Click Meta Ad Account Connect",
    howItWorks: [
      {
        step: "01",
        title: "Monitor Ad Campaigns in Real Time",
        description:
          "Continuously listens to comment webhooks across all active Facebook and Instagram ad creatives with zero manual supervision.",
      },
      {
        step: "02",
        title: "Fast AI Toxicity & Spam Filtering",
        description:
          "High-speed semantic classification instantly detects competitor ads, external links, profanity, and conversion-killing troll comments, auto-hiding them within 800ms.",
      },
      {
        step: "03",
        title: "Triage & Diplomatic Reply Dispatch",
        description:
          "Valid buyer inquiries regarding delivery times or quality concerns receive calibrated, reassuring brand replies to maintain customer trust and maximize ROAS.",
      },
    ],
    businessBenefits: [
      "Stops ad budget waste by preventing troll comments and competitor link hijacking from killing your conversion rates",
      "Protects prospective buyer trust by maintaining clean, high-credibility comment sections across all ad creatives",
      "Safeguards customer privacy and prevents order theft by auto-hiding phone numbers and personal delivery data",
      "Boosts ad ROAS by up to 28% without requiring human moderators to monitor comments 24/7",
    ],
  },
  {
    id: "old-clients",
    name: "Old Clients Agent",
    tag: "Autonomous Lifetime Retention, Context-Aware WhatsApp Repurchasing & Zero CAC Growth",
    badge: "Active",
    avatarColor: "from-blue-600 to-cyan-500",
    mascot: "/mascots/old.webp",
    mascotGlow: "from-blue-600/50 via-cyan-500/40 to-transparent",
    roleSummary:
      "Generates pure profit for merchants by turning dormant buyers into loyal repeat purchasers at Zero CAC. Monitors purchase history from your CRM or store, fires timed WhatsApp lifecycle re-engagement triggers (30, 45, or 60 days post-delivery), crafts hyper-personalized recommendations based on past items, and autonomously closes repeat orders end-to-end without merchant intervention.",
    primaryCapabilities: [
      "Automated Lifecycle Triggers (30, 45, 60 Days Post-Fulfillment)",
      "Zero-CAC Re-engagement Pipelines via Direct WhatsApp API",
      "Context-Aware Cross-Sell & Replenishment AI Recommendations",
      "Loyalty VIP Discount Generation & Limited-Time Promos",
      "Autonomous Order Confirmation & CRM Order Logging",
      "Predictive Consumable Replenishment Reminders (Perfumes, Serums, Supplements)",
    ],
    executionSpeed: "Autonomous Scheduled Dispatch",
    accuracyRate: "100% Customer Purchase History Matching",
    setupTime: "1-Click Converty / Store Sync",
    howItWorks: [
      {
        step: "01",
        title: "Track Lifecycle & Purchase Timestamps",
        description:
          "Ingests fulfilled orders from your CRM or store dashboard and tracks optimal re-engagement countdowns based on product category and consumption cycle.",
      },
      {
        step: "02",
        title: "Craft Context-Aware WhatsApp Pitch",
        description:
          "Generates personalized conversational WhatsApp offers referencing the customer's previous purchase (e.g. matching shirts for athletic shoes, or 45-day skincare refills).",
      },
      {
        step: "03",
        title: "Autonomous Closing & Delivery Re-Booking",
        description:
          "Answers questions, confirms existing delivery addresses or updates them, applies VIP discounts, and pushes the repeat order directly to fulfillment with zero manual touch.",
      },
    ],
    businessBenefits: [
      "Generates pure profit by capturing repeat sales with Zero Customer Acquisition Cost (Zero CAC)",
      "Ends the costly cycle of acquiring customers once and forgetting them after initial delivery",
      "Dramatically increases customer Lifetime Value (LTV) through timed, relevant product recommendations",
      "Runs fully autonomous 24/7 re-ordering workflows without taking up merchant or customer support time",
    ],
  },
  {
    id: "creative-engine",
    name: "Creative Engine Agent",
    tag: "Turns Ad Scripts into Ready-to-Run UGC & Cinematic Video Ads via Higgsfield",
    badge: "Active",
    avatarColor: "from-purple-500 to-indigo-500",
    mascot: "/mascots/creative.webp",
    mascotGlow: "from-purple-500/50 via-indigo-500/40 to-transparent",
    roleSummary:
      "An automated creative execution agent that turns your custom ad scripts into ready-to-run UGC and cinematic video ads on your own schedule—delivering them directly to your media library, draft ads, or live ad manager campaigns. Queue up your ad scripts, hook variations, and product visuals in your workspace, set your generation frequency (e.g., 4 times a day, twice a week, or scheduled drops), and let the agent handle production autonomously. Powered by Higgsfield, it transforms each script into high-converting video assets, applies dynamic captions, and organizes every creative in your media library. With built-in Ad Manager sync, choose to export new assets as pending drafts for team review or auto-publish them directly into active ad sets—delivering consistent creative volume without manual daily intervention.",
    primaryCapabilities: [
      "Higgsfield Generative Diffusion Video Engine",
      "Automated Custom Script & Hook Execution",
      "Dynamic Captions (Neon Pop & Tunisian Derja)",
      "Multi-Aspect Ratios (9:16 Reels/Stories, 1:1 Feed)",
      "Customizable Scheduled Creative Drops & Frequencies",
      "Direct Ad Manager Sync (Draft Review or Auto-Publish)",
    ],
    executionSpeed: "< 90s Render per Video Creative",
    accuracyRate: "100% Script Directives & Aspect Precision",
    setupTime: "Paste Ad Scripts + Schedule Drops",
    howItWorks: [
      {
        step: "01",
        title: "Queue Scripts, Hooks & Visuals",
        description:
          "Input your ad scripts, hook variations, product photos, and select your preferred creative style (UGC creator, cinematic macro, founder story).",
      },
      {
        step: "02",
        title: "Autonomous Production via Higgsfield",
        description:
          "The agent renders high-converting 1080p video assets on your exact schedule, applies dynamic animated captions, and organizes files into your media library.",
      },
      {
        step: "03",
        title: "Ad Manager Sync & Auto-Publish",
        description:
          "Automatically dispatches completed video ads to Meta Ads Manager and TikTok Ads as pending drafts for team review or auto-publishes directly into active ad sets.",
      },
    ],
    businessBenefits: [
      "Solves creative fatigue forever by delivering a steady volume of high-converting UGC & cinematic ads",
      "Transforms raw scripts into ready-to-run 1080p video assets in under 90 seconds with Higgsfield AI",
      "Eliminates thousands in creator production fees, teleprompter recording bottlenecks, and editing delays",
      "Pushes directly to Meta & TikTok Ad Manager drafts or active campaigns on your set schedule",
    ],
  },
];

export const AGENT_INTEGRATIONS: Record<string, { name: string; src: string }[]> = {
  "product-strategist": [],
  "lead-agent": [
    { name: "Tunisie Freelance", src: "/integrations/tunisiefreelance.jpg" },
    { name: "WhatsApp", src: "/integrations/whatsapp.png" },
    { name: "Gmail", src: "/integrations/gmail.webp" },
  ],
  "sales-agent": [
    { name: "WhatsApp", src: "/integrations/whatsapp.png" },
    { name: "Instagram", src: "/integrations/instagram.png" },
    { name: "Messenger", src: "/integrations/messenger.png" },
    { name: "Converty", src: "/integrations/converty.jpg" },
    { name: "Shipper", src: "/integrations/shipper.png" },
    { name: "Tiktak Pro", src: "/integrations/tiktak.jpg" },
    { name: "Youcan", src: "/integrations/youcan.png" },
    { name: "Ecomness", src: "/integrations/ecomness.jpg" },
  ],
  "auto-dm": [
    { name: "Instagram", src: "/integrations/instagram.png" },
    { name: "Facebook", src: "/integrations/facebook.svg" },
  ],
  "delivery-agent": [
    { name: "Shipper", src: "/integrations/shipper.png" },
    { name: "Tiktak Pro", src: "/integrations/tiktak.jpg" },
    { name: "Converty", src: "/integrations/converty.jpg" },
    { name: "Youcan", src: "/integrations/youcan.png" },
    { name: "Ecomness", src: "/integrations/ecomness.jpg" },
  ],
  "news-agent": [],
  "live-catch": [
    { name: "Facebook Live", src: "/integrations/facebook.svg" },
    { name: "Messenger", src: "/integrations/messenger.png" },
    { name: "Converty", src: "/integrations/converty.jpg" },
  ],
  "ads-shield": [
    { name: "Facebook", src: "/integrations/facebook.svg" },
    { name: "Instagram", src: "/integrations/instagram.png" },
    { name: "Messenger", src: "/integrations/messenger.png" },
  ],
  "creative-engine": [
    { name: "Higgsfield", src: "/integrations/higgsfield.png" },
    { name: "Facebook", src: "/integrations/facebook.svg" },
    { name: "Instagram", src: "/integrations/instagram.png" },
  ],
  "old-clients": [
    { name: "WhatsApp", src: "/integrations/whatsapp.png" },
    { name: "Converty", src: "/integrations/converty.jpg" },
    { name: "Youcan", src: "/integrations/youcan.png" },
  ],
};

export const MASCOT_SHADOW_OFFSETS: Record<string, string> = {
  "product-strategist": "calc(50% - 5.5%)",
  "lead-agent": "calc(50% - 3.1%)",
  "sales-agent": "calc(50% + 0.3%)",
  "auto-dm": "calc(50% + 0.3%)",
  "delivery-agent": "calc(50% + 0.8%)",
  "news-agent": "calc(50% - 0.5%)",
  "live-catch": "calc(50% - 1.9%)",
  "ads-shield": "calc(50% + 0.3%)",
  "creative-engine": "calc(50% + 0.3%)",
  "old-clients": "calc(50% + 0.3%)",
};

export const PRODUCT_STRATEGIST_SCRIPTS = {
  pain: {
    id: "pain",
    title: "Angle 1: Pain-Point Agitation",
    subtitle: "سياقة تونس ووجيعة الظهر",
    cannesConcept: "The Ergonomic Lie (Score: 9.5/10)",
    valenceZone: "Zone 3: Acute Discomfort & Daily Agitation",
    eqScore: "94/100 Composite EQ",
    prismLens: "Mechanism-to-Product • 80D Bamboo Memory Core",
    cadence: "125 words/min • 34s duration",
    scenes: [
      {
        time: "0:00 - 0:03",
        hookType: "Retention Hook",
        cue: "مشهد 1: كاميرا Selfie في الكرهبة، يتكّا على ظهرو ويتوجّع من الثنية",
        text: "تعدّي ساعتين في الـ embouteillage متاع الشرقية ولا في الـ X، وتروّح لدارك ضهرك مكسّر وماتنجّمش حتى تتفرّج مرتاح؟",
      },
      {
        time: "0:04 - 0:14",
        hookType: "Problem Agitation",
        cue: "مشهد 2: Zoom على الفراغ بين الظهر وكرسي الكرهبة العادي",
        text: "المشكلة موش في كبر العمر، المشكلة في كراسي الكراهب متاعنا! الفراغ اللي بين فقرات ضهرك والكرسي يخلّي عضلاتك شادّة 100% من الضغط طوال الثنية.",
      },
      {
        time: "0:15 - 0:26",
        hookType: "Mechanism Proof",
        cue: "مشهد 3: يشد الـ Coussin بيد وحدة ويبيّن كيفاش الـ Memory Foam يرجع لشكلو",
        text: "شوف هوني: الـ Coussin Ergonomique بالـ High-Density Memory Foam الطبي. يعبّي الفراغ هذاكا بالضبط ويرجع الـ posture متاعك مستوية بالسيف على بدنك. ترتاح من أول دقيقة تركبو فيها.",
      },
      {
        time: "0:27 - 0:35",
        hookType: "Risk Reversal & CTA",
        cue: "مشهد 4: يركّب الـ Coussin في الكرسي بحزام الأمان ويضحك للكاميرا",
        text: "التوصيل بلاش لباب الدار في 24 ساعة، ومعاه ضمان استرجاع 14 يوم. كليكي على الرابط التحتاني واطلب متاعك قبل ما يوفى الـ Stock!",
      },
    ],
  },
  humor: {
    id: "humor",
    title: "Angle 2: Everyday Relatability",
    subtitle: "كرسي البيرو المنتهي صلاحيّتو",
    cannesConcept: "The 8-Hour Torture Device (Score: 9.3/10)",
    valenceZone: "Zone 1: Irony, Humor & Social Identity",
    eqScore: "91/100 Composite EQ",
    prismLens: "Failed-Solution Inversion • Gaming Chair Alternative",
    cadence: "130 words/min • 35s duration",
    scenes: [
      {
        time: "0:00 - 0:03",
        hookType: "Humorous Hook",
        cue: "مشهد 1: يطبطب على كرسي البيرو البالي ويشوف للكاميرا بنظرة يأس",
        text: "كرسي الخدمة هذايا، نحسّو شاريينو عام 2011 ومحلوف عليه باش ما يتبدّلش أبداً!",
      },
      {
        time: "0:04 - 0:13",
        hookType: "Relatable Scenario",
        cue: "مشهد 2: تمثيلية كيفاش يبدا الصباح مقادد، والعشية يولي ملوّي كي حرف الـ S",
        text: "كل نهار 8 سوايع قدام الـ écran، تبدا الصباح قاعد كيما المدير، ومع الـ 2 متاع العشية تولي قاعد كيما حرف الـ S اللاتيني، وضهرك يعيّط 'أنقذوني'!",
      },
      {
        time: "0:14 - 0:25",
        hookType: "Affordable Fix",
        cue: "مشهد 3: يحط الـ Coussin على الكرسي ويقعد مستوي وفرحان بـ 0 مجهود",
        text: "ما غير ما تشري كرسي gaming بـ 600 دينار، الـ Coussin هذا بالـ Memory Foam الذكي يرد أي كرسي قديم يولي Fauteuil طبي درجة أولى. فيه حزام يتثبت بيه وما يزلقش جملة.",
      },
      {
        time: "0:26 - 0:35",
        hookType: "Social Offer & CTA",
        cue: "مشهد 4: غمزة للكاميرا وهو يخدم مرتاح، ويشاور على زر الشراء",
        text: "اشري راحة ضهرك بـ سوم رمزي وفك عليك من وجايع الرقبة. اضغط على 'Acheter Maintenant' وخلّي نهار خدمتك يتعدى خفيف!",
      },
    ],
  },
  skeptic: {
    id: "skeptic",
    title: "Angle 3: Skeptic-Busting Mechanism",
    subtitle: "التجربة والبرهان ضد المخدات الرخاص",
    cannesConcept: "The Orthopedic Rebound Test (Score: 9.6/10)",
    valenceZone: "Zone 4: High Skepticism & Evidence Inversion",
    eqScore: "96/100 Composite EQ",
    prismLens: "Mechanism-to-Product • 80D Bamboo Memory Core",
    cadence: "120 words/min • 35s duration",
    scenes: [
      {
        time: "0:00 - 0:04",
        hookType: "Challenger Hook",
        cue: "مشهد 1: يلوّح مخدّة عادية مسطحة على الطاولة بنبرة تحدي واضحة",
        text: "جربت مخدات السوق العادية، والـ coussins الرخاص، وبعد جمعتين يطيحو ويوليو مسطحين كانك حاطط كرتونة وراك؟",
      },
      {
        time: "0:05 - 0:15",
        hookType: "Live Stress Test",
        cue: "مشهد 2: يضغط بقوة بيدو على الـ Coussin ويسيبو، يرجع في 3 ثواني لشكلو الأصلي",
        text: "علاش هذا مختلف؟ السر في الـ 80D Ultra-Density Bamboo Memory Foam. موش قطن رخيص! هذا mousse orthopédique يرجع لشكلو الأصلي وما يهبطش حتى كان تقعد عليه نهار كامل.",
      },
      {
        time: "0:16 - 0:26",
        hookType: "Medical Feature Spec",
        cue: "مشهد 3: يورّي القماش القابل للغسيل والـ Lumbar Support Curve للفقرات L4 و L5",
        text: "القوس متاعو مدروس علمياً باش يثبت الفقرة L4 و L5، والقماش متاعو respirant يتنفس وما يعرّقش في الصيف، ويتنحى يتغسل في الماكينة في ثواني.",
      },
      {
        time: "0:27 - 0:35",
        hookType: "Ironclad Guarantee",
        cue: "مشهد 4: يوري العلبة الأصلية وضمان الـ 14 يوم الدفع عند الاستلام",
        text: "جربو 14 يوم كاملين، إذا ما حسيتش بفرق جذري في ضهرك، فلوسك ترجعلك كاملة. الرابط الفوقاني، والدفع عند الاستلام!",
      },
    ],
  },
};

export default function AgentShowcase() {
  const containerRef = useScrollReveal<HTMLElement>(0.1);
  const [activeTabId, setActiveTabId] = useState<string>("product-strategist");
  const [previewSubTab, setPreviewSubTab] = useState<"primary" | "secondary" | "tertiary">("primary");
  const [scriptAngle, setScriptAngle] = useState<"pain" | "humor" | "skeptic">("pain");
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  }>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);
  const [hoverStyle, setHoverStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  }>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const tabsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const switcherScrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);

  const checkScrollState = () => {
    const el = switcherScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  };

  const scrollSwitcher = (direction: "left" | "right") => {
    const el = switcherScrollRef.current;
    if (!el) return;

    // Find the current scroll position and snap to the next/prev tab cleanly
    const buttons = Object.values(tabsRef.current).filter(Boolean) as HTMLButtonElement[];
    if (buttons.length === 0) return;

    const currentScroll = el.scrollLeft;
    let targetScroll = currentScroll;

    if (direction === "right") {
      // Find the first button whose start is noticeably ahead of the current scroll
      const nextBtn = buttons.find((btn) => btn.offsetLeft - 6 > currentScroll + 8);
      targetScroll = nextBtn ? Math.max(0, nextBtn.offsetLeft - 6) : el.scrollWidth;
    } else {
      // Find the previous button to the left
      const prevButtons = buttons.filter((btn) => btn.offsetLeft - 6 < currentScroll - 8);
      const prevBtn = prevButtons[prevButtons.length - 1];
      targetScroll = prevBtn ? Math.max(0, prevBtn.offsetLeft - 6) : 0;
    }

    el.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  const handleCopyScript = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  const handleTabHover = (id: string) => {
    setHoveredTabId(id);
    const btn = tabsRef.current[id];
    if (btn) {
      setHoverStyle({
        left: btn.offsetLeft,
        top: btn.offsetTop,
        width: btn.offsetWidth,
        height: btn.offsetHeight,
      });
    }
  };

  useEffect(() => {
    const updateIndicator = () => {
      const activeBtn = tabsRef.current[activeTabId];
      if (activeBtn) {
        setIndicatorStyle({
          left: activeBtn.offsetLeft,
          top: activeBtn.offsetTop,
          width: activeBtn.offsetWidth,
          height: activeBtn.offsetHeight,
        });
        setHoverStyle((prev) =>
          prev.width === 0
            ? {
              left: activeBtn.offsetLeft,
              top: activeBtn.offsetTop,
              width: activeBtn.offsetWidth,
              height: activeBtn.offsetHeight,
            }
            : prev
        );
      }
    };

    updateIndicator();
    checkScrollState();
    setIsMounted(true);

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        updateIndicator();
        checkScrollState();
      });
    }

    const handleResize = () => {
      updateIndicator();
      checkScrollState();
    };

    window.addEventListener("resize", handleResize);

    const scrollEl = switcherScrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener("scroll", checkScrollState, { passive: true });
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (scrollEl) {
        scrollEl.removeEventListener("scroll", checkScrollState);
      }
    };
  }, [activeTabId]);

  const selectedAgent =
    AGENT_SHOWCASE_DATA.find((agent) => agent.id === activeTabId) ||
    AGENT_SHOWCASE_DATA[0];

  const handleTabChange = (id: string) => {
    setActiveTabId(id);
    setPreviewSubTab("primary");

    const btn = tabsRef.current[id];
    const scrollContainer = switcherScrollRef.current;
    if (btn && scrollContainer) {
      // Calculate target scrollLeft keeping the exact container padding (6px / p-1.5)
      // When id is the first agent, scroll to 0; otherwise offset by the inner container padding
      const targetScroll = Math.max(0, btn.offsetLeft - 6);
      scrollContainer.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  const getAgentTabIcon = (id: string) => {
    switch (id) {
      case "product-strategist":
        return <Package className="w-4 h-4" />;
      case "lead-agent":
        return <Search className="w-4 h-4" />;
      case "sales-agent":
        return <MessageCircle className="w-4 h-4" />;
      case "auto-dm":
        return <Zap className="w-4 h-4" />;
      case "delivery-agent":
        return <Truck className="w-4 h-4" />;
      case "news-agent":
        return <Newspaper className="w-4 h-4" />;
      case "live-catch":
        return <Radio className="w-4 h-4" />;
      case "old-clients":
        return <RotateCcw className="w-4 h-4" />;
      case "ads-shield":
        return <Shield className="w-4 h-4" />;
      case "creative-engine":
        return <Video className="w-4 h-4" />;
      default:
        return <SlidersHorizontal className="w-4 h-4" />;
    }
  };

  return (
    <section
      id="solutions"
      ref={containerRef}
      aria-labelledby="showcase-heading"
      className="relative w-full py-20 sm:py-28 bg-primary text-secondary transition-colors duration-300 border-t border-secondary/10 overflow-hidden"
    >
      {/* Off-screen persistent preloader to ensure all agent mascots and integration icons are loaded and decoded immediately on initial page open */}
      <div
        className="fixed -top-[9999px] -left-[9999px] w-1 h-1 opacity-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {AGENT_SHOWCASE_DATA.map((agent) => (
          <div key={`preload-${agent.id}`}>
            <Image
              src={agent.mascot}
              alt=""
              width={800}
              height={800}
              priority
              unoptimized
            />
            {AGENT_INTEGRATIONS[agent.id]?.map((app) => (
              <Image
                key={`preload-${agent.id}-${app.name}`}
                src={app.src}
                alt=""
                width={32}
                height={32}
                priority
                unoptimized
              />
            ))}
          </div>
        ))}
        <Image
          src="/product.jpeg"
          alt=""
          width={48}
          height={48}
          priority
          unoptimized
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header - Non-IT, Business-Centric */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2
            id="showcase-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-secondary mb-5"
          >
            Meet Your New AI Employees. <br className="hidden sm:inline" />
            <span className="text-accent">
              Trained for Real Everyday Business.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-secondary/75 max-w-2xl mx-auto leading-relaxed">
            No coding, no complicated settings, and no tech headaches. Pick an agent, connect
            your daily tools like WhatsApp, Instagram, or Gmail, and let them
            handle the time-consuming work for you.
          </p>
        </div>

        {/* Top Interactive Agent Switcher */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-10 w-full max-w-7xl mx-auto px-2">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => scrollSwitcher("left")}
            aria-label="Scroll agent options left"
            className={`shrink-0 h-12 w-10 sm:h-12 sm:w-11 flex items-center justify-center rounded-2xl bg-secondary/5 hover:bg-secondary/10 border border-secondary/15 text-secondary backdrop-blur-lg shadow-xs transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
              canScrollLeft
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none invisible"
            }`}
          >
            <ChevronLeft className="w-5 h-5 sm:w-5 sm:h-5" />
          </button>

          {/* Outer Rounded Viewport Mask (Ensures both left and right edges are always cleanly rounded with visible borders regardless of scroll position) */}
          <div className="rounded-2xl border border-secondary/15 bg-secondary/5 backdrop-blur-lg overflow-hidden max-w-full">
            <div
              ref={switcherScrollRef}
              className="overflow-x-auto scrollbar-none scroll-scrub scroll-smooth"
            >
              <div
                onMouseLeave={() => setHoveredTabId(null)}
                className="relative inline-flex p-1.5 gap-1.5 sm:gap-2 flex-nowrap"
              >
                {/* Animated Sliding Background Hover Pill */}
                <div
                  className="absolute rounded-xl bg-secondary/10 pointer-events-none z-0 transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  style={{
                    left: `${hoverStyle.left}px`,
                    top: `${hoverStyle.top}px`,
                    width: `${hoverStyle.width}px`,
                    height: `${hoverStyle.height}px`,
                    opacity: hoveredTabId && hoveredTabId !== activeTabId ? 1 : 0,
                  }}
                />

                {/* Animated Sliding Background Accent Pill */}
                <div
                  className={`absolute rounded-xl bg-accent shadow-lg shadow-accent/25 pointer-events-none z-0 ${isMounted
                    ? "transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    : "transition-none"
                    }`}
                  style={{
                    left: `${indicatorStyle.left}px`,
                    top: `${indicatorStyle.top}px`,
                    width: `${indicatorStyle.width}px`,
                    height: `${indicatorStyle.height}px`,
                    opacity: indicatorStyle.width > 0 ? 1 : 0,
                  }}
                />

                {AGENT_SHOWCASE_DATA.map((agent) => {
                  const isActive = activeTabId === agent.id;
                  const isComingSoon = agent.isComingSoon;

                  return (
                    <button
                      key={agent.id}
                      ref={(el) => {
                        tabsRef.current[agent.id] = el;
                      }}
                      type="button"
                      onClick={() => handleTabChange(agent.id)}
                      onMouseEnter={() => handleTabHover(agent.id)}
                      aria-selected={isActive}
                      role="tab"
                      className={`relative z-10 flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer select-none whitespace-nowrap ${isActive
                        ? "text-white"
                        : isComingSoon
                          ? "text-secondary/60 hover:text-secondary"
                          : "text-secondary/70 hover:text-secondary"
                        }`}
                    >
                      <span className={isActive ? "text-white" : "text-accent"}>
                        {getAgentTabIcon(agent.id)}
                      </span>
                      <span>{agent.name}</span>
                      {isComingSoon && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-secondary/10 text-secondary/70 border border-secondary/15">
                          Soon
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => scrollSwitcher("right")}
            aria-label="Scroll agent options right"
            className={`shrink-0 h-12 w-10 sm:h-12 sm:w-11 flex items-center justify-center rounded-2xl bg-secondary/5 hover:bg-secondary/10 border border-secondary/15 text-secondary backdrop-blur-lg shadow-xs transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
              canScrollRight
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none invisible"
            }`}
          >
            <ChevronRight className="w-5 h-5 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Main Agent Presentation Grid */}
        <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8">

          {/* ================= AGENT DESCRIPTION & INTEGRATIONS WITH EXTERNAL RIGHT MASCOT ================= */}
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-16 lg:gap-24 scroll-scrub">
            {/* The Description & Integrations Card */}
            <div className="flex-1 transition-all duration-300 flex flex-col justify-between gap-6">

              {/* Full-width Tag Headline */}
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-secondary leading-tight">
                  {selectedAgent.tag}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-xl text-xs font-semibold text-secondary/80 bg-secondary/5 border border-secondary/15 shadow-xs">
                    ⚡ {selectedAgent.executionSpeed}
                  </span>
                  <span className="px-3 py-1 rounded-xl text-xs font-semibold text-secondary/80 bg-secondary/5 border border-secondary/15 shadow-xs">
                    🎯 {selectedAgent.accuracyRate}
                  </span>
                </div>
              </div>

              {/* Supported Integrations Underneath The Tag */}
              <div className="pt-3 border-t border-secondary/10 flex flex-col gap-2">
                {AGENT_INTEGRATIONS[selectedAgent.id] && AGENT_INTEGRATIONS[selectedAgent.id].length > 0 ? (
                  <>
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary/60">
                      Supported Integrations
                    </span>
                    <div className="flex items-center gap-2 p-1.5 w-fit rounded-2xl bg-secondary/5 border border-secondary/15 shadow-xs">
                      {AGENT_INTEGRATIONS[selectedAgent.id].map((app, idx) => (
                        <div
                          key={`${selectedAgent.id}-${app.name}`}
                          title={app.name}
                          style={{ animationDelay: `${idx * 70}ms` }}
                          className="icon-pop-enter relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-secondary/10 p-1.5 flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-xs border border-secondary/10 group/icon"
                        >
                          <Image
                            src={app.src}
                            alt={app.name}
                            width={32}
                            height={32}
                            loading="eager"
                            unoptimized
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 w-fit rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Standalone Autopilot • No Integrations Needed</span>
                  </div>
                )}
              </div>
            </div>

            {/* Mascot Character on the Outside Right (Bigger Hero Presentation) */}
            <div className="relative shrink-0 flex flex-col items-center justify-center">
              {/* Floating Mascot Figure with Spring Bounce on Switch */}
              <div
                key={selectedAgent.id}
                className="mascot-bounce-enter relative h-48 sm:h-60 md:h-64 w-52 sm:w-64 md:w-72 flex items-center justify-center drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:scale-105"
              >
                {/* Mascot Floating Floor Shadow precisely centered under base */}
                <div
                  className="absolute -bottom-2 pointer-events-none z-0 w-28 sm:w-36 md:w-40 h-5 sm:h-6 rounded-[100%] bg-secondary/35 blur-sm animate-mascot-shadow"
                  style={{
                    left: MASCOT_SHADOW_OFFSETS[selectedAgent.id] || "50%",
                  }}
                />

                <div className="animate-mascot-float relative z-10 h-full w-full flex items-center justify-center">
                  <Image
                    src={selectedAgent.mascot}
                    alt={`${selectedAgent.name} Mascot`}
                    width={800}
                    height={800}
                    style={{ height: "100%", width: "auto" }}
                    className="object-contain"
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ================= INTERACTIVE VISUAL DEMO ================= */}
          <div className="lg:col-span-7 rounded-3xl border border-secondary/15 bg-secondary/4 backdrop-blur-2xl p-5 sm:p-7 shadow-2xl flex flex-col justify-between overflow-hidden scroll-scrub relative">
            <div>
              {/* Window Header Bar - Clean & Non-Technical */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-secondary/10 mb-5">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-semibold text-secondary ml-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    Live Agent Visual Workspace
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                    <span className="sonar-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Auto-Pilot Active
                  </span>
                </div>
              </div>

              {/* Sub-view switcher for the selected agent */}
              <div className="relative flex items-center justify-between gap-1 sm:gap-2 mb-4 bg-secondary/5 p-1 sm:p-2 rounded-xl border border-secondary/10 w-full sm:w-5/6 md:w-3/4 lg:w-2/3 mx-auto">
                {/* Sliding Pill Indicator for Sub-Tabs */}
                <div
                  className="absolute top-1 bottom-1 rounded-lg bg-accent shadow-sm transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none z-0"
                  style={{
                    left: previewSubTab === "primary" ? "4px" : "calc(50% + 2px)",
                    width: "calc(50% - 6px)",
                  }}
                />

                {selectedAgent.id === "product-strategist" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab("primary")}
                      className={`relative z-10 flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors duration-200 cursor-pointer text-center ${previewSubTab === "primary"
                        ? "text-white font-bold"
                        : "text-secondary/70 hover:text-secondary"
                        }`}
                    >
                      ⚡ 9-Phase Parallel Pipeline
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab("secondary")}
                      className={`relative z-10 flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors duration-200 cursor-pointer text-center ${previewSubTab === "secondary"
                        ? "text-white font-bold"
                        : "text-secondary/70 hover:text-secondary"
                        }`}
                    >
                      🎬 Strategy Dossier &amp; Derja Scripts
                    </button>
                  </>
                )}

                {selectedAgent.id === "lead-agent" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab("primary")}
                      className={`relative z-10 flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors duration-200 cursor-pointer text-center ${previewSubTab === "primary"
                        ? "text-white font-bold"
                        : "text-secondary/70 hover:text-secondary"
                        }`}
                    >
                      📊 Google Maps Leads Table
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab("secondary")}
                      className={`relative z-10 flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors duration-200 cursor-pointer text-center ${previewSubTab === "secondary"
                        ? "text-white font-bold"
                        : "text-secondary/70 hover:text-secondary"
                        }`}
                    >
                      💬 WhatsApp Offer &amp; Advice
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab("tertiary")}
                      className={`relative z-10 flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors duration-200 cursor-pointer text-center ${previewSubTab === "tertiary"
                        ? "text-white font-bold"
                        : "text-secondary/70 hover:text-secondary"
                        }`}
                    >
                      💼 Tunisie Freelance Auto-Bid
                    </button>
                  </>
                )}

                {selectedAgent.id === "sales-agent" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab("primary")}
                      className={`relative z-10 flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors duration-200 cursor-pointer text-center ${previewSubTab === "primary"
                        ? "text-white font-bold"
                        : "text-secondary/70 hover:text-secondary"
                        }`}
                    >
                      💬 24/7 Social Chat Simulator
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab("secondary")}
                      className={`relative z-10 flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors duration-200 cursor-pointer text-center ${previewSubTab === "secondary"
                        ? "text-white font-bold"
                        : "text-secondary/70 hover:text-secondary"
                        }`}
                    >
                      📦 Verified Orders (Converty / Store)
                    </button>
                  </>
                )}

                {selectedAgent.id === "auto-dm" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab("primary")}
                      className={`relative z-10 flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors duration-200 cursor-pointer text-center ${previewSubTab === "primary"
                        ? "text-white font-bold"
                        : "text-secondary/70 hover:text-secondary"
                        }`}
                    >
                      ⚡ Comment Trigger &amp; Instant DM
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab("secondary")}
                      className={`relative z-10 flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors duration-200 cursor-pointer text-center ${previewSubTab === "secondary"
                        ? "text-white font-bold"
                        : "text-secondary/70 hover:text-secondary"
                        }`}
                    >
                      ⚙️ Keyword &amp; Message Rules
                    </button>
                  </>
                )}

                {selectedAgent.id === "delivery-agent" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab("primary")}
                      className={`relative z-10 flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors duration-200 cursor-pointer text-center ${previewSubTab === "primary"
                        ? "text-white font-bold"
                        : "text-secondary/70 hover:text-secondary"
                        }`}
                    >
                      📱 Live Automated SMS Timeline
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab("secondary")}
                      className={`relative z-10 flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors duration-200 cursor-pointer text-center ${previewSubTab === "secondary"
                        ? "text-white font-bold"
                        : "text-secondary/70 hover:text-secondary"
                        }`}
                    >
                      🚚 Courier Sync &amp; Return Metrics
                    </button>
                  </>
                )}

                {selectedAgent.id === "news-agent" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab("primary")}
                      className={`relative z-10 flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors duration-200 cursor-pointer text-center ${previewSubTab === "primary"
                        ? "text-white font-bold"
                        : "text-secondary/70 hover:text-secondary"
                        }`}
                    >
                      ⚡ 3-Point Actionable Briefing
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab("secondary")}
                      className={`relative z-10 flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors duration-200 cursor-pointer text-center ${previewSubTab === "secondary"
                        ? "text-white font-bold"
                        : "text-secondary/70 hover:text-secondary"
                        }`}
                    >
                      🚨 Critical Alert &amp; Messaging Dispatch
                    </button>
                  </>
                )}

                {selectedAgent.id === "live-catch" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab("primary")}
                      className={`relative z-10 flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors duration-200 cursor-pointer text-center ${previewSubTab === "primary"
                        ? "text-white font-bold"
                        : "text-secondary/70 hover:text-secondary"
                        }`}
                    >
                      🔴 Live Comment Stream &amp; Auto-Extraction
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab("secondary")}
                      className={`relative z-10 flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors duration-200 cursor-pointer text-center ${previewSubTab === "secondary"
                        ? "text-white font-bold"
                        : "text-secondary/70 hover:text-secondary"
                        }`}
                    >
                      💬 Public &amp; Private Messenger Replies + Privacy
                    </button>
                  </>
                )}

                {selectedAgent.id === "ads-shield" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab("primary")}
                      className={`relative z-10 flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors duration-200 cursor-pointer text-center ${previewSubTab === "primary"
                        ? "text-white font-bold"
                        : "text-secondary/70 hover:text-secondary"
                        }`}
                    >
                      🛡️ Real-Time Ads Moderation &amp; Toxicity Filter
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab("secondary")}
                      className={`relative z-10 flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors duration-200 cursor-pointer text-center ${previewSubTab === "secondary"
                        ? "text-white font-bold"
                        : "text-secondary/70 hover:text-secondary"
                        }`}
                    >
                      💬 Smart Inquiry Triage &amp; Diplomatic Brand Replies
                    </button>
                  </>
                )}

                {selectedAgent.id === "creative-engine" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab("primary")}
                      className={`relative z-10 flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors duration-200 cursor-pointer text-center ${previewSubTab === "primary"
                        ? "text-white font-bold"
                        : "text-secondary/70 hover:text-secondary"
                        }`}
                    >
                      🎬 Script-to-Video Pipeline (Higgsfield Engine)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab("secondary")}
                      className={`relative z-10 flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors duration-200 cursor-pointer text-center ${previewSubTab === "secondary"
                        ? "text-white font-bold"
                        : "text-secondary/70 hover:text-secondary"
                        }`}
                    >
                      🚀 Ad Manager Auto-Sync &amp; Drop Schedules
                    </button>
                  </>
                )}

                {selectedAgent.id === "old-clients" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab("primary")}
                      className={`relative z-10 flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors duration-200 cursor-pointer text-center ${previewSubTab === "primary"
                        ? "text-white font-bold"
                        : "text-secondary/70 hover:text-secondary"
                        }`}
                    >
                      🔄 Lifecycle Triggers &amp; WhatsApp Pitch Generation
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab("secondary")}
                      className={`relative z-10 flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors duration-200 cursor-pointer text-center ${previewSubTab === "secondary"
                        ? "text-white font-bold"
                        : "text-secondary/70 hover:text-secondary"
                        }`}
                    >
                      📈 Repeat Conversions &amp; Autonomous Order Re-Booking
                    </button>
                  </>
                )}
              </div>

              {/* ================= SUB-PANEL CONTENT ================= */}
              <div key={`${selectedAgent.id}-${previewSubTab}`} className="panel-enter">
                {/* 0. PRODUCT STRATEGIST AGENT PREVIEW */}
                {selectedAgent.id === "product-strategist" && (
                  <div>
                    {previewSubTab === "primary" ? (
                      /* Sub-view: 8-Phase Parallel Pipeline DAG */
                      <div className="space-y-4">
                        {/* Featured Product Hero Bar */}
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-secondary/5 border border-secondary/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5 sm:gap-4">
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-accent/30 shadow-md shrink-0 bg-white dark:bg-secondary/10 flex items-center justify-center group/prod">
                              <Image
                                src="/product.jpeg"
                                alt="Orthopedic Memory Foam Lumbar Support"
                                width={120}
                                height={120}
                                className="object-contain w-full h-full p-1 rounded-xl group-hover/prod:scale-105 transition-transform duration-200"
                                priority
                              />
                              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/75 text-[9px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                                Input Image
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm sm:text-base font-extrabold text-secondary">
                                  Orthopedic Memory Foam Lumbar Support
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-secondary/10 text-secondary/70 border border-secondary/15">
                                  DTC Health &amp; Ergonomics
                                </span>
                              </div>
                              <p className="text-xs text-secondary/70">
                                Autonomous 9-Phase Intelligence Graph • Live Input: Product Name &amp; Photo
                              </p>
                              <div className="flex items-center gap-2 pt-0.5">
                                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Product Vision Analyzed (Ergonomic Curve &amp; Mesh Cover)
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-secondary/10">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              All 9 Phases Completed (84s)
                            </span>
                            <span className="text-[11px] font-medium text-secondary/60">
                              ⚡ 100% Native Dialect Ready
                            </span>
                          </div>
                        </div>

                        {/* Pipeline DAG Container: Interconnected Animated Rail */}
                        <div className="rounded-2xl border border-secondary/15 bg-primary/40 p-3 sm:p-5">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-secondary/10">
                            <div className="flex items-center gap-2">
                              <span className="relative flex h-2 w-2 items-center justify-center">
                                <span className="sonar-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
                              </span>
                              <span className="text-[11px] font-black uppercase tracking-wider text-accent flex items-center gap-1.5">
                                <Activity className="w-3.5 h-3.5" />
                                Autonomous Execution Pipeline DAG
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <span className="text-[10px] font-semibold text-secondary/60 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-secondary/40" />
                                Total 84s Execution
                              </span>
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                9 / 9 Phases Synced
                              </span>
                            </div>
                          </div>

                          {/* Rail & Connected Step Nodes */}
                          <div className="relative pl-10 space-y-2.5">
                            {/* Glowing Left Rail Connector */}
                            <div
                              aria-hidden="true"
                              className="absolute left-4 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-linear-to-b from-accent via-emerald-500/70 to-emerald-400"
                            />

                            {[
                              {
                                phase: "01",
                                title: "Reddit VOC Sentiment",
                                desc: "Scraped 1,842 unfiltered customer pain points & complaints",
                                color: "bg-orange-500",
                                icon: MessageSquare,
                                badge: "1,842 VOC Parsed",
                                duration: "8s",
                              },
                              {
                                phase: "02",
                                title: "Competitor Intelligence",
                                desc: "Analyzed top 5 rival landing pages, pricing & claim angles",
                                color: "bg-blue-500",
                                icon: Globe,
                                badge: "5 Funnels Scraped",
                                duration: "12s",
                              },
                              {
                                phase: "03",
                                title: "Mechanism Extraction",
                                desc: "Mapped 8 core product capability & safety categories",
                                color: "bg-purple-500",
                                icon: Layers,
                                badge: "8 Categories Mapped",
                                duration: "9s",
                              },
                              {
                                phase: "04",
                                title: "Meta Ads Spy",
                                desc: "Dissected active Meta Ads Library angles, video hooks & ad fatigue status",
                                color: "bg-indigo-500",
                                icon: Eye,
                                badge: "Meta Ads Dissected",
                                duration: "13s",
                              },
                              {
                                phase: "05",
                                title: "Creative Brief Synthesis",
                                desc: "Generated 9 foundation strategy docs with zero manual prompting",
                                color: "bg-accent",
                                icon: FileCheck,
                                badge: "9 Briefs Ready",
                                duration: "14s",
                              },
                              {
                                phase: "06",
                                title: "Cannes Creativity Engine",
                                desc: "Calibrated lateral thinking angles against 569 award winners",
                                color: "bg-rose-500",
                                icon: Award,
                                badge: "9.4/10 Score",
                                duration: "11s",
                              },
                              {
                                phase: "07",
                                title: "Valence Emotion Scoring",
                                desc: "Generated & ranked UGC hooks across 6 DTC frameworks",
                                color: "bg-cyan-500",
                                icon: HeartHandshake,
                                badge: "Top-K Ranked",
                                duration: "10s",
                              },
                              {
                                phase: "08",
                                title: "Prism Product Innovation",
                                desc: "Synthesized product specs, bundle stacking & retention hooks",
                                color: "bg-emerald-500",
                                icon: Sparkles,
                                badge: "Specs Verified",
                                duration: "9s",
                              },
                              {
                                phase: "09",
                                title: "Derja Teleprompter Writer",
                                desc: "Generated production-ready scripts in native Tunisian Arabic",
                                color: "bg-emerald-400",
                                icon: Send,
                                badge: "Teleprompter Ready",
                                duration: "11s",
                              },
                            ].map((item, idx) => {
                              const IconComponent = item.icon;
                              return (
                                <div key={item.phase} className="relative group">
                                  {/* Step Node Dot on the Rail */}
                                  <div className="absolute left-[-2.5rem] top-1/2 -translate-y-1/2 w-8 flex items-center justify-center">
                                    <div className="w-6.5 h-6.5 rounded-full bg-primary border-2 border-accent/60 flex items-center justify-center shadow-xs group-hover:scale-115 group-hover:border-accent transition-all shrink-0">
                                      <IconComponent className="w-3 h-3 text-accent" />
                                    </div>
                                  </div>

                                  {/* Step Row Card */}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 sm:px-3.5 sm:py-2.5 rounded-xl bg-secondary/4 hover:bg-secondary/8 border border-secondary/10 hover:border-accent/40 shadow-2xs hover:shadow-md transition-all">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <span className="text-[11px] font-mono font-bold text-accent shrink-0">
                                        P{item.phase}
                                      </span>
                                      <div className="flex items-center gap-2 min-w-0">
                                        <span className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
                                        <span className="text-xs font-bold text-secondary truncate">
                                          {item.title}
                                        </span>
                                        <span className="hidden md:inline text-secondary/30">•</span>
                                        <span className="hidden md:inline text-[11px] text-secondary/65 truncate">
                                          {item.desc}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pl-7 sm:pl-0">
                                      <span className="inline md:hidden text-[10px] text-secondary/65 truncate">
                                        {item.desc}
                                      </span>
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="text-[10px] font-mono text-secondary/50 hidden sm:inline">
                                          {item.duration}
                                        </span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-secondary/10 text-secondary/85 border border-secondary/15 flex items-center gap-1">
                                          <Check className="w-2.5 h-2.5 text-emerald-500" />
                                          {item.badge}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Sub-view: Strategy Dossier & Derja Scripts */
                      <div className="space-y-4">
                        {/* 3 Angle Tabs Selector */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {[
                            {
                              id: "pain",
                              title: "💥 1. Pain Agitation",
                              sub: "سياقة تونس ووجيعة الظهر",
                            },
                            {
                              id: "humor",
                              title: "😂 2. Everyday Relatable",
                              sub: "كرسي البيرو المنتهي صلاحيّتو",
                            },
                            {
                              id: "skeptic",
                              title: "🛡️ 3. Skeptic-Busting",
                              sub: "التجربة والبرهان الطبي",
                            },
                          ].map((tab) => (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setScriptAngle(tab.id as "pain" | "humor" | "skeptic")}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${scriptAngle === tab.id
                                ? "bg-accent/15 border-accent text-secondary shadow-xs"
                                : "bg-secondary/5 border-secondary/10 text-secondary/70 hover:border-secondary/20"
                                }`}
                            >
                              <span className="text-xs font-bold block">{tab.title}</span>
                              <span className="text-[10px] opacity-75 truncate block mt-0.5">
                                {tab.sub}
                              </span>
                            </button>
                          ))}
                        </div>

                        {/* Pipeline Intelligence Dossier Box */}
                        <div className="p-3 sm:p-3.5 rounded-2xl bg-secondary/5 border border-secondary/15 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                          <div>
                            <span className="text-[10px] text-secondary/50 uppercase font-bold block">
                              Cannes Engine Concept
                            </span>
                            <span className="font-semibold text-secondary truncate block mt-0.5">
                              {PRODUCT_STRATEGIST_SCRIPTS[scriptAngle].cannesConcept}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-secondary/50 uppercase font-bold block">
                              Valence Engine Zone
                            </span>
                            <span className="font-semibold text-secondary truncate block mt-0.5">
                              {PRODUCT_STRATEGIST_SCRIPTS[scriptAngle].valenceZone}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-secondary/50 uppercase font-bold block">
                              Prism Engine Lens
                            </span>
                            <span className="font-semibold text-secondary truncate block mt-0.5">
                              {PRODUCT_STRATEGIST_SCRIPTS[scriptAngle].prismLens}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-secondary/50 uppercase font-bold block">
                              Speaking Cadence
                            </span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400 truncate block mt-0.5">
                              ⚡ {PRODUCT_STRATEGIST_SCRIPTS[scriptAngle].cadence}
                            </span>
                          </div>
                        </div>

                        {/* Teleprompter Script Card */}
                        <div className="rounded-2xl border border-secondary/15 bg-primary/70 p-4 sm:p-5 space-y-3.5">
                          {/* Script Header Bar */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-secondary/10">
                            <div className="flex items-center gap-3">
                              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-secondary/20 shadow-sm shrink-0 bg-white dark:bg-secondary/10 flex items-center justify-center">
                                <Image
                                  src="/product.jpeg"
                                  alt="Orthopedic Lumbar Cushion"
                                  width={64}
                                  height={64}
                                  className="object-contain w-full h-full p-1 rounded-lg"
                                />
                              </div>
                              <div>
                                <h4 className="text-xs sm:text-sm font-bold text-secondary">
                                  {PRODUCT_STRATEGIST_SCRIPTS[scriptAngle].title}
                                </h4>
                                <span className="text-[11px] text-secondary/60 block">
                                  Teleprompter Output • Spoken Tunisian Arabic (Derja) • Calibrated for Product
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const fullScriptText = PRODUCT_STRATEGIST_SCRIPTS[scriptAngle].scenes
                                  .map((s) => `[${s.time} | ${s.cue}]\n${s.text}`)
                                  .join("\n\n");
                                handleCopyScript(fullScriptText);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-secondary/10 hover:bg-secondary/15 text-secondary text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-secondary/15 shadow-xs"
                            >
                              {copiedScript ? (
                                <>
                                  <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                                  <span className="text-emerald-500 font-bold">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy Derja Script</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Scene By Scene Teleprompter Body */}
                          <div className="space-y-3">
                            {PRODUCT_STRATEGIST_SCRIPTS[scriptAngle].scenes.map((scene, idx) => (
                              <div
                                key={idx}
                                className="p-3.5 rounded-xl bg-secondary/5 border border-secondary/10 hover:border-secondary/20 transition-all space-y-2"
                              >
                                <div className="flex items-center justify-between gap-2 text-[11px]">
                                  <span className="font-mono text-accent font-bold px-2 py-0.5 rounded bg-accent/10 border border-accent/15">
                                    ⏱️ {scene.time}
                                  </span>
                                  <span className="text-secondary/60 font-semibold truncate">
                                    🎬 {scene.cue}
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                    {scene.hookType}
                                  </span>
                                </div>
                                <p
                                  dir="rtl"
                                  className="text-sm sm:text-base leading-relaxed text-secondary/95 font-medium pt-1 font-sans"
                                  style={{ fontFamily: "'Noto Sans Arabic', system-ui, sans-serif" }}
                                >
                                  &quot;{scene.text}&quot;
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Quality Gates Assurance Footer */}
                          <div className="pt-3 border-t border-secondary/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span>100% Spoken Tunisian</span>
                            </div>
                            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                              <span>Arabizi Shield: 0% Latin</span>
                            </div>
                            <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent font-bold flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 shrink-0" />
                              <span>Cannes Calibrated (9+)</span>
                            </div>
                            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1.5">
                              <Zap className="w-3.5 h-3.5 shrink-0" />
                              <span>Teleprompter Ready</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 1. LEAD GENERATION AGENT PREVIEW */}
                {selectedAgent.id === "lead-agent" && (
                  <div>
                    {previewSubTab === "primary" ? (
                      <div className="space-y-3">
                        {/* Search & Location Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-secondary/5 border border-secondary/10">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-accent" />
                            <span className="text-xs font-bold text-secondary">
                              Search: Local businesses without a website
                            </span>
                          </div>
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            18 Verified Leads Found Today
                          </span>
                        </div>

                        {/* Spreadsheet Table Preview */}
                        <div className="overflow-x-auto rounded-2xl border border-secondary/15 bg-primary/40">
                          <table className="w-full min-w-135 text-left text-xs">
                            <thead>
                              <tr className="border-b border-secondary/10 bg-secondary/5 text-secondary/70 font-semibold">
                                <th className="py-2.5 px-3">Business Name</th>
                                <th className="py-2.5 px-3">Location / Address</th>
                                <th className="py-2.5 px-3">Phone Number</th>
                                <th className="py-2.5 px-3">Website Status</th>
                                <th className="py-2.5 px-3">Outreach Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary/10 text-secondary/90">
                              <tr className="hover:bg-secondary/5 transition-colors">
                                <td className="py-2.5 px-3 font-bold text-secondary flex items-center gap-1.5">
                                  🍕 Pizzeria Le Safran
                                </td>
                                <td className="py-2.5 px-3 text-secondary/70">
                                  Av. Hédi Nouira, Ennasr 2, Tunis
                                </td>
                                <td className="py-2.5 px-3 font-mono text-[11px]">
                                  71 889 420
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                                    No Website Found
                                  </span>
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                    WhatsApp Sent
                                  </span>
                                </td>
                              </tr>

                              <tr className="hover:bg-secondary/5 transition-colors">
                                <td className="py-2.5 px-3 font-bold text-secondary flex items-center gap-1.5">
                                  🔧 Auto Express Charguia
                                </td>
                                <td className="py-2.5 px-3 text-secondary/70">
                                  Z.I. Charguia 2, Tunis
                                </td>
                                <td className="py-2.5 px-3 font-mono text-[11px]">
                                  71 772 310
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                    Facebook Page Only
                                  </span>
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                    Gmail Offer Sent
                                  </span>
                                </td>
                              </tr>

                              <tr className="hover:bg-secondary/5 transition-colors">
                                <td className="py-2.5 px-3 font-bold text-secondary flex items-center gap-1.5">
                                  🦷 Cabinet Dentaire Dr. Amine Trabelsi
                                </td>
                                <td className="py-2.5 px-3 text-secondary/70">
                                  Les Berges du Lac 2, Tunis
                                </td>
                                <td className="py-2.5 px-3 font-mono text-[11px]">
                                  70 834 512
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                                    No Website Found
                                  </span>
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                    WhatsApp Sent
                                  </span>
                                </td>
                              </tr>

                              <tr className="hover:bg-secondary/5 transition-colors">
                                <td className="py-2.5 px-3 font-bold text-secondary flex items-center gap-1.5">
                                  💐 Fleuriste Jasmin de Carthage
                                </td>
                                <td className="py-2.5 px-3 text-secondary/70">
                                  Rue Habib Bourguiba, La Marsa
                                </td>
                                <td className="py-2.5 px-3 font-mono text-[11px]">
                                  71 742 660
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                                    No Website Found
                                  </span>
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-secondary/15 text-secondary/70 border border-secondary/20">
                                    Queued (Next)
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : previewSubTab === "secondary" ? (
                      /* Sub-view: WhatsApp Offer & AI Advice */
                      <div className="space-y-3">
                        {/* Message Bubble Preview */}
                        <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/15">
                          <div className="flex items-center justify-between mb-2 pb-2 border-b border-secondary/10">
                            <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
                              <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                              Sent via WhatsApp to Pizzeria Le Safran (98 234 890)
                            </span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                              Delivered &amp; Read
                            </span>
                          </div>
                          <div className="p-3.5 rounded-xl bg-primary/80 border border-secondary/10 text-xs text-secondary/90 leading-relaxed space-y-2">
                            <p>
                              &quot;Hello l&apos;équipe Pizzeria Le Safran ! 🍕 We noticed on Google Maps that you
                              don&apos;t have an online website or digital menu yet for your
                              restaurant in Ennasr 2.&quot;
                            </p>
                            <p>
                              &quot;We prepared a free 1-minute mobile menu preview for you to see how
                              convenient online ordering looks on a smartphone:{" "}
                              <span className="text-accent underline font-semibold">
                                moussaed.ai/preview/lesafran
                              </span>
                              . Would you like us to send it over?&quot;
                            </p>
                          </div>
                        </div>

                        {/* AI Advice & Growth Box */}
                        <div className="p-4 rounded-2xl bg-accent/10 border border-accent/25">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-accent" />
                            <h4 className="text-xs font-bold text-secondary">
                              AI Recommendation: How To Improve Your Offer
                            </h4>
                          </div>
                          <p className="text-xs text-secondary/80 leading-relaxed mb-2">
                            The agent collected reply data from your first 35 outreach messages:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            <div className="p-2.5 rounded-xl bg-primary/60 border border-secondary/10">
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">
                                📈 +42% Response Rate
                              </span>
                              <span className="text-secondary/70">
                                When offering a free 1-minute mobile preview link.
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-primary/60 border border-secondary/10">
                              <span className="font-bold text-accent block mb-0.5">
                                💬 WhatsApp Converted Best
                              </span>
                              <span className="text-secondary/70">
                                3.4x faster replies compared to standard cold email.
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Sub-view: Tunisie Freelance Auto-Bid & Dynamic Proposal Adaptation */
                      <div className="space-y-3">
                        {/* Live Missions Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-secondary/5 border border-secondary/10">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg overflow-hidden shrink-0 border border-secondary/10">
                              <Image
                                src="/integrations/tunisiefreelance.jpg"
                                alt="Tunisie Freelance"
                                width={24}
                                height={24}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-xs font-bold text-secondary">
                              Live Missions Stream: Full-Stack &amp; E-commerce Specialization
                            </span>
                          </div>
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            3 New Projects Matched Today
                          </span>
                        </div>

                        {/* Proposal Adaptation Split Card */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Client Mission Post */}
                          <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/15 space-y-3">
                            <div className="flex items-center justify-between border-b border-secondary/10 pb-2">
                              <span className="text-[11px] font-bold text-secondary flex items-center gap-1.5">
                                📌 Detected Offer #TF-9481
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                Budget: 1,800 TND
                              </span>
                            </div>
                            <div>
                              <h5 className="text-xs font-black text-secondary leading-snug">
                                &quot;Refonte Complète Site E-Commerce Next.js + Passerelle Konnect / Flouci&quot;
                              </h5>
                              <p className="text-[11px] text-secondary/70 leading-relaxed mt-1">
                                Client in Sousse looking for a modern reactive shop with high mobile speed, inventory sync, and Tunisian COD / Konnect payment integration.
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {["Next.js", "Konnect", "Flouci", "Tailwind", "Responsive"].map((tag) => (
                                <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-secondary/10 text-secondary/70 border border-secondary/10">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Dynamic AI Adapted Proposal */}
                          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/25 space-y-3">
                            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                ✨ AI Tailored Proposal Pitch (Auto-Adapted)
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                Match Score: 98%
                              </span>
                            </div>
                            <div className="p-3 rounded-xl bg-primary/70 border border-secondary/10 font-mono text-[11px] text-secondary leading-relaxed space-y-1.5">
                              <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                &quot;Bonjour, expert Next.js basé en Tunisie avec 12+ boutiques déployées avec Konnect &amp; Flouci.&quot;
                              </p>
                              <p className="text-secondary/80">
                                &quot;J&apos;ai analysé votre besoin de refonte à Sousse. Je propose une architecture 0ms de latence avec tunnel de commande optimisé pour le COD tunisien + démo live sous 48h.&quot;
                              </p>
                              <div className="pt-1.5 flex items-center justify-between text-[10px] text-secondary/60 border-t border-secondary/10">
                                <span>Bid: 1,650 TND • Delivery: 7 days</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">✓ Auto-Applied on Platform</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. SALES AGENT PREVIEW */}
                {selectedAgent.id === "sales-agent" && (
                  <div>
                    {previewSubTab === "primary" ? (
                      <div className="space-y-3">
                        {/* Active Channels Banner */}
                        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-secondary/5 border border-secondary/10">
                          <div className="flex items-center gap-2 text-xs font-bold text-secondary">
                            <MessageCircle className="w-4 h-4 text-emerald-500" />
                            <span>Connected: Instagram DM, WhatsApp Business &amp; Messenger</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                              <PhoneOff className="w-3 h-3" />
                              Phone Shield: Active
                            </span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary/80">
                              Catalog: 42 Products
                            </span>
                          </div>
                        </div>

                        {/* Live Chat Simulator with Staggered Bubble Pop Transitions */}
                        <div key={previewSubTab} className="rounded-2xl border border-secondary/15 bg-primary/50 p-4 space-y-3">
                          {/* 1. Customer Message */}
                          <div
                            className="flex items-start gap-2.5 max-w-[85%] chat-bubble-animate"
                            style={{ animationDelay: "150ms" }}
                          >
                            <div className="w-7 h-7 rounded-full bg-secondary/10 flex items-center justify-center text-xs font-bold shrink-0">
                              MB
                            </div>
                            <div className="p-3 rounded-2xl rounded-tl-sm bg-secondary/10 text-xs text-secondary leading-relaxed shadow-xs">
                              <p className="font-semibold text-[10px] text-secondary/60 mb-0.5">
                                Customer (Mariem) via Instagram
                              </p>
                              Hi! Do you have the Linen Casual Jacket in size M available?
                            </div>
                          </div>

                          {/* 2. Agent Reply */}
                          <div
                            className="flex items-start gap-2.5 max-w-[88%] ml-auto flex-row-reverse chat-bubble-animate"
                            style={{ animationDelay: "650ms" }}
                          >
                            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md">
                              AI
                            </div>
                            <div className="p-3 rounded-2xl rounded-tr-sm bg-accent text-white text-xs leading-relaxed shadow-md">
                              <p className="font-semibold text-[10px] text-white/70 mb-0.5">
                                Sales Agent (Instant • 1.4s)
                              </p>
                              Hey Mariem! 😊 Yes, we have 3 left in stock in Size M (89 DT)! If you
                              order right now, you get free delivery + 10% off with code{" "}
                              <span className="font-bold underline">SAVE10</span> (Total: 80 DT).
                              Would you like me to reserve one for you?
                            </div>
                          </div>

                          {/* 3. Customer Address Confirmation */}
                          <div
                            className="flex items-start gap-2.5 max-w-[85%] chat-bubble-animate"
                            style={{ animationDelay: "1250ms" }}
                          >
                            <div className="w-7 h-7 rounded-full bg-secondary/10 flex items-center justify-center text-xs font-bold shrink-0">
                              MB
                            </div>
                            <div className="p-3 rounded-2xl rounded-tl-sm bg-secondary/10 text-xs text-secondary leading-relaxed shadow-xs">
                              Yes please! Send to Mariem Ben Salem, Résidence Les Jardins, Ennasr 2, Ariana (22 841 905).
                            </div>
                          </div>

                          {/* 4. Agent Final Confirmation */}
                          <div
                            className="flex items-start gap-2.5 max-w-[88%] ml-auto flex-row-reverse chat-bubble-animate"
                            style={{ animationDelay: "1850ms" }}
                          >
                            <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md">
                              AI
                            </div>
                            <div className="p-3 rounded-2xl rounded-tr-sm bg-emerald-600 text-white text-xs leading-relaxed shadow-md">
                              Done Mariem! 🎉 Order #4192 is confirmed for 80 DT with free delivery.
                              Tracking details were sent via SMS. We are preparing it now!
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Sub-view: Verified Orders (Converty / Store) */
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                          <div className="flex items-center gap-2">
                            <PackageCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-xs font-bold text-secondary">
                              Automatic Order Upload: Synced with Converty &amp; Store CRM
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            100% Verified
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          <div className="p-3.5 rounded-2xl bg-secondary/5 border border-secondary/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-secondary">Order #4192</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                  Uploaded to Converty
                                </span>
                              </div>
                              <p className="text-xs text-secondary/70 mt-1">
                                Customer: Mariem Ben Salem • Linen Casual Jacket (M) • 80 DT
                              </p>
                              <p className="text-[11px] text-secondary/50 font-mono mt-0.5">
                                Address: Résidence Les Jardins, Ennasr 2, Ariana (Tél: 22 841 905)
                              </p>
                            </div>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                              ✅ Order Confirmed
                            </span>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-secondary/5 border border-secondary/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-secondary">Order #4191</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                  Order Synced
                                </span>
                              </div>
                              <p className="text-xs text-secondary/70 mt-1">
                                Customer: Mohamed Aziz Gharbi • Leather Wallet • 55 DT
                              </p>
                              <p className="text-[11px] text-secondary/50 font-mono mt-0.5">
                                Address: 28 Avenue de la Liberté, Lafayette, Tunis (Tél: 98 432 109)
                              </p>
                            </div>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                              ✅ Order Confirmed
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2.5 AUTO DM AGENT PREVIEW */}
                {selectedAgent.id === "auto-dm" && (
                  <div>
                    {previewSubTab === "primary" ? (
                      <div className="space-y-3">
                        {/* Top Performance Banner */}
                        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-accent/10 border border-accent/20">
                          <div className="flex items-center gap-2 text-xs font-bold text-secondary">
                            <Zap className="w-4 h-4 text-accent" />
                            <span>Zero-Cost ManyChat Alternative: Instagram Reels &amp; Posts</span>
                          </div>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent">
                            Latency: &lt; 350ms • Zero AI Cost
                          </span>
                        </div>

                        {/* Interactive Reel Comment to Instant DM Flow */}
                        <div key={previewSubTab} className="rounded-2xl border border-secondary/15 bg-primary/50 p-4 space-y-3">
                          {/* 1. Reel Context Header */}
                          <div className="p-3 rounded-xl bg-secondary/5 border border-secondary/10 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                              <span className="text-xs font-extrabold text-secondary">Instagram Reel #84102</span>
                              <span className="text-[10px] text-secondary/50 font-mono">Trigger: &quot;LINK&quot;</span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              100% Rule Deterministic
                            </span>
                          </div>

                          {/* 2. Follower Comment */}
                          <div
                            className="flex items-start gap-2.5 max-w-[85%] chat-bubble-animate"
                            style={{ animationDelay: "150ms" }}
                          >
                            <div className="w-7 h-7 rounded-full bg-accent/15 text-accent font-bold flex items-center justify-center text-xs shrink-0">
                              SA
                            </div>
                            <div className="p-3 rounded-2xl rounded-tl-sm bg-secondary/10 text-xs text-secondary leading-relaxed shadow-xs">
                              <p className="font-semibold text-[10px] text-secondary/60 mb-0.5">
                                @sarah_design commented on Reel
                              </p>
                              LINK please! Love the new collection 🔥
                            </div>
                          </div>

                          {/* 3. Instant Public Comment Reply */}
                          <div
                            className="flex items-start gap-2.5 max-w-[88%] ml-auto flex-row-reverse chat-bubble-animate"
                            style={{ animationDelay: "650ms" }}
                          >
                            <div className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-md">
                              DM
                            </div>
                            <div className="p-3 rounded-2xl rounded-tr-sm bg-accent/10 border border-accent/30 text-secondary text-xs leading-relaxed shadow-xs">
                              <span className="text-[10px] font-bold text-accent block mb-0.5">
                                Public Reply to @sarah_design:
                              </span>
                              Hey @sarah_design! ❤️ Check your direct inbox! We just sent you the direct link and special 15% discount code!
                            </div>
                          </div>

                          {/* 4. Instant Private Direct Message Dispatched */}
                          <div
                            className="flex items-start gap-2.5 max-w-[88%] ml-auto flex-row-reverse chat-bubble-animate"
                            style={{ animationDelay: "1200ms" }}
                          >
                            <div className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-md">
                              ⚡
                            </div>
                            <div className="p-3.5 rounded-2xl rounded-tr-sm bg-accent text-white text-xs leading-relaxed shadow-md space-y-1.5">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/80 block">
                                Private DM Delivered Instantly:
                              </span>
                              <p>
                                Hey Sarah! ✨ Here is the exact direct link to the Summer Linen Collection you asked about:
                              </p>
                              <div className="p-2 rounded-xl bg-black/25 font-mono text-[11px] underline">
                                https://yourbrand.shop/collections/summer?promo=INSTA15
                              </div>
                              <p className="text-[11px] text-white/90">
                                Use code <strong>INSTA15</strong> at checkout for 15% off + free express shipping!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Sub-view: Keyword & Message Rules */
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-secondary/5 border border-secondary/15">
                          <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-accent" />
                            <span className="text-xs font-bold text-secondary">
                              Rule Engine: Zero compute latency • Zero ManyChat contact fees
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-accent">
                            3 Rules Active
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {[
                            {
                              trigger: "LINK / LIEN",
                              post: "All Posts & Reels",
                              publicReply: "Sent to your DM! Check your requests inbox ❤️",
                              dmMessage: "Here is your VIP direct link with 15% off code: https://brand.tn/link",
                              stat: "1,248 DMs sent",
                            },
                            {
                              trigger: "PRIX / PRICE",
                              post: "Reel #84102 (Orthopedic Pillow)",
                              publicReply: "Sent you all pricing options in DM! ✨",
                              dmMessage: "The price is 69 DT (Duo pack at 119 DT). Order here: https://brand.tn/pillow",
                              stat: "842 DMs sent",
                            },
                            {
                              trigger: "GUIDE",
                              post: "Carousel #4109 (E-commerce Playbook)",
                              publicReply: "Your free PDF guide has been sent! Check DMs 📚",
                              dmMessage: "Download your free guide here: https://brand.tn/guide.pdf",
                              stat: "419 DMs sent",
                            },
                          ].map((rule, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-2xl bg-secondary/5 border border-secondary/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded-md bg-accent/15 text-accent text-[10px] font-black font-mono">
                                    Keyword: {rule.trigger}
                                  </span>
                                  <span className="text-[10px] text-secondary/50 font-medium">
                                    {rule.post}
                                  </span>
                                </div>
                                <p className="text-xs text-secondary/80 font-mono truncate max-w-md">
                                  DM: {rule.dmMessage}
                                </p>
                              </div>
                              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                {rule.stat}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. SMS DELIVERY AGENT PREVIEW */}
                {selectedAgent.id === "delivery-agent" && (
                  <div>
                    {previewSubTab === "primary" ? (
                      /* Sub-view: Live Automated SMS Timeline */
                      <div className="space-y-3">
                        <div className="p-3 rounded-2xl bg-secondary/5 border border-secondary/10 flex items-center justify-between">
                          <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
                            <Smartphone className="w-3.5 h-3.5 text-accent" />
                            Live Automated Customer SMS Timeline
                          </span>
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Order #TN-89241 Synced
                          </span>
                        </div>

                        {/* SMS Thread Simulation */}
                        <div className="space-y-2.5">
                          {/* Alert 1: Order Confirmed & Dispatched */}
                          <div className="p-3.5 rounded-2xl bg-secondary/5 border border-secondary/15 hover:border-secondary/30 transition-colors">
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-xs font-bold text-secondary">
                                  📦 Step 1: Dispatched from Warehouse
                                </span>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-secondary/50">
                                Yesterday, 14:20 • Delivered SMS
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-primary border border-secondary/10 font-mono text-[11px] text-secondary/90 leading-relaxed">
                              &quot;مرحباً محمد! تم تحضير وتغليف طلبيتك #TN-89241 من المتجر وتسليمها لشركة التوصيل Shipper.tn. يمكنك متابعة مسار الطرد هنا: moussaed.me/track/89241&quot;
                            </div>
                            <div className="flex items-center justify-between text-[10px] pt-2 mt-1 border-t border-secondary/10 text-secondary/50">
                              <span>Recipient: 98 *** 210</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCheck className="w-3.5 h-3.5" /> 100% Delivery Verified
                              </span>
                            </div>
                          </div>

                          {/* Alert 2: Out for Delivery with Driver Contact */}
                          <div className="p-3.5 rounded-2xl bg-secondary/5 border border-accent/25 hover:border-accent/40 transition-colors shadow-xs">
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                                <span className="text-xs font-bold text-secondary">
                                  🚚 Step 2: Out For Delivery (Today)
                                </span>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-accent">
                                Today, 09:45 • Real-Time Alert
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 font-mono text-[11px] text-secondary leading-relaxed">
                              &quot;عسلامة محمد! عامل التوصيل (أحمد) في طريقه إليك اليوم بين 11h و 14h في أريانة. الرجاء تجهيز 89 د.ت نقداً عند الاستلام COD. للاتصال بالسائق: 55 *** 890&quot;
                            </div>
                            <div className="flex items-center justify-between text-[10px] pt-2 mt-1 border-t border-secondary/10 text-secondary/50">
                              <span>Customer Action: Confirmed Availability</span>
                              <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" /> Return Risk Reduced by 85%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Sub-view: Courier Sync & Return Metrics */
                      <div className="space-y-3">
                        <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/15 space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-secondary/10">
                            <div className="flex items-center gap-2">
                              <Truck className="w-4 h-4 text-accent" />
                              <span className="text-xs font-bold text-secondary">
                                Real-Time Courier Sync &amp; Dispatch Status
                              </span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                              Connected to Shipper.tn &amp; TikTak Pro
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div className="p-3 rounded-xl bg-primary/70 border border-secondary/10 text-center space-y-0.5">
                              <span className="text-[10px] font-bold text-secondary/50 uppercase tracking-wider block">
                                Failed Delivery Rate
                              </span>
                              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 block">
                                -38.4%
                              </span>
                              <span className="text-[10px] text-secondary/60">
                                Slashed with pre-delivery SMS
                              </span>
                            </div>

                            <div className="p-3 rounded-xl bg-primary/70 border border-secondary/10 text-center space-y-0.5">
                              <span className="text-[10px] font-bold text-secondary/50 uppercase tracking-wider block">
                                SMS Dispatch Speed
                              </span>
                              <span className="text-lg font-black text-secondary block">
                                &lt; 1.8s
                              </span>
                              <span className="text-[10px] text-secondary/60">
                                Instant trigger on webhook
                              </span>
                            </div>

                            <div className="p-3 rounded-xl bg-primary/70 border border-secondary/10 text-center space-y-0.5">
                              <span className="text-[10px] font-bold text-secondary/50 uppercase tracking-wider block">
                                COD Collection Rate
                              </span>
                              <span className="text-lg font-black text-accent block">
                                94.2%
                              </span>
                              <span className="text-[10px] text-secondary/60">
                                Cash-ready customers
                              </span>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-primary/70 border border-secondary/10 space-y-2">
                            <span className="text-xs font-bold text-secondary block">
                              Supported E-commerce &amp; Logistics Pipelines
                            </span>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-secondary/70">
                              <span className="px-2 py-0.5 rounded-md bg-secondary/10 font-mono">YouCan</span>
                              <span className="px-2 py-0.5 rounded-md bg-secondary/10 font-mono">Converty</span>
                              <span className="px-2 py-0.5 rounded-md bg-secondary/10 font-mono">Shipper.tn</span>
                              <span className="px-2 py-0.5 rounded-md bg-secondary/10 font-mono">TikTak Pro</span>
                              <span className="px-2 py-0.5 rounded-md bg-secondary/10 font-mono">Ecomness</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 6. NEWS AGENT PREVIEW */}
                {selectedAgent.id === "news-agent" && (
                  <div>
                    {previewSubTab === "primary" ? (
                      /* Sub-view: 3-Point Actionable Briefing */
                      <div className="space-y-3">
                        <div className="p-3 rounded-2xl bg-secondary/5 border border-secondary/10 flex items-center justify-between">
                          <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
                            <Newspaper className="w-3.5 h-3.5 text-accent" />
                            Live 3-Point Industry Briefing
                          </span>
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Internet Noise Filtered (99.4%)
                          </span>
                        </div>

                        {/* Direct 3-Point Briefing Card */}
                        <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/15 space-y-3.5">
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-secondary/10">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400">
                                High-Impact Development
                              </span>
                              <span className="text-xs font-bold text-secondary">
                                Fintech &amp; Payment Gateway Tariff Changes
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-secondary/50">
                              Synced 8m ago • Routine Briefing
                            </span>
                          </div>

                          <div className="space-y-2.5">
                            {/* Point 1: What Happened */}
                            <div className="p-3 rounded-xl bg-primary/70 border border-secondary/10 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-black">
                                  1
                                </span>
                                <span className="text-xs font-bold text-secondary">
                                  What Happened
                                </span>
                              </div>
                              <p className="text-xs text-secondary/80 pl-7 leading-relaxed">
                                Regional payment processors announced an updated fee structure taking effect on the 1st of next month, reducing online debit transaction fees while revising chargeback review windows.
                              </p>
                            </div>

                            {/* Point 2: Why It Matters */}
                            <div className="p-3 rounded-xl bg-primary/70 border border-secondary/10 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center text-[10px] font-black">
                                  2
                                </span>
                                <span className="text-xs font-bold text-secondary">
                                  Why It Matters To Your Business
                                </span>
                              </div>
                              <p className="text-xs text-secondary/80 pl-7 leading-relaxed">
                                Lowers your net merchant processing overhead by ~0.45% on high-volume products, but requires updating dispute response deadlines to 48 hours to avoid penalty fees.
                              </p>
                            </div>

                            {/* Point 3: Immediate Action */}
                            <div className="p-3 rounded-xl bg-accent/10 border border-accent/25 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-black">
                                  3
                                </span>
                                <span className="text-xs font-bold text-secondary">
                                  Immediate Action To Take
                                </span>
                              </div>
                              <p className="text-xs text-secondary/90 pl-7 font-medium leading-relaxed">
                                Adjust your store checkout fee rules before the 28th and assign priority email alerts for inbound payment dispute tickets.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Sub-view: Critical Alert & Messaging Dispatch */
                      <div className="space-y-3">
                        <div className="p-3 rounded-2xl bg-secondary/5 border border-secondary/10 flex items-center justify-between">
                          <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
                            <Bell className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
                            Instant Multi-Channel Emergency Dispatch
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
                            Instant Critical Alert Triggered
                          </span>
                        </div>

                        {/* Simulation of Urgent Message Received on Preferred Channel */}
                        <div className="p-3.5 rounded-2xl bg-secondary/5 border border-rose-500/25 hover:border-rose-500/40 transition-colors shadow-xs space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                              <span className="text-xs font-bold text-secondary flex items-center gap-1">
                                🚨 Urgent Regulatory Notice (Customs &amp; Tariffs)
                              </span>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-rose-500">
                              Instant Alert • Delivered to User
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-primary border border-secondary/10 font-mono text-[11px] text-secondary leading-relaxed space-y-1.5">
                            <p className="font-bold text-rose-600 dark:text-rose-400">
                              ⚠️ NEWS AGENT CRITICAL NOTIFICATION:
                            </p>
                            <p>
                              &quot;New tariff circular published by Ministry of Trade regarding imported electronic accessories and components starting Monday. Immediate adjustment to landed cost pricing recommended.&quot;
                            </p>
                            <div className="pt-1.5 border-t border-secondary/10 flex flex-wrap items-center justify-between gap-1 text-[10px] text-secondary/60">
                              <span>Dispatched via Preferred Channel (WhatsApp / Telegram / SMS)</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ User Alerted Instantly</span>
                            </div>
                          </div>
                        </div>

                        {/* Routine Briefing Settings Card */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div className="p-3 rounded-xl bg-primary/70 border border-secondary/10 space-y-1">
                            <span className="text-[10px] font-bold text-secondary/50 uppercase tracking-wider block">
                              Emergency Mode
                            </span>
                            <span className="text-xs font-bold text-secondary block">
                              Immediate Push Alert
                            </span>
                            <p className="text-[11px] text-secondary/70">
                              Breaks through schedule to warn you of severe industry, regulatory, or competitor shocks.
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-primary/70 border border-secondary/10 space-y-1">
                            <span className="text-[10px] font-bold text-secondary/50 uppercase tracking-wider block">
                              Periodic Routine Mode
                            </span>
                            <span className="text-xs font-bold text-secondary block">
                              Concise Periodic Briefing
                            </span>
                            <p className="text-[11px] text-secondary/70">
                              Bundles routine market shifts into an easy 3-point briefing delivered at your preferred hour.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 7. LIVE CATCH AGENT PREVIEW */}
                {selectedAgent.id === "live-catch" && (
                  <div>
                    {previewSubTab === "primary" ? (
                      /* Sub-view: Live Comment Stream & Auto-Extraction */
                      <div className="space-y-3">
                        {/* Stream Status Banner */}
                        <div className="p-3 rounded-2xl bg-secondary/5 border border-secondary/10 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                            </span>
                            <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
                              <Radio className="w-3.5 h-3.5 text-rose-500" />
                              Facebook Live Stream: Active (1.8K Viewers)
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
                              ⚡ 0s Extraction Latency
                            </span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              Anti-Theft Active
                            </span>
                          </div>
                        </div>

                        {/* Live Feed & Auto-Captured Order Split */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                          {/* Left Column: Live Incoming Facebook Comments */}
                          <div className="lg:col-span-6 p-3.5 rounded-2xl bg-secondary/5 border border-secondary/15 space-y-2.5">
                            <div className="flex items-center justify-between pb-2 border-b border-secondary/10">
                              <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
                                <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                                Live Incoming Comments (Real-time Stream)
                              </span>
                              <span className="text-[10px] font-mono text-secondary/60">
                                Real-Time Feed
                              </span>
                            </div>

                            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                              {/* Comment 1: Detected & Hidden */}
                              <div className="p-2.5 rounded-xl bg-primary border border-secondary/10 space-y-1 relative group">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                                      ST
                                    </div>
                                    <span className="text-xs font-bold text-secondary">
                                      Sami Trabelsi
                                    </span>
                                  </div>
                                  <span className="text-[9px] font-mono text-secondary/40">
                                    8s ago
                                  </span>
                                </div>
                                <p className="text-xs text-secondary/80 font-medium">
                                  I want one unit of the Blue Serum, call me at{" "}
                                  <span className="font-bold text-rose-500 bg-rose-500/10 px-1 rounded">
                                    24 550 812
                                  </span>{" "}
                                  Tunis Ennasr 2
                                </p>
                                <div className="pt-1 flex items-center justify-between text-[10px]">
                                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                    <EyeOff className="w-3 h-3 text-emerald-500" />
                                    Comment auto-hidden from viewers
                                  </span>
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-accent/15 text-accent">
                                    Captured Order
                                  </span>
                                </div>
                              </div>

                              {/* Comment 2: Worded Phone Number Extraction */}
                              <div className="p-2.5 rounded-xl bg-primary border border-secondary/10 space-y-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center">
                                      MB
                                    </div>
                                    <span className="text-xs font-bold text-secondary">
                                      Mariem Ben Salah
                                    </span>
                                  </div>
                                  <span className="text-[9px] font-mono text-secondary/40">
                                    24s ago
                                  </span>
                                </div>
                                <p className="text-xs text-secondary/80 font-medium">
                                  Put me down for 2 large pieces, my number is{" "}
                                  <span className="font-bold text-rose-500 bg-rose-500/10 px-1 rounded">
                                    fifty-five 410 nine hundred and one
                                  </span>{" "}
                                  Sousse Khezama
                                </p>
                                <div className="pt-1 flex items-center justify-between text-[10px]">
                                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                    <EyeOff className="w-3 h-3 text-emerald-500" />
                                    Decoded spelled number &amp; auto-hidden
                                  </span>
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-accent/15 text-accent">
                                    Captured Order
                                  </span>
                                </div>
                              </div>

                              {/* Comment 3: General Question (No Order) */}
                              <div className="p-2.5 rounded-xl bg-primary/60 border border-secondary/5 opacity-75 space-y-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-secondary/20 text-secondary font-bold text-[10px] flex items-center justify-center">
                                      KJ
                                    </div>
                                    <span className="text-xs font-bold text-secondary">
                                      Karim Jaziri
                                    </span>
                                  </div>
                                  <span className="text-[9px] font-mono text-secondary/40">
                                    1m ago
                                  </span>
                                </div>
                                <p className="text-xs text-secondary/70">
                                  How much is shipping to Sfax please?
                                </p>
                                <div className="text-[10px] text-secondary/50">
                                  General question • No phone number detected
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Auto-Organized Orders Database */}
                          <div className="lg:col-span-6 p-3.5 rounded-2xl bg-secondary/5 border border-secondary/15 space-y-2.5 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between pb-2 border-b border-secondary/10">
                                <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
                                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                                  Structured Order Database
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                  Ready to Confirm &amp; Ship
                                </span>
                              </div>

                              <div className="mt-2 space-y-2">
                                <div className="p-2.5 rounded-xl bg-primary border border-secondary/10 space-y-1 text-xs">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-secondary">#ORD-9081 • Sami Trabelsi</span>
                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                                      ✓ Valid Format
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 text-[11px] text-secondary/70">
                                    <div>📞 Phone: <span className="font-semibold text-secondary">24550812</span></div>
                                    <div>📍 City: <span className="font-semibold text-secondary">Tunis (Ennasr 2)</span></div>
                                    <div>📦 Product: <span className="font-semibold text-secondary">Blue Serum (1x)</span></div>
                                    <div>🕒 Time: <span className="font-semibold text-secondary">20:41:14</span></div>
                                  </div>
                                </div>

                                <div className="p-2.5 rounded-xl bg-primary border border-secondary/10 space-y-1 text-xs">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-secondary">#ORD-9082 • Mariem Ben Salah</span>
                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                                      ✓ Decoded Digits
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 text-[11px] text-secondary/70">
                                    <div>📞 Phone: <span className="font-semibold text-secondary">55410901</span></div>
                                    <div>📍 City: <span className="font-semibold text-secondary">Sousse (Khezama)</span></div>
                                    <div>📦 Product: <span className="font-semibold text-secondary">Large Serum (2x)</span></div>
                                    <div>🕒 Time: <span className="font-semibold text-secondary">20:41:30</span></div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-secondary/10 flex items-center justify-between text-[11px]">
                              <span className="text-secondary/70">Instant Sync: Converty &amp; Store CRM</span>
                              <span className="text-accent font-bold">Fulfillment Ready 🚀</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Sub-view: Public & Private Messenger Replies + Privacy Settings */
                      <div className="space-y-3">
                        <div className="p-3 rounded-2xl bg-secondary/5 border border-secondary/10 flex items-center justify-between">
                          <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-accent" />
                            Multi-Layer Response &amp; Anti-Spam Pipeline
                          </span>
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            24-Hour Messaging Window Opened
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* 1. Public Comment Reply */}
                          <div className="p-3.5 rounded-2xl bg-secondary/5 border border-secondary/15 space-y-2.5">
                            <div className="flex items-center justify-between pb-1.5 border-b border-secondary/10">
                              <span className="text-xs font-bold text-secondary flex items-center gap-1">
                                <MessageSquare className="w-3.5 h-3.5 text-accent" />
                                1. Public Comment Reply
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                Toggle ON
                              </span>
                            </div>

                            <div className="p-3 rounded-xl bg-primary border border-secondary/10 space-y-2 text-xs">
                              <span className="text-[10px] font-bold text-secondary/60 block uppercase">
                                Response Template:
                              </span>
                              <p className="text-secondary/90 leading-relaxed font-medium bg-secondary/5 p-2 rounded-lg">
                                &quot;Hi Sami, your order has been registered successfully! Check your Messenger DMs to confirm the final details.&quot;
                              </p>
                              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] text-secondary/70">
                                <div>⏱️ Random Delay: <span className="font-bold text-secondary">2 - 5 seconds</span></div>
                                <div>🔀 Text Variations: <span className="font-bold text-secondary">3 Spintax Forms</span></div>
                              </div>
                            </div>
                          </div>

                          {/* 2. Private Reply via Messenger */}
                          <div className="p-3.5 rounded-2xl bg-secondary/5 border border-secondary/15 space-y-2.5">
                            <div className="flex items-center justify-between pb-1.5 border-b border-secondary/10">
                              <span className="text-xs font-bold text-secondary flex items-center gap-1">
                                <Send className="w-3.5 h-3.5 text-blue-500" />
                                2. Private Messenger Reply
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400">
                                Instant Close
                              </span>
                            </div>

                            <div className="p-3 rounded-xl bg-primary border border-secondary/10 space-y-2 text-xs">
                              <span className="text-[10px] font-bold text-secondary/60 block uppercase">
                                Instant Private DM:
                              </span>
                              <p className="text-secondary/90 leading-relaxed font-medium bg-secondary/5 p-2 rounded-lg">
                                &quot;Welcome Sami! We captured your order from the live showcase. Please confirm your exact city and address so we can prepare your parcel right away.&quot;
                              </p>
                              <div className="flex items-center gap-2 pt-1">
                                <span className="px-2.5 py-1 rounded-lg bg-accent text-white font-bold text-[11px] shadow-xs cursor-pointer">
                                  ✓ Confirm Order
                                </span>
                                <span className="px-2.5 py-1 rounded-lg bg-secondary/10 text-secondary font-bold text-[11px] cursor-pointer">
                                  ✏️ Edit Quantity
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Safety & Compliance Controls Card */}
                        <div className="p-3.5 rounded-2xl bg-secondary/5 border border-secondary/15 space-y-2">
                          <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            3. Safety, Compliance &amp; Customer Privacy Controls
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            <div className="p-2.5 rounded-xl bg-primary/70 border border-secondary/10 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-secondary flex items-center gap-1">
                                  <EyeOff className="w-3.5 h-3.5 text-rose-500" />
                                  Auto-Hide Comment
                                </span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                  Active
                                </span>
                              </div>
                              <p className="text-[11px] text-secondary/70 leading-relaxed">
                                Once a phone number is detected, the agent immediately hides the comment from other viewers to prevent competitors from scraping client numbers, keeping it visible only to the author.
                              </p>
                            </div>

                            <div className="p-2.5 rounded-xl bg-primary/70 border border-secondary/10 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-secondary flex items-center gap-1">
                                  <Phone className="w-3.5 h-3.5 text-blue-500" />
                                  Phone Validation Filter
                                </span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                  8-Digit Strict
                                </span>
                              </div>
                              <p className="text-[11px] text-secondary/70 leading-relaxed">
                                The agent will only trigger automated replies when a legitimate phone format is validated, preventing false triggers on comments without actual contact data.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ADS SHIELD AGENT PREVIEW */}
                {selectedAgent.id === "ads-shield" && (
                  <div>
                    {previewSubTab === "primary" ? (
                      /* Sub-view: Real-Time Ads Moderation & Toxicity Filter */
                      <div className="space-y-4">
                        {/* Live Status Header */}
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-secondary/5 border border-secondary/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                              <Shield className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs sm:text-sm font-extrabold text-secondary">
                                  Meta Ads Comment Guard Active
                                </h4>
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Real-Time &lt; 800ms
                                </span>
                              </div>
                              <p className="text-[11px] text-secondary/60">
                                Filtering toxic insults, scam accusations, competitor links &amp; protecting customer privacy.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="px-2.5 py-1 rounded-xl bg-secondary/10 border border-secondary/15 text-[10px] font-bold text-secondary">
                              🛡️ 48 Comments Inspected Today
                            </span>
                          </div>
                        </div>

                        {/* Interactive Moderated Feed */}
                        <div className="space-y-2.5">
                          <span className="text-[11px] font-bold text-secondary/70 uppercase tracking-wider block">
                            Recent Ad Comments &amp; AI Actions:
                          </span>

                          {/* Item 1: Competitor Link & Troll - AUTO-HIDDEN */}
                          <div className="p-3.5 rounded-2xl bg-secondary/4 border border-rose-500/25 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-rose-500/15 text-rose-500 font-bold text-[10px] flex items-center justify-center">
                                  TR
                                </div>
                                <span className="text-xs font-bold text-secondary">@competitor_bot99</span>
                                <span className="text-[10px] text-secondary/40 font-mono">1m ago</span>
                              </div>
                              <span className="px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-500/30 flex items-center gap-1">
                                <EyeOff className="w-3 h-3" /> Auto-Hidden (Competitor Scam)
                              </span>
                            </div>
                            <p className="text-xs text-secondary/80 bg-secondary/5 p-2 rounded-xl font-mono text-[11px] line-through decoration-rose-500">
                              &quot;Don&apos;t buy here, it is a scam! The same watch is sold on fake-deals.tn for 29 DT! Check link: bit.ly/promo&quot;
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-secondary/60 pt-1">
                              <span>Action: Comment hidden instantly from public view (<span className="text-emerald-500 font-bold">420ms</span>)</span>
                              <span className="text-emerald-500 font-bold">✓ Conversion Protected</span>
                            </div>
                          </div>

                          {/* Item 2: Customer Privacy Protection (Phone + Address in Comments) - AUTO-HIDDEN */}
                          <div className="p-3.5 rounded-2xl bg-secondary/4 border border-blue-500/25 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-blue-500/15 text-blue-500 font-bold text-[10px] flex items-center justify-center">
                                  KM
                                </div>
                                <span className="text-xs font-bold text-secondary">Karim Mansour</span>
                                <span className="text-[10px] text-secondary/40 font-mono">3m ago</span>
                              </div>
                              <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-500/30 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Privacy Shield Active
                              </span>
                            </div>
                            <p className="text-xs text-secondary/80 bg-secondary/5 p-2 rounded-xl text-[11px]">
                              &quot;I want size 43 black please. My number is 98 412 309, send it to Nabeul center.&quot;
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-secondary/60 pt-1">
                              <span>Action: Auto-hidden to protect buyer from predatory competitor calls &amp; order theft</span>
                              <span className="text-blue-500 font-bold">✓ Logged to Orders CRM</span>
                            </div>
                          </div>

                          {/* Item 3: Legitimate Inquiry (Delivery Delay) - TRIAGED & REPLIED */}
                          <div className="p-3.5 rounded-2xl bg-secondary/4 border border-emerald-500/25 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-500 font-bold text-[10px] flex items-center justify-center">
                                  SL
                                </div>
                                <span className="text-xs font-bold text-secondary">Sarra Larbi</span>
                                <span className="text-[10px] text-secondary/40 font-mono">7m ago</span>
                              </div>
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Diplomatic Reply Sent
                              </span>
                            </div>
                            <p className="text-xs text-secondary/80 bg-secondary/5 p-2 rounded-xl text-[11px]">
                              &quot;Ordered 3 days ago, is the delivery delayed or still on the way?&quot;
                            </p>
                            <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 space-y-1">
                              <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">
                                AI Diplomatic Response (Public Reassurance):
                              </span>
                              <p className="text-[11px] text-secondary font-medium leading-relaxed">
                                &quot;Hello Sarra! Thank you for trusting us. Your package was dispatched this morning with our courier and will reach you within 24-48 hours. We also sent you the live tracking link via SMS!&quot;
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Sub-view: Smart Inquiry Triage & Merchant Alerts */
                      <div className="space-y-4">
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-secondary/5 border border-secondary/15 space-y-2">
                          <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
                            <SlidersHorizontal className="w-3.5 h-3.5 text-accent" />
                            Multi-Level Semantic Filter Sensitivity
                          </span>
                          <p className="text-[11px] text-secondary/70 leading-relaxed">
                            Fine-tune the autonomous filter to match your brand tone, legal policies, and competitor protection standards.
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                            <div className="p-3 rounded-xl bg-primary/70 border border-secondary/10 space-y-1">
                              <span className="text-[11px] font-bold text-secondary flex items-center gap-1">
                                <EyeOff className="w-3.5 h-3.5 text-rose-500" />
                                Competitor Links &amp; Spam
                              </span>
                              <p className="text-[10px] text-secondary/60">
                                100% Instant Auto-Hide without human delay.
                              </p>
                            </div>
                            <div className="p-3 rounded-xl bg-primary/70 border border-secondary/10 space-y-1">
                              <span className="text-[11px] font-bold text-secondary flex items-center gap-1">
                                <Shield className="w-3.5 h-3.5 text-blue-500" />
                                Phone Numbers &amp; Private Data
                              </span>
                              <p className="text-[10px] text-secondary/60">
                                Auto-hidden &amp; routed into CRM immediately.
                              </p>
                            </div>
                            <div className="p-3 rounded-xl bg-primary/70 border border-secondary/10 space-y-1">
                              <span className="text-[11px] font-bold text-secondary flex items-center gap-1">
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                                Negative Objections
                              </span>
                              <p className="text-[10px] text-secondary/60">
                                Reassuring public reply + Telegram/WhatsApp alert.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Merchant Notification Simulation */}
                        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                              <AlertTriangle className="w-4 h-4 text-amber-500" />
                              Instant Merchant Alert Trigger
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300">
                              WhatsApp / Telegram Dispatch
                            </span>
                          </div>
                          <p className="text-[11px] text-secondary/80 leading-relaxed font-mono bg-primary/60 p-2.5 rounded-xl border border-secondary/10">
                            &quot;[Alert Ads Shield]: Ad campaign &apos;Summer Promo Shoes&apos; received 3 comments claiming package delay from Governorates of Gabes. Diplomatic replies dispatched. Check logistics partner!&quot;
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* CREATIVE ENGINE AGENT PREVIEW */}
                {selectedAgent.id === "creative-engine" && (
                  <div>
                    {previewSubTab === "primary" ? (
                      /* Sub-view: Script-to-Video Pipeline (Higgsfield Engine) */
                      <div className="space-y-4">
                        {/* Live Production Header */}
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-secondary/5 border border-secondary/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0">
                              <Film className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs sm:text-sm font-extrabold text-secondary">
                                  Higgsfield Generative Diffusion Pipeline
                                </h4>
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Active • &lt; 90s Render
                                </span>
                              </div>
                              <p className="text-[11px] text-secondary/60">
                                Autonomous script execution, kinetic neon typography, and high-converting hook variations.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-600 dark:text-purple-400">
                              ⚡ 4 Drops Scheduled Today
                            </span>
                          </div>
                        </div>

                        {/* Interactive Video Render Feed */}
                        <div className="space-y-2.5">
                          <span className="text-[11px] font-bold text-secondary/70 uppercase tracking-wider block">
                            Recent Production Queue &amp; Media Assets:
                          </span>

                          {/* Video Item 1: UGC Ad Rendering */}
                          <div className="p-3.5 rounded-2xl bg-secondary/4 border border-purple-500/25 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-purple-500/15 text-purple-500 font-bold text-[10px] flex items-center justify-center">
                                  <Film className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs font-bold text-secondary">Summer Linen Shirt — Street Agitation</span>
                                <span className="text-[10px] text-secondary/40 font-mono">UGC Ad • 9:16</span>
                              </div>
                              <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-600 dark:text-purple-400 text-[10px] font-bold border border-purple-500/30 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 animate-pulse" /> Rendering 74%
                              </span>
                            </div>
                            <p className="text-xs text-secondary/80 bg-secondary/5 p-2 rounded-xl font-mono text-[11px]">
                              Hook: &quot;Stop wearing synthetic shirts that trap sweat in 40° heat...&quot;
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-secondary/60 pt-1">
                              <span>Engine: Higgsfield AI generative camera motion + Dynamic Neon Pop captions</span>
                              <span className="text-purple-500 font-bold">~25s remaining</span>
                            </div>
                          </div>

                          {/* Video Item 2: Ready Asset */}
                          <div className="p-3.5 rounded-2xl bg-secondary/4 border border-emerald-500/25 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-500 font-bold text-[10px] flex items-center justify-center">
                                  <Video className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs font-bold text-secondary">Orthopedic Lumbar Cushion — Traffic Problem</span>
                                <span className="text-[10px] text-secondary/40 font-mono">UGC Ad • 9:16</span>
                              </div>
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Ready in Media Library
                              </span>
                            </div>
                            <p className="text-xs text-secondary/80 bg-secondary/5 p-2 rounded-xl text-[11px]">
                              Hook: &quot;If you spend 2+ hours daily in traffic and arrive home with broken back...&quot;
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-secondary/60 pt-1">
                              <span>Captions: Tunisian Derja kinetic subtitles • 1080x1920 MP4</span>
                              <span className="text-emerald-500 font-bold">✓ Direct Ad Push Ready</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Sub-view: Ad Manager Auto-Sync & Drop Schedules */
                      <div className="space-y-4">
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-secondary/5 border border-secondary/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0">
                              <Share2 className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs sm:text-sm font-extrabold text-secondary">
                                  Direct Ad Manager Sync
                                </h4>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                                  Meta &amp; TikTok Connected
                                </span>
                              </div>
                              <p className="text-[11px] text-secondary/60">
                                Choose between saving as pending drafts for team review or auto-publishing directly to live ad sets.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Distribution Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-4 rounded-2xl bg-secondary/4 border border-secondary/15 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-secondary">Meta Ads Manager</span>
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                                Live Sync
                              </span>
                            </div>
                            <p className="text-[11px] text-secondary/70">
                              Dispatches 9:16 vertical video assets directly into your active Advantage+ ad sets or draft review folders.
                            </p>
                            <span className="text-[10px] text-accent font-semibold block">
                              • Instagram Reels &amp; Stories Target
                            </span>
                          </div>

                          <div className="p-4 rounded-2xl bg-secondary/4 border border-secondary/15 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-secondary">Generation Frequency</span>
                              <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-600 dark:text-purple-400 text-[10px] font-bold">
                                4 Drops / Day
                              </span>
                            </div>
                            <p className="text-[11px] text-secondary/70">
                              Autonomous production drops scheduled across peak buyer hours (Morning, Midday, Peak Evening, Night).
                            </p>
                            <span className="text-[10px] text-purple-500 font-semibold block">
                              • Zero manual intervention needed
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* OLD CLIENTS AGENT PREVIEW */}
                {selectedAgent.id === "old-clients" && (
                  <div>
                    {previewSubTab === "primary" ? (
                      /* Sub-view: Lifecycle Triggers & WhatsApp Pitch Generation */
                      <div className="space-y-4">
                        {/* Header Stats */}
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-secondary/5 border border-secondary/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-600/30 flex items-center justify-center shrink-0">
                              <RotateCcw className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs sm:text-sm font-extrabold text-secondary">
                                  Zero CAC Re-Engagement Active
                                </h4>
                                <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                                  Pure Profit Pipeline
                                </span>
                              </div>
                              <p className="text-[11px] text-secondary/60">
                                Monitored across 340+ past customers with automated 30, 45, and 60-day WhatsApp triggers.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              +34.2% Repeat Rate
                            </span>
                          </div>
                        </div>

                        {/* Customer Re-Engagement Scenarios */}
                        <div className="space-y-2.5">
                          <span className="text-[11px] font-bold text-secondary/70 uppercase tracking-wider block">
                            Live Context-Aware Re-engagement Triggers:
                          </span>

                          {/* Scenario 1: Cross-sell based on past purchase (Athletic Shoes -> Matching Gym Shirt) */}
                          <div className="p-3.5 rounded-2xl bg-secondary/4 border border-secondary/15 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-accent/15 text-accent font-bold text-xs flex items-center justify-center">
                                  YM
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-secondary">Youssef Meddeb</span>
                                  <span className="text-[10px] text-secondary/50 block">Purchased: Running Pro Sneakers • 30 days ago</span>
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded-md bg-accent/15 text-accent text-[10px] font-bold">
                                Trigger: 30-Day Cross-Sell
                              </span>
                            </div>

                            <div className="p-3 rounded-xl bg-primary border border-secondary/10 space-y-1.5 text-xs">
                              <span className="text-[10px] font-bold text-secondary/60 block uppercase">
                                Context-Aware WhatsApp Message:
                              </span>
                              <p className="text-secondary/90 leading-relaxed font-medium bg-secondary/5 p-2 rounded-lg">
                                &quot;Hello Youssef! We hope your Running Pro sneakers are keeping you comfortable. We just received our new breathable quick-dry athletic tees matching your shoe colors, and we created a 15% VIP loyalty discount code just for you today: <strong className="text-accent font-bold">VIP-LOYAL-15</strong>.&quot;
                              </p>
                              <div className="flex items-center justify-between pt-1 text-[11px]">
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Customer Clicked Link &amp; Re-ordered</span>
                                <span className="font-mono text-secondary/60">CAC: 0.00 DT</span>
                              </div>
                            </div>
                          </div>

                          {/* Scenario 2: Consumable Replenishment (Hyaluronic Serum / Perfumes -> 45 Days) */}
                          <div className="p-3.5 rounded-2xl bg-secondary/4 border border-secondary/15 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-pink-500/15 text-pink-500 font-bold text-xs flex items-center justify-center">
                                  AB
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-secondary">Amira Bouazizi</span>
                                  <span className="text-[10px] text-secondary/50 block">Purchased: 50ml Pure Hyaluronic Acid Serum • 45 days ago</span>
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded-md bg-pink-500/15 text-pink-600 dark:text-pink-400 text-[10px] font-bold">
                                Trigger: Consumable Refill (45d)
                              </span>
                            </div>

                            <div className="p-3 rounded-xl bg-primary border border-secondary/10 space-y-1.5 text-xs">
                              <span className="text-[10px] font-bold text-secondary/60 block uppercase">
                                Autonomous Replenishment Notification:
                              </span>
                              <p className="text-secondary/90 leading-relaxed font-medium bg-secondary/5 p-2 rounded-lg">
                                &quot;Hi Amira! Based on daily usage, your 50ml Hyaluronic Acid serum should be almost finished. Would you like us to dispatch your refill with free delivery today so your routine stays uninterrupted?&quot;
                              </p>
                              <div className="flex items-center justify-between pt-1 text-[11px]">
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Customer Replied: &apos;Yes, send to same address!&apos;</span>
                                <span className="font-mono text-secondary/60">CAC: 0.00 DT</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Sub-view: Autonomous Closing & Delivery Re-Booking */
                      <div className="space-y-4">
                        <div className="p-3.5 rounded-2xl bg-secondary/5 border border-secondary/15 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
                              <UserCheck className="w-4 h-4 text-emerald-500" />
                              Zero-Touch Autonomous Re-Order Pipeline
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                              100% Automated
                            </span>
                          </div>
                          <p className="text-[11px] text-secondary/70 leading-relaxed">
                            When an old customer expresses interest, the agent confirms their previous delivery address, updates quantities, applies the VIP discount, and saves the new order into Converty and your store CRM with zero manual effort from the merchant.
                          </p>

                          {/* Simulation Dialogue Box */}
                          <div className="p-3 rounded-xl bg-primary border border-secondary/10 space-y-2 text-xs">
                            <div className="flex items-center justify-between pb-1.5 border-b border-secondary/10">
                              <span className="font-bold text-secondary">Simulated WhatsApp Closing Chat</span>
                              <span className="text-[10px] text-emerald-500 font-bold">Order Confirmed</span>
                            </div>
                            <div className="space-y-1.5 font-sans text-[11px]">
                              <div className="p-2 rounded-lg bg-secondary/5 max-w-[85%] text-secondary">
                                <span className="font-bold text-accent block text-[10px]">Client:</span>
                                &quot;Yes I want the matching shirt in size L black! Do you still have my address?&quot;
                              </div>
                              <div className="p-2 rounded-lg bg-accent/15 max-w-[85%] ml-auto text-secondary">
                                <span className="font-bold text-accent block text-[10px]">Old Clients Agent:</span>
                                &quot;Perfect! We have your address: Rue Habib Bourguiba, Ariana (Phone: 98***309). Total is 65 DT after your 15% VIP discount with free delivery. We just queued your parcel for tomorrow! 📦&quot;
                              </div>
                            </div>
                            <div className="pt-2 border-t border-secondary/10 flex items-center justify-between text-[10px]">
                              <span className="text-secondary/60">Logged to: <strong className="text-secondary">sales_orders table &amp; Converty</strong></span>
                              <span className="text-emerald-500 font-bold">Instant Dispatch 🚀</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. CUSTOM AGENT BUILDER PREVIEW */}
                {selectedAgent.id === "custom-agent" && (
                  <div>
                    {previewSubTab === "primary" ? (
                      <div className="space-y-3">
                        <div className="p-3 rounded-2xl bg-secondary/5 border border-secondary/10 flex items-center justify-between">
                          <span className="text-xs font-bold text-secondary flex items-center gap-1.5">
                            <SlidersHorizontal className="w-3.5 h-3.5 text-accent" />
                            Visual 3-Step Setup (No Coding Needed)
                          </span>
                          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                            100% Plain English
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div className="p-3.5 rounded-2xl bg-secondary/5 border border-secondary/10">
                            <span className="text-[10px] font-black text-accent uppercase tracking-wider block mb-1">
                              Step 1: Where
                            </span>
                            <h4 className="text-xs font-bold text-secondary mb-1">
                              Listen to Messages
                            </h4>
                            <p className="text-[11px] text-secondary/70">
                              Choose WhatsApp, Gmail, or your website form.
                            </p>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-secondary/5 border border-secondary/10">
                            <span className="text-[10px] font-black text-accent uppercase tracking-wider block mb-1">
                              Step 2: What
                            </span>
                            <h4 className="text-xs font-bold text-secondary mb-1">
                              Type Instructions
                            </h4>
                            <p className="text-[11px] text-secondary/70">
                              Describe what you want done in everyday words.
                            </p>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-secondary/5 border border-secondary/10">
                            <span className="text-[10px] font-black text-accent uppercase tracking-wider block mb-1">
                              Step 3: Deliver
                            </span>
                            <h4 className="text-xs font-bold text-secondary mb-1">Save Results</h4>
                            <p className="text-[11px] text-secondary/70">
                              Send directly to Converty, CRM, or SMS.
                            </p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-primary/70 border border-secondary/15">
                          <span className="text-xs font-bold text-secondary block mb-1">
                            Example Plain English Rule:
                          </span>
                          <p className="text-xs text-secondary/80 italic">
                            &quot;Whenever a new client submits our inquiry form, check our price
                            catalog, write a polite customized quote, and send it to their WhatsApp in
                            under 3 minutes.&quot;
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="p-3.5 rounded-2xl bg-secondary/5 border border-secondary/15">
                          <span className="text-xs font-bold text-secondary block mb-1">
                            1. Automated Invoice Reminders
                          </span>
                          <p className="text-xs text-secondary/70">
                            Sends gentle WhatsApp reminders to clients with unpaid invoices 2 days
                            before the due date.
                          </p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-secondary/5 border border-secondary/15">
                          <span className="text-xs font-bold text-secondary block mb-1">
                            2. Google Review Collector
                          </span>
                          <p className="text-xs text-secondary/70">
                            Automatically follows up with satisfied customers 48 hours after delivery
                            asking for a 5-star Google review.
                          </p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-secondary/5 border border-secondary/15">
                          <span className="text-xs font-bold text-secondary block mb-1">
                            3. Daily 7 PM WhatsApp Recap
                          </span>
                          <p className="text-xs text-secondary/70">
                            Sends business owners a brief summary of daily revenue, confirmed orders,
                            and new leads every evening.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions Card - Replaces the Raw JSON and Terminal Dump */}
            <div className="mt-5 pt-4 border-t border-secondary/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Link className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-secondary">
                  Ready to link with your business tools in 1 click
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
