import postsJson from "../data/posts.json";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  author: string;
  authorAvatar: string;
  image: string;
  categorySlug: string;
  tags: string[];
  relatedCourseSlug?: string;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return postsJson as BlogPost[];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) || null;
}

export async function getBlogPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  return posts.filter((p) => p.categorySlug === categorySlug);
}
