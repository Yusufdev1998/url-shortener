import { BASE_URL } from "@/lib/constants";
import { IShortenRequest } from "@/types/api";
import axios from "axios";

const API_URL = BASE_URL;

export async function createShortUrl(data: IShortenRequest) {
  try {
    const res = await axios.post(`${API_URL}/shorten`, data);
    return res.data;
  } catch (error) {
    throw new Error(getAxiosError(error));
  }
}

export async function getInfo(alias: string) {
  try {
    const res = await axios.get(`${API_URL}/info/${alias}`);
    return res.data;
  } catch (error) {
    throw new Error(getAxiosError(error));
  }
}

export async function getAllUrls() {
  try {
    const res = await axios.get(`${API_URL}/urls`);
    return res.data;
  } catch (error) {
    throw new Error(getAxiosError(error));
  }
}

export async function getAnalytics(alias: string) {
  try {
    const res = await axios.get(`${API_URL}/analytics/${alias}`);
    return res.data;
  } catch (error) {
    throw new Error(getAxiosError(error));
  }
}

export async function deleteShortUrl(alias: string) {
  try {
    await axios.delete(`${API_URL}/delete/${alias}`);
  } catch (error) {
    throw new Error(getAxiosError(error));
  }
}

function getAxiosError(error: any): string {
  return (
    error.response?.data?.message || error.message || "Something went wrong!"
  );
}
