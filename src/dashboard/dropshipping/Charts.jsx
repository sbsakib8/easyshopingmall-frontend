"use client";

import dynamic from "next/dynamic";

const AreaChart = dynamic(
  () => import("recharts").then((mod) => mod.AreaChart),
  { ssr: false }
);
const Area = dynamic(
  () => import("recharts").then((mod) => mod.Area),
  { ssr: false }
);
const PieChart = dynamic(
  () => import("recharts").then((mod) => mod.PieChart),
  { ssr: false }
);
const Pie = dynamic(
  () => import("recharts").then((mod) => mod.Pie),
  { ssr: false }
);
const Cell = dynamic(
  () => import("recharts").then((mod) => mod.Cell),
  { ssr: false }
);
const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);
const CartesianGrid = dynamic(
  () => import("recharts").then((mod) => mod.CartesianGrid),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("recharts").then((mod) => mod.Tooltip),
  { ssr: false }
);
const XAxis = dynamic(
  () => import("recharts").then((mod) => mod.XAxis),
  { ssr: false }
);
const YAxis = dynamic(
  () => import("recharts").then((mod) => mod.YAxis),
  { ssr: false }
);

export {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
};
