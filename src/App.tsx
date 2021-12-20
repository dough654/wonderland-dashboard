import React, { useEffect, useState, useCallback } from "react";
import { loadTokenPrices } from "./helpers";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Progress } from 'shards-react'

import routes from "./routes";
import withTracker from "./withTracker";

import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import { useDispatch, useSelector } from "react-redux";
import { useAddress, useWeb3Context } from "./hooks";
import { IReduxState } from "./store/slices/state.interface";
import useBonds from "./hooks/bonds";
import useTokens from "./hooks/tokens";
import { loadAccountDetails, calculateUserBondDetails, calculateUserTokenDetails } from "./store/slices/account-slice";
import { calcBondDetails } from "./store/slices/bond-slice";
import { loadAppDetails } from "./store/slices/app-slice";
import { calcWrapPrice, calcWrapDetails} from "./store/slices/wrap-slice";
import { CircularProgress } from "@material-ui/core";

export default () => {
  const dispatch = useDispatch();

  const { connect, provider, hasCachedProvider, chainID, connected } = useWeb3Context();
  const address = useAddress();

  const [walletChecked, setWalletChecked] = useState(false);

  const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
  const isAppLoaded = useSelector<IReduxState, boolean>(state => !Boolean(state.app.marketPrice));

  const { bonds } = useBonds();
  const { tokens } = useTokens();

  async function loadDetails(whichDetails: string) {
    let loadProvider = provider;

    if (whichDetails === "app") {
      loadApp(loadProvider);
    }

    if (whichDetails === "account" && address && connected) {
      loadAccount(loadProvider);
      if (isAppLoaded) return;

      loadApp(loadProvider);
    }

    if (whichDetails === "userBonds" && address && connected) {
      bonds.map(bond => {
        dispatch(calculateUserBondDetails({ address, bond, provider, networkID: chainID }));
      });
    }

    if (whichDetails === "userTokens" && address && connected) {
      tokens.map(token => {
        dispatch(calculateUserTokenDetails({ address, token, provider, networkID: chainID }));
      });
    }

    if (whichDetails === "wrap" && address && connected) {
        dispatch(calcWrapDetails({ isWrap: true, value: '', provider, networkID: chainID }));
        dispatch(calcWrapPrice({ isWrap: true, provider, networkID: chainID }));
    }
  }

  const loadApp = useCallback(
    loadProvider => {
      dispatch(loadAppDetails({ networkID: chainID, provider: loadProvider }));
      bonds.map(bond => {
        dispatch(calcBondDetails({ bond, value: null, provider: loadProvider, networkID: chainID }));
      });
      tokens.map(token => {
        dispatch(calculateUserTokenDetails({ address: "", token, provider, networkID: chainID }));
      });
    },
    [connected],
  );

  const loadAccount = useCallback(
    loadProvider => {
      dispatch(loadAccountDetails({ networkID: chainID, address, provider: loadProvider }));
    },
    [connected],
  );

  useEffect(() => {
    if (hasCachedProvider()) {
      console.log('connecting')
      connect().then(() => {
        console.log('connected')
        setWalletChecked(true);
      });
    } else {
      console.log('not connected')
      setWalletChecked(true);
    }
  }, []);

  useEffect(() => {
    if (walletChecked) {
      console.log('wallet checked')
      loadDetails("app");
      loadDetails("account");
      loadDetails("userBonds");
      loadDetails("userTokens");
      loadDetails("wrap");
    }
  }, [walletChecked]);

  useEffect(() => {
    if (connected) {
      console.log('connected here')
      loadDetails("app");
      loadDetails("account");
      loadDetails("userBonds");
      loadDetails("userTokens");
      loadDetails("wrap");
    }
  }, [connected]);

  if (isAppLoading) return <CircularProgress/>

  return (
    <div>
      <Switch>
        {routes.map((route, index) => {
          return (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={withTracker(props => {
                return (
                  <route.layout {...props}>
                    <route.component {...props} />
                  </route.layout>
                );
              })}
            />
          );
        })}
      </Switch>
    </div>
  );
}
