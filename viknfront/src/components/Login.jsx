import React, { useState } from 'react'

import Modal from 'react-bootstrap/Modal';
import productApi, { getToken, logout } from '../api/api';
import { toast } from 'react-toastify';

function Login() {
    
      const [show, setShow] = useState(false);
    
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);

    const [logData,setlogData]=useState({username:"",password:""})
    const [currentUser,setCurrentUser]=useState(null)
    const loginbtn = (e) => {
        e.preventDefault();
            getToken(logData.username, logData.password).then(res => {
            setCurrentUser(logData.username)
            handleClose()
            toast.success(`Logged in as ${logData.username}`)
        }).catch((err)=>{
            toast.error('Invalid Username or password')
        });
    }
    
    
    const logoutbtn = () => {
        logout()
        setCurrentUser(null)
        toast.success(`Logged out successfully`)
    }



  return (
    <>  
    {
        currentUser ?
        
        <div>
            <span>Logged in as {currentUser} </span><button className='btn btn-success' onClick={logoutbtn}>Logout</button>
        </div>
        :
        <button className='btn btn-success' onClick={handleShow}>Login</button>
        
       

    }

         <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton className="bg-dark text-white border-0 pb-0">
                <h6>User Login</h6>
            </Modal.Header>
            <Modal.Body className="bg-dark text-white pt-0 d-flex flex-column gap-2">       
                <form className='d-flex flex-column gap-1'>
                    <input className='form-control' onChange={(e)=>(setlogData({...logData,username:e.target.value}))} type="text" placeholder='username' required />
                    <input className='form-control' type="password" placeholder='password' required onChange={(e)=>(setlogData({...logData,password:e.target.value}))}/>
                    <div className='d-flex gap-1'>
                        <button onClick={(e)=>loginbtn(e)} className='btn btn-success' type='submit'>Login</button>
                        <button onClick={()=>handleClose} className='btn btn-secondary' type='reset'>Cancel</button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>


    
    </>
  )
}

export default Login