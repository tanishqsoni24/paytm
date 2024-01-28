import { useState, useEffect } from 'react'
import { Dialog, Popover } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Cookies from 'js-cookie'
import axios from 'axios'
import Card from '../components/Card'
import Transactions from '../components/Transactions'

export default function Home() {
  const [makePayment, setMakePayment] = useState(true)
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const token = Cookies.get('token')
  const [userData, setUserData] = useState({})
  const [peopleData, setPeopleData] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loggingOut, setLoggingOut] = useState(false)
  
  useEffect(() => {
    const getUserDetails = async () => {
      const response = await axios.get("http://192.168.8.112:3002/api/v1/accounts/getUserDetails", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const response2 = await axios.get("http://192.168.8.112:3002/api/v1/accounts/myBalance", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUserData({userData : response.data.data, balData : response2.data.data})
    }
    
    const People = async () => {
      const response3 = await axios.get("http://192.168.8.112:3002/api/v1/accounts/getPeople", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setPeopleData(response3.data.data)
    }
    getUserDetails()
    People()
  }, [])
  
  console.log(userData)
  console.log(peopleData)

  const activeMyTransaction = async () => {
    setMobileMenuOpen(false)
    setLoading(true)
    setMakePayment(false)
    const response4 = await axios.get("http://localhost:3002/api/v1/accounts/getMyTransactions", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    setTransactions(response4.data.data)
    setLoading(false)
  }

  const logout = (e) => {
    Cookies.remove('token')
    e.target.innerHTML = "logging out..."
    // add load
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  console.log(transactions)

  return (
      <header className="bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="text-lg font-semibold">Pay<span className='text-blue-700'>U</span></span>  
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <a onClick={()=>{setMakePayment(true)}} className="cursor-pointer text-sm font-semibold leading-6 text-gray-900">
              Make Payments
            </a>
            <a onClick={activeMyTransaction} className="cursor-pointer text-sm font-semibold leading-6 text-gray-900">
              Your Transactions
            </a>
          </Popover.Group>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="#" onClick={()=>{setLoggingOut(true)}} className="text-sm font-semibold leading-6 text-gray-900">
              Hello, {userData.userData && <span className='text-blue-700'>{userData.userData.first_name}</span>}
            </a>
          </div>
        </nav>
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
              <span className="text-lg font-semibold">Pay<span className='text-blue-700'>U</span></span> 
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <a
                    onClick={()=>{setMakePayment(true); setMobileMenuOpen(false)}}
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Make Payments
                  </a>
                  <a
                    onClick={activeMyTransaction}
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Your Transactions
                  </a>
                </div>
                <div className="py-6">
                  <a
                  onClick={()=>{setLoggingOut(true); setMobileMenuOpen(false)}}
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Hello, {userData.userData && <span className='text-blue-700'>{userData.userData.first_name}</span>}
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
        {makePayment &&
        <ul role="list" className=" container px-5 m-auto divide-y divide-gray-100">
        <div className="flex">
          My Wallet &nbsp; : &nbsp;{userData.balData && <span className='text-blue-700'>{userData.balData.balance}</span>}
        </div>
        {peopleData.map((person) => (
          <>
            <Card 
              token = {token}
              username = {person.username}
              first_name = {person.first_name}
              last_name = {person.last_name}
              id = {person._id}
            />
          </>
        ))}
      </ul>
        }

        {!makePayment &&
          (
            <ul role="list" className="container px-5 m-auto divide-y divide-gray-100">
      {transactions.map((person) => (
        <Transactions 
          from_username = {person.from.username}
          from_first_name = {person.from.first_name}
          from_last_name = {person.from.last_name}
          to_username = {person.to.username}
          to_first_name = {person.to.first_name}
          to_last_name = {person.to.last_name}
          amount = {person.amount}
          type = {person.type}
        />
      ))}
    </ul>
          )
        }
  
          {loggingOut && (
            <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          
            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <h2 className="text-center pt-6 font-semibold">Logout</h2>
                  <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                      <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center text-blue-600 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      {userData.userData.first_name[0].toUpperCase()}
                      </div>
                      <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Logout</h3>
                        <div class="mt-2">
                            <p className="text-sm text-gray-500 sm:text-center">Are you sure you want to logout?</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button type="button" class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto" onClick={()=>{setLoggingOut(false)}}>No</button>
                    <button type="button" class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto" onClick={logout}>Yes</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
  
      </header>

    
  )
}
