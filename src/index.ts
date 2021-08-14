import osuApiV2 from "osu-api-v2"
import { promises as fsp } from "fs"
import * as path from "path"

import type { OAuthAccessToken } from "osu-api-v2/lib/types/oauth_access_token"

import { readOauthCredentials } from "./read_oauth_credentials"
import { readFavoriteBeatmaps } from "./read_favorite_beatmaps"
import { GameMode } from "osu-api-v2/lib/types/game_mode"
import { Beatmapset, RankedStatus } from "osu-api-v2/lib/types/beatmap"

export interface FavoriteBeatmapInformationStats {
    maxCombo: number
    bpm: number
    version: string
    accuracy: number
    ar: number
    cs: number
    drain: number
    difficultyRating: number
    lengthInSeconds: number
}

export interface FavoriteBeatmapInformationUserRankCounts {
    50: number
    100: number
    300: number
    geki: number
    katu: number
    miss: number
}

export interface FavoriteBeatmapInformationUserRank {
    rank: string
    score: number
    accuracy: number
    maxCombo: number
    counts: FavoriteBeatmapInformationUserRankCounts
    mods: string[]
    perfect: boolean
    pp?: number
    createdAt: string
}

export interface FavoriteBeatmapInformation {
    id: number
    title: string
    artist: string
    creator: string
    rankedStatus: string
    audioPreviewUrl: string
    imageUrl: string
    osuTags: string[]
    customTags: string[]
    mode: string
    stats: FavoriteBeatmapInformationStats
    userRank?: FavoriteBeatmapInformationUserRank
}

const getBeatmapInformation = async (
    oauthAccessToken: OAuthAccessToken,
    beatmapId: number,
    userId: number,
    customTags: string[],
    gameMode: GameMode = GameMode.osu,
): Promise<FavoriteBeatmapInformation> => {
    const beatmapInfo = await osuApiV2.beatmaps.lookup(
        oauthAccessToken,
        beatmapId,
    )
    if (beatmapInfo.beatmapset === undefined || beatmapInfo.beatmapset === null) {
        throw Error(`Beatmapset of beatmap ${beatmapId} was undefined (${JSON.stringify(beatmapInfo)})`)
    }
    if ((beatmapInfo.beatmapset as unknown as Beatmapset).tags === undefined) {
        throw Error(`Beatmapset tags of beatmap ${beatmapId} were undefined (${JSON.stringify(beatmapInfo)})`)
    }
    if (beatmapInfo.max_combo === undefined) {
        throw Error(`Beatmapset max combo of beatmap ${beatmapId} was undefined (${JSON.stringify(beatmapInfo)})`)
    }
    const osuTags = (beatmapInfo.beatmapset as unknown as Beatmapset).tags !== undefined
        ? [] : (beatmapInfo.beatmapset as unknown as Beatmapset).tags.split(" ")
    const favoriteBeatmapInformation: FavoriteBeatmapInformation = {
        id: beatmapId,
        title: beatmapInfo.beatmapset.title,
        artist: beatmapInfo.beatmapset.artist_unicode,
        creator: beatmapInfo.beatmapset.creator,
        rankedStatus: RankedStatus[beatmapInfo.ranked],
        audioPreviewUrl: beatmapInfo.beatmapset.preview_url,
        imageUrl: beatmapInfo.beatmapset.covers.card,
        osuTags,
        customTags,
        mode: GameMode[gameMode],
        stats: {
            maxCombo: beatmapInfo.max_combo,
            bpm: beatmapInfo.bpm,
            version: beatmapInfo.version,
            accuracy: beatmapInfo.accuracy,
            ar: beatmapInfo.ar,
            cs: beatmapInfo.cs,
            drain: beatmapInfo.drain,
            difficultyRating: beatmapInfo.difficulty_rating,
            lengthInSeconds: beatmapInfo.total_length,
        }
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
            gameMode
        )
        favoriteBeatmapInformation.userRank = {
            rank: beatmapUserScore.score.rank,
            score: beatmapUserScore.score.score,
            accuracy: beatmapUserScore.score.accuracy,
            maxCombo: beatmapUserScore.score.max_combo,
            counts: {
                50: beatmapUserScore.score.statistics.count_50,
                100: beatmapUserScore.score.statistics.count_100,
                300: beatmapUserScore.score.statistics.count_300,
                geki: beatmapUserScore.score.statistics.count_geki,
                katu: beatmapUserScore.score.statistics.count_katu,
                miss: beatmapUserScore.score.statistics.count_miss,
            },
            mods: beatmapUserScore.score.mods,
            perfect: beatmapUserScore.score.perfect,
            pp: beatmapUserScore.score.pp,
            createdAt: beatmapUserScore.score.created_at,
        }

    }

    return favoriteBeatmapInformation
}

(async (): Promise<void> => {
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
        )
        favoriteBeatmapsCompiledArray.push(favoriteBeatmapInfo)
    }
    await fsp.writeFile(path.join(__dirname, "..", "compiled_beatmaps.json"), JSON.stringify({
        title: favoriteBeatmaps.title,
        osuUserId: favoriteBeatmaps.osuUserId,
        osuUserName: favoriteBeatmaps.osuUserName,
        favoriteBeatmaps: favoriteBeatmapsCompiledArray,
        createdAt: new Date().toISOString(),
    }, undefined, 4))
})().catch(err => {
    console.error(err)
    process.exit(1)
})
