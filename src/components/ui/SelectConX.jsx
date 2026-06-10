export default function SelectConX({ value, onChange, children, className = '', size = '' }) {
  const cls = ['form-select', size ? `form-select-${size}` : '', className].filter(Boolean).join(' ')
  return (
    <div style={{ position: 'relative' }}>
      <select
        className={cls}
        value={value}
        onChange={onChange}
        style={value ? { backgroundImage: 'none' } : {}}
      >
        {children}
      </select>
      {value && (
        <span
          onClick={() => onChange({ target: { value: '' } })}
          style={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 900,
            color: 'var(--color-muted)',
            zIndex: 5,
            userSelect: 'none',
            lineHeight: 1,
          }}
        >✕</span>
      )}
    </div>
  )
}
