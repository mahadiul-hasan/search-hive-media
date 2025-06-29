// components/ShortUrlCell.tsx
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

interface ShortUrlCellProps {
	shortUrl: string;
}

export function GetShortUrl({ shortUrl }: ShortUrlCellProps) {
	const fullUrl = `https://api.searchhivemedia.com/${shortUrl}?query=[query]`;
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(fullUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<div className="text-center">
			<Dialog>
				<DialogTrigger asChild>
					<Button
						variant="link"
						className="p-0 h-auto text-blue-600 hover:underline"
					>
						Get Short Url
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Short URL</DialogTitle>
					</DialogHeader>
					<div className="space-y-3">
						<div className="text-sm break-all border rounded-md px-4 py-2 bg-muted">
							{fullUrl}
						</div>
						<Button
							onClick={handleCopy}
							size="sm"
							variant="outline"
							className="flex gap-2 items-center"
						>
							{copied ? (
								<>
									<Check className="h-4 w-4 text-green-500" />
									Copied!
								</>
							) : (
								<>
									<Copy className="h-4 w-4" />
									Copy URL
								</>
							)}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
