let lineChart, barChart, pieChart;

let revenueHistory = [];

function initCharts() {

  const lineCtx = document.getElementById('lineRevenueChart').getContext('2d');
  lineChart = new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Now'],
      datasets: [{
        label: 'Revenue (USD)',
        data: [0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return '$' + context.raw.toLocaleString();
            }
          }
        }
      }
    }
  });

  const barCtx = document.getElementById('barFeatureChart').getContext('2d');
  barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: ['AI Assistant', 'Export Hub', 'Analytics Studio'],
      datasets: [{
        label: 'Usage Count',
        data: [0, 0, 0],
        backgroundColor: ['#4f46e5', '#8b5cf6', '#c084fc'],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of sessions'
          }
        }
      }
    }
  });

  const pieCtx = document.getElementById('pieSegmentationChart').getContext('2d');
  pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: ['Free Users', 'Premium Users'],
      datasets: [{
        data: [0, 0],
        backgroundColor: ['#94a3b8', '#4f46e5'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.label + ': ' + context.raw.toLocaleString() + ' users';
            }
          }
        }
      }
    }
  });
}

function updateLineChart(newRevenue) {
  revenueHistory.push(newRevenue);

  if (revenueHistory.length > 8) {
    revenueHistory.shift();
  }

  if (lineChart) {
    lineChart.data.datasets[0].data = [...revenueHistory];
    lineChart.update('none');
  }
}

function initRevenueHistory(firstRevenue) {
  for (let i = 0; i < 8; i++) {
    let value = firstRevenue - (3000 * (8 - i));
    if (value < 500) value = 500;
    revenueHistory.push(Math.floor(value));
  }

  if (lineChart) {
    lineChart.data.datasets[0].data = [...revenueHistory];
    lineChart.update();
  }
}

function updateBarChart(activeUsers, totalUsers, revenue) {
  if (!barChart) return;

  const aiUsage = Math.floor(activeUsers * 0.7) + 100;
  const exportUsage = Math.floor(totalUsers * 0.5) + 80;
  const analyticsUsage = Math.floor(revenue / 15) + 50;

  barChart.data.datasets[0].data = [aiUsage, exportUsage, analyticsUsage];
  barChart.update('none');
}

function updatePieChart(totalUsers, growthRate) {
  if (!pieChart) return;

  let premiumPercent = 0.25 + (growthRate / 200);
  if (premiumPercent > 0.4) premiumPercent = 0.4;
  if (premiumPercent < 0.15) premiumPercent = 0.15;

  const premiumUsers = Math.floor(totalUsers * premiumPercent);
  const freeUsers = totalUsers - premiumUsers;

  pieChart.data.datasets[0].data = [freeUsers, premiumUsers];
  pieChart.update('none');
}

function getRevenueHistory() {
  return [...revenueHistory];
}