export interface ISearchStat {
	originalIds: string[];
	searches: number;
	valid: number;
	mistake: number;
	monetized: number;
	unique_ips: number;
	visitors: number;
	ctr: number;
	coverage: number;
	clicks: number;
	epc: number;
	rpm: number;
	revenue: number;
	ip: string | null;
	os: string | null;
	browser: string | null;
	device: string | null;
	domain: string | null;
	keyword: string | null;
	searchFeed: string;
	user: string;
	id?: {
		date: string;
		searchFeed: string;
		user: string;
	};
	createdAt?: string;
	date?: string;
}

export interface SearchStatResponse {
	data: {
		stats: ISearchStat[];
		total: number;
		totalSearches: number;
		totalRevenue: number;
	};
}
