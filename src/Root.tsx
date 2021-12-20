import React, { useEffect, useState } from "react";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { loadTokenPrices } from "./helpers";
import { Progress } from 'shards-react'
import CircularProgress from "@material-ui/core/CircularProgress";


function Root() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTokenPrices().then(() => setLoading(false));
    }, []);

    if (loading) return <CircularProgress/>

    return (
        <HashRouter>
            <App />
        </HashRouter>
    );
}

export default Root;
