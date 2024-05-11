import { A, useNavigate } from '@solidjs/router';
import { Icon } from '@iconify-icon/solid';
export default function Navbar() {
 const navigate = useNavigate();

 return (
  <nav class='sticky flex items-center justify-between border-b-[1px] border-b-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1'>
   <div class='relative'>
    <Icon icon='lucide:search' class='top absolute left-[5.33px] top-[6px]' width={20} /> <input type='number' placeholder='Go to User ID' class='h-8 w-80 rounded-lg border border-neutral-200 border-opacity-20 bg-neutral-950 pl-8 text-lg placeholder-neutral-500' onKeyPress={e => e.key === 'Enter' && navigate('/user?id=' + e.currentTarget.value, { replace: true })} />
   </div>
  </nav>
 );
}
