import { useState, useEffect } from "react";
import * as echarts from "echarts";
import ReactEcharts from "echarts-for-react";
import { format } from "date-fns";
import { Report } from "../types/reports";
import { GraphProps } from "../types/graphs";

export default function Graph() {
	const [average, setAverage] = useState<number>(0);
	const [graphData, setGraphData] = useState<GraphProps | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// https://apache.github.io/echarts-handbook/en/how-to/chart-types/line/basic-line
	useEffect(() => {
		setIsLoading(true);

		fetch("/data")
			.then((r) => r.json())
			.then((r: Report[]) => {
				console.log(rows);
				const rows = r;

				const values = [...rows].map((each: Report) => each.download.bandwidth / 1000 / 100);
				let avg = 0;
				values.forEach((val) => {
					avg += val;
				});
				setAverage(avg / values.length);

				const option: GraphProps = {
					xAxis: {
						type: "category",
						data: [...rows].map((each) => format(new Date(each.timestamp), "M/d/yy h:mm a")),
					},
					yAxis: {
						type: "value",
					},
					series: [
						{
							data: values,
							type: "line",
						},
					],
					label: {
						show: true,
						position: "bottom",
						textStyle: {
							fontSize: 20,
						},
					},
				};

				setGraphData(option);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	if (isLoading) {
		// @ts-ignore
		return <>Loading...</>;
	}

	if (graphData === null) {
		// @ts-ignore
		return <>No data</>;
	}

	return (
		// @ts-ignore
		<div>
			<h1 style={{ textAlign: "center" }}>Speeds in Mbps</h1>
			<p style={{ textAlign: "center" }}>Average speed: {average}</p>
			<ReactEcharts option={graphData} />
		</div>
	);
}
