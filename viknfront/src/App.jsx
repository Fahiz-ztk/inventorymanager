import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import Navbar from './components/Navbar';
import SideBar from './components/SideBar';
import InventoryTable from './components/InventoryTable';
import { Route,Routes } from 'react-router-dom';
import AddItem from './components/AddItem';
import { ToastContainer, toast } from 'react-toastify';

import Transactions from './components/Transactions';
function App() {

  return (
    <>
    <Navbar/>

      <div className="d-flex w-100 w-100 vh-100 d-flex">
        <SideBar/>
        <Routes>
          <Route path='/' element={<InventoryTable/>} />
          <Route path='/create' element={<AddItem/>} />
          <Route path='/transactions' element={<Transactions/>} />
        </Routes>
      </div>
      <ToastContainer />

    </>
  )
}

export default App
