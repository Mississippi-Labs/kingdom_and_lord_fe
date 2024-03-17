export const delay = (duration) => {
  return new Promise(resolve => setTimeout(resolve, duration));
}

// formatDate
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleString();
}