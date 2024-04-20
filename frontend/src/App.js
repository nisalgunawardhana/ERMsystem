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
import UpdateTax from './components/updateTax';
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
import CashierDashboard from './components/cashierDashboard';

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

          <Route path="/otherExpense" element={<ProtectedRoute><AllOther/></ProtectedRoute>}/>
          <Route path="/otherExpense/update/:id" element={<ProtectedRoute><UpdateOther/></ProtectedRoute>}/>
          <Route path="/finance" element={<ProtectedRoute><FinanceDash/></ProtectedRoute>}/>
          <Route path="/profit/:month" element={<ProtectedRoute><AddProfit/></ProtectedRoute>}/>
          <Route path="/profit/get/:id" element={<ProtectedRoute><ProfitDetails/></ProtectedRoute>}/>
          <Route path="/profit/update/:id" element={<ProtectedRoute><EditProfit/></ProtectedRoute>}/>
          <Route path="/tax/get/:id" element={<ProtectedRoute><TaxDetails/></ProtectedRoute>}/>
          <Route path="/tax/:epfetf" element={<ProtectedRoute><AddTax/></ProtectedRoute>}/>
          <Route path="/tax/update/:id" element={<ProtectedRoute><UpdateTax/></ProtectedRoute>}/>
          <Route path="/supplier" element={<ProtectedRoute><Supplier/></ProtectedRoute>}/>
          <Route path='/purchaseOrder' element={<ProtectedRoute><PurchaseOrder/></ProtectedRoute>}/>
          <Route path="/supplier/add" element={<ProtectedRoute><AddSupplier/></ProtectedRoute>}/>
          <Route path="/supplier/update/:id" element={<ProtectedRoute><UpdateSupplier/></ProtectedRoute>}/>
          <Route path="/purchaseOrder/add" element={<ProtectedRoute><AddPurchaseOrder/></ProtectedRoute>}/>
          <Route path="/rfq" element={<ProtectedRoute><RFQ/></ProtectedRoute>}/>
          <Route path="/dashboard/cashier/Customer" element={<ProtectedRoute><CustomerR/></ProtectedRoute>}/>
          <Route path="/dashboard/cashier/Customer/update/:id" element={<ProtectedRoute><UpdateCustomer/></ProtectedRoute>}/>
          <Route path="/trainee" element={<ProtectedRoute><Trainees/></ProtectedRoute>}/>
          <Route path="/dashboard/cashier/billing" element={<ProtectedRoute><Bill/></ProtectedRoute>}/>
          <Route path="/dashboard/cashier/bill/CreateBill" element={<ProtectedRoute><CreateBill/></ProtectedRoute>}/>
          <Route path="/dashboard/cashier/bill/update/:id" element={<ProtectedRoute><UpdateBill/></ProtectedRoute>}/>
          <Route path="/dashboard/cashier/discounts" element={<ProtectedRoute><Discounts/></ProtectedRoute>} />
          <Route path="/dashboard/cashier" element={<ProtectedRoute><CashierDashboard/></ProtectedRoute>}/>
          <Route path="/employee" element={<ProtectedRoute><Employees/></ProtectedRoute>}/>
          <Route path="/customer/update/:id" element={<ProtectedRoute><UpdateCustomer/></ProtectedRoute>}/>

        </Routes>  
      
    </BrowserRouter>
  );
}

export default App;