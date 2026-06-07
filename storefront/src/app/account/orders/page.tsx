import { redirect } from "next/navigation"
import { getCurrentCustomer } from "@/lib/medusa/account"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function OrdersPage() {
  const customer = await getCurrentCustomer()

  if (!customer) redirect("/account/login")

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16">
      <a href="/account" className="text-sm underline">← Назад</a>

      <h1 className="mt-6 text-3xl font-semibold">Заказы</h1>

      <div className="mt-8 rounded-2xl border border-dashed p-8 text-center">
        <h2 className="font-medium">История заказов появится после checkout</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Следующий шаг: корзина → YooKassa → заказ → история заказов.
        </p>
      </div>
    </main>
  )
}
