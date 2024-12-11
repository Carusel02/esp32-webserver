import React from "react";
import RealTimeChart from "./chart/RealTimeChart";

const App: React.FC = () => {
    return (
        <div style={{ padding: "20px" }}>
            <h1>Real-Time CO₂ Levels</h1>
            <RealTimeChart />
        </div>
    );
};

export default App;
