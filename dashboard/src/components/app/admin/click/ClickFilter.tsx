import React, { useState } from "react";

type Click = {
	_id: string;
	clicks: number;
	createdAt: string;
	updatedAt: string;
	date: string; // format: "YYYY-MM-DD"
	searchFeedId: string;
};

type Props = {
	allClicks: Click[];
};

const ClickFilter: React.FC<Props> = ({ allClicks }) => {
	const [selectedDate, setSelectedDate] = useState("");
	const [filteredClicks, setFilteredClicks] = useState<Click[]>([]);

	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const date = e.target.value;
		setSelectedDate(date);
		const filtered = allClicks.filter((click) => click.date === date);
		setFilteredClicks(filtered);
	};

	return (
		<div className="p-4 max-w-xl mx-auto">
			<h2 className="text-xl font-bold mb-4">Filter Clicks by Date</h2>

			<input
				type="date"
				value={selectedDate}
				onChange={handleDateChange}
				className="border p-2 rounded w-full mb-4"
			/>

			<div className="space-y-3">
				{filteredClicks.length > 0 ? (
					filteredClicks.map((click) => (
						<div
							key={click._id}
							className="border p-3 rounded shadow"
						>
							<p>
								<strong>Date:</strong> {click.date}
							</p>
							<p>
								<strong>Clicks:</strong> {click.clicks}
							</p>
							<p>
								<strong>Search Feed ID:</strong>{" "}
								{click.searchFeedId}
							</p>
						</div>
					))
				) : (
					<p>No clicks found for the selected date.</p>
				)}
			</div>
		</div>
	);
};

export default ClickFilter;
