import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";

import Header from './components/Header';
import Home from './components/Home';
import AddOther from './components/AddOther';
import AllOther from './components/AllOther';
import FinanceDash from './components/financeDash';
import AddProfit from './components/AddProfit';
import ProfitDetails from './components/viewProfit';
import EditProfit from './components/editProfit';
import TaxDetails from './components/viewTax';
import AddTax from './components/addTax';
import UpdateOther from './components/UpdateOther';
import Supplier from './components/supplier';
import PurchaseOrder from './components/purchaseOrders';
import AddSupplier from './components/addSupplier';
import AddPurchaseOrder from './components/addPurchaseOrder';
import UpdateSupplier from './components/updateSupplier';
import RFQ from './components/rfq';
import CustomerR from './components/Customer';
import UpdateCustomer from './components/UpdateCustomer';
import Trainees from'./components/Trainee';
//billing
import Bill from './components/billingComponents/bill';
import CreateBill from './components/billingComponents/createBill';
import UpdateBill from './components/billingComponents/updateBill';
//discount
import Discounts from './components/discountComponents/Discount';
import Employees from './components/employeeComponent/employee';

//user management
import Login from './pages/Login';
import Register from './pages/Register';
import { useSelector } from "react-redux";
import PublicRoute from './components/PublicRoute';
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute';
import SystemUsers from './pages/SystemUsers';
import Notes from './pages/Notes';

function App() {
  const {loading} = useSelector(state => state.alerts);

  const [isSidebarOpen, setSidebarOpen] = useState(true);
   useEffect(() => {
    // Close the sidebar on route change
    setSidebarOpen(false);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <BrowserRouter>
      {/* spinner */}
      {loading && (<div className="spinner-parent">
        <div class="spinner-border" role="status">
        </div>
      </div>)}

      {/* toast message */}
      <Toaster position="top-center" reverseOrder={false}/>
{/*
      
      <div>
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}/>
        <div style={{ paddingTop: "0px", paddingLeft: isSidebarOpen ? "250px" : "0" }}>
*/}        
        <Routes>

          <Route path="/login" element={<PublicRoute><Login/></PublicRoute>}/>
          <Route path="/register" element={<ProtectedRoute><Register/></ProtectedRoute>}/>
          <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
          <Route path="/users" element={<ProtectedRoute><SystemUsers/></ProtectedRoute>}/>
          <Route path="/notes" element={<ProtectedRoute><Notes/></ProtectedRoute>}/>

          <Route path="/otherExpense/add" element={<AddOther/>}/>
          <Route path="/otherExpense" element={<AllOther/>}/>
          <Route path="/otherExpense/update/:id" element={<UpdateOther/>}/>
          <Route path="/finance" element={<FinanceDash/>}/>
          <Route path="/profit/:month" element={<AddProfit/>}/>
          <Route path="/profit/get/:id" element={<ProfitDetails/>}/>
          <Route path="/profit/update/:id" element={<EditProfit/>}/>
          <Route path="/tax/get/:id" element={<TaxDetails/>}/>
          <Route path="/tax/:epfetf" element={<AddTax/>}/>
          <Route path="/supplier" element={<Supplier/>}/>
          <Route path='/purchaseOrder' element={<PurchaseOrder/>}/>
          <Route path="/supplier/add" element={<AddSupplier/>}/>
          <Route path="/supplier/update/:id" element={<UpdateSupplier/>}/>
          <Route path="/purchaseOrder/add" element={<AddPurchaseOrder/>}/>
          <Route path="/rfq" element={<RFQ/>}/>
          <Route path="/Customer" element={<CustomerR/>}/>
          <Route path="/Customer/update/:id" element={<UpdateCustomer/>}/>
          <Route path="/trainee" element={<Trainees/>}/>
          <Route path="/bill" element={<Bill/>}/>
          <Route path="/bill/CreateBill" element={<CreateBill/>}/>
          <Route path="/bill/update/:id" element={<UpdateBill/>}/>
          <Route path="/bill/discounts" element={<Discounts/>} />
          <Route path="/employee" element={<Employees/>}/>

        </Routes>  
      
    </BrowserRouter>
  );
}

export default App;