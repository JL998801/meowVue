import { jsonRequest } from "@/plugins/axios";

const API_URL = "/api/payment/create";

export default {
  async initiatePayment(amount) {
    return jsonRequest("post", API_URL, { amount });
  },
};
