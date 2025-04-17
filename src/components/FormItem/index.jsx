export default function FormItem({ htmlFor, label='', children, ...props }) {
  return(
    <div>
      <label className="block" htmlFor={htmlFor} {...props}>
        {label}
      </label>
      {children}
    </div>
  )
}