import React, { useEffect, useState } from "react";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { loadTokenPrices } from "./helpers";
import { Progress } from 'shards-react'


function Root() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTokenPrices().then(() => setLoading(false));
    }, []);

    if (loading) return (<Progress
        theme="success"
        style={{ height: "5px" }}
        className="mb-3"
        value={40}
    />);


    return (
        <HashRouter>
            <App />
        </HashRouter>
    );
}

export default Root;
