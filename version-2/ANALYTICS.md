# Аналітика без cookies — практична інструкція

**Статус:** аналітика **не активована**. Сайт зараз не ставить cookies, не використовує трекери й не потребує cookie-баннера. Це свідоме рішення до вибору домену й хостингу.

Мета — бачити прості цифри (візити, сторінки, джерела, країни), не збираючи персональні дані й не додаючи consent-банер.

---

## Що рекомендую

### Варіант A — Cloudflare Web Analytics (найпростіший)

Підходить, якщо сайт буде на **Cloudflare Pages** або домен буде доданий до Cloudflare.

- безкоштовно;
- без cookies;
- без consent-баннера;
- показує page views, top pages, referrers, countries, Core Web Vitals;
- скрипт легкий, не сповільнює сайт.

**Кроки:**

1. Додай домен до Cloudflare (або задеплой сайт на Cloudflare Pages).
2. У Cloudflare Dashboard → **Analytics & Logs → Web Analytics** → **Add a site**.
3. Скопіюй snippet (він виглядає як `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"..."}'></script>`).
4. Встав snippet перед `</body>` на всіх трьох сторінках:
   - `index.html`
   - `pl/index.html`
   - `en/index.html`
5. Задеплой і перевір Dashboard через 5–10 хвилин.
6. Додай у футер посилання на коротку privacy-сторінку (див. нижче).

### Варіант B — Plausible Analytics

Підходить, якщо хочеться окремий простий дашборд і незалежність від Cloudflare.

- платний (є trial), EU-хостинг;
- без cookies;
- без consent-баннера;
- дуже простий інтерфейс.

**Кроки:**

1. Зареєструйся на [plausible.io](https://plausible.io/), додай домен.
2. Отримай snippet:
   ```html
   <script defer data-domain="your-domain.com" src="https://plausible.io/js/script.js"></script>
   ```
3. Встав перед `</body>` на всіх трьох сторінках.
4. Перевір Dashboard.

### Варіант C — Umami

Для тих, хто готовий самостійно розгорнути аналітику (Vercel/Railway/VPS + PostgreSQL). Безкоштовно, open-source, без cookies, але потребує технічного налаштування. Не рекомендую як перший крок.

---

## Чого не робити

- **Google Analytics / Google Tag Manager** — потребує consent-баннера, cookie-policy й додаткового налаштування. Для такого сайту це overkill.
- **Facebook Pixel** — те саме; до того ж це рекламний трекер.
- **Будь-який скрипт із CDN без перевірки** — зайвий зовнішній запит і потенційна проблема з приватністю.

---

## Privacy-сторінка

Коли аналітика буде активована, додай коротку сторінку `privacy.html` (PL/EN) з такими пунктами:

- який сервіс використовується (Cloudflare Web Analytics або Plausible);
- які дані збираються (агреговані page views, referrer, country, device type);
- cookies не використовуються;
- правова підстава (legitimate interest / privacy-friendly analytics);
- контакт для питань;
- дата оновлення.

Посилилання на privacy-сторінку — у футері поруч із copyright.

---

## Де вставляти snippet

У всіх трьох HTML-файлах, **перед** підключенням `site.js` або одразу після нього, але до `</body>`:

```html
<!-- Privacy-friendly analytics: activate after the domain is live. See ANALYTICS.md. -->
<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"YOUR_TOKEN"}'></script>
```

Для Plausible:

```html
<script defer data-domain="your-domain.com" src="https://plausible.io/js/script.js"></script>
```

Не додавай аналітику, поки не обрано домен: без нього дані будуть неповними, а privacy-сторінка не матиме коректної назви сервісу.

---

## Що вже є в коді

У кожній сторінці перед `site.js` стоїть комментар-нагадування:

```html
<!-- Privacy-friendly analytics: activate after hosting/domain. See ANALYTICS.md. -->
```

Це не активний трекер, а точка підключення. Після вибору хостингу й сервісу я можу додати snippet, privacy-сторінку й перевірити, що сторонніх cookies немає.
