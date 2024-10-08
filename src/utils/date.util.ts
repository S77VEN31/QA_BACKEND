const formatDate = (date: string | undefined): string | null => {
  if (!date) return null;

  const dateObj = new Date(date);
  return dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
};

function formatTimestamp(timestampString: string): Date {
  // Create a Date object from the timestamp string
  const timestamp = new Date(timestampString);

  // Check if the Date is valid
  if (isNaN(timestamp.getTime())) {
    throw new Error("Invalid timestamp string");
  }

  // Return the Date object
  return timestamp;
}

export { formatDate, formatTimestamp };
