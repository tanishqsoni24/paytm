import axios from 'axios'
import React, { useState } from 'react'
import Cookies from 'js-cookie'

function Signup() {

  const [userData, setUserData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    password: ''
  })

  // errors in fields
  const [errors, setErrors] = useState({
    username: '',
    fName: '',
    lName: '',
    password: ''
  })

  // alert message
  const [alert, setAlert] = useState({
    status: '',
    message: ''
  })

  const submitUserDetails = async (e) => {
    e.preventDefault()
    e.target.innerHTML = 'Loading...'

    if (userData.username === '') {
      setErrors({...errors, username: 'Username is required'})
      e.target.innerHTML = 'Create Account'
      return
    }

    if (userData.first_name === '') {
      setErrors({...errors, fName: 'First Name is required'})
      e.target.innerHTML = 'Create Account'
      return
    }

    if (userData.last_name === '') {
      setErrors({...errors, lName: 'Last Name is required'})
      e.target.innerHTML = 'Create Account'
      return
    }

    if (userData.password === '') {
      setErrors({...errors, password: 'Password is required'})
      e.target.innerHTML = 'Create Account'
      return
    }

    axios.post("http://192.168.8.112:3002/api/v1/user/signup", userData, {
    }).then((response) => {
      console.log(response)
      if (response.data.status === 'success') {
        const successMsgArray = ["Please Wait...", "Creating Your Account...", "Redirecting to your account..."]
        let iterable = 0
        const intervalId = setInterval(() => {
          if (iterable >= successMsgArray.length-1){
            clearInterval(intervalId) 
          } 
          e.target.innerHTML = successMsgArray[iterable]
          iterable++
        }, 900);
        setAlert({...alert, status: "200", message: response.data.message})
        Cookies.set("token", response.data.data.token, { expires: 1 })
        setTimeout(() => {
          window.location.href = "/"
        }, 500);
      } else {
        e.target.innerHTML = 'Create Account'
        alert(response.data.message)
      }
    }).catch((err) => {
      setAlert({...alert, status: "404", message: err.response.data.message})
      e.target.innerHTML = 'Create Account'
    })
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-semibold">Pay<span className="text-blue-700">U</span></h2>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create your account
          </h2>
        </div>

        <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* alert here */}
          {alert.status==="404" && alert.message && (<p className="alert text-center mb-2 bg-red-100 p-3 rounded-lg text-red-600 font-semibold">{alert.message}</p>)}
          {alert.status==="200" && alert.message && (<p className="alert text-center mb-2 bg-green-100 p-3 rounded-lg text-green-700 font-semibold">{alert.message}</p>)}
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Username*
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setUserData({...userData, username: e.target.value})}
                />
              </div>
              {errors.username && <span className="text-red-500 text-sm">{errors.username}</span>}
            </div>
            
            <div>
              <label htmlFor="fName" className="block text-sm font-medium leading-6 text-gray-900">
                First Name*
              </label>
              <div className="mt-2">
                <input
                  id="fName"
                  type="text"
                  autoComplete="true"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setUserData({...userData, first_name: e.target.value})}
                />
                {errors.fName && <span className="text-red-500 text-sm">{errors.fName}</span>}
              </div>
            </div>

            <div>
              <label htmlFor="lName" className="block text-sm font-medium leading-6 text-gray-900">
                Last Name*
              </label>
              <div className="mt-2">
                <input
                  id="lName"
                  type="text"
                  autoComplete="true"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setUserData({...userData, last_name: e.target.value})}
                />
                {errors.lName && <span className="text-red-500 text-sm">{errors.lName}</span>}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password*
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="****"
                  className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setUserData({...userData, password: e.target.value})}
                />
                {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
              </div>
            </div>

            <div>
              <button
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={submitUserDetails}
              >
                Create Account
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already Have an Account?{' '}
            <a href="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </>
  )
}

export default Signup