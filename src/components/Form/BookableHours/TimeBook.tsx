import Select from '../Select/Select'
import Icon from '../../UI/Icon/Icon'
import {
  formatTime,
  getTimeArray,
  timeToDecimal,
} from '../../../utilities/dates'

interface TimeProps {
  value?: string
  onChange?: any
  min?: number | string
  max?: number | string
  increment?: number | string
  readOnly?: boolean | string
  disabled?: boolean
  first?: boolean
}

function TimeBook({
  value,
  onChange,
  min = '00:00',
  max = '23:00',
  readOnly,
  increment = 15,
  disabled = false,
  first = false
}: TimeProps) {
  value = String(value)
    .replace(/([0-9]+:[0-9]+)(:[0-9]+)?.*/, '$1')
    .trim()

  if (readOnly) {
    return <>{value !== '' && formatTime(value)}</>
  }

  const data = getTimeArray(
    timeToDecimal(min),
    timeToDecimal(max),
    increment,
  ).map((time: any) => ({
    label: formatTime(time),
    value: time,
  }))

  return (
    <div style={{maxWidth: '140px',float:'right', borderColor: '#F1F1F1',borderWidth: 1,borderStyle: 'solid', borderRadius:4}}>
      <div style={{fontSize : '10px', paddingLeft:'12px', paddingTop:'5px'}}>{first ? "Opening Time" : "Closing Time"}</div>
      <Select
        value={String(value).replace('24:', '00:')}
        onChange={onChange}
        data={data}
        icon={null}
        style={{ maxWidth: 140 }}
        disabled={disabled}
        borderable = {false}
      />
    </div>

  )
}

export default TimeBook
