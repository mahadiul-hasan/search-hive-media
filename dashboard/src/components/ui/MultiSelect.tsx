/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandInput,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FormField, FormItem, FormLabel, FormMessage } from "./form";

type Option = {
	label: string;
	value: string;
};

interface MultiSelectProps {
	name: string;
	label: string;
	options: Option[];
	form: any;
}

export function MultiSelect({ name, label, options, form }: MultiSelectProps) {
	const [open, setOpen] = React.useState(false);
	const [search, setSearch] = React.useState("");

	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => {
				const selectedValues: string[] = field.value || [];

				const toggleValue = (value: string) => {
					const newValues = selectedValues.includes(value)
						? selectedValues.filter((v) => v !== value)
						: [...selectedValues, value];
					field.onChange(newValues);
				};

				const selectedLabels = options
					.filter((option) => selectedValues.includes(option.value))
					.map((option) => option.label)
					.join(", ");

				const filteredOptions = options.filter((option) =>
					option.label.toLowerCase().includes(search.toLowerCase())
				);

				return (
					<FormItem className="w-full">
						<FormLabel>{label}</FormLabel>
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									role="combobox"
									className={cn(
										"w-full justify-between",
										!selectedValues.length &&
											"text-muted-foreground"
									)}
								>
									{selectedLabels || "Select countries"}
									<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-full p-0 max-h-64 overflow-auto">
								<Command>
									<CommandInput
										placeholder="Search countries..."
										value={search}
										onValueChange={setSearch}
										className="h-9"
									/>
									<CommandGroup className="max-h-48 overflow-auto">
										{filteredOptions.length > 0 ? (
											filteredOptions.map((option) => {
												const isSelected =
													selectedValues.includes(
														option.value
													);
												return (
													<CommandItem
														key={option.value}
														onSelect={() =>
															toggleValue(
																option.value
															)
														}
													>
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																isSelected
																	? "opacity-100"
																	: "opacity-0"
															)}
														/>
														{option.label}
													</CommandItem>
												);
											})
										) : (
											<p className="p-2 text-sm text-muted-foreground">
												No results.
											</p>
										)}
									</CommandGroup>
								</Command>
							</PopoverContent>
						</Popover>
						<FormMessage />
					</FormItem>
				);
			}}
		/>
	);
}
