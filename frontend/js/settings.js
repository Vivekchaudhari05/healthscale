window.loadSettings = async function () {

    console.log("HealthScale Settings JS loaded");

    try {

        const data = await getInfrastructureData();

        console.log("Settings API data:", data);


        /* ================= BASIC STATUS ================= */

        document.getElementById(
            "settingsRegion"
        ).textContent =
            "ap-south-1";


        document.getElementById(
            "settingsAsgStatus"
        ).textContent =
            "Healthy";


        document.getElementById(
            "settingsMonitoring"
        ).textContent =
            "Active";


        document.getElementById(
            "settingsApiStatus"
        ).textContent =
            "Online";


        document.getElementById(
            "settingsBadge"
        ).textContent =
            "● Connected";


        /* ================= AWS CONFIGURATION ================= */

        document.getElementById(
            "configRegion"
        ).textContent =
            "ap-south-1";


        document.getElementById(
            "configAsg"
        ).textContent =
            data.name;


        /* ================= SCALING CONFIGURATION ================= */

        document.getElementById(
            "configMin"
        ).textContent =
            data.min_capacity;


        document.getElementById(
            "configDesired"
        ).textContent =
            data.desired_capacity;


        document.getElementById(
            "configMax"
        ).textContent =
            data.max_capacity;


        /* ================= MONITORING ================= */

        const cloudwatchStatus =
            document.getElementById(
                "cloudwatchStatus"
            );


        if (cloudwatchStatus) {

            cloudwatchStatus.textContent =
                data.alerts &&
                data.alerts.length > 0
                    ? "Active"
                    : "No Alarms";

        }


    } catch (error) {

        console.error(
            "Settings page error:",
            error
        );


        document.getElementById(
            "settingsAsgStatus"
        ).textContent =
            "Error";


        document.getElementById(
            "settingsMonitoring"
        ).textContent =
            "Error";


        document.getElementById(
            "settingsApiStatus"
        ).textContent =
            "Offline";


        document.getElementById(
            "settingsBadge"
        ).textContent =
            "● Error";

    }

};


/* ================= PAGE INITIALIZATION ================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Settings page initialized"
        );


        window.loadSettings();


        const refreshButton =
            document.querySelector(
                ".refresh-btn"
            );


        if (refreshButton) {

            refreshButton.addEventListener(
                "click",
                function () {

                    window.loadSettings();

                }
            );

        }

    }
);
