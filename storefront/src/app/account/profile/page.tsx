import { redirect } from "next/navigation"
import { getCurrentCustomer } from "@/lib/medusa/account"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ProfilePage() {
  const customer = await getCurrentCustomer()

  if (!customer) redirect("/account/login")

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16">
      <a href="/account" className="text-sm underline">← Назад</a>

      <h1 className="mt-6 text-3xl font-semibold">Профиль</h1>

      <div className="mt-8 rounded-2xl border p-6">
        <p>Email: {customer.email}</p>
        <p className="mt-3">
          Имя: {[customer.first_name, customer.last_name].filter(Boolean).join(" ") || "Не указано"}
        </p>
        <p className="mt-3">Телефон: {customer.phone || "Не указан"}</p>
      </div>
    </main>
  )
}
