
window.loadAlerts = async function () {

    console.log("HealthScale Alerts JS loaded");

    try {

        const data = await getInfrastructureData();

        console.log("Alerts API data:", data);

        const alerts = data.alerts || [];

        const totalAlerts =
            document.getElementById("totalAlerts");

        const okAlerts =
            document.getElementById("okAlerts");

        const alarmAlerts =
            document.getElementById("alarmAlerts");

        const monitoringStatus =
            document.getElementById("monitoringStatus");

        const alertSystemStatus =
            document.getElementById("alertSystemStatus");

        totalAlerts.textContent =
            alerts.length;

        const okCount = alerts.filter(function (alert) {
            return alert.state === "OK";
        }).length;

        const alarmCount = alerts.filter(function (alert) {
            return alert.state === "ALARM";
        }).length;

        okAlerts.textContent =
            okCount;

        alarmAlerts.textContent =
            alarmCount;

        monitoringStatus.textContent =
            "Active";

        alertSystemStatus.textContent =
            "● Monitoring";


        const tableBody =
            document.getElementById("alertsTableBody");

        tableBody.innerHTML = "";


        if (alerts.length === 0) {

            tableBody.innerHTML =
                "<tr>" +
                "<td colspan='5'>" +
                "No CloudWatch alarms found." +
                "</td>" +
                "</tr>";

            return;
        }


        alerts.forEach(function (alert) {

            const row =
                document.createElement("tr");

            const stateClass =
                alert.state === "OK"
                    ? "running"
                    : "danger";


            row.innerHTML =
                "<td>" +
                alert.name +
                "</td>" +

                "<td>" +
                "<span class='badge " +
                stateClass +
                "'>" +
                alert.state +
                "</span>" +
                "</td>" +

                "<td>" +
                alert.metric +
                "</td>" +

                "<td>" +
                alert.threshold +
                "</td>" +

                "<td>" +
                formatAlertTime(alert.updated) +
                "</td>";


            row.addEventListener(
                "click",
                function () {

                    showAlertDetails(alert);

                }
            );


            tableBody.appendChild(row);

        });


        if (alerts.length > 0) {

            showAlertDetails(
                alerts[0]
            );

        }

    } catch (error) {

        console.error(
            "Alerts page error:",
            error
        );

        document.getElementById(
            "monitoringStatus"
        ).textContent = "Error";

        document.getElementById(
            "alertSystemStatus"
        ).textContent = "● Error";

    }

};


function showAlertDetails(alert) {

    document.getElementById(
        "detailAlarmName"
    ).textContent =
        alert.name || "--";


    document.getElementById(
        "detailState"
    ).textContent =
        alert.state || "--";


    document.getElementById(
        "detailMetric"
    ).textContent =
        alert.metric || "--";


    document.getElementById(
        "detailThreshold"
    ).textContent =
        alert.threshold !== undefined
            ? alert.threshold
            : "--";


    document.getElementById(
        "detailReason"
    ).textContent =
        alert.reason || "--";

}


function formatAlertTime(timestamp) {

    if (!timestamp) {
        return "--";
    }

    const date =
        new Date(timestamp);

    return date.toLocaleString();

}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Alerts page initialized"
        );

        window.loadAlerts();


        const refreshButton =
            document.querySelector(
                ".refresh-btn"
            );


        if (refreshButton) {

            refreshButton.addEventListener(
                "click",
                function () {

                    window.loadAlerts();

                }
            );

        }

    }
);
