import { LitElement, html, css } from 'lit-element';
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "./hax-search.js";

class JsonAnalyzer extends LitElement {
    static get styles() {
        return css`
        :host {
            display: block;
            font-family: Arial, sans-serif;
        }

        .search-container {
            display: flex;
            align-items: center;
            background-color: #fff;
            border-radius: 24px;
            border: 1px solid #dfe1e5;
            padding: 5px 10px;
            box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            transition: box-shadow 0.3s ease;
        }

        .search-container:hover {
            box-shadow: 0 1px 8px rgba(32, 33, 36, 0.35);
        }

        .search-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
            color: #9aa0a6;
            font-size: 24px;
            cursor: pointer;
        }

        .search-input {
            flex: 1;
            font-size: 16px;
            line-height: 24px;
            border: none;
            outline: none;
        }

        .search-input::placeholder {
            color: #9aa0a6;
        }

        .search-input:focus {
            outline: none;
        }

        button {
            background-color: #0056b3;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 15px;
            font-size: 16px;
            cursor: pointer;
            margin-right: 10px;
            transition: background-color 0.3s ease;
        }

        button:hover {
            background-color: #003f7d;
        }

        .results {
            visibility: visible;
            height: 100%;
            opacity: 1;
            transition-delay: 0.5s;
            transition: 0.5s all ease-in-out;
        }

        details {
            margin: 16px;
            padding: 16px;
            background: url("https://media.tenor.com/qb05vZpflc4AAAAi/orumcek-spider");
            background-size: cover;
            background-attachment: fixed;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        summary {
            font-size: 24px;
            padding: 8px;
            color: white;
            font-size: 42px;
        }

        input {
            font-size: 20px;
            line-height: 40px;
            width: 100%;
        }
        `;
    }

    static get properties() {
        return {
            url: { type: String },
            jsonData: { type: Object },
            error: { type: String }
        };
    }

    constructor() {
        super();
        this.url = 'https://haxtheweb.org/site.json';
        this.jsonData = null;
        this.error = null;
    }

    render() {
        if (!this.url) {
            this.url = 'https://haxtheweb.org/site.json';
        } else if (!this.url.endsWith('site.json')) {
            this.url += '/site.json';
        }

        return html`
            <div class="search-container">
                <div class="search-icon">
                    <button @click="${this._analyze}">Analyze</button>
                </div>
                <input
                    class="search-input"
                    type="text"
                    placeholder="https://haxtheweb.org/site.json (Override URL)"
                    @input="${this._updateURL}"
                    .value="${this.url}"
                />
            </div>

            ${this.error ? html`<div style="color: red;">Error: ${this.error}</div>` : ''}
            
            ${this.jsonData
                ? html`
                    <hax-search .jsonUrl="${this.url}" .jsonData="${this.jsonData}"></hax-search>
                  `
                : html`<p>No data available yet. Click "Analyze" to fetch the data.</p>`
            }
        `;
    }

    _updateURL(event) {
        this.url = event.target.value;
    }

    async _analyze() {
        this.jsonData = null;  // Reset previous data
        this.error = null;  // Clear error message

        try {
            const response = await fetch(this.url);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            // Check for the expected structure of the site.json
            if (!data || !data.siteName || !data.items) {
                throw new Error('Invalid site.json structure');
            }

            // Update the component state with fetched data
            this.jsonData = data;

        } catch (err) {
            this.error = err.message;
        }
    }
}

customElements.define('json-analyzer', JsonAnalyzer);