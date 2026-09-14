import type { Metadata } from "next";
import { getServicePage } from "@/config/service-pages";
import { ServicePageView } from "@/components/sections/service-page-view";

const content = getServicePage("sero")!;

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
};

export default function SeroPage() {
  return <ServicePageView content={content} />;
}
