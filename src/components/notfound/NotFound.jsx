import React from 'react'
import { Link } from 'react-router-dom';

import './notFound.css';

const NotFound = () => {
    return (
        <section>
            <div className="notFound__container section__margin">
                <h2>Oops ! Page Not Found</h2>
                <Link to="/home"><button type="button">Go Back Home</button></Link>
            </div>
        </section>
    )
}

export default NotFound