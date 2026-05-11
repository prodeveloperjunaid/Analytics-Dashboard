let latestData = null;

function updateKPI(data, prevRevenue) {
  document.getElementById('totalUsersValue').innerText = data.totalUsers.toLocaleString();
  document.getElementById('revenueValue').innerText = '$' + data.revenue.toLocaleString();
  document.getElementById('growthValue').innerText = (data.growthRate >= 0 ? '+' : '') + data.growthRate + '%';
  document.getElementById('activeUsersValue').innerText = data.activeUsers.toLocaleString();

  const usersSpan = document.getElementById('usersTrend');
  if (data.deltaUsers > 0) {
    usersSpan.innerHTML = `+${data.deltaUsers} new users`;
    usersSpan.className = 'trend-up';
  } else if (data.deltaUsers < 0) {
    usersSpan.innerHTML = `${data.deltaUsers} users`;
    usersSpan.className = 'trend-neutral';
  } else {
    usersSpan.innerHTML = 'no change';
    usersSpan.className = 'trend-neutral';
  }

  const revenueSpan = document.getElementById('revenueTrend');
  if (prevRevenue !== null && prevRevenue !== undefined) {
    const diff = data.revenue - prevRevenue;
    const percent = (diff / prevRevenue) * 100;

    if (diff > 0) {
      revenueSpan.innerHTML = `+$${diff.toLocaleString()} (${percent.toFixed(1)}%)`;
      revenueSpan.style.color = '#047857';
    } else if (diff < 0) {
      revenueSpan.innerHTML = `-$${Math.abs(diff).toLocaleString()} (${Math.abs(percent).toFixed(1)}%)`;
      revenueSpan.style.color = '#b91c1c';
    } else {
      revenueSpan.innerHTML = 'stable';
      revenueSpan.style.color = '#475569';
    }
  }

  const engagement = ((data.activeUsers / data.totalUsers) * 100).toFixed(1);
  document.getElementById('activeTrend').innerHTML = `${engagement}% engagement rate`;
}

async function refreshDashboard() {
  try {
    const data = await fetchDashboardData();

    updateKPI(data, data.prevRevenue);

    if (typeof revenueHistory !== 'undefined' && revenueHistory.length === 0) {
      initRevenueHistory(data.rawRevenue);
    } else {
      updateLineChart(data.rawRevenue);
    }

    updateBarChart(data.activeUsers, data.totalUsers, data.revenue);

    updatePieChart(data.totalUsers, data.growthRate);

    const barData = barChart ? barChart.data.datasets[0].data : [0, 0, 0];
    const pieData = pieChart ? pieChart.data.datasets[0].data : [0, 0];

    latestData = {
      totalUsers: data.totalUsers,
      revenue: data.revenue,
      growthRate: data.growthRate,
      activeUsers: data.activeUsers,
      revenueHistory: getRevenueHistory(),
      featureUsage: [
        { name: 'AI Assistant', value: barData[0] },
        { name: 'Export Hub', value: barData[1] },
        { name: 'Analytics Studio', value: barData[2] }
      ],
      segmentation: {
        free: pieData[0],
        premium: pieData[1]
      }
    };

  } catch (error) {
    console.error('Refresh failed:', error);
    document.getElementById('totalUsersValue').innerText = 'Error';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initCharts();
  refreshDashboard();

  setInterval(refreshDashboard, 30000);

  const exportBtn = document.getElementById('exportCSVBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (latestData) {
        downloadCSV(latestData);
      } else {
        alert('Data is loading, please wait...');
      }
    });
  }
});