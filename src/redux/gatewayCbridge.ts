import {
  ClaimGetBscCampaignRewardRequest,
  ClaimGetBscCampaignRewardResponse,
  GetBscCampaignInfoRequest,
  GetBscCampaignInfoResponse,
  InIncentiveCampaignBnbWhiteListRequest,
  InIncentiveCampaignBnbWhiteListResponse,
} from "../proto/gateway/gateway_pb";
import { WebClient } from "../proto/gateway/GatewayServiceClientPb";

/* eslint-disable camelcase */
const preFix = { pathPrefix: process.env.REACT_APP_SERVER_URL }; // 域名
console.log("preFix", preFix);
const client = new WebClient(`${process.env.REACT_APP_GRPC_SERVER_URL}`, null, null);

export const getBscCampaignInfo = (reqParams: GetBscCampaignInfoRequest): Promise<GetBscCampaignInfoResponse> => {
  return client.getBscCampaignInfo(reqParams, null);
};

export const claimGetBscCampaignReward = (
  reqParams: ClaimGetBscCampaignRewardRequest,
): Promise<ClaimGetBscCampaignRewardResponse> => {
  return client.claimGetBscCampaignReward(reqParams, null);
};

export const getBNBIncentiveCampaignBNBWhiteInfo = (
  reqParams: InIncentiveCampaignBnbWhiteListRequest,
): Promise<InIncentiveCampaignBnbWhiteListResponse> => {
  return client.inIncentiveCampaignBnbWhiteList(reqParams, null);
};
