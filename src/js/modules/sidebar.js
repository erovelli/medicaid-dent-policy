// Sidebar module for displaying state information
// The sidebar slides in from the right when a state is clicked
// and hides when the close button is pressed.

// Sidebar component encapsulates the DOM logic for the right‑hand panel
// that appears when a user selects a state on the map.
// It exposes simple imperative API: show(content) and hide().
// Content can be text or an HTMLElement.
// The component is intentionally lightweight – no frameworks are used.

export class Sidebar {
  constructor(containerId = "sidebar-container") {
    // Find the container by ID or create one if it doesn’t exist.
    this.container = document.getElementById(containerId);
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = containerId;
      document.body.appendChild(this.container);
    }

    // Create a close button for the sidebar.
    this.closeBtn = document.createElement("button");
    this.closeBtn.textContent = "Close";
    this.closeBtn.className = "sidebar-close-btn";
    this.container.appendChild(this.closeBtn);
    this.closeBtn.addEventListener("click", () => this.hide());

    // Create a grab handle for resizing the bottom sheet
    this.handle = document.createElement('div');
    this.handle.className = 'sidebar-handle';
    // place handle before the close button so it's visible at the top
    this.container.insertBefore(this.handle, this.closeBtn);

    // Create inner scrollable content wrapper so the scrollbar is pinned to the
    // bottom of the viewport (the container remains fixed while this element scrolls).
    this.content = document.createElement('div');
    this.content.className = 'sidebar-inner';
    this.container.appendChild(this.content);

    // Drag state
    this._dragging = false;
    this._dragStartY = 0;
    this._dragStartHeight = 0;
    this._minHeight = 120; // px
    this._maxHeight = Math.floor(window.innerHeight * 0.92);

    // Pointer events for dragging
    this.handle.addEventListener('pointerdown', (e) => this._startDrag(e));
  }

  /**
   * Render the spending section (table + YM slider) for a properties object.
   * @param {Object} properties
   * @returns {HTMLElement|null}
   */
  renderSpendingSection(properties) {
    const value = properties && properties.spending ? properties.spending : null;
    if (!value) return null;

    let spendingArray = value;
    if (typeof spendingArray === 'string') {
      try {
        spendingArray = JSON.parse(spendingArray);
      } catch (err) {
        spendingArray = null;
      }
    }
    if (!Array.isArray(spendingArray) || spendingArray.length === 0) return null;

    const yms = Array.from(new Set(spendingArray.map((r) => r.YM))).sort();
    let currentIndex = Math.max(0, yms.length - 1);

    const mapping = {
      C: 'category',
      YM: 'year_month',
      TBS: 'total_beneficiaries_served',
      TC: 'total_claims',
      TAP: 'total_amount_paid'
    };

    const section = document.createElement('div');
    section.className = 'spending-section';

    const subTable = document.createElement('table');
    subTable.className = 'spending-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    Object.keys(mapping).forEach((k) => {
      const th = document.createElement('th');
      th.textContent = mapping[k];
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    subTable.appendChild(thead);

    const stbody = document.createElement('tbody');
    subTable.appendChild(stbody);

    const renderForIndex = (idx) => {
      const ym = yms[idx];
      stbody.innerHTML = '';
      const rows = spendingArray.filter((r) => r.YM === ym);
      rows.forEach((rowObj) => {
        const rowEl = document.createElement('tr');
        Object.keys(mapping).forEach((k) => {
          const cell = document.createElement('td');
          let v = rowObj[k];
          if (v === null || v === undefined) {
            cell.textContent = '—';
          } else if (k === 'TAP' && !isNaN(Number(v))) {
            cell.textContent = Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          } else {
            cell.textContent = String(v);
          }
          rowEl.appendChild(cell);
        });
        stbody.appendChild(rowEl);
      });
    };

    // slider
    const sliderWrap = document.createElement('div');
    sliderWrap.className = 'ym-slider-container';

    const label = document.createElement('div');
    label.className = 'ym-slider-label';
    label.textContent = yms[currentIndex] || '';

    const input = document.createElement('input');
    input.type = 'range';
    input.className = 'ym-slider-input';
    input.min = 0;
    input.max = Math.max(0, yms.length - 1);
    input.value = currentIndex;
    input.step = 1;
    // ensure keyboard focus is possible and keyboard events don't bubble to the map
    input.tabIndex = 0;
    input.addEventListener('keydown', (ev) => {
      // keep arrow keys and page keys local to the slider
      const keysToStop = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'];
      if (keysToStop.includes(ev.key)) ev.stopPropagation();
    });
    input.addEventListener('input', (ev) => {
      const idx = Number(ev.target.value);
      label.textContent = yms[idx];
      renderForIndex(idx);
    });

    renderForIndex(currentIndex);

    sliderWrap.appendChild(label);
    sliderWrap.appendChild(input);

    section.appendChild(subTable);
    section.appendChild(sliderWrap);
    return section;
  }

  /**
   * Show the sidebar with provided content.
   * @param {string|HTMLElement} content - Text or element to display.
   */
  show(content) {
    // Clear existing inner content and append into the scroll wrapper
    this.content.innerHTML = '';

    if (typeof content === "string") {
      const el = document.createElement("h2");
      el.textContent = content;
      this.content.appendChild(el);
    } else if (content instanceof HTMLElement) {
      this.content.appendChild(content);
    }

    this.container.classList.add("sidebar-open");
  }

  /**
   * Render a simple two-column table for an object's properties.
   * @param {Object} properties - The properties object from a GeoJSON feature.
   * @returns {HTMLElement} - A container element containing the table.
   */
  renderPropertiesTable(properties) {
    const wrap = document.createElement("div");
    wrap.className = "sidebar-properties";

    const table = document.createElement("table");
    table.className = "properties-table";

    const tbody = document.createElement("tbody");

    if (!properties || typeof properties !== "object") {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 2;
      td.textContent = "No properties available";
      tr.appendChild(td);
      tbody.appendChild(tr);
    } else {
      const keys = Object.keys(properties).sort();
      keys.forEach((key) => {
        // Exclude large or duplicated fields from the left-most grid
        if (key === 'spending' || key === 'zip3') return;
        const value = properties[key];
        const tr = document.createElement("tr");

        const keyTd = document.createElement("th");
        keyTd.textContent = key;
        tr.appendChild(keyTd);

        const valTd = document.createElement("td");
        if (value === null || value === undefined) {
          valTd.textContent = "—";
        } else if (typeof value === "object") {
          try {
            valTd.textContent = JSON.stringify(value);
          } catch (e) {
            valTd.textContent = String(value);
          }
        } else {
          valTd.textContent = String(value);
        }
        tr.appendChild(valTd);

        tbody.appendChild(tr);
      });
    }

    table.appendChild(tbody);
    wrap.appendChild(table);
    return wrap;
  }

  /**
   * Show a GeoJSON feature's properties in the sidebar as a table.
   * @param {Object} feature - GeoJSON feature with a `properties` object.
   * @param {string} [title] - Optional title to display above the table.
   */
  showFeature(feature, title) {
    const container = document.createElement("div");
    if (title) {
      const h = document.createElement("h2");
      h.textContent = title;
      container.appendChild(h);
    }

    const props = feature && feature.properties ? feature.properties : null;
    const tableEl = this.renderPropertiesTable(props);
    container.appendChild(tableEl);

    const spendingSection = this.renderSpendingSection(props);
    if (spendingSection) container.appendChild(spendingSection);

    this.show(container);

    // Focus the slider after the sidebar open transition completes so arrow keys work
    setTimeout(() => {
      const el = this.container.querySelector('.ym-slider-input');
      if (el && typeof el.focus === 'function') {
        try { el.focus({ preventScroll: true }); } catch (_) { el.focus(); }
      }
    }, 360);
  }

  // --- Drag handlers for bottom sheet resizing ---
  _startDrag(e) {
    // Only primary button
    if (e.button && e.button !== 0) return;
    this._dragging = true;
    this._dragStartY = e.clientY;
    const rect = this.container.getBoundingClientRect();
    this._dragStartHeight = rect.height;
    this._maxHeight = Math.floor(window.innerHeight * 0.96);
    document.body.style.userSelect = 'none';
    this.handle.setPointerCapture && this.handle.setPointerCapture(e.pointerId);

    // bind move/up to window so dragging works outside handle area
    this._onPointerMove = (ev) => this._onDrag(ev);
    this._onPointerUp = (ev) => this._stopDrag(ev);
    window.addEventListener('pointermove', this._onPointerMove);
    window.addEventListener('pointerup', this._onPointerUp);
  }

  _onDrag(e) {
    if (!this._dragging) return;
    const delta = this._dragStartY - e.clientY; // positive when dragging up
    let newHeight = this._dragStartHeight + delta;
    newHeight = Math.max(this._minHeight, Math.min(this._maxHeight, newHeight));
    this.container.style.height = `${newHeight}px`;
  }

  _stopDrag(e) {
    if (!this._dragging) return;
    this._dragging = false;
    document.body.style.userSelect = '';
    try { this.handle.releasePointerCapture && this.handle.releasePointerCapture(e.pointerId); } catch (_) {}
    window.removeEventListener('pointermove', this._onPointerMove);
    window.removeEventListener('pointerup', this._onPointerUp);
    this._onPointerMove = null;
    this._onPointerUp = null;
  }

  /**
   * Hide the sidebar.
   */
  hide() {
    this.container.classList.remove("sidebar-open");
  }
}

// End of Sidebar module

