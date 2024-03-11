
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import AddOther from './components/AddOther';
import AllOther from './components/AllOther';
import Bill from './components/bill';
import CreateBill from './components/createBill';
import UpdateOther from './components/UpdateOther';
import { BrowserRouter, Routes, Route } from "react-router-dom";


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
        <Route path="/bill" element={<Bill/>}/>
        <Route path="/otherExpense/update/:id" element={<UpdateOther/>}/>

        
      </Routes>
      
    
  </div>
  </BrowserRouter>
    
  );
}

export default App;
