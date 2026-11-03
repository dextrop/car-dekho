import { forwardRef } from 'react';

export const SearchInput = forwardRef(function SearchInput({ value, onChange, onEnter, placeholder, ...rest }, ref) {
  return (
    <div className="ui-search">
      <span className="ui-search-icon" aria-hidden="true">🔍</span>
      <input
        ref={ref}
        type="search"
        autoComplete="off"
        spellCheck={false}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && onEnter) onEnter(); }}
        {...rest}
      />
      {value && <button type="button" className="ui-search-clear" aria-label="Clear" onClick={() => onChange('')}>×</button>}
    </div>
  );
});
