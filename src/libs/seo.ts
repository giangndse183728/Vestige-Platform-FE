import { Metadata } from "next";
import { DEFAULT_SEO } from "@/constants/seo";

export interface SEOMetadataConfig {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: {
      url: string;
      width: number;
      height: number;
      alt: string;
    };
    canonical?: string;
    noIndex?: boolean;
  }


export function generateSEOMetadata(config: SEOMetadataConfig): Metadata {
  const title = config.title || DEFAULT_SEO.title;
  const description = config.description || DEFAULT_SEO.description;
  const keywords = config.keywords || DEFAULT_SEO.keywords;
  const image = config.image || DEFAULT_SEO.image;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost"),
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: [image],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
    ...(config.canonical && {
      alternates: { canonical: config.canonical },
    }),
    ...(config.noIndex && {
      robots: { index: false, follow: true },
    }),
  };
}
