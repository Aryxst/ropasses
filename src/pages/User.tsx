import { useSearchParams } from '@solidjs/router';
import { getUserGamepasses, getUserInfo, getUserThumbnail } from '../lib/requests';
// The match component is used to display the items on a certain condition, and it switches(with the Switch) between the items depending on the condition
// The createSignal is used to create a state that is only updated when the component is rendered
// The createResource is used to fetch data dynamically, and it updates the state when the data is fetched
import { Match, Show, Switch, createResource, For, createSignal } from 'solid-js';
import { ItemElement } from '../types';
// The numeric input hook is used to prevent the user from entering non-numeric characters
import numericInput from '../hooks/numeric-input';

// WITH DYNAMICALLY I MEAN ON PAGE LOAD, SO IT DOES NOT PRESERVE THE PREVIOUS STATE
// CHANGING SIGNAL AUTOMATICALLY RERUNS ALL FUNCTION RELATED TO IT => SOLID.JS FRAMEWORK

export default function User() {
 // Gets all search params from the url
 const [searchParams, setSearchParams] = useSearchParams();
 // Dynamically parses the id searchParam to a number
 const userId = () => Number(searchParams.id);
 // Dynamically fetches user gamepasses from the the roblox api
 const [data] = createResource(userId, getUserGamepasses);
 // Dynamically fetches userInfo like name, accountage and such from the roblox api
 const [userInfo] = createResource(userId, getUserInfo);
 // Dynamically fetches the user's avatar from the roblox api
 const [avatar] = createResource(userId, getUserThumbnail);

 // Setting up the filters, this table only contains the active filters and their properties
 const [activeFilters, setActiveFilters] = createSignal<Record<string, any>>({ robux: { min: 0, max: Infinity }, creator: '' });
 // TODO: split in checkers(from checkboxes) example "isUserCreator" and filter example "valueIsBetween"
 // There are two types of filters, the range and the condition.
 // The range filter checks if the item meets the range requirements
 // The condition filter checks if the item meets the condition requirements, like the isUserCreator(condition) one checks if the gamepass is owned created by the user and if its true it will not be displayed
 // These two types both return a boolean for each gamepass
 const filters: { name: string; type: 'range' | 'condition'; fn: (item: ItemElement) => boolean }[] = [
  { name: 'robux', type: 'range', fn: item => item.Product.PriceInRobux >= activeFilters().robux.min && item.Product.PriceInRobux <= activeFilters().robux.max },
  { name: 'creator', type: 'range', fn: item => (activeFilters().creator !== '' ? item.Creator.Name.toLowerCase().includes(activeFilters().creator.toLowerCase()) : true) },
  { name: 'IsUserCreator', type: 'condition', fn: item => (activeFilters().IsUserCreator ? item.Creator.Id != userId() : true) },
 ];
 const FiltersComponent = () => (
  // Sets the width to full, and the content's padding to 8px on extra large screens
  <div class='w-full xl:p-2'>
   <h2 class='font-bold'>Filters</h2>
   <div>
    {/* Flexes the content in a column with a vertical gap of 4px */}
    <div class='flex flex-col gap-y-1'>
     {/* For each "condition" filter, it creates a checkbox and a label with its bound events and checks */}
     {filters.map(({ type: filterType, name }) => {
      if (filterType == 'condition')
       return (
        <div>
         <input type='checkbox' id={name} name={name} checked={activeFilters()?.[name]} onChange={() => setActiveFilters(pre => ({ ...pre, [name]: !pre[name] }))} />
         <label for={name}>{name}</label>
        </div>
       );
     })}
     {/* Here i setup the "range" filters */}
     <div>
      <input
       type='text'
       placeholder='Creator Name...'
       /* On input, filters the creator name for all gamepasses */
       onInput={e => {
        setActiveFilters(pre => ({ ...pre, creator: e.currentTarget.value }));
       }}
      />
     </div>
    </div>
    <h3>Robux</h3>
    {/* Flexes the content in a column with a vertical gap of 4px */}
    <div class='flex flex-col gap-y-1 text-black'>
     <div>
      <input
       type='text'
       placeholder='Min...'
       /* On input apply the numeric input hook, filters the min robux, preserves max robux state  for all gamepasses */
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
       /* On input apply the numeric input hook, filters the max robux, preserves min robux state for all gamepasses */
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
   {/* Set the min height to screen height */}
   <main class='dark min-h-screen'>
    {/* This is shown while the data is loading */}
    <Show when={data.loading || userInfo.loading}>
     <p class='p-2'>Loading...</p>
    </Show>
    <Switch>
     {/* If the data is not loading and there is an error, it will display an error message. Likely if you made too much requests to the api(spamming since its running on the browser and not on a server) */}
     <Match when={data.error || userInfo.error}>
      <p class='p-2'>Error Occured</p>
     </Match>
     {/* If the data is not loading and there is no error, it will display the user's data. Parsed into a grid of gamepasses */}
     <Match when={data() && data()?.Data.Items && userInfo()}>
      {/* Sets the width to 1/2 of the screen on extra large screens, and to full on smaller screens */}
      {/* This enables the two sections to be next to each other on extra large screens and wrapped on smaller screens */}
      <section class='w-full xl:w-1/2'>
       {/* Center this div using margin, remove padding and top margin */}
       <div class='mx-auto mt-0 p-0'>
        {/* Flexes the content of this div inline and centered with a left padding of 32px */}
        <div class='inline-flex items-center pl-8'>
         {/* Display the user's username */}
         <h1>{userInfo()?.name}</h1>
         {/* Link to the user's profile, with a svg link icon */}
         <a href={`https://www.roblox.com/users/${userId()}/profile`} aria-label='Go to User Profile' rel='noopener noreferrer' class='text-link'>
          <svg xmlns='http://www.w3.org/2000/svg' aria-hidden='true' width='32' height='32' class='align-middle hover:animate-pulse' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24'>
           <path d='M10.586 13.414a1 1 0 0 1-1.414 1.414 5 5 0 0 1 0-7.07l3.535-3.536a5 5 0 0 1 7.071 7.071l-1.485 1.486a7.017 7.017 0 0 0-.405-2.424l.476-.476a3 3 0 1 0-4.243-4.243l-3.535 3.536a3 3 0 0 0 0 4.242zm2.828-4.242a1 1 0 0 1 1.414 0 5 5 0 0 1 0 7.07l-3.535 3.536a5 5 0 0 1-7.071-7.07l1.485-1.486c-.008.82.127 1.641.405 2.423l-.476.476a3 3 0 1 0 4.243 4.243l3.535-3.536a3 3 0 0 0 0-4.242 1 1 0 0 1 0-1.414z' fill='#fff'></path>
          </svg>
         </a>
        </div>
        <div>
         {/* Display the user's avatar under the user's username */}
         <div>
          <img src={avatar()?.data[0].imageUrl} alt={`${userInfo()?.name}'s avatar`} width={300} height={300} />
         </div>
         <div>
          {/* Display the user's stats under the user's avatar, this div uses grid layout with two columns and an automatic horizontal margin(centering). Has a padding of 32px */}
          <div class='mx-auto grid w-[50vw] grid-cols-2 p-8'>
           <span>
            Robux Spent: {/* Return a sum of all robux spent, iterating through the gamepasses data previously fetched */}
            {data()?.Data.Items.reduce((acc, item) => {
             if (item.Creator.Id == userId()) return acc;

             return acc + (item.Product.PriceInRobux || 0);
            }, 0)}
           </span>
           <span>
            Bought Passes: {/* Return a sum of all gamepasses bought, iterating through the gamepasses data previously fetched. This does not included the ones created by the user */}
            {data()?.Data.Items.reduce((acc, item) => {
             if (item.Creator.Id == userId()) return acc;
             return acc + 1;
            }, 0)}
           </span>
           {/* Display the total number of gamepasses, including the ones created by the user */}
           <span>All Passes: {data()?.Data.Items.length}</span>
           <span>
            Rolimons Reference: {/* Link to the user's profile on Rolimons, with its favicon next to it */}
            <a rel='prefetch' aria-label='Go to User Rolimons Profile' href={'https://www.rolimons.com/player/' + userId()} class='text-link text-blue-500  '>
             {userInfo()?.name}
             <img src='https://www.rolimons.com/favicon.ico' class='inline' width={20} height={20} alt='Rolimons Logo' />
            </a>
           </span>
           {/* A link to the user's inventory on Roblox */}
           <span class='col-span-2 w-full'>
            <a rel='noopener noreferrer' aria-label='Go to User Gamepasses' class='text-link text-blue-500' href={`https://www.roblox.com/users/${userId()}/inventory/#!/game-passes`}>
             User Gamepasses Reference
            </a>
           </span>
          </div>
          <hr />
          {/* The filters are only displayed if the user owns at least one gamepass */}
          {data()?.Data.Items.length != 0 && <FiltersComponent />}
         </div>
        </div>
       </div>
      </section>
      {/* Sets the width to 1/2 of the screen on extra large screens, and to full on smaller screens */}
      {/* This enables the two sections to be next to each other on extra large screens and wrapped on smaller screens */}
      <section class='w-full py-4 xl:w-1/2'>
       {/* Flexes the content in a row with a horizontal gap of 12px. Centers the content vertically since its a flex row. On large screen the the left margin to 32px. Set the width to the section's width */}
       <ul class='flex w-full flex-row flex-wrap justify-center gap-x-3 lg:ml-8'>
        <For
         /* DYNAMIC FOR LOOP: Iterates through the gamepasses data previously fetched on signal value change this is automatically handled by solidjs the framework im using for this */
         /* This filters the items based on the active filters signal change */
         each={data()?.Data.Items.filter(item => {
          /* This array collects the booleans for each filter "range" and condition */
          const conditions: boolean[] = [];
          // Iterates through the active filters, if the filter is active the result of its "fn" function(boolean) will be pushed to the conditions array. If its not active then just push "true" since its not enabled
          for (const [key, value] of Object.entries(activeFilters())) {
           console.log(key, value);
           activeFilters()[key] ? conditions.push(filters.find(filter => filter.name == key)?.fn(item) as boolean) : conditions.push(true);
          }
          /* This checks if the item meets all active filters requirements and if even one is false it will not be displayed */
          /* The .every checks if every element in the array is true */
          return conditions.every(Boolean);
         })}
        >
         {({ Item, Product, Thumbnail, Creator }, i) => (
          <li class='card h-[240px] w-[126px]'>
           <div class='card-thumb-container size-[126px] w-full rounded-lg bg-[var(--bg-tertiary)]'>
            <a href={Item.AbsoluteUrl} aria-label='Go to Item' rel='noopener noreferrer' class='text-link'>
             {/* Display the gamepass thumbnail, with a width of 150px(the replaceAll() is to change the thumbnail size to 150px to fit the card size)) */}
             {/* Center the image horizontally using margin, round the corners by 8px */}
             <img src={Thumbnail.Url.replaceAll('110', '150')} alt='Item Thumbnail' width={150} height={150} class='card-thumb-image mx-auto rounded-lg transition-all ' />
            </a>
           </div>
           <div>
            {/* Flexes the content in a column with a vertical gap of 8px */}
            <div class='card-info flex flex-col py-2'>
             {/* Set the max height to 46px and clip the overflown content, display the gamepass name with an href to the gamepass */}
             <div class='card-info-name  max-h-[46px] break-before-column overflow-hidden text-ellipsis font-bold' title={Item.Name}>
              <a href={Item.AbsoluteUrl} aria-label='Go to Item' rel='noopener noreferrer'>
               {Item.Name}
              </a>
             </div>
             {/* Set the width to full of the gamepass card and the text to extra small */}
             {/* The card-info-price class is used to change font color, as of the data-bind attrs */}
             <div class='card-info-label w-full text-xs'>
              {/* Link to the gamepass creator's profile */}
              <span data-bind='item.Label.OwnershipPreposition'>By:</span>
              <a href={Creator.CreatorProfileLink} aria-label='Go to Creator' rel='noopener noreferrer' class='text-link w-min'>
               {Creator.Name}
              </a>
             </div>
             {/* The price of the item, if its not for sale it displays "Not for sale" elseif its for sale it displays the price and the robux icon */}
             {/* The card-info-price class is used to change font color, as of the data-bind attrs */}
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
       {/* UNUSED
       <div class='page-selector'>
        <div class='page-switch'></div>
        <div class='page-switch'></div>
        <div class='page-switch'></div>
        <div class='page-switch'></div>
       </div> */}
      </section>
     </Match>
     {/* If the data has done loading, and it's not valid then it displays this. Likely if the user's inventory is private */}
     <Match when={!data.loading && !data()?.IsValid}>
      {/* Set text padding to 8px */}
      <p class='p-2'>No data</p>
     </Match>
    </Switch>
   </main>
  </>
 );
}
