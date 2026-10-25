# Cemetery of Scream — site v3

Статичний двомовний сайт гурту: **польська** та **англійська** версії, splash із вибором мови, біографія, дискографія з gatefold-трекілистами, галерея-плівка, live-секція й контакти.

- **Арт-напрям:** Black Requiem
- **Стек:** HTML + CSS + vanilla JS; без фреймворків, без збірки, без бекенду
- **Шрифти:** локальні `.woff2` (Cormorant Garamond, Barlow, IBM Plex Mono)
- **Мови:** PL (`/pl/`), EN (`/en/`), splash (`/`)

---

## Як подивитися локально

Не відкривайте `index.html` подвійним кліком у Chrome: деякі браузери блокують `@font-face` і manifest із `file://` через CORS. Запустіть простий сервер:

```powershell
cd "D:\!_programs\OpenCode prejekt\WEB\Site-Cemetery-of-Scream\web-page-wersion3"
python -m http.server 8000
```

Потім відкрийте <http://127.0.0.1:8000/>.

Якщо Python немає — підійде будь-який статичний сервер (Live Server у VS Code, `npx serve`, IIS, Apache).

---

## Структура

```
index.html                 splash: фото, мета, контакти, PL/EN
pl/index.html              польська версія
en/index.html              англійська версія
404.html                   сторінка помилки
assets/css/tokens.css      дизайн-токени
assets/css/site.css        компоненти й адаптив
assets/js/releases.js      дані дискографії та фото
assets/js/site.js          меню, reveal, scrollspy, gatefold, reel, lightbox
assets/js/motion.js        м'який скрол для меню та кнопки «вгору»
assets/js/ui.js            кнопка «вгору»
assets/fonts/              10 woff2
assets/img/hero/           портрет: 1643 / 1100 / 760 + mobile portrait
assets/img/gallery/full/   29 кадрів 1600 px
assets/img/gallery/thumbs/ 29 thumb
assets/img/covers/         8 обкладинок + thumbs
assets/img/logo/           logo-black.png, logo-white.png
assets/img/og.jpg          1200×630
site.webmanifest
robots.txt
```

---

## Що редагувати

- **Тексти PL/EN** — безпосередньо в `pl/index.html` та `en/index.html`. Якщо змінюєте біографію, змініть обидві версії.
- **Після змін CSS/JS** — збільште `?v=6` у посиланнях на `tokens.css`, `site.css` і скрипти в HTML, щоб браузер не показував стару версію з кешу.
- **Дискографія** — `assets/js/releases.js`: об'єкт `COS_RELEASES` (назви, роки, лейбли, треклисти, нотатки) і `COS_LABELS` (підписи інтерфейсу).
- **Галерея** — HTML-розмітка в `widma` / `spectres` + `assets/js/releases.js` (`COS_PHOTOS`) для лайтбокса. Нові фото: покладіть `full/` і `thumbs/`, додайте `figure` у HTML і `COS_PHOTOS`.
- **Кольори/типографіка** — `assets/css/tokens.css`; компоненти читають семантичні токени.
- **Логотип** — `assets/img/logo/logo-white.png` (для темного) і `logo-black.png`.
- **OG-зображення** — `assets/img/og.jpg` (1200×630).

---

## Перед публікацією

Сайт свідомо не містить вигаданого домену. Коли домен буде відомий:

1. Додайте `<link rel="canonical">` на кожну сторінку.
2. Додайте `hreflang` для `pl`, `en`, `x-default` (абсолютні URL).
3. Замініть відносні `og:image` / `twitter:image` на абсолютні.
4. Додайте `sitemap.xml` і `Sitemap:` у `robots.txt`.
5. Перевірте, що сайт відкривається за фінальним URL, а не лише з диска.

Деплой на GitHub Pages:

- покладіть вміст цієї папки в `github-pages/version-3/`;
- у налаштуваннях репозиторію GitHub Pages корінь уже налаштований на `main` / root;
- після білда перевірте `/version-3/`, `/version-3/pl/`, `/version-3/en/`;
- відносні шляхи працюють і на підшляху, і в корені.

---

## Доступність і продуктивність

- один `<h1>` на сторінку, landmarks, skip-link;
- усі зображення з `alt`; декоративні — `alt=""`;
- фокус-кільце, клавіатурні діалоги, `aria-current`, `aria-expanded`;
- `prefers-reduced-motion` вимикає рух;
- hero не lazy, галерея lazy, явні `width`/`height`;
- локальні шрифти, один preload, без третіх сторін.

Детальний розбір — у [PLAN.md](PLAN.md). Кредити й ліцензії — у [CREDITS.md](CREDITS.md).

---

## Резервна копія

Після фінальної перевірки папка копіюється до:

```
D:\MEGA-virtual-drive\project-WEB\Site-Cemetery-of-Scream\web-page-wersion3\
```

Копія має збігатися з робочою за вмістом (без `_info`, без тимчасових файлів).



