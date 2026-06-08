import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type DesignSystemTone =
  | "neutral"
  | "premium"
  | "success"
  | "warning"
  | "error"
  | "info";

export type DesignSystemDensity = "standard" | "compact";

export type IconComponent = LucideIcon;

export type DesignSystemAction = ReactNode;
