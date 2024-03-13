import { useSearchParams } from '@solidjs/router';
import { getUserGamepasses, getUserInfo, getUserThumbnail } from '../lib/requests';
import { Match, Show, Switch, createResource, For, createSignal, createEffect } from 'solid-js';
import { ItemElement } from '../types';
import numericInput from '../components/numeric-input';
let reRenders = 0;
export default function User() {
 const [searchParams, setSearchParams] = useSearchParams();
 const userId = Number(searchParams.userId);
 const [data] = createResource(userId, getUserGamepasses);
 const [userInfo] = createResource(userId, getUserInfo);
 const [avatar] = createResource(userId, getUserThumbnail);

 const temp = {
  rolimonsRef: 'https://www.rolimons.com/player/' + userId,
  actualPasses: 0,
 };
 // TODO: split in checkers(from checkboxes) example "isUserCreator" and filter example "valueIsBetween"
 const checkerFunctions: Record<string, (item: ItemElement) => boolean> = {
  NotUserCreator: item => {
   if (item.Creator.Id == userId) return false;
   return true;
  },
 };
 const filterFunctions: Record<string, (item: ItemElement) => boolean> = {
  robux: item => {
   return item.Product.PriceInRobux >= activeFilters().robux.min && item.Product.PriceInRobux <= activeFilters().robux.max;
  },
 };
 const [activeFilters, setActiveFilters] = createSignal<Record<string, any>>({
  ...Object.fromEntries(
   Object.entries(checkerFunctions).map(([key]) => {
    return [key, false];
   }),
  ),
  robux: { min: 0, max: Infinity },
  NotUserCreator: false,
 });

 const FiltersComponent = () => (
  <div>
   <h2>Filters:</h2>
   <hr />
   {Object.keys(checkerFunctions).map(key => {
    return (
     <div>
      <input type='checkbox' id={key} name={key} value={key} checked={activeFilters()?.[key]} onChange={() => setActiveFilters(pre => ({ ...pre, [key]: !pre[key] }))} />
      <label for={key}>{key}</label>
     </div>
    );
   })}
   <h2>Robux</h2>
   <div class='text-black'>
    <div>
     <label for='min_robux'>Min:</label>
     <input
      onInput={e => {
       numericInput(e);
       setActiveFilters(pre => ({ ...pre, robux: { max: pre.robux.max, min: Number(e.currentTarget.value) } }));
       if (!e.target.value) {
        setActiveFilters(pre => ({ ...pre, robux: { max: pre.robux.max, min: 0 } }));
       }
      }}
      name='min_robux'
      id='min_robux'
     />
    </div>

    <div>
     <label for='max_robux'>Max:</label>
     <input
      onInput={e => {
       numericInput(e);
       setActiveFilters(pre => ({ ...pre, robux: { min: pre.robux.min, max: Number(e.currentTarget.value) } }));
       if (!e.target.value) {
        setActiveFilters(pre => ({ ...pre, robux: { min: pre.robux.min, max: Infinity } }));
       }
      }}
      name='max_robux'
      id='max_robux'
     />
    </div>
   </div>
  </div>
 );
 return (
  <main class='dark min-h-screen'>
   <Show when={data.loading || userInfo.loading}>
    <p>Loading...</p>
   </Show>
   <Switch>
    <Match when={data.error || userInfo.error}>
     <span>Error Occured</span>
    </Match>
    <Match when={data() && userInfo()}>
     <section class='w-full xl:w-1/2'>
      <div class='mx-auto mt-0 p-0'>
       <div class='inline-flex items-center pl-8'>
        <h1>{userInfo()?.name}</h1>
        <a href={`https://www.roblox.com/users/${userId}/profile`} rel='noopener noreferrer' class='text-link'>
         <svg xmlns='http://www.w3.org/2000/svg' aria-hidden='true' width='1.5em' height='1.5em' class='align-middle hover:animate-pulse' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24'>
          <path d='M10.586 13.414a1 1 0 0 1-1.414 1.414 5 5 0 0 1 0-7.07l3.535-3.536a5 5 0 0 1 7.071 7.071l-1.485 1.486a7.017 7.017 0 0 0-.405-2.424l.476-.476a3 3 0 1 0-4.243-4.243l-3.535 3.536a3 3 0 0 0 0 4.242zm2.828-4.242a1 1 0 0 1 1.414 0 5 5 0 0 1 0 7.07l-3.535 3.536a5 5 0 0 1-7.071-7.07l1.485-1.486c-.008.82.127 1.641.405 2.423l-.476.476a3 3 0 1 0 4.243 4.243l3.535-3.536a3 3 0 0 0 0-4.242 1 1 0 0 1 0-1.414z' fill='#fff'></path>
         </svg>
        </a>
       </div>
       <div>
        <div>
         <img src={avatar()?.data[0].imageUrl} height={720} width={720} />
        </div>

        <div>
         <div class='mx-auto grid w-[50vw] grid-cols-2 p-8'>
          <span>
           Robux Spent:{' '}
           {data()?.Data.Items.reduce((acc, item) => {
            if (item.Creator.Id == userId) return acc;
            temp.actualPasses++;
            return acc + (item.Product.PriceInRobux || 0);
           }, 0)}
          </span>
          <span>Bought Passes: {temp.actualPasses}</span>
          <span>All Passes: {data()?.Data.Items.length}</span>
          <span>
           Rolimons Ref:{' '}
           <a rel='prefetch' href={temp.rolimonsRef} class='text-link'>
            {userInfo()?.name}
            <img src='https://www.rolimons.com/favicon.ico' class='inline' width={20} height={20} />
           </a>
          </span>
         </div>
        </div>
       </div>
      </div>
     </section>
     <section class='w-full p-4 xl:w-1/2'>
      <ul class='flex w-max flex-row flex-wrap gap-x-3 lg:ml-8'>
       <For
        each={data()?.Data.Items.filter(item => {
         const conditions: boolean[] = [];
         for (const [key, value] of Object.entries(activeFilters())) {
          reRenders++;
          console.log(key, value);
          if (typeof value == 'boolean') {
           conditions.push(checkerFunctions[key](item));
          } else if (typeof value == 'object') {
           conditions.push(filterFunctions[key](item));
          }
         }
         return conditions.every(Boolean);
        })}
       >
        {({ Item, Product, Thumbnail, Creator }, i) => (
         <li class='card group h-[240px] w-[126px]'>
          <div class='card-thumb-container size-[126px] w-full rounded-lg bg-[var(--bg-tertiary)]'>
           <a href={Item.AbsoluteUrl} rel='noopener noreferrer' class='text-link'>
            <img src={Thumbnail.Url.replaceAll('110', '150')} class='card-thumb-image mx-auto rounded-lg transition-all group-hover:translate-y-[-10px] ' />
           </a>
          </div>
          {/* Init Card Description */}
          <div>
           <div class='card-info flex flex-col py-2'>
            {/* TODO: fix the work wrapping */}
            <div class='card-info-name h-[45px] break-before-column overflow-hidden text-ellipsis font-bold' title={Item.Name}>
             <a href={Item.AbsoluteUrl} rel='noopener noreferrer'>
              {Item.Name}
             </a>
            </div>

            <div class='card-info-label w-full text-xs'>
             <span data-bind='item.Label.OwnershipPreposition'>By:</span>{' '}
             <a href={Creator.CreatorProfileLink} rel='noopener noreferrer' class='text-link w-min'>
              {Creator.Name}
             </a>
            </div>
            <div class='card-info-price'>
             {!Product.IsForSale && <span data-bind='item.Info.ItemForSale'>Not for sale</span>}
             {Product.IsForSale && (
              <span>
               <span class='robux-icon'></span>
               {Product.IsFree ? 'Free' : <span data-bind='item.Info.ItemPrice'>{Product.PriceInRobux}</span>}
              </span>
             )}
            </div>
           </div>
          </div>
         </li>
        )}
       </For>
      </ul>
      <FiltersComponent />
      <div class='page-selector'>
       <div class='page-switch'></div>
       <div class='page-switch'></div>
       <div class='page-switch'></div>
       <div class='page-switch'></div>
      </div>
     </section>
    </Match>
   </Switch>
  </main>
 );
}
