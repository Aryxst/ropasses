import { getUserGamepasses, getUserInfo } from "../requests";
import { Match, Show, Switch, createResource } from "solid-js";

export default function Home() {
  const userId = 586080435;
  const [data] = createResource(userId, getUserGamepasses);
  const [userInfo] = createResource(userId, getUserInfo);
  const temp = {
    rolimonsRef: "https://www.rolimons.com/player/" + userId,
    actualPasses: 0,
  };

  return (
    <main class="min-h-screen p-8">
      <Show when={data.loading || userInfo.loading}>
        <p>Loading...</p>
      </Show>
      <Switch>
        <Match when={data.error || userInfo.error}>
          <span>Error Occured</span>
        </Match>
        <Match when={data() && userInfo()}>
          <div class="flex flex-col">
            <span>Username: {userInfo.name}</span>
            <span>Display Name: {userInfo()?.displayName}</span>
            <span>
              Robux spent:{" "}
              {data()?.Data.Items.reduce((acc, item) => {
                if (item.Creator.Id == userId) return acc;
                temp.actualPasses++;
                return acc + (item.Product.PriceInRobux || 0);
              }, 0)}
            </span>
            <span>Total passes: {temp.actualPasses}</span>
            <span>
              Rolimons Ref:{" "}
              <a rel="prefetch" href={temp.rolimonsRef}>
                {temp.rolimonsRef}
              </a>
            </span>
          </div>
          <hr />
          <div>Filters(TODO)</div>
          <ul class={`flex flex-row flex-wrap gap-3`}>
            {data()
              ?.Data.Items.filter((item) => item.Creator.Id != userId)
              .map(({ Item, Product, Thumbnail, Creator }, i) => (
                <li class="card mb-2 mt-2 h-[240px] w-[126px] p-2">
                  {/* Init Card Thumbnail */}
                  <div class="card-thumb-container size-[110px] w-full rounded-lg bg-[var(--bg-tertiary)]">
                    <img
                      src={Thumbnail.Url || Thumbnail.RetryUrl}
                      class="card-thumb-image ml-auto mr-auto transition-opacity"
                    ></img>
                  </div>
                  {/* Init Card Description */}
                  <div class="card-info flex flex-col">
                    <div class="card-info-name font-bold">
                      <a
                        href={Item.AbsoluteUrl}
                        rel="noopener noreferrer"
                        class="text-link"
                      >
                        {Item.Name}
                      </a>
                    </div>
                    <div class="card-info-label w-full text-xs">
                      <span data-bind="Label.OwnershipPreposition">By:</span>{" "}
                      <a
                        href={Creator.CreatorProfileLink}
                        rel="noopener noreferrer"
                        class="text-link w-min overflow-hidden text-ellipsis whitespace-nowrap"
                      >
                        {Creator.Name}
                      </a>
                    </div>
                    <div class="card-info-price">
                      <span class="robux-icon" />{" "}
                      <span>{Product.PriceInRobux || "Not for Sale"}</span>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
          <div class="page-selector">
            <div class="page-switch"></div>
            <div class="page-switch"></div>
            <div class="page-switch"></div>
            <div class="page-switch"></div>
          </div>
        </Match>
      </Switch>
    </main>
  );
}
