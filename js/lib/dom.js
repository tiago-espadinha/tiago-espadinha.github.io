/** Create an element with an optional class and text. */
export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

/** A link that opens in a new tab without giving it access to this one. */
export function externalLink(label, url) {
  const link = el("a", "", label);
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
}

/** Empty the element with this id and return it, or null if it is missing. */
export function mount(id) {
  const node = document.getElementById(id);
  node?.replaceChildren();
  return node;
}
