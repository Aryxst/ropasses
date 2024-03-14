export interface InventoryAPIResponse {
 IsValid: boolean;
 Data: InventoryData;
}
export interface InventoryData {
 Start: number;
 End: number;
 Page: number;
 nextPageCursor: number | null;
 previousPageCursor: string;
 ItemsPerPage: number;
 PageType: string;
 Items: ItemElement[];
}
export interface ItemElement {
 AssetRestrictionIcon: null;
 Item: ItemItem;
 Creator: Creator;
 Product: Product;
 PrivateServer: null;
 Thumbnail: Thumbnail;
 UserItem: null;
}
export interface Creator {
 Id: number;
 Name: string;
 Type: number;
 CreatorProfileLink: string;
 HasVerifiedBadge: boolean;
}
export interface ItemItem {
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
export interface Product {
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
export interface Thumbnail {
 Final: boolean;
 Url: string;
 RetryUrl: string;
 IsApproved: boolean;
}
// Singular APIs
export interface ThumnailAPIResponse {
 data: {
  targetId: number;
  state: string;
  imageUrl: string;
  version: string;
 }[];
}
export interface UserAPIResponse {
 hasVerifiedBadge: boolean;
 id: number;
 name: string;
 displayName: string;
}
export interface UserSearchAPIResponse {
 previousPageCursor: null;
 nextPageCursor: string;
 data: { previousUsernames: string[]; hasVerifiedBadge: boolean; id: number; name: string; displayName: string }[];
}
