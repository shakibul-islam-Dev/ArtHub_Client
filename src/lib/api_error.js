import toast from "react-hot-toast";

export async function fetchData(url, errorMessage = "Failed to load data") {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error context (${url}):`, error);

    // Global styled toast used across all pages
    toast.error(errorMessage, {
      duration: 4000,
      style: {
        background: "#FFF5F5",
        color: "#C53030",
        border: "1px solid #FEB2B2",
        fontSize: "14px",
        fontWeight: "500",
      },
    });

    return null; // Return null so your components can gracefully handle the missing data
  }
}
