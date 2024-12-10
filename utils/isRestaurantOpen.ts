type OpeningHours = {
    periods: {
      open: { day: number; time: string };
      close: { day: number; time: string };
    }[];
    weekdayText: string[];
  };
  
  export function isRestaurantOpen(openingHours: OpeningHours): boolean {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 100 + now.getMinutes();
  
    const todayPeriods = openingHours.periods.filter(
      (period) => period.open.day === currentDay
    );
  
    for (const period of todayPeriods) {
      const openTime = parseInt(period.open.time);
      const closeTime = parseInt(period.close.time);
  
      if (currentTime >= openTime && currentTime < closeTime) {
        return true;
      }
    }
  
    return false;
  }
  
  