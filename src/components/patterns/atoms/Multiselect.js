export default function Multiselect () {
  return (
    <div className='mb-4'>
      <label className='block text-sm font-medium text-gray-700 mb-1'>
        Select Options
      </label>
      <select multiple className='form-multiselect block w-full mt-1'>
        <option value='option1'>Option 1</option>
        <option value='option2'>Option 2</option>
        <option value='option3'>Option 3</option>
      </select>
    </div>
  )
}
