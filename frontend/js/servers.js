document.addEventListener("DOMContentLoaded", function () {


loadServers();


});

/* =========================================================
LOAD SERVER DATA
========================================================= */

async function loadServers() {


const tableBody =
    document.getElementById("serversTableBody");


if (!tableBody) {
    return;
}


/*
 * Loading state
 */

tableBody.innerHTML =

    '<tr>' +

        '<td colspan="6">' +

            '<div style="' +
                'padding: 30px;' +
                'text-align: center;' +
            '">' +

                'Loading AWS EC2 instances...' +

            '</div>' +

        '</td>' +

    '</tr>';


try {

    const response =
        await fetch(
            "http://localhost:5000/api/infrastructure"
        );


    if (!response.ok) {

        throw new Error(
            "Unable to fetch AWS infrastructure data."
        );

    }


    const data =
        await response.json();


    updateServerSummary(data);

    updateServerTable(data);

    updateAutoScalingSummary(data);


} catch (error) {

    console.error(
        "Server loading error:",
        error
    );


    tableBody.innerHTML =

        '<tr>' +

            '<td colspan="6">' +

                '<div style="' +
                    'padding: 30px;' +
                    'text-align: center;' +
                '">' +

                    'Unable to load AWS server data.' +

                    '<br>' +

                    '<small>' +
                        'Make sure the HealthScale backend is running.' +
                    '</small>' +

                '</div>' +

            '</td>' +

        '</tr>';

}


}

/* =========================================================
SERVER SUMMARY
========================================================= */

function updateServerSummary(data) {


const instances =
    data.instances || [];


const healthyInstances =
    instances.filter(
        function (instance) {

            return (
                instance.health ===
                "Healthy"
            );

        }
    );


const serverCount =
    document.getElementById(
        "serverCount"
    );


const healthyServerCount =
    document.getElementById(
        "healthyServerCount"
    );


const desiredServerCount =
    document.getElementById(
        "desiredServerCount"
    );


const maxServerCount =
    document.getElementById(
        "maxServerCount"
    );


if (serverCount) {

    serverCount.textContent =
        instances.length;

}


if (healthyServerCount) {

    healthyServerCount.textContent =
        healthyInstances.length;

}


if (desiredServerCount) {

    desiredServerCount.textContent =
        data.desired_capacity ?? 0;

}


if (maxServerCount) {

    maxServerCount.textContent =
        data.max_capacity ?? 0;

}


}

/* =========================================================
SERVER TABLE
========================================================= */

function updateServerTable(data) {


const tableBody =
    document.getElementById(
        "serversTableBody"
    );


if (!tableBody) {
    return;
}


const instances =

    data.instances || [];


if (instances.length === 0) {

    tableBody.innerHTML =

        '<tr>' +

            '<td colspan="6">' +

                '<div style="' +
                    'padding: 30px;' +
                    'text-align: center;' +
                '">' +

                    'No EC2 instances found.' +

                '</div>' +

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

                '<div class="instance-info">' +

                    '<div class="instance-icon">' +
                        'EC2' +
                    '</div>' +

                    '<div>' +

                        '<strong>' +
                            instance.instance_id +
                        '</strong>' +

                        '<small>' +
                            'AWS EC2' +
                        '</small>' +

                    '</div>' +

                '</div>' +

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

                '<span>' +
                    instance.lifecycle +
                '</span>' +

            '</td>' +


            '<td>' +

                '<span>' +
                    'ap-south-1' +
                '</span>' +

            '</td>';


        tableBody.appendChild(
            row
        );

    }
);


}

/* =========================================================
LATEST CPU
========================================================= */

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

/* =========================================================
AUTO SCALING SUMMARY
========================================================= */

function updateAutoScalingSummary(data) {

const min =
    document.getElementById(
        "asgMin"
    );


const desired =
    document.getElementById(
        "asgDesired"
    );


const max =
    document.getElementById(
        "asgMax"
    );


if (min) {

    min.textContent =
        data.min_capacity ?? 0;

}


if (desired) {

    desired.textContent =
        data.desired_capacity ?? 0;

}


if (max) {

    max.textContent =
        data.max_capacity ?? 0;

}


}
