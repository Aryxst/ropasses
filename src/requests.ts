import { InventoryAPIResponse, UserAPIResponse } from "./types";

const getUserGamepasses = async (userId: number) => {
  const res = await fetch(
    `https://www.roproxy.com/users/inventory/list-json?assetTypeId=34&cursor=&itemsPerPage=1000&pageNumber=1&userId=${userId}`,
    {
      cache: "force-cache",
      headers: {
        "Cache-Control": "max-age=86400", // Cache for 24 hours (86400 seconds)
      },
    }
  );
  const data: InventoryAPIResponse = await res.json();
  return data;
};
const getUserInfo = async (userId: number) => {
  const res = await fetch("https://users.roproxy.com/v1/users/" + userId, {
    cache: "force-cache",
    headers: {
      "Cache-Control": "max-age=86400", // Cache for 24 hours (86400 seconds)
    },
  });
  const data: UserAPIResponse = await res.json();
  return data;
};
export { getUserGamepasses, getUserInfo };
