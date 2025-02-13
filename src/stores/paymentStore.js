import { defineStore } from "pinia";
import { ref } from "vue";
import { PaymentService } from "@/services/PaymentService";
import Swal from "sweetalert2";

const usePaymentStore = defineStore("payment", {
  state: () => ({
    transactions: [],
  }),

  actions: {
    // ✅ 發起支付請求
    async makePayment(paymentDetails) {
      try {
        const response = await PaymentService.processPayment(paymentDetails);
        return response;
      } catch (error) {
        console.error("支付失敗:", error);
        Swal.fire({
          icon: "error",
          title: "載入失敗",
          text: errorMessage.value,
        });
        return null;
      }
    },

    // ✅ 取得支付歷史
    async fetchTransactions() {
      try {
        this.transactions = await PaymentService.getTransactions();
      } catch (error) {
        console.error("無法獲取支付歷史:", error);
        Swal.fire({
          icon: "error",
          title: "載入失敗",
          text: errorMessage.value,
        });
      }
    },
  },
});
export default usePaymentStore ;