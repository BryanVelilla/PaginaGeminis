const sequences = [
  '01100011 01101111 01100100 01100101',
  'encrypt / observe / respond',
  '7FA4 3C11 A9DE 08B4',
  'kernel :: geminis',
  '01000111 01000101 01001101',
  'trust is an active practice',
]

export function CipherField() {
  return (
    <div className="cipher-field" aria-hidden="true">
      <div className="cipher-scanline" />
      <div className="cipher-frame">
        <span className="frame-corner corner-a" />
        <span className="frame-corner corner-b" />
        <span className="frame-corner corner-c" />
        <span className="frame-corner corner-d" />
        <div className="cipher-orb"><span>G</span></div>
        <div className="cipher-rings"><i /><i /><i /></div>
        <div className="cipher-lines">
          {sequences.map((sequence, index) => <span key={sequence} style={{ '--line': index } as React.CSSProperties}>{sequence}</span>)}
        </div>
      </div>
    </div>
  )
}
