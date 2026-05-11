let previousUsers = null;
let previousRevenue = null;

async function fetchDashboardData() {
  try {
    const response = await axios.get('https://dummyjson.com/users?limit=0');
    const totalUsers = response.data.total;

    const revenue = totalUsers * 10;

    const activeUsers = Math.floor(totalUsers * 0.8);

    let growthRate = 0;
    if (previousUsers !== null && previousUsers > 0) {
      growthRate = ((totalUsers - previousUsers) / previousUsers) * 100;
      growthRate = parseFloat(growthRate.toFixed(1));
    }

    const result = {
      totalUsers: totalUsers,
      revenue: revenue,
      activeUsers: activeUsers,
      growthRate: growthRate,
      rawRevenue: revenue,
      deltaUsers: previousUsers === null ? 0 : totalUsers - previousUsers,
      prevRevenue: previousRevenue
    };

    previousUsers = totalUsers;
    previousRevenue = revenue;

    return result;

  } catch (error) {
    console.error("API Error:", error);
    return {
      totalUsers: 0,
      revenue: 0,
      activeUsers: 0,
      growthRate: 0,
      rawRevenue: 0,
      deltaUsers: 0,
      prevRevenue: null
    };
  }
}