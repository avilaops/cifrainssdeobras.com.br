import type { Metadata } from "next";
import { getServicePage } from "@/config/service-pages";
import { ServicePageView } from "@/components/sections/service-page-view";

const content = getServicePage("cno")!;

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
};

export default function CnoPage() {
  return <ServicePageView content={content} />;
}
