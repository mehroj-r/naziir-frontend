import Select from 'react-select';

export default function CSelect({ value, options, ...props }) {
  return(
    <Select 
      value={value}
      options={options}
      {...props}
    />
  )
}