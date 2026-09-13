import { listBlogCategories, listBlogPosts } from "@/lib/repository/blog";
import { AdminBlogPostsClient } from "@/app/admin/blog/posts/AdminBlogPostsClient";

export default async function AdminBlogPostsPage() {
  const [posts, categories] = await Promise.all([
    listBlogPosts(),
    listBlogCategories(),
  ]);
  return <AdminBlogPostsClient initial={{ posts, categories }} />;
}
