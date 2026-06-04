import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "Личный кабинет — ENDMARKET",
  description: "Управление заказами, профилем и настройками аккаунта.",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
