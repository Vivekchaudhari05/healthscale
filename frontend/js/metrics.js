let metricsChart = null;

document.addEventListener("DOMContentLoaded", function () {


loadMetrics();


});

async function loadMetrics() {


try {

    const response =
        await fetch(
            "http://localhost:5000/api/infrastructure"
        );

    if (!response.ok) {

        throw new Error(
            "Unable to fetch AWS metrics."
        );

    }

    const data =
        await response.json();


    updateMetricSummary(data);

    updateMetricsTable(data);

    createMetricsChart(data);


} catch (error) {

    console.error(
        "Metrics loading error:",
        error
    );

    const tableBody =
        document.getElementById(
            "metricsTableBody"
        );

    if (tableBody) {

        tableBody.innerHTML =
            '<tr>' +
                '<td colspan="5">' +
                    '<div style="' +
                        'padding: 30px;' +
                        'text-align: center;' +
                    '">' +
                        'Unable to load AWS metrics.' +
                        '<br>' +
                        '<small>' +
                            'Make sure the HealthScale backend is running.' +
                        '</small>' +
                    '</div>' +
                '</td>' +
            '</tr>';

    }

}


}

function updateMetricSummary(data) {

const instances =
    data.instances || [];

let totalCpu = 0;

let cpuPoints = 0;


instances.forEach(
    function (instance) {

        const cpuData =
            instance.cpu || [];


        cpuData.forEach(
            function (point) {

                if (
                    point.average !== undefined &&
                    point.average !== null
                ) {

                    totalCpu +=
                        Number(point.average);

                    cpuPoints++;

                }

            }
        );

    }
);


const averageCpu =
    cpuPoints > 0
        ? totalCpu / cpuPoints
        : 0;


const requests =
    data.requests || [];


let latestRequests = 0;


if (requests.length > 0) {

    latestRequests =
        requests[
            requests.length - 1
        ].requests || 0;

}


const averageCpuElement =
    document.getElementById(
        "averageCpu"
    );


const requestCountElement =
    document.getElementById(
        "requestCount"
    );


const instanceCountElement =
    document.getElementById(
        "instanceCount"
    );


const monitoringStatusElement =
    document.getElementById(
        "monitoringStatus"
    );


const albRequestsElement =
    document.getElementById(
        "albRequests"
    );


if (averageCpuElement) {

    averageCpuElement.textContent =
        averageCpu.toFixed(2) + "%";

}


if (requestCountElement) {

    requestCountElement.textContent =
        latestRequests;

}


if (instanceCountElement) {

    instanceCountElement.textContent =
        instances.length;

}


if (monitoringStatusElement) {

    monitoringStatusElement.textContent =
        "Active";

}


if (albRequestsElement) {

    albRequestsElement.textContent =
        latestRequests;

}


}

function updateMetricsTable(data) {


const tableBody =
    document.getElementById(
        "metricsTableBody"
    );


if (!tableBody) {
    return;
}


const instances =
    data.instances || [];


if (instances.length === 0) {

    tableBody.innerHTML =
        '<tr>' +
            '<td colspan="5">' +
                'No EC2 instances found.' +
            '</td>' +
        '</tr>';

    return;

}


tableBody.innerHTML = "";


instances.forEach(
    function (instance) {

        const cpu =
            getLatestCpu(
                instance.cpu
            );


        const status =
            instance.lifecycle ===
            "InService"
                ? "Running"
                : instance.lifecycle;


        const statusClass =
            instance.lifecycle ===
            "InService"
                ? "running"
                : "warning";


        const healthClass =
            instance.health ===
            "Healthy"
                ? "healthy"
                : "warning";


        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML =

            '<td>' +
                '<strong>' +
                    instance.instance_id +
                '</strong>' +
            '</td>' +

            '<td>' +
                '<span class="badge ' +
                    statusClass +
                '">' +
                    '● ' +
                    status +
                '</span>' +
            '</td>' +

            '<td>' +
                '<span class="health-status ' +
                    healthClass +
                '">' +
                    '● ' +
                    instance.health +
                '</span>' +
            '</td>' +

            '<td>' +
                '<strong>' +
                    cpu +
                '</strong>' +
            '</td>' +

            '<td>' +
                instance.lifecycle +
            '</td>';


        tableBody.appendChild(
            row
        );

    }
);


}

function getLatestCpu(cpuData) {


if (
    !cpuData ||
    cpuData.length === 0
) {

    return "--";

}


const latest =
    cpuData[
        cpuData.length - 1
    ];


if (
    latest.average === undefined ||
    latest.average === null
) {

    return "--";

}


return (
    Number(latest.average).toFixed(2) +
    "%"
);


}

function createMetricsChart(data) {


const canvas =
    document.getElementById(
        "metricsChart"
    );


if (!canvas) {
    return;
}


const ctx =
    canvas.getContext("2d");


const requests =
    data.requests || [];


const firstInstance =
    data.instances &&
    data.instances.length > 0
        ? data.instances[0]
        : null;


const cpuData =
    firstInstance &&
    firstInstance.cpu
        ? firstInstance.cpu
        : [];


const cpuLabels =
    cpuData.map(
        function (point) {

            return new Date(
                point.timestamp
            ).toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        }
    );


const cpuValues =
    cpuData.map(
        function (point) {

            return Number(
                point.average
            );

        }
    );


const requestLabels =
    requests.map(
        function (point) {

            return new Date(
                point.timestamp
            ).toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        }
    );


const requestValues =
    requests.map(
        function (point) {

            return Number(
                point.requests
            );

        }
    );


const selector =
    document.getElementById(
        "metricSelector"
    );


if (metricsChart) {

    metricsChart.destroy();

}


metricsChart =
    new Chart(
        ctx,
        {
            type: "line",

            data: {

                labels: cpuLabels,

                datasets: [

                    {

                        label:
                            "CPU Utilization",

                        data:
                            cpuValues,

                        borderColor:
                            "#38bdf8",

                        backgroundColor:
                            "rgba(56, 189, 248, 0.08)",

                        borderWidth: 2,

                        pointRadius: 3,

                        pointHoverRadius: 5,

                        fill: true,

                        tension: 0.35

                    }

                ]

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

                            label:
                                function (context) {

                                    return (
                                        " CPU: " +
                                        context.parsed.y +
                                        "%"
                                    );

                                }

                        }

                    }

                },


                scales: {

                    x: {

                        grid: {

                            display: false

                        }

                    },


                    y: {

                        beginAtZero: true,

                        max: 100,

                        ticks: {

                            callback:
                                function (value) {

                                    return (
                                        value +
                                        "%"
                                    );

                                }

                        }

                    }

                }

            }

        }
    );


if (selector) {

    selector.addEventListener(
        "change",
        function () {

            if (
                this.value ===
                "requests"
            ) {

                updateChartToRequests(
                    requestLabels,
                    requestValues
                );

            } else {

                updateChartToCpu(
                    cpuLabels,
                    cpuValues
                );

            }

        }
    );

}


}

function updateChartToRequests(
labels,
values
) {


if (!metricsChart) {
    return;
}


metricsChart.data.labels =
    labels;


metricsChart.data.datasets[0].label =
    "Request Count";


metricsChart.data.datasets[0].data =
    values;


metricsChart.options.scales.y.max =
    getRequestChartMax(values);


metricsChart.options.scales.y.ticks.callback =
    function (value) {

        return value;

    };


metricsChart.options.plugins.tooltip.callbacks.label =
    function (context) {

        return (
            " Requests: " +
            context.parsed.y
        );

    };


metricsChart.update();


}

function updateChartToCpu(
labels,
values
) {


if (!metricsChart) {
    return;
}


metricsChart.data.labels =
    labels;


metricsChart.data.datasets[0].label =
    "CPU Utilization";


metricsChart.data.datasets[0].data =
    values;


metricsChart.options.scales.y.max =
    100;


metricsChart.options.scales.y.ticks.callback =
    function (value) {

        return (
            value +
            "%"
        );

    };


metricsChart.options.plugins.tooltip.callbacks.label =
    function (context) {

        return (
            " CPU: " +
            context.parsed.y +
            "%"
        );

    };


metricsChart.update();


}

function getRequestChartMax(values) {


if (!values || values.length === 0) {

    return 10;

}


const highest =
    Math.max.apply(
        null,
        values
    );


if (highest <= 10) {

    return 10;

}


return Math.ceil(
    highest * 1.2
);

}
