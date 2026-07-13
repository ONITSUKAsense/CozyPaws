import client from "./client";
import type { BlogPost } from "../types/blog";

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const { data } = await client.get("/blog");
  return data;
}

export async function fetchBlogPost(slug: string): Promise<BlogPost> {
  const { data } = await client.get(`/blog/${slug}`);
  return data;
}
