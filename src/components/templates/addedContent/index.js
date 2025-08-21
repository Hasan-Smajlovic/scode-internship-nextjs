'use client'

import PropTypes from 'prop-types'
import SearchBooks from '@/components/templates/SearchBooks/index'

export default function AddedContentPage ({ searchResults, initialSearchParams, alwaysShow = true }) {
  return (
    <main className=' py-8 px-4'>
      <div className='max-w-7xl mx-auto'>
        <div className=' overflow-hidden bo'>
          <SearchBooks
            items={searchResults?.items || []}
            totalCount={searchResults?.totalCount || 0}
            facets={searchResults?.facets || {}}
            initialSearchParams={initialSearchParams}
            alwaysShow={alwaysShow}
            isContentPage
          />
        </div>
      </div>
    </main>
  )
}

AddedContentPage.propTypes = {
  searchResults: PropTypes.shape({
    items      : PropTypes.array,
    totalCount : PropTypes.number,
    facets     : PropTypes.object
  }).isRequired,
  initialSearchParams: PropTypes.shape({
    filters : PropTypes.object,
    sort    : PropTypes.string
  }).isRequired,
  alwaysShow: PropTypes.bool
}
