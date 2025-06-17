

const API_URL = import.meta.env.VITE_API_BASE_URL;


export const registerUser = async (userData) => {
  try {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Login failed");
    } 
    
  const data = await res.json();
  return data;
}catch(error) {
  throw error
}
};

export const loginUser = async (credentials) => {
try {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

   if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Login failed");
    }

  const data = await res.json();
  return data;

} catch (error) {
  console.error("Login error:", error.message);
  // Optionally show error to user
  throw error
}

};