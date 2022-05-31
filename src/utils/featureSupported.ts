// eslint-disable-next-line
export enum FeatureSupported {
  TRANSFER = "Transfer",
  NFT = "NFT",
  BOTH = "BOTH",
}

export const getSupportedFeatures = (): FeatureSupported => {
  const featureSupported = process.env.REACT_APP_FEATURES_SUPPORTED;
  const transferSupported = featureSupported?.toLowerCase().includes("transfer");
  const nftSupported = featureSupported?.toLowerCase().includes("nft");

  if (transferSupported && nftSupported) {
    return FeatureSupported.BOTH;
  }

  if (transferSupported) {
    return FeatureSupported.TRANSFER;
  }

  if (nftSupported) {
    return FeatureSupported.NFT;
  }

  return FeatureSupported.TRANSFER;
};
