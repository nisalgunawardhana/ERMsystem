
import './App.css';
import Header from './components/Header';
import AddOther from './components/AddOther';
import AllOther from './components/AllOther';
import Bill from './components/bill';
import CreateBill from './components/createBill';
import {BrowserRouter,Router, Route, Routes} from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
    <div>
      <Header/>
      <br></br>
      <br></br><br></br>
      <br></br>
      <Routes>
        <Route path="/add" element={<AddOther/>}/>
        <Route path="/" element={<AllOther/>}/>
        <Route path="/bill" element={<Bill/>}/>
        

        
      </Routes>
      
    
  </div>
  </BrowserRouter>
    
  );
}

export default App;
