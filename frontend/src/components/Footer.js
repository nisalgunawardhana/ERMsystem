import React from 'react';

const Footer = () => {
    return (
        <footer className="footer mt-auto py-3 bg-light" style={{ marginTop: "auto", height: "40px" }}>
            <div className="container text-center">
                <span className="text-muted">
                    &copy; {new Date().getFullYear()} Finance Management. All rights reserved.
                </span>
            </div>
        </footer>
    );
}

export default Footer;

