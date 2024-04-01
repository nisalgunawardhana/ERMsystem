import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RFQ from './components/rfq';
import UpdateBill from './components/updateBill';
import BillPreview from './components/billPreview';
import CustomerR from './components/Customer';
import UpdateCustomer from './components/UpdateCustomer';
//billing
import Bill from './components/billingComponents/bill';
import CreateBill from './components/billingComponents/createBill';
import UpdateBill from './components/billingComponents/updateBill';
//discount
import Discounts from './components/discountComponents/Discount';
import Employees from './components/employeeComponent/employee';





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
    
  </div>
  </BrowserRouter>
    
  );
}

export default App;