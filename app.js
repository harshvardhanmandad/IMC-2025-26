// IMC Rankings — vanilla JS interactivity
(function () {
  'use strict';

  const GRADES = [3, 4, 5, 6, 7, 8, 9, 10];

  const TOPPERS = [
    { grade: 3, name: 'Vihaan Shah', school: 'Gem Genesis International School, Ahmedabad' },
    { grade: 4, name: 'Yuxi Lin', school: 'Singapore School Manila' },
    { grade: 5, name: 'Soumajit Paul', school: 'Mentor International School' },
    { grade: 6, name: 'Mayank Bansal', school: 'GD Goenka Public School' },
    { grade: 7, name: 'Mrunmayee Puranik', school: 'Delhi Public School, Navi Mumbai' },
    { grade: 8, name: 'Banaj Bansal', school: 'Ramniwas Bajaj English High School' },
    { grade: 9, name: 'Sneh Shah', school: 'Thakur Public School' },
    { grade: 10, name: 'Purvesh Kapse', school: 'Podar international school nagpur besa' },
  ];

  const FAQS = [
    {
      q: 'How were the ranks calculated?',
      a: 'The challenge had three main levels — Level 2, Level 3 and Level 4. These counted toward the official ranking. There was <strong>no negative marking</strong> — a wrong answer scored zero, never less. Students were ranked first by total stars earned, and then by total time taken, with faster times ranking higher. Every grade was ranked on its own. Students competed only against others in their grade.',
    },
    {
      q: 'When will we receive certificates?',
      a: 'Digital certificates for every ranked finalist will be shared by <strong>May 30, 2026</strong>, over email. Keep an eye on the inbox linked to the student\'s registration.',
    },
    {
      q: 'What are the prizes for IMC 2025-26?',
      a: 'The prize list for IMC 2025-26 will be shared by <strong>20th May 2026</strong>, over email.',
    },
    {
      q: 'How do I raise a query about a rank?',
      a: 'WhatsApp us at <strong>+91 88847 61744</strong> before <strong>20 May 2026</strong>. Please include the student\'s name, school and grade. We respond within three working days.',
    },
  ];

  // ── State ────────────────────────────────────────────────
  let activeGrade = 3;
  let query = '';
  let show25 = false;
  let show50 = false;
  let highlight = null; // {grade, rank}

  // Flatten all rows once for cross-grade search
  const ALL_ROWS = [];
  for (const g of GRADES) {
    for (const r of (window.IMC_DATA[g] || [])) {
      ALL_ROWS.push({ ...r, grade: g });
    }
  }

  // ── Utilities ────────────────────────────────────────────
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );

  // ── Render toppers ───────────────────────────────────────
  function renderToppers() {
    const el = document.getElementById('toppers-grid');
    el.innerHTML = TOPPERS.map((t, i) => `
      <button class="topper-tile tt-${i % 4}" type="button" data-grade="${t.grade}">
        <span class="tt-watermark">#1</span>
        <span class="tt-grade-chip">Grade ${t.grade}</span>
        <span class="tt-name">${esc(t.name)}</span>
        <span class="tt-school">${esc(t.school)}</span>
        <span class="tt-arrow">→</span>
      </button>
    `).join('');
    el.addEventListener('click', (e) => {
      const btn = e.target.closest('.topper-tile');
      if (!btn) return;
      const g = parseInt(btn.dataset.grade, 10);
      activeGrade = g;
      query = '';
      document.getElementById('search-input').value = '';
      document.getElementById('search-clear').style.display = 'none';
      show25 = false; show50 = false;
      renderTabs(); renderRankings();
      setTimeout(() => document.getElementById('rankings').scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    });
  }

  // ── Render grade tabs ────────────────────────────────────
  function renderTabs() {
    const el = document.getElementById('grade-tabs');
    const isSearching = query.trim().length > 0;
    el.innerHTML = GRADES.map((g) => `
      <button class="grade-tab${g === activeGrade && !isSearching ? ' active' : ''}" data-grade="${g}" role="tab" aria-selected="${g === activeGrade}">Grade ${g}</button>
    `).join('');
  }

  // Delegate tab clicks once
  document.addEventListener('click', (e) => {
    const tab = e.target.closest('.grade-tab');
    if (!tab) return;
    const g = parseInt(tab.dataset.grade, 10);
    if (g !== activeGrade) {
      activeGrade = g;
      query = '';
      const si = document.getElementById('search-input');
      si.value = '';
      document.getElementById('search-clear').style.display = 'none';
      show25 = false; show50 = false;
      renderTabs(); renderRankings();
    }
  });

  // ── Render rankings body ─────────────────────────────────
  function renderRankings() {
    const body = document.getElementById('rankings-body');
    const trimmed = query.trim().toLowerCase();

    if (trimmed.length > 0) {
      // Search mode
      const hits = ALL_ROWS
        .filter((r) => r.name.toLowerCase().includes(trimmed) || r.school.toLowerCase().includes(trimmed))
        .slice(0, 20);

      if (hits.length === 0) {
        body.innerHTML = `
          <div class="no-results">
            <div class="big">No matches for "${esc(query.trim())}"</div>
            <div class="small">Try a different spelling, or browse by grade above.</div>
          </div>
        `;
        return;
      }

      body.innerHTML = `
        <div class="search-results">
          <div class="search-results-head">${hits.length} ${hits.length === 1 ? 'match' : 'matches'} across all grades</div>
          ${hits.map((r) => `
            <div class="result-row" data-grade="${r.grade}" data-rank="${r.rank}">
              <div class="result-grade">Grade ${r.grade}</div>
              <div>
                <div class="result-name">${esc(r.name)}</div>
                <div class="result-school">${esc(r.school)}</div>
              </div>
              <div class="result-rank">#${r.rank}</div>
            </div>
          `).join('')}
        </div>
      `;

      // Attach jump-to behavior
      body.querySelectorAll('.result-row').forEach((row) => {
        row.addEventListener('click', () => {
          const g = parseInt(row.dataset.grade, 10);
          const rk = parseInt(row.dataset.rank, 10);
          activeGrade = g;
          query = '';
          document.getElementById('search-input').value = '';
          document.getElementById('search-clear').style.display = 'none';
          // Make sure all sections are open so the row is visible
          if (rk > 10) show25 = true;
          if (rk > 25) show50 = true;
          highlight = { grade: g, rank: rk };
          renderTabs(); renderRankings();
          setTimeout(() => {
            const target = document.getElementById(`row-${g}-${rk}`);
            target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => { highlight = null; }, 3000);
          }, 80);
        });
      });
      return;
    }

    // Grade browse mode
    const data = window.IMC_DATA[activeGrade] || [];
    const topper = data[0];
    const top3 = data.slice(1, 3);
    const top10 = data.slice(3, 10);
    const top25 = data.slice(10, 25);
    const top50 = data.slice(25, 50);

    let html = '';

    if (topper) {
      html += `
        <div class="topper-card">
          <div class="label">Grade ${activeGrade} · Topper</div>
          <h3 class="name">${esc(topper.name)}</h3>
          <div class="school">${esc(topper.school)}</div>
        </div>
      `;
    }

    if (top3.length > 0) {
      html += `<div class="top3-grid">${top3.map((r) => `
        <div class="top3-card">
          <div class="rank">#${r.rank}</div>
          <div class="top3-name">${esc(r.name)}</div>
          <div class="top3-school">${esc(r.school)}</div>
        </div>
      `).join('')}</div>`;
    }

    html += renderTable('Top 10', 'Ranks 4–10', top10, activeGrade);

    if (!show25) {
      html += `<button class="show-more" data-action="show25">Show ranks 11–25 →</button>`;
    } else {
      html += renderTable('Top 25', 'Ranks 11–25', top25, activeGrade);
    }

    if (show25 && !show50) {
      html += `<button class="show-more" data-action="show50">Show ranks 26–50 →</button>`;
    }
    if (show50) {
      html += renderTable('Top 50', 'Ranks 26–50', top50, activeGrade);
    }

    body.innerHTML = html;

    // Bind show-more buttons
    body.querySelectorAll('.show-more').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.dataset.action === 'show25') show25 = true;
        if (btn.dataset.action === 'show50') show50 = true;
        renderRankings();
      });
    });
  }

  function renderTable(title, subtitle, rows, grade) {
    if (!rows.length) return '';
    return `
      <div class="table-block">
        <h3>${title}<span class="count">${subtitle}</span></h3>
        <div class="rank-table">
          ${rows.map((r) => {
            const isHl = highlight && highlight.grade === grade && highlight.rank === r.rank;
            return `
              <div class="rank-row${isHl ? ' highlight' : ''}" id="row-${grade}-${r.rank}">
                <div class="rank-num">#${r.rank}</div>
                <div class="rank-name">${esc(r.name)}</div>
                <div class="rank-school">${esc(r.school)}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // ── FAQ ──────────────────────────────────────────────────
  function renderFAQ() {
    const el = document.getElementById('faq-list');
    el.innerHTML = FAQS.map((f, i) => `
      <div class="faq-item${i === 0 ? ' open' : ''}" data-idx="${i}">
        <button class="faq-q">
          <span>${esc(f.q)}</span>
          <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="faq-a">${f.a}</div>
      </div>
    `).join('');
    el.addEventListener('click', (e) => {
      const item = e.target.closest('.faq-item');
      if (!item) return;
      item.classList.toggle('open');
    });
  }

  // ── Search input ─────────────────────────────────────────
  function bindSearch() {
    const input = document.getElementById('search-input');
    const clear = document.getElementById('search-clear');
    input.addEventListener('input', (e) => {
      query = e.target.value;
      clear.style.display = query.length > 0 ? 'flex' : 'none';
      renderTabs();
      renderRankings();
    });
    clear.addEventListener('click', () => {
      query = '';
      input.value = '';
      clear.style.display = 'none';
      renderTabs(); renderRankings();
      input.focus();
    });
  }

  // ── Hero CTA ─────────────────────────────────────────────
  document.getElementById('cta-find-rank').addEventListener('click', () => {
    document.getElementById('rankings').scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => document.getElementById('search-input').focus(), 500);
  });

  // ── Init ─────────────────────────────────────────────────
  renderToppers();
  renderTabs();
  renderRankings();
  renderFAQ();
  bindSearch();
})();
