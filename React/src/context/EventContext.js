import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

export const EventContext = createContext()

export function EventProvider({children}) 
{   
    const nav = useNavigate()
    const [onchange, setonchange] = useState(false)
    const [events, setEvent] = useState()
     
    // Edit Event
    const editEvent = ( id, title, image, description, user_id ) =>{
      fetch(`https://eventsbrite.onrender.com/events/editevent/${id}`, {
          method: "PATCH",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({id, title:title,image:image, description:description, user_id:user_id })
      })
      .then((res)=>res.json())
      .then((response)=>{
          console.log(response)
          if(response.error)
          {
              Swal.fire(
                  'Error',
                  response.error,
                  'error'
                )
          }
          else if(response.success)
          { 
              nav("/")
              Swal.fire(
                  'Success',
                  response.success,
                  'success'
                )
                setonchange(!onchange)
          }
          else{
              Swal.fire(
                  'Error',
                  "Something went wrong",
                  'error'
                )
          }
  
      })
  }



    // Add Event
    const AddEvent = (title, image, description, user_id ) =>{
        fetch("https://eventsbrite.onrender.com/events/addevent", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({title:title,image:image, description:description, user_id:user_id, })
        })
        .then((res)=>res.json())
        .then((response)=>{
            console.log(response)
            if(response.error)
            {
                Swal.fire(
                    'Error',
                    response.error,
                    'error'
                  )
            }
            else if(response.success)
            { 
                nav("/")
                Swal.fire(
                    'Success',
                    response.success,
                    'success'
                  )
                  setonchange(!onchange)
            }
            else{
                Swal.fire(
                    'Error',
                    "Something went wrong",
                    'error'
                  )
            }
    
        })
    }

    //Delete Event
    const deleteEvent = (id) =>{
        fetch(`https://eventsbrite.onrender.com/event/delete/${id}`, {
            method: "DELETE",
        })
        .then((res)=>res.json())
        .then((response)=>{
          setonchange(!onchange)
            console.log(response)
            nav("/")
            Swal.fire(
              'Success',
              "Delete success",
              'success'
            )
            nav("/")
    
        })
    
    }

    // fetch Events
      useEffect(()=>{
        fetch("https://eventsbrite.onrender.com/events", {
            method: "GET",
            headers: {"Content-Type":"application/json"}
        })
        .then((res)=>res.json())
        .then((response)=>{
          setEvent(response)

          console.log(response)

        })
    }, [onchange])


    const contextData ={
        events,
        deleteEvent,
        AddEvent,
        editEvent,
        
    }
  return (
    <EventContext.Provider value={contextData}>
        {children}

    </EventContext.Provider>
  )
}