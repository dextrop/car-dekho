export function Checkbox({ checked, onChange, label, ...rest }) {
  return <input type="checkbox" className="ui-chk" checked={!!checked} onChange={e => onChange(e.target.checked)} aria-label={label} {...rest} />;
}
