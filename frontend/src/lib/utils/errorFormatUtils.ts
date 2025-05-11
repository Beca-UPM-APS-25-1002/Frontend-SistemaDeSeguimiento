/**
 * Converts a JSON error object into a human-readable string.
 * Handles nested error structures with dynamic keys.
 *
 * @param errorObj - The error object to format
 * @returns A human-readable error message
 */
export function formatErrorMessages(errorObj: Record<string, unknown>): string {
  // If the input is null or not an object, return a default message
  if (!errorObj || typeof errorObj !== "object" || Array.isArray(errorObj)) {
    return "An unknown error occurred";
  }

  const errorMessages: string[] = [];

  Object.entries(errorObj).forEach(([field, messages]) => {
    // Handle arrays of error messages (most common case)
    if (Array.isArray(messages)) {
      messages.forEach((message) => {
        const readableField = formatFieldName(field);
        errorMessages.push(`${readableField}: ${message}`);
      });
    }
    // Handle nested error objects
    else if (messages && typeof messages === "object") {
      const nestedErrors = formatErrorMessages(
        messages as Record<string, unknown>
      );
      errorMessages.push(nestedErrors);
    }
    // Handle single string error messages
    else if (typeof messages === "string") {
      const readableField = formatFieldName(field);
      errorMessages.push(`${readableField}: ${messages}`);
    }
  });

  return errorMessages.join("\n");
}

/**
 * Formats a field name to be more human-readable
 * Converts camelCase or snake_case to spaced words and capitalizes the first letter
 *
 * @param field - The field name to format
 * @returns A human-readable field name
 */
function formatFieldName(field: string): string {
  // Handle camelCase and snake_case
  const formatted = field
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .toLowerCase();

  // Capitalize first letter
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
