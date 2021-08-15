import { promises as fsp } from "fs"
import * as path from "path"

export interface OsuFavoriteBeatmapsBeatmap {
    osuBeatmapId: number
    customTags: string[]
}

export interface OsuFavoriteBeatmaps {
    title: string
    osuUserId: number
    osuUserName: number
    favoriteBeatmaps: OsuFavoriteBeatmapsBeatmap[]
}

export const defaultFavoriteBeatmapsFilePath = path.join(
    __dirname,
    "..",
    "favorite_beatmaps.json",
)

export const readFavoriteBeatmaps = async (
    filePath: string = defaultFavoriteBeatmapsFilePath,
): Promise<OsuFavoriteBeatmaps> => {
    const oauthCredentialsFileContent = await fsp.readFile(filePath, {
        encoding: "utf8",
    })
    const oAuthCredentialsJson: OsuFavoriteBeatmaps = JSON.parse(
        oauthCredentialsFileContent,
    )
    return oAuthCredentialsJson
}
