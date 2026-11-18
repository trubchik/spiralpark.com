/* Spiral Flora — процедурные иллюстрации (символические, не фото).
   Каждое растение: силуэт по типу + цвет по названию + тонкая спираль-подпись. */
(function () {
  const G = ['#4f6f4a', '#6f8f5e', '#8aa877', '#a9c08f'];
  const TRUNK = '#8a6a4f';

  function rng(seed) {
    let s = 0;
    for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  const COLORS = [
    [/одуванчик|зверобой|горчица|лютик|чистотел|дрок|ракитник|акация серебр|гипохерис|бузульник|иохром|бессмертник|мелколепестник|пупочник|очиток|сыть|кислица/, '#f2c14e'],
    [/ромашка|нивяник|калла|гиацинт|аронник|клевер|смолёвка|подмаренник|бузина|боярышник|резеда|мелколеп|голубика/, '#f6f1e4'],
    [/наперстянка|фиалка|мускари|агапантус|колокольчик|иохрома|буддлея|барвинок|очный|чистец|перилла|шалфей|аристея|ипомея|сибторпия|иглица|традесканция/, '#8e7cc3'],
    [/камелия|лаватера|герань|центрантус|питанга|агератина|аквилегия|плектрантус|текома|тритония|мандарин|земляничное|череда/, '#e58fa3'],
    [/тритония|апельсин|лимон|текома|баклажан|перец/, '#ff9a4f'],
  ];
  const FALLBACK = ['#e58fa3', '#f2c14e', '#8e7cc3', '#f6f1e4', '#ff9a4f', '#7fb7d6'];

  function colorFor(p, r) {
    const n = p.name.toLowerCase();
    for (const [re, c] of COLORS) if (re.test(n)) return c;
    return FALLBACK[Math.floor(r() * FALLBACK.length)];
  }

  function kind(p) {
    const n = p.name.toLowerCase();
    const c = p.cat;
    if (c.startsWith('Грибы')) return 'mushroom';
    if (c.startsWith('Мхи')) return 'moss';
    if (c.startsWith('Папоротники')) return 'fern';
    if (c.startsWith('Злаки')) return 'grass';
    if (c.startsWith('Суккул')) return 'succulent';
    if (c.startsWith('Лианы')) return 'vine';
    if (c.startsWith('Кустар')) return 'shrub';
    if (c.startsWith('Деревья')) {
      if (/араукар/.test(n)) return 'araucaria';
      if (/ель|пихта|криптомер|кипарис|каллитрис/.test(n)) return 'conifer';
      if (/эвкалипт/.test(n)) return 'eucalyptus';
      if (/яблон|груша|слива|лимон|мандарин|апельсин|авокадо|питанга|шелковица|каштан|боярышник|земляничное/.test(n)) return 'fruit';
      return 'tree';
    }
    if (/калла|агапантус|тритония|гиацинт|мускари|наперстянка|аристея|колокольчик|лаватера/.test(n)) return 'spike';
    if (/ромашка|нивяник|мелколепестник|одуванчик|агератина|череда|расторопша|посконник|центрантус|гипохерис|очный|зверобой|горчица|лютик|чистотел|фиалка|герань|аквилегия|резеда|клевер|валенбергия|ватсония/.test(n)) return 'daisy';
    if (/зонтичное|подмаренник|сибторпия|руккола|редька|смолёвка/.test(n)) return 'umbel';
    return 'herb';
  }

  const f = (n) => n.toFixed(1);

  const draw = {
    conifer(r) {
      let s = `<rect x="97" y="150" width="6" height="22" fill="${TRUNK}"/>`;
      const tiers = 5;
      for (let i = 0; i < tiers; i++) {
        const y = 40 + i * 24, w = 20 + i * 11;
        s += `<path d="M100 ${y - 22} L${100 - w} ${y + 22} Q100 ${y + 14} ${100 + w} ${y + 22} Z" fill="${G[i % 3]}" opacity=".95"/>`;
      }
      return s;
    },
    araucaria(r) {
      let s = `<rect x="98" y="60" width="4" height="112" fill="${TRUNK}"/>`;
      for (let i = 0; i < 6; i++) {
        const y = 54 + i * 18, w = 14 + i * 7;
        s += `<path d="M${100 - w} ${y + 10} Q100 ${y - 8} ${100 + w} ${y + 10}" fill="none" stroke="${G[i % 3]}" stroke-width="7" stroke-linecap="round"/>`;
      }
      return s;
    },
    eucalyptus(r) {
      let s = `<path d="M99 172 Q95 110 101 40" stroke="#c9b8a0" stroke-width="7" fill="none" stroke-linecap="round"/>`;
      for (let i = 0; i < 14; i++) {
        const y = 40 + i * 9, dir = i % 2 ? 1 : -1, l = 24 + r() * 14;
        s += `<path d="M100 ${y} q${dir * l * .6} 8 ${dir * l} ${24}" stroke="${G[1 + (i % 3)]}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
      }
      return s;
    },
    tree(r) {
      let s = `<path d="M96 174 L98 110 Q100 100 102 110 L104 174Z" fill="${TRUNK}"/>`;
      for (let i = 0; i < 7; i++) {
        const cx = 100 + (r() - .5) * 64, cy = 76 + (r() - .5) * 34, rad = 20 + r() * 16;
        s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(rad)}" fill="${G[i % 4]}" opacity=".92"/>`;
      }
      return s;
    },
    fruit(r, p, col) {
      let s = draw.tree(r);
      for (let i = 0; i < 9; i++) {
        s += `<circle cx="${f(70 + r() * 60)}" cy="${f(55 + r() * 50)}" r="4.2" fill="${col}"/>`;
      }
      return s;
    },
    shrub(r, p, col) {
      let s = '';
      for (let i = 0; i < 9; i++) {
        const cx = 100 + (r() - .5) * 78, cy = 122 + (r() - .5) * 38, rad = 17 + r() * 14;
        s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(rad)}" fill="${G[i % 4]}" opacity=".93"/>`;
      }
      for (let i = 0; i < 11; i++) s += `<circle cx="${f(58 + r() * 84)}" cy="${f(92 + r() * 56)}" r="3.6" fill="${col}"/>`;
      return s;
    },
    vine(r, p, col) {
      let s = `<path d="M60 176 C 40 140, 120 130, 90 96 S 150 60, 128 30" stroke="${G[0]}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      const pts = [[62, 160], [78, 136], [100, 122], [96, 98], [112, 80], [136, 66], [130, 44]];
      pts.forEach(([x, y], i) => {
        const a = (i % 2 ? 1 : -1) * 30;
        s += `<ellipse cx="${x}" cy="${y}" rx="11" ry="6" transform="rotate(${a} ${x} ${y})" fill="${G[1 + (i % 3)]}"/>`;
      });
      pts.filter((_, i) => i % 3 === 1).forEach(([x, y]) => (s += `<circle cx="${x + 9}" cy="${y - 7}" r="4" fill="${col}"/>`));
      return s;
    },
    spike(r, p, col) {
      let s = '';
      for (let k = 0; k < 3; k++) {
        const x = 70 + k * 30, h = 72 + r() * 40;
        s += `<path d="M${x} 176 Q${x + (r() - .5) * 8} ${176 - h / 2} ${x} ${176 - h}" stroke="${G[0]}" stroke-width="2.6" fill="none"/>`;
        for (let i = 0; i < 6; i++) {
          s += `<ellipse cx="${x + (i % 2 ? 6 : -6)}" cy="${176 - h + i * 8}" rx="5.5" ry="7" fill="${col}"/>`;
        }
      }
      s += `<path d="M56 176 Q74 124 88 176 Q102 120 118 176 Q132 128 148 176Z" fill="${G[1]}" opacity=".9"/>`;
      return s;
    },
    daisy(r, p, col) {
      let s = '';
      const blooms = [[100, 70, 17], [64, 98, 12], [138, 106, 13]];
      blooms.forEach(([x, y, rad]) => {
        s += `<path d="M${x} 178 Q${x + (r() - .5) * 18} ${(178 + y) / 2} ${x} ${y}" stroke="${G[0]}" stroke-width="2.4" fill="none"/>`;
        for (let a = 0; a < 10; a++) {
          const t = (a / 10) * Math.PI * 2;
          s += `<ellipse cx="${f(x + Math.cos(t) * rad)}" cy="${f(y + Math.sin(t) * rad)}" rx="${f(rad * .5)}" ry="${f(rad * .26)}" transform="rotate(${f((t * 180) / Math.PI)} ${f(x + Math.cos(t) * rad)} ${f(y + Math.sin(t) * rad)})" fill="${col}" stroke="rgba(0,0,0,.08)" stroke-width=".6"/>`;
        }
        s += `<circle cx="${x}" cy="${y}" r="${f(rad * .38)}" fill="#e9a23b"/>`;
      });
      s += `<ellipse cx="80" cy="168" rx="20" ry="7" transform="rotate(-18 80 168)" fill="${G[1]}"/><ellipse cx="122" cy="170" rx="20" ry="7" transform="rotate(18 122 170)" fill="${G[2]}"/>`;
      return s;
    },
    umbel(r, p, col) {
      let s = '';
      [[100, 60], [66, 90], [136, 94]].forEach(([x, y]) => {
        s += `<path d="M${x} 178 L${x} ${y}" stroke="${G[0]}" stroke-width="2.2"/>`;
        for (let a = 0; a < 9; a++) {
          const t = Math.PI + (a / 8) * Math.PI;
          const ex = x + Math.cos(t) * 20, ey = y + Math.sin(t) * 14;
          s += `<path d="M${x} ${y} L${f(ex)} ${f(ey)}" stroke="${G[0]}" stroke-width="1"/><circle cx="${f(ex)}" cy="${f(ey)}" r="3.4" fill="${col}" stroke="rgba(0,0,0,.1)" stroke-width=".5"/>`;
        }
      });
      s += `<path d="M62 178 Q80 150 100 178 Q120 148 142 178Z" fill="${G[1]}"/>`;
      return s;
    },
    herb(r, p, col) {
      let s = '';
      for (let i = 0; i < 9; i++) {
        const a = -70 + i * 17.5, l = 52 + r() * 22;
        s += `<path d="M100 178 Q${f(100 + a * .9)} ${f(178 - l * .6)} ${f(100 + a * 1.3)} ${f(178 - l)}" stroke="${G[i % 4]}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
      }
      s += `<circle cx="100" cy="86" r="5" fill="${col}"/><circle cx="82" cy="102" r="4" fill="${col}"/><circle cx="120" cy="98" r="4" fill="${col}"/>`;
      return s;
    },
    succulent() {
      let s = '';
      for (let ring = 3; ring >= 0; ring--) {
        const n = 6 + ring * 2, rad = 14 + ring * 14;
        for (let i = 0; i < n; i++) {
          const t = (i / n) * Math.PI * 2 + ring * .4;
          const x = 100 + Math.cos(t) * rad * .9, y = 128 + Math.sin(t) * rad * .5;
          s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${10 + ring * 2}" ry="${6 + ring}" transform="rotate(${f((t * 180) / Math.PI)} ${f(x)} ${f(y)})" fill="${G[(ring + 1) % 4]}" stroke="rgba(0,0,0,.08)" stroke-width=".7"/>`;
        }
      }
      return s + `<circle cx="100" cy="128" r="5" fill="#c9d8b0"/>`;
    },
    grass(r) {
      let s = '';
      for (let i = 0; i < 17; i++) {
        const a = -60 + i * 7.5, l = 60 + r() * 55;
        s += `<path d="M${f(86 + i * 1.7)} 178 Q${f(86 + a * .5)} ${f(178 - l * .6)} ${f(100 + a * 1.3)} ${f(178 - l)}" stroke="${G[i % 4]}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      }
      return s;
    },
    fern(r) {
      let s = '';
      for (let k = 0; k < 7; k++) {
        const a = -72 + k * 24, L = 84 + r() * 18, th = ((a - 90) * Math.PI) / 180;
        const ex = 100 + Math.cos(th) * L, ey = 176 + Math.sin(th) * L;
        s += `<path d="M100 176 Q${f((100 + ex) / 2 + (a > 0 ? -8 : 8))} ${f((176 + ey) / 2)} ${f(ex)} ${f(ey)}" stroke="${G[0]}" stroke-width="2" fill="none"/>`;
        for (let i = 1; i < 11; i++) {
          const t = i / 11, x = 100 + (ex - 100) * t, y = 176 + (ey - 176) * t, w = 13 * (1 - t * .8);
          s += `<path d="M${f(x)} ${f(y)} l${f(-w)} ${f(-w * .5)} M${f(x)} ${f(y)} l${f(w)} ${f(-w * .5)}" stroke="${G[1 + (i % 3)]}" stroke-width="3" stroke-linecap="round"/>`;
        }
      }
      return s;
    },
    moss(r) {
      let s = `<ellipse cx="100" cy="164" rx="76" ry="14" fill="#b8a88e" opacity=".6"/>`;
      for (let i = 0; i < 30; i++) {
        const x = 40 + r() * 120, y = 128 + r() * 34, rad = 8 + r() * 11;
        s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rad)}" fill="${G[i % 4]}" opacity=".9"/>`;
      }
      return s;
    },
    mushroom(r, p) {
      const n = p.name.toLowerCase();
      const cap = /решёточник/.test(n) ? '#d6453d' : /траметес/.test(n) ? '#a8896b' : /веселка|весёлка/.test(n) ? '#e8e0cc' : /навозник/.test(n) ? '#c9b99b' : '#b5835a';
      const bracket = /траметес/.test(n);
      if (bracket) {
        let s = `<rect x="30" y="40" width="26" height="140" rx="6" fill="${TRUNK}" opacity=".85"/>`;
        [[56, 70, 62], [56, 108, 76], [56, 146, 54]].forEach(([x, y, w], i) => {
          s += `<path d="M${x} ${y} q${w * .5} -${w * .55} ${w} 0 q-${w * .5} 14 -${w} 0Z" fill="${['#a8896b', '#7d9aa6', '#c9a27a'][i]}" stroke="rgba(0,0,0,.15)" stroke-width=".8"/>`;
        });
        return s;
      }
      let s = `<path d="M92 176 Q90 130 94 108 L106 108 Q110 130 108 176Z" fill="#f1e8d3" stroke="rgba(0,0,0,.1)"/>`;
      s += `<path d="M52 112 Q100 28 148 112 Q100 124 52 112Z" fill="${cap}" stroke="rgba(0,0,0,.12)"/>`;
      for (let i = 0; i < 6; i++) s += `<circle cx="${f(70 + r() * 60)}" cy="${f(78 + r() * 24)}" r="${f(2 + r() * 2.4)}" fill="rgba(255,255,255,.55)"/>`;
      s += `<ellipse cx="62" cy="178" rx="9" ry="4" fill="${G[1]}"/><ellipse cx="146" cy="178" rx="12" ry="4" fill="${G[2]}"/>`;
      return s;
    },
  };

  function spiralPath(turns, maxR, cx, cy) {
    let d = '';
    for (let i = 0; i <= turns * 40; i++) {
      const t = (i / (turns * 40)) * turns * Math.PI * 2;
      const rr = (t / (turns * Math.PI * 2)) * maxR;
      d += (i ? 'L' : 'M') + f(cx + Math.cos(t) * rr) + ' ' + f(cy + Math.sin(t) * rr) + ' ';
    }
    return d;
  }

  window.floraSpiralPath = spiralPath;

  window.floraArt = function (p) {
    const r = rng(p.id + p.name);
    const k = kind(p);
    const col = colorFor(p, r);
    const body = (draw[k] || draw.herb)(r, p, col);
    const dir = r() > .5 ? 1 : -1;
    return (
      `<svg viewBox="0 0 200 200" role="img" aria-label="Иллюстрация: ${p.name}" preserveAspectRatio="xMidYMid meet">` +
      `<path d="${spiralPath(3.2, 96, 100, 100)}" fill="none" stroke="currentColor" stroke-opacity=".16" stroke-width="1" transform="scale(${dir} 1) translate(${dir > 0 ? 0 : -200} 0)"/>` +
      `<ellipse cx="100" cy="178" rx="52" ry="6" fill="rgba(0,0,0,.07)"/>` +
      `<g>${body}</g></svg>`
    );
  };
})();
