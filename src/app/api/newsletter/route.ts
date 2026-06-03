import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const Schema = z.object({
  email: z.string().email("Invalid email").max(254).toLowerCase().trim(),
});

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.EMAIL_FROM || "ENDMARKET <noreply@endmarket.ru>";
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || "";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 422 });
  }

  const { email } = parsed.data;

  if (resend) {
    try {
      // Add to audience if configured
      if (AUDIENCE_ID) {
        await resend.contacts.create({ email, audienceId: AUDIENCE_ID, unsubscribed: false });
      }
      // Send welcome email
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject: "Добро пожаловать — ENDMARKET",
        html: `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f3f3f1">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f3f1;padding:40px 20px">
    <tr><td>
      <table width="560" cellpadding="0" cellspacing="0" style="margin:0 auto;background:#0a0a0a;max-width:560px">
        <tr>
          <td style="padding:48px 48px 32px">
            <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:9px;letter-spacing:0.35em;text-transform:uppercase;color:rgba(248,248,246,0.4)">ENDMARKET</p>
            <h1 style="margin:20px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:28px;font-weight:900;color:#f8f8f6;line-height:1;letter-spacing:-0.01em">ПОДПИСКА<br>ОФОРМЛЕНА</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:0 48px 48px">
            <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:300;line-height:1.7;color:rgba(248,248,246,0.55)">Вы получите уведомление о новых объектах, закрытых превью и выставках — первыми.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 48px;border-top:1px solid rgba(255,255,255,0.06)">
            <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(248,248,246,0.25)">ENDMARKET — Кондиционеры Ballu, Haier, Hisense</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
      });
    } catch (err) {
      console.error("[newsletter] Email failed:", err);
      // Still return success (email is registered)
    }
  } else {
    console.log(`[newsletter] Subscription: ${email}`);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
