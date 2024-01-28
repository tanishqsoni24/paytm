import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function Card(props){

    const [isPopupOpen, setIsPopupOpen] = useState(false)

    const [paymentStatus, setPaymentStatus] = useState("")
    const [errorReason, setErrorReason] = useState("")

    const sendMoney = async (e) => {
        e.preventDefault()
        e.target.innerHTML = "Sending..."
        try{
            const token = Cookies.get('token')
            const response = await axios.post("http://192.168.8.112:3002/api/v1/accounts/transfer", {
                amount : document.getElementById("amount").value,
                to : props.id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response.message)
            if(response.data.status === "Success"){
                setPaymentStatus("success")
                e.target.innerHTML = "Send Money"
                setIsPopupOpen(!isPopupOpen)
            }
        }
        catch(err){
            console.log(err)
            setPaymentStatus("failed")
            setErrorReason(err.response.data.message)
            e.target.innerHTML = "Send Money"
            setIsPopupOpen(!isPopupOpen)
        }
    }

    return (
        <>
            <li key={props.username} className="flex justify-between gap-x-6 py-5">
                <div className="flex min-w-0 gap-x-4" onClick={()=>{setIsPopupOpen(!isPopupOpen)}}>
                    <div className="h-12 w-12 flex-none rounded-full bg-gray-200 flex justify-center items-center">{props.first_name[0].toUpperCase()}</div>
                    <div className="min-w-0 flex-auto">
                        <a className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer">{props.first_name + " " + props.last_name}</a>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">{props.username}</p>
                    </div>
                </div>
            </li>

            {isPopupOpen && (
                <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
              
                <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                  <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <h2 className="text-center pt-6 font-semibold">Send Money</h2>
                      <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                          <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center text-blue-600 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                          {props.first_name[0].toUpperCase()}
                          </div>
                          <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">{props.first_name + " " + props.last_name}</h3>
                            <div class="mt-2">
                                <label htmlFor="amount" className="text-xs">Amount(in INR)</label><br />
                                <input type="number" id="amount" className="border-2 py-2 px-2 rounded-lg mb-2 text-center sm:text-left" placeholder="Enter Amount Here"/>
                                <p className="text-sm text-gray-500 sm:text-center">Are Your Sure to proceed further? This porcess can't be undone.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button type="button" class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto" onClick={sendMoney}>Send Money</button>
                        <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={()=>{setIsPopupOpen(!isPopupOpen)}}>Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentStatus === "success" && (
                <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
              
                <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                  <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <h2 className="text-center pt-6 font-semibold">Send Money</h2>
                      <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                          <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center text-blue-600 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                          {props.first_name[0].toUpperCase()}
                          </div>
                          <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">{props.first_name + " " + props.last_name}</h3>
                            <div class="mt-2">
                                <p className="text-sm text-gray-500 sm:text-center">Money Sent Successfully</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button type="button" class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto" onClick={()=>{setPaymentStatus(""); window.location.reload()}}>Close</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentStatus === "failed" && (
                <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
              
                <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                  <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <h2 className="text-center pt-6 font-semibold">Send Money</h2>
                      <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                          <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center text-blue-600 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                          {props.first_name[0].toUpperCase()}
                          </div>
                          <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">{props.first_name + " " + props.last_name}</h3>
                            <div class="mt-2">
                                <p className="text-sm text-gray-500 sm:text-center">Money Sent Failed, {errorReason}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button type="button" class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto" onClick={()=>{setPaymentStatus("")}}>Close</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </>
    );
}

export default Card