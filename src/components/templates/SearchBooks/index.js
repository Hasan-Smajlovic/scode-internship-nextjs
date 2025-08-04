'use client'
import { useSearchParams, useRouter } from 'next/navigation'

import Filter from '@/components/templates/SearchBooks/Filter'
import Sort from './Sort'
import Items from './Items'

export default function SearchBooks () {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('query') || ''

  return (
    <div className='flex flex-col md:flex-row gap-6 p-4'>
      <aside className='w-full md:w-1/3 lg:w-1/4  '>
        <div className='w-full h-full p-4 flex flex-col gap-4 bg-white rounded-lg border-r border-b border-gray-200'>
          <Filter
            value={query}
            onChange={value => router.push(`/searchbook?query=${value}`)}
            placeholder='Filter results...'
          />
          <Sort
            value={query}
            onChange={value => router.push(`/searchbook?query=${value}`)}
            options={[
              { value: 'title', label: 'Title' },
              { value: 'author', label: 'Author' }
            ]}
          />
        </div>
      </aside>

      <main className='w-full md:w-2/3 lg:w-3/4'>
        <Items />
      </main>
    </div>
  )
}
