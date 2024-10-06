const formatDate = (date: string | undefined): string | null => {
  if (!date) return null;

  const dateObj = new Date(date);
  return dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
};

export { formatDate };
