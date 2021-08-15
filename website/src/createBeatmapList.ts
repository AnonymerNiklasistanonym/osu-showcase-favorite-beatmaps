import type { FavoriteBeatmapInformation } from "../../src/index"

// See also: https://github.com/handlebars-lang/handlebars.js/issues/1528#issue-449727984
import * as Handlebars from "handlebars/runtime"
import "./../../dist/handlebars/precompiled"

Handlebars.registerHelper("isString", function (arg, options) {
    return typeof arg === "string" ? options.fn(this) : options.inverse(this)
})
Handlebars.registerHelper("isArray", function (arg, options) {
    return Array.isArray(arg) ? options.fn(this) : options.inverse(this)
})

export const createBeatmapList = (
    beatmaps: FavoriteBeatmapInformation[],
): ChildNode => {
    const div = document.createElement("div")
    div.innerHTML = Handlebars.templates["beatmap_list"]({
        beatmaps,
    })
    return div.firstChild
}
