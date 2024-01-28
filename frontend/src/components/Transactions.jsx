import React from 'react';

function Transactions(props){
    return (

        <li key={props.from_username} className="flex justify-between gap-x-6 py-5">
          <div className="flex gap-x-4 w-full">
            {props.type === "Credit" && (
              <>
                <div className="h-12 w-12 flex-none rounded-full bg-gray-200 flex justify-center items-center">
                  {props.from_first_name[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{props.from_first_name}</p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{props.from_username}</p>
                  </div>
                  <p className="text-sm leading-6 text-green-600">+ ₹{props.amount}</p>
              </>
            )
          }

            {props.type === "Debit" && (
              <>
                <div className="h-12 w-12 flex-none rounded-full bg-gray-200 flex justify-center items-center">
                  {props.to_first_name[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{props.to_first_name}</p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{props.to_username}</p>
                  </div>
                  <p className="text-sm leading-6 text-red-600">- ₹{props.amount}</p>
              </>
            )
          }
          
          </div>
        </li>
    )
}

export default Transactions;