import { Flex, Title, Text, Badge, Table, Group, Space } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import React, { useState, lazy } from 'react'
import Button from 'src/components/Form/Button/Button'
import styles from './VenueDetails.module.css'
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import Map from 'src/components/UI/Map/Map'
import BackButton from 'src/components/UI/BackButton/BackButton'
import { useQuery } from 'react-query'
import useAPI from 'src/hooks/useAPI'
import { useParams } from 'react-router-dom'
import Modal from '../../UI/Modal/Modal'
import LoaderContent from '../../UI/LoaderContent/LoaderContent'
import BookingTime from './BookingTime'

const Carousel = lazy(() => import('../../UI/Carousel/Carousel'))

const Icon = ({ exists }: { exists: boolean }) => {
  if (exists) {
    return <CheckCircleOutlineIcon color="success" style={{ color: 'green' }} />
  } else {
    return <RemoveCircleOutlineIcon color="error" style={{ color: 'red' }} />
  }
}

function Location({ asset }: any) {
  const [showModal, setShowModal] = useState(false)

  return (
    <Group>
      {showModal && (
        <Modal opened onClose={() => setShowModal(!showModal)}>
          <Map
            interactive
            address={`${asset?.address}, ${asset?.suburb} ${asset?.state}`}
            width={700}
            height={400}
          />
        </Modal>
      )}
      <span
        className={styles.location}
        onClick={() => setShowModal(!showModal)}
      >
        <LocationOnOutlined className={styles.locationIcon} />
        <span>{asset?.address}, {asset?.suburb} {asset?.state}</span>
      </span>
    </Group>
  )
}

const VenueDetails = () => {

  const [modalShow, setModalShow] = useState(false)
  const [initialSlide, setInitialSlide] = useState(0)
  const [carouselImages, setCarouselImages] = useState<any>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const { get, post } = useAPI()
  const { asset_id } = useParams()

  const { data: asset, isLoading } = useQuery(
    ['booking-details'],
    async () => await get({ endpoint: `asset/${asset_id}` })
  )

  if (isLoading) {
    return <LoaderContent />
  }

  if (!asset) {
    return <>
      <BackButton />
    </>
  }

  let tb_header: any = []
  tb_header.push("Room");
  tb_header.push("Capacity");
  var childrenRoom: any = []

  if (typeof asset.equipments?.map !== 'undefined') {
    asset.equipments?.map((item: any) => {
      tb_header.push(item.name);
    })

    if (typeof asset.childrens?.map !== 'undefined') {
      asset.childrens?.map((children: any) => {
        var res: any = {};
        res["name"] = children["name"];
        res["capacity"] = children["capacity"];
        asset.equipments?.forEach((parentItem: any) => {
          res[parentItem.id] = false;
          if (typeof children.equipments?.find !== 'undefined') {
            const equipment = children.equipments?.find((item: any) => { return item.id === parentItem.id })
            if (equipment)
              res[parentItem.id] = equipment.value === "Yes";
          }
        })
        childrenRoom.push(res);
      })
    }
  }

  //bookable hours
  var bookableHours: any =  []
  if (typeof asset.bookable_hours?.map !== 'undefined') {
    asset.bookable_hours?.map((item : any) => {
      var res: any = {};
      res["name"] = asset["name"];
      res["value"] = item.value;
      res["type"] = item.type;
      res["start"] = item.start;
      res["end"] = item.end;
      // console.log("res", res)
      bookableHours.push(res)
    })
  }

  if (typeof asset.childrens?.map !== 'undefined') {
    asset.childrens?.map((children: any) => {
      //add bookable hours
      if (typeof children.bookable_hours?.map !== 'undefined') {
        children.bookable_hours?.map((item : any) => {
          var res: any = {};
          res["name"] = children["name"];
          res["value"] = item.value;
          res["type"] = item.type;
          res["start"] = item.start;
          res["end"] = item.end;
          bookableHours.push(res)
        })
      }
    })
  }

  const room_rows = childrenRoom.map((item: any) => (
    <tr className={styles.venue_detail_table} key={item.name}>
      <td className={styles.name_column}> {item.name} </td>
      <td className={styles.text_center}> {item.capacity} </td>
      {Object.keys(item).map((key: string) => (
        (key != 'name') && (key != 'capacity') && (
          <td className={styles.text_center}> <Icon exists={item[key]} />  </td>
        )
      ))}
    </tr>
  ))
  //asset-booking
  const galleries = (asset.gallery) ? asset.gallery : null;
  const defaultGallery = () => {
    if (galleries) return (galleries.map((gallery: any, index: any) => (
      <div className={styles.gridItem1}>
        <img src={gallery ? gallery.value : ""} />{' '}
      </div>
    )))
  }

  const displayLimitGallery = () => {
    if (!galleries) return;

    if (galleries.length < 4) return defaultGallery();
    else {
      return (
        galleries.slice(0, 4).map((gallery: any, index: any) => (
          <div className={styles.gridItem1}>
            <img src={gallery ? gallery.value : ""} />{' '}
            {index == 3 ? <Button className={styles.detailButton} text={"Show All"} onClick={() => {
              setCarouselImages(galleries)
              setModalShow(!modalShow)
            }} /> : null}
          </div>
        ))
      )
    }
  }

  const RoomTableHeader = () => {
    if (tb_header.length < 1) return "";
    else {
      return tb_header.map((header: any, index: any) => {
        return (index === 0 ? <th style={{ width: '25%' }} className={styles.name_column}>{header ? header : ""}</th>
          : <th style={{ width: `${75 / (tb_header.length - 1)}%` }} className={styles.text_center}>{header ? header : ""}</th>)
      })
    }
  }

  const renderDay = (date) => {
    const dayOfMonth = date.getDate();
    const firstDotColor = dayOfMonth % 2 === 0 ? 'red' : 'blue';
    const secondDotColor = dayOfMonth % 3 === 0 ? 'green' : 'yellow';

    return (
      <div style={{ position: 'relative' }}>
        <span>{dayOfMonth}</span>
        <div 
          style={{
            position: 'absolute',
            bottom: '-10%',
            left: '15%',
            // transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            backgroundColor: firstDotColor,
            
          }}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: '-10%',
            left:'55%',
            // transform: 'translate(-40%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            backgroundColor: secondDotColor,
            
          }}
        />
      </div>
    );
  };

  return (
    <>
      <BackButton />
      <Space h="md" />
      <Flex direction={'column'} className={styles.container}>
        <Flex>
          <Flex className={styles.flex1} direction="column">
            <Flex align="center" gap="md">
              <Title order={2} pb="xs">
                {asset.name}
              </Title>
              {asset.bookable === "Yes" ? (<Badge color="green">Available</Badge>) : null}

            </Flex>

            <Text color="#19407E" style={{ cursor: 'pointer' }}>
              <Location asset={asset} />
            </Text>
          </Flex>
          <Flex align="center" style={{ display: 'none' }}>
            <Button text="Book it for now" />
          </Flex>
        </Flex>
        <Flex pt="lg" gap={'lg'} direction={'column'}>
          <div className={styles.grid}>
            {asset.photo ? <div className={styles.gridItem}>
              <img src={asset.photo?.value ?? asset.photo} style={{ cursor: 'pointer' }} onClick={() => {
                setCarouselImages([asset.photo?.value ?? asset.photo])
                setModalShow(true)
              }} />
            </div> : null}
            {displayLimitGallery()}
          </div>
          <Modal
            zIndex={1060}
            size="90%"
            show={modalShow}
            onClose={() => setModalShow(false)} >
            {modalShow && <Carousel initialSlide={initialSlide} images={carouselImages} />}
          </Modal>
        </Flex>
        <Flex pt="lg" gap={'lg'}>
          <Flex direction={'column'} className={styles.flex3} style={{ marginRight: '8rem' }}>
            <Flex gap={'lg'}>
              <Flex direction={'column'}>
                <Title order={2}>Description</Title>
                <Text fz="sm">
                  {(asset.description) ? asset.description : ""}
                </Text>
              </Flex>
            </Flex>
            <Flex pt="lg">
              <Flex direction={'column'} className={styles.flex3}>
                <Title order={2}>List of assets available</Title>
                <Flex pt={'lg'} className={styles.flex1}>
                  <Table className={styles.table}>
                    <thead>
                      <tr className={styles.venue_detail_table}>
                        {RoomTableHeader()}
                      </tr>
                    </thead>
                    <tbody>{room_rows}</tbody>
                  </Table>
                </Flex>
              </Flex>
            </Flex>
            <Flex pt="lg">
              <Flex direction={'column'} className={styles.flex3}>
                <Title order={2}>Map</Title>
                <Flex pt="lg">
                  <Map
                    interactive
                    address={`${asset?.address}, ${asset?.suburb} ${asset?.state}`}
                    height={600}
                  />
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <Flex className={styles.flex1}>
            <Flex className={styles.flex1} direction={'column'}>
              <Flex>
                <Title order={2}>Calendar</Title>
              </Flex>
              <Flex pt="lg">
                <Group position="center">
                  {/* <DatePicker  renderDay={renderDay}/>/> */}
                  <DatePicker value={selectedDate} onChange={setSelectedDate}/>
                </Group>
              </Flex>

              {/* Bookable hours */}
              {bookableHours ?
                <BookingTime date={selectedDate} bookingHours={bookableHours} />
                :
                null
              }
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export default VenueDetails
