import React from 'react'
import Login from './Login'

function Navbar() {
  return (
    <>
        <div className='bg-dark p-2 border-bottom border-secondary d-flex justify-content-between w-100'>
            <h4>Inventory Manager</h4>
            <Login/>
        </div>   
    </>
  )
}

export default Navbar