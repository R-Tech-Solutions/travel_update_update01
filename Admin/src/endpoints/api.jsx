import axios from "axios"

const BASE_URL = 'http://127.0.0.1:8000/api'
const LOGIN_URL = '${BASE_URL}/token/'

export const login = async (username, password) => {
    const response = await axios.post(
      LOGIN_URL,
      { username, password },
      { withCredentials: true }
    );
    return response.data.success;
  };

