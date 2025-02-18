// Example 2: Custom formatted local date string
export const formattedDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formattedDate;

}

