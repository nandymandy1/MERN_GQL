import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers = { "Content-Type": "application/json" };

export const postData = async (field, headers) => {
  try {
    let { data } = await axios.post(`/api/backend`, field, { headers });
    return data;
  } catch (err) {
    return err.response.data;
  }
};
