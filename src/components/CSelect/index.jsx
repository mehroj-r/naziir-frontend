import Select from 'react-select';

export default function CSelect({ value, options, isClearable=true, ...props }) {
  return(
    <Select 
      value={value}
      options={options}
      isClearable={isClearable}
      {...props}
    />
  )
}