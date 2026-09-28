/* =========================================================
   HEALTHSCALE
   Real AWS Dashboard Controller
   ========================================================= */


/* =========================================================
   DASHBOARD STATE
========================================================= */

let dashboardState = {

    instances: 0,

    healthyInstances: 0,

    cpu: 0,

    requests: 0,

    alerts: 0,

    minCapacity: 0,

    desiredCapacity: 0,

    maxCapacity: 0

};


/* =========================================================
   UPDATE DASHBOARD FROM AWS
========================================================= */

async function updateDashboard() {

    try {

        const data =
            await getInfrastructureData();


        console.log(
            "Real AWS dashboard data:",
            data
        );


        /* =================================================
           INSTANCE INFORMATION
        ================================================= */

        const instances =
            data.instances || [];


        dashboardState.instances =
            instances.length;


        /*
           Backend returns:

           state: "running"

           We check the real EC2 instance state.
        */

        dashboardState.healthyInstances =
            instances.filter(
                function (instance) {

                    return (
                        instance.state ===
                        "running"
                    );

                }
            ).length;


        /* =================================================
           AUTO SCALING INFORMATION
        ================================================= */

        dashboardState.minCapacity =
            data.autoscaling?.min_capacity || 0;


        dashboardState.desiredCapacity =
            data.autoscaling?.desired_capacity || 0;


        dashboardState.maxCapacity =
            data.autoscaling?.max_capacity || 0;


        /* =================================================
           REQUEST INFORMATION
        ================================================= */

        const requests =
            data.requests || [];


        if (requests.length > 0) {

            let latestRequest = 0;


            for (
                let i = requests.length - 1;
                i >= 0;
                i--
            ) {

                if (
                    requests[i].requests > 0
                ) {

                    latestRequest =
                        requests[i].requests;

                    break;

                }

            }


            dashboardState.requests =
                latestRequest;

        }

        else {

            dashboardState.requests = 0;

        }


        /* =================================================
           CPU INFORMATION
        ================================================= */

        const averageCpu =
            data.metrics?.average_cpu || 0;


        dashboardState.cpu =
            Number(averageCpu);


        /* =================================================
           ALERT INFORMATION
        ================================================= */

        const alerts =
            data.alerts || [];


        dashboardState.alerts =
            alerts.filter(
                function (alert) {

                    return (
                        alert.state ===
                        "ALARM"
                    );

                }
            ).length;


        /* =================================================
           UPDATE UI
        ================================================= */

        updateMetricCards();

        updateAutoScaling();

        updateSystemStatus();

        updateAlerts(data);

        updateEC2Table(data);


        /* =================================================
           UPDATE PERFORMANCE CHART
        ================================================= */

        const selector =
            document.getElementById(
                "metricSelector"
            );


        const selectedMetric =
            selector
                ? selector.value
                : "cpu";


        if (
            selectedMetric ===
            "requests"
        ) {

            updateRealRequestChart(
                data
            );

        }

        else {

            updateRealCpuChart(
                data
            );

        }

    }

    catch (error) {

        console.error(
            "AWS Dashboard API error:",
            error
        );

    }

}


/* =========================================================
   EC2 INSTANCES TABLE
========================================================= */

function updateEC2Table(data) {

    /*
       Try to find the table body using the
       expected ID first.
    */

    let tableBody =
        document.getElementById(
            "instancesTableBody"
        );


    /*
       If the ID does not exist, try common
       table selectors.
    */

    if (!tableBody) {

        tableBody =
            document.querySelector(
                ".instances-table tbody"
            );

    }


    if (!tableBody) {

        tableBody =
            document.querySelector(
                "#instancesTable tbody"
            );

    }


    /*
       Final fallback:
       Find a table containing an
       "INSTANCE" header.
    */

    if (!tableBody) {

        const tables =
            document.querySelectorAll(
                "table"
            );


        for (
            let i = 0;
            i < tables.length;
            i++
        ) {

            const tableText =
                tables[i]
                    .innerText
                    .toUpperCase();


            if (
                tableText.includes(
                    "INSTANCE"
                )
            ) {

                tableBody =
                    tables[i]
                        .querySelector(
                            "tbody"
                        );

                break;

            }

        }

    }


    /*
       Table not found.
    */

    if (!tableBody) {

        console.warn(
            "EC2 instances table body not found."
        );

        return;

    }


    const instances =
        data.instances || [];


    /*
       Clear existing rows.
    */

    tableBody.innerHTML = "";


    /*
       No instances.
    */

    if (instances.length === 0) {

        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `
            <td colspan="5" style="text-align:center;">
                No EC2 instances found
            </td>
        `;


        tableBody.appendChild(
            row
        );


        return;

    }


    /*
       Create one row for every
       EC2 instance returned by AWS.
    */

    instances.forEach(
        function (instance) {

            const row =
                document.createElement(
                    "tr"
                );


            const state =
                instance.state ||
                "unknown";


            const isRunning =
                state.toLowerCase() ===
                "running";


            /*
               Instance ID
            */

            const instanceId =
                instance.instance_id ||
                "N/A";


            /*
               Instance type
            */

            const instanceType =
                instance.instance_type ||
                "N/A";


            /*
               Availability Zone
            */

            const availabilityZone =
                instance.availability_zone ||
                "N/A";


            /*
               Public IP
            */

            const publicIp =
                instance.public_ip ||
                "N/A";


            /*
               Create row
            */

            row.innerHTML = `

                <td>
                    <strong>
                        ${instanceId}
                    </strong>
                </td>

                <td>
                    <span class="status-badge ${
                        isRunning
                            ? "success"
                            : "danger"
                    }">
                        ${state}
                    </span>
                </td>

                <td>
                    ${instanceType}
                </td>

                <td>
                    ${availabilityZone}
                </td>

                <td>
                    ${publicIp}
                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   METRIC CARDS
========================================================= */

function updateMetricCards() {

    const cards =
        document.querySelectorAll(
            ".metric-card"
        );


    if (cards.length < 4) {

        return;

    }


    /* =================================================
       EC2
    ================================================= */

    const instanceValue =
        cards[0].querySelector(
            ".metric-value"
        );


    if (instanceValue) {

        instanceValue.textContent =
            dashboardState.instances;

    }


    const instanceFooter =
        cards[0].querySelector(
            ".metric-footer"
        );


    if (instanceFooter) {

        instanceFooter.textContent =
            "● " +
            dashboardState.healthyInstances +
            " Healthy";

    }


    /* =================================================
       CPU
    ================================================= */

    const cpuValue =
        cards[1].querySelector(
            ".metric-value"
        );


    if (cpuValue) {

        cpuValue.textContent =
            dashboardState.cpu +
            "%";

    }


    /* =================================================
       REQUESTS
    ================================================= */

    const requestValue =
        cards[2].querySelector(
            ".metric-value"
        );


    if (requestValue) {

        requestValue.textContent =
            dashboardState.requests
                .toLocaleString();

    }


    /* =================================================
       ALERTS
    ================================================= */

    const alertValue =
        cards[3].querySelector(
            ".metric-value"
        );


    if (alertValue) {

        alertValue.textContent =
            dashboardState.alerts;

    }


    const alertFooter =
        cards[3].querySelector(
            ".metric-footer"
        );


    if (alertFooter) {

        if (
            dashboardState.alerts > 0
        ) {

            alertFooter.textContent =
                "● Active alarm";


            alertFooter.classList.remove(
                "positive"
            );

        }

        else {

            alertFooter.textContent =
                "● Monitoring normal";


            alertFooter.classList.add(
                "positive"
            );

        }

    }


    /* =================================================
       SIDEBAR NOTIFICATION
    ================================================= */

    const notification =
        document.querySelector(
            ".notification-count"
        );


    if (notification) {

        notification.textContent =
            dashboardState.alerts;

    }

}


/* =========================================================
   AUTO SCALING
========================================================= */

function updateAutoScaling() {

    const scalingItems =
        document.querySelectorAll(
            ".scaling-item strong"
        );


    if (scalingItems.length >= 3) {

        /*
           MIN
        */

        scalingItems[0].textContent =
            dashboardState.minCapacity;


        /*
           DESIRED
        */

        scalingItems[1].textContent =
            dashboardState.desiredCapacity;


        /*
           MAX
        */

        scalingItems[2].textContent =
            dashboardState.maxCapacity;

    }


    /* =================================================
       CPU PROGRESS
    ================================================= */

    const progress =
        document.querySelector(
            ".progress-fill"
        );


    if (progress) {

        progress.style.width =
            Math.min(
                dashboardState.cpu,
                100
            ) + "%";

    }


    const cpuText =
        document.querySelector(
            ".cpu-target small"
        );


    if (cpuText) {

        cpuText.textContent =
            "Current average CPU: " +
            dashboardState.cpu +
            "%";

    }


    /* =================================================
       SCALING STATE
    ================================================= */

    const scalingState =
        document.querySelector(
            ".scaling-state strong"
        );


    const scalingDescription =
        document.querySelector(
            ".scaling-state small"
        );


    if (
        dashboardState.cpu >= 50
    ) {

        if (scalingState) {

            scalingState.textContent =
                "Scaling Activity";

        }


        if (scalingDescription) {

            scalingDescription.textContent =
                "CPU is at or above target";

        }

    }

    else {

        if (scalingState) {

            scalingState.textContent =
                "Scaling Stable";

        }


        if (scalingDescription) {

            scalingDescription.textContent =
                "CPU is below target";

        }

    }

}


/* =========================================================
   SYSTEM STATUS
========================================================= */

function updateSystemStatus() {

    const status =
        document.querySelector(
            ".system-status span:last-child"
        );


    if (!status) {

        return;

    }


    if (
        dashboardState.instances > 0 &&
        dashboardState.healthyInstances ===
        dashboardState.instances
    ) {

        status.textContent =
            "System Operational";

    }

    else {

        status.textContent =
            "System Attention Required";

    }

}


/* =========================================================
   ALERTS
========================================================= */

function updateAlerts(data) {

    const alerts =
        data.alerts || [];


    const alertsList =
        document.getElementById(
            "alertsList"
        );


    if (!alertsList) {

        return;

    }


    alertsList.innerHTML = "";


    if (alerts.length === 0) {

        alertsList.innerHTML =
            "<div class='alert-item'>" +

            "<span class='alert-icon success'>" +
            "✓" +
            "</span>" +

            "<div class='alert-content'>" +

            "<strong>" +
            "No CloudWatch alarms found" +
            "</strong>" +

            "<small>" +
            "HealthScale monitoring is active" +
            "</small>" +

            "</div>" +

            "</div>";

        return;

    }


    alerts.forEach(
        function (alert) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "alert-item";


            const isAlarm =
                alert.state ===
                "ALARM";


            const iconClass =
                isAlarm
                    ? "danger"
                    : "success";


            const icon =
                isAlarm
                    ? "!"
                    : "✓";


            const title =
                isAlarm
                    ? "CloudWatch alarm active"
                    : "CloudWatch alarm normal";


            item.innerHTML =
                "<span class='alert-icon " +
                iconClass +
                "'>" +
                icon +
                "</span>" +

                "<div class='alert-content'>" +

                "<strong>" +
                title +
                "</strong>" +

                "<small>" +
                alert.name +
                " — " +
                alert.state +
                "</small>" +

                "</div>";


            alertsList.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   REAL CPU CHART
========================================================= */

function updateRealCpuChart(data) {

    if (
        typeof performanceChart ===
            "undefined" ||
        !performanceChart
    ) {

        return;

    }


    /*
       Backend provides current
       average CPU.
    */

    const currentCpu =
        Number(
            data.metrics?.average_cpu || 0
        );


    const currentTime =
        new Date().toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    performanceChart.data.labels = [
        currentTime
    ];


    if (
        performanceChart.data.datasets
            .length > 0
    ) {

        performanceChart.data.datasets[0]
            .label =
            "CPU Utilization";


        performanceChart.data.datasets[0]
            .data = [
                currentCpu
            ];

    }


    if (
        performanceChart.options.scales &&
        performanceChart.options.scales.y
    ) {

        performanceChart.options.scales.y.min =
            0;


        performanceChart.options.scales.y.max =
            100;


        performanceChart.options.scales.y.ticks
            .callback =
            function (value) {

                return value + "%";

            };

    }


    performanceChart.update();

}


/* =========================================================
   REAL REQUEST CHART
========================================================= */

function updateRealRequestChart(data) {

    if (
        typeof performanceChart ===
            "undefined" ||
        !performanceChart
    ) {

        return;

    }


    const requests =
        data.requests || [];


    if (requests.length === 0) {

        performanceChart.data.labels = [
            "No data"
        ];


        if (
            performanceChart.data.datasets
                .length > 0
        ) {

            performanceChart.data.datasets[0]
                .label =
                "Request Count";


            performanceChart.data.datasets[0]
                .data = [
                    0
                ];

        }


        performanceChart.update();

        return;

    }


    const labels =
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


    const values =
        requests.map(
            function (point) {

                return point.requests;

            }
        );


    performanceChart.data.labels =
        labels;


    if (
        performanceChart.data.datasets
            .length > 0
    ) {

        performanceChart.data.datasets[0]
            .label =
            "Request Count";


        performanceChart.data.datasets[0]
            .data =
            values;

    }


    if (
        performanceChart.options.scales &&
        performanceChart.options.scales.y
    ) {

        performanceChart.options.scales.y.min =
            0;


        performanceChart.options.scales.y.max =
            undefined;


        performanceChart.options.scales.y.ticks
            .callback =
            function (value) {

                return value;

            };

    }


    performanceChart.update();

}


/* =========================================================
   REFRESH DASHBOARD
========================================================= */

async function refreshDashboard() {

    const button =
        document.querySelector(
            ".refresh-btn"
        );


    if (button) {

        button.disabled = true;


        button.textContent =
            "↻ Refreshing...";

    }


    try {

        await updateDashboard();

    }

    finally {

        if (button) {

            button.disabled = false;


            button.textContent =
                "↻ Refresh";

        }

    }


    showRefreshNotification();

}


/* =========================================================
   REFRESH NOTIFICATION
========================================================= */

function showRefreshNotification() {

    const notification =
        document.createElement(
            "div"
        );


    notification.className =
        "refresh-notification";


    const icon =
        document.createElement(
            "span"
        );


    icon.textContent =
        "✓";


    const content =
        document.createElement(
            "div"
        );


    const title =
        document.createElement(
            "strong"
        );


    title.textContent =
        "Dashboard Updated";


    const message =
        document.createElement(
            "small"
        );


    message.textContent =
        "AWS monitoring data refreshed successfully";


    content.appendChild(
        title
    );


    content.appendChild(
        message
    );


    notification.appendChild(
        icon
    );


    notification.appendChild(
        content
    );


    document.body.appendChild(
        notification
    );


    setTimeout(
        function () {

            notification.classList.add(
                "hide"
            );


            setTimeout(
                function () {

                    notification.remove();

                },
                300
            );

        },
        2500
    );

}


/* =========================================================
   AUTO REFRESH
========================================================= */

function startAutoRefresh() {

    setInterval(
        function () {

            updateDashboard();

        },
        30000
    );

}


/* =========================================================
   METRIC SELECTOR
========================================================= */

function setupMetricSelector() {

    const selector =
        document.getElementById(
            "metricSelector"
        );


    if (!selector) {

        return;

    }


    selector.addEventListener(
        "change",
        async function () {

            try {

                const data =
                    await getInfrastructureData();


                if (
                    selector.value ===
                    "requests"
                ) {

                    updateRealRequestChart(
                        data
                    );

                }

                else {

                    updateRealCpuChart(
                        data
                    );

                }

            }

            catch (error) {

                console.error(
                    "Metric selector error:",
                    error
                );

            }

        }
    );

}


/* =========================================================
   INITIALIZE DASHBOARD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateDashboard();

        setupMetricSelector();

        startAutoRefresh();

    }
);