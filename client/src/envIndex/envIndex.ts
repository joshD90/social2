const baseUrl = import.meta.env.VITE_BASE_URL;
console.log(baseUrl, "in env index");

const envIndex = { urls: { baseUrl } };

export default envIndex;
