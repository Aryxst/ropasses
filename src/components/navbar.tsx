export default function Navbar() {
  return (
    <nav class="sticky top-0 flex h-[42px] items-center justify-between border-b-[1px] border-b-[var(--bg-border-secondary)] bg-[var(--bg-secondary)] p-4 text-white">
      <h1 class="cursor-pointer text-2xl font-bold">
        <a href="/">RoPasses</a>
      </h1>
      <ul
        class="
         flex flex-col items-center gap-4 md:flex-row md:gap-8"
      >
        <li>
          <a
            href="https://github.com/aryxst/ropasses"
            class="rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors font-bold p-2"
            target="_blank"
            rel="noopener noreferrer prefetch"
          >
            Source Code
          </a>
        </li>
      </ul>
      <button class="md:hidden" aria-label="Toggle Navigation"></button>
    </nav>
  );
}
