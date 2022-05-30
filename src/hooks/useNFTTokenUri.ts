export function getNFTHttpUri(tokenUri: string): string {
  if (tokenUri.startsWith("ipfs://")) {
    return tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  return tokenUri;
}
