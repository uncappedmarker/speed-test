export interface GraphProps {
	xAxis: {
		type: "category" | string;
		data: string[];
	};
	yAxis: {
		type: "value" | string;
	};
	series: {
		data: number[];
		type: "line" | string;
	}[];
	label: {
		show: boolean;
		position: "bottom" | string;
		textStyle: {
			fontSize: number;
		};
	};
}
