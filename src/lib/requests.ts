import { InventoryAPIResponse, UserAPIResponse, ThumnailAPIResponse, UserSearchAPIResponse } from '../types';

const getUserGamepasses = async (userId: number) => {
 const res = await fetch(`https://www.roproxy.com/users/inventory/list-json?assetTypeId=34&cursor=&itemsPerPage=1000&pageNumber=1&userId=${userId}`, {
  cache: 'force-cache',
  headers: {
   'Cache-Control': 'max-age=86400', // Cache for 24 hours
  },
 });
 const data: InventoryAPIResponse = await res.json();
 return data;
};
const getUserInfo = async (userId: number) => {
 const cachedData = sessionStorage.getItem(`user_info_${userId}`);
 if (cachedData && !cachedData.includes('error')) {
  return JSON.parse(cachedData) as UserAPIResponse;
 }
 const res = await fetch(`https://users.roproxy.com/v1/users/${userId}`, {
  cache: 'no-store',
 });
 const data: UserAPIResponse = await res.json();
 !cachedData && sessionStorage.setItem(`user_info_${userId}`, JSON.stringify(data));
 return data;
};
const getUserThumbnail = async (userId: number) => {
 const res = await fetch(`https://thumbnails.roproxy.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png&isCircular=false`, {
  cache: 'force-cache',
  headers: {
   'Cache-Control': 'max-age=300', // Cache for 5 minutes
  },
 });
 const data: ThumnailAPIResponse = await res.json();
 return data;
};
const searchUsers = async (query: string) => {
 const res = await fetch(`https://users.roproxy.com/v1/users/search?keyword=Aryxst&limit=25`, { cache: 'no-store' });
 const data: UserSearchAPIResponse = await res.json();
 return data;
};

export { getUserGamepasses, getUserInfo, getUserThumbnail, searchUsers };
