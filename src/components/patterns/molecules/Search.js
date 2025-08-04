import PropTypes from 'prop-types'

import Input from '../atoms/SearchInput'
import Icon from '../atoms/Icon'
import { FaSearch } from 'react-icons/fa'

export default function Search ({ value, onChange, placeholder = 'Search...', icon = null }) {
  return (
    <Input
      type='text'
      value={value}
      className='w-full max-w-md'
      onChange={event => onChange(event.target.value)}
      placeholder={placeholder}
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
