import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getOrdersFromDB } from "../Redux/orderSlice";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  
 const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); // ensure token is saved on login

        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
        alert("Access Denied or Error fetching users");
      }
    };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const onViewOrder = async (userId,username) =>  {
     await dispatch(getOrdersFromDB(userId)); 
    navigate(`/admin/viewuserorder?username=${encodeURIComponent(username)}`);

  }
  
  const onUserDelete = async (userId) => {
   console.log("inside delete function");
   
  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(`http://localhost:5000/api/admin/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    toast.success("User deleted successfully");
    fetchUsers();

    // Optional: refresh user list after delete
    // fetchUsers();

  } catch (error) {
    console.error("Error deleting user:", error);
    
    if (error.response?.status === 404) {
      toast.error("User not found");
    } else if (error.response?.status === 401) {
      toast.error("Unauthorized");
    } else {
      toast.error("Failed to delete user");
    }
  }
}


  return (
    <div className="w-full h-auto">
         <header className="w-full h-20 flex items-center p-4 bg-yellow-300">
          <div className="text-2xl font-semibold">Admin panal</div>
         </header>
         <main className="w-full p-8 flex flex-wrap  gap-6">
          {users.map((user, index) => (

    <div key={index} className="p-4 shadow-lg bg-white rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{user.name}</h2>
      <p className="text-sm text-gray-600 mb-1"><strong>Email:</strong> {user.email}</p>
      <p className="text-sm text-gray-600"><strong>Role:</strong> {user.role}</p>
      <button className="bg-yellow-300 rounded px-3 py-1 mt-3 text-gray-950 mr-2"
       onClick={() => {onViewOrder(user._id,user.name)}}>view order</button>
       <button className="bg-red-500 text-white px-3 py-1 rounded"
       onClick={() => {onUserDelete(user._id)}}> delete</button>
    </div>
))}

         
          
      
         </main>
    </div>
  
  );
};

export default AdminPanel;
