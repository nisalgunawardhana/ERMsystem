
import './App.css';
import Header from './components/Header';
import AddOther from './components/AddOther';
import AllOther from './components/AllOther';
import UpdateOther from './components/UpdateOther';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <br></br>
        <br></br><br></br>
        <br></br>
        <Routes>
          <Route path="/add" element={<AddOther />} />
          <Route path="/" element={<AllOther />} />
          <Route path="/update/:id" element={<UpdateOther />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
