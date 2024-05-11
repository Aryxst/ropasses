export interface IInventoryAPIResponse {
 IsValid: boolean;
 Data: IInventoryData;
}
export interface IInventoryData {
 Start: number;
 End: number;
 Page: number;
 nextPageCursor: number | null;
 previousPageCursor: string;
 ItemsPerPage: number;
 PageType: string;
 Items: IItemElement[];
}
export interface IItemElement {
 AssetRestrictionIcon: null;
 Item: IItem;
 Creator: ICreator;
 Product: IProduct;
 PrivateServer: null;
 Thumbnail: IThumbnail;
 UserItem: null;
}
export interface ICreator {
 Id: number;
 Name: string;
 Type: number;
 CreatorProfileLink: string;
 HasVerifiedBadge: boolean;
}
export interface IItem {
 AssetId: number;
 UniverseId: null;
 Name: string;
 AbsoluteUrl: string;
 AssetType: number;
 AssetTypeDisplayName: null;
 AssetTypeFriendlyLabel: null;
 Description: null;
 Genres: null;
 GearAttributes: null;
 AssetCategory: number;
 CurrentVersionId: number;
 IsApproved: boolean;
 LastUpdated: string;
 LastUpdatedBy: null;
 AudioUrl: null;
}
export interface IProduct {
 Id: number;
 PriceInRobux: number;
 PremiumDiscountPercentage: null;
 PremiumPriceInRobux: null;
 IsForSale: boolean;
 IsPublicDomain: boolean;
 IsResellable: boolean;
 IsLimited: boolean;
 IsLimitedUnique: boolean;
 SerialNumber: null;
 BcRequirement: number;
 TotalPrivateSales: number;
 SellerId: number;
 SellerName: null;
 LowestPrivateSaleUserAssetId: null;
 OffsaleDeadline: null;
 NoPriceText: null;
 IsFree: boolean;
}
export interface IThumbnail {
 Final: boolean;
 Url: string;
 RetryUrl: string;
 IsApproved: boolean;
}
// Singular APIs
export interface IThumnailAPIResponse {
 data: {
  targetId: number;
  state: string;
  imageUrl: string;
  version: string;
 }[];
}
export interface IUserAPIResponse {
 hasVerifiedBadge: boolean;
 id: number;
 name: string;
 displayName: string;
}
export interface IUserSearchAPIResponse {
 previousPageCursor: null;
 nextPageCursor: string;
 data: { previousUsernames: string[]; hasVerifiedBadge: boolean; id: number; name: string; displayName: string }[];
}
