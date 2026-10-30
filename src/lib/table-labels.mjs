/**
 * Markdown (Sätteri hast) plugin: adds data-label="<column heading>" to every
 * table body cell except the first in each row. On phones, post tables show
 * each row as a card and use these labels in place of the hidden header row
 * (see .prose table in global.css).
 */
export function tableLabels() {
  const headingsByTable = new Map()

  return {
    name: "table-labels",
    element: {
      filter: ["td"],
      visit(cell, ctx) {
        const row = ctx.parent(cell)
        const section = row && ctx.parent(row)
        const table = section && ctx.parent(section)
        if (!table || section.tagName !== "tbody" || table.tagName !== "table") return

        if (!headingsByTable.has(table)) {
          const thead = elements(table, "thead")[0]
          const headerRow = thead && elements(thead, "tr")[0]
          const headings = headerRow
            ? elements(headerRow, "th").map((th) => ctx.textContent(th).trim().replace(/[.…:]+$/, ""))
            : []
          headingsByTable.set(table, headings)
        }

        const column = elements(row, "td").findIndex((td) => ctx.indexOf(td) === ctx.indexOf(cell))
        const heading = headingsByTable.get(table)[column]
        if (column > 0 && heading) ctx.setProperty(cell, "dataLabel", heading)
      },
    },
  }
}

function elements(node, tagName) {
  return (node.children ?? []).filter((child) => child.type === "element" && child.tagName === tagName)
}
