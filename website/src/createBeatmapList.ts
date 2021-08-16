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
Handlebars.registerHelper("encodeStringToUrlParameter", (title: string, artist: string) => {
    if (Handlebars.Utils.toString(title) && Handlebars.Utils.toString(artist)) {
        return encodeURIComponent(title + " by " + artist).replace(/ /g, "+").replace(/%20/g, "+")
    }
})
Handlebars.registerHelper("convertToPercent", (percentNumber: number) => {
    if (typeof percentNumber === "number") {
        return (percentNumber * 100).toFixed(2)
    }
})
Handlebars.registerHelper("convertToNormalPp", (ppNumber: number) => {
    if (typeof ppNumber === "number") {
        return ppNumber.toFixed(0)
    }
})
Handlebars.registerHelper("renderStringArray", (stringArray: string[]) => {
    if (Array.isArray(stringArray)) {
        return stringArray.join(", ")
    }
})
Handlebars.registerHelper("convertSecsToMinsWithSecs", (seconds: number) => {
    if (typeof seconds === "number") {
        const minutesOut = Math.floor(seconds / 60)
        const secondsOut = seconds - minutesOut * 60
        return `${minutesOut}:${secondsOut.toString().padStart(2, "0")}`
    }
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
