import axios from 'axios';

export function getApi() {
  return axios.create({
    baseURL: 'http://localhost:4000'
  });
}
