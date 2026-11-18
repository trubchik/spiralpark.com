/* Spiral Flora — концепт: данные, главная, страница растения.
   Весь вывод данных из таблицы идёт через textContent / createElement (без innerHTML). */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const norm = (s) => (s || '').toLowerCase().replace(/ё/g, 'е');
  const safeUrl = (u) => (/^https?:\/\//i.test(u || '') ? u : '');

  Element.prototype.put = function (...kids) { this.replaceChildren(...kids.flat().filter((k) => k != null && k !== false && k !== '')); return this; };
  function el(tag, props, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'href') { if (/^(https?:|flora|index|#|mailto:)/.test(v)) n.setAttribute('href', v); }
      else n.setAttribute(k, v === true ? '' : v);
    }
    kids.flat().forEach((c) => c != null && c !== false && c !== '' && n.append(c.nodeType ? c : document.createTextNode(c)));
    return n;
  }
  const svgNode = (markup) => document.importNode(new DOMParser().parseFromString(markup, 'image/svg+xml').documentElement, true);
  const artFor = (p) => svgNode(window.floraArt({ ...p, name: (p.name_ru || '').replace(/[<>"&']/g, '') }));

  // ── Language ──
  let LANG = 'ru';
  try { LANG = new URLSearchParams(location.search).get('lang') || localStorage.getItem('flora-lang') || 'ru'; } catch (_) {}
  if (LANG !== 'en') LANG = 'ru';
  const I = {
    ru: {
      'doc.title': 'Spiral Flora — живой атлас нашей земли', 'hero.eyebrow': 'Spiral Flora · Мадейра', 'hero.h1': ['Живой атлас ', 'нашей земли.', ''],
      'ways.h2': ['Смотреть. ', 'Гулять.', ' Ждать сезона.'], 'ways.1t': 'Атлас', 'ways.2t': 'Прогулка', 'ways.3t': 'Сезоны',
      'atlas.eyebrow': 'Spiral Flora', 'atlas.h2': ['', 'Атлас', ''], 'walk.eyebrow': 'Прогулка', 'walk.h2': ['Найти. ', 'Побыть рядом.', ''],
      'seasons.eyebrow': 'Сезоны', 'seasons.h2': ['Времена ', 'природы', ''], 'mirror.q': ['Природа как ', 'зеркало.', ''],
      'foot.op': 'Оператор: Ruslan Trubchik · NIF 311270530', 'foot.flora': 'Флора', 'foot.follow': 'Мы в сетях', 'foot.legal': 'Документы',
      'foot.tg': 'Сообщество (Telegram)', 'foot.booking': 'Условия бронирования', 'foot.privacy': 'Политика конфиденциальности',
      'foot.dispute': 'Разрешение споров', 'foot.rights': '© 2026 Spiral — все права защищены',
      'nav.explore': 'Атлас', 'nav.walk': 'Прогулка', 'nav.seasons': 'Сезоны',
      'hero.lead': (n) => `«${n} растений и грибов: чем они полезны и чего стоит остерегаться».`,
      'hero.cta1': 'Открыть атлас', 'hero.cta2': 'Прогулка',
      'f.all': 'организмов', 'f.banya': 'для бани', 'f.food': 'съедобных', 'f.toxic': 'ядовитых',
      'ways.eyebrow': 'Три способа войти',
      'ways.1': 'Что растёт на нашей земле и чем это полезно: баня, чай, еда, древесина, мёд. И чего стоит остерегаться.', 'ways.1a': 'Открыть атлас',
      'ways.2': 'Одно растение на прогулку: найти, рассмотреть, вспомнить, на что оно годится.', 'ways.2a': 'Выбрать прогулку',
      'ways.3': 'Что цветёт, плодоносит и где искать грибы в каждое время года на Мадейре.', 'ways.3a': 'Времена природы',
      'atlas.lead': 'Ищите по названию, латыни или по пользе: для бани, чая, еды, древесины.',
      'atlas.search': 'Найти растение или пользу: «баня», «чай», «мебель»…', 'atlas.more': 'Показать ещё',
      'atlas.all': 'Всё', 'atlas.archive': 'Архив', 'atlas.usesLabel': 'Для чего', 'atlas.toxic': 'Ядовитые',
      'atlas.shown': (a, b) => `Показано ${a} из ${b}`, 'atlas.found': (a, b) => `Найдено ${a} из ${b}`, 'atlas.empty': 'Ничего не найдено. Попробуйте другое слово.',
      'walk.intro': 'Растение, которое сейчас в сезоне: цветёт или плодоносит. Выйдите на тропу и найдите его. Рассмотрите листья, цветы, плоды. Вспомните, на что оно годится.',
      'walk.for': 'Приглашение', 'walk.open': 'Открыть карточку', 'walk.next': 'Другое растение', 'walk.no': 'Образец №',
      'seasons.lead': 'Что цветёт, что плодоносит и когда идут грибы — по месяцам, для климата Мадейры.',
      'seasons.now': 'Сейчас', 'seasons.bloom': 'Цветёт', 'seasons.fruit': 'Плоды и шишки', 'seasons.fungi': 'Грибы',
      'seasons.all': (n) => `Показать все (${n})`, 'seasons.less': 'Свернуть', 'seasons.none': 'Отметок пока нет.',
      'seasons.note': 'Месяцы ориентировочные: типичные сроки вида на Мадейре. Уточняем их по наблюдениям на участке.',
      'seasons.list': [['Весна', 'март — май'], ['Лето', 'июнь — август'], ['Осень', 'сентябрь — ноябрь'], ['Зима', 'декабрь — февраль']],
      'mirror.p': 'Каждое растение живёт по своим законам и чем-то делится с нами: теплом, вкусом, запахом, деревом.', 'mirror.cta': 'Продолжить исследование',
      'foot.tag': 'Spiral Flora — живой атлас нашей земли.', 'foot.note': 'Сведения о пользе и лечебных свойствах не заменяют консультацию врача.',
      'p.prev': '← Предыдущее', 'p.next': 'Следующее →', 'p.share': 'Поделиться ссылкой', 'p.copied': 'Ссылка скопирована',
      'p.uses': 'Чем полезно', 'p.med': 'Лечебное', 'p.wood': 'Древесина', 'p.safety': 'Безопасность', 'p.more': 'Узнать больше', 'p.encounter': 'В Spiral',
      'p.idconf': 'Определение вида', 'p.safetyAx': 'Безопасность', 'p.nouses': 'Практической пользы не известно.',
      'p.wikiRu': 'Википедия', 'p.wikiEn': 'Wikipedia (англ.)',
      'p.photoSpecies': 'Фото вида, не с участка.', 'p.photoGenus': 'Фото рода, не с участка.', 'p.illus': 'Иллюстрация-символ, не фото растения.',
      'p.spiralPhoto': 'Фото из Spiral', 'p.noSpiralPhoto': 'Оригинальной фотографии пока нет.', 'p.medNote': 'Не заменяет консультацию врача.',
      'p.bloom': 'Цветение', 'p.fruit': 'Плоды', 'p.fungi': 'Плодовые тела',
    },
    en: {
      'doc.title': 'Spiral Flora — The living atlas of our land', 'hero.eyebrow': 'Spiral Flora · Madeira', 'hero.h1': ['The living atlas ', 'of our land.', ''],
      'ways.h2': ['Look. ', 'Walk.', ' Wait for the season.'], 'ways.1t': 'Explore Flora', 'ways.2t': 'Walk with Nature', 'ways.3t': 'Seasons',
      'atlas.eyebrow': 'Explore Flora', 'atlas.h2': ['The ', 'atlas', ''], 'walk.eyebrow': 'Walk with Nature', 'walk.h2': ['Find it. ', 'Stay a while.', ''],
      'seasons.eyebrow': 'Seasons', 'seasons.h2': ['Times of ', 'nature', ''], 'mirror.q': ['Nature as a ', 'mirror.', ''],
      'foot.op': 'Operated by Ruslan Trubchik · NIF 311270530', 'foot.flora': 'Flora', 'foot.follow': 'Follow', 'foot.legal': 'Legal',
      'foot.tg': 'Community (Telegram)', 'foot.booking': 'Booking Conditions', 'foot.privacy': 'Privacy Policy',
      'foot.dispute': 'Consumer Dispute Resolution', 'foot.rights': '© 2026 Spiral — All rights reserved',
      'nav.explore': 'Explore', 'nav.walk': 'Walk', 'nav.seasons': 'Seasons',
      'hero.lead': (n) => `“${n} plants and fungi: what they are good for, and what to watch out for.”`,
      'hero.cta1': 'Explore the atlas', 'hero.cta2': 'Walk with nature',
      'f.all': 'organisms', 'f.banya': 'for the banya', 'f.food': 'edible', 'f.toxic': 'toxic',
      'ways.eyebrow': 'Three ways in',
      'ways.1': 'What grows on our land and what it is good for: banya, tea, food, wood, honey. And what to be careful with.', 'ways.1a': 'Open the atlas',
      'ways.2': 'One plant per walk: find it, look closely, remember what it is good for.', 'ways.2a': 'Choose a walk',
      'ways.3': 'What flowers, fruits and where to look for mushrooms in each season on Madeira.', 'ways.3a': 'Times of nature',
      'atlas.lead': 'Search by name, Latin name or use: banya, tea, food, wood.',
      'atlas.search': 'Find a plant or a use: banya, tea, furniture…', 'atlas.more': 'Show more',
      'atlas.all': 'All', 'atlas.archive': 'Archive', 'atlas.usesLabel': 'Good for', 'atlas.toxic': 'Toxic',
      'atlas.shown': (a, b) => `Showing ${a} of ${b}`, 'atlas.found': (a, b) => `Found ${a} of ${b}`, 'atlas.empty': 'Nothing found. Try another word.',
      'walk.intro': 'A plant that is in season right now, in flower or in fruit. Go out on the trail and find it. Look at its leaves, flowers and fruit. Remember what it is good for.',
      'walk.for': 'Invitation', 'walk.open': 'Open the card', 'walk.next': 'Another plant', 'walk.no': 'Specimen No.',
      'seasons.lead': 'What flowers, what fruits and when the mushrooms come, month by month, for Madeira’s climate.',
      'seasons.now': 'Now', 'seasons.bloom': 'In flower', 'seasons.fruit': 'Fruit and cones', 'seasons.fungi': 'Mushrooms',
      'seasons.all': (n) => `Show all (${n})`, 'seasons.less': 'Show less', 'seasons.none': 'Nothing marked yet.',
      'seasons.note': 'Months are approximate: typical timing for the species on Madeira. We refine them from observations on the land.',
      'seasons.list': [['Spring', 'Mar — May'], ['Summer', 'Jun — Aug'], ['Autumn', 'Sep — Nov'], ['Winter', 'Dec — Feb']],
      'mirror.p': 'Every plant lives by its own laws and shares something with us: warmth, taste, scent, wood.', 'mirror.cta': 'Keep exploring',
      'foot.tag': 'Spiral Flora — the living atlas of our land.', 'foot.note': 'Information on uses and medicinal properties is not medical advice.',
      'p.prev': '← Previous', 'p.next': 'Next →', 'p.share': 'Share link', 'p.copied': 'Link copied',
      'p.uses': 'Good for', 'p.med': 'Medicinal', 'p.wood': 'Wood', 'p.safety': 'Safety', 'p.more': 'Read more', 'p.encounter': 'At Spiral',
      'p.idconf': 'Identification', 'p.safetyAx': 'Safety', 'p.nouses': 'No known practical use.',
      'p.wikiRu': 'Wikipedia (Russian)', 'p.wikiEn': 'Wikipedia',
      'p.photoSpecies': 'Photo of the species, not from our land.', 'p.photoGenus': 'Photo of the genus, not from our land.', 'p.illus': 'Symbolic illustration, not a photo.',
      'p.spiralPhoto': 'Photo from Spiral', 'p.noSpiralPhoto': 'No original photo yet.', 'p.medNote': 'Not a substitute for medical advice.',
      'p.bloom': 'Flowering', 'p.fruit': 'Fruit', 'p.fungi': 'Fruiting bodies',
    },
  };
  const t = (k, ...a) => { const v = I[LANG][k]; return typeof v === 'function' ? v(...a) : v; };

  const TAGS = {
    Banya: ['Баня', 'Banya', '<path d="M8 3.5c-1 1.4 1 2.4 0 3.8M12 3c-1 1.4 1 2.4 0 3.8M16 3.5c-1 1.4 1 2.4 0 3.8"/><path d="M4 11h16l-1.6 7.2A2 2 0 0 1 16.5 20h-9a2 2 0 0 1-1.9-1.8z"/>'],
    Tea: ['Чай', 'Tea', '<path d="M5 9h11v4.5A5.5 5.5 0 0 1 10.5 19A5.5 5.5 0 0 1 5 13.5z"/><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M9 3.5c-.8 1.2.8 2 0 3.2M12.5 3.5c-.8 1.2.8 2 0 3.2"/>'],
    Food: ['Еда', 'Food', '<path d="M12 7.5c-3-2-7.5 0-7.5 5 0 4.5 3 8.5 5 8.5 1 0 1.5-.6 2.5-.6s1.5.6 2.5.6c2 0 5-4 5-8.5 0-5-4.5-7-7.5-5z"/><path d="M12 7.5c0-2 1-4 3-4.5"/>'],
    Aroma: ['Аромат', 'Aroma', '<path d="M7 20c0-4 4-4.5 4-8.5S8 6.5 8 3.5"/><path d="M13.5 20c0-4 4-4.5 4-8.5s-3-5-3-8"/>'],
    Wood: ['Древесина', 'Wood', '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5.2"/><circle cx="12" cy="12" r="2"/>'],
    Bees: ['Медонос', 'Bees', '<ellipse cx="12" cy="14.5" rx="4" ry="5.5"/><path d="M8.2 13h7.6M8.4 16.2h7.2"/><path d="M10.2 9.3C8 5 4 6 4 8s3.2 3 6.2 1.6M13.8 9.3C16 5 20 6 20 8s-3.2 3-6.2 1.6"/>'],
    Medicine: ['Лечебное', 'Medicine', '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/>'],
    Craft: ['Ремесло', 'Craft', '<path d="M4 10h16l-2 9.5H6z"/><path d="M8 10a4 4 0 0 1 8 0"/><path d="M9.5 13.5v3.5M12 13.5v3.5M14.5 13.5v3.5"/>'],
    Decor: ['Декоративное', 'Ornamental', '<path d="M12 21v-8.5"/><path d="M7 5l2.5 2.2L12 4l2.5 3.2L17 5v3.8a5 5 0 0 1-10 0z"/><path d="M12 17c-2-2.5-4.5-2.5-6-2 1 2 3.5 3 6 2z"/>'],
    Soil: ['Почва', 'Soil', '<path d="M4 20h16"/><path d="M12 20v-8"/><path d="M12 12.5C12 9 10 7 6 7c0 3.5 2 5.5 6 5.5zM12 14.5c0-3.5 2-5.5 6-5.5 0 3.5-2 5.5-6 5.5z"/>'],
  };
  const TOX_ICON = '<path d="M12 3.8 21.2 20H2.8z"/><path d="M12 10v4.5M12 17.2v.3"/>';
  const icon = (paths) => svgNode(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`);
  const LEVEL = { Safe: ['Безопасно', 'Safe', 'ok'], Caution: ['Осторожно', 'Caution', 'warn'], Toxic: ['Ядовито', 'Toxic', 'tox'], Unknown: ['Нет данных', 'No data', 'mute'] };
  const IDC = { 'Определено': 'Identified', 'Предварительно': 'Provisional', 'Только род': 'Genus only', 'Спорно': 'Uncertain' };
  const CATS = {
    'Деревья и хвойные': ['Деревья', 'Trees'], 'Кустарники и полукустарники': ['Кустарники', 'Shrubs'], 'Лианы и почвопокровные': ['Лианы', 'Climbers'],
    'Травы и цветковые растения': ['Травы и цветы', 'Herbs & flowers'], 'Суккуленты и розеточные растения': ['Суккуленты', 'Succulents'],
    'Злаки, осоки и злаковидные': ['Злаки', 'Grasses'], 'Папоротники': ['Папоротники', 'Ferns'], 'Мхи и другие споровые': ['Мхи', 'Mosses'],
    'Грибы — отдельный раздел биоты': ['Грибы', 'Fungi'],
  };
  const CAT_ORDER = Object.keys(CATS);
  const EN = () => LANG === 'en';
  const catName = (c) => (CATS[c] ? CATS[c][EN() ? 1 : 0] : c);
  const tagName = (k) => TAGS[k][EN() ? 1 : 0];
  const L = (p, k) => p[k + '_' + LANG] || p[k + '_ru'] || '';
  const LL = (p, k) => (p[k + '_' + LANG].length ? p[k + '_' + LANG] : p[k + '_ru']);

  // ── Data ──
  const P = [];
  function parseCSV(text) {
    const rows = []; let row = [], cur = '', q = false;
    text = text.replace(/^﻿/, '');
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) { if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
      else if (c === '"') q = true;
      else if (c === ',') { row.push(cur); cur = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cur); cur = ''; rows.push(row); row = []; }
      else cur += c;
    }
    if (cur || row.length) { row.push(cur); rows.push(row); }
    const head = rows.shift().map((h) => h.trim().toLowerCase());
    return rows.filter((r) => r.some((x) => x.trim())).map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] || '').trim()])));
  }
  // «Mar–May, Oct–Nov» → набор номеров месяцев 0–11 (диапазон может переходить через Новый год).
  const MON = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  function monthSet(s) {
    const out = new Set();
    (s || '').split(/[,;]/).forEach((part) => {
      const m = part.toLowerCase().match(/[a-z]{3}/g) || [];
      const a = MON.indexOf(m[0]), b = MON.indexOf(m[m.length - 1]);
      if (a < 0 || b < 0) return;
      for (let i = a; ; i = (i + 1) % 12) { out.add(i); if (i === b) break; }
    });
    return out;
  }
  // Версия фото для адреса: при замене фото (новый источник/автор) браузер не покажет старое из кэша.
  const ver = (str) => { let h = 5381; for (let i = 0; i < str.length; i++) h = ((h * 33) ^ str.charCodeAt(i)) >>> 0; return h.toString(36); };
  const lines = (s) => (s || '').split(/\n+/).map((x) => x.trim()).filter(Boolean);
  function ingest(rows) {
    const draft = window.FLORA_DRAFT || {};
    P.length = 0;
    rows.forEach((r0, i) => {
      if (!r0.name) return;
      const id = r0.id || 'SF-' + String(i + 1).padStart(3, '0');
      // Таблица главнее черновика: непустые значения из таблицы перекрывают черновик.
      const r = { ...(draft[id] || {}), ...Object.fromEntries(Object.entries(r0).filter(([, v]) => v !== '')) };
      const src = r.photo || '';
      const p = {
        id, name_ru: r.name, name_en: r.name_en || '', latin: r.latin || '', cat: r.category || 'Другое',
        essence_ru: r.essence_ru || r.image || '', essence_en: r.essence_en || '',
        tags: (r.uses_tags || '').split(',').map((s) => s.trim()).filter((s) => TAGS[s]),
        uses_ru: lines(r.uses_ru), uses_en: lines(r.uses_en), wood_ru: lines(r.wood_ru), wood_en: lines(r.wood_en),
        medicinal_ru: lines(r.medicinal_ru), medicinal_en: lines(r.medicinal_en),
        level: LEVEL[r.safety_level] ? r.safety_level : 'Unknown', safety_ru: r.safety_ru || r.caution || '', safety_en: r.safety_en || '',
        wiki_ru: safeUrl(r.wiki_ru), wiki_en: safeUrl(r.wiki_en), idc: r.id_confidence || 'Предварительно',
        archived: /^(true|да|1|yes)$/i.test(r.archived || ''),
        bloom: r.bloom || '', fruit: r.fruit || '', bm: monthSet(r.bloom), fm: monthSet(r.fruit),
        photo: src ? { src: (/^https?:\/\//.test(src) || src.includes('/') ? src : 'images/flora/' + src) + (/^https?:/.test(src) ? '' : '?v=' + ver(src + (r.photo_source_url || '') + (r.photo_author || '') + (r.photo_scope || ''))), author: r.photo_author || '', license: r.photo_license || '', licenseUrl: safeUrl(r.photo_license_url), page: safeUrl(r.photo_source_url), genus: norm(r.photo_scope) === 'род', spiral: norm(r.photo_scope) === 'spiral' } : null,
      };
      p.name = () => (EN() && p.name_en) || p.name_ru;
      p.hay = norm([p.name_ru, p.name_en, p.latin, p.essence_ru, p.essence_en, ...p.uses_ru, ...p.uses_en, ...p.wood_ru, ...p.wood_en, ...p.medicinal_ru, ...p.medicinal_en, ...p.tags.map((k) => TAGS[k][0] + ' ' + TAGS[k][1]), p.cat].join(' '));
      P.push(p);
    });
  }
  function load(cb) {
    ingest(window.FLORA_ROWS || []);
    cb();
    const url = window.FLORA_SHEET_URL;
    if (!url) return;
    fetch(url + (url.includes('?') ? '&' : '?') + 't=' + Date.now())
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then((tx) => { const rows = parseCSV(tx); if (rows.length && 'name' in rows[0]) { ingest(rows); cb(); } })
      .catch((e) => console.warn('Flora: таблица недоступна, показана копия данных', e));
  }

  // ── Shared UI ──
  function iconRow(p, max, withLabels) {
    const tags = max ? p.tags.slice(0, max) : p.tags;
    return [
      ...tags.map((k) => el('span', { class: 'ic', title: tagName(k) }, icon(TAGS[k][2]), withLabels ? el('span', { text: tagName(k) }) : null)),
      p.level === 'Toxic' ? el('span', { class: 'ic ic--tox', title: LEVEL.Toxic[EN() ? 1 : 0] }, icon(TOX_ICON), withLabels ? el('span', { text: LEVEL.Toxic[EN() ? 1 : 0] }) : null) : null,
    ];
  }
  function applyStatic() {
    document.documentElement.lang = LANG;
    document.querySelectorAll('[data-i18n]').forEach((n) => { const v = t(n.dataset.i18n); if (typeof v === 'string') n.textContent = v; });
    document.querySelectorAll('[data-i18n-em]').forEach((n) => { const v = t(n.dataset.i18nEm); if (Array.isArray(v)) n.put(v[0], el('em', { text: v[1] }), v[2]); });
    document.querySelectorAll('.lang button').forEach((b) => b.classList.toggle('on', b.dataset.lang === LANG));
  }
  const listeners = [];
  document.querySelectorAll('.lang button').forEach((b) => b.addEventListener('click', () => {
    LANG = b.dataset.lang; try { localStorage.setItem('flora-lang', LANG); } catch (_) {}
    applyStatic(); listeners.forEach((f) => f());
  }));
  applyStatic();

  const nav = $('#nav');
  const first = $('.fhero, .phero');
  if (first) new IntersectionObserver(([e]) => nav.classList.toggle('scrolled', !e.isIntersecting), { rootMargin: '-80px 0px 0px 0px' }).observe(first);
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rv').forEach((n) => io.observe(n));

  // ═════ HOME ═════
  function home() {
    $('#heroSpiral').setAttribute('d', window.floraSpiralPath(5, 96, 0, 0));
    const state = { q: '', cat: '', use: '', limit: 12 };
    const live = () => P.filter((p) => !p.archived);

    function facts() {
      const L2 = live();
      $('#heroLead').textContent = t('hero.lead', L2.length);
      $('#facts').put([[L2.length, 'f.all'], [L2.filter((p) => p.tags.includes('Banya')).length, 'f.banya'], [L2.filter((p) => p.tags.includes('Food')).length, 'f.food'], [L2.filter((p) => p.level === 'Toxic').length, 'f.toxic']]
        .map(([b, k]) => el('div', null, el('b', { text: String(b) }), el('span', { text: t(k) }))));
      document.querySelectorAll('[data-total]').forEach((n) => (n.textContent = L2.length));
    }
    function tabs() {
      const cats = [...CAT_ORDER, ...new Set(P.map((p) => p.cat).filter((c) => !CAT_ORDER.includes(c)))].filter((c) => live().some((p) => p.cat === c));
      const mk = (label, val, n) => {
        const b = el('button', { class: 'tab', type: 'button', role: 'tab', 'data-v': val }, label, el('sup', { text: String(n) }));
        b.addEventListener('click', () => { state.cat = val; state.limit = 12; draw(); });
        return b;
      };
      $('#tabs').put(mk(t('atlas.all'), '', live().length), cats.map((c) => mk(catName(c), c, live().filter((p) => p.cat === c).length)), mk(t('atlas.archive'), '__archive', P.filter((p) => p.archived).length));
      const uses = Object.keys(TAGS).filter((k) => live().some((p) => p.tags.includes(k)));
      const ub = (k, label, paths, cls) => {
        const b = el('button', { class: 'use' + (cls ? ' ' + cls : ''), type: 'button', 'data-v': k }, icon(paths), el('span', { text: label }));
        b.addEventListener('click', () => { state.use = state.use === k ? '' : k; state.limit = 12; draw(); });
        return b;
      };
      $('#uses').put(el('span', { class: 'use-lab', text: t('atlas.usesLabel') }), uses.map((k) => ub(k, tagName(k), TAGS[k][2])), ub('__toxic', t('atlas.toxic'), TOX_ICON, 'use--tox'));
    }
    function card(p, i) {
      const media = p.photo ? el('img', { src: p.photo.src, alt: p.name(), loading: 'lazy', decoding: 'async' }) : artFor(p);
      return el('a', { class: 'pc', href: 'flora-plant.html#' + encodeURIComponent(p.id), style: 'animation-delay:' + Math.min(i % 12, 11) * 40 + 'ms' },
        el('div', { class: 'pc-img' }, media, el('span', { class: 'pc-no', text: '№ ' + p.id.replace(/\D/g, '') }), p.photo && p.photo.spiral ? el('span', { class: 'pc-flag', text: 'Spiral' }) : null),
        el('h3', { text: p.name() }), el('p', { class: 'lat', text: p.latin }),
        L(p, 'essence') ? el('p', { class: 'ess', text: L(p, 'essence') }) : null,
        el('div', { class: 'icons' }, iconRow(p, 5)));
    }
    function draw() {
      // Простое отсечение окончаний: «мебель» находит «мебели», «баня» — «бане».
      const stem = (w) => (w.length <= 3 ? w : w.length === 4 ? w.slice(0, 3) : w.length <= 6 ? w.slice(0, -1) : w.slice(0, -2));
      const words = norm(state.q).split(/\s+/).filter(Boolean).map(stem);
      const base = state.cat === '__archive' ? P.filter((p) => p.archived) : live();
      const list = base.filter((p) => (!state.cat || state.cat === '__archive' || p.cat === state.cat) && (!state.use || (state.use === '__toxic' ? p.level === 'Toxic' : p.tags.includes(state.use))) && words.every((w) => p.hay.includes(w)));
      const part = list.slice(0, state.limit);
      $('#cards').put(part.length ? part.map(card) : el('p', { class: 'empty', text: t('atlas.empty') }));
      $('#statusLine').textContent = !state.q && !state.use && !state.cat ? t('atlas.shown', part.length, base.length) : t('atlas.found', list.length, base.length);
      $('#moreBtn').hidden = list.length <= state.limit;
      document.querySelectorAll('.tab').forEach((b) => b.classList.toggle('on', b.dataset.v === state.cat));
      document.querySelectorAll('.use').forEach((b) => b.classList.toggle('on', b.dataset.v === state.use));
    }
    $('#q').addEventListener('input', (e) => { state.q = e.target.value; state.limit = 12; draw(); });
    $('#moreBtn').addEventListener('click', () => { state.limit += 12; draw(); });

    let walkId = null;
    function walk(keep) {
      // Только то, что сейчас цветёт или плодоносит (если таких нет — все).
      const m = new Date().getMonth();
      const all = live().filter((p) => p.photo && L(p, 'essence') && p.tags.length);
      const now = all.filter((p) => p.bm.has(m) || p.fm.has(m));
      const pool = now.length ? now : all;
      if (!pool.length) return;
      const others = pool.filter((x) => x.id !== walkId);
      const p = (keep && pool.find((x) => x.id === walkId)) || others[Math.floor(Math.random() * others.length)] || pool[0];
      walkId = p.id;
      $('#wq').textContent = L(p, 'essence');
      $('#wplant').put(el('b', { text: p.name() }), ' · ', el('i', { text: p.latin }));
      $('#wicons').put(iconRow(p, 0, true));
      $('#wopen').setAttribute('href', 'flora-plant.html#' + encodeURIComponent(p.id));
      $('#wph').put(p.photo ? el('img', { src: p.photo.src, alt: p.name() }) : artFor(p), el('span', { class: 'walk-no', text: t('walk.no') + ' ' + p.id.replace(/\D/g, '') }));
    }
    $('#wnext').addEventListener('click', () => walk(false));

    let sIdx = 0; const sOpen = {};
    function seasons() {
      const now = new Date().getMonth();
      const MONS = MON.map((m) => m[0].toUpperCase() + m.slice(1));
      const opts = [[t('seasons.now'), MONS[now], [now]], ...t('seasons.list').map(([n, d], i) => [n, d, [[2, 3, 4], [5, 6, 7], [8, 9, 10], [11, 0, 1]][i]])];
      const sl = $('#sline');
      sl.put(opts.map(([n, d], i) => {
        const b = el('button', { type: 'button', role: 'tab', class: i === sIdx ? 'on' : '', 'aria-selected': String(i === sIdx) }, n, el('small', { text: d }));
        b.addEventListener('click', () => { sIdx = i; seasons(); });
        return b;
      }));
      const ms = opts[sIdx][2];
      const hit = (set) => ms.some((m) => set.has(m));
      const fungi = (p) => p.cat.startsWith('Грибы');
      const L2 = live();
      const groups = [
        ['bloom', L2.filter((p) => hit(p.bm)), (p) => p.bloom],
        ['fruit', L2.filter((p) => !fungi(p) && hit(p.fm)), (p) => p.fruit],
        ['fungi', L2.filter((p) => fungi(p) && hit(p.fm)), (p) => p.fruit],
      ];
      const chip = (p, when) => el('a', { class: 'sc', href: 'flora-plant.html#' + encodeURIComponent(p.id) },
        el('span', { class: 'sc-img' }, p.photo ? el('img', { src: p.photo.src, alt: '', loading: 'lazy', decoding: 'async' }) : artFor(p)),
        el('span', { class: 'sc-t' }, el('b', { text: p.name() }), el('small', { text: when(p) })));
      $('#sbody').put(
        el('div', { class: 'months', 'aria-hidden': 'true' }, MONS.map((m, i) => el('i', { class: ms.includes(i) ? 'on' : (i === now ? 'now' : '') , text: m }))),
        groups.map(([k, list, when]) => {
          const key = k + sIdx, open = sOpen[key], lim = 12;
          const more = list.length > lim ? el('button', { type: 'button', class: 'smore', text: open ? t('seasons.less') : t('seasons.all', list.length) }) : null;
          if (more) more.addEventListener('click', () => { sOpen[key] = !open; seasons(); });
          return el('div', { class: 'sgroup' },
            el('h3', null, t('seasons.' + k), el('sup', { text: String(list.length) })),
            list.length ? el('div', { class: 'sgrid' }, (open ? list : list.slice(0, lim)).map((p) => chip(p, when))) : el('p', { class: 'snone', text: t('seasons.none') }),
            more);
        }),
        el('p', { class: 'snote', text: t('seasons.note') }));
    }
    const all = () => { $('#q').placeholder = t('atlas.search'); $('#q').setAttribute('aria-label', t('atlas.search')); facts(); tabs(); draw(); walk(!!walkId); seasons(); };
    listeners.push(all);
    load(all);
  }

  // ═════ PLANT PAGE ═════
  function plantPage() {
    function render() {
      const wanted = location.hash.slice(1) || new URLSearchParams(location.search).get('id') || 'SF-018';
      const i = Math.max(0, P.findIndex((p) => p.id === wanted));
      const p = P[i]; if (!p) return;
      document.title = p.name() + ' — Spiral Flora';
      const desc = [L(p, 'essence'), ...LL(p, 'uses').slice(0, 2)].join(' ');
      document.querySelector('meta[name="description"]').setAttribute('content', desc);
      document.querySelector('meta[property="og:title"]').setAttribute('content', document.title);
      $('#pcat').textContent = catName(p.cat);
      $('#pid').textContent = p.id;
      $('#pname').textContent = p.name();
      $('#platin').textContent = p.latin + (!EN() && p.name_en ? ' · ' + p.name_en : EN() ? ' · ' + p.name_ru : '');
      $('#pess').textContent = L(p, 'essence');
      $('#picons').put(iconRow(p, 0, true));
      const lv = LEVEL[p.level];
      $('#axes').put(
        el('div', { class: 'axis ' + lv[2] }, el('span', { text: t('p.safetyAx') }), el('b', { text: lv[EN() ? 1 : 0] })),
        el('div', { class: 'axis mute' }, el('span', { text: t('p.idconf') }), el('b', { text: EN() ? IDC[p.idc] || p.idc : p.idc })),
        p.bloom ? el('div', { class: 'axis bloom' }, el('span', { text: t('p.bloom') }), el('b', { text: p.bloom })) : null,
        p.fruit ? el('div', { class: 'axis fruit' }, el('span', { text: t(p.cat.startsWith('Грибы') ? 'p.fungi' : 'p.fruit') }), el('b', { text: p.fruit })) : null);
      const bg = $('#pbg'), art = $('#part'), cr = $('#pcredit');
      cr.put();
      if (p.photo) {
        bg.style.backgroundImage = 'url("' + p.photo.src.replace(/"/g, '%22') + '")'; art.hidden = true;
        if (p.photo.spiral) cr.append(t('p.spiralPhoto') + '.');
        else {
          cr.append(t(p.photo.genus ? 'p.photoGenus' : 'p.photoSpecies') + ' ' + p.photo.author + ' · ');
          cr.append(p.photo.licenseUrl ? el('a', { href: p.photo.licenseUrl, target: '_blank', rel: 'noopener', text: p.photo.license }) : p.photo.license);
        }
      } else { bg.style.backgroundImage = ''; art.hidden = false; art.put(artFor(p)); cr.textContent = t('p.illus'); }

      let n = 0;
      const chap = (title, body) => el('div', { class: 'chap' }, el('div', { class: 'chap-label' }, el('span', { class: 'n', text: String(++n).padStart(2, '0') }), el('h2', { text: title })), el('div', { class: 'chap-body' }, body));
      const bullets = (arr) => el('ul', { class: 'bl' }, arr.map((x) => el('li', { text: x })));
      const uses = LL(p, 'uses'), wood = LL(p, 'wood'), med = LL(p, 'medicinal');
      const safety = L(p, 'safety');
      const links = [p.wiki_ru && !EN() ? el('a', { class: 'wl', href: p.wiki_ru, target: '_blank', rel: 'noopener', text: t('p.wikiRu') + ' ↗' }) : null, p.wiki_en ? el('a', { class: 'wl', href: p.wiki_en, target: '_blank', rel: 'noopener', text: t('p.wikiEn') + ' ↗' }) : null].filter(Boolean);
      $('#chapters').put(
        chap(t('p.uses'), uses.length ? bullets(uses) : el('p', { class: 'pending', text: t('p.nouses') })),
        med.length ? chap(t('p.med'), [el('dl', { class: 'dl' }, med.map((ln) => { const [a, ...b] = ln.split(': '); return el('div', null, el('dt', { text: a }), el('dd', { text: b.join(': ') })); })), el('p', { class: 'src', text: t('p.medNote') })]) : null,
        wood.length ? chap(t('p.wood'), bullets(wood)) : null,
        chap(t('p.safety'), [el('p', { class: 'lvl ' + lv[2] }, icon(p.level === 'Toxic' ? TOX_ICON : '<circle cx="12" cy="12" r="8.5"/><path d="M12 8v5M12 16v.3"/>'), el('b', { text: lv[EN() ? 1 : 0] })), safety ? el('p', { text: safety }) : null]),
        links.length ? chap(t('p.more'), el('div', { class: 'wls' }, links)) : null);

      const prev = P[(i - 1 + P.length) % P.length], next = P[(i + 1) % P.length];
      const setNav = (a, q) => { a.setAttribute('href', 'flora-plant.html#' + encodeURIComponent(q.id)); a.querySelector('.name').textContent = q.name(); };
      setNav($('#pprev'), prev); setNav($('#pnext'), next);
    }
    $('#pshare').addEventListener('click', async (e) => {
      const url = location.href, b = e.currentTarget;
      try { if (navigator.share) await navigator.share({ title: document.title, url }); else { await navigator.clipboard.writeText(url); b.textContent = t('p.copied'); setTimeout(() => (b.textContent = t('p.share')), 2000); } } catch (_) {}
    });
    listeners.push(render);
    load(render);
    window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });
  }

  const page = document.body.dataset.page;
  if (page === 'home') home();
  if (page === 'plant') plantPage();
})();
