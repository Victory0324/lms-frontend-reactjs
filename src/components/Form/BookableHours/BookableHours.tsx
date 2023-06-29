import React, { useState } from 'react'
import style from './BookableHours.module.css'
import Icon from '../../UI/Icon/Icon'
import WeekTimesAll from './WeekTimesAll'

type IBookableHours = {
  text?: string
  children?: any
  onChange?: any
  value?: any
}

export function BookableHours({ text, children, onChange, value }: IBookableHours) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div
        key={'heading'}
        style={{
          borderRadius: 4,
          // display: 'flex',
          alignItems: 'center',
          marginBottom: 5,
        }}
      >

        <button
          className={`${style.menu_item}${open ? ` ${style.open}` : ''}`}
          style={{
            color: 'white',
            backgroundColor: 'var(--c-side, #133288)',
            backgroundImage:
              'linear-gradient(60deg, rgba(0,0,0,.2), transparent)',
            backgroundAttachment: 'fixed',
            paddingTop: '6px',
            paddingBottom: '6px',
            borderRadius: 8
          }}
          onClick={() => setOpen(!open)}
        >
          <div>
            {text}
          </div>
          <Icon
            fontSize="20px"
            type="forward"
            compact
            style={{
              transition: 'transform .1s ease-in-out',
              transform: open ? 'rotate(-90deg)' : 'rotate(90deg)',
            }}
          />
        </button>
        {open && <div>
          <WeekTimesAll onChange={onChange}
            value={value}
            readOnly={false}
          />
        </div>}
      </div>
      {children}
    </div>
  )
}

export default BookableHours
