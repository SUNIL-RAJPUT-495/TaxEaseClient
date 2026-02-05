


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
  // getUser



  //plans
  createPlan: {
    url: baseURL + "/api/plans/create-plans",
    method: "POST"  
},
getplan: {
  url: baseURL + "/api/plans/get-plans",
  method: "GET"
}}

export default SummaryApi;
