import { DEV } from "esm-env";
const ATTR_REGEX = /[&"<]/g;
function escape_html(value, is_attr) {
  const str = String(value ?? "");
  const pattern = ATTR_REGEX;
  pattern.lastIndex = 0;
  let escaped = "";
  let last = 0;
  while (pattern.test(str)) {
    const i = pattern.lastIndex - 1;
    const ch = str[i];
    escaped += str.substring(last, i) + (ch === "&" ? "&amp;" : ch === '"' ? "&quot;" : "&lt;");
    last = i + 1;
  }
  return escaped + str.substring(last);
}
function rune_outside_svelte(rune) {
  if (DEV) {
    const error = new Error(`rune_outside_svelte
The \`${rune}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error("rune_outside_svelte");
  }
}
if (DEV) {
  let throw_rune_error = function(rune) {
    if (!(rune in globalThis)) {
      let value;
      Object.defineProperty(globalThis, rune, {
        configurable: true,
        // eslint-disable-next-line getter-return
        get: () => {
          if (value !== void 0) {
            return value;
          }
          rune_outside_svelte(rune);
        },
        set: (v) => {
          value = v;
        }
      });
    }
  };
  throw_rune_error("$state");
  throw_rune_error("$effect");
  throw_rune_error("$derived");
  throw_rune_error("$inspect");
  throw_rune_error("$props");
  throw_rune_error("$bindable");
}
const replacements = {
  translate: /* @__PURE__ */ new Map([
    [true, "yes"],
    [false, "no"]
  ])
};
function attr(name, value, is_boolean = false) {
  if (value == null || !value && is_boolean || value === "" && name === "class") return "";
  const normalized = name in replacements && replacements[name].get(value) || value;
  const assignment = is_boolean ? "" : `="${escape_html(normalized)}"`;
  return ` ${name}${assignment}`;
}
function stringify(value) {
  return typeof value === "string" ? value : value == null ? "" : value + "";
}
function ensure_array_like(array_like_or_iterator) {
  return (array_like_or_iterator == null ? void 0 : array_like_or_iterator.length) !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
}
function Page($$payload) {
  const wrapperWidth = 960;
  const wrapperHeight = 720;
  const cellSize = 10;
  const centerX = wrapperWidth / 2;
  const centerY = wrapperHeight / 2;
  let angle = 0;
  let radius = 0;
  let tiles = [];
  const step = cellSize;
  while (radius < Math.min(wrapperWidth, wrapperHeight) / 2) {
    let x = centerX + Math.cos(angle) * radius;
    let y = centerY + Math.sin(angle) * radius;
    if (x >= 0 && x <= wrapperWidth - cellSize && y >= 0 && y <= wrapperHeight - cellSize) {
      tiles.push({ x, y });
    }
    angle += 0.2;
    radius += step * 0.015;
  }
  const each_array = ensure_array_like(tiles);
  $$payload.out += `<div id="wrapper"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let { x, y } = each_array[$$index];
    $$payload.out += `<div class="tile"${attr("style", `left: ${stringify(x.toFixed(2))}px; top: ${stringify(y.toFixed(2))}px;`)}></div>`;
  }
  $$payload.out += `<!--]--></div>`;
}
const index = {
  // Provides function needed to perform SSR
  Page
};
export {
  index as default
};
