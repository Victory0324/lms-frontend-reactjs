import React from 'react'

type IHeading = {
  text?: string
  children?: any
}

export function FormSection({ text, children }: IHeading) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div
        key={'heading'}
        style={{
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          marginBottom: 5,
          padding: 10,
          color: 'white',
          backgroundColor: 'var(--c-side, #2E53DA)',
          backgroundImage:
            'linear-gradient(60deg, rgba(0,0,0,.2), transparent)',
          backgroundAttachment: 'fixed',
        }}
      >
        {text}
      </div>
      {children}
    </div>
  )
}

export default FormSection
