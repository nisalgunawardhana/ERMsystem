import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';

function AddTax({ EPF, ETF }) {
    const [totalProfit, setTotalProfit] = useState(0);
    const [totalSalary, setTotalSalary] = useState(0);
    const [Tax_ID, setID] = useState("");
    const [Taxable_income, setProfit] = useState("");
    const [Rate, setRate] = useState();
    const [Income_tax, setIncomeTax] = useState();
    const [Due_date, setDue] = useState();
    const [Date_created, setModified] = useState();
    const [Status, setStatus] = useState();
    const [Final_profit, setFinal] = useState(0);
    const [currentDate, setCurrentDate] = useState('');
    const [isValidTaxId, setIsValidTaxId] = useState(true);
    const navigate = useNavigate();
    const { epfetf } = useParams();

    const getCurrentYear = () => {
        const currentDate = new Date();
        return currentDate.getFullYear();
    };

    const [EPF_ETF, setEpf] = useState(epfetf);

    useEffect(() => {
        let currentYear = getCurrentYear();
        fetchLatestId();
        axios.get(`http://localhost:8080/tax/profit/${currentYear}`)
            .then((res) => {
                setTotalProfit(res.data.totalProfit);
            })
            .catch((err) => {
                console.error(err);
            });
        axios.get(`http://localhost:8080/tax/salary/`)
            .then((res) => {
                setTotalSalary(res.data.totalProfit);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const fetchLatestId = async () => {
        try {
            const response = await axios.get("http://localhost:8080/tax/getId/latest");
            setID(response.data.nextId);
        } catch (error) {
            console.error("Error fetching latest Tax ID:", error);
            alert("Error fetching latest Tax ID. Please try again later.");
        }
    };

    const calculateIncomeTax = (rate) => {
        // Calculate income tax
        const incomeTax = (totalProfit * rate) / 100;
        setIncomeTax(incomeTax.toFixed(2)); // Set the income tax with two decimal places
    };

    const sendData = async (e) => {
        e.preventDefault();

        const tot = (parseFloat(totalProfit).toFixed(2) - Income_tax);

        const newTax = {
            Tax_ID,
            Taxable_income: totalProfit,
            Rate,
            Income_tax: Income_tax,
            Due_date,
            Date_modified: currentDate,
            Status,
            Final_profit: tot
        };

        try {
            // Check if the profit log already exists
            const checkRes = await axios.post("http://localhost:8080/tax/add/check", newTax);

            // If the profit log exists, display an alert and return without submitting the form
            if (checkRes.data.exists) {
                alert(checkRes.data.message);
                return;
            }

            // If the profit log doesn't exist, add it
            const res = await axios.post("http://localhost:8080/tax/add", newTax);
            if (res.status === 200) {
                alert("Tax details Added");
                setID("");
                setProfit("");
                setRate(0);
                setIncomeTax(0);
                setDue(0);
                setModified(0);
                setStatus("");
                setFinal("");
                navigate(`/tax/get/${Tax_ID}`);
            }
        } catch (error) {
            console.error("Error:", error);
            // Handle other errors, such as network errors or server errors
        }
    };

    useEffect(() => {
        const getCurrentDate = () => {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            setCurrentDate(formattedDate);
        };

        getCurrentDate();
    }, []); // Run only once after the component mount

    const handleChange = (value) => {
        setID(value);
    };

    const getPreviousYear = () => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const previousYear = currentYear - 1;
        return previousYear;
    };

    const getCurrentTaxId = async () => {
        try {
            let currentYear = getCurrentYear();
            let response = await axios.get(`http://localhost:8080/tax/search/${currentYear}`);
            let tax = response.data;

            if (tax.length > 0) {
                // Filter tax records based on date_created column
                const currentYearTax = tax.find(item => {
                    const dateCreated = new Date(item.Date_created);
                    return dateCreated.getFullYear() === currentYear;
                });

                if (currentYearTax) {
                    // Assuming the first tax record for the current year is the relevant one
                    return currentYearTax.Tax_ID;
                }
            }

            // If there's no tax record for the current year, try fetching the tax details for the previous year
            let previousYear = getPreviousYear();
            response = await axios.get(`http://localhost:8080/tax/search/${previousYear}`);
            tax = response.data;

            if (tax.length > 0) {
                // Filter tax records based on date_created column
                const previousYearTax = tax.find(item => {
                    const dateCreated = new Date(item.Date_created);
                    return dateCreated.getFullYear() === previousYear;
                });

                if (previousYearTax) {
                    // Assuming the first tax record for the previous year is the relevant one
                    return previousYearTax.Tax_ID;
                }
            }

            // If there's no tax record for the previous year as well, or if it's not related to the current year, return null
            window.location.href = `/tax/get/T#`;
            return null;
        } catch (error) {
            console.error('Error fetching tax details:', error);
            return null;
        }
    };

    const handleClickTax = async () => {
        const taxId = await getCurrentTaxId();
        if (taxId) {
            window.location.href = `/tax/get/${taxId}`;
        } else {
            console.log('No profit record found for the current and previous months of the current year.');
            // Handle the case where there's no profit record for the current and previous months of the current year
        }
    };


    return (
        <div className="container" style={{ marginTop: '100px' }}>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <form onSubmit={sendData}>
                        <div className="card">
                            <div className="card-body">
                                <div className="row align-items-center mb-5">
                                    <div className="col text-center">
                                        <h2 className="card-title text-center mb-0">Tax Details</h2>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="id" className="form-label">
                                                <i className="bi bi-card-list me-2"></i>Tax Doc ID
                                            </label>
                                            <input type="text" className="form-control" id="id" value={Tax_ID} onChange={(e) => handleChange(e.target.value)} required readOnly/>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="month" className="form-label">
                                                <i className="bi bi-calendar3 me-2"></i>Taxable Income
                                            </label>
                                            <input type="text" className="form-control" id="month" value={totalProfit.toFixed(2)} onChange={(e) => setProfit(e.target.value)} required readOnly />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sales" className="form-label">
                                                <i className="bi bi-currency-dollar me-2"></i>Rate
                                            </label>
                                            <input type="text" className="form-control" id="sales" value={Rate} onChange={(e) => {
                                                setRate(e.target.value);
                                                calculateIncomeTax(e.target.value);
                                            }} required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="supplier" className="form-label">
                                                <i className="bi bi-people me-2"></i>Income Tax
                                            </label>
                                            <input type="text" className="form-control" id="supplier" value={Income_tax} onChange={(e) => setIncomeTax(e.target.value)} required readOnly/>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="salaries" className="form-label">
                                                <i className="bi bi-people-fill me-2"></i>Due Date
                                            </label>
                                            <input type="date" className="form-control" id="salaries" value={Due_date} onChange={(e) => setDue(e.target.value)} required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="other" className="form-label">
                                                <i className="bi bi-journal me-2"></i>Date modified
                                            </label>
                                            <input type="date" className="form-control" id="other" value={currentDate} onChange={(e) => setModified(e.target.value)} required readOnly/>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="profit" className="form-label">
                                                <i className="bi bi-cash me-2"></i>Payment Status
                                            </label>
                                            <input type="text" className="form-control" id="profit" value={Status} onChange={(e) => setStatus(e.target.value)} required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="desc" className="form-label">
                                                <i className="bi bi-chat-dots me-2"></i>Final Profit
                                            </label>
                                            <input type="text" className="form-control" id="desc" value={((parseFloat(totalProfit)).toFixed(2) - Income_tax).toFixed(2)} onChange={(e) => setFinal(e.target.value)} readOnly/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                            <button type="submit" className="btn btn-primary me-5 rounded">Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddTax;