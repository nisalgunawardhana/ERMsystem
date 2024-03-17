
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import AddOther from './components/AddOther';
import AllOther from './components/AllOther';
import Bill from './components/bill';
import CreateBill from './components/createBill';
import UpdateOther from './components/updateOther';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddProfit from './components/AddProfit';
import FinanceDash from './components/financeDash';
import ProfitDetails from './components/viewProfit';

function App() {
  return (
    <div>
    <BrowserRouter>
    
      <Header/>
      <br></br>
      <br></br><br></br>
      <br></br>
      
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/profit/:month" element={<AddProfit/>}/>
        <Route path="/otherExpense/add" element={<AddOther/>}/>
        <Route path="/otherExpense" element={<AllOther/>}/>
        <Route path="/bill" element={<Bill/>}/>
        <Route path="/finance" element={<FinanceDash/>}></Route>
        <Route path="/:id" element={<ProfitDetails/>}></Route>
        <Route path="/otherExpense/update/:id" element={<UpdateOther/>}/>

        
      </Routes>

    
  
  </BrowserRouter>
  </div>
  );
}

export default App;
