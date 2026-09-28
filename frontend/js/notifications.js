function updateAlerts(data) {

const alerts = data.alerts || [];

const alertContainer =
    document.getElementById("alertsList");

if (!alertContainer) {
    console.warn("Alerts container not found.");
    return;
}

alertContainer.innerHTML = "";


// Count only active ALARM states
const activeAlerts = alerts.filter(function(alert) {
    return alert.state === "ALARM";
});


// Update sidebar notification count
const notificationCount =
    document.getElementById("notificationCount");

if (notificationCount) {
    notificationCount.textContent =
        activeAlerts.length;
}


// No configured alerts
if (alerts.length === 0) {

    const noAlert = document.createElement("div");

    noAlert.className = "alert-item";

    noAlert.innerHTML =
        '<span class="alert-icon success">✓</span>' +

        '<div class="alert-content">' +

            '<strong>No monitoring alerts</strong>' +

            '<small>' +
                'HealthScale has no configured CloudWatch alerts.' +
            '</small>' +

        '</div>';

    alertContainer.appendChild(noAlert);

    return;
}


// Display CloudWatch alarms
alerts.forEach(function(alert) {

    const isAlarm =
        alert.state === "ALARM";

    const statusClass =
        isAlarm ? "warning" : "success";

    const icon =
        isAlarm ? "!" : "✓";

    const statusText =
        isAlarm ? "ALARM" : "OK";


    const alertElement =
        document.createElement("div");

    alertElement.className =
        "alert-item";


    alertElement.innerHTML =

        '<span class="alert-icon ' +
            statusClass +
        '">' +

            icon +

        '</span>' +

        '<div class="alert-content">' +

            '<strong>' +
                alert.name +
            '</strong>' +

            '<small>' +
                statusText +
                ' · ' +
                alert.metric +
                ' · Threshold ' +
                alert.threshold +
            '</small>' +

            '<small>' +
                alert.reason +
            '</small>' +

        '</div>';


    alertContainer.appendChild(
        alertElement
    );

});

}
