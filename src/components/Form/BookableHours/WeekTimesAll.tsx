import React, { useCallback } from 'react'
import Button from '../Button/Button'
import TimeBook from './TimeBook'
import Switch from 'src/components/UI/Switch/Switch'

interface BookingHours {
  type: string;
  value: string;
  start: string;
  end: string
}

function WeekTimesAll({ onChange, value, readOnly }: any) {
  console.log("value", value)

  const defaultHandler = useCallback(() => {
    onChange({
      value: [
        { value: "No", type: 'Monday', start: '06:00', end: '22:30' },
        { value: "No", type: 'Tuesday', start: '06:00', end: '22:30' },
        { value: "No", type: 'Wednesday', start: '06:00', end: '22:30' },
        { value: "No", type: 'Thursday', start: '06:00', end: '22:30' },
        { value: "No", type: 'Friday', start: '06:00', end: '22:30' },
        { value: "No", type: 'Saturday', start: '08:00', end: '21:30' },
        { value: "No", type: 'Sunday', start: '08:00', end: '21:30' },
        { value: "No", type: 'Open 24/7?' },
      ],
    })
  }, [])

  const changeHandler = ({ field, value: changedValue, index }: any) => {
    const formatted = [
      ...value.map((item: any, idx: number) =>
        idx === index ? { ...item, [field]: changedValue } : item,
      ),
    ]
    if (onChange) {
      onChange({ value: formatted })
    }
  }
  const switchchangeHandler = (newValue: any, name: string, index: number) => {

    const newValues = value.map((item: any, idx: number) =>
      index === idx || index === 7 ? { ...item, [name]: newValue } : item,
    )
    onChange({
      value: newValues,
    })
  }
  if (typeof value.map == 'undefined')
    defaultHandler()

  const resetBookableHours = () => {
    const newValues: BookingHours[] | undefined = value.map((item: BookingHours, idx: number) =>
      idx < 5 ? { ...item, ["start"]: "06:00", ["end"]: "22:30" } : idx !== 7 ? { ...item, ["start"]: "08:00", ["end"]: "21:30" } : item
    )
    if (newValues !== undefined) {
      onChange({
        value: newValues,
      })
    }
  }
  return (
    <div style={{ marginTop: '10px' }}>
      <table style={{ width: '100%' }}>
        <tbody>
          {typeof value.map !== 'undefined' &&
            value?.map((item: any, index: number) => {
              if (item.type == "Open 24/7?") {
                return (<></>)
              }
              else
                return (
                  <tr key={item.type} style={{ height: '80px' }}>
                    <td style={{ width: '10%' }}>
                      <Switch
                        value={item.value}
                        onChange={({ value }: any) =>
                          switchchangeHandler(value, 'value', index)
                        }
                      />
                    </td>
                    <td style={{ width: '20%', paddingLeft: '15px' }}>
                      {item.type}
                    </td>
                    <td>
                      <TimeBook
                        value={item.start}
                        onChange={({ value }: any) =>
                          changeHandler({ field: 'start', index, value })
                        }
                        first={true}
                      />
                    </td>
                    <td>
                      <TimeBook
                        value={item.end}
                        onChange={({ value }: any) =>
                          changeHandler({ field: 'end', index, value })
                        }
                      />
                    </td>
                  </tr>
                )
            })}
        </tbody>
      </table>
      <table style={{ width: '100%' }}>
        <tbody>
          {typeof value.map !== 'undefined' &&
            value?.map((item: any, index: number) => {
              if (item.type == "Open 24/7?") {
                return (
                  <tr key={item.type}>
                    <td style={{ width: '30%' }}>{item.type}</td>
                    <td style={{ width: '30%' }}>
                      <Switch
                        value={item.value}
                        onChange={({ value }: any) =>
                          switchchangeHandler(value, 'value', index)
                        }
                      /></td>
                  </tr>
                )
              }
            }
            )}
        </tbody>
      </table>

      <div style={{ marginTop: '4px' }}>
        <Button
          text="Set Public Holidays"
          icon="clock"
          style={{ marginRight: '0.8rem' }}
        />
        {!readOnly && (
          <Button
            onClick={resetBookableHours}
            text="Reset bookable hours"
            icon="clock"
          />
        )}
      </div>
    </div>
  )
}

export default WeekTimesAll
