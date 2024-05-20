import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Spinner,
  Button,
} from "@material-tailwind/react";
import { axiosInstance } from "@/Axios/AxiosInstance";
import { BASEURL, SOCKET } from "@/Axios/BaseUrl";
import Example from "./date";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import sound from "../../Sounds/notification.wav"
import { useNavigate } from "react-router-dom";

export function Notifications() {

  const access = localStorage.getItem('access')
  const nav = useNavigate()

  useEffect(() => {
    if (access === null){
      nav('/')
      toast.error('login first')
    }
  }, [])

  const [dates, setDate] = useState(null)
  const [data, setData] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [socket, setSocket] = useState('')
  

  const getdate = (date) => {
    console.log(date);
    
    const regex = /^([A-Za-z]{3}) ([A-Za-z]{3}) (\d{2}) (\d{4})/;

// Extract date components using regex
const match = regex.exec(date);

try {
  if (match) {
    const [, , monthStr, day, year] = match;
  
    // Convert month abbreviation to month number
    const months = {
      "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6,
      "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12
    };
    const month = months[monthStr];
  
    // Format the date components
    const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day}`;
    console.log(formattedDate);
    setDate(prevDate => formattedDate);
  } else {
    console.log("Date string does not match the expected format.");
  }
} catch (error) {
  console.log(error);
}
  }

  useEffect(() => {
      getAppo()
  }, [dates]);

  const getAppo = async() => {

    try {
      setIsLoading(true)
      const respo = await axiosInstance.get(`${BASEURL}/book/get/${dates}`)
      setData(respo.data)
    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false)
    }
  }
  

  useEffect(() => {
    
    getSocket()
  
    return () => {
      if(socket){
        socket.close()
      }
    }
  }, [])

  const getSocket = () =>{
    let newSocket = null

    newSocket = new WebSocket(`${SOCKET}/ws/book/`)
    setSocket(newSocket)
    newSocket.onopen = () => {
      console.log('Websocket connected');
      
    }
    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    newSocket.onclose = () => {
      console.log("WebSocket closed");
      // getSocket()
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data) {
        toast('Appointment alert',
          {
            icon: '🔔',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          }
        );
        const not = new Audio(sound)
        not.play()
        console.log(data);
        setData((prevData)=> [...prevData, data.booking_details])
      }
    }
  }

  
  

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex flex-row justify-between">

          <Typography variant="h6" color="white">
            Apointments
          </Typography>
          <div className=" flex flex-row gap-3">
          <Button onClick={()=>setDate(null)}>All</Button>
          <Example getdate={getdate}/>
          </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Customer", "Contact", "date", "Time"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
            {isLoading && <div className="flex  justify-center items-center w-screen"><Spinner color="amber" /></div>}

              {data ? data.slice().reverse().map(
                ({ customer_name, Name, Phone, date, time}, key) => {
                  const className = `py-3 px-5 border-b border-blue-gray-50`
                  

                  return (
                    <tr key={key}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {Name}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {customer_name}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {Phone}
                        </Typography>
                        
                      </td>
                      
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {date}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography
                          as="a"
                          className="text-xs font-semibold text-blue-gray-600"
                        >
                          {time}
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              ):"No Booking"}
            </tbody>
          </table>
        </CardBody>
      </Card>
      {/* <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Projects Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["companies", "members", "budget", "completion", ""].map(
                  (el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {projectsTableData.map(
                ({ img, name, members, budget, completion }, key) => {
                  const className = `py-3 px-5 ${
                    key === projectsTableData.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={name}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar src={img} alt={name} size="sm" />
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            {name}
                          </Typography>
                        </div>
                      </td>
                      <td className={className}>
                        {members.map(({ img, name }, key) => (
                          <Tooltip key={name} content={name}>
                            <Avatar
                              src={img}
                              alt={name}
                              size="xs"
                              variant="circular"
                              className={`cursor-pointer border-2 border-white ${
                                key === 0 ? "" : "-ml-2.5"
                              }`}
                            />
                          </Tooltip>
                        ))}
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          className="text-xs font-medium text-blue-gray-600"
                        >
                          {budget}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="w-10/12">
                          <Typography
                            variant="small"
                            className="mb-1 block text-xs font-medium text-blue-gray-600"
                          >
                            {completion}%
                          </Typography>
                          <Progress
                            value={completion}
                            variant="gradient"
                            color={completion === 100 ? "green" : "gray"}
                            className="h-1"
                          />
                        </div>
                      </td>
                      <td className={className}>
                        <Typography
                          as="a"
                          href="#"
                          className="text-xs font-semibold text-blue-gray-600"
                        >
                          <EllipsisVerticalIcon
                            strokeWidth={2}
                            className="h-5 w-5 text-inherit"
                          />
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card> */}
    </div>
  );
}

export default Notifications;
