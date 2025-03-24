const GITHUB_PATH = "https://github.com/neostarfall/neostarfall/tree/master/lua/starfall"

export function getGithubLinkFromPath(path: string) {
    return `${GITHUB_PATH}/${path}`
}