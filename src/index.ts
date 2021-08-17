import osuApiV2 from "osu-api-v2"
import { promises as fsp } from "fs"
import * as path from "path"

import type { OAuthAccessToken } from "osu-api-v2/lib/types/oauth_access_token"

import { readOauthCredentials } from "./read_oauth_credentials"
import { readFavoriteBeatmaps } from "./read_favorite_beatmaps"
import { GameMode } from "osu-api-v2/lib/types/game_mode"
import { Beatmapset, RankedStatus } from "osu-api-v2/lib/types/beatmap"

export interface FavoriteBeatmapInformationStats {
    accuracy: number
    ar: number
    bpm: number
    cs: number
    difficultyRating: number
    drain: number
    lengthInSeconds: number
    maxCombo: number
    version: string
}

export interface FavoriteBeatmapInformationUserRankCounts {
    geki: number
    katu: number
    miss: number
    x100: number
    x300: number
    x50: number
}

export interface FavoriteBeatmapInformationUserRank {
    accuracy: number
    counts: FavoriteBeatmapInformationUserRankCounts
    createdAt: string
    id: number
    maxCombo: number
    mods: string[]
    perfect: boolean
    pp?: number
    rank: string
    score: number
}

export interface FavoriteBeatmapInformation {
    artist: string
    audioPreviewUrl: string
    creator: string
    creatorId: number
    customTags: string[]
    id: number
    imageUrl: string
    mode: string
    osuTags: string[]
    rankedStatus: string
    setId: number
    stats: FavoriteBeatmapInformationStats
    title: string
    userRank?: FavoriteBeatmapInformationUserRank
}

export interface getBeatmapInformationOptions {
    filterOsuTags?: string[]
}

const getBeatmapInformation = async (
    oauthAccessToken: OAuthAccessToken,
    beatmapId: number,
    userId: number,
    customTags: string[],
    gameMode: GameMode = GameMode.osu,
    options: getBeatmapInformationOptions = {},
): Promise<FavoriteBeatmapInformation> => {
    const beatmapInfo = await osuApiV2.beatmaps.lookup(
        oauthAccessToken,
        beatmapId,
    )
    if (
        beatmapInfo.beatmapset === undefined ||
        beatmapInfo.beatmapset === null
    ) {
        throw Error(
            `Beatmapset of beatmap ${beatmapId} was undefined (${JSON.stringify(
                beatmapInfo,
            )})`,
        )
    }
    if ((beatmapInfo.beatmapset as unknown as Beatmapset).tags === undefined) {
        throw Error(
            `Beatmapset tags of beatmap ${beatmapId} were undefined (${JSON.stringify(
                beatmapInfo,
            )})`,
        )
    }
    if (beatmapInfo.max_combo === undefined) {
        throw Error(
            `Beatmapset max combo of beatmap ${beatmapId} was undefined (${JSON.stringify(
                beatmapInfo,
            )})`,
        )
    }
    let osuTags =
        (beatmapInfo.beatmapset as unknown as Beatmapset).tags !== undefined
            ? (beatmapInfo.beatmapset as unknown as Beatmapset).tags
                  .split(" ")
                  .map((a) => a.trim())
                  .filter((a) => a !== "")
            : []
    if (options !== undefined && options.filterOsuTags !== undefined) {
        const filterOsuTags = options.filterOsuTags?.map((a) => a.toLowerCase())
        osuTags = osuTags.filter(
            (osuTag) => !filterOsuTags?.includes(osuTag.toLowerCase()),
        )
    }
    const favoriteBeatmapInformation: FavoriteBeatmapInformation = {
        artist: beatmapInfo.beatmapset.artist_unicode,
        audioPreviewUrl: beatmapInfo.beatmapset.preview_url,
        creator: beatmapInfo.beatmapset.creator,
        creatorId: beatmapInfo.beatmapset.user_id,
        customTags,
        id: beatmapId,
        imageUrl: beatmapInfo.beatmapset.covers.card,
        mode: GameMode[gameMode],
        osuTags,
        rankedStatus: RankedStatus[beatmapInfo.ranked],
        setId: beatmapInfo.beatmapset_id,
        stats: {
            accuracy: beatmapInfo.accuracy,
            ar: beatmapInfo.ar,
            bpm: beatmapInfo.bpm,
            cs: beatmapInfo.cs,
            difficultyRating: beatmapInfo.difficulty_rating,
            drain: beatmapInfo.drain,
            lengthInSeconds: beatmapInfo.total_length,
            maxCombo: beatmapInfo.max_combo,
            version: beatmapInfo.version,
        },
        title: beatmapInfo.beatmapset.title,
    }

    // If the beatmap has public rankings get the public rank of the user
    if (
        beatmapInfo.ranked === RankedStatus.ranked ||
        beatmapInfo.ranked === RankedStatus.loved ||
        beatmapInfo.ranked === RankedStatus.qualified
    ) {
        const beatmapUserScore = await osuApiV2.beatmaps.scores.users(
            oauthAccessToken,
            beatmapId,
            userId,
            gameMode,
        )
        favoriteBeatmapInformation.userRank = {
            accuracy: beatmapUserScore.score.accuracy,
            counts: {
                geki: beatmapUserScore.score.statistics.count_geki,
                katu: beatmapUserScore.score.statistics.count_katu,
                miss: beatmapUserScore.score.statistics.count_miss,
                x50: beatmapUserScore.score.statistics.count_50,
                x100: beatmapUserScore.score.statistics.count_100,
                x300: beatmapUserScore.score.statistics.count_300,
            },
            createdAt: beatmapUserScore.score.created_at,
            id: beatmapUserScore.score.id,
            maxCombo: beatmapUserScore.score.max_combo,
            mods: beatmapUserScore.score.mods,
            perfect: beatmapUserScore.score.perfect,
            pp: beatmapUserScore.score.pp,
            rank: beatmapUserScore.score.rank,
            score: beatmapUserScore.score.score,
        }
    }

    return favoriteBeatmapInformation
}

export interface FavoriteBeatmapsData {
    title: string
    osuUserId: number
    osuUserName: string
    favoriteBeatmaps: FavoriteBeatmapInformation[]
    createdAt: string
}

;(async (): Promise<void> => {
    // 1. Compile information about my favorite Beatmaps
    // 1.1 Get osu!api v2 OAuth credentials
    const oauthCredentials = await readOauthCredentials()
    const oauthAccessToken = await osuApiV2.oauth.clientCredentialsGrant(
        oauthCredentials.clientId,
        oauthCredentials.clientSecret,
    )
    // 1.2 Load custom list of favorite Beatmaps and account ID
    const favoriteBeatmaps = await readFavoriteBeatmaps()
    // 1.3 Get for each Beatmap information about itself and the account score (if found)
    const favoriteBeatmapsCompiledArray: FavoriteBeatmapInformation[] = []
    for (const favoriteBeatmap of favoriteBeatmaps.favoriteBeatmaps) {
        const favoriteBeatmapInfo = await getBeatmapInformation(
            oauthAccessToken,
            favoriteBeatmap.osuBeatmapId,
            favoriteBeatmaps.osuUserId,
            favoriteBeatmap.customTags,
            GameMode.osu,
            {
                filterOsuTags: favoriteBeatmaps.tagFilterList,
            },
        )
        favoriteBeatmapsCompiledArray.push(favoriteBeatmapInfo)
    }
    await fsp.writeFile(
        path.join(__dirname, "..", "compiled_beatmaps.json"),
        JSON.stringify(
            {
                createdAt: new Date().toISOString(),
                favoriteBeatmaps: favoriteBeatmapsCompiledArray,
                osuUserId: favoriteBeatmaps.osuUserId,
                osuUserName: favoriteBeatmaps.osuUserName,
                title: favoriteBeatmaps.title,
            },
            undefined,
            4,
        ),
    )
})().catch((err) => {
    console.error(err)
    process.exit(1)
})
