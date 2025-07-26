import React from 'react'
import { useNavigate } from 'react-router-dom';


function SideBar() {

    const navv=useNavigate()
  return (
    <>
        <div className='w-25 bg-dark border-end border-secondary  flex-column d-none d-md-flex'>
            <button className="btn btn-dark rounded-0  text-start" onClick={()=>navv('/')}>Products List</button>
            <button className="btn btn-dark rounded-0  text-start" onClick={()=>navv('/create')}>Add New Product</button>
            <button className="btn btn-dark rounded-0 text-start" onClick={()=>navv('/transactions')}>Transaction Details</button>
        </div>
        <div className='w-100 bg-dark border-top border-secondary  position-fixed bottom-0 justify-content-center d-flex d-md-none'>
            <button className="btn btn-dark rounded-0  text-start" onClick={()=>navv('/')}>Products List</button>
            <button className="btn btn-dark rounded-0  text-start" onClick={()=>navv('/create')}>Add New Product</button>
            <button className="btn btn-dark rounded-0 text-start" onClick={()=>navv('/transactions')}>Transaction Details</button>
        </div>
    </>
  )
}

export default SideBar