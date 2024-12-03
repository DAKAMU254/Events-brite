import { createContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

export const AuthContext = createContext()

export function AuthProvider({children}) 
{   
    const nav = useNavigate()
    const [onChange, setonChange] = useState(false)
    const [current_user, set_currentUser] =useState()

    // Login
    const login = (email, password) =>{
        fetch("https://eventsbrite.onrender.com/auth/login", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({email, password})
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
                  setonChange(!onChange)
            }
            else{
                Swal.fire(
                    'Error',
                    "Check your connection and try again",
                    'error'
                  )
            }

        })
    }
    // sign up

    const signup = (email, username , password,  telephone,image) =>{
        fetch("https://eventsbrite.onrender.com/users/adduser", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({email, username, password, image, telephone })
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
                  setonChange(!onChange)
            }
            else{
                Swal.fire(
                    'Error',
                    "Check your connection and try again",
                    'error'
                  )
            }

        })
    }



    // Logout
    const logout = () =>{
        fetch("https://eventsbrite.onrender.com/auth/logout", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
        })
        .then((res)=>res.json())
        .then((response)=>{
            
            Swal.fire(
                'Success',
                "Logout success",
                'success'
              )
              nav("/login")
              set_currentUser()
              setonChange(!onChange)
        })

    }


    // Fetch current user
    useEffect(()=>{
        fetch("https://eventsbrite.onrender.com/currentuser", {
            method: "GET",
            headers: {"Content-Type":"application/json"}
        })
        .then((res)=>res.json())
        .then((response)=>{
          console.log(response)
            if(response.user)
                {
                    set_currentUser(response.user)
                }
            
        })
    }, [onChange])

    const contextData ={
        signup,
        logout,
        login,
        current_user,
        
      

    }
  return (
    <AuthContext.Provider value={contextData}>
        {children}

    </AuthContext.Provider>
  )
}
