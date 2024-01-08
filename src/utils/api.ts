const defaultHeaders = {
  "Accept": "application/json",
  "Content-Type": "application/json"
};

const getHeaders = (token?: string) => {
  return !token ? defaultHeaders : {
    ...defaultHeaders,
    "Authorization": "Bearer " + token
  };
}

const apiCall = (endpoint: string, method = "GET", body?: Record<string, any>, token?: string) => {
  return fetch(
    "http://localhost:3000/api" + endpoint,
    {
      headers: getHeaders(token),
      method,
      body: body ? JSON.stringify(body) : null
    }
  )
}

export default apiCall;
