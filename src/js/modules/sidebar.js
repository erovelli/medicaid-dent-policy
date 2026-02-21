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
  }

  /**
   * Show the sidebar with provided content.
   * @param {string|HTMLElement} content - Text or element to display.
   */
  show(content) {
    // Clear existing content except the close button
    Array.from(this.container.children)
      .filter((el) => el !== this.closeBtn)
      .forEach((el) => el.remove());

    if (typeof content === "string") {
      const el = document.createElement("h2");
      el.textContent = content;
      this.container.appendChild(el);
    } else if (content instanceof HTMLElement) {
      this.container.appendChild(content);
    }

    this.container.classList.add("sidebar-open");
  }

  /**
   * Hide the sidebar.
   */
  hide() {
    this.container.classList.remove("sidebar-open");
  }
}

// End of Sidebar module

