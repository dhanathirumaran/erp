import axios from 'axios';

interface HSNResponse {
  status: number;
  message: string;
  data?: {
    hsncode: string;
    sgstrate: number;
    cgstrate: number;
    igstrate: number;
    cessrate?: number;
    description?: string;
  };
}

const API_BASE_URL = 'https://docs.ewaybillgst.gov.in/apidocs/version1.03';

export const getHSNDetails = async (hsnCode: string): Promise<HSNResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-hsn-details`, {
      params: {
        hsncode: hsnCode,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to validate HSN code');
    }
    throw error;
  }
};