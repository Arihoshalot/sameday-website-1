import API from "../api";

const createVisit = async (visit) => {
  const res = await API.post("/visits", visit);
  const data = await res.json();
  return data;
};
const getVisits = async () => {
  const res = await API.get("/visits");
  const data = await res.json();
  return data;
};
const getVisit = async (id) => {
  const res = await API.get(`/visits/${id}`);
  const data = await res.json();
  return data;
};
const updateVisit = async (visit) => {
  const res = await API.patch(`/visits/${visit.id}`, visit);
  const data = await res.json();
  return data;
};
const deleteVisit = async (id) => {
  const res = await API.delete(`/visits/${id}`);
  const data = await res.json();
  return data;
};
export const visitService = {
  createVisit,
  getVisits,
  getVisit,
  updateVisit,
  deleteVisit,
};