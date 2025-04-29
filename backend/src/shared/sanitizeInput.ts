import validator from "validator";

// Helper function to sanitize strings
export const sanitizeInput = (input: any): string => {
	if (typeof input === "string") {
		return validator.escape(input); // Escapes HTML characters to prevent XSS
	}
	return input;
};

// Function to recursively sanitize inputs (supports nested objects)
export const sanitizeObject = (obj: any): any => {
	if (Array.isArray(obj)) {
		return obj.map(sanitizeObject);
	}
	if (typeof obj === "object" && obj !== null) {
		const sanitizedObject: Record<string, any> = {};
		for (const key in obj) {
			sanitizedObject[key] = sanitizeObject(obj[key]);
		}
		return sanitizedObject;
	}
	return sanitizeInput(obj);
};
