// // Biểu đồ doanh thu
// const ctxRevenue = document.getElementById('revenueChart').getContext('2d');
// const revenueChart = new Chart(ctxRevenue, {
//     type: 'line',
//     data: {
//         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//         datasets: [{
//             label: 'Revenue',
//             data: [10, 30, 50, 70, 90, 110, 130, 150, 170, 190, 210, 230],
//             borderColor: '#4CAF50',
//             fill: false,
//         }]
//     },
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true
//             }
//         }
//     }
// });

// // Biểu đồ theo dõi môi trường
// const ctxEnvironment = document.getElementById('environmentChart').getContext('2d');
// const environmentChart = new Chart(ctxEnvironment, {
//     type: 'line',
//     data: {
//         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//         datasets: [
//             {
//                 label: 'Temperature (°C)',
//                 data: [22, 23, 24, 24, 25, 25, 26, 27, 26, 24, 23, 22],
//                 borderColor: 'rgba(255, 99, 132, 1)',
//                 fill: false,
//             },
//             {
//                 label: 'Humidity (%)',
//                 data: [30, 35, 40, 45, 50, 55, 60, 55, 50, 45, 40, 35],
//                 borderColor: 'rgba(54, 162, 235, 1)',
//                 fill: false,
//             },
//             {
//                 label: 'Light (Lux)',
//                 data: [200, 220, 240, 260, 280, 300, 320, 310, 300, 280, 260, 240],
//                 borderColor: 'rgba(255, 206, 86, 1)',
//                 fill: false,
//             },
//             {
//                 label: 'Gas (ppm)',
//                 data: [50, 52, 54, 53, 52, 55, 60, 58, 55, 53, 52, 51],
//                 borderColor: 'rgba(75, 192, 192, 1)',
//                 fill: false,
//             }
//         ]
//     },
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true
//             }
//         }
//     }
// });
