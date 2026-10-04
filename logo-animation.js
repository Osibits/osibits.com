/*
 * Animated reveal of the Osibits logo, "Flipper": the pupil shoots out of the O like a pinball and bounces
 * from letter to letter, lighting each one on the way, before dropping back into the centre.
 * Ported from logos-animations (src/animations/osibits/pinball.ts).
 *
 * The <img id="logo"> stays in the page: it is the layout box, the accessible name and the fallback (no
 * script, reduced motion). The reveal plays in an SVG laid over it, which then keeps showing the finished
 * logo: the browser snaps images to whole pixels, so handing back to the <img> would show a small jump.
 * The text and LinkedIn link wait for the end of the reveal, then come in (transition in index.html).
 * Loaded from <head> without defer, so the class below hides image and text before the first paint.
 */
;(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

  // Classes on <html>, styled in index.html.
  const ACTIVE_CLASS = 'logo-animated' // the overlay stands in for the <img>, the text waits
  const REVEALED_CLASS = 'logo-revealed' // the reveal is over: text and LinkedIn come in
  document.documentElement.classList.add(ACTIVE_CLASS)
  /** Back to the plain image, text shown at once. */
  const giveUp = () => document.documentElement.classList.remove(ACTIVE_CLASS)

  const SVG_NS = 'http://www.w3.org/2000/svg'
  const GREEN = '#44b649'
  const INK = '#030404'
  const FLASH_LIGHT = '#abdead' // the green, 55 % of the way to white
  const ARTBOARD = [3139, 725]

  // The logo flattened to one path per piece (logos-animations, src/logos/data.ts). Paint order matters.
  // prettier-ignore
  const PARTS = [
    { id: 'o-ring-1', fill: GREEN, d: 'M425.95 713.81C251.57 760.54 66.05 642.35 13.75 447.19-38.54 252.04 63.04 56.92 237.42 10.19 411.79-36.53 597.32 81.66 649.61 276.82 701.9 471.97 600.33 667.09 425.95 713.81ZM407.98 646.72C547.51 609.33 624.37 450.96 582.52 294.79 540.68 138.63 394.93 39.9 255.39 77.28 115.85 114.68 39 273.05 80.85 429.22 122.69 585.38 268.43 684.11 407.98 646.72Z' },
    { id: 'o-ring-2', fill: GREEN, d: 'M415.44 610.17C305.92 639.51 188.85 566.15 156.01 443.59 123.16 321.02 187.87 198.95 297.38 169.61 406.9 140.26 523.97 213.63 556.81 336.19 589.66 458.75 524.95 580.83 415.44 610.17ZM397.46 543.08C472.14 523.07 512.12 437.75 489.72 354.17 467.33 270.59 390.04 216.68 315.36 236.7 240.68 256.71 200.7 342.03 223.1 425.61 245.49 509.19 322.78 563.09 397.46 543.08Z' },
    { id: 'o-ring-3', fill: GREEN, d: 'M399.16 501.12C352.08 513.73 301.46 482.65 287.34 429.96 273.23 377.28 301.52 325.05 348.6 312.43 395.68 299.82 446.29 330.9 460.41 383.59 474.53 436.28 446.23 488.51 399.16 501.12ZM387.92 459.18C413.22 452.4 426.06 423.15 418.47 394.83 410.88 366.51 385.14 347.59 359.83 354.37 334.53 361.15 321.69 390.4 329.28 418.72 336.87 447.05 362.61 465.96 387.92 459.18Z' },
    { id: 'o-pupil', fill: INK, d: 'M384.15 442.23C400.93 437.73 410.47 418.83 405.44 400.06 400.41 381.28 382.7 369.68 365.92 374.18 349.14 378.67 339.6 397.57 344.63 416.35 349.67 435.13 367.38 446.72 384.15 442.23Z' },
    { id: 'o-pupil-rim', fill: INK, d: 'M385.28 446.41C366.32 451.49 346.13 438.68 340.45 417.47 334.76 396.26 345.84 375.07 364.8 369.99 383.75 364.91 403.94 377.72 409.62 398.93 415.31 420.15 404.23 441.33 385.28 446.41ZM383.03 438.04C397.64 434.13 405.63 417.52 401.25 401.18 396.88 384.83 381.65 374.45 367.04 378.36 352.43 382.28 344.44 398.88 348.82 415.23 353.2 431.57 368.43 441.95 383.03 438.04Z' },
    { id: 's1', fill: GREEN, d: 'M1064.88 520.16C1043.58 509.45 1020.16 500.23 994.6 492.45 969.05 484.69 944.93 477.43 922.21 470.71 899.5 464.01 880.16 458.04 864.19 452.78 848.23 447.52 835.44 442.07 825.85 436.41 816.29 430.75 809.36 424.64 805.11 418.13 800.84 411.62 798.71 403.96 798.71 395.14 798.71 355.7 841.65 335.98 927.54 335.98 957.34 335.98 986.79 338.27 1015.9 342.88 1044.99 347.5 1070.9 353.37 1093.61 360.52L1096.88 352.21C1076.72 344.88 1063.66 330.11 1067.1 317.31 1068.46 312.29 1072.28 308.33 1077.57 305.52 1062 302 1045.26 298.87 1027.09 296.27 994.78 291.65 961.61 289.34 927.54 289.34 894.17 289.34 863.65 291.65 835.97 296.27 808.3 300.91 784.51 307.83 764.64 317.05 744.78 326.31 729.32 337.83 718.34 351.71 707.31 365.54 701.82 381.51 701.82 399.55 701.82 415.52 706.96 429.48 717.28 441.46 727.54 453.39 741.21 464.1 758.25 473.56 775.28 482.99 794.99 491.41 817.34 498.77 839.69 506.08 862.94 513.14 887.09 519.85 908.37 525.71 928.42 531.41 947.24 536.84 966.04 542.29 982.54 548.51 996.74 555.42 1010.94 562.38 1022.1 570.14 1030.28 578.72 1038.44 587.33 1042.52 597.75 1042.52 609.91 1042.52 631.76 1028.32 648.44 999.93 659.97 971.53 671.53 934.29 677.29 888.14 677.29 856.2 677.29 824.43 674.99 792.85 670.37 761.27 665.77 724.5 691.56 702.92 696.29L686.91 698.72C716.72 707.14 749.55 713.41 785.4 717.61 821.24 721.81 856.2 723.91 890.26 723.91 925.04 723.91 957.5 721.16 987.69 715.71 1017.85 710.25 1044.11 702.49 1066.48 692.41 1088.84 682.35 1106.56 670.18 1119.71 655.89 1132.83 641.62 1139.41 625.44 1139.41 607.4 1139.41 588.49 1132.31 571.89 1118.11 557.62 1103.91 543.35 1086.18 530.87 1064.88 520.16' },
    { id: 'i1-stem', fill: GREEN, d: 'M1248.83 231.56C1229.27 231.56 1211.9 222.21 1199.86 207.62L1199.86 723.91 1297.79 723.91 1297.79 207.66C1285.74 222.21 1268.38 231.56 1248.83 231.56' },
    { id: 'i1-dot', fill: GREEN, d: 'M1288.38 178.48C1288.38 198.1 1270.78 214.29 1248.82 214.29 1226.86 214.29 1209.26 198.1 1209.26 178.48 1209.26 158.86 1226.86 142.67 1248.82 142.67 1270.78 142.67 1288.38 158.86 1288.38 178.48ZM1279.71 178.48C1279.71 163.36 1265.74 151.34 1248.82 151.34 1231.89 151.34 1217.93 163.36 1217.93 178.48 1217.93 193.6 1231.89 205.62 1248.82 205.62 1265.74 205.62 1279.71 193.6 1279.71 178.48Z' },
    { id: 'i1-ray-top', fill: GREEN, d: 'M1260.95 109.36L1236.68 109.36 1247.72 28.75 1260.95 109.36Z' },
    { id: 'i1-ray-right', fill: GREEN, d: 'M1309.93 161.1L1297.79 140.08 1373.13 109.37 1309.93 161.1Z' },
    { id: 'i1-ray-left', fill: GREEN, d: 'M1187.71 161.1L1199.84 140.08 1124.51 109.37 1187.71 161.1Z' },
    { id: 'b', fill: INK, d: 'M1786.23 604.55C1786.23 592 1781.23 581.04 1771.26 571.63 1761.28 562.23 1747.74 554.5 1730.66 548.44 1713.54 542.36 1693.59 537.88 1670.81 534.93 1648.02 532.02 1623.8 530.56 1598.14 530.56L1497.71 530.56 1497.71 677.93 1610.97 677.93C1664.39 677.93 1706.96 671.76 1738.68 659.41 1770.38 647.1 1786.23 628.79 1786.23 604.55M1588.21 484.58C1612.31 484.58 1634.86 482.92 1655.8 479.6 1676.74 476.27 1694.82 471.5 1710.1 465.26 1725.36 459.01 1737.26 451.53 1745.78 442.78 1754.29 434.03 1758.54 424.06 1758.54 412.83 1758.54 392.05 1745.24 376.44 1718.61 366.04 1691.99 355.63 1657.39 350.43 1614.82 350.43L1497.71 350.43 1497.71 484.58 1588.21 484.58ZM1879.91 606.58C1879.91 623.81 1873.33 639.67 1860.17 654.18 1847.01 668.7 1828.35 681.11 1804.16 691.43 1779.98 701.74 1750.99 709.71 1717.19 715.4 1683.38 721.06 1645.86 723.91 1604.61 723.91L1404.01 723.91 1404.01 304.46 1623.84 304.46C1658 304.46 1689.3 306.88 1717.78 311.68 1746.21 316.5 1770.59 323.42 1790.88 332.43 1811.14 341.46 1826.79 352.24 1837.81 364.81 1848.84 377.4 1854.37 391.23 1854.37 406.32 1854.37 430.59 1840.66 451.04 1813.26 467.59 1785.86 484.13 1750.81 496.62 1708.12 505 1760.76 510.89 1802.55 522.36 1833.51 539.38 1864.44 556.44 1879.91 578.82 1879.91 606.58' },
    { id: 'i2-stem', fill: INK, d: 'M2012.01 231.56C1992.44 231.56 1975.08 222.21 1963.04 207.62L1963.04 723.91 2060.97 723.91 2060.97 207.66C2048.92 222.21 2031.56 231.56 2012.01 231.56' },
    { id: 'i2-dot', fill: INK, d: 'M2051.55 178.48C2051.55 198.1 2033.95 214.29 2011.99 214.29 1990.03 214.29 1972.43 198.1 1972.43 178.48 1972.43 158.86 1990.03 142.67 2011.99 142.67 2033.95 142.67 2051.55 158.86 2051.55 178.48ZM2042.88 178.48C2042.88 163.36 2028.92 151.34 2011.99 151.34 1995.07 151.34 1981.1 163.36 1981.1 178.48 1981.1 193.6 1995.07 205.62 2011.99 205.62 2028.92 205.62 2042.88 193.6 2042.88 178.48Z' },
    { id: 'i2-ray-top', fill: INK, d: 'M2024.13 109.36L1999.86 109.36 2010.9 28.75 2024.13 109.36Z' },
    { id: 'i2-ray-right', fill: INK, d: 'M2073.11 161.1L2060.98 140.08 2136.31 109.37 2073.11 161.1Z' },
    { id: 'i2-ray-left', fill: INK, d: 'M1950.89 161.1L1963.03 140.08 1887.69 109.37 1950.89 161.1Z' },
    { id: 't', fill: INK, d: 'M2655.47 304.46L2655.47 351.71 2446.79 351.71 2446.79 723.91 2348.86 723.91 2348.86 351.71 2140.17 351.71 2140.17 304.46 2655.47 304.46Z' },
    { id: 's2', fill: INK, d: 'M3063.66 520.16C3042.36 509.45 3018.93 500.23 2993.38 492.45 2967.83 484.69 2943.71 477.43 2920.98 470.71 2898.28 464.01 2878.93 458.04 2862.96 452.78 2847.01 447.52 2834.21 442.07 2824.63 436.41 2815.06 430.75 2808.14 424.64 2803.88 418.13 2799.61 411.62 2797.49 403.96 2797.49 395.14 2797.49 355.7 2840.43 335.98 2926.31 335.98 2956.12 335.98 2985.57 338.27 3014.68 342.88 3043.76 347.5 3069.68 353.37 3092.39 360.52L3095.66 352.21C3075.5 344.88 3062.44 330.11 3065.88 317.31 3067.23 312.29 3071.06 308.33 3076.35 305.52 3060.78 302 3044.04 298.87 3025.86 296.27 2993.56 291.65 2960.39 289.34 2926.31 289.34 2892.95 289.34 2862.43 291.65 2834.75 296.27 2807.08 300.91 2783.29 307.83 2763.41 317.05 2743.56 326.31 2728.1 337.83 2717.11 351.71 2706.09 365.54 2700.6 381.51 2700.6 399.55 2700.6 415.52 2705.74 429.48 2716.06 441.46 2726.31 453.39 2739.99 464.1 2757.03 473.56 2774.06 482.99 2793.76 491.41 2816.12 498.77 2838.47 506.08 2861.71 513.14 2885.86 519.85 2907.15 525.71 2927.2 531.41 2946.02 536.84 2964.82 542.29 2981.31 548.51 2995.51 555.42 3009.72 562.38 3020.88 570.14 3029.06 578.72 3037.22 587.33 3041.3 597.75 3041.3 609.91 3041.3 631.76 3027.1 648.44 2998.71 659.97 2970.31 671.53 2933.07 677.29 2886.92 677.29 2854.98 677.29 2823.21 674.99 2791.63 670.37 2760.05 665.77 2723.28 691.56 2701.7 696.29L2685.69 698.72C2715.5 707.14 2748.33 713.41 2784.18 717.61 2820.01 721.81 2854.98 723.91 2889.04 723.91 2923.81 723.91 2956.28 721.16 2986.47 715.71 3016.63 710.25 3042.89 702.49 3065.26 692.41 3087.62 682.35 3105.34 670.18 3118.48 655.89 3131.61 641.62 3138.19 625.44 3138.19 607.4 3138.19 588.49 3131.09 571.89 3116.89 557.62 3102.68 543.35 3084.96 530.87 3063.66 520.16' },
  ]

  // ---------------------------------------------------------------- math
  const TAU = Math.PI * 2
  const clamp = (v, lo = 0, hi = 1) => (v < lo ? lo : v > hi ? hi : v)
  /** Maps `v` from [a, b] to [0, 1], clamped. */
  const progress = (v, a, b) => clamp((v - a) / (b - a))

  const ease = {
    inQuad: (t) => t * t,
    outQuad: (t) => 1 - (1 - t) * (1 - t),
    outCubic: (t) => 1 - (1 - t) ** 3,
    inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  }

  /**
   * Closed-form damped harmonic oscillator: displacement from rest at time `t` (seconds) for an initial
   * displacement `x0` and velocity `v0`. `freq` is in Hz, `damping` is the damping ratio (<1 bounces).
   */
  function spring(t, x0, v0 = 0, freq = 2, damping = 0.4) {
    if (t <= 0) return x0
    const w0 = TAU * freq
    const wd = w0 * Math.sqrt(1 - damping * damping)
    const b = (v0 + damping * w0 * x0) / wd
    return Math.exp(-damping * w0 * t) * (x0 * Math.cos(wd * t) + b * Math.sin(wd * t))
  }

  /** Spring that goes from `from` to `to`, starting at `start`, with an initial velocity. */
  const springTo = (t, start, from, to, freq = 2, damping = 0.4, v0 = 0) =>
    t <= start ? from : to + spring(t - start, from - to, v0, freq, damping)

  /** Deterministic PRNG (mulberry32), in [0, 1): the reveal is the same on every load. */
  function rng(seed) {
    let a = seed >>> 0
    return () => {
      a = (a + 0x6d2b79f5) >>> 0
      let t = a
      t = Math.imul(t ^ (t >>> 15), t | 1)
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }

  // ---------------------------------------------------------------- svg
  function el(tag, attrs, parent) {
    const node = document.createElementNS(SVG_NS, tag)
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v))
    parent.appendChild(node)
    return node
  }

  /** Writes a transform attribute on an SVG element, around the origin (ox, oy). */
  function setTransform(node, { x = 0, y = 0, s = 1, sx = s, sy = s, ox = 0, oy = 0 }) {
    let v = `translate(${x + ox} ${y + oy})`
    if (sx !== 1 || sy !== 1) v += ` scale(${sx} ${sy})`
    if (ox || oy) v += ` translate(${-ox} ${-oy})`
    node.setAttribute('transform', v)
  }

  const setOpacity = (node, o) => node.setAttribute('opacity', o >= 1 ? '1' : o <= 0 ? '0' : o.toFixed(4))
  const setVisible = (node, visible) => node.setAttribute('visibility', visible ? 'visible' : 'hidden')

  // ---------------------------------------------------------------- the reveal
  /** Left to right, the bumpers the ball hits in turn; `hit` is where it strikes the top of the glyph. */
  const LETTERS = [
    { ids: ['s1'], hit: [930, 289] },
    { ids: ['i1-stem', 'i1-dot'], rays: ['i1-ray-left', 'i1-ray-top', 'i1-ray-right'], hit: [1249, 143] },
    { ids: ['b'], hit: [1600, 304.5] },
    { ids: ['i2-stem', 'i2-dot'], rays: ['i2-ray-left', 'i2-ray-top', 'i2-ray-right'], hit: [2012, 143] },
    { ids: ['t'], hit: [2398, 304.5] },
    { ids: ['s2'], hit: [2927, 289] },
  ]
  const RINGS = ['o-ring-1', 'o-ring-2', 'o-ring-3']
  const BALL = ['o-pupil', 'o-pupil-rim']

  const DURATION = 3.6
  const GRAVITY = 20000 // logo units / s²
  const BALL_RADIUS = 39
  const FLIGHT_SCALE = 1.9 // the ball grows as it leaves the O (closer to the camera)

  // The O loads like a plunger, then fires the pupil.
  const INTRO_FADE = 0.08 // the O pops in (scale spring), with a very short fade
  const CHARGE_START = 0.18
  const LAUNCH = 0.52
  /** Flight time of each hop: launch → s1, s1 → i1, …, t → s2, then the lob back into the O. */
  const HOPS = [0.36, 0.22, 0.34, 0.24, 0.3, 0.26, 0.62]
  const DROP_IN = 0.28 // the ball shrinks back to size during the end of the lob

  const RIPPLE_TIME = 0.7

  /** Pinball lamps blink rather than fade: on, off, on, dim, off. */
  const blink = (u) =>
    u < 0 ? 0 : u < 0.07 ? 1 : u < 0.11 ? 0 : u < 0.18 ? 0.9 : u < 0.22 ? 0 : u < 0.27 ? 0.45 : 0
  const BUMPER_TIME = 0.32
  const CONTACT = 0.045 // half-width (s) of the visible squash around each contact
  const GHOSTS = 4
  const GHOST_STEP = 1 / 90

  /** Builds the scene in `svg` (already in the document) and returns `render(t)`, a pure function of time. */
  function createReveal(svg) {
    const part = (id) => PARTS.find((p) => p.id === id)
    /** Appends one <path> per piece and returns them by id. */
    const drawParts = (parent, ids, fill) => {
      const out = {}
      for (const id of ids) out[id] = el('path', { d: part(id).d, fill: fill ?? part(id).fill }, parent)
      return out
    }
    /** Exact bounding box of the union of several pieces. */
    const box = (ids) => {
      const probe = el('g', { visibility: 'hidden' }, svg)
      drawParts(probe, ids)
      const b = probe.getBBox()
      probe.remove()
      return { x: b.x, y: b.y, w: b.width, h: b.height, cx: b.x + b.width / 2, cy: b.y + b.height / 2 }
    }

    const random = rng(23)
    const pupil = box(BALL)
    const cx = pupil.cx
    const cy = pupil.cy
    const flightR = BALL_RADIUS * FLIGHT_SCALE

    // ------------------------------------------------ ballistic path through the contact points
    const points = [[cx, cy], ...LETTERS.map((L) => [L.hit[0], L.hit[1] - flightR]), [cx, cy]]
    const hops = []
    let clock = LAUNCH
    HOPS.forEach((dur, i) => {
      const [x0, y0] = points[i]
      const [x1, y1] = points[i + 1]
      // Vertical launch speed that lands exactly on the next point after `dur` under gravity.
      hops.push({ t0: clock, t1: clock + dur, x0, y0, x1, y1, vy0: (y1 - y0) / dur - (GRAVITY * dur) / 2 })
      clock += dur
    })
    const hitTimes = hops.slice(0, LETTERS.length).map((h) => h.t1)
    const landing = hops[hops.length - 1].t1

    /** Ball centre and velocity at time t. */
    const ball = (t) => {
      if (t <= LAUNCH || t >= landing) return { x: cx, y: cy, vx: 0, vy: 0 }
      const h = hops.find((hop) => t < hop.t1) ?? hops[hops.length - 1]
      const tau = t - h.t0
      const vx = (h.x1 - h.x0) / (h.t1 - h.t0)
      return {
        x: h.x0 + vx * tau,
        y: h.y0 + h.vy0 * tau + (GRAVITY * tau * tau) / 2,
        vx,
        vy: h.vy0 + GRAVITY * tau,
      }
    }
    /** Size of the ball: grows on launch, shrinks back as it drops into the O. */
    const intro = (t) => springTo(t, 0, 0.6, 1, 2.6, 0.5)
    const ballScale = (t) =>
      t < LAUNCH
        ? intro(t) * (1 - 0.14 * ease.inOutSine(progress(t, CHARGE_START, LAUNCH)))
        : t < landing - DROP_IN
          ? springTo(t, LAUNCH, 0.86, FLIGHT_SCALE, 4, 0.5)
          : FLIGHT_SCALE + (1 - FLIGHT_SCALE) * ease.inQuad(progress(t, landing - DROP_IN, landing))

    // ------------------------------------------------ scene
    const world = el('g', {}, svg)
    const bumperLayer = el('g', { fill: 'none', stroke: GREEN }, world)
    const ripple = el(
      'ellipse',
      { cx, cy, fill: 'none', stroke: GREEN, transform: `rotate(-15 ${cx} ${cy})` },
      world,
    )

    const rings = RINGS.map((id, i) => ({ el: drawParts(world, [id])[id], delay: (2 - i) * 0.055 }))

    const letters = LETTERS.map((spec, i) => {
      const g = el('g', {}, world)
      drawParts(g, spec.ids)
      const dark = part(spec.ids[0]).fill === INK
      const flash = el('g', {}, g)
      drawParts(flash, spec.ids, dark ? GREEN : FLASH_LIGHT)
      const rays = (spec.rays ?? []).map((id) => drawParts(g, [id])[id])
      const dot = spec.rays ? box([spec.ids[1]]) : undefined
      const bumper = el('ellipse', { cx: spec.hit[0], cy: spec.hit[1] }, bumperLayer)
      return { g, box: box(spec.ids), flash, rays, dot, bumper, at: hitTimes[i] }
    })

    // Motion-blur echoes of the ball, then the ball itself.
    const ghosts = Array.from({ length: GHOSTS }, (_, k) => {
      const g = el('g', { opacity: 0.32 * (1 - k / GHOSTS) }, world)
      drawParts(g, BALL)
      return g
    })
    const ballEl = el('g', {}, world)
    drawParts(ballEl, BALL)

    // Each impact jolts the frame a little, in a seeded direction.
    const jolts = hitTimes.map((at, i) => ({ at, angle: random() * TAU, amp: 7 + i * 0.6 }))

    const placeBall = (node, t) => {
      const b = ball(t)
      const speed = Math.hypot(b.vx, b.vy)
      // Squash against the letter tops around each contact; stretch along the velocity in flight.
      let contact = 0
      for (const at of hitTimes) contact = Math.max(contact, 1 - Math.abs(t - at) / CONTACT)
      contact = clamp(contact)
      const stretch = 1 + clamp(speed / 14000, 0, 0.35) * (1 - contact)
      const angle = (Math.atan2(b.vy, b.vx) * 180) / Math.PI
      const land = t > landing ? spring(t - landing, 0, -2.4, 5, 0.4) : 0
      const squashY = (1 - 0.38 * ease.outQuad(contact)) * (1 + land)
      const squashX = 1 / Math.sqrt(squashY)
      const s = ballScale(t)
      // Contacts happen at the bottom of the ball: keep that point on the surface while it squashes.
      const drop = BALL_RADIUS * s * (1 - squashY)
      // Tension tremble while the plunger is pulled.
      const charge = t < LAUNCH ? ease.inQuad(progress(t, CHARGE_START, LAUNCH)) : 0
      const shake = charge * 5 * Math.sin(t * 97)
      node.setAttribute(
        'transform',
        `translate(${b.x + shake} ${b.y + drop}) scale(${squashX * s} ${squashY * s}) rotate(${angle}) ` +
          `scale(${stretch} ${1 / Math.sqrt(stretch)}) rotate(${-angle}) translate(${-cx} ${-cy})`,
      )
    }

    return (t) => {
      // Frame jolt.
      let jx = 0
      let jy = 0
      for (const j of jolts) {
        if (t <= j.at) continue
        const k = spring(t - j.at, 0, j.amp * 40, 9, 0.35)
        jx += Math.cos(j.angle) * k * 0.4
        jy += Math.sin(j.angle) * k * 0.4 + k
      }
      setTransform(world, { x: jx, y: jy })

      // O: loads while the pupil charges, recoils at the launch, ripples when the ball drops back in.
      rings.forEach((ring, i) => {
        const depth = 0.03 + 0.015 * i // the inner rings are pulled in the most
        const load = -depth * ease.inOutSine(progress(t, CHARGE_START, LAUNCH))
        const recoil = t > LAUNCH ? spring(t - LAUNCH, -depth, 1.2, 3.2, 0.4) : 0
        const splash = t > landing + ring.delay ? spring(t - landing - ring.delay, 0, 1.5, 3.2, 0.34) : 0
        const s = intro(t) * (1 + (t < LAUNCH ? load : recoil) + splash)
        setTransform(ring.el, { s, ox: cx, oy: cy })
        setOpacity(ring.el, progress(t, 0, INTRO_FADE))
      })
      // A light ripple spreads from the pupil when the ball lands.
      const rp = progress(t, landing, landing + RIPPLE_TIME)
      setVisible(ripple, rp > 0 && rp < 1)
      ripple.setAttribute('rx', String(40 + 640 * ease.outCubic(rp)))
      ripple.setAttribute('ry', String((40 + 640 * ease.outCubic(rp)) * 1.08))
      ripple.setAttribute('stroke-width', String(3 + 12 * (1 - rp)))
      setOpacity(ripple, 0.55 * (1 - rp) ** 1.5)

      placeBall(ballEl, t)
      setOpacity(ballEl, progress(t, 0, INTRO_FADE))
      ghosts.forEach((g, k) => {
        const tg = t - (k + 1) * GHOST_STEP
        const live = tg > LAUNCH && t < landing
        setVisible(g, live)
        if (live) placeBall(g, tg)
      })

      for (const L of letters) {
        const since = t - L.at
        const on = since >= 0
        setVisible(L.g, on)
        if (!on) {
          setOpacity(L.bumper, 0)
          continue
        }
        // Bumper kick: pops in, squashed by the hit from above, then settles.
        const pop = springTo(t, L.at, 0.9, 1, 3.4, 0.35, 1.2)
        const squash = spring(since, 0, 2.4, 4.2, 0.38)
        setTransform(L.g, {
          sx: pop * (1 + squash * 0.5),
          sy: pop * (1 - squash),
          ox: L.box.cx,
          oy: L.box.y + L.box.h,
        })
        setOpacity(L.flash, blink(since))
        L.rays.forEach((ray, k) => {
          const start = L.at + 0.12 + k * 0.05
          setOpacity(ray, t >= start ? 1 : 0)
          setTransform(ray, { s: springTo(t, start, 0, 1, 3.2, 0.42), ox: L.dot.cx, oy: L.dot.cy })
        })
        // Ring of light where the ball struck.
        const p = progress(since, 0, BUMPER_TIME)
        const rr = 30 + 190 * ease.outCubic(p)
        L.bumper.setAttribute('rx', String(rr))
        L.bumper.setAttribute('ry', String(rr * 0.42))
        L.bumper.setAttribute('stroke-width', String(22 * (1 - p) + 3))
        setOpacity(L.bumper, p < 1 ? 0.85 * (1 - p) : 0)
      }
    }
  }

  // ---------------------------------------------------------------- playback
  function play(img) {
    const host = img.parentElement // positioned (see index.html): the overlay is placed inside it
    const svg = document.createElementNS(SVG_NS, 'svg')
    svg.setAttribute('class', 'logo-animation')
    svg.setAttribute('viewBox', `0 0 ${ARTBOARD[0]} ${ARTBOARD[1]}`)
    svg.setAttribute('aria-hidden', 'true')
    host.appendChild(svg)

    /** Lays the overlay exactly over the image's content box (sub-pixel, so the hand-over shows no jump). */
    const place = () => {
      const outer = host.getBoundingClientRect()
      const r = img.getBoundingClientRect()
      const pad = getComputedStyle(img)
      const left = parseFloat(pad.paddingLeft)
      const top = parseFloat(pad.paddingTop)
      svg.style.left = `${r.left - outer.left + left}px`
      svg.style.top = `${r.top - outer.top + top}px`
      svg.style.width = `${r.width - left - parseFloat(pad.paddingRight)}px`
      svg.style.height = `${r.height - top - parseFloat(pad.paddingBottom)}px`
    }
    place()
    // Kept for the life of the page: the overlay remains the visible logo.
    const observer = new ResizeObserver(place)
    observer.observe(host)
    observer.observe(img)

    let render
    try {
      render = createReveal(svg)
      render(0)
    } catch (error) {
      observer.disconnect()
      svg.remove()
      throw error
    }

    let time = 0
    let last = 0
    const frame = (now) => {
      // Capped step: coming back to a tab that was hidden resumes the reveal instead of skipping it.
      if (last) time += Math.min(0.1, Math.max(0, (now - last) / 1000))
      last = now
      if (time < DURATION) {
        render(time)
        requestAnimationFrame(frame)
        return
      }
      // Over: the last frames already match the artwork, swap the scene for a pristine copy of the logo.
      svg.replaceChildren()
      for (const p of PARTS) el('path', { d: p.d, fill: p.fill }, svg)
      document.documentElement.classList.add(REVEALED_CLASS)
    }
    requestAnimationFrame(frame)
  }

  document.addEventListener('DOMContentLoaded', () => {
    const img = document.getElementById('logo')
    const start = () => {
      try {
        play(img)
      } catch (error) {
        giveUp()
        throw error
      }
    }
    if (!img) giveUp()
    else if (img.complete) start()
    else {
      // The image has no size until it is loaded.
      img.addEventListener('load', start, { once: true })
      img.addEventListener('error', giveUp, { once: true })
    }
  })
})()
