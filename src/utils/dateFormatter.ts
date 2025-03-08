export const formatDate = (unFormattedDate: string | Date) => {
  if (!unFormattedDate) return "Not Available";

  const date = new Date(unFormattedDate);
  const formattedDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${
    date.getHours() % 12 || 12
  }:${String(date.getMinutes()).padStart(2, "0")} ${
    date.getHours() >= 12 ? "PM" : "AM"
  }`;

  return formattedDate;
};
