import escapeStringRegexp from "escape-string-regexp"
import * as queryString from "query-string"
import type { FavoriteBeatmapsData } from "../src"

import { autocompleteTextInput } from "./src/autocompleteTextInput"
import { createBeatmapList } from "./src/createBeatmapList"
import { filterBeatmap } from "./src/filterBeatmap"

try {
    const response = await fetch("./favorite_beatmaps.json")
    if (!response.ok) {
        throw `File (${response.url}) could not be fetched (${response.status}=${response.statusText})`
    }
    const jsonData = (await response.json()) as FavoriteBeatmapsData
    console.log(jsonData)

    const beatmapList = document.getElementById("beatmap-list")
    const beatmapListElement = createBeatmapList(jsonData.favoriteBeatmaps)
    beatmapList.removeChild(beatmapList.querySelector("div.loading"))
    beatmapList.appendChild(beatmapListElement)
    const filterList = (filter?: string) => {
        const filteredBeatmaps = jsonData.favoriteBeatmaps.filter((beatmap) =>
            filterBeatmap(beatmap, filter),
        )
        const beatmapListList = document.getElementById("beatmap-list-list")
        for (const childNode of beatmapListList.childNodes) {
            const element = childNode as HTMLElement
            const elementName = element?.dataset?.name.toLocaleLowerCase()
            if (elementName && childNode.nodeType === Node.ELEMENT_NODE) {
                if (
                    filteredBeatmaps.some(
                        (a) => a.title.toLocaleLowerCase() === elementName,
                    )
                ) {
                    element?.classList.remove("hide")
                    element?.classList.add("show")
                } else {
                    element?.classList.remove("show")
                    element?.classList.add("hide")
                }
            }
        }
    }

    const filterInput = document.getElementById(
        "filter-text-input",
    ) as HTMLInputElement

    const parsedQueryArgs = queryString.parse(location.search)
    if (typeof parsedQueryArgs.q === "string") {
        filterInput.value = parsedQueryArgs.q
    }

    filterList(filterInput.value)
    for (const eventName of [
        "keyup",
        "input",
        "propertychange",
        "paste",
        "change",
    ]) {
        filterInput.addEventListener(eventName, () => {
            const stringifiedQueryArgs = queryString.stringify({
                q: filterInput.value,
            })
            window.history.replaceState(null, null, `?${stringifiedQueryArgs}`)
            filterList(filterInput.value)
        })
    }

    autocompleteTextInput(
        filterInput,
        [
            ...new Set(
                jsonData.favoriteBeatmaps
                    .reduce((keywords, beatmap) => {
                        return keywords.concat(
                            beatmap.artist,
                            beatmap.creator,
                            `${beatmap.id}`,
                            beatmap.mode,
                            beatmap.title,
                            `${beatmap.setId}`,
                            beatmap.osuTags,
                            beatmap.customTags,
                            beatmap.rankedStatus,
                            `rank=${beatmap.rankedStatus}`,
                            beatmap.userRank !== undefined
                                ? `${beatmap.userRank.rank}`
                                : [],
                            beatmap.userRank !== undefined
                                ? `my-rank=${beatmap.userRank.rank}`
                                : [],
                        )
                    }, [] as string[])
                    .map((keyword) => keyword.trim().toLowerCase()),
            ),
        ],
        {
            customValueToSearch: (textInput) =>
                textInput.split(/\+| /).slice(-1).pop(),
            customValueToSetAfterClick: (
                textInput,
                searchedValue,
                clickedKeyword,
            ) => {
                return textInput
                    .toLowerCase()
                    .replace(
                        new RegExp(escapeStringRegexp(searchedValue) + "s*$"),
                        clickedKeyword.replace(" ", "+"),
                    )
            },
        },
    )
} catch (err) {
    console.error(err)
}
