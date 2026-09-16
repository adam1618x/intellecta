export interface Publication {
    id: number;
    title: string;
    excerpt: string;
    content?: string;
    date: string;
    category: CategoryKey;
    author?: string;
}

export const CATEGORIES = [
    { key: "courses", slug: "courses" },
    { key: "programming", slug: "programming" },
    { key: "mathematics", slug: "mathematics" },
    { key: "sciences", slug: "sciences" },
    { key: "business", slug: "business" },
    { key: "languages", slug: "languages" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];
export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

