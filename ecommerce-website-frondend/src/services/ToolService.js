import axios from "./axios-customize";
export const readTools = async () => {
  // const res = await axios.get(`/api/v1/tools?size=100&page=0&sort=createdAt,desc&filter=name~'aa'`);
  const res = await axios.get(`/api/v1/tools?size=100&page=0&sort=createdAt,desc`);
  // console.log(res);
  return res?.data?.result;
}

export const getAllToolByToolTypeId = async (toolTypeId) => {
  const path = `/api/v1/tools?size=100&page=0&sort=createdAt,desc&filter=toolType.toolTypeId=${toolTypeId}`;
  const res = await axios.get(path);
  return res?.data?.result;
}

export const getAllToolByToolName = async (toolName) => {
  const path = `/api/v1/tools?size=100&page=0&sort=createdAt,desc&filter=name~'${toolName}'`;
  const res = await axios.get(path);
  return res?.data?.result;
}

export const createTool = async (newTool) => {
  const res = await axios.post(`/api/v1/tools`, newTool);
  return res?.data;
}

export const callUpdateTool = async (toolId, updatedTool) => {
  console.log("toolId", toolId);
  console.log("updatedTool", updatedTool);
  const res = await axios.put(`/api/v1/tools/${toolId}`, updatedTool);
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
  const path = `/api/v1/tools/user-tools/${id}?size=200&page=0&sort=createdAt,desc`;
  const res = await axios.get(path);
  return res?.data?.result;
}

export const searchToolByName = async (searchTerm) => {
  try {
    const path = `/api/v1/tools?size=100&page=0&sort=createdAt,desc&filter=name~'${searchTerm}'`;
    const res = await axios.get(path);
    return res?.data?.result || [];
  } catch (error) {
    console.error("Error searching tools by name:", error);
    return [];
  }
}

export const getToolsByToolIds = async (data) => {
  const path = `/api/v1/tools/toolIds`;
  const res = await axios.post(path, data);
  return res?.data;
}

export const callHardDeleteProduct = async (id) => {
  const path = `/api/v1/tools/hard-delete/${id}`;
  const res = await axios.delete(path);
  return res?.data;
}

export const callGetStockByToolId = async (toolId) => {
  const path = `/api/v1/tools/stock/${toolId}`;
  const res = await axios.get(path);
  return res?.data;
}
