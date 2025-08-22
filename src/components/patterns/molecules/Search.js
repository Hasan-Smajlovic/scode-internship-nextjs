import PropTypes from 'prop-types'
import { FaSearch } from 'react-icons/fa'

import SearchInput from '../atoms/SearchInput'
import Icon from '../atoms/Icon'

const handleSearch = (value, onChange) => {
  onChange(value.trim())
}

export default function Search ({ value, onChange, placeholder = 'Search...', icon = null }) {
  return (
    <div className='relative w-full'>
      <SearchInput
        type='text'
        value={value}
        placeholder={placeholder}
        onChange={event => handleSearch(event.target.value, onChange)}
        icon={
          icon || (
            <Icon>
              <FaSearch className='text-gray-400' />
            </Icon>
          )
        }
      />
    </div>
  )
}

Search.propTypes = {
  value       : PropTypes.string.isRequired,
  onChange    : PropTypes.func.isRequired,
  placeholder : PropTypes.string,
  icon        : PropTypes.element
}
