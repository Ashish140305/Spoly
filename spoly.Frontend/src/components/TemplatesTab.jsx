import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  ChevronDown,
  ArrowRight,
  Sparkles,
  LayoutTemplate,
  Network,
  Database,
  Bug,
  LineChart,
  Target,
  HeartPulse,
  FileText,
  BrainCircuit,
  Scale,
  CheckSquare,
  Film,
  Search,
  Users,
  DoorOpen,
  ListChecks,
  CalendarDays,
  Lightbulb,
  Microscope,
  Workflow,
  ShieldCheck,
  Briefcase,
  Grid,
  PieChart,
  Layers,
  MessageSquare,
  Clock,
  Sigma,
  Component,
  Eye,
  X,
  SearchX,
  Command,
  Star,
} from "lucide-react";
import { getTheme } from "../utils/uiHelpers";

// --- STRICT SEMANTIC SVG ENGINE ---
const SemanticUniqueWireframe = ({ templateName }) => {
  const name = templateName?.trim() || "";
  const baseClasses = "transform translate-x-4 translate-y-4";
  switch (name) {
    case "Create New Template":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <rect x="25" y="25" width="50" height="50" rx="8" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="6 4" />
          <line x1="50" y1="35" x2="50" y2="65" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <line x1="35" y1="50" x2="65" y2="50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "System Sequence Diagram":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <rect
            x="20"
            y="10"
            width="20"
            height="14"
            rx="4"
            fill="currentColor"
          />
          <line
            x1="30"
            y1="24"
            x2="30"
            y2="90"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="8 6"
          />
          <rect
            x="60"
            y="10"
            width="20"
            height="14"
            rx="4"
            fill="currentColor"
          />
          <line
            x1="70"
            y1="24"
            x2="70"
            y2="90"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="8 6"
          />
          <line
            x1="30"
            y1="45"
            x2="65"
            y2="45"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <polygon points="60,38 70,45 60,52" fill="currentColor" />
          <line
            x1="70"
            y1="70"
            x2="35"
            y2="70"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <polygon points="40,63 30,70 40,77" fill="currentColor" />
        </svg>
      );
    case "Microservices":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <rect
            x="15"
            y="40"
            width="20"
            height="20"
            rx="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <rect
            x="40"
            y="15"
            width="20"
            height="20"
            rx="4"
            fill="currentColor"
            opacity="0.4"
          />
          <rect
            x="40"
            y="65"
            width="20"
            height="20"
            rx="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <rect
            x="65"
            y="40"
            width="20"
            height="20"
            rx="4"
            fill="currentColor"
            opacity="0.4"
          />
          <line
            x1="35"
            y1="50"
            x2="40"
            y2="50"
            stroke="currentColor"
            strokeWidth="4"
          />
          <line
            x1="60"
            y1="50"
            x2="65"
            y2="50"
            stroke="currentColor"
            strokeWidth="4"
          />
          <line
            x1="50"
            y1="35"
            x2="50"
            y2="40"
            stroke="currentColor"
            strokeWidth="4"
          />
          <line
            x1="50"
            y1="60"
            x2="50"
            y2="65"
            stroke="currentColor"
            strokeWidth="4"
          />
        </svg>
      );
    case "Database ERD":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <path
            d="M20 30 Q 50 45 80 30 Q 50 15 20 30 Z"
            fill="currentColor"
            opacity="0.3"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            d="M20 30 L 20 70 Q 50 85 80 70 L 80 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            d="M20 50 Q 50 65 80 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            opacity="0.6"
          />
          <line
            x1="50"
            y1="10"
            x2="50"
            y2="-5"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "Bug Triage":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <rect
            x="25"
            y="25"
            width="50"
            height="50"
            rx="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <line
            x1="50"
            y1="5"
            x2="50"
            y2="25"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="50"
            y1="75"
            x2="50"
            y2="95"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="5"
            y1="50"
            x2="25"
            y2="50"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="75"
            y1="50"
            x2="95"
            y2="50"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.7" />
        </svg>
      );
    case "Sales Discovery Call":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <polyline
            points="15,85 40,55 60,65 85,25"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="85" cy="25" r="6" fill="currentColor" />
          <line
            x1="15"
            y1="15"
            x2="15"
            y2="85"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="15"
            y1="85"
            x2="85"
            y2="85"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "SWOT Analysis":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <rect
            x="15"
            y="15"
            width="70"
            height="70"
            rx="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <line
            x1="50"
            y1="15"
            x2="50"
            y2="85"
            stroke="currentColor"
            strokeWidth="4"
          />
          <line
            x1="15"
            y1="50"
            x2="85"
            y2="50"
            stroke="currentColor"
            strokeWidth="4"
          />
          <circle cx="32.5" cy="32.5" r="6" fill="currentColor" />
          <path
            d="M63 28 L 73 38 M 63 38 L 73 28"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "Client Onboarding":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <path
            d="M10 85 L 35 85 L 35 60 L 60 60 L 60 35 L 85 35"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <circle cx="85" cy="35" r="6" fill="currentColor" />
        </svg>
      );
    case "Medical Consultation":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <circle
            cx="40"
            cy="35"
            r="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            d="M40 50 L40 85 Q65 85 65 65"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="65" cy="65" r="6" fill="currentColor" />
          <line
            x1="40"
            y1="25"
            x2="40"
            y2="45"
            stroke="currentColor"
            strokeWidth="4"
          />
          <line
            x1="30"
            y1="35"
            x2="50"
            y2="35"
            stroke="currentColor"
            strokeWidth="4"
          />
        </svg>
      );
    case "SOAP Note":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <rect
            x="15"
            y="20"
            width="70"
            height="60"
            rx="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            d="M20 50 L35 50 L45 25 L60 75 L70 50 L80 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "Therapy Session":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <path
            d="M30 60 C 15 60 15 30 35 30 C 35 15 65 15 65 30 C 85 30 85 60 70 60 C 70 80 30 80 30 60 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <circle cx="50" cy="45" r="8" fill="currentColor" opacity="0.5" />
          <line
            x1="50"
            y1="53"
            x2="50"
            y2="70"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="35"
            y1="38"
            x2="45"
            y2="45"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="65"
            y1="38"
            x2="55"
            y2="45"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "Legal Contract Review":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <path
            d="M25 20 L50 10 L75 20 L75 50 Q 75 85 50 95 Q 25 85 25 50 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            d="M40 55 L50 65 L65 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M50 10 L50 95"
            stroke="currentColor"
            strokeWidth="4"
            opacity="0.3"
            strokeDasharray="6 6"
          />
        </svg>
      );
    case "Deposition Summary":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <path
            d="M35 30 L 85 30 M35 55 L 85 55 M35 80 L 65 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M15 25 L 15 85"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="15" cy="15" r="4" fill="currentColor" />
        </svg>
      );
    case "Compliance Audit":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <path
            d="M50 15 L85 30 L85 60 Q85 85 50 95 Q15 85 15 60 L15 30 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M35 55 L45 65 L65 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "Employee 1-on-1":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <circle
            cx="30"
            cy="40"
            r="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            d="M15 75 Q30 55 45 75"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="70" cy="40" r="12" fill="currentColor" opacity="0.3" />
          <path
            d="M55 75 Q70 55 85 75"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M45 40 L55 40"
            stroke="currentColor"
            strokeDasharray="4 4"
            strokeWidth="3"
          />
        </svg>
      );
    case "HR Candidate Screen":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <rect
            x="25"
            y="10"
            width="50"
            height="70"
            rx="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <circle
            cx="50"
            cy="35"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            d="M35 60 Q50 45 65 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <rect
            x="40"
            y="5"
            width="20"
            height="10"
            rx="3"
            fill="currentColor"
          />
        </svg>
      );
    case "Exit Interview":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <rect
            x="20"
            y="15"
            width="40"
            height="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <line
            x1="10"
            y1="85"
            x2="90"
            y2="85"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="50" cy="50" r="4" fill="currentColor" />
          <path
            d="M30 40 L70 40 M60 30 L70 40 L60 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "UX Research Interview":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <circle
            cx="45"
            cy="45"
            r="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <line
            x1="58"
            y1="58"
            x2="80"
            y2="80"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <rect
            x="20"
            y="20"
            width="30"
            height="30"
            rx="4"
            fill="currentColor"
            opacity="0.2"
          />
          <line
            x1="30"
            y1="45"
            x2="60"
            y2="45"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="4 4"
          />
        </svg>
      );
    case "Video Storyboard":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <rect
            x="15"
            y="20"
            width="70"
            height="60"
            rx="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <line
            x1="15"
            y1="35"
            x2="85"
            y2="35"
            stroke="currentColor"
            strokeWidth="4"
          />
          <line
            x1="15"
            y1="65"
            x2="85"
            y2="65"
            stroke="currentColor"
            strokeWidth="4"
          />
          <polygon
            points="40,42 62,50 40,58"
            fill="currentColor"
            opacity="0.8"
          />
          <line
            x1="30"
            y1="20"
            x2="30"
            y2="35"
            stroke="currentColor"
            strokeWidth="3"
          />
          <line
            x1="50"
            y1="20"
            x2="50"
            y2="35"
            stroke="currentColor"
            strokeWidth="3"
          />
          <line
            x1="70"
            y1="20"
            x2="70"
            y2="35"
            stroke="currentColor"
            strokeWidth="3"
          />
          <line
            x1="30"
            y1="65"
            x2="30"
            y2="80"
            stroke="currentColor"
            strokeWidth="3"
          />
          <line
            x1="50"
            y1="65"
            x2="50"
            y2="80"
            stroke="currentColor"
            strokeWidth="3"
          />
          <line
            x1="70"
            y1="65"
            x2="70"
            y2="80"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
      );
    case "Creative Brainstorm":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <circle
            cx="40"
            cy="40"
            r="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            opacity="0.8"
          />
          <circle cx="65" cy="40" r="25" fill="currentColor" opacity="0.2" />
          <circle
            cx="65"
            cy="40"
            r="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            opacity="0.8"
          />
          <circle
            cx="52.5"
            cy="65"
            r="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            opacity="0.8"
          />
        </svg>
      );
    case "AI Auto-Detect":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <path
            d="M50 10 Q 50 50 10 50 Q 50 50 50 90 Q 50 50 90 50 Q 50 50 50 10 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            opacity="0.8"
          />
          <circle cx="25" cy="25" r="5" fill="currentColor" />
          <circle cx="75" cy="75" r="7" fill="currentColor" opacity="0.6" />
          <path
            d="M80 20 L90 30 M90 20 L80 30"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "Daily Standup":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <rect
            x="20"
            y="10"
            width="60"
            height="80"
            rx="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <rect
            x="30"
            y="25"
            width="12"
            height="12"
            rx="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <line
            x1="50"
            y1="31"
            x2="75"
            y2="31"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <rect
            x="30"
            y="50"
            width="12"
            height="12"
            rx="3"
            fill="currentColor"
            opacity="0.8"
          />
          <line
            x1="50"
            y1="56"
            x2="65"
            y2="56"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      );
    case "Weekly Sync":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <rect
            x="15"
            y="15"
            width="70"
            height="70"
            rx="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <line
            x1="15"
            y1="38"
            x2="85"
            y2="38"
            stroke="currentColor"
            strokeWidth="4"
          />
          <line
            x1="15"
            y1="62"
            x2="85"
            y2="62"
            stroke="currentColor"
            strokeWidth="4"
          />
          <line
            x1="38"
            y1="38"
            x2="38"
            y2="85"
            stroke="currentColor"
            strokeWidth="4"
          />
          <line
            x1="62"
            y1="38"
            x2="62"
            y2="85"
            stroke="currentColor"
            strokeWidth="4"
          />
          <rect
            x="20"
            y="44"
            width="12"
            height="12"
            rx="3"
            fill="currentColor"
          />
        </svg>
      );
    case "Study Mind Map":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <circle
            cx="50"
            cy="50"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <line
            x1="50"
            y1="34"
            x2="50"
            y2="15"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="66"
            y1="50"
            x2="85"
            y2="50"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="34"
            y1="50"
            x2="15"
            y2="50"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="61"
            y1="61"
            x2="75"
            y2="75"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="50" cy="15" r="6" fill="currentColor" opacity="0.6" />
          <circle cx="85" cy="50" r="6" fill="currentColor" opacity="0.6" />
          <circle cx="15" cy="50" r="6" fill="currentColor" opacity="0.6" />
          <circle cx="75" cy="75" r="6" fill="currentColor" opacity="0.6" />
        </svg>
      );
    case "Historical Timeline":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <line
            x1="10"
            y1="50"
            x2="90"
            y2="50"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="25" cy="50" r="8" fill="currentColor" />
          <line
            x1="25"
            y1="50"
            x2="25"
            y2="30"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="50"
            r="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="70"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="75" cy="50" r="8" fill="currentColor" />
          <line
            x1="75"
            y1="50"
            x2="75"
            y2="30"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "Flashcard Generator":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <rect
            x="35"
            y="15"
            width="50"
            height="65"
            rx="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="origin-center rotate-12"
          />
          <rect
            x="20"
            y="25"
            width="50"
            height="65"
            rx="8"
            fill="currentColor"
            opacity="0.2"
            stroke="currentColor"
            strokeWidth="4"
            className="origin-center rotate-6"
          />
          <rect
            x="10"
            y="30"
            width="50"
            height="65"
            rx="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <line
            x1="25"
            y1="50"
            x2="45"
            y2="50"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="25"
            y1="65"
            x2="35"
            y2="65"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      );
    case "Math/Physics Proof":
      return (
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <polygon
            points="25,85 75,85 25,15"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <rect
            x="25"
            y="70"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M45 45 A 30 30 0 0 1 55 85"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="6 4"
          />
        </svg>
      );
    default:
      const hash = name
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const fallbackPool = [
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            opacity="0.5"
          />
          <circle
            cx="50"
            cy="50"
            r="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <circle cx="50" cy="50" r="4" fill="currentColor" />
        </svg>,
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <rect
            x="25"
            y="25"
            width="25"
            height="25"
            fill="currentColor"
            opacity="0.3"
          />
          <rect
            x="50"
            y="50"
            width="25"
            height="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <rect
            x="50"
            y="25"
            width="25"
            height="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
        </svg>,
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          className={baseClasses}
        >
          <path
            d="M20 20 L 80 80 M 20 80 L 80 20"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="50" cy="50" r="8" fill="currentColor" />
        </svg>,
      ];
      return fallbackPool[hash % fallbackPool.length];
  }
};

// --- STRICT SEMANTIC ICON ENGINE ---
const SemanticUniqueIcon = ({ templateName, size = 28 }) => {
  const name = templateName?.trim() || "";
  switch (name) {
    case "Create New Template":
      return <Sparkles size={size} />;
    case "System Sequence Diagram":
      return <Network size={size} />;
    case "Microservices":
      return <Component size={size} />;
    case "Database ERD":
      return <Database size={size} />;
    case "Bug Triage":
      return <Bug size={size} />;
    case "Sales Discovery Call":
      return <LineChart size={size} />;
    case "SWOT Analysis":
      return <Target size={size} />;
    case "Client Onboarding":
      return <Briefcase size={size} />;
    case "Medical Consultation":
      return <HeartPulse size={size} />;
    case "SOAP Note":
      return <FileText size={size} />;
    case "Therapy Session":
      return <BrainCircuit size={size} />;
    case "Legal Contract Review":
      return <Scale size={size} />;
    case "Deposition Summary":
      return <MessageSquare size={size} />;
    case "Compliance Audit":
      return <ShieldCheck size={size} />;
    case "Employee 1-on-1":
      return <Users size={size} />;
    case "HR Candidate Screen":
      return <Search size={size} />;
    case "Exit Interview":
      return <DoorOpen size={size} />;
    case "UX Research Interview":
      return <Microscope size={size} />;
    case "Video Storyboard":
      return <Film size={size} />;
    case "Creative Brainstorm":
      return <Lightbulb size={size} />;
    case "AI Auto-Detect":
      return <Sparkles size={size} />;
    case "Daily Standup":
      return <ListChecks size={size} />;
    case "Weekly Sync":
      return <CalendarDays size={size} />;
    case "Study Mind Map":
      return <Workflow size={size} />;
    case "Historical Timeline":
      return <Clock size={size} />;
    case "Flashcard Generator":
      return <Layers size={size} />;
    case "Math/Physics Proof":
      return <Sigma size={size} />;
    default:
      return <LayoutTemplate size={size} />;
  }
};

// --- PREVIEW SKELETON ENGINE ---
const PreviewSkeleton = ({ templateName, isDarkMode }) => {
  const name = templateName?.toLowerCase() || "";

  // 🌟 FIX: Bolder borders and darker text blocks for light mode visibility
  const baseBg = isDarkMode ? "bg-[#1F263B]" : "bg-white";
  const borderCol = isDarkMode
    ? "border-[#2E364F]"
    : "border-slate-300 shadow-sm";
  const textDark = isDarkMode ? "bg-slate-500" : "bg-slate-400";
  const textLight = isDarkMode ? "bg-slate-600" : "bg-slate-300";
  const accentLight = isDarkMode ? "bg-indigo-500/20" : "bg-indigo-100";
  const accentDark = isDarkMode ? "bg-indigo-500/50" : "bg-indigo-400";

  if (name.includes("auto-detect") || name === "ai auto-detect") {
    return (
      <div className="absolute inset-0 flex items-center justify-center gap-6 p-8">
        <div
          className={`w-[40%] h-48 rounded-2xl border-2 p-5 flex flex-col justify-center gap-3 ${baseBg} ${borderCol}`}
        >
          <div className={`w-full h-2.5 rounded-full ${textDark}`}></div>
          <div className={`w-3/4 h-2.5 rounded-full ${textLight}`}></div>
          <div className={`w-5/6 h-2.5 rounded-full ${textLight}`}></div>
          <div className={`w-1/2 h-2.5 rounded-full ${textLight}`}></div>
          <div className={`w-full h-2.5 rounded-full mt-2 ${textDark}`}></div>
          <div className={`w-4/5 h-2.5 rounded-full ${textLight}`}></div>
        </div>
        <div
          className={`flex flex-col items-center justify-center text-indigo-500`}
        >
          <Sparkles size={20} className="mb-2 opacity-60" />
          <ArrowRight size={24} className="opacity-80" />
        </div>
        <div
          className={`w-[40%] h-48 rounded-2xl border-2 p-4 flex flex-col items-center justify-center gap-3 ${baseBg} ${borderCol}`}
        >
          <div className={`w-20 h-8 rounded-lg border-2 ${borderCol}`}></div>
          <div
            className={`w-1 h-4 ${isDarkMode ? "bg-slate-600" : "bg-slate-300"}`}
          ></div>
          <div className="flex gap-2">
            <div className={`w-12 h-8 rounded-lg border-2 ${borderCol}`}></div>
            <div className={`w-12 h-8 rounded-lg border-2 ${borderCol}`}></div>
          </div>
        </div>
      </div>
    );
  }

  if (name.includes("standup")) {
    return (
      <div className="absolute inset-0 p-8 flex gap-4 h-full">
        {["To Do", "Doing", "Done"].map((col, i) => (
          <div
            key={col}
            className={`flex-1 rounded-2xl p-4 flex flex-col gap-3 ${isDarkMode ? "bg-[#1A2033]/50 border border-[#2E364F]" : "bg-slate-50 border border-slate-200"}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-3 h-3 rounded-full ${i === 0 ? "bg-rose-400" : i === 1 ? "bg-amber-400" : "bg-emerald-400"}`}
              ></div>
              <div className={`w-1/2 h-3 rounded-full ${textDark}`}></div>
            </div>
            <div
              className={`w-full h-16 rounded-xl border-2 p-3 flex flex-col justify-center ${baseBg} ${borderCol}`}
            >
              <div className={`w-3/4 h-2 rounded-full mb-2 ${textDark}`}></div>
              <div className={`w-1/2 h-2 rounded-full ${textLight}`}></div>
            </div>
            {i !== 2 && (
              <div
                className={`w-full h-16 rounded-xl border-2 p-3 flex flex-col justify-center ${baseBg} ${borderCol}`}
              >
                <div
                  className={`w-4/5 h-2 rounded-full mb-2 ${textDark}`}
                ></div>
                <div className={`w-2/3 h-2 rounded-full ${textLight}`}></div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (name.includes("sequence"))
    return (
      <div className="absolute inset-0 p-8 flex justify-center gap-16">
        {[1, 2].map((col) => (
          <div key={col} className="relative flex flex-col items-center">
            <div
              className={`w-16 h-10 rounded-lg border-2 ${baseBg} ${borderCol} z-10 flex items-center justify-center`}
            >
              <div className={`w-8 h-2 rounded-full ${textDark}`}></div>
            </div>
            <div
              className={`w-1 h-64 border-l-2 border-dashed ${isDarkMode ? "border-slate-600" : "border-slate-300"}`}
            ></div>
          </div>
        ))}
        <div
          className={`absolute top-24 left-1/2 -translate-x-1/2 w-32 h-1 ${accentDark}`}
        ></div>
        <div
          className={`absolute top-40 left-1/2 -translate-x-1/2 w-32 h-1 ${accentDark}`}
        ></div>
      </div>
    );
  if (name.includes("microservices"))
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-64 h-64">
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-4 z-10 ${baseBg} ${isDarkMode ? "border-indigo-500/50" : "border-indigo-300"}`}
          ></div>
          {[0, 120, 240].map((deg) => (
            <div
              key={deg}
              className={`absolute w-16 h-16 rounded-xl border-2 ${baseBg} ${borderCol}`}
              style={{
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-80px) rotate(-${deg}deg)`,
              }}
            ></div>
          ))}
        </div>
      </div>
    );
  if (name.includes("database") || name.includes("erd"))
    return (
      <div className="absolute inset-0 flex items-center justify-center gap-12 p-8">
        {[1, 2].map((col) => (
          <div
            key={col}
            className={`w-48 rounded-xl border-2 flex flex-col overflow-hidden ${baseBg} ${borderCol} z-10`}
          >
            <div
              className={`w-full h-10 ${accentLight} flex items-center px-4`}
            >
              <div className={`w-24 h-3 rounded-full ${textDark}`}></div>
            </div>
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className={`w-16 h-2 rounded-full ${textLight}`}></div>
                  <div className={`w-8 h-2 rounded-full ${textLight}`}></div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-1 ${accentDark}`}
        ></div>
      </div>
    );
  if (name.includes("bug"))
    return (
      <div className="absolute inset-0 p-8 flex flex-col gap-4">
        <div className={`w-3/4 h-8 rounded-lg mb-1 ${textDark}`}></div>
        <div
          className={`w-20 h-6 rounded-full mb-4 ${isDarkMode ? "bg-red-500/30" : "bg-red-200"}`}
        ></div>
        <div
          className={`w-full p-4 rounded-xl border-2 ${baseBg} ${borderCol}`}
        >
          <div className={`w-32 h-3 rounded-full mb-3 ${textDark}`}></div>
          <div className={`w-full h-2 rounded-full ${textLight}`}></div>
        </div>
        <div
          className={`w-full p-4 rounded-xl border-2 ${baseBg} ${borderCol}`}
        >
          <div className={`w-40 h-3 rounded-full mb-3 ${textDark}`}></div>
          <div className={`w-3/4 h-2 rounded-full ${textLight}`}></div>
        </div>
      </div>
    );
  if (name.includes("sales"))
    return (
      <div className="absolute inset-0 p-8 flex flex-col gap-4">
        {["Budget", "Authority", "Need", "Timeline"].map((bant) => (
          <div
            key={bant}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 ${baseBg} ${borderCol}`}
          >
            <div className={`w-8 h-8 rounded-lg ${accentLight}`}></div>
            <div className="flex-1">
              <div className={`w-24 h-3 rounded-full mb-2 ${textDark}`}></div>
              <div className={`w-full h-2 rounded-full ${textLight}`}></div>
            </div>
          </div>
        ))}
      </div>
    );
  if (name.includes("swot") || name.includes("matrix"))
    return (
      <div className="absolute inset-0 p-8 flex flex-col h-full">
        <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`rounded-xl border-2 p-5 flex flex-col gap-4 ${baseBg} ${borderCol}`}
            >
              <div className={`w-1/3 h-4 rounded-full ${textDark}`}></div>
              <div className={`w-full h-2 rounded-full ${textLight}`}></div>
              <div className={`w-5/6 h-2 rounded-full ${textLight}`}></div>
            </div>
          ))}
        </div>
      </div>
    );
  if (name.includes("onboarding"))
    return (
      <div className="absolute inset-0 p-8 flex items-end gap-2">
        {[40, 60, 80, 100].map((height, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t-xl border-t-2 border-x-2 ${baseBg} ${borderCol}`}
            style={{ height: `${height}%` }}
          >
            <div
              className={`m-4 w-8 h-8 rounded-full ${accentLight} flex justify-center items-center`}
            >
              <div className={`w-3 h-3 rounded-full ${accentDark}`}></div>
            </div>
          </div>
        ))}
      </div>
    );
  if (name.includes("medical"))
    return (
      <div className="absolute inset-0 p-8 flex flex-col gap-6">
        <div
          className={`w-full h-16 rounded-xl border-2 flex items-center justify-center overflow-hidden ${baseBg} ${borderCol}`}
        >
          <svg
            className={`w-full h-8 ${isDarkMode ? "text-rose-500/50" : "text-rose-300"}`}
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
          >
            <polyline
              points="0,10 20,10 30,0 40,20 50,10 100,10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="flex gap-4">
          <div
            className={`w-1/3 h-24 rounded-xl border-2 ${baseBg} ${borderCol} p-4`}
          >
            <div className={`w-12 h-3 rounded-full mb-2 ${textDark}`}></div>
            <div className={`w-20 h-6 rounded-full ${textLight}`}></div>
          </div>
          <div
            className={`w-1/3 h-24 rounded-xl border-2 ${baseBg} ${borderCol} p-4`}
          >
            <div className={`w-12 h-3 rounded-full mb-2 ${textDark}`}></div>
            <div className={`w-20 h-6 rounded-full ${textLight}`}></div>
          </div>
          <div
            className={`w-1/3 h-24 rounded-xl border-2 ${baseBg} ${borderCol} p-4`}
          >
            <div className={`w-12 h-3 rounded-full mb-2 ${textDark}`}></div>
            <div className={`w-20 h-6 rounded-full ${textLight}`}></div>
          </div>
        </div>
      </div>
    );
  if (name.includes("soap"))
    return (
      <div className="absolute inset-0 p-8 flex flex-col gap-3">
        {["S", "O", "A", "P"].map((section, i) => (
          <div
            key={section}
            className={`flex gap-4 items-center w-full p-4 rounded-xl border-2 ${baseBg} ${borderCol}`}
          >
            <div
              className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center ${isDarkMode ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-100 text-indigo-700"}`}
            >
              {section}
            </div>
            <div className="flex-1">
              <div
                className={`w-full h-2 rounded-full mb-2 ${textLight}`}
              ></div>
              <div className={`w-4/5 h-2 rounded-full ${textLight}`}></div>
            </div>
          </div>
        ))}
      </div>
    );
  if (name.includes("therapy"))
    return (
      <div className="absolute inset-0 p-8 flex flex-col gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex w-full ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-4 rounded-2xl relative border-2 ${borderCol} ${i % 2 === 0 ? accentLight : baseBg}`}
            >
              {i !== 2 && (
                <div
                  className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${isDarkMode ? "bg-rose-500/50" : "bg-rose-300"}`}
                ></div>
              )}
              <div
                className={`w-full h-2 rounded-full mb-2 ${textLight}`}
              ></div>
              <div className={`w-5/6 h-2 rounded-full ${textLight}`}></div>
            </div>
          </div>
        ))}
      </div>
    );
  if (name.includes("legal"))
    return (
      <div className="absolute inset-0 py-8 px-16 flex flex-col gap-4">
        <div
          className={`w-full h-12 rounded-lg border-2 flex items-center justify-center mb-4 ${baseBg} ${borderCol}`}
        >
          <div className={`w-8 h-8 rounded-full ${accentDark}`}></div>
        </div>
        <div className={`w-full h-3 rounded-full ${textDark}`}></div>
        <div className={`w-full h-3 rounded-full ${textDark}`}></div>
        <div className="flex gap-4 items-center">
          <div className={`w-full h-3 rounded-full ${textLight}`}></div>
          <div
            className={`w-2 h-12 rounded-full ${isDarkMode ? "bg-red-500/50" : "bg-red-300"}`}
          ></div>
        </div>
        <div className={`w-5/6 h-3 rounded-full ${textDark}`}></div>
      </div>
    );
  if (name.includes("deposition"))
    return (
      <div className="absolute inset-0 p-8 flex flex-col gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-600"}`}
            >
              Q
            </div>
            <div
              className={`flex-1 p-3 rounded-xl border-2 ${baseBg} ${borderCol}`}
            >
              <div className={`w-3/4 h-2 rounded-full ${textDark}`}></div>
            </div>
          </div>
        ))}
        <div className="flex gap-4 pl-12">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${accentLight} ${isDarkMode ? "text-indigo-300" : "text-indigo-700"}`}
          >
            A
          </div>
          <div className={`flex-1 p-3 rounded-xl ${accentLight}`}>
            <div className={`w-full h-2 rounded-full ${accentDark}`}></div>
          </div>
        </div>
      </div>
    );
  if (name.includes("compliance"))
    return (
      <div className="absolute inset-0 p-8 flex flex-col gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 ${baseBg} ${borderCol}`}
          >
            <div
              className={`w-6 h-6 rounded-full border-2 ${i === 3 ? (isDarkMode ? "border-red-500" : "border-red-400") : isDarkMode ? "border-emerald-500" : "border-emerald-400"}`}
            ></div>
            <div className="flex-1">
              <div className={`w-1/2 h-3 rounded-full ${textDark}`}></div>
            </div>
          </div>
        ))}
      </div>
    );
  if (name.includes("1-on-1"))
    return (
      <div className="absolute inset-0 p-8 flex flex-col h-full">
        <div className="flex justify-center gap-8 mb-6">
          <div
            className={`w-16 h-16 rounded-full border-4 ${baseBg} ${borderCol}`}
          ></div>
          <div
            className={`w-16 h-16 rounded-full border-4 ${accentLight} ${isDarkMode ? "border-indigo-500/30" : "border-indigo-200"}`}
          ></div>
        </div>
        <div className="flex gap-6 flex-1">
          <div
            className={`flex-1 rounded-xl p-4 border-2 ${baseBg} ${borderCol}`}
          >
            <div className={`w-1/2 h-3 rounded-full mb-3 ${textDark}`}></div>
            <div className={`w-full h-2 rounded-full ${textLight}`}></div>
          </div>
          <div
            className={`flex-1 rounded-xl p-4 border-2 ${baseBg} ${borderCol}`}
          >
            <div className={`w-1/2 h-3 rounded-full mb-3 ${textDark}`}></div>
            <div className={`w-full h-2 rounded-full ${textLight}`}></div>
          </div>
        </div>
      </div>
    );
  if (name.includes("candidate"))
    return (
      <div className="absolute inset-0 p-8 flex flex-col gap-5">
        <div className="flex gap-4 items-center">
          <div className={`w-20 h-20 rounded-xl ${accentLight}`}></div>
          <div>
            <div className={`w-32 h-4 rounded-full mb-2 ${textDark}`}></div>
            <div className={`w-24 h-3 rounded-full ${textLight}`}></div>
          </div>
        </div>
        <div
          className={`w-full h-1 ${isDarkMode ? "bg-[#2E364F]" : "bg-slate-300"}`}
        ></div>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-16 h-6 rounded-full border-2 ${baseBg} ${borderCol}`}
            ></div>
          ))}
        </div>
        <div className="flex-1 space-y-3 pt-2">
          <div className={`w-full h-3 rounded-full ${textLight}`}></div>
          <div className={`w-5/6 h-3 rounded-full ${textLight}`}></div>
        </div>
      </div>
    );
  if (name.includes("exit"))
    return (
      <div className="absolute inset-0 p-8 flex flex-col gap-6">
        <div className={`w-1/2 h-6 rounded-full ${textDark} mb-2`}></div>
        {[1, 2].map((row) => (
          <div
            key={row}
            className={`w-full p-4 rounded-xl border-2 flex items-center justify-between ${baseBg} ${borderCol}`}
          >
            <div className={`w-1/3 h-3 rounded-full ${textDark}`}></div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full ${i <= 3 ? accentDark : isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  if (name.includes("ux"))
    return (
      <div className="absolute inset-0 p-8 flex gap-6">
        <div
          className={`w-1/3 rounded-2xl border-2 p-4 flex flex-col items-center ${baseBg} ${borderCol}`}
        >
          <div className={`w-16 h-16 rounded-full mb-4 ${accentLight}`}></div>
          <div className={`w-20 h-3 rounded-full mb-2 ${textDark}`}></div>
          <div className={`w-16 h-2 rounded-full ${textLight}`}></div>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex-1 rounded-xl border-2 flex items-center px-4 ${baseBg} ${borderCol}`}
            >
              <div className={`w-3/4 h-2 rounded-full ${textLight}`}></div>
            </div>
          ))}
        </div>
      </div>
    );
  if (name.includes("video"))
    return (
      <div className="absolute inset-0 p-8 grid grid-cols-2 grid-rows-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <div
              className={`flex-1 rounded-lg border-2 ${baseBg} ${borderCol} flex items-center justify-center`}
            >
              <div className={`w-6 h-6 rounded-full ${accentLight}`}></div>
            </div>
            <div className={`w-full h-2 rounded-full ${textLight}`}></div>
            <div className={`w-2/3 h-2 rounded-full ${textLight}`}></div>
          </div>
        ))}
      </div>
    );
  if (name.includes("creative"))
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`absolute w-24 h-24 rounded-lg shadow-lg transform -rotate-12 -translate-x-12 -translate-y-12 p-3 ${isDarkMode ? "bg-rose-900/50" : "bg-rose-100"}`}
        >
          <div className={`w-1/2 h-2 rounded-full mb-2 bg-rose-500/50`}></div>
          <div className={`w-full h-1 rounded-full bg-rose-500/30`}></div>
        </div>
        <div
          className={`absolute w-24 h-24 rounded-lg shadow-lg transform rotate-6 translate-x-16 -translate-y-8 p-3 ${isDarkMode ? "bg-amber-900/50" : "bg-amber-100"}`}
        >
          <div className={`w-1/2 h-2 rounded-full mb-2 bg-amber-500/50`}></div>
        </div>
        <div
          className={`absolute w-24 h-24 rounded-lg shadow-lg transform rotate-12 -translate-x-4 translate-y-12 p-3 ${isDarkMode ? "bg-emerald-900/50" : "bg-emerald-100"}`}
        >
          <div
            className={`w-3/4 h-2 rounded-full mb-2 bg-emerald-500/50`}
          ></div>
          <div className={`w-full h-1 rounded-full bg-emerald-500/30`}></div>
        </div>
        <div
          className={`absolute w-24 h-24 rounded-lg shadow-lg transform -rotate-6 translate-x-20 translate-y-16 p-3 ${isDarkMode ? "bg-indigo-900/50" : "bg-indigo-100"}`}
        >
          <div className={`w-1/2 h-2 rounded-full mb-2 bg-indigo-500/50`}></div>
        </div>
      </div>
    );
  if (name.includes("weekly"))
    return (
      <div className="absolute inset-0 p-8 flex gap-2 h-full">
        {[1, 2, 3, 4, 5].map((day) => (
          <div
            key={day}
            className={`flex-1 rounded-lg border-2 flex flex-col items-center py-4 gap-2 ${baseBg} ${borderCol}`}
          >
            <div className={`w-4 h-4 rounded-full mb-2 ${textDark}`}></div>
            {day % 2 !== 0 && (
              <div className={`w-4/5 h-12 rounded bg-indigo-500/20`}></div>
            )}
            {day === 2 && (
              <div className={`w-4/5 h-8 rounded bg-rose-500/20`}></div>
            )}
          </div>
        ))}
      </div>
    );
  if (name.includes("mind map"))
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`w-20 h-10 rounded-full border-4 flex items-center justify-center z-10 ${baseBg} ${borderCol}`}
        >
          <div className={`w-8 h-2 rounded-full ${textDark}`}></div>
        </div>
        <div
          className={`absolute top-12 left-12 w-16 h-8 rounded-full border-2 z-10 ${baseBg} ${borderCol}`}
        ></div>
        <div
          className={`absolute w-20 h-1 bg-indigo-500/30 transform rotate-45 -translate-x-8 -translate-y-8`}
        ></div>
        <div
          className={`absolute top-12 right-12 w-16 h-8 rounded-full border-2 z-10 ${baseBg} ${borderCol}`}
        ></div>
        <div
          className={`absolute w-20 h-1 bg-indigo-500/30 transform -rotate-45 translate-x-8 -translate-y-8`}
        ></div>
        <div
          className={`absolute bottom-12 left-1/2 -translate-x-1/2 w-16 h-8 rounded-full border-2 z-10 ${baseBg} ${borderCol}`}
        ></div>
        <div
          className={`absolute w-1 h-12 bg-indigo-500/30 translate-y-12`}
        ></div>
      </div>
    );
  if (name.includes("historical"))
    return (
      <div className="absolute inset-0 p-8 flex justify-center">
        <div
          className={`w-1 h-full rounded-full relative ${isDarkMode ? "bg-slate-700" : "bg-slate-300"}`}
        >
          {[20, 50, 80].map((top, i) => (
            <div
              key={top}
              className={`absolute w-3 h-3 rounded-full -left-1 flex items-center ${textDark}`}
              style={{ top: `${top}%` }}
            >
              <div
                className={`absolute w-32 p-3 rounded-lg border-2 flex flex-col gap-2 ${i % 2 === 0 ? "left-6" : "right-6"} ${baseBg} ${borderCol}`}
              >
                <div className={`w-1/3 h-2 rounded-full ${textDark}`}></div>
                <div className={`w-full h-1.5 rounded-full ${textLight}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  if (name.includes("flashcard"))
    return (
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div
          className={`relative w-48 h-64 rounded-3xl border-4 ${borderCol} ${baseBg} z-0 transform rotate-6 translate-x-4 opacity-50`}
        ></div>
        <div
          className={`absolute w-48 h-64 rounded-3xl border-4 ${borderCol} ${baseBg} p-6 flex flex-col justify-center items-center z-10 transform -rotate-2 -translate-x-2`}
        >
          <div className={`w-3/4 h-4 rounded-full mb-6 ${textDark}`}></div>
          <div className={`w-full h-2 rounded-full mb-3 ${textLight}`}></div>
          <div className={`w-5/6 h-2 rounded-full ${textLight}`}></div>
        </div>
      </div>
    );
  if (name.includes("math") || name.includes("proof"))
    return (
      <div className="absolute inset-0 p-10 flex flex-col items-center gap-6">
        <div className={`w-32 h-4 rounded-full ${textDark}`}></div>
        <div className={`w-40 h-3 rounded-full ${textLight}`}></div>
        <div
          className={`w-1 h-4 border-l-2 border-dashed ${isDarkMode ? "border-[#2E364F]" : "border-slate-300"}`}
        ></div>
        <div className={`w-48 h-3 rounded-full ${textLight}`}></div>
        <div
          className={`w-1 h-4 border-l-2 border-dashed ${isDarkMode ? "border-[#2E364F]" : "border-slate-300"}`}
        ></div>
        <div
          className={`w-24 h-8 rounded-lg border-2 flex items-center justify-center ${baseBg} ${borderCol}`}
        >
          <div className={`w-12 h-2 rounded-full ${accentDark}`}></div>
        </div>
      </div>
    );

  // FALLBACK
  return (
    <div className="absolute inset-0 p-10 flex flex-col">
      <div className={`w-1/2 h-8 rounded-lg mb-4 ${textDark}`}></div>
      <div className={`w-1/3 h-4 rounded-md mb-8 ${textLight}`}></div>
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-5">
            <div
              className={`w-8 h-8 rounded-md shrink-0 mt-1 ${accentDark}`}
            ></div>
            <div className="flex-1 space-y-4">
              <div className={`w-full h-4 rounded-full ${textDark}`}></div>
              <div className={`w-5/6 h-4 rounded-full ${textDark}`}></div>
              {i !== 3 && (
                <div className={`w-2/3 h-4 rounded-full ${textLight}`}></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function TemplatesTab({
  isDarkMode,
  templateFilter,
  setTemplateFilter,
  templateCategories,
  templatesDB,
  setActiveAiTemplate,
  setActiveTab,
  showToast,
  clerkId,
  customTemplates = [],
  onSaveCustomTemplate,
  onDeleteCustomTemplate,
}) {
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: "", desc: "", prompt: "", category: "Custom" });

  const displayCategories =
    favorites.length > 0
      ? ["Favorites", ...templateCategories]
      : templateCategories;
  const currentFilter =
    templateFilter === "Favorites" && favorites.length === 0
      ? "All"
      : templateFilter;

  const filteredTemplates = templatesDB.filter((t) => {
    const matchesCategory =
      currentFilter === "All" ||
      (currentFilter === "Favorites" && favorites.includes(t.id)) ||
      t.category === currentFilter;

    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.desc || t.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const filteredCustom = customTemplates.filter((t) => {
    const matchesCategory = currentFilter === "All" || currentFilter === "Custom" || (currentFilter === "Favorites" && favorites.includes(t.id));
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.desc || t.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).map(t => ({...t, isCustom: true, category: "Custom", theme: "slate", description: t.desc}));

  const showCreateCard = (currentFilter === "All" || currentFilter === "Custom") && !searchQuery;
  const createCardDef = { id: "create-new-template-card", isCreateCard: true, name: "Create New Template", category: "Custom", desc: "Build your own AI instruction frameworks and save them.", theme: "indigo" };

  const allDisplayTemplates = [
    ...(showCreateCard ? [createCardDef] : []),
    ...filteredCustom,
    ...filteredTemplates
  ];

  const getAccentGradient = (themeStr) => {
    if (!themeStr) return "from-blue-500 to-cyan-400";
    if (themeStr.includes("rose") || themeStr.includes("pink"))
      return "from-rose-500 to-pink-500";
    if (themeStr.includes("emerald") || themeStr.includes("teal"))
      return "from-emerald-500 to-teal-400";
    if (themeStr.includes("amber") || themeStr.includes("orange"))
      return "from-amber-500 to-orange-500";
    if (themeStr.includes("purple")) return "from-purple-500 to-indigo-500";
    return "from-blue-500 to-cyan-400";
  };

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const isFav = prev.includes(id);
      if (isFav) {
        showToast("Removed from Favorites");
        return prev.filter((fId) => fId !== id);
      } else {
        showToast("Added to Favorites ⭐️");
        return [...prev, id];
      }
    });
  };

  return (
    <div className="space-y-6 relative">
      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {previewTemplate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewTemplate(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative z-10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col border ${isDarkMode ? "bg-[#161B2A] border-[#2E364F]" : "bg-white border-slate-200"}`}
            >
              <div className="relative p-8 flex items-start justify-between">
                <div
                  className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${getAccentGradient(previewTemplate.theme)}`}
                ></div>
                <div className="flex gap-5 items-center">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner border ${isDarkMode ? "bg-[#1F263B] border-[#2E364F] text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"}`}
                  >
                    <SemanticUniqueIcon
                      templateName={previewTemplate.name}
                      size={28}
                    />
                  </div>
                  <div>
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border mb-2 inline-block ${isDarkMode ? "text-slate-400 bg-[#1F263B] border-[#2E364F]" : "text-slate-500 bg-white border-slate-200"}`}
                    >
                      {previewTemplate.category}
                    </span>
                    <h2
                      className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}
                    >
                      {previewTemplate.name}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className={`p-2.5 rounded-full transition-colors ${isDarkMode ? "hover:bg-[#1F263B] text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"}`}
                >
                  <X size={24} />
                </button>
              </div>
              <div
                className={`flex-1 min-h-[350px] relative overflow-hidden border-y ${isDarkMode ? "bg-[#0E121E] border-[#2E364F]" : "bg-slate-50 border-slate-200"}`}
              >
                <PreviewSkeleton
                  templateName={previewTemplate.name}
                  isDarkMode={isDarkMode}
                />
                <div
                  className={`absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t pointer-events-none ${isDarkMode ? "from-[#0E121E] to-transparent" : "from-slate-50 to-transparent"}`}
                ></div>
              </div>
              <div
                className={`p-8 flex justify-end gap-4 ${isDarkMode ? "bg-[#161B2A]" : "bg-white"}`}
              >
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className={`px-6 py-3 rounded-2xl font-bold transition-colors ${isDarkMode ? "text-slate-300 hover:bg-[#1F263B]" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setActiveAiTemplate(previewTemplate);
                    setActiveTab("workspace");
                    showToast(`Template Set: ${previewTemplate.name}`);
                    setPreviewTemplate(null);
                  }}
                  className={`px-8 py-3 rounded-2xl font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] active:scale-95 flex items-center gap-2 ${isDarkMode ? "bg-indigo-500 text-white border border-indigo-400/50" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
                >
                  Use This Framework <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🌟 UNIFIED ULTRA-COMPACT HERO BANNER */}
      <div
        className={`w-full rounded-3xl p-6 md:px-8 relative overflow-hidden shadow-sm border mb-8 flex flex-col justify-center ${isDarkMode ? "bg-[#131722] border-[#2A2F3D]" : "bg-white border-slate-200"}`}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full ${isDarkMode ? "bg-indigo-600/20" : "bg-indigo-300/30"}`}
          ></div>
          <div
            className={`absolute -bottom-24 -left-24 w-64 h-64 blur-[80px] rounded-full ${isDarkMode ? "bg-blue-600/20" : "bg-blue-300/30"}`}
          ></div>
        </div>

        <div className="relative z-10 max-w-2xl flex flex-col md:flex-row md:items-center justify-between w-full">
          <div>
            <div
              className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest mb-2 border ${isDarkMode ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" : "bg-indigo-50 text-indigo-600 border-indigo-200"}`}
            >
              <Sparkles size={12} /> Template Gallery
            </div>
            <h2
              className={`text-2xl md:text-3xl font-extrabold tracking-tight mb-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              Structure your thoughts.
            </h2>
            <p
              className={`text-sm font-medium leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
            >
              Choose a framework before recording to extract structured
              diagrams.
            </p>
          </div>
        </div>
        <LayoutTemplate
          className={`absolute -right-4 -bottom-4 w-40 h-40 opacity-10 pointer-events-none ${isDarkMode ? "text-white" : "text-indigo-600"}`}
        />
      </div>

      {/* UNIFIED TOOLBAR: Filters on Left, Search on Right */}
      <div className="sticky top-0 z-40 flex flex-col-reverse xl:flex-row justify-between items-center gap-4 w-full pt-2 pb-4 bg-transparent">
        {/* Filter Pills */}
        <div
          className={`inline-flex items-center p-1.5 rounded-[1.25rem] shadow-sm border overflow-x-auto custom-scrollbar max-w-full backdrop-blur-xl w-full xl:w-auto ${isDarkMode ? "bg-[#131722]/85 border-[#2A2F3D]" : "bg-white/90 border-slate-200"}`}
        >
          <div className="flex items-center gap-1 shrink-0 px-1">
            {displayCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setTemplateFilter(cat)}
                className={`relative px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${currentFilter === cat ? (isDarkMode ? "text-white" : "text-slate-900") : isDarkMode ? "text-slate-400 hover:text-slate-200 hover:bg-[#1A2033]" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
              >
                {currentFilter === cat && (
                  <motion.div
                    layoutId="activeFilterBubble"
                    className={`absolute inset-0 rounded-xl shadow-sm border ${isDarkMode ? "bg-[#1F263B] border-[#2E364F]" : "bg-white border-slate-200"}`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {cat === "Favorites" && (
                    <Star
                      size={12}
                      className={
                        currentFilter === cat
                          ? "text-amber-500 fill-amber-500"
                          : "text-slate-400"
                      }
                    />
                  )}
                  {cat}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Compact Search Bar */}
        <div className="relative w-full xl:w-80 shrink-0 group">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
            <Search
              size={16}
              className={
                isDarkMode
                  ? "text-slate-400 group-focus-within:text-indigo-400 transition-colors"
                  : "text-slate-500 group-focus-within:text-indigo-600 transition-colors"
              }
            />
          </div>
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-10 py-3 rounded-2xl font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm ${isDarkMode ? "bg-[#1F263B]/60 border border-[#2E364F] text-white placeholder-slate-500 focus:bg-[#1A2033]" : "bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-slate-50"}`}
          />
          <div className="absolute inset-y-0 right-3 flex items-center gap-2">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid & Empty State */}
      <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className={`rounded-2xl border p-6 space-y-4 ${isDarkMode ? "bg-[#1a1f2e] border-[#2a2f3d]" : "bg-white border-slate-200"} shadow-sm`}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                    <Sparkles size={20} className="text-indigo-500" /> Create Custom Framework
                  </h3>
                  <button onClick={() => setShowCreateForm(false)} className={`p-2 rounded-full transition-colors ${isDarkMode ? "hover:bg-[#2A344D] text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}>
                    <X size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Template Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Research Deep Dive"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate((p) => ({ ...p, name: e.target.value }))}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isDarkMode ? "bg-[#0b0f19] border-[#2a2f3d] text-slate-200 placeholder-slate-600" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Short Description *</label>
                    <input
                      type="text"
                      placeholder="e.g. Extracts key findings with citations"
                      value={newTemplate.desc}
                      onChange={(e) => setNewTemplate((p) => ({ ...p, desc: e.target.value }))}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isDarkMode ? "bg-[#0b0f19] border-[#2a2f3d] text-slate-200 placeholder-slate-600" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>AI Prompt Instructions *</label>
                  <textarea
                    rows={5}
                    placeholder="Describe exactly how the AI should process and format the transcript."
                    value={newTemplate.prompt}
                    onChange={(e) => setNewTemplate((p) => ({ ...p, prompt: e.target.value }))}
                    className={`w-full rounded-xl border px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all ${isDarkMode ? "bg-[#0b0f19] border-[#2a2f3d] text-slate-200 placeholder-slate-600" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"}`}
                  />
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <button
                    onClick={async () => {
                      if (!newTemplate.name.trim() || !newTemplate.prompt.trim()) {
                        showToast("Name and Prompt are required!");
                        return;
                      }
                      await onSaveCustomTemplate(newTemplate);
                      setNewTemplate({ name: "", desc: "", prompt: "", category: "Custom" });
                      setShowCreateForm(false);
                      showToast("Custom template saved!");
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 transition-all shadow-md"
                  >
                    <Sparkles size={15} /> Save Template
                  </button>
                  <p className={`text-xs ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Templates are saved to your cloud account.</p>
                </div>
              </div>
            </motion.div>
          )}
      </AnimatePresence>
      {allDisplayTemplates.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex flex-col items-center justify-center p-16 text-center border rounded-[2rem] border-dashed ${isDarkMode ? "bg-[#1F263B]/50 border-[#2E364F]" : "bg-slate-50/50 border-slate-300"}`}
        >
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-inner ${isDarkMode ? "bg-[#161B2A] text-slate-500" : "bg-white text-slate-400"}`}
          >
            <SearchX size={40} strokeWidth={1.5} />
          </div>
          <h3
            className={`text-2xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-slate-800"}`}
          >
            No frameworks found
          </h3>
          <p
            className={`mb-8 max-w-md ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            {searchQuery
              ? `We couldn't find any templates matching "${searchQuery}".`
              : `We couldn't find any templates in the "${currentFilter}" category.`}
          </p>
          <button
            onClick={() => {
              setTemplateFilter("All");
              setSearchQuery("");
            }}
            className={`px-6 py-3 rounded-xl font-bold transition-all shadow-sm active:scale-95 ${isDarkMode ? "bg-indigo-500 hover:bg-indigo-400 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
          >
            Clear Filters & Search
          </button>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {allDisplayTemplates.map((temp) => {
              const themeClass = getTheme(temp.theme, isDarkMode);
              const isFav = favorites.includes(temp.id);

              return (
                <motion.div
                  key={temp.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    if (temp.isCreateCard) {
                      setShowCreateForm(p => !p);
                      return;
                    }
                    setActiveAiTemplate(temp);
                    setActiveTab("workspace");
                    showToast(`Template Set: ${temp.name}`);
                  }}
                  className={`group relative flex flex-col text-left transition-all duration-300 hover:z-20 hover:-translate-y-1 hover:shadow-2xl border rounded-2xl overflow-hidden min-h-[240px] p-6 cursor-pointer ${isDarkMode ? "bg-gradient-to-br from-[#1F263B] via-[#161B2A] to-[#0E121E] border-[#2E364F] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" : "bg-white border-slate-200 shadow-sm"} ${themeClass.hover}`}
                  style={{
                    backgroundImage: isDarkMode
                      ? `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.04) 1px, transparent 0)`
                      : `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.03) 1px, transparent 0)`,
                    backgroundSize: "24px 24px",
                  }}
                >
                  <div
                    className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${themeClass.accent || "from-blue-500"}`}
                  ></div>

                  <div
                    className={`absolute right-0 bottom-0 pointer-events-none transition-transform duration-700 group-hover:scale-110 opacity-30 dark:opacity-[0.25] ${themeClass.text || "text-blue-500"}`}
                  >
                    <SemanticUniqueWireframe templateName={temp.name} />
                  </div>

                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    {temp.isCustom && !temp.isCreateCard && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCustomTemplate(temp.id);
                          showToast("Custom Template Deleted");
                        }}
                        className={`p-2.5 rounded-xl backdrop-blur-md transition-all duration-300 ${isDarkMode ? "bg-red-500/20 text-red-400 border border-red-500/30 opacity-0 group-hover:opacity-100 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:bg-red-500/40 hover:text-red-300" : "bg-red-50 text-red-500 border border-red-200 opacity-0 group-hover:opacity-100 hover:bg-red-100"}`}
                        title="Delete template"
                      >
                        <X size={16} className="font-bold stroke-[3]" />
                      </button>
                    )}
                    {!temp.isCreateCard && (
                      <button
                        onClick={(e) => toggleFavorite(e, temp.id)}
                        className={`p-2.5 rounded-xl backdrop-blur-md transition-all duration-300 ${isFav ? (isDarkMode ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 opacity-100 shadow-[0_0_15px_rgba(251,191,36,0.2)]" : "bg-amber-50 text-amber-500 border border-amber-200 opacity-100") : isDarkMode ? "bg-[#13151a]/80 text-slate-500 border border-[#2E364F] opacity-0 group-hover:opacity-100 hover:text-amber-400" : "bg-white/80 text-slate-400 border border-slate-200 opacity-0 group-hover:opacity-100 hover:text-amber-500"}`}
                        title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                      >
                        <Star size={16} className={isFav ? "fill-current" : ""} />
                      </button>
                    )}
                  </div>

                  <div className="relative z-10 flex items-start justify-between mb-auto w-full pr-12">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 border backdrop-blur-sm ${isDarkMode ? "bg-[#1A2033] border-[#2E364F] " + (themeClass.text || "text-blue-400") : "bg-white border-slate-200 " + (themeClass.text || "text-blue-600")}`}
                    >
                      <SemanticUniqueIcon templateName={temp.name} size={28} />
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border shadow-sm ${isDarkMode ? "text-slate-300 bg-[#1A2033]/90 backdrop-blur-md border-[#2E364F]" : "text-slate-500 bg-white/80 backdrop-blur-md border-slate-200"}`}
                    >
                      {temp.category}
                    </span>
                  </div>

                  <div className="relative z-10 w-full mt-6">
                    <h3
                      className={`text-xl font-bold mb-2 transition-colors pr-4 ${isDarkMode ? "text-slate-100 group-hover:text-white" : "text-slate-800 group-hover:text-slate-900"}`}
                    >
                      {temp.name}
                    </h3>

                    <div className="relative overflow-hidden h-12">
                      <p
                        className={`absolute top-0 left-0 w-full text-sm font-medium leading-relaxed pr-6 transition-all duration-300 group-hover:-translate-y-12 group-hover:opacity-0 line-clamp-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                      >
                        {temp.desc || temp.description}
                      </p>
                      <div
                        className={`absolute top-12 left-0 w-full flex items-center gap-3 transition-all duration-300 group-hover:top-0 opacity-0 group-hover:opacity-100`}
                      >
                        {temp.isCreateCard ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowCreateForm(p => !p);
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95 ${isDarkMode ? "bg-indigo-500 text-white border border-indigo-400/50 hover:bg-indigo-400" : "bg-indigo-600 text-white border border-transparent hover:bg-indigo-700"}`}
                          >
                            <Sparkles size={16} /> Create Now
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveAiTemplate(temp);
                                setActiveTab("workspace");
                                showToast(`Template Set: ${temp.name}`);
                              }}
                              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95 ${isDarkMode ? "bg-indigo-500 text-white border border-indigo-400/50 hover:bg-indigo-400" : "bg-indigo-600 text-white border border-transparent hover:bg-indigo-700"}`}
                            >
                              Use Framework <ArrowRight size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewTemplate(temp);
                              }}
                              className={`flex-none p-2.5 rounded-xl flex items-center justify-center transition-all border active:scale-95 ${isDarkMode ? "bg-[#1F263B] text-slate-300 border-[#2E364F] hover:bg-[#2A344D] hover:text-white" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                              title="Preview Output"
                            >
                              <Eye size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
