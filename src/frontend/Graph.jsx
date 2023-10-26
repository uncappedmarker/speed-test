import { useState, useEffect } from "react";
import * as echarts from "echarts";
import ReactEcharts from "echarts-for-react";
import { format } from "date-fns";

export default function Graph() {
	const [average, setAverage] = useState(0);
	const [graphData, setGraphData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	// https://apache.github.io/echarts-handbook/en/how-to/chart-types/line/basic-line
	useEffect(() => {
		setIsLoading(true);

		fetch("/data")
			.then((r) => r.json())
			.then((r) => {
				const rows = r.reverse();

				const values = [...rows].map((each) => parseInt(each.download.bandwidth / 1000 / 100));
				let avg = 0;
				values.forEach((val) => {
					avg += val;
				});
				setAverage(parseInt(avg / values.length));

				const option = {
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
		return <>Loading...</>;
	}

	if (graphData === null) {
		return <>No data</>;
	}

	return (
		<>
			<h1 style={{ textAlign: "center" }}>Speeds in Mbps</h1>
			<p style={{ textAlign: "center" }}>Average speed: {average}</p>
			<ReactEcharts option={graphData} />
		</>
	);
}
