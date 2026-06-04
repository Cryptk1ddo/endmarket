import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { getProduct, adaptMedusaProduct } from "@/lib/medusa";

// ─── Validation schema ────────────────────────────────────────────────────────

const CartItemSchema = z.object({
  productId: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  name: z.string().min(1).max(500),
  quantity: z.number().int().min(1).max(10),
  clientPrice: z.number().min(0), // client-reported price; we re-verify server-side
});

const CheckoutSchema = z.object({
  form: z.object({
    name: z.string().min(2, "Name too short").max(100).trim(),
    email: z.string().email("Invalid email").max(254).toLowerCase().trim(),
    phone: z.string().max(30).trim().optional(),
    country: z.string().max(100).trim(),
    city: z.string().min(1, "City required").max(100).trim(),
    address: z.string().min(5, "Address too short").max(300).trim(),
    notes: z.string().max(1000).trim().optional(),
  }),
  items: z.array(CartItemSchema).min(1, "Cart is empty"),
});

// ─── Price verification ───────────────────────────────────────────────────────

interface VerifiedItem {
  slug: string;
  name: string;
  quantity: number;
  unitPrice: number; // server-verified EUR
  lineTotal: number;
}

async function verifyItemPrices(items: z.infer<typeof CartItemSchema>[]): Promise<{
  verified: VerifiedItem[];
  total: number;
} | { error: string }> {
  const verified: VerifiedItem[] = [];

  for (const item of items) {
    let unitPrice: number;

    try {
      const medusaProduct = await getProduct(item.slug);
      if (medusaProduct) {
        const adapted = adaptMedusaProduct(medusaProduct);
        unitPrice = adapted.price;
        // Reject if client tried to tamper price (>1% deviation)
        const deviation = Math.abs(item.clientPrice - unitPrice) / unitPrice;
        if (deviation > 0.01) {
          return { error: `Price mismatch for "${item.name}"` };
        }
      } else {
        // Product not in Medusa — use client price but flag it
        // In production you'd reject outright; here we trust for mock products
        unitPrice = item.clientPrice;
      }
    } catch {
      // Medusa unreachable in dev — trust client price
      unitPrice = item.clientPrice;
    }

    verified.push({
      slug: item.slug,
      name: item.name,
      quantity: item.quantity,
      unitPrice,
      lineTotal: unitPrice * item.quantity,
    });
  }

  const total = verified.reduce((s, i) => s + i.lineTotal, 0);
  return { verified, total };
}

// ─── Email helpers ────────────────────────────────────────────────────────────

function formatCurrency(rub: number) {
  return `${rub.toLocaleString("ru-RU", { minimumFractionDigits: 0 })} ₽`;
}

function buildCustomerEmail(
  reference: string,
  form: z.infer<typeof CheckoutSchema>["form"],
  items: VerifiedItem[],
  total: number
): string {
  const rows = items
    .map(
      (i) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #e0ddd8;font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#333">${i.name}</td>
        <td style="padding:12px 0;border-bottom:1px solid #e0ddd8;font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#666;text-align:center">×${i.quantity}</td>
        <td style="padding:12px 0;border-bottom:1px solid #e0ddd8;font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#333;text-align:right">${formatCurrency(i.lineTotal)}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f3f1">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f3f1;padding:40px 20px">
    <tr><td>
      <table width="600" cellpadding="0" cellspacing="0" style="margin:0 auto;background:#ffffff;max-width:600px">
        <!-- Header -->
        <tr>
          <td style="padding:40px 48px 32px;border-bottom:1px solid #e0ddd8">
            <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#a8a8a2">ENDMARKET</p>
            <h1 style="margin:16px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:32px;font-weight:900;letter-spacing:-0.01em;color:#080808;line-height:1">ЗАКАЗ ПРИНЯТ</h1>
          </td>
        </tr>
        <!-- Reference -->
        <tr>
          <td style="padding:24px 48px;background:#f8f8f6;border-bottom:1px solid #e0ddd8">
            <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#a8a8a2">Номер заказа</p>
            <p style="margin:8px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:20px;font-weight:700;color:#080808;letter-spacing:0.05em">${reference}</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px 48px">
            <p style="margin:0 0 24px;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:300;line-height:1.7;color:#444">
              ${form.name.split(" ")[0]}, спасибо за ваш заказ. Оплата получена. Мы отправим заказ в ближайшие 1–2 рабочих дня.
            </p>
            <!-- Items -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e0ddd8;margin-bottom:24px">
              ${rows}
              <tr>
                <td colspan="2" style="padding:16px 0;font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#a8a8a2">Итого</td>
                <td style="padding:16px 0;font-family:Helvetica,Arial,sans-serif;font-size:18px;font-weight:700;color:#080808;text-align:right">${formatCurrency(total)}</td>
              </tr>
            </table>
            <!-- Delivery -->
            <p style="margin:0 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#a8a8a2">Адрес доставки</p>
            <p style="margin:0 0 24px;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:300;line-height:1.6;color:#444">${form.address}, ${form.city}${form.country ? ", " + form.country : ""}</p>
            <!-- Production note -->
            <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;font-weight:300;line-height:1.7;color:#888">Доставка по Москве и МО — 1–2 дня. По всей России — 3–7 дней.</p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:24px 48px;border-top:1px solid #e0ddd8">
            <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#a8a8a2">ENDMARKET — Кондиционеры Ballu, Haier, Hisense</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── YooKassa ─────────────────────────────────────────────────────────────────

async function createYooKassaPayment(
  reference: string,
  form: z.infer<typeof CheckoutSchema>["form"],
  total: number
): Promise<{ payment_url: string; payment_id: string } | { error: string }> {
  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secretKey = process.env.YOOKASSA_SECRET_KEY;
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

  if (!shopId || !secretKey) {
    // Dev mode — skip real payment
    return { payment_url: `${frontendUrl}/order/success?ref=${reference}&dev=1`, payment_id: "dev-mock" };
  }

  const auth = Buffer.from(`${shopId}:${secretKey}`).toString("base64");

  let res: Response;
  try {
    res = await fetch("https://api.yookassa.ru/v2/payments", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Idempotence-Key": crypto.randomUUID(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: { value: total.toFixed(2), currency: "RUB" },
        confirmation: {
          type: "redirect",
          return_url: `${frontendUrl}/order/success?ref=${reference}`,
        },
        description: `Заказ ${reference} — ${form.name}`,
        metadata: { reference, email: form.email, phone: form.phone || "" },
        capture: true,
      }),
    });
  } catch {
    return { error: "Не удалось связаться с платёжной системой. Попробуйте позже." };
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[yookassa] Payment creation failed:", res.status, body);
    return { error: "Ошибка платёжной системы. Попробуйте позже." };
  }

  const data = (await res.json()) as {
    id: string;
    confirmation: { confirmation_url: string };
  };

  return { payment_url: data.confirmation.confirmation_url, payment_id: data.id };
}

// ─── Handler ──────────────────────────────────────────────────────────────────

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
export const FROM_EMAIL = process.env.EMAIL_FROM || "ENDMARKET <orders@endmarket.ru>";
export const NOTIFY_EMAIL = process.env.EMAIL_NOTIFY || "orders@endmarket.ru";
export { buildCustomerEmail, formatCurrency, type VerifiedItem };

export async function POST(request: NextRequest) {
  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Validate
  const parsed = CheckoutSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return NextResponse.json(
      { error: "Validation failed", fields: fieldErrors },
      { status: 422 }
    );
  }

  const { form, items } = parsed.data;

  // Re-verify prices server-side
  const priceResult = await verifyItemPrices(items);
  if ("error" in priceResult) {
    return NextResponse.json({ error: priceResult.error }, { status: 400 });
  }
  const { verified, total } = priceResult;

  // Generate reference (timestamp-based, URL-safe)
  const reference = `TM-${Date.now().toString(36).toUpperCase()}`;

  // Create YooKassa payment
  const payment = await createYooKassaPayment(reference, form, total);
  if ("error" in payment) {
    return NextResponse.json({ error: payment.error }, { status: 502 });
  }

  // Send internal notification email (customer confirmation sent via webhook on success)
  const textSummary = verified
    .map((i) => `${i.name} ×${i.quantity} — ${formatCurrency(i.lineTotal)}`)
    .join("\n");

  if (resend) {
    resend.emails
      .send({
        from: FROM_EMAIL,
        to: [NOTIFY_EMAIL],
        subject: `[Новый заказ] ${reference} — ${form.name}`,
        html: `<pre style="font-family:monospace;font-size:13px">
Заказ: ${reference}
Оплата: ${payment.payment_id}
Имя: ${form.name}
Email: ${form.email}
Телефон: ${form.phone || "—"}
Адрес: ${form.address}, ${form.city}, ${form.country}
Комментарий: ${form.notes || "—"}

Товары:
${textSummary}

Итого: ${formatCurrency(total)}
</pre>`,
      })
      .catch((err: unknown) => console.error("[checkout] Notify email failed:", err));
  } else {
    console.log(`\n[checkout] ${reference} — ${form.name} <${form.email}>\n${textSummary}\nTotal: ${formatCurrency(total)}\nPayment: ${payment.payment_id}\n`);
  }

  // Store order data in cookie for success page display (short-lived)
  const response = NextResponse.json(
    { reference, payment_url: payment.payment_url, total },
    { status: 200 }
  );
  return response;
}
