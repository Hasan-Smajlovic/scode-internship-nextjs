'use client'

import PropTypes from 'prop-types'
import SearchBooks from '@/components/templates/SearchBooks/index'

export default function AddedContentPage ({ searchResults, initialSearchParams, alwaysShow = true }) {
  return (
    <main className='bg-white min-h-screen p-4'>
      <SearchBooks
        items={searchResults?.items || []}
        totalCount={searchResults?.totalCount || 0}
        facets={searchResults?.facets || {}}
        initialSearchParams={initialSearchParams}
        alwaysShow={alwaysShow}
      />
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
