import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3Context, useAddress } from "../../../../hooks";
import { DEFAULD_NETWORK } from "../../../../constants";
import { IReduxState } from "../../../../store/slices/state.interface";
import { IPendingTxn } from "../../../../store/slices/pending-txns-slice";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Button } from 'shards-react'
import './ConnectMenu.css'
import { IUserTokenDetails } from "../../../../store/slices/account-slice";

function ConnectMenu() {
    const { connect, disconnect, connected, web3, providerChainID, checkWrongNetwork } = useWeb3Context();
    const dispatch = useDispatch();
    const [buttonText, setButtonText] = useState('Connect Wallet')
    const [isConnected, setConnected] = useState(connected);
    const address = useAddress();
    const abbrvAddress = `${address.substr(0, 4)}...${address.substr(address.length - 4, address.length - 1)}`
    let pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const tokens = useSelector<IReduxState, { [key: string]: IUserTokenDetails }>(state => {
        return state.account.tokens
    });

    console.log('tokens are', tokens)

    let clickFunc: any = connect;
    let buttonStyle = {};

    const hoverOn = () => {
        if (isConnected) {
            setButtonText('Disconnect');
        }
    }

    const hoverOff = () => {
        if (isConnected) {
            setButtonText(abbrvAddress);
        }
    }

    const buttonClicked = () => {
        if (isConnected) {
            console.log('disconnecting here')
            disconnect();
        }
        if (isConnected && providerChainID !== DEFAULD_NETWORK) {
            checkWrongNetwork();
        }
        if (!isConnected) {
            connect();
        }
    }

    useEffect(() => {
        if (isConnected) {
            setButtonText(abbrvAddress);
            clickFunc = disconnect;
        }

        if (pendingTransactions && pendingTransactions.length > 0) {
            setButtonText(`${pendingTransactions.length} Pending `);
            clickFunc = () => { };
        }

        if (isConnected && providerChainID !== DEFAULD_NETWORK) {
            setButtonText("Wrong network");
            buttonStyle = { backgroundColor: "rgb(255, 67, 67)" };
            clickFunc = () => {
                checkWrongNetwork();
            };
        }
    }, [])


    useEffect(() => {
        setConnected(connected);
    }, [web3, connected]);

    return (
        <div>
            <img
                id="main-logo"
                className="d-inline-block align-top mr-1"
                style={{ paddingLeft: '10px', paddingTop: '20px', height: "40px" }}
                src={require("../../../../assets/tokens/AVAX.svg")}
                alt="Shards Dashboard"
            />
            <Button
                theme="primary"
                className="mb-2 mr-1 connect-button"
                onClick={buttonClicked}
                onMouseEnter={hoverOn}
                onMouseLeave={hoverOff}
            >

                <p>{buttonText}</p>
                {pendingTransactions.length > 0 && (
                    <div className="connect-button-progress">
                        <CircularProgress size={15} color="inherit" />
                    </div>
                )}
            </Button>
        </div>
    );
}

export default ConnectMenu;
