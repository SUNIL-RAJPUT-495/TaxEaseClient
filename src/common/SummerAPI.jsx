


export const baseURL = "http://localhost:8080";

const SummaryApi = {
  //  User

  // Create User
  CreateUser:{
    url:baseURL+"/api/user/create-user",
    method:"POST"
  },
  // Verify User 
  verifyUser: {
    url: baseURL + "/api/user/verify-user",     
    method: "POST"
  },
  // getUserDetails
  userDetails:{
    url : baseURL + "/api/user/get-userDetails",
    method:"get"
  },
 allUsers: {
    url: baseURL + "/api/user/all-users",
    method: "get"
  },
  allOrders: {
    url: baseURL + "/api/payment/all-orders",
    method: "get"
  },
  orderStats: {
    url: baseURL + "/api/payment/stats",
    method: "get"
  },
  recentOrders: {
    url: baseURL + "/api/payment/recent-orders",
    method: "get"
  },
  uploadFile:{
    url:baseURL + "/api/file/upload",
    method:"post"
  },

  //plans
  createPlan: {
    url: baseURL + "/api/plans/create-plans",
    method: "POST"  
},
getplan: {
  url: baseURL + "/api/plans/get-plans",
  method: "GET"
},

createOrder:{
  url: baseURL + "/api/payment/create-Order",
  method:"post"
}
, 
verifyPayment:{
  url:baseURL + "/api/payment/verify-payment",
  method:"post"
}

}

export default SummaryApi;
