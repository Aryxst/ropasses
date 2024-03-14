import { useNavigate } from '@solidjs/router';
import numericInput from '../hooks/numeric-input';

export default function Navbar() {
 const navigate = useNavigate();

 return (
  <nav class='sticky top-0 flex h-[42px] items-center justify-between border-b-[1px] border-b-[var(--bg-border-secondary)] bg-[var(--bg-secondary)] p-4 text-white'>
   <h1 class='cursor-pointer text-2xl font-bold'>
    <a href={import.meta.env.BASE_URL}>
     <img src='favicon.ico' class='h-8 w-8' />
    </a>
   </h1>
   <ul class='flex w-full flex-row gap-4 md:gap-8'>
    <li class='ml-auto mr-auto max-sm:pl-2'>
     <input
      type='text'
      placeholder='Go to User ID'
      class='!pl-5 max-sm:w-60'
      onInput={e => {
       numericInput(e);
      }}
      onKeyPress={e => e.key === 'Enter' && navigate('/user?id=' + e.currentTarget.value, { replace: true })}
     />
     <div class='absolute bottom-[10px] left-auto right-auto size-[20px] pl-[2px]'>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' height='18' width='18' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
       <circle cx='11' cy='11' r='8' />
       <path d='m21 21-4.3-4.3' />
      </svg>
     </div>
    </li>
    <li class='group flex size-[32px] items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-tertiary)]'>
     <a href='https://github.com/aryxst/ropasses' target='_blank' rel='noopener noreferrer prefetch'>
      <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='group-hover:animate-pulse'>
       <path d='M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4' />
       <path d='M9 18c-4.51 2-5-2-7-2' />
      </svg>
     </a>
    </li>
   </ul>
   <button class='md:hidden' aria-label='Toggle Navigation'></button>
  </nav>
 );
}
