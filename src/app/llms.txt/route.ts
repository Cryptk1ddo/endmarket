import { products } from "@/lib/products";

export const dynamic = "force-static";

export function GET() {
  const base = "https://endmarket.ru";

  const productList = products
    .map((p) => `- [${p.name}](${base}/product/${p.slug}): ${p.description ?? ""} — ₽${p.price.toLocaleString("ru-RU")}`)
    .join("\n");

  const body = `# ENDMARKET

> Официальный интернет-магазин кондиционеров и сплит-систем. Москва, Россия.

ENDMARKET — авторизованный дистрибьютор климатической техники Ballu, Haier, Hisense и Daikin в России. Продажа, доставка и профессиональный монтаж. Официальная гарантия производителя. Основан в 2024 году.

## Что мы делаем

- Продаём инверторные кондиционеры и сплит-системы ведущих брендов
- Доставляем по всей России (курьер, СДЭК, Boxberry, Почта России)
- Устанавливаем кондиционеры в Москве и Московской области
- Предоставляем официальную гарантию производителя
- Бесплатный выезд и замер при регистрации

## Бренды

- **Ballu** — Россия/Китай, осн. 1997. Надёжные инверторы для квартир и офисов.
- **Haier** — Китай, осн. 1984. Мировой лидер; серия AS TT4HRA с самоочисткой.
- **Hisense** — Китай, осн. 1969. Тихие инверторы (17 дБ), серия HR4SYDKG.
- **Daikin** — Япония, осн. 1924. Премиум-класс, Flash Streamer, серия FTXA-AW.

## Каталог товаров

${productList}

## Основные страницы

- [Каталог](${base}/collection)
- [Бренды](${base}/brands)
- [Монтаж и наладка](${base}/installation)
- [Доставка](${base}/delivery)
- [Гарантии](${base}/guarantee)
- [О компании](${base}/about)
- [Контакты](${base}/contact)
- [Шоурум](${base}/showroom)

## Контакт

- Email: info@endmarket.ru
- Сайт: ${base}
- Адрес: Москва, Россия

## Условия

- Возврат: 14 дней
- Гарантия: 24 месяца (официальная от производителя)
- Доставка по Москве: 1–2 дня; по России: 3–7 рабочих дней
- Оплата: банковская карта, наличные
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
