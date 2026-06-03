import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { FROM_EMAIL, NOTIFY_EMAIL, buildCustomerEmail, formatCurrency } from "@/app/api/checkout/route";

// ─── YooKassa notification types ─────────────────────────────────────────────

interface YKAmount {
  value: string;
  currency: string;
}

interface YKPayment {
  id: string;
  status: "pending" | "waiting_for_capture" | "succeeded" | "canceled";
  amount: YKAmount;
  description?: string;
  metadata?: {
    reference?: string;
    email?: string;
    phone?: string;
  };
}

interface YKNotification {
  type: "notification";
  event: string;
  object: YKPayment;
}

// ─── Verify payment via re-fetch ──────────────────────────────────────────────

async function verifyPayment(paymentId: string): Promise<YKPayment | null> {
  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secretKey = process.env.YOOKASSA_SECRET_KEY;
  if (!shopId || !secretKey) return null;

  const auth = Buffer.from(`${shopId}:${secretKey}`).toString("base64");
  try {
    const res = await fetch(`https://api.yookassa.ru/v2/payments/${paymentId}`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!res.ok) return null;
    return (await res.json()) as YKPayment;
  } catch {
    return null;
  }
}

// ─── Handler ─────────────────────────────────────────────────────────────────

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const notification = body as Partial<YKNotification>;
  if (notification.type !== "notification" || !notification.object?.id) {
    return NextResponse.json({ ok: true }); // Ignore unknown events
  }

  const { event, object } = notification as YKNotification;

  if (event === "payment.succeeded") {
    // Re-verify with YooKassa to prevent spoofing
    const verified = await verifyPayment(object.id);
    if (!verified || verified.status !== "succeeded") {
      console.warn("[yookassa webhook] Payment not verified:", object.id);
      return NextResponse.json({ ok: true });
    }

    const { reference, email, phone } = verified.metadata || {};
    const totalRub = parseFloat(verified.amount.value);

    console.log(`[yookassa webhook] Payment succeeded: ${reference} — ${verified.amount.value} ${verified.amount.currency}`);

    // Send customer confirmation email
    if (resend && email && reference) {
      const form = {
        name: verified.description?.replace(`Заказ ${reference} — `, "") || "Покупатель",
        email,
        phone: phone || "",
        country: "Россия",
        city: "",
        address: "",
        notes: undefined as string | undefined,
      };

      const html = buildCustomerEmail(
        reference,
        form,
        [], // Items not stored on webhook — show total only
        totalRub
      );

      resend.emails
        .send({
          from: FROM_EMAIL,
          to: [email],
          subject: `Оплата подтверждена — Заказ ${reference}`,
          html,
        })
        .catch((err: unknown) => console.error("[yookassa webhook] Email failed:", err));

      resend.emails
        .send({
          from: FROM_EMAIL,
          to: [NOTIFY_EMAIL],
          subject: `[ОПЛАЧЕН] ${reference}`,
          html: `<pre style="font-family:monospace;font-size:13px">
Заказ ${reference} оплачен.
Сумма: ${formatCurrency(totalRub)}
Email: ${email}
Телефон: ${phone || "—"}
YooKassa ID: ${verified.id}
</pre>`,
        })
        .catch((err: unknown) => console.error("[yookassa webhook] Notify email failed:", err));
    }
  } else if (event === "payment.canceled") {
    const { reference } = object.metadata || {};
    console.log(`[yookassa webhook] Payment canceled: ${reference} — ${object.id}`);
  }

  // Always return 200 — YooKassa retries on non-2xx
  return NextResponse.json({ ok: true });
}
