export interface ISearchFeed {
	_id: string;
	name: string;
	original_url: string;
	search_cap: string;
	search_engine: string;
	status: string;
	tid_level: string;
	type_integration: string;
	type_search: string;
	type_traffic: string;
	createdAt: string;
	updatedAt: string;
	user: object;
}

export interface ISearchFeedUser {
	_id: string;
	name: string;
	short_url: string;
	search_cap: string;
	search_engine: string;
	status: string;
	tid_level: string;
	type_integration: string;
	type_search: string;
	type_traffic: string;
	createdAt: string;
	updatedAt: string;
	user: object;
}
