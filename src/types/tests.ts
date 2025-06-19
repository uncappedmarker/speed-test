/** Type response for speedtest-cli v2 */
export type SpeedtestResult = {
	download: number;
	upload: number;
	ping: number;
	server: {
		url: string;
		lat: string;
		lon: string;
		name: string;
		country: string;
		cc: string;
		sponsor: string;
		id: string;
		host: string;
		d: number;
		latency: number;
	};
	timestamp: string; // ISO 8601 timestamp
	bytes_sent: number;
	bytes_received: number;
	share: string | null;
	client: {
		ip: string;
		lat: string;
		lon: string;
		isp: string;
		isprating: string;
		rating: string;
		ispdlavg: string;
		ispulavg: string;
		loggedin: string;
		country: string;
	};
};

export type TestResult = {
	type: string;
	timestamp: string;
	ping: {
		jitter: number;
		latency: number;
		low: number;
		high: number;
	};
	download: {
		bandwidth: number;
		bytes: number;
		elapsed: number;
		latency: {
			iqm: number;
			low: number;
			high: number;
			jitter: number;
		};
	};
	upload: {
		bandwidth: number;
		bytes: number;
		elapsed: number;
		latency: {
			iqm: number;
			low: number;
			high: number;
			jitter: number;
		};
	};
	packetLoss: number;
	isp: string;
	interface: {
		internalIp: string;
		name: string;
		macAddr: string;
		isVpn: boolean;
		externalIp: string;
	};
	server: {
		id: number;
		host: string;
		port: number;
		name: string;
		location: string;
		country: string;
		ip: string;
	};
	result: {
		/** The UUID for the test */
		id: string;
		url: string;
		persisted: boolean;
	};
};
