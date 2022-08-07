import { Fragment } from "react";
import { Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';

export function LineChart({chartData, charOptions}){

    return(
        <Line data={chartData} options={charOptions}/>
    )
}