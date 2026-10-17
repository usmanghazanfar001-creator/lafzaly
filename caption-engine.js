/* Lafzaly caption engine
 * One canvas renderer used by BOTH the live preview and the video export, so what you see is
 * what you export. Pure drawing code: no DOM access except document.fonts (optional).
 *
 *   CaptionEngine.buildCues(segments, wordsPerCue) -> cues
 *   CaptionEngine.draw(ctx, W, H, t, cues, style, opts)   // draws captions for time t
 *   CaptionEngine.fontReady(style)                         // promise: webfont loaded
 *
 * style = { font, size, pos, align, color, accent, weight, caseMode, bg, outline, anim, hl }
 *   size is in "reference px" for a 360px-wide video; it is scaled to the real canvas width.
 * anim: none | fade | pop | slide (whole line)  and  word-pop | word-slide | typewriter | bounce (per word)
 */
(function (root) {
  'use strict';
  var REF_W = 360;

  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function easeOutCubic(p) { return 1 - Math.pow(1 - p, 3); }
  function easeOutBack(p) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); }

  /* ---------- cues: split segments into words with estimated per-word timing ---------- */
  function buildCues(segments, wordsPerCue) {
    var N = wordsPerCue | 0, cues = [];
    (segments || []).slice().sort(function (a, b) { return a.start - b.start; }).forEach(function (seg) {
      var words = String(seg.text || '').split(/\s+/).filter(Boolean);
      if (!words.length || !(seg.end > seg.start)) return;
      // Time is shared out by word length (longer words take longer to say) — whisper's own
      // word times are not kept after the Roman Urdu rewrite, so this is an estimate.
      var real = Array.isArray(seg.words) && seg.words.length === words.length ? seg.words : null;
      var weights = words.map(function (w) { return w.length + 1.5; });
      var total = weights.reduce(function (a, b) { return a + b; }, 0);
      var dur = seg.end - seg.start, acc = 0;
      var timed = real ? words.map(function (w, i) {
        return { text: w, start: real[i][0], end: Math.max(real[i][1], real[i][0] + 0.05) };
      }) : words.map(function (w, i) {
        var s = seg.start + dur * (acc / total); acc += weights[i];
        return { text: w, start: s, end: seg.start + dur * (acc / total) };
      });
      if (N <= 0 || N >= timed.length) {
        cues.push({ start: seg.start, end: seg.end, words: timed });
      } else {
        for (var i = 0; i < timed.length; i += N) {
          var g = timed.slice(i, i + N);
          var last = i + N >= timed.length;
          var nextStart = last ? seg.end : timed[i + N].start;
          cues.push({ start: g[0].start, end: nextStart, words: g });
        }
      }
    });
    return cues;
  }

  function findCue(cues, t) {
    var lo = 0, hi = cues.length - 1;
    while (lo <= hi) {
      var mid = (lo + hi) >> 1, c = cues[mid];
      if (t < c.start) hi = mid - 1; else if (t >= c.end) lo = mid + 1; else return c;
    }
    return null;
  }

  function rrect(ctx, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
  }

  /* ---------- main draw ---------- */
  function draw(ctx, W, H, t, cues, st, opts) {
    opts = opts || {};
    var cue = findCue(cues, t);
    if (!cue) return;
    var S = W / REF_W, px = Math.max(8, Math.round(st.size * S));
    var cm = st.caseMode || 'normal', upper = cm.indexOf('upper') === 0;
    var ls = cm === 'upper-wide' ? 0.12 * px : (cm === 'wide' ? 0.05 * px : 0);
    var accent = st.accent || '#F2A93B';

    ctx.save();
    ctx.font = (cm === 'italic' ? 'italic ' : '') + (st.weight || 800) + ' ' + px + 'px ' + st.font;
    ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
    if ('letterSpacing' in ctx) ctx.letterSpacing = ls + 'px';

    var words = cue.words.map(function (w) { return { text: w.text, label: upper ? w.text.toUpperCase() : w.text, start: w.start, end: w.end }; });
    words.forEach(function (w) { w.w = ctx.measureText(w.label).width; });
    var spaceW = ctx.measureText(' ').width + px * 0.07;   // a little extra so scaled words never touch

    // padding by background style
    var pad = { x: 4 * S, y: 4 * S, r: 0 };
    if (st.bg === 'box') pad = { x: 14 * S, y: 8 * S, r: 10 * S };
    else if (st.bg === 'gradient') pad = { x: 14 * S, y: 8 * S, r: 0 };
    else if (st.bg === 'pill') pad = { x: 20 * S, y: 7 * S, r: 999 };
    else if (st.bg === 'glass') pad = { x: 20 * S, y: 10 * S, r: 18 * S };
    else if (st.bg === 'marker') pad = { x: 2 * S, y: 2 * S, r: 4 * S };
    else if (st.bg === 'ribbon') pad = { x: 20 * S, y: 10 * S, r: 0 };
    else if (st.bg === 'bar') pad = { x: 18 * S, y: 4 * S, r: 0 };
    else if (st.bg === 'frame') pad = { x: 18 * S, y: 10 * S, r: 6 * S };

    // wrap
    var maxLineW = W * 0.88 - pad.x * 2, lines = [], cur = null;
    words.forEach(function (w) {
      if (!cur) { cur = { words: [w], w: w.w }; lines.push(cur); return; }
      if (cur.w + spaceW + w.w <= maxLineW) { cur.words.push(w); cur.w += spaceW + w.w; }
      else { cur = { words: [w], w: w.w }; lines.push(cur); }
    });
    var lineH = px * 1.25, blockW = 0;
    lines.forEach(function (l) { blockW = Math.max(blockW, l.w); });
    var blockH = lines.length * lineH;

    // position: pos = distance of the block's bottom edge from the bottom of the frame
    // >=70 = top of frame, 35-70 = vertically centred, below that = distance from the bottom edge
    var posN = parseFloat(st.pos) || 8, blockTop, blockBottom;
    if (posN >= 70) { blockTop = H * 0.07 + pad.y; blockBottom = blockTop + blockH; }
    else if (posN >= 35) { blockTop = (H - blockH) / 2; blockBottom = blockTop + blockH; }
    else { blockBottom = H - H * posN / 100 - pad.y; blockTop = blockBottom - blockH; }
    var align = st.align || 'center';
    var blockX = align === 'left' ? W * 0.07 + pad.x : (align === 'right' ? W * 0.93 - pad.x - blockW : (W - blockW) / 2);

    // whole-line animation (fade / pop / slide)
    var A = st.anim || 'none', lineA = 1, lineScale = 1, lineDY = 0;
    if (A === 'fade' || A === 'pop' || A === 'slide') {
      var k = clamp((t - cue.start) / 0.28, 0, 1);
      if (A === 'fade') lineA = easeOutCubic(k);
      if (A === 'pop') { lineScale = 0.8 + 0.2 * easeOutBack(k); lineA = Math.min(1, k * 3); }
      if (A === 'slide') { lineDY = (1 - easeOutCubic(k)) * 16 * S; lineA = k; }
    }
    var cx = blockX + blockW / 2, cy = blockTop + blockH / 2;
    ctx.translate(cx, cy + lineDY); ctx.scale(lineScale, lineScale); ctx.translate(-cx, -cy);
    ctx.globalAlpha = lineA;

    /* ----- background ----- */
    var bx = blockX - pad.x, by = blockTop - pad.y, bw = blockW + pad.x * 2, bh = blockH + pad.y * 2;
    if (st.bg === 'box') { ctx.fillStyle = 'rgba(0,0,0,.55)'; rrect(ctx, bx, by, bw, bh, pad.r); ctx.fill(); }
    else if (st.bg === 'gradient') {
      var g = ctx.createLinearGradient(0, by - px * 0.6, 0, by + bh);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.75)');
      ctx.fillStyle = g; ctx.fillRect(Math.max(0, bx - 10 * S), by - px * 0.6, Math.min(W, bw + 20 * S), bh + px * 0.6);
    } else if (st.bg === 'pill') {
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 18 * S; ctx.shadowOffsetY = 6 * S;
      ctx.fillStyle = accent; rrect(ctx, bx, by, bw, bh, Math.min(bh / 2, 40 * S)); ctx.fill(); ctx.restore();
    } else if (st.bg === 'glass') {
      ctx.save(); rrect(ctx, bx, by, bw, bh, pad.r); ctx.clip();
      if (opts.drawBackdrop && 'filter' in ctx) { try { ctx.filter = 'blur(' + Math.round(14 * S) + 'px) saturate(1.4)'; opts.drawBackdrop(); ctx.filter = 'none'; } catch (e) { ctx.filter = 'none'; } }
      ctx.fillStyle = 'rgba(255,255,255,.16)'; ctx.fillRect(bx, by, bw, bh); ctx.restore();
      ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.lineWidth = Math.max(1, S); rrect(ctx, bx, by, bw, bh, pad.r); ctx.stroke(); ctx.restore();
    } else if (st.bg === 'marker') {
      ctx.fillStyle = accent;
      lines.forEach(function (l, li) {
        var lx = align === 'center' ? blockX + (blockW - l.w) / 2 : (align === 'right' ? blockX + blockW - l.w : blockX);
        rrect(ctx, lx - 8 * S, blockTop + li * lineH + lineH * 0.06, l.w + 16 * S, lineH * 0.94, pad.r); ctx.fill();
      });
    } else if (st.bg === 'ribbon') {
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.3)'; ctx.shadowBlur = 14 * S; ctx.shadowOffsetY = 4 * S;
      ctx.fillStyle = accent; ctx.fillRect(0, by, W, bh); ctx.restore();
    } else if (st.bg === 'bar') {
      ctx.fillStyle = accent; rrect(ctx, bx, by, 4 * S, bh, 2 * S); ctx.fill();
    } else if (st.bg === 'frame') {
      ctx.fillStyle = 'rgba(0,0,0,.35)'; rrect(ctx, bx, by, bw, bh, pad.r); ctx.fill();
      ctx.strokeStyle = accent; ctx.lineWidth = Math.max(1.5, 2 * S); rrect(ctx, bx, by, bw, bh, pad.r); ctx.stroke();
    } else if (st.bg === 'neonbox') {
      ctx.save(); ctx.fillStyle = 'rgba(10,6,24,.72)'; rrect(ctx, bx, by, bw, bh, 14 * S); ctx.fill();
      ctx.shadowColor = accent; ctx.shadowBlur = 16 * S; ctx.strokeStyle = accent; ctx.lineWidth = Math.max(1.5, 2.2 * S);
      rrect(ctx, bx, by, bw, bh, 14 * S); ctx.stroke(); ctx.stroke(); ctx.restore();
    } else if (st.bg === 'tape') {
      ctx.save(); var tcx = bx + bw / 2, tcy = by + bh / 2; ctx.translate(tcx, tcy); ctx.rotate(-0.025); ctx.translate(-tcx, -tcy);
      ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 10 * S; ctx.shadowOffsetY = 3 * S;
      ctx.fillStyle = accent; ctx.fillRect(bx - 6 * S, by, bw + 12 * S, bh);
      ctx.shadowColor = 'transparent'; ctx.fillStyle = 'rgba(255,255,255,.28)';
      ctx.fillRect(bx - 6 * S, by, 5 * S, bh); ctx.fillRect(bx + bw + 1 * S, by, 5 * S, bh); ctx.restore();
    } else if (st.bg === 'vignette') {
      var vr = Math.max(bw, bh * 2.5) * 0.62, vg = ctx.createRadialGradient(bx + bw / 2, by + bh / 2, 0, bx + bw / 2, by + bh / 2, vr);
      vg.addColorStop(0, 'rgba(0,0,0,.6)'); vg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = vg; ctx.fillRect(0, by - vr, W, vr * 2 + bh);
    } else if (st.bg === 'underline') {
      ctx.fillStyle = accent;
      lines.forEach(function (l, li) {
        var lx = align === 'center' ? blockX + (blockW - l.w) / 2 : (align === 'right' ? blockX + blockW - l.w : blockX);
        rrect(ctx, lx, blockTop + li * lineH + lineH * 0.88, l.w, Math.max(2, px * 0.1), px * 0.05); ctx.fill();
      });
    }

    /* ----- words ----- */
    var active = -1;
    words.forEach(function (w, i) { if (t >= w.start) active = i; });
    var reveal = (A === 'word-pop' || A === 'word-slide' || A === 'typewriter');
    var useHl = !!st.hl || A === 'bounce';

    lines.forEach(function (l, li) {
      var x = align === 'center' ? blockX + (blockW - l.w) / 2 : (align === 'right' ? blockX + blockW - l.w : blockX);
      var baseline = blockTop + li * lineH + lineH / 2 + px * 0.34;
      l.words.forEach(function (w) {
        var i = words.indexOf(w), wx = x;
        x += w.w + spaceW;
        var started = t >= w.start, p = clamp((t - w.start) / 0.18, 0, 1);
        var alpha = 1, sc = 1, dy = 0, col = st.color, label = w.label;
        if (reveal && !started) return;
        if (A === 'word-pop') { sc = 0.55 + 0.45 * easeOutBack(p); alpha = Math.min(1, p * 4); }
        else if (A === 'word-slide') { dy = (1 - easeOutCubic(p)) * 0.4 * px; alpha = p; }
        else if (A === 'typewriter') {
          var q = clamp((t - w.start) / Math.max(0.08, (w.end - w.start) * 0.9), 0, 1);
          label = w.label.slice(0, Math.max(1, Math.ceil(w.label.length * q)));
        } else if (A === 'bounce' && i === active) {
          var qb = clamp((t - w.start) / 0.28, 0, 1);
          sc = 1.02 + 0.1 * Math.sin(Math.PI * qb);
        }
        if (useHl) {
          if (i === active) { col = accent; sc *= (A === 'bounce' ? 1 : 1.04); }
          else if (i > active && !reveal) alpha *= 0.45;
        }
        paintWord(ctx, label, wx, baseline + dy, w.w, px, sc, alpha * 1, col, st.outline, accent, S);
      });
    });
    ctx.restore();
  }

  function paintWord(ctx, label, x, y, w, px, sc, alpha, color, outline, accent, S) {
    ctx.save();
    ctx.globalAlpha *= alpha;
    var mx = x + w / 2, my = y - px * 0.3;
    ctx.translate(mx, my); ctx.scale(sc, sc); ctx.translate(-w / 2, px * 0.3);
    if (outline === 'outline') {
      ctx.lineJoin = 'round'; ctx.lineWidth = 3 * S; ctx.strokeStyle = '#000'; ctx.strokeText(label, 0, 0);
    }
    ctx.fillStyle = color;
    if (outline === 'shadow') { ctx.shadowColor = 'rgba(0,0,0,.85)'; ctx.shadowBlur = 6 * S; ctx.shadowOffsetY = 2 * S; ctx.fillText(label, 0, 0); }
    else if (outline === 'soft') {
      ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 3 * S; ctx.shadowOffsetY = 1 * S; ctx.fillText(label, 0, 0);
      ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 12 * S; ctx.shadowOffsetY = 0; ctx.fillText(label, 0, 0);
    } else if (outline === 'glow') {
      ctx.shadowColor = accent; ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 30 * S; ctx.fillText(label, 0, 0);
      ctx.shadowBlur = 16 * S; ctx.fillText(label, 0, 0);
      ctx.shadowBlur = 6 * S; ctx.fillText(label, 0, 0);
    } else if (outline === 'hollow') {
      ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(1.5, 2.4 * S); ctx.strokeStyle = color; ctx.strokeText(label, 0, 0);
      ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fillText(label, 0, 0);
    } else if (outline === 'retro') {
      ctx.fillStyle = accent;
      for (var i = 7; i >= 1; i--) ctx.fillText(label, i * 0.75 * S, i * 0.75 * S);
      ctx.lineJoin = 'round'; ctx.lineWidth = 2 * S; ctx.strokeStyle = '#14110E'; ctx.strokeText(label, 0, 0);
      ctx.fillStyle = color; ctx.fillText(label, 0, 0);
    } else if (outline === 'long') {
      ctx.fillStyle = 'rgba(0,0,0,.5)';
      for (var j = 14; j >= 1; j--) ctx.fillText(label, j * 0.8 * S, j * 0.8 * S);
      ctx.fillStyle = color; ctx.fillText(label, 0, 0);
    } else if (outline === 'sticker') {
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 8 * S; ctx.shadowOffsetY = 3 * S;
      ctx.lineJoin = 'round'; ctx.lineWidth = 7 * S; ctx.strokeStyle = '#ffffff'; ctx.strokeText(label, 0, 0); ctx.restore();
      ctx.fillStyle = color; ctx.fillText(label, 0, 0);
    } else if (outline === 'glitch') {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgba(0,255,255,.85)'; ctx.fillText(label, -2 * S, 0);
      ctx.fillStyle = 'rgba(255,0,110,.85)'; ctx.fillText(label, 2 * S, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = color; ctx.fillText(label, 0, 0);
    } else if (outline === 'chrome') {
      var ch = ctx.createLinearGradient(0, -px * 0.8, 0, px * 0.15);
      ch.addColorStop(0, '#ffffff'); ch.addColorStop(0.45, '#b9c3d1'); ch.addColorStop(0.5, '#59647a'); ch.addColorStop(0.75, '#d9e1ec'); ch.addColorStop(1, '#ffffff');
      ctx.lineJoin = 'round'; ctx.lineWidth = 3.2 * S; ctx.strokeStyle = 'rgba(8,12,24,.95)'; ctx.strokeText(label, 0, 0);
      ctx.fillStyle = ch; ctx.fillText(label, 0, 0);
    } else if (outline === 'fire') {
      var fg = ctx.createLinearGradient(0, -px * 0.85, 0, px * 0.15);
      fg.addColorStop(0, '#FFF3A0'); fg.addColorStop(0.45, '#FFB300'); fg.addColorStop(1, '#FF2D1A');
      ctx.save(); ctx.shadowColor = 'rgba(255,90,0,.9)'; ctx.shadowBlur = 18 * S; ctx.fillStyle = fg; ctx.fillText(label, 0, 0); ctx.restore();
      ctx.lineJoin = 'round'; ctx.lineWidth = 2 * S; ctx.strokeStyle = 'rgba(70,10,0,.85)'; ctx.strokeText(label, 0, 0);
      ctx.fillStyle = fg; ctx.fillText(label, 0, 0);
    } else if (outline === 'neonline') {
      ctx.lineJoin = 'round'; ctx.strokeStyle = accent; ctx.lineWidth = Math.max(1.5, 2.2 * S);
      ctx.shadowColor = accent; ctx.shadowBlur = 20 * S; ctx.strokeText(label, 0, 0); ctx.shadowBlur = 8 * S; ctx.strokeText(label, 0, 0);
      ctx.shadowBlur = 0; ctx.fillStyle = color; ctx.globalAlpha *= 0.92; ctx.fillText(label, 0, 0);
    } else if (outline === 'badge') {
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 8 * S; ctx.shadowOffsetY = 3 * S;
      ctx.lineJoin = 'round'; ctx.lineWidth = 7 * S; ctx.strokeStyle = accent; ctx.strokeText(label, 0, 0); ctx.restore();
      ctx.fillStyle = color; ctx.fillText(label, 0, 0);
    } else if (outline === 'gradient') {
      var gr = ctx.createLinearGradient(0, -px * 0.8, 0, px * 0.15); gr.addColorStop(0, color); gr.addColorStop(1, accent);
      ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 8 * S; ctx.shadowOffsetY = 2 * S;
      ctx.fillStyle = gr; ctx.fillText(label, 0, 0);
    } else ctx.fillText(label, 0, 0);
    ctx.restore();
  }

  function fontReady(st) {
    try {
      if (!root.document || !document.fonts || !document.fonts.load) return Promise.resolve();
      var f = (st.caseMode === 'italic' ? 'italic ' : '') + (st.weight || 800) + ' 32px ' + st.font;
      return document.fonts.load(f, 'Aaj hum ek zaroori topic').catch(function () { });
    } catch (e) { return Promise.resolve(); }
  }

  root.CaptionEngine = { buildCues: buildCues, findCue: findCue, draw: draw, fontReady: fontReady, REF_W: REF_W };
})(typeof window !== 'undefined' ? window : globalThis);
