import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `hax-search`
 * 
 * @demo index.html
 * @element hax-search
 */
export class HaxSearch extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "hax-search";
  }

  constructor() {
    super();
    this.title = "";
    this.searchTerm = "";
    this.jsonData = []; // Initialize jsonData as an empty array
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
      searchLabel: "Search",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/hax-search.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      searchTerm: { type: String },
      jsonData: { type: Array }, // Added to handle incoming JSON data
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles, css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      .search-bar {
        margin-top: var(--ddd-spacing-2);
      }
      .search-bar input {
        width: 100%;
        padding: var(--ddd-spacing-1);
        font-size: var(--ddd-font-size-m);
        border: 1px solid var(--ddd-theme-border);
        border-radius: var(--ddd-border-radius);
      }
      h3 span {
        font-size: var(--hax-search-label-font-size, var(--ddd-font-size-s));
      }
      .card {
        background-color: var(--ddd-theme-primary);
        padding: var(--ddd-spacing-2);
        margin-top: var(--ddd-spacing-2);
        border-radius: var(--ddd-border-radius);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s;
      }
      .card:hover {
        transform: scale(1.05);
      }
      .card h4 {
        margin: 0;
        font-size: var(--ddd-font-size-l);
      }
      .card p {
        font-size: var(--ddd-font-size-m);
      }
    `];
  }

  // Render the HTML content
  render() {
    // Filter the JSON data based on the searchTerm
    const filteredData = this._filterData();

    return html`
      <div class="wrapper">
        <h3><span>${this.t.title}:</span> ${this.title}</h3>

        <!-- Search Bar -->
        <div class="search-bar">
          <label for="search-input">${this.t.searchLabel}</label>
          <input 
            type="text" 
            id="search-input" 
            .value="${this.searchTerm}" 
            @input="${this._onSearchInput}" 
            placeholder="${this.t.searchLabel}" 
          />
        </div>

        <!-- Display filtered JSON Data -->
        ${filteredData.length > 0 
          ? html`
              <div>
                ${filteredData.map(item => html`
                  <div class="card">
                    <h4>${item.title || 'No Title'}</h4>
                    <p>${item.description || 'No Description'}</p>
                  </div>
                `)}
              </div>
            `
          : html`<p>No results found.</p>`
        }

        <!-- Slot for additional content -->
        <slot></slot>
      </div>
    `;
  }

  // Event handler for search input
  _onSearchInput(event) {
    this.searchTerm = event.target.value;
    this.title = this.searchTerm ? `Search results for: ${this.searchTerm}` : '';
  }

  // Function to filter the jsonData based on searchTerm
  _filterData() {
    if (!this.searchTerm) return this.jsonData; // If no search term, return all data
    const lowerSearchTerm = this.searchTerm.toLowerCase();
    return this.jsonData.filter(item => 
      (item.title && item.title.toLowerCase().includes(lowerSearchTerm)) ||
      (item.description && item.description.toLowerCase().includes(lowerSearchTerm))
    );
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(HaxSearch.tag, HaxSearch);