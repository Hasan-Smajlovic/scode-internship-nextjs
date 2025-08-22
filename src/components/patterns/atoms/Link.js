import NextLink from 'next/link'
import PropTypes from 'prop-types'

export default function Link ({ href, children, className, ...props }) {
  if (!href) {
    throw new Error('The \'href\' prop is required for Link component.')
  }

  return (
    <div className='flex flex-col'>
      <NextLink
        href={href}
        {...props}
        className={className}
      >
        {children}
      </NextLink>
    </div>
  )
}

Link.propTypes = {
  href      : PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  children  : PropTypes.node.isRequired,
  className : PropTypes.string
}
