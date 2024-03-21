import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import AddOther from './components/AddOther';
import AllOther from './components/AllOther';
import FinanceDash from './components/financeDash';
import AddProfit from './components/AddProfit';
import ProfitDetails from './components/viewProfit';
import TaxDetails from './components/viewTax';
import AddTax from './components/addTax';
import Bill from './components/bill';
import CreateBill from './components/createBill';
import UpdateOther from './components/updateOther';
import Supplier from './components/supplier';
import AddSupplier from './components/addSupplier';
import AddPurchaseOrder from './components/addPurchaseOrder';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import UpdateBill from './components/updateBill';
import BillPreview from './components/billPreview';

import CustomerR from './components/Customer';
import UpdateCustomer from './components/UpdateCustomer';

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
        <Route path="/profit/:month" element={<AddProfit/>}/>
        <Route path="/profit/get/:id" element={<ProfitDetails/>}/>
        <Route path="/tax/get/:id" element={<TaxDetails/>}/>
        <Route path="/tax/add" element={<AddTax/>}/>

        <Route path="/bill" element={<Bill/>}/>
        <Route path="/bill/update/:id" element={<UpdateBill/>}/>
        <Route path="/bill/preview/:id" element={<BillPreview/>}/>
        <Route path="/supplier" element={<Supplier/>}/>
        <Route path="/supplier/add" element={<AddSupplier/>}/>
        <Route path="/purchaseOrder/add" element={<AddPurchaseOrder/>}/>
        <Route path="/Customer" element={<CustomerR/>}/>
        <Route path="/Customer/update/:id" element={<UpdateCustomer/>}/>
      </Routes>  
    
  </div>
  </BrowserRouter>
    
  );
}

export default App;