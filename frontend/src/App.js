import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import AddOther from './components/AddOther';
import AllOther from './components/AllOther';
import FinanceDash from './components/financeDash';
import Bill from './components/bill';
import CreateBill from './components/createBill';
import UpdateOther from './components/updateBill';
import Supplier from './components/supplier';
import PurchaseOrder from './components/purchaseOrders';
import AddSupplier from './components/addSupplier';
import AddPurchaseOrder from './components/addPurchaseOrder';
import UpdateSupplier from './components/updateSupplier';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RFQ from './components/rfq';
import UpdateBill from './components/updateBill';
import BillPreview from './components/billPreview';
import CustomerR from './components/Customer';



function App() {
  return (
    <BrowserRouter>
    <div>
      <Header/>
      <br></br>
      <br></br><br></br>
      <br></br>
      
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/otherExpense/add" element={<AddOther/>}/>
        <Route path="/otherExpense" element={<AllOther/>}/>
        <Route path="/CreateBill" element={<CreateBill/>}/>
        <Route path="/otherExpense/update/:id" element={<UpdateOther/>}/>
        <Route path="/finance" element={<FinanceDash/>}/>

        <Route path="/bill" element={<Bill/>}/>
        <Route path="/bill/update/:id" element={<UpdateBill/>}/>
        <Route path="/bill/preview/:id" element={<BillPreview/>}/>
        <Route path="/supplier" element={<Supplier/>}/>
        <Route path='/purchaseOrder' element={<PurchaseOrder/>}/>
        <Route path="/supplier/add" element={<AddSupplier/>}/>
        <Route path="/supplier/update/:id" element={<UpdateSupplier/>}/>
        <Route path="/purchaseOrder/add" element={<AddPurchaseOrder/>}/>
        <Route path="/rfq" element={<RFQ/>}/>
        <Route path="/Customer" element={<CustomerR/>}/>
      </Routes>  
    
  </div>
  </BrowserRouter>
    
  );
}

export default App;