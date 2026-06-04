import type { Metadata } from "next";
import WishlistClient from "@/components/wishlist/WishlistClient";

export const metadata: Metadata = {
  title: "Избранное",
  description: "Сохранённые объекты ENDMARKET",
};

export default function WishlistPage() {
  return <WishlistClient />;
}
