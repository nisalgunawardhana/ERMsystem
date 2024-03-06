import React,{useState} from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from "axios";

function AddOther() {

    const [Type,setType] = useState("");
    const [Date,setDate] = useState("");
    const [Status,setStatus] = useState("");
    const [Cost,setCost] = useState("");

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
        }).catch((err)=>{
            alert(err)
        })
    }

  return (
    <Form onSubmit = {sendData} className = "container">
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Type</Form.Label>
        <Form.Control type="text" id="type" placeholder="Enter Type" onChange={(e)=> {
            setType(e.target.value);
        }} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Date</Form.Label>
        <Form.Control type="date" id="date" placeholder="Enter date" onChange={(e)=> {
            setDate(e.target.value);
        }} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Status</Form.Label>
        <Form.Control type="text" id="status" placeholder="Enter status"  onChange={(e)=> {
            setStatus(e.target.value);
        }}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Cost</Form.Label>
        <Form.Control type="text" id="cost" placeholder="Enter cost"  onChange={(e)=> {
            setCost(e.target.value);
        }}/>
      </Form.Group>
      
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default AddOther;