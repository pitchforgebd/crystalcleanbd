import { listBlogCategories } from "@/lib/repository/blog";
import { AdminBlogCategoriesClient } from "@/app/admin/blog/categories/AdminBlogCategoriesClient";

export default async function AdminBlogCategoriesPage() {
  const categories = await listBlogCategories();
  return <AdminBlogCategoriesClient initial={categories} />;
}
