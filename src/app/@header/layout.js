export default async function Header () {
  return (
    <header className='shadow-md *:tracking-wide z-100 sticky left-0 top-0 bg-indigo-300 text-secondary-900'>
      <div className='w-full'>
        <div className='container! mx-auto flex flex-1 h-[110]'>
          <div className='flex justify-content-between cursor-pointer items-center'>
            {/* <HeaderLogo /> */}
            Header Content
          </div>
        </div>
      </div>
    </header>
  )
}
