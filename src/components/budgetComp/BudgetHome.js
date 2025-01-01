import React from "react";
import BudgetForm from "./BudgetForm";
// import BudgetGrid from "./BudgetGrid";
// import {SpendState} from "../../context/SpendState";
import SpendState from "../../context/SpendState";
import BudgetList from "./BudgetList";
import BudgetSummary from "./BudgetSummery";
import BudgetGraph from "./BudgetGraph";

const BudgetHome = () => {
  return (
    <div>
      <SpendState>
        <BudgetForm />
        {/* <BudgetGrid /> */}
        <BudgetSummary />
        <BudgetList />
        <BudgetGraph/>
      </SpendState>
    </div>
  );
};

export default BudgetHome;
