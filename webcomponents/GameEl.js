/* global ShadyCSS */
const css = `

  .responder {
    height: 100px;
  }

  .commander textarea {
    width: 100%;    
  }

`;

const markup = values => `
  <style>${values.css}</style>
  <div>
  <article>
    <div class="scene">scene</div>    
    <div class="responder"></div>    
  </article>
  <form class="commander">
    <input type="text">
    <button type="submit">Go</button>
  </form>
  </div>
`;

class Component extends HTMLElement {
  constructor() {
    super(); // !required!
    this._hasShadow = true; // true or fals to disable or enable shadow dom
    this.dom = this._hasShadow ? this.attachShadow({ mode: "open" }) : this;
    this.subs = {};

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

  get game() {
    return this.G;
  }

  set game(value) {
    this.setGame(value);
  }

  static get observedAttributes() {
    return [];
  }

  _setElements() {
    this.G = null;
    this.scene = this.dom.querySelector(".scene");
    this.responder = this.dom.querySelector(".responder");
    this.commander = this.dom.querySelector(".commander");
    // const focusables = this.querySelectorAll(
    //   "a, input, button, textarea, [tabindex='0'], [contenteditable='true']"
    // );
    // this.elements = [...[].slice.call(focusables)];
  }

  _dispatch() {
    const event = new CustomEvent("tea-event", { detail: {} });
    this.dispatchEvent(event);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return false; // if value hadn't changed do nothing
    return this;
  }

  connectedCallback() {
    this.commander.addEventListener("submit", e => this.handleSubmit(e));
    this.addEventListener("click", e => this.handleClick(e));
  }
  disconnectedCallback() {
    this.commander.removeEventListener("submit", e => this.handleSubmit(e));
    this.removeEventListener("click", e => this.handleClick(e));
  }

  handleClick(e) {
    const target = e.composedPath()[0];
    if (target.tagName !== "BUTTON") return true;
    const { noun, described, verb } = target.dataset;
    if (!noun) return true;

    const location = this.G.getActiveLocation();
    const things = this.G.getThingsByInsideKey(location.key);
    const found = this.G.getThingsByNoun(noun, described, things);
    const thing = found[0];

    const cmd = this.G.command(`${verb} ${thing.name}`);
    let txt = cmd.response();

    thing.getActionKeys().map(key => (txt = this.replaceVerb(txt, key, thing)));
    this.responder.innerHTML = txt;
  }

  replaceNoun(text, thing) {
    const { noun, described } = thing;
    return text.replace(
      noun,
      `<button data-verb="help" data-described="${described}" data-noun="${noun}">${noun}</button>`
    );
  }

  replaceVerb(text, verb, thing) {
    const { described, noun } = thing;
    return text.replace(
      verb,
      `<button data-verb="${verb}" data-described="${described}" data-noun="${noun}">${verb}</button>`
    );
  }

  subHandler(name = "command") {
    if (name === "location-change") {
      console.log("location-change");
      this.updateScene();
    }

    if (name === "command") {
      console.log("command");
    }
  }

  handleSubmit(e) {
    e.stopPropagation();
    e.preventDefault();
    const txt = this.commander.children[0].value;
    const res = this.G.command(txt);
    this.responder.innerHTML = res.response();
  }

  setGame(value) {
    this.G = value;
    console.log(this.G);
    if (this.G && this.G.pubsub) {
      this.G.pubsub.subscribe("location-change", () => console.log(123));
    }
    this.updateScene();
  }

  updateScene() {
    const location = this.G.getActiveLocation();
    const things = this.G.getThingsByInsideKey(location.key);
    const desc = location.callMethod("describe");

    const thingDescs = things.map(i => {
      let txt = i.callMethod("describe");
      return this.replaceNoun(txt, i);
    });

    let content = `
      <p>${desc}</p>      
      <ul>
        ${thingDescs.map(i => `<li>${i}</li>`).join(``)}
      </ul>
    `;

    this.scene.innerHTML = content;
  }
}

const tag = "tea-game-el";
if (window.customElements.get(tag) === undefined) {
  window.customElements.define(tag, Component);
}

// magic that registers the tag
export default Component;
