window.loadAutoScaling = async function () {

    console.log("HealthScale Auto Scaling JS loaded");

    try {

        const data = await getInfrastructureData();

        console.log("Auto Scaling API data:", data);

        document.getElementById("minCapacity").textContent =
            data.min_capacity;

        document.getElementById("desiredCapacity").textContent =
            data.desired_capacity;

        document.getElementById("maxCapacity").textContent =
            data.max_capacity;

        document.getElementById("runningInstances").textContent =
            data.instances.length;

        document.getElementById("asgName").textContent =
            data.name;

        document.getElementById("capacityMin").textContent =
            data.min_capacity;

        document.getElementById("capacityDesired").textContent =
            data.desired_capacity;

        document.getElementById("capacityMax").textContent =
            data.max_capacity;

        const statusElement =
            document.getElementById("asgStatus");

        if (statusElement) {
            statusElement.textContent = "Healthy";
        }

        const tableBody =
            document.getElementById("scalingInstancesBody");

        if (tableBody) {

            tableBody.innerHTML = "";

            data.instances.forEach(function (instance) {

                const row = document.createElement("tr");

                row.innerHTML =
                    "<td>" + instance.instance_id + "</td>" +
                    "<td>" + instance.health + "</td>" +
                    "<td>" + instance.lifecycle + "</td>";

                tableBody.appendChild(row);

            });
        }

    } catch (error) {

        console.error(
            "Auto Scaling page error:",
            error
        );

        const statusElement =
            document.getElementById("asgStatus");

        if (statusElement) {
            statusElement.textContent = "Error";
        }
    }
};


document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Auto Scaling page initialized"
        );

        window.loadAutoScaling();

        const refreshButton =
            document.querySelector(".refresh-btn");

        if (refreshButton) {

            refreshButton.addEventListener(
                "click",
                function () {

                    window.loadAutoScaling();

                }
            );

        }

    }
);
