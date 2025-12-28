"use client";

import { useEffect } from "react";
import {
  trackTagPageView,
  trackClothingPageView,
  trackGuidePageView,
  trackEraHubPageView,
} from "@/lib/analytics";

interface TagPageViewProps {
  tagId: number;
  brandSlug: string;
  era?: string;
  category: string;
}

export function TagPageViewTracker({
  tagId,
  brandSlug,
  era,
  category,
}: TagPageViewProps) {
  useEffect(() => {
    trackTagPageView({ tagId, brandSlug, era, category });
  }, [tagId, brandSlug, era, category]);

  return null;
}

interface ClothingPageViewProps {
  clothingSlug: string;
  brandSlugs: string[];
  era?: string;
}

export function ClothingPageViewTracker({
  clothingSlug,
  brandSlugs,
  era,
}: ClothingPageViewProps) {
  useEffect(() => {
    trackClothingPageView({ clothingSlug, brandSlugs, era });
  }, [clothingSlug, brandSlugs, era]);

  return null;
}

interface GuidePageViewProps {
  guideSlug: string;
  brandSlug?: string;
}

export function GuidePageViewTracker({
  guideSlug,
  brandSlug,
}: GuidePageViewProps) {
  useEffect(() => {
    trackGuidePageView({ guideSlug, brandSlug });
  }, [guideSlug, brandSlug]);

  return null;
}

interface EraHubPageViewProps {
  era: string;
}

export function EraHubPageViewTracker({ era }: EraHubPageViewProps) {
  useEffect(() => {
    trackEraHubPageView({ era });
  }, [era]);

  return null;
}
