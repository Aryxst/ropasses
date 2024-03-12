import { useParams } from "@solidjs/router";
import {
  getUserGamepasses,
  getUserInfo,
  getUserThumbnail,
} from "../lib/requests";
import { Match, Show, Switch, createResource, For } from "solid-js";

export default function Home() {
  const userId = Number(useParams().userId);
  const [data] = createResource(userId, getUserGamepasses);
  const [userInfo] = createResource(userId, getUserInfo);
  const [avatar] = createResource(userId, getUserThumbnail);
  const temp = {
    rolimonsRef: "https://www.rolimons.com/player/" + userId,
    actualPasses: 0,
    filter: [],
  };

  return (
    <main class="min-h-screen">
      <Show when={data.loading || userInfo.loading}>
        <p>Loading...</p>
      </Show>
      <Switch>
        <Match when={data.error || userInfo.error}>
          <span>Error Occured</span>
        </Match>
        <Match when={data() && userInfo()}>
          <section class="h-full p-0 m-">
            <div class="mx-auto mt-0 p-0">
              <div class="inline-flex items-center pl-8">
                <h1>{userInfo()?.name}</h1>
                <a
                  href={`https://www.roblox.com/users/${userId}/profile`}
                  rel="noopener noreferrer"
                  class="text-link"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    width="1.5em"
                    height="1.5em"
                    class="hover:animate-pulse align-middle"
                    style="vertical-align: middle; -ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);display:inline"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M10.586 13.414a1 1 0 0 1-1.414 1.414 5 5 0 0 1 0-7.07l3.535-3.536a5 5 0 0 1 7.071 7.071l-1.485 1.486a7.017 7.017 0 0 0-.405-2.424l.476-.476a3 3 0 1 0-4.243-4.243l-3.535 3.536a3 3 0 0 0 0 4.242zm2.828-4.242a1 1 0 0 1 1.414 0 5 5 0 0 1 0 7.07l-3.535 3.536a5 5 0 0 1-7.071-7.07l1.485-1.486c-.008.82.127 1.641.405 2.423l-.476.476a3 3 0 1 0 4.243 4.243l3.535-3.536a3 3 0 0 0 0-4.242 1 1 0 0 1 0-1.414z"
                      fill="#fff"
                    ></path>
                  </svg>
                </a>
              </div>
              <div>
                <div>
                  <img
                    src={avatar()?.data[0].imageUrl}
                    height={720}
                    width={720}
                  />
                </div>

                <div>
                  <div class="grid-cols-2 grid w-[50vw] mx-auto p-8">
                    <span>
                      Robux spent:{" "}
                      {data()?.Data.Items.reduce((acc, item) => {
                        if (item.Creator.Id == userId) return acc;
                        temp.actualPasses++;
                        return acc + (item.Product.PriceInRobux || 0);
                      }, 0)}
                    </span>
                    <span>Bought passes: {temp.actualPasses}</span>
                    <span>All passes: {data()?.Data.Items.length}</span>
                    <span>
                      Rolimons Ref:{" "}
                      <a
                        rel="prefetch"
                        href={temp.rolimonsRef}
                        class="text-link"
                      >
                        {userInfo()?.name}
                        <img
                          src="https://www.rolimons.com/favicon.ico"
                          class="inline"
                          width={20}
                          height={20}
                        />
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section class="p-4">
            <ul class={`flex flex-row flex-wrap gap-x-3 ml-8`}>
              <For
                each={data()?.Data.Items.filter(
                  (item) => item.Creator.Id != userId
                )}
              >
                {({ Item, Product, Thumbnail, Creator }, i) => (
                  <li class="card h-[240px] w-[126px]">
                    <div class="card-thumb-container size-[126px] w-full rounded-lg bg-[var(--bg-tertiary)]">
                      <img
                        src={
                          Thumbnail.Url.replaceAll("110", "150") ||
                          Thumbnail.RetryUrl
                        }
                        class="card-thumb-image mx-auto transition-opacity rounded-lg"
                      />
                    </div>
                    {/* Init Card Description */}
                    <div>
                      <div class="card-info flex flex-col py-2">
                        <div class="card-info-name font-bold ">
                          <a
                            href={Item.AbsoluteUrl}
                            rel="noopener noreferrer"
                            class="text-link"
                          >
                            {Item.Name}
                          </a>
                        </div>
                        <div class="card-info-label w-full text-xs">
                          <span data-bind="item.Label.OwnershipPreposition">
                            By:
                          </span>{" "}
                          <a
                            href={Creator.CreatorProfileLink}
                            rel="noopener noreferrer"
                            class="text-link w-min overflow-hidden text-ellipsis whitespace-nowrap"
                          >
                            {Creator.Name}
                          </a>
                        </div>
                        <div class="card-info-price">
                          {!Product.IsForSale && (
                            <span data-bind="item.Info.ItemForSale">
                              Not for sale
                            </span>
                          )}
                          {Product.IsForSale && (
                            <span>
                              <span class="robux-icon"></span>
                              {Product.IsFree ? (
                                "Free"
                              ) : (
                                <span data-bind="item.Info.ItemPrice">
                                  {Product.PriceInRobux}
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                )}
              </For>
            </ul>
            <div class="page-selector">
              <div class="page-switch"></div>
              <div class="page-switch"></div>
              <div class="page-switch"></div>
              <div class="page-switch"></div>
            </div>
          </section>
        </Match>
      </Switch>
    </main>
  );
}
