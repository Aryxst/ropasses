import { useSearchParams } from '@solidjs/router';
import { getUserGamepasses, getUserInfo, getUserThumbnail } from '../lib/requests';
import { Match, Show, Switch, createResource, For, createSignal } from 'solid-js';
import { ItemElement } from '../types';
import numericInput from '../hooks/numeric-input';
import { Title } from '@solidjs/meta';

export default function User() {
 const [searchParams, setSearchParams] = useSearchParams();
 const userId = () => Number(searchParams.id);
 const [data] = createResource(userId, getUserGamepasses);
 const [userInfo] = createResource(userId, getUserInfo);
 const [avatar] = createResource(userId, getUserThumbnail);
 const [activeFilters, setActiveFilters] = createSignal<Record<string, any>>({ robux: { min: 0, max: Infinity }, creator: '' });
 // TODO: split in checkers(from checkboxes) example "isUserCreator" and filter example "valueIsBetween"
 const filters: { name: string; type: 'range' | 'condition'; fn: (item: ItemElement) => boolean }[] = [
  { name: 'robux', type: 'range', fn: item => item.Product.PriceInRobux >= activeFilters().robux.min && item.Product.PriceInRobux <= activeFilters().robux.max },
  { name: 'creator', type: 'range', fn: item => (activeFilters().creator !== '' ? item.Creator.Name.toLowerCase().includes(activeFilters().creator.toLowerCase()) : true) },
  { name: 'IsUserCreator', type: 'condition', fn: item => (activeFilters().IsUserCreator ? item.Creator.Id != userId() : true) },
 ];
 const FiltersComponent = () => (
  <div class='w-full xl:p-2'>
   <h2 class='font-bold'>Filters</h2>

   <div>
    <div class='flex flex-col gap-y-1'>
     {filters.map(({ type: filterType, name }) => {
      if (filterType == 'condition')
       return (
        <div>
         <input type='checkbox' id={name} name={name} checked={activeFilters()?.[name]} onChange={() => setActiveFilters(pre => ({ ...pre, [name]: !pre[name] }))} />
         <label for={name}>{name}</label>
        </div>
       );
     })}
     <div>
      <input
       type='text'
       placeholder='Creator Name...'
       onInput={e => {
        setActiveFilters(pre => ({ ...pre, creator: e.currentTarget.value }));
       }}
      />
     </div>
    </div>
    <h3>Robux</h3>
    <div class='flex flex-col gap-y-1 text-black'>
     <div>
      <input
       type='text'
       placeholder='Min...'
       onInput={e => {
        numericInput(e);
        setActiveFilters(pre => ({ ...pre, robux: { max: pre.robux.max, min: +e.currentTarget.value } }));
        if (!e.target.value) {
         setActiveFilters(pre => ({ ...pre, robux: { max: pre.robux.max, min: 0 } }));
        }
       }}
      />
     </div>
     <div>
      <input
       type='text'
       placeholder='Max...'
       onInput={e => {
        numericInput(e);
        setActiveFilters(pre => ({ ...pre, robux: { min: pre.robux.min, max: +e.currentTarget.value } }));
        if (!e.target.value) {
         setActiveFilters(pre => ({ ...pre, robux: { min: pre.robux.min, max: Infinity } }));
        }
       }}
      />
     </div>
    </div>
   </div>
  </div>
 );
 return (
  <>
   <main class='dark min-h-screen'>
    <Show when={data.loading || userInfo.loading}>
     <p class='p-2'>Loading...</p>
    </Show>
    <Switch>
     <Match when={data.error || userInfo.error}>
      <p class='p-2'>Error Occured</p>
     </Match>
     <Match when={data() && data()?.Data.Items && userInfo()}>
      <Title>{userInfo()?.name} Gamepasses</Title>
      <section class='w-full xl:w-1/2'>
       <div class='mx-auto mt-0 p-0'>
        <div class='inline-flex items-center pl-8'>
         <h1>{userInfo()?.name}</h1>
         <a href={`https://www.roblox.com/users/${userId()}/profile`} aria-label='Go to User Profile' rel='noopener noreferrer' class='text-link'>
          <svg xmlns='http://www.w3.org/2000/svg' aria-hidden='true' width='32' height='32' class='align-middle hover:animate-pulse' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24'>
           <path d='M10.586 13.414a1 1 0 0 1-1.414 1.414 5 5 0 0 1 0-7.07l3.535-3.536a5 5 0 0 1 7.071 7.071l-1.485 1.486a7.017 7.017 0 0 0-.405-2.424l.476-.476a3 3 0 1 0-4.243-4.243l-3.535 3.536a3 3 0 0 0 0 4.242zm2.828-4.242a1 1 0 0 1 1.414 0 5 5 0 0 1 0 7.07l-3.535 3.536a5 5 0 0 1-7.071-7.07l1.485-1.486c-.008.82.127 1.641.405 2.423l-.476.476a3 3 0 1 0 4.243 4.243l3.535-3.536a3 3 0 0 0 0-4.242 1 1 0 0 1 0-1.414z' fill='#fff'></path>
          </svg>
         </a>
        </div>
        <div>
         <div>
          <img src={avatar()?.data[0].imageUrl} alt={`${userInfo()?.name}'s avatar`} width={300} height={300} />
         </div>

         <div>
          <div class='mx-auto grid w-[50vw] grid-cols-2 p-8'>
           <span>
            Robux Spent:{' '}
            {data()?.Data.Items.reduce((acc, item) => {
             if (item.Creator.Id == userId()) return acc;

             return acc + (item.Product.PriceInRobux || 0);
            }, 0)}
           </span>
           <span>
            Bought Passes:{' '}
            {data()?.Data.Items.reduce((acc, item) => {
             if (item.Creator.Id == userId()) return acc;
             return acc + 1;
            }, 0)}
           </span>
           <span>All Passes: {data()?.Data.Items.length}</span>
           <span>
            Rolimons Reference:{' '}
            <a rel='prefetch' aria-label='Go to User Rolimons Profile' href={'https://www.rolimons.com/player/' + userId()} class='text-link text-blue-500  '>
             {userInfo()?.name}
             <img src='https://www.rolimons.com/favicon.ico' class='inline' width={20} height={20} alt='Rolimons Logo' />
            </a>
           </span>
           <span class='col-span-2 w-full'>
            <a rel='noopener noreferrer' aria-label='Go to User Gamepasses' class='text-link text-blue-500' href={`https://www.roblox.com/users/${userId()}/inventory/#!/game-passes`}>
             User Gamepasses Reference
            </a>
           </span>
          </div>
          <hr />
          {data()?.Data.Items.length != 0 && <FiltersComponent />}
         </div>
        </div>
       </div>
      </section>
      <section class='w-full py-4 xl:w-1/2'>
       <ul class='flex w-full flex-row flex-wrap justify-center gap-x-3 lg:ml-8'>
        <For
         each={data()?.Data.Items.filter(item => {
          const conditions: boolean[] = [];
          for (const [key, value] of Object.entries(activeFilters())) {
           console.log(key, value);
           activeFilters()[key] ? conditions.push(filters.find(filter => filter.name == key)?.fn(item) as boolean) : conditions.push(true);
          }
          return conditions.every(Boolean);
         })}
        >
         {({ Item, Product, Thumbnail, Creator }, i) => (
          <li class='card h-[240px] w-[126px]'>
           <div class='card-thumb-container size-[126px] w-full rounded-lg bg-[var(--bg-tertiary)]'>
            <a href={Item.AbsoluteUrl} aria-label='Go to Item' rel='noopener noreferrer' class='text-link'>
             <img src={Thumbnail.Url.replaceAll('110', '150')} alt='Item Thumbnail' width={150} height={150} class='card-thumb-image mx-auto rounded-lg transition-all ' />
            </a>
           </div>
           <div>
            <div class='card-info flex flex-col py-2'>
             <div class='card-info-name  break-before-column overflow-hidden text-ellipsis font-bold' title={Item.Name}>
              <a href={Item.AbsoluteUrl} aria-label='Go to Item' rel='noopener noreferrer'>
               {Item.Name}
              </a>
             </div>
             <div class='card-info-label w-full text-xs'>
              <span data-bind='item.Label.OwnershipPreposition'>By:</span>{' '}
              <a href={Creator.CreatorProfileLink} aria-label='Go to Creator' rel='noopener noreferrer' class='text-link w-min'>
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
       <div class='page-selector'>
        <div class='page-switch'></div>
        <div class='page-switch'></div>
        <div class='page-switch'></div>
        <div class='page-switch'></div>
       </div>
      </section>
     </Match>
     <Match when={!data.loading && !data()?.IsValid}>
      <p class='p-2'>No data</p>
     </Match>
    </Switch>
   </main>
  </>
 );
}
