import type { FavoriteBeatmapInformation } from "../../src/index"

const filterBeatmap2 = (
    beatmap: FavoriteBeatmapInformation,
    filter?: string,
): boolean => {
    return (
        filter === "" ||
        filter === undefined ||
        beatmap.title.toLowerCase().includes(filter) ||
        beatmap.artist.toLowerCase().includes(filter) ||
        beatmap.creator.toLowerCase().includes(filter) ||
        `${beatmap.id}`.toLowerCase().includes(filter) ||
        `${beatmap.setId}`.toLowerCase().includes(filter) ||
        beatmap.creator.toLowerCase().includes(filter) ||
        beatmap.osuTags.some((tag) => tag.toLowerCase().includes(filter)) ||
        beatmap.customTags.some((tag) => tag.toLowerCase().includes(filter)) ||
        beatmap.mode.toLowerCase().includes(filter) ||
        `rank=${beatmap.rankedStatus}`.toLowerCase().includes(filter) ||
        `my-rank=${beatmap.userRank?.rank}`.toLowerCase().includes(filter)
    )
}

export interface ParseFilterOutput {
    /**
     * Any hits with these filters should be added to the results
     * (all hits should be OR but an array element is AND)
     */
    beatmapFilters: (string | string[])[]
    /**
     * Any hits with these filters should be excluded from the results
     * (all hits should be OR but an array element is AND)
     */
    beatmapFiltersExclude: (string | string[])[]
}

export const parseFilter = (filter?: string): ParseFilterOutput => {
    // Initially only find all the filter words split by a space
    const beatmapFilters: (string | string[])[] =
        filter === undefined
            ? []
            : filter
                  .toLowerCase()
                  .split(" ")
                  .map((a) => a.trim())
                  .filter((b) => b !== "")
    const beatmapFiltersFinal: (string | string[])[] = []
    const beatmapFiltersExclude: (string | string[])[] = []
    // Find words that should be combined
    for (const programFilter of beatmapFilters) {
        if (typeof programFilter === "string") {
            const andFilter = programFilter
                .split("+")
                .map((a) => a.trim())
                .filter((b) => b !== "")
            // If the filter starts with a "-" add it to the exclude list
            if (andFilter.length > 1) {
                if (andFilter[0]?.startsWith("-")) {
                    andFilter[0] = andFilter[0].substring(1)
                    beatmapFiltersExclude.push(
                        andFilter.filter((a) => a !== ""),
                    )
                } else {
                    beatmapFiltersFinal.push(andFilter)
                }
            } else if (andFilter.length === 1) {
                if (andFilter[0]?.length > 1 && andFilter[0]?.startsWith("-")) {
                    beatmapFiltersExclude.push(andFilter[0].substring(1))
                } else {
                    beatmapFiltersFinal.push(andFilter[0])
                }
            }
        }
    }

    return {
        beatmapFilters: beatmapFiltersFinal,
        beatmapFiltersExclude,
    }
}

export const filterBeatmap = (
    beatmap: FavoriteBeatmapInformation,
    filter?: string,
): boolean => {
    const parsedFilter = parseFilter(filter)

    return (
        (parsedFilter.beatmapFilters.length === 0 ||
            parsedFilter.beatmapFilters.some((beatmapFilter) => {
                if (typeof beatmapFilter === "string") {
                    return filterBeatmap2(beatmap, beatmapFilter)
                } else {
                    return beatmapFilter.every((a) =>
                        filterBeatmap2(beatmap, a),
                    )
                }
            })) &&
        !parsedFilter.beatmapFiltersExclude.some((beatmapFilter) => {
            if (typeof beatmapFilter === "string") {
                return filterBeatmap2(beatmap, beatmapFilter)
            } else {
                return beatmapFilter.every((a) => filterBeatmap2(beatmap, a))
            }
        })
    )
}
