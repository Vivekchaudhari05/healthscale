const API_BASE_URL = "http://localhost:5000";

async function getInfrastructureData() {
    const response = await fetch(
        `${API_BASE_URL}/api/infrastructure`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch infrastructure data");
    }

    return await response.json();
}