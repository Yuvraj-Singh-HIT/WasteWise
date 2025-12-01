import type { LucideIcon } from 'lucide-react';
import { Bot, Recycle, FileText, GlassWater, Leaf, Trash2, Package } from 'lucide-react';

export type WasteInfo = {
  icon: LucideIcon;
  description: string;
  segregation: string;
  colorClass: string;
};

export const wasteData: Record<string, WasteInfo> = {
  plastic: {
    icon: Recycle,
    description: "Includes bottles, containers, bags, and packaging.",
    segregation: "Rinse containers and remove lids. Check local recycling guidelines for specific plastic types accepted.",
    colorClass: "text-chart-1",
  },
  paper: {
    icon: FileText,
    description: "Newspaper, cardboard, office paper, and magazines.",
    segregation: "Keep it clean and dry. Flatten cardboard boxes. Avoid waxed or plastic-coated paper.",
    colorClass: "text-chart-4",
  },
  glass: {
    icon: GlassWater,
    description: "Glass bottles and jars of all colors.",
    segregation: "Rinse and remove lids. Do not include window panes, light bulbs, or ceramics.",
    colorClass: "text-chart-2",
  },
  organic: {
    icon: Leaf,
    description: "Food scraps, yard trimmings, and other compostable materials.",
    segregation: "Use a compost bin. Avoid meat, dairy, and oily foods if composting at home.",
    colorClass: "text-chart-5",
  },
  metal: {
    icon: Package,
    description: "Aluminum cans, steel cans, and foil.",
    segregation: "Rinse cans and foil. Labels can usually be left on.",
    colorClass: "text-muted-foreground",
  },
  other: {
    icon: Trash2,
    description: "Items that are not recyclable or compostable.",
    segregation: "Dispose of in your general waste bin. This includes mixed-material packaging, broken ceramics, etc.",
    colorClass: "text-destructive",
  },
  unknown: {
    icon: Bot,
    description: "Could not confidently determine the waste type.",
    segregation: "When in doubt, it's safer to place it in general waste to avoid contaminating recycling streams.",
    colorClass: "text-foreground",
  }
};

export const getWasteInfo = (wasteType?: string): WasteInfo & { type: string } => {
  if (!wasteType) {
    return { ...wasteData.unknown, type: 'Unknown' };
  }
  const normalizedType = wasteType.toLowerCase();
  for (const key in wasteData) {
    if (key !== 'unknown' && key !== 'other' && normalizedType.includes(key)) {
      return { ...wasteData[key], type: key.charAt(0).toUpperCase() + key.slice(1) };
    }
  }
  return { ...wasteData.other, type: 'Other' };
};
