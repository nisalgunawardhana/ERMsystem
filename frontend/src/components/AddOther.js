import React,{useState} from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import './OtherFormdesign.css';
import { useParams, useNavigate } from 'react-router-dom';

function AddOther() {

    const [Type,setType] = useState("");
    const [Date,setDate] = useState("");
    const [Status,setStatus] = useState("");
    const [Cost,setCost] = useState("");
    const navigate = useNavigate();

    function sendData(e){
        e.preventDefault();
        const newOther ={
            Type,
            Date,
            Status,
            Cost
        }
        axios.post("http://localhost:8080/otherExpense/add", newOther).then(()=> {
            alert("Other expense Added")
            setType("");
            setDate("");
            setStatus("");
            setCost("");
            navigate('/');
        }).catch((err)=>{
            alert(err)
        })
    }

    const handleBack = () => {
      navigate('/'); // Reset specificExpense to null to display all expenses
  };

  return (
    <div className="custom-form-container">
            <Form onSubmit={sendData}>
                <h2 className="form-title">Expense Details</h2>
                <br></br>
                <Form.Group className="mb-3" controlId="formBasicType">
                    <Form.Label>Type</Form.Label>
                    <Form.Control type="text" placeholder="Enter Type"  onChange={(e) => setType(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" placeholder="Enter date"  onChange={(e) => setDate(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Control type="text" placeholder="Enter status"  onChange={(e) => setStatus(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCost">
                    <Form.Label>Cost</Form.Label>
                    <Form.Control type="text" placeholder="Enter cost"  onChange={(e) => setCost(e.target.value)} />
                </Form.Group>

                <div className="submit-btn-container">
                <div className="row mb-3">
                    <div className="col">
                       <div className="btn-group">
                          <Button variant="primary" type="submit" className="me-5 rounded">
                             Submit
                          </Button>
                          <button className="btn btn-secondary rounded" onClick={handleBack}>Back</button>
                       </div>
                    </div>
                </div>
                   
                </div>
            </Form>
        </div>
  );
}

export default AddOther;