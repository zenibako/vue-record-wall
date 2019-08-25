import axios from 'axios';

const PORT = process.env.PORT || 8080;
const BASE_URL = 'http://localhost:' + PORT;

export function getRecords() {
  return axios.get(`${BASE_URL}/api/record/list`)
    .then(response => response.data);
}

export function deleteRecord(id) {
  return axios.post(`${BASE_URL}/api/record/delete/${id}`)
    .then(response => response.data)
    .catch(err => Promise.reject(err.message));
}

export function createRecord(data) {
  return axios.post(`${BASE_URL}/api/record/create`,
    {title: data.title, body: data.body}
  ).then(response => {
    return response.data
  })
   .catch(err => Promise.reject(err.message));
}

export function updateRecord(data, id) {
  return axios.post(`${BASE_URL}/api/record/update/${id}`, {data})
    .then(response => {
      return response.data
    })
    .catch(err => Promise.reject(err.message));
}
