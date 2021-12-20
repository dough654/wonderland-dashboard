import React from "react";
import { useSelector } from "react-redux";
import { IReduxState } from "../store/slices/state.interface";
import { IAppSlice } from "../store/slices/app-slice";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";
import { trim } from "../helpers";

import PageTitle from "../components/common/PageTitle";
import SmallStats from "../components/common/SmallStats";
import UsersOverview from "../components/blog/UsersOverview";
import UsersByDevice from "../components/blog/UsersByDevice";
import NewDraft from "../components/blog/NewDraft";
import Discussions from "../components/blog/Discussions";
import TopReferrals from "../components/common/TopReferrals";

const StakingDashboard = ({ smallStats }) => {
  const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
  const app = useSelector<IReduxState, IAppSlice>(state => state.app);

  console.log('app is', app)

  const fiveDayRate = useSelector<IReduxState, number>(state => {
    return state.app.fiveDayRate;
  });
  const timeBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.time;
  });
  const memoBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.memo;
  });
  const wmemoBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.wmemo;
  });
  const wrapPrice = useSelector<IReduxState, number>(state => {
    console.log('wrapping is now', state.wrapping)
    return state.wrapping.wrapPrice
  });
  const stakeAllowance = useSelector<IReduxState, number>(state => {
    return state.account.staking && state.account.staking.time;
  });
  const unstakeAllowance = useSelector<IReduxState, number>(state => {
    return state.account.staking && state.account.staking.memo;
  });
  const stakingRebase = useSelector<IReduxState, number>(state => {
    return state.app.stakingRebase;
  });
  const stakingAPY = useSelector<IReduxState, number>(state => {
    return state.app.stakingAPY;
  });
  const marketPrice = useSelector<IReduxState, number>(state => {
    return state.app.marketPrice;
  });

  const exchangeRate = 1 / wrapPrice;
  const wMemoPrice = Number(wmemoBalance) * exchangeRate * marketPrice;
  const memoPrice = Number(memoBalance) * marketPrice;

  const trimmedMemoBalance = trim(Number(memoBalance), 6);
  const trimmedMemoPrice = Number(memoPrice).toFixed(2);
  const trimmedWMemoBalance = trim(Number(wmemoBalance), 6);
  const trimmedWMemoPrice = Number(wMemoPrice).toFixed(2);
  const trimmedStakingAPY = trim(stakingAPY * 100, 1);
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim((Number(stakingRebasePercentage) / 100) * Number(trimmedMemoBalance), 6);

  console.log('memo balance', trimmedWMemoBalance)

  const stats = (label, value, data, borderColor, backgroundColor) => ({
    label,
    value,
    percentage: "4.7%",
    increase: true,
    decrease: false,
    chartLabels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    attrs: { md: "6", sm: "6" },
    datasets: [
      {
        label: "Today",
        fill: "start",
        borderWidth: 1.5,
        backgroundColor,
        borderColor,
        data
      }
    ]
  })

  const allStats = [
    stats('TIME Price', Number(marketPrice).toFixed(2), [1, 2, 1, 3, 5, 4, 7, 1, 15, 10], "rgb(0, 184, 216)", "rgba(0, 184, 216, 0.1)"),
    stats('TIME Balance', Number(timeBalance).toFixed(6), [1, 2, 1, 3, 5, 4, 7, 1, 15, 10], "rgb(6, 214, 160)", "rgba(6, 214, 160, 0.1)"),
    stats('MEMO Balance', Number(memoBalance).toFixed(6), [1, 2, 1, 3, 5, 4, 7, 1, 15, 10], "rgb(6, 214, 160)", "rgba(6, 214, 160, 0.1)"),
    stats('MEMO Value (USD)', Number(memoPrice).toFixed(2), [1, 2, 1, 3, 5, 4, 7, 1, 15, 10], "rgb(6, 214, 160)", "rgba(6, 214, 160, 0.1)"),
    stats('Wrapped Memo Balance', Number(wmemoBalance).toFixed(6), [1, 2, 1, 3, 5, 4, 7, 1, 15, 10], "rgb(6, 214, 160)", "rgba(6, 214, 160, 0.1)"),
    stats('Wrapped Memo Value (USD)', Number(wMemoPrice).toFixed(2), [1, 2, 1, 3, 5, 4, 7, 1, 15, 10], "rgb(6, 214, 160)", "rgba(6, 214, 160, 0.1)"),
    stats('Exchange rate', Number(wrapPrice).toFixed(6), [1, 2, 1, 3, 5, 4, 7, 1, 15, 10], "rgb(6, 214, 160)", "rgba(6, 214, 160, 0.1)")
  ]

  const marketPriceStats = {
    label: "Market Price",
    value: Number(marketPrice).toFixed(2),
    percentage: "4.7%",
    increase: true,
    decrease: false,
    chartLabels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    attrs: { md: "6", sm: "6" },
    datasets: [
      {
        label: "Today",
        fill: "start",
        borderWidth: 1.5,
        backgroundColor: "rgba(0, 184, 216, 0.1)",
        borderColor: "rgb(0, 184, 216)",
        data: [1, 2, 1, 3, 5, 4, 7, 1, 15, 10]
      }
    ]
  }

  return (<Container fluid className="main-content-container px-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle title="Blog Overview" subtitle="Dashboard" className="text-sm-left mb-3" />
    </Row>

    {/* Small Stats Blocks */}
    <Row>
      {/* {smallStats.map((stats, idx) => (
        <Col className="col-lg mb-4" key={idx} {...stats.attrs}>
          <SmallStats
            id={`small-stats-${idx}`}
            variation="1"
            chartData={stats.datasets}
            chartLabels={stats.chartLabels}
            label={stats.label}
            value={stats.value}
            percentage={stats.percentage}
            increase={stats.increase}
            decrease={stats.decrease}
          />
        </Col>
      ))} */}
      {allStats.map((stat, idx) => (
        <Col className="col-lg mb-4" key={idx}>
          <SmallStats
            id={`small-stats-${idx}`}
            variation="1"
            chartData={stat.datasets}
            chartLabels={stat.chartLabels}
            label={stat.label}
            value={stat.value}
            percentage={stat.percentage}
            increase={stat.increase}
            decrease={stat.decrease}
          />
        </Col>
      ))}

    </Row>

    <Row>
      {/* Users Overview */}
      <Col lg="8" md="12" sm="12" className="mb-4">
        <UsersOverview />
      </Col>

      {/* Users by Device */}
      <Col lg="4" md="6" sm="12" className="mb-4">
        <UsersByDevice />
      </Col>

      {/* New Draft */}
      <Col lg="4" md="6" sm="12" className="mb-4">
        <NewDraft />
      </Col>

      {/* Discussions */}
      <Col lg="5" md="12" sm="12" className="mb-4">
        <Discussions />
      </Col>

      {/* Top Referrals */}
      <Col lg="3" md="12" sm="12" className="mb-4">
        <TopReferrals />
      </Col>
    </Row>
  </Container>
  );
}

StakingDashboard.propTypes = {
  /**
   * The small stats dataset.
   */
  smallStats: PropTypes.array
};

StakingDashboard.defaultProps = {
  smallStats: [
    {
      label: "Posts",
      value: "2,390",
      percentage: "4.7%",
      increase: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "6", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgba(0, 184, 216, 0.1)",
          borderColor: "rgb(0, 184, 216)",
          data: [1, 2, 1, 3, 5, 4, 7]
        }
      ]
    },
    {
      label: "Pages",
      value: "182",
      percentage: "12.4",
      increase: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "6", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgba(23,198,113,0.1)",
          borderColor: "rgb(23,198,113)",
          data: [1, 2, 3, 3, 3, 4, 4]
        }
      ]
    },
    {
      label: "Comments",
      value: "8,147",
      percentage: "3.8%",
      increase: false,
      decrease: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "4", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgba(255,180,0,0.1)",
          borderColor: "rgb(255,180,0)",
          data: [2, 3, 3, 3, 4, 3, 3]
        }
      ]
    },
    {
      label: "New Customers",
      value: "29",
      percentage: "2.71%",
      increase: false,
      decrease: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "4", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgba(255,65,105,0.1)",
          borderColor: "rgb(255,65,105)",
          data: [1, 7, 1, 3, 1, 4, 8]
        }
      ]
    },
    {
      label: "Subscribers",
      value: "17,281",
      percentage: "2.4%",
      increase: false,
      decrease: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "4", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgb(0,123,255,0.1)",
          borderColor: "rgb(0,123,255)",
          data: [3, 2, 3, 2, 4, 5, 4]
        }
      ]
    }
  ]
};

export default StakingDashboard;
