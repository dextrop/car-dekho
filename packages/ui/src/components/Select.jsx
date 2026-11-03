/** options: string[] or [{ value, label }]. placeholder renders as the empty option. */
export function Select({ value, onChange, options, placeholder, ...rest }) {
  return (
    <select className="ui-select" value={value} onChange={e => onChange(e.target.value)} {...rest}>
      {placeholder != null && <option value="">{placeholder}</option>}
      {options.map(o => {
        const opt = typeof o === 'string' ? { value: o, label: o } : o;
        return <option key={opt.value} value={opt.value}>{opt.label}</option>;
      })}
    </select>
  );
}
