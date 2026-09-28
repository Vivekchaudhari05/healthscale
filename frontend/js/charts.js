let performanceChart;

const cpuData = [31, 35, 38, 34, 42, 47, 44, 51, 46, 43, 40, 42];

const requestData = [820, 910, 1040, 980, 1120, 1180, 1090, 1320, 1250, 1210, 1270, 1284];

const chartLabels = [
    "10:00",
    "10:05",
    "10:10",
    "10:15",
    "10:20",
    "10:25",
    "10:30",
    "10:35",
    "10:40",
    "10:45",
    "10:50",
    "10:55"
];

function createPerformanceChart() {

    const canvas = document.getElementById("performanceChart");

    if (!canvas) {
        console.error("Chart canvas not found.");
        return;
    }

    const ctx = canvas.getContext("2d");

    performanceChart = new Chart(ctx, {

        type: "line",

        data: {
            labels: chartLabels,

            datasets: [{
                label: "CPU Utilization",
                data: cpuData,

                borderColor: "#38bdf8",
                backgroundColor: "rgba(56, 189, 248, 0.08)",

                borderWidth: 2,

                pointRadius: 2,
                pointHoverRadius: 5,

                fill: true,

                tension: 0.4
            }]
        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            interaction: {
                mode: "index",
                intersect: false
            },

            plugins: {

                legend: {
                    display: false
                },

                tooltip: {

                    callbacks: {

                        label: function(context) {

                            return " CPU: " +
                                context.parsed.y +
                                "%";

                        }

                    }

                }

            },

            scales: {

                x: {

                    grid: {
                        display: false
                    },

                    ticks: {
                        color: "#64748b",
                        font: {
                            size: 9
                        }
                    }

                },

                y: {

                    min: 0,
                    max: 100,

                    ticks: {

                        color: "#64748b",

                        callback: function(value) {
                            return value + "%";
                        }

                    }

                }

            }

        }

    });

}


/* ==========================================
   SWITCH BETWEEN CPU AND REQUESTS
   ========================================== */

function updatePerformanceChart(metric) {

    if (!performanceChart) {
        console.error("Performance chart is not initialized.");
        return;
    }

    if (metric === "requests") {

        performanceChart.data.datasets[0].label =
            "Request Count";

        performanceChart.data.datasets[0].data =
            requestData;

        performanceChart.data.datasets[0].borderColor =
            "#a78bfa";

        performanceChart.data.datasets[0].backgroundColor =
            "rgba(167, 139, 250, 0.08)";

        performanceChart.options.scales.y.min =
            0;

        performanceChart.options.scales.y.max =
            1500;

        performanceChart.options.scales.y.ticks.callback =
            function(value) {

                return value;

            };

        performanceChart.options.plugins.tooltip.callbacks.label =
            function(context) {

                return " Requests: " +
                    context.parsed.y;

            };

    } else {

        performanceChart.data.datasets[0].label =
            "CPU Utilization";

        performanceChart.data.datasets[0].data =
            cpuData;

        performanceChart.data.datasets[0].borderColor =
            "#38bdf8";

        performanceChart.data.datasets[0].backgroundColor =
            "rgba(56, 189, 248, 0.08)";

        performanceChart.options.scales.y.min =
            0;

        performanceChart.options.scales.y.max =
            100;

        performanceChart.options.scales.y.ticks.callback =
            function(value) {

                return value + "%";

            };

        performanceChart.options.plugins.tooltip.callbacks.label =
            function(context) {

                return " CPU: " +
                    context.parsed.y +
                    "%";

            };

    }

    performanceChart.update();

}


/* ==========================================
   INITIALIZE
   ========================================== */

document.addEventListener("DOMContentLoaded", function() {

    createPerformanceChart();

    const selector =
        document.getElementById("metricSelector");

    if (selector) {

        selector.addEventListener("change", function() {

            updatePerformanceChart(
                this.value
            );

        });

    }

});