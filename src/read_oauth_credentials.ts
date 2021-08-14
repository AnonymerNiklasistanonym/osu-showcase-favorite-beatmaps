import { promises as fsp } from "fs"
import * as path from "path"

export interface OsuOAuthCredentialsFile {
    osuOAuthClientId: number
    osuOAuthClientSecret: string
}

export interface OsuOAuthCredentials {
    clientId: number
    clientSecret: string
}

export const defaultOauthCredentialsFilePath = path.join(
    __dirname,
    "..",
    "authentication.secret.json",
)

export const readOauthCredentials = async (
    filePath: string = defaultOauthCredentialsFilePath,
): Promise<OsuOAuthCredentials> => {
    const oauthCredentialsFileContent = await fsp.readFile(filePath, {
        encoding: "utf8",
    })
    const oAuthCredentialsJson: OsuOAuthCredentialsFile = JSON.parse(oauthCredentialsFileContent)
    return {
        clientId: oAuthCredentialsJson.osuOAuthClientId,
        clientSecret: oAuthCredentialsJson.osuOAuthClientSecret,
    }
}
