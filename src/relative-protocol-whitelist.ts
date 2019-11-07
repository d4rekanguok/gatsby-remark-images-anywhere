const rpWhitelist = [
  'images.ctfassets.net',
]

type MakeWhitelistTest = (whitelist: string[]) => (url: string) => boolean
export const makeWhitelistTest: MakeWhitelistTest = whitelist => url => {
  const result = whitelist.find(domain => url.startsWith(`//${domain}`))
  return Boolean(result)
}

export const isWhitelisted = makeWhitelistTest(rpWhitelist)