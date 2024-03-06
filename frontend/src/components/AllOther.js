import React, {useState, useEffect} from 'react';
import axios from "axios";
import {Link} from "react-router-dom";


export default function AllOther(){

    const [other, setOther] = useState([]);

    useEffect(()=>{
        function getOther(){
            axios.get("http://localhost:8080/otherExpense/").then((res) => {
                setOther(res.data);
            }).catch((err) => {
                alert(err.message);
            })
        }
        getOther();
    },[])

    return(
        <div className = "container">
      <h3>All Other Expenses</h3>
      <ol>
        {other.map(expense => (
          <li key={expense._id}>
            <h4>{expense.Type}</h4>
            <h4>{expense.Date}</h4>
            <h4>{expense.Status}</h4>
            <h4>{expense.Cost}</h4>
            <Link to ={`/update/${expense._id}`} className="nav-link">Update</Link>
          </li>
        ))}
      </ol>
      </div>
    )
}