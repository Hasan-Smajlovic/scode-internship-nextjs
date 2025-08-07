import PropTypes from 'prop-types'
import SearchInput from '../atoms/SearchInput'
import Icon from '../atoms/Icon'
import { FaSearch } from 'react-icons/fa'

const handleSearch = (value, onChange) => {
  onChange(value.trim())
}

export default function Search ({ value, onChange, placeholder = 'Search...', icon = null }) {
  return (
    <SearchInput
      type='text'
      value={value}
      placeholder={placeholder}
      onChange={event => handleSearch(event.target.value, onChange)}
      className='w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl'
      icon={
        icon || (
          <Icon>
            <FaSearch className='text-gray-400' />
          </Icon>
        )
      }
    />
  )
}

Search.propTypes = {
  value       : PropTypes.string.isRequired,
  onChange    : PropTypes.func.isRequired,
  placeholder : PropTypes.string,
  icon        : PropTypes.element
}
