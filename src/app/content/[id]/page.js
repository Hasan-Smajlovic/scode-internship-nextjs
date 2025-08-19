import PropTypes from 'prop-types'

import AddContentPage from '@/components/templates/addContent/index'

export default async function ContentPage (props) {
  const test = await props.params
  console.log(test)
  return (
    <main className='bg-white min-h-screen'>
      Hello Content page
      <AddContentPage />
    </main>
  )
}

ContentPage.propTypes = {
  params: PropTypes.object.isRequired
}
