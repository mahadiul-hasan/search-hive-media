/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFormRegister } from "react-hook-form";

interface Option {
	value: string;
	label: string;
}

interface CustomSelectProps {
	label: string;
	name: string; // Add this to dynamically handle field name
	form: {
		register: UseFormRegister<any>;
	};
	data?: any;
	options: Option[];
	disabled?: boolean;
}

export default function CustomSelect({
	label,
	name,
	form,
	data,
	options,
	disabled = false,
}: CustomSelectProps) {
	return (
		<div className="space-y-2 w-full">
			<label htmlFor={name} className="font-semibold text-sm">
				{label}
			</label>
			<select
				id={name}
				{...form.register(name)}
				defaultValue={data?.[name] || ""}
				disabled={disabled}
				className={`w-full p-1.5 border rounded-md ${
					disabled
						? "bg-gray-100 text-gray-500 cursor-not-allowed"
						: ""
				}`}
			>
				<option value="" disabled>
					Select {label.toLowerCase()}
				</option>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
}
