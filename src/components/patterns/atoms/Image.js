import PropTypes from 'prop-types'
import NextImage from 'next/image'

import Link from './Link'

export default function Image ({ src, alt, title, href, width, height, className = '' }) {
  if (!src || typeof src !== 'string') {
    console.error('Invalid image source:', src)
    return null
  }

  const imageElement = (
    <NextImage
      src={src.startsWith('/') ? src : `/${src}`}
      alt={alt || 'image'}
      title={title || 'image'}
      width={width || 20}
      height={height || 20}
      className={className}
    />
  )

  if (href) {
    return <Link href={href}>{imageElement}</Link>
  }

  return imageElement
}

Image.propTypes = {
  src       : PropTypes.string.isRequired,
  alt       : PropTypes.string,
  title     : PropTypes.string,
  href      : PropTypes.string,
  className : PropTypes.string,
  width     : PropTypes.number,
  height    : PropTypes.number
}
