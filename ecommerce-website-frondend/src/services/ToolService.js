import axios from "./axios-customize";

export const readTools = async () => {
  const res = await axios.get(`/api/v1/tools`);
  return res?.data;
}

export const createTool = async (newTool) => {
  const res = await axios.post(`/api/v1/tools`, newTool);
  console.log("Request create gửi đi");
  console.log(newTool);
  return res?.data;
}

export const callUpdateTool = async (toolId, updatedTool) => {
  const res = await axios.put(`/api/v1/tools/${toolId}`, updatedTool);
  console.log("Request update gửi đi");
  console.log(updatedTool);

  return res?.data;
}

export const callDeleteTool = async (toolId) => {
  const res = await axios.delete(`/api/v1/tools/${toolId}`);
  return res?.data;
}

export const getToolOfCart = async (id) => {
  const path = `/api/v1/cart-tools/tool-of-cart/${id}`;
  const res = await axios.get(path);
  // console.log(res);
  return res?.data;
}

export const callGetToolByToolId = async (id) => {
  const path = `/api/v1/tools/${id}`;
  const res = await axios.get(path);
  return res?.data;
}

export const callGetAllToolByUserId = async (id) => {
  const path = `/api/v1/tools/user-tools/${id}`;
  const res = await axios.get(path);
  return res?.data?.result;
}

export const searchToolByName = async (searchTerm) => {
  const path = `/api/v1/tools/name?filter=name ~ '${searchTerm}'&page=1&size=5`;
  const res = await axios.get(path);
  return res?.data?.result;
}