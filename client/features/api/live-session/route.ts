import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/live-session`;

export const fetchLiveSessions = async () => {
  try {
    const { data } = await axios.get(API_BASE_URL);
    return data;
  } catch (error) {
    console.error('Error fetching live sessions:', error);
    throw error;
  }
};

export const createLiveSession = async (sessionData: any) => {
  try {
    const { data } = await axios.post(API_BASE_URL, sessionData);
    return data;
  } catch (error) {
    console.error('Error creating live session:', error);
    throw error;
  }
};

export const updateLiveSession = async (id: string, sessionData: any) => {
  try {
    const { data } = await axios.patch(`${API_BASE_URL}/${id}`, sessionData);
    return data;
  } catch (error) {
    console.error('Error updating live session:', error);
    throw error;
  }
};

export const deleteLiveSession = async (id: string) => {
  try {
    const { data } = await axios.delete(`${API_BASE_URL}/${id}`);
    return data;
  } catch (error) {
    console.error('Error deleting live session:', error);
    throw error;
  }
};

export const createLiveSessionOrder = async (sessionId: string, userId: string) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/${sessionId}/create-order`, { userId });
    return data;
  } catch (error) {
    console.error('Error creating live session order:', error);
    throw error;
  }
};

export const verifyLiveSessionPayment = async (paymentDetails: any) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/verify-payment`, paymentDetails);
    return data;
  } catch (error) {
    console.error('Error verifying live session payment:', error);
    throw error;
  }
};

export const fetchEnrolledLiveSessions = async (userId: string) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/enrolled/${userId}`);
    return data;
  } catch (error) {
    console.error('Error fetching enrolled live sessions:', error);
    throw error;
  }
};
