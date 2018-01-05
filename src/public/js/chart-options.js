export const chartOptions = {
  options: {
    tooltips: {
      callbacks: {
        label: (tooltipItems, data) => {
          return data.datasets[tooltipItems.datasetIndex].label + ': ' + (tooltipItems.yLabel / 3600).toFixed(2) + 'h';
        }
      }
    },
    scales: {
      yAxes: [{
        stacked: true,
        ticks: {
          stepSize: 3600,
          beginAtZero: true,
          callback: function(value, index, labels) {
            return value / 3600 + 'h';
          }
        }
      }],
      xAxes: [{
        stacked: true
      }]
    }
  }
}
