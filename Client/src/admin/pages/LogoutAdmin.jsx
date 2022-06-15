import React from 'react'
import { BounceLoader } from "react-spinners";

const LogoutAdmin = () => {
    return (
        <div className="container justify-content-center height-100-vh">
            <div className="row justify-content-center height-100">
                <div className="logout-spinner">
                    <BounceLoader size={100} />
                    <span className="alert alert-secondary align-text-center mt-1">
                        You are being logged out...
                    </span>
                </div>
            </div>
        </div>
    )
}

export default LogoutAdmin