import axios from "axios";

export const TOKEN = process.env.TOKEN; // bluesnap token
export const BASEURL = process.env.BLUESNAP_BASEURL; // bluesnap baseurl

export const BLUESNAP_API = axios.create({
  baseURL: BASEURL,
  headers: {
    Authorization: TOKEN,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
