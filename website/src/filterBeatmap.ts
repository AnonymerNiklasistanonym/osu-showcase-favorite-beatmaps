import type { FavoriteBeatmapInformation } from "../../src/index"
import type { ElementFilterInformation } from "simple-generic-object-array-search-bar-filter/lib/filterElement"

export const elementFilter = (
    element: FavoriteBeatmapInformation
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
            propertyName: "creatorId",
            numberValue: element.creatorId,
            type: "number",
        },
        {
            propertyName: "id",
            numberValue: element.id,
            type: "number",
        },
        {
            stringValue: element.audioPreviewUrl,
            type: "string",
        },
        {
            propertyName: "customTags",
            stringValue: element.customTags.join(" "),
            type: "string",
        },
        {
            propertyName: "osuTags",
            stringValue: element.osuTags.join(" "),
            type: "string",
        },
        {
            propertyName: "id",
            numberValue: element.id,
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
            type: "string",
        },
        {
            propertyName: "setId",
            numberValue: element.setId,
            type: "number",
        },
        {
            propertyName: "title",
            stringValue: element.title,
            type: "string",
        },
    ]
    if (element.userRank) {
        information.push({
            propertyName: "userRank",
            stringValue: element.userRank.rank,
            type: "string",
        }, {
            propertyName: "userRankScore",
            numberValue: element.userRank.score,
            type: "number",
        }, {
            propertyName: "userRankMaxCombo",
            numberValue: element.userRank.maxCombo,
            type: "number",
        }, {
            propertyName: "userRankCreatedAt",
            stringValue: element.userRank.createdAt,
            type: "string",
        }, {
            propertyName: "userRankMods",
            stringValue: element.userRank.mods.join(" "),
            type: "string",
        }, {
            propertyName: "userRankId",
            numberValue: element.userRank.id,
            type: "number",
        })
        if (element.userRank.perfect) {
            information.push({
                propertyName: "userRank",
                stringValue: "perfect",
                type: "string",
            })
        }
        if (element.userRank.pp) {
            information.push({
                propertyName: "userRankPp",
                numberValue: element.userRank.pp,
                type: "number",
            })
        }
    }
    if (element.stats) {
        information.push({
            propertyName: "accuracy",
            numberValue: (element.stats.accuracy * 100),
            type: "number",
        }, {
            propertyName: "ar",
            numberValue: element.stats.ar,
            type: "number",
        }, {
            propertyName: "bpm",
            numberValue: element.stats.bpm,
            type: "number",
        }, {
            propertyName: "cs",
            numberValue: element.stats.cs,
            type: "number",
        }, {
            propertyName: "stars",
            numberValue: element.stats.difficultyRating,
            type: "number",
        }, {
            propertyName: "drain",
            numberValue: element.stats.drain,
            type: "number",
        }, {
            propertyName: "lengthInS",
            numberValue: element.stats.lengthInSeconds,
            type: "number",
        }, {
            propertyName: "lengthInMin",
            numberValue: element.stats.lengthInSeconds / 60,
            type: "number",
        }, {
            propertyName: "maxCombo",
            numberValue: element.stats.maxCombo,
            type: "number",
        }, {
            propertyName: "version",
            stringValue: element.stats.version,
            type: "string",
        })
    }
    return information
}
