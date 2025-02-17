import { jsonRequest } from "@/plugins/axios";

const API_URL = "/payment/create";

export default {
  async initiatePayment(amount) {
    return jsonRequest("post", API_URL, { amount });
  },
};
