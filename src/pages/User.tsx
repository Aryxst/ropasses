import { useSearchParams } from '@solidjs/router';
import { getUserGamepasses, getUserInfo, getUserThumbnail } from '../lib/requests';
import { Match, Show, Switch, createResource, For, createSignal } from 'solid-js';
import * as RobloxAPITypes from '../types/RobloxAPIs';
import { Icon } from '@iconify-icon/solid';

export default function User() {
 const [searchParams, setSearchParams] = useSearchParams();
 const userId = () => Number(searchParams.id);
 const [data] = createResource(userId, getUserGamepasses);
 const [userInfo] = createResource(userId, getUserInfo);
 const [avatar] = createResource(userId, getUserThumbnail);

 const [optionTab, setOptionTab] = createSignal(0);

 const [activeFilters, setActiveFilters] = createSignal({
  robux: { min: 0, max: Infinity },
  creator: '',
  IsUserCreator: false,
  ItemName: '',
 });
 type Filters = ReturnType<typeof activeFilters>;

 const filters: { name: keyof Filters; type: 'range' | 'condition'; fn: (item: RobloxAPITypes.IItemElement) => boolean; external?: boolean }[] = [
  { name: 'robux', type: 'range', fn: item => item.Product.PriceInRobux >= activeFilters().robux.min && item.Product.PriceInRobux <= activeFilters().robux.max },
  { name: 'creator', type: 'range', fn: item => (activeFilters().creator !== '' ? item.Creator.Name.toLowerCase().includes(activeFilters().creator.toLowerCase()) : true) },
  { name: 'IsUserCreator', type: 'condition', fn: item => (activeFilters().IsUserCreator ? item.Creator.Id != userId() : true) },
  { name: 'ItemName', type: 'range', fn: item => (activeFilters().ItemName !== '' ? item.Item.Name.toLowerCase().includes(activeFilters().ItemName.toLowerCase()) : true), external: true },
 ];
 function filterItem(item: RobloxAPITypes.IItemElement) {
  const metConditions: boolean[] = [];
  for (const [key, value] of Object.entries(activeFilters())) {
   console.log(key, value);
   activeFilters()[key as keyof Filters] ? metConditions.push(filters.find(filter => filter.name == (key as keyof Filters))?.fn(item) as boolean) : metConditions.push(true);
  }
  return metConditions.every(Boolean);
 }
 const FiltersComponent = () => (
  <div class='w-full p-2'>
   <div>
    <div class='flex flex-col gap-y-1'>
     {filters.map(({ type: filterType, name, external }) => {
      if (external) return;
      if (filterType == 'condition')
       return (
        <div>
         <input type='checkbox' id={name} name={name} checked={activeFilters()?.[name] as boolean} onChange={() => setActiveFilters(pre => ({ ...pre, [name]: !pre[name] }))} />
         <label for={name}>{name}</label>
        </div>
       );
     })}
     <div>
      <input
       type='text'
       placeholder='Creator Name'
       class='rounded-lg border border-neutral-200 border-opacity-20 bg-neutral-950 py-0.5 pl-1 placeholder-neutral-500'
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
       type='number'
       placeholder='Min'
       class='rounded-lg border border-neutral-200 border-opacity-20 bg-neutral-950 py-0.5 pl-1 placeholder-neutral-500'
       onInput={e => {
        setActiveFilters(pre => ({ ...pre, robux: { max: pre.robux.max, min: +e.currentTarget.value } }));
        if (!e.target.value) {
         setActiveFilters(pre => ({ ...pre, robux: { max: pre.robux.max, min: 0 } }));
        }
       }}
      />
     </div>
     <div>
      <input
       type='number'
       placeholder='Max'
       class='rounded-lg border border-neutral-200 border-opacity-20 bg-neutral-950 py-0.5 pl-1 placeholder-neutral-500'
       onInput={e => {
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
 const CategoriesComponent = () => {
  return <ul></ul>;
 };
 const Options = () => (
  <div class='w-full'>
   <div class='bg-[var(--bg-tertiary)] pt-3 max-sm:py-1'>
    <div class='relative mx-auto max-w-fit'>
     <Icon icon='lucide:search' class='top absolute left-[9.33px] top-[9px]' width={20} />
     <input
      type='text'
      placeholder='Search Item'
      class='h-9 w-80 rounded-lg border border-neutral-200 border-opacity-20 bg-neutral-950 pl-8 text-lg placeholder-neutral-500'
      onInput={e => {
       setActiveFilters(pre => ({ ...pre, ItemName: e.currentTarget.value }));
      }}
     />
    </div>
   </div>
   <div>
    <ul class='options inline-flex w-full bg-[var(--bg-tertiary)] text-center text-lg max-sm:hidden'>
     <li class='flex-1 cursor-pointer py-3 [&.selected]:shadow-[inset_0_-4px_0_0_white] [&:not(.selected)]:hover:shadow-[inset_0_-4px_0_0_gray]' classList={{ selected: optionTab() === 0 }} onClick={() => setOptionTab(0)}>
      Filter
     </li>
     <li class='flex-1 cursor-pointer py-3 [&.selected]:shadow-[inset_0_-4px_0_0_white] [&:not(.selected)]:hover:shadow-[inset_0_-4px_0_0_gray]' classList={{ selected: optionTab() === 1 }} onClick={() => setOptionTab(1)}>
      Categories
     </li>
    </ul>
    <Switch>
     <Match when={optionTab() === 0}>
      <FiltersComponent />
     </Match>
     <Match when={optionTab() === 1}>
      <CategoriesComponent />
     </Match>
    </Switch>
   </div>
  </div>
 );
 return (
  <div class='dark min-h-screen xl:inline-flex'>
   <Show when={data.loading || userInfo.loading}>
    <p class='p-2'>Loading...</p>
   </Show>
   <Switch>
    <Match when={data.error || userInfo.error}>
     <p class='p-2'>Error Occured</p>
    </Match>
    <Match when={data() && data()?.Data.Items && userInfo()}>
     <section class='w-full xl:w-1/2'>
      <div class='w-full'>
       <div class='text inline-flex items-center pl-8'>
        <h1>{userInfo()?.name}</h1>
        <a href={`https://www.roblox.com/users/${userId()}/profile`} aria-label='Go to User Profile' rel='noopener noreferrer' class='text-link'>
         <svg xmlns='http://www.w3.org/2000/svg' aria-hidden='true' width='32' height='32' class='align-middle hover:animate-pulse' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24'>
          <path d='M10.586 13.414a1 1 0 0 1-1.414 1.414 5 5 0 0 1 0-7.07l3.535-3.536a5 5 0 0 1 7.071 7.071l-1.485 1.486a7.017 7.017 0 0 0-.405-2.424l.476-.476a3 3 0 1 0-4.243-4.243l-3.535 3.536a3 3 0 0 0 0 4.242zm2.828-4.242a1 1 0 0 1 1.414 0 5 5 0 0 1 0 7.07l-3.535 3.536a5 5 0 0 1-7.071-7.07l1.485-1.486c-.008.82.127 1.641.405 2.423l-.476.476a3 3 0 1 0 4.243 4.243l3.535-3.536a3 3 0 0 0 0-4.242 1 1 0 0 1 0-1.414z' fill='#fff'></path>
         </svg>
        </a>
       </div>
       <div>
        <img src={avatar()?.data[0].imageUrl} alt={`${userInfo()?.name}'s avatar`} width={300} height={300} class='mx-auto' />
        <ul class='grid w-full grid-cols-2 pl-3'>
         <li>
          <p>Robux Spent:</p>
          <span>
           {data()?.Data.Items.reduce((acc, item) => {
            if (item.Creator.Id == userId()) return acc;
            return acc + (item.Product.PriceInRobux || 0);
           }, 0)}
          </span>
         </li>
         <li>
          <p>Passes Bought:</p>
          <span>
           {data()?.Data.Items.reduce((acc, item) => {
            if (item.Creator.Id == userId()) return acc;
            return acc + 1;
           }, 0)}
          </span>
         </li>
         <li>
          <p>All Passes:</p>
          <span>{data()?.Data.Items.length}</span>
         </li>
         <li>
          <p>Rolimons Reference:</p>
          <a rel='prefetch' aria-label='Go to User Rolimons Profile' href={'https://www.rolimons.com/player/' + userId()} class='text-link text-blue-500  '>
           <p>
            {userInfo()?.name}
            <img src='https://www.rolimons.com/favicon.ico' class='inline' width={20} height={20} alt='Rolimons Logo' />
           </p>
          </a>
         </li>
        </ul>
       </div>
      </div>
     </section>
     <section class='w-full py-4 xl:w-1/2'>
      <Options />
      <ul class='flex w-full flex-row flex-wrap justify-center gap-x-3'>
       <For each={data()?.Data.Items}>
        {Element => {
         const { Thumbnail, Item, Creator, Product } = Element;
         return (
          <li classList={{ hidden: !filterItem(Element) }}>
           <div class=''>
            <a href={Item.AbsoluteUrl} aria-label='Go to Item' rel='noopener noreferrer' class='text-link'>
             <img src={Thumbnail.Url.replaceAll('110', '150')} alt='Item IThumbnail' width={150} height={150} class='rounded-lg' />
            </a>
           </div>
           <div>
            <div class=''>
             <div class='' title={Item.Name}>
              <a href={Item.AbsoluteUrl} aria-label='Go to Item' rel='noopener noreferrer'>
               {Item.Name}
              </a>
             </div>
             <div class=''>
              <span data-bind='item.Label.OwnershipPreposition'>By:</span>
              <a href={Creator.CreatorProfileLink} aria-label='Go to Creator' rel='noopener noreferrer' class='text-link'>
               {Creator.Name}
              </a>
             </div>
             <div class=''>
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
         );
        }}
       </For>
      </ul>
     </section>
    </Match>
    <Match when={!data.loading && !data()?.IsValid}>
     <p class='p-2'>No data</p>
    </Match>
   </Switch>
  </div>
 );
}
