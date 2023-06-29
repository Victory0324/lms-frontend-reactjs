import { Flex, Title, Text } from '@mantine/core'
import React from 'react'
import CircleIcon from '@mui/icons-material/Circle'
import { getDaysInWeek, formatDate, getDayOfWeek, formatTime } from '../../../utilities/dates'

interface BookingHours {
  type: string;
  value: string;
  start: string;
  end: string;
  name: string;
}

interface IBookingTime {
  date?: any
  bookingHours?: BookingHours[]
}

const circleIconColor = ["#24B0C9", "#2E53DA", "#E9424D"]
function BookingTime({ date, bookingHours }: IBookingTime) {
  const daysArray = getDaysInWeek(date);
  console.log("bookinghours : ", bookingHours)
  const Bookable_hours_rows = daysArray.map((item: any, index: number) => {
    console.log(getDayOfWeek(item))
    const template: BookingHours[] | undefined =
      bookingHours?.filter(
        (a: any) => a.type === getDayOfWeek(item) && a.value === 'Yes'
      )
    if (template !== undefined) {
      const bookItems = template?.map((a: any, index : number) => {
        // const randomNumber = (Math.floor(Math.random() * (10000)) + index) % 3
        
        return (
          <Flex direction={'column'}>
            <Flex gap="sm" pt="lg">
              <CircleIcon fontSize="inherit" style={{ color: circleIconColor[index] }} />
              <Text>{formatTime(a.start)} – {formatTime(a.end)}</Text>
            </Flex>
            <Flex pl="xl" pt={'xs'}>
              <Text size="sm">
                Open - Bookable
              </Text>
            </Flex>
          </Flex>
        )
      })

      if(template?.length){
        return (
          <Flex direction={'column'} pb={'lg'}>
            <Title order={6} color={index === 0 ? '#2E53DA' : '#1A1C1EB4'}>
              {index === 0 ? 'TODAY' : index === 1 ? 'TOMORROW' : getDayOfWeek(item).toUpperCase()} <span style={{ paddingLeft: '5px' }}>{formatDate(item, 'MM/DD/YYYY')}</span>
            </Title>
            {bookItems}
          </Flex>
        )    
      }
    } else {
      console.log('No matching booking hours found.');
    }
  })

  return (
    <Flex pt="lg" direction={'column'}>
      {Bookable_hours_rows}
    </Flex>
  )
}

export default BookingTime
