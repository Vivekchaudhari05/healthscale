document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeApplication();

    }
);


/* =========================================================
APPLICATION INITIALIZATION
========================================================= */

function initializeApplication() {

    setupRefreshButton();

}


/* =========================================================
REFRESH BUTTON
========================================================= */

function setupRefreshButton() {

    const refreshButton =
        document.querySelector(
            ".refresh-btn"
        );


    if (!refreshButton) {

        return;

    }


    refreshButton.addEventListener(
        "click",
        function () {

            if (
                typeof refreshDashboard ===
                "function"
            ) {

                refreshDashboard();

            }

            else if (
                typeof loadActivity ===
                "function"
            ) {

                loadActivity();

            }

            else if (
                typeof loadAlerts ===
                "function"
            ) {

                loadAlerts();

            }

            else if (
                typeof loadAutoScaling ===
                "function"
            ) {

                loadAutoScaling();

            }

            else if (
                typeof loadSettings ===
                "function"
            ) {

                loadSettings();

            }

            else if (
                typeof loadMetrics ===
                "function"
            ) {

                loadMetrics();

            }

            else if (
                typeof loadServers ===
                "function"
            ) {

                loadServers();

            }

        }
    );

}


/* =========================================================
NOTIFICATION
========================================================= */

function showNotification(message) {

    let notification =
        document.querySelector(
            ".refresh-notification"
        );


    if (!notification) {

        notification =
            document.createElement("div");


        notification.className =
            "refresh-notification";


        document.body.appendChild(
            notification
        );

    }


    notification.textContent =
        message;


    notification.classList.remove(
        "hide"
    );


    setTimeout(
        function () {

            notification.classList.add(
                "hide"
            );

        },
        2500
    );

}