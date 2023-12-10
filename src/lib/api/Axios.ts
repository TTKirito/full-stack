import axios from "axios";

export const Axios = {
  get: async ({ url, headers }: { url: string; headers: {} }) => {
    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      throw new Error(`failed to fetch ${error}`);
    }
  },
};
