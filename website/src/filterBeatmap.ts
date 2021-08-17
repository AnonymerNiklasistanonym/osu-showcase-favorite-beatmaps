import type { FavoriteBeatmapInformation } from "../../src/index"
import type { ElementFilterInformation } from "simple-generic-object-array-search-bar-filter/lib/filterElement"

export const elementFilter = (
    element: FavoriteBeatmapInformation,
): ElementFilterInformation[] => {
    const information: ElementFilterInformation[] = [
        {
            propertyName: "artist",
            stringValue: element.artist,
            type: "string",
        },
        {
            propertyName: "creator",
            stringValue: element.creator,
            type: "string",
        },
        {
            numberValue: element.creatorId,
            propertyName: "creatorId",
            type: "number",
        },
        {
            numberValue: element.id,
            propertyName: "id",
            type: "number",
        },
        {
            stringValue: element.audioPreviewUrl,
            type: "string",
        },
        {
            propertyName: "customTags",
            stringArrayValue: element.customTags,
            type: "string-array",
        },
        {
            propertyName: "osuTags",
            stringArrayValue: element.osuTags,
            type: "string-array",
        },
        {
            numberValue: element.id,
            propertyName: "id",
            type: "number",
        },
        {
            propertyName: "mode",
            stringValue: element.mode,
            type: "string",
        },
        {
            propertyName: "rankedStatus",
            stringValue: element.rankedStatus,
            stringValueToNumberValueMapper: (rankedStatus: string) => {
                switch (rankedStatus) {
                    case "loved":
                        return 4
                    case "qualified":
                        return 3
                    case "approved":
                        return 2
                    case "ranked":
                        return 1
                    case "pending":
                        return 0
                    case "wip":
                        return -1
                    case "graveyard":
                        return -2
                    default:
                        return 0
                }
            },
            type: "string",
        },
        {
            numberValue: element.setId,
            propertyName: "setId",
            type: "number",
        },
        {
            propertyName: "title",
            stringValue: element.title,
            type: "string",
        },
    ]
    if (element.userRank) {
        information.push(
            {
                propertyName: "userRank",
                stringValue: element.userRank.rank,
                stringValueToNumberValueMapper: (beatmapRank: string) => {
                    switch (beatmapRank) {
                        case "XH": // SS HD
                            return 8
                        case "X": // SS
                            return 7
                        case "SH": // S HD
                            return 6
                        case "S":
                            return 5
                        case "A":
                            return 4
                        case "B":
                            return 3
                        case "C":
                            return 2
                        case "D":
                            return 1
                        default:
                            return 0
                    }
                },
                type: "string",
            },
            {
                numberValue: element.userRank.score,
                propertyName: "userRankScore",
                type: "number",
            },
            {
                numberValue: element.userRank.maxCombo,
                propertyName: "userRankMaxCombo",
                type: "number",
            },
            {
                propertyName: "userRankCreatedAt",
                stringValue: element.userRank.createdAt,
                type: "string",
            },
            {
                propertyName: "userRankMods",
                stringArrayValue: element.userRank.mods,
                type: "string-array",
            },
            {
                numberValue: element.userRank.id,
                propertyName: "userRankId",
                type: "number",
            },
        )
        if (element.userRank.perfect) {
            information.push({
                propertyName: "userRank",
                stringValue: "perfect",
                type: "string",
            })
        }
        if (element.userRank.pp) {
            information.push({
                numberValue: element.userRank.pp,
                propertyName: "userRankPp",
                type: "number",
            })
        }
        if (element.userRank.maxCombo === element.stats.maxCombo) {
            information.push({
                stringValue: "fc",
                type: "string",
            })
        }
    }
    if (element.stats) {
        information.push(
            {
                numberValue: element.stats.accuracy * 100,
                propertyName: "accuracy",
                type: "number",
            },
            {
                numberValue: element.stats.ar,
                propertyName: "ar",
                type: "number",
            },
            {
                numberValue: element.stats.bpm,
                propertyName: "bpm",
                type: "number",
            },
            {
                numberValue: element.stats.cs,
                propertyName: "cs",
                type: "number",
            },
            {
                numberValue: element.stats.difficultyRating,
                propertyName: "stars",
                type: "number",
            },
            {
                numberValue: element.stats.drain,
                propertyName: "drain",
                type: "number",
            },
            {
                numberValue: element.stats.lengthInSeconds,
                propertyName: "lengthInS",
                type: "number",
            },
            {
                numberValue: element.stats.lengthInSeconds / 60,
                propertyName: "lengthInMin",
                type: "number",
            },
            {
                numberValue: element.stats.maxCombo,
                propertyName: "maxCombo",
                type: "number",
            },
            {
                propertyName: "version",
                stringValue: element.stats.version,
                type: "string",
            },
        )
    }
    return information
}
