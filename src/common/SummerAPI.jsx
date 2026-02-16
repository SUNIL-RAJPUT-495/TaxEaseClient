


export const baseURL = "https://tax-ease-backend.vercel.app";

const SummaryApi = {
  //  User

  // Create User
  CreateUser: {
    url: baseURL + "/api/user/create-user",
    method: "POST"
  },
  // Verify User 
  verifyUser: {
    url: baseURL + "/api/user/verify-user",
    method: "POST"
  },
  // getUserDetails
  userDetails: {
    url: baseURL + "/api/user/get-userDetails",
    method: "get"
  },
  allUsers: {
    url: baseURL + "/api/user/all-users",
    method: "get"
  },
  deletUser: {
    url: baseURL + "/api/user/delete-user",
    method: "delete"
  }
  ,
  allOrders: {
    url: baseURL + "/api/order/all-orders",
    method: "get"
  },
  orderStats: {
    url: baseURL + "/api/order/stats",
    method: "get"
  },
  recentOrders: {
    url: baseURL + "/api/order/recent-orders",
    method: "get"
  },



  uploadFile: {
    url: baseURL + "/api/file/upload",
    method: "post"
  },

  adminUploadDoc: {
    url: baseURL + "/api/file/upload-admin",
    method: "post"
  },
  getMyDocuments:{
    url : baseURL + "/api/file/getMyDocuments",
    method:"get"
  }
  ,
  getUserDecision:{
    url:baseURL + "/api/file/get-user-decision",
    method:"get"
  },
  updateFileDecision:{
    url:baseURL+ "/api/file/update-decision",
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
  getPlanDetails: {
    url: "/api/plans/plan-details",
    method: "get"
  },
  deletePlan: {
    url: baseURL + "/api/plans/deletePlan",
    method: "delete"
  }
  ,
  editPlan: {
    url: baseURL + "/api/plans/editPlan",
    method: "put"
  }
  ,
  getAllServices: {
    url: baseURL + "/api/plans/getAllServices",
    method: "get"
  },

  createOrder: {
    url: baseURL + "/api/order/create-Order",
    method: "post"
  }
  ,
  verifyPayment: {
    url: baseURL + "/api/order/verify-payment",
    method: "post"
  },
  sendChat: {
    url: baseURL + "/api/chat/send",
    method: "post"
  },
  getChat: {
    url: baseURL + "/api/chat/get-users",
    method: "get"
  },
  getChatHistory: {
    url: baseURL + "/api/chat/getUserChatHistory",
    method: "get"
  },
  markOrderAsSeen: {
    url: baseURL + "/api/order/markOrderAsSeen",
    method: "post"

  }

}

export default SummaryApi;
