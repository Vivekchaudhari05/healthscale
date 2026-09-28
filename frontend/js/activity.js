window.loadActivity = async function () {

    console.log("HealthScale Activity JS loaded");

    try {

        const data = await getInfrastructureData();

        console.log("Activity API data:", data);


        /* ================= SUMMARY ================= */

        document.getElementById(
            "activityInstances"
        ).textContent =
            data.instances.length;


        document.getElementById(
            "activityDesired"
        ).textContent =
            data.desired_capacity;


        document.getElementById(
            "activityAlerts"
        ).textContent =
            data.alerts.length;


        document.getElementById(
            "activityStatus"
        ).textContent =
            "Healthy";


        document.getElementById(
            "activityBadge"
        ).textContent =
            "● Monitoring";


        /* ================= ACTIVITY LIST ================= */

        const activityList =
            document.getElementById(
                "activityList"
            );

        activityList.innerHTML = "";


        const asgActivity =
            document.createElement("div");

        asgActivity.className =
            "activity-item";

        asgActivity.innerHTML =
            "<div class='activity-icon'>ASG</div>" +

            "<div class='activity-content'>" +

            "<strong>" +
            "Auto Scaling Group active" +
            "</strong>" +

            "<p>" +
            data.name +
            " is managing " +
            data.instances.length +
            " EC2 instances with desired capacity " +
            data.desired_capacity +
            "." +
            "</p>" +

            "</div>";


        activityList.appendChild(
            asgActivity
        );


        /* ================= INSTANCE ACTIVITY ================= */

        data.instances.forEach(
            function (instance) {

                const item =
                    document.createElement("div");

                item.className =
                    "activity-item";


                const healthText =
                    instance.health === "Healthy"
                        ? "healthy"
                        : "requires attention";


                item.innerHTML =
                    "<div class='activity-icon'>EC2</div>" +

                    "<div class='activity-content'>" +

                    "<strong>" +
                    "EC2 instance " +
                    instance.instance_id +
                    "</strong>" +

                    "<p>" +
                    "Health: " +
                    instance.health +
                    " | Lifecycle: " +
                    instance.lifecycle +
                    " | Instance is " +
                    healthText +
                    "." +
                    "</p>" +

                    "</div>";


                activityList.appendChild(
                    item
                );

            }
        );


        /* ================= INSTANCE TABLE ================= */

        const tableBody =
            document.getElementById(
                "activityInstancesBody"
            );

        tableBody.innerHTML = "";


        data.instances.forEach(
            function (instance) {

                const row =
                    document.createElement("tr");


                let latestCpu = "--";


                if (
                    instance.cpu &&
                    instance.cpu.length > 0
                ) {

                    latestCpu =
                        instance.cpu[
                            instance.cpu.length - 1
                        ].average + "%";

                }


                row.innerHTML =
                    "<td>" +
                    instance.instance_id +
                    "</td>" +

                    "<td>" +
                    instance.health +
                    "</td>" +

                    "<td>" +
                    instance.lifecycle +
                    "</td>" +

                    "<td>" +
                    latestCpu +
                    "</td>";


                tableBody.appendChild(
                    row
                );

            }
        );


    } catch (error) {

        console.error(
            "Activity page error:",
            error
        );


        document.getElementById(
            "activityStatus"
        ).textContent =
            "Error";


        document.getElementById(
            "activityBadge"
        ).textContent =
            "● Error";

    }

};


document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Activity page initialized"
        );


        window.loadActivity();


        const refreshButton =
            document.querySelector(
                ".refresh-btn"
            );


        if (refreshButton) {

            refreshButton.addEventListener(
                "click",
                function () {

                    window.loadActivity();

                }
            );

        }

    }
);
