const normalizeDate = (value) => {
  const date = value ? new Date(value) : new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const inclusiveBusinessDays = (fromDate, toDate) => {
  const start = normalizeDate(fromDate);
  const end = normalizeDate(toDate);

  if (end < start) {
    throw new Error("End date must be after start date");
  }

  let days = 0;
  const cursor = new Date(start);

  while (cursor <= end) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) {
      days += 1;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return Math.max(days, 0.5);
};

const tomorrow = () => {
  const date = normalizeDate();
  date.setDate(date.getDate() + 1);
  return date;
};

module.exports = { normalizeDate, inclusiveBusinessDays, tomorrow };
