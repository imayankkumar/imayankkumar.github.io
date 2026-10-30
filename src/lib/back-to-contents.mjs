/**
 * Markdown (Sätteri hast) plugin: in posts that start with a "**Contents**"
 * list, gives that label id="contents" and adds a "Back to contents" link at
 * the end of every main (h2) section, so readers of long posts can jump
 * around without scrolling back to the top. Posts without a Contents list
 * are left unchanged.
 */
export function backToContents() {
  return {
    name: "back-to-contents",
    element: {
      filter: ["p", "h2"],
      visit(node, ctx) {
        const state = (ctx.data.backToContents ??= { found: false, h2Count: 0 })

        if (node.tagName === "p") {
          if (state.found) return
          const kids = (node.children ?? []).filter((c) => !(c.type === "text" && !c.value.trim()))
          const onlyStrong = kids.length === 1 && kids[0].type === "element" && kids[0].tagName === "strong"
          if (onlyStrong && ctx.textContent(node).trim() === "Contents") {
            ctx.setProperty(node, "id", "contents")
            state.found = true
          }
          return
        }

        // h2
        if (!state.found) return
        state.h2Count += 1
        // The first h2 after the list directly follows it, so it needs no link.
        if (state.h2Count > 1) ctx.insertBefore(node, backLink())
        else {
          const root = ctx.parent(node)
          if (root) ctx.appendChild(root, backLink())
        }
      },
    },
  }
}

function backLink() {
  return {
    type: "element",
    tagName: "p",
    properties: { className: ["back-to-contents"] },
    children: [
      { type: "element", tagName: "a", properties: { href: "#contents" }, children: [{ type: "text", value: "↑ Back to contents" }] },
    ],
  }
}
