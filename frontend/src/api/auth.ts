import axios from "axios";

axios.defaults.withCredentials = true;

export const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getCsrfToken = async () => {
  try {
    const response = await axiosInstance.get("/api/utilisateurs/csrf/");
    const csrfToken = response.data.csrfToken;
    axiosInstance.defaults.headers.common["X-CSRFToken"] = csrfToken;
    return csrfToken;
  } catch (error) {
    console.error("Erreur lors de la récupération du token CSRF :", error);
    throw new Error("Impossible d'obtenir le token CSRF.");
  }
};

export const loginUser = async (usernameOrEmail: string, password: string) => {
  try {
    const csrfToken = await getCsrfToken();

    const response = await axiosInstance.post(
      "/api/token/",
      { username: usernameOrEmail, password },
      { headers: { "X-CSRFToken": csrfToken } }
    );

    if (response.status !== 200) {
      throw new Error("Échec de la connexion. Vérifiez vos identifiants.");
    }

    const data = response.data;
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);

    return data.access;
  } catch (error: any) {
    console.error("Erreur lors de la connexion :", error);
    throw new Error(error.response?.data?.detail || "Échec de la connexion.");
  }
};

export default axiosInstance;
