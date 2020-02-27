/* global ShadyCSS */
const css = ``;

const markup = values => `
  <style>${values.css}</style>
  <div class="inner">123</div>
`;

class Component extends HTMLElement {
  constructor() {
    super(); // !required!
    this._hasShadow = true; // true or fals to disable or enable shadow dom
    this.dom = this._hasShadow ? this.attachShadow({ mode: "open" }) : this;

    // setup your template
    const template = document.createElement("template");

    // we're using innerHTML but you could manually create each element and add to this._elements for complex use-cases
    template.innerHTML = markup({ css });

    /* Style Polyfill Step 1 */
    if (window.ShadyCSS) ShadyCSS.prepareTemplate(template, Component.tag); // eslint-disable-line
    /* END Style Polyfill Step 1 */

    this.instance = document.importNode(template.content, true); // copy template contents into 'this'

    /* Style Polyfill Step 2 */
    if (window.ShadyCSS) ShadyCSS.styleElement(this); // eslint-disable-line
    /* END Style Polyfill Step 2 */

    this.dom.appendChild(this.instance);
    this._setElements();
    return this;
  }

  static get observedAttributes() {
    return [];
  }

  set game(g) {
    this.G = g;
    this.things = this.G.getActiveThings();
    this.describe();
  }

  _setElements() {
    const focusables = this.querySelectorAll(
      "a, input, button, textarea, [tabindex='0'], [contenteditable='true']"
    );
    this.elements = [...[].slice.call(focusables)];
  }

  _dispatch() {
    const event = new CustomEvent("tea-event", {
      detail: {}
    });
    this.dispatchEvent(event);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return false; // if value hadn't changed do nothing
    return this;
  }

  connectedCallback() {
    this.G = null;
    this.inner = this.dom.querySelector(".inner");
    this.addEventListener("click", e => this.handleClick(e));
  }

  disconnectedCallback() {
    this.removeEventListener("click", e => this.handleClick(e));
  }

  handleClick(e) {
    const target = e.explicitOriginalTarget;
    const named = target.getAttribute("data-named");
    const result = this.G.command(`${named} help`);
    //const res = result.response();
    console.log(result.response());
  }

  replaceNouns() {}

  describe() {
    if (!this.G) return;
    let description = this.G.getActiveLocation().callMethod("describe");
    this.things.map(i => {
      let desc = i.callMethod("describe");
      desc = desc.replace(
        i.noun,
        `<button class="small" data-named="${i.name}">${i.noun}</button>`
      );
      return (description = description + desc);
    });
    this.inner.innerHTML = description;
  }
}

const tag = "tea-scene";
if (window.customElements.get(tag) === undefined) {
  window.customElements.define(tag, Component);
}

// magic that registers the tag
export default Component;
