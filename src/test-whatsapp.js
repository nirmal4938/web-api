// test-whatsapp.js
import axios from "axios";

const TEST_PHONE = "917678229735"; // 🌟 REPLACE WITH YOUR LIVE MOBILE NUMBER WITH 91 PREFIX

const testPayload = {
  students: [
    {
      studentName: "Rajesh Kumar",
      className: "Class 12 (IIT-JEE Physics)",
      phone: TEST_PHONE,
      amountDue: "2200",
      dueDate: "08-Oct-2026",
      coachingName: "Target Physics Classes, Supaul",
    },
  ],
};

async function runTest() {
  console.log(
    "🚀 Dispatching internal test payload to local Express endpoint...",
  );
  try {
    const response = await axios.post(
      "http://localhost:5000/api/education/send-fee-reminders",
      testPayload,
    );
    console.log("📦 Backend Response Received Status:", response.status);
    console.log("💬 Server Message:", response.data);
  } catch (error) {
    console.error(
      "💥 Test failed execution stream:",
      error.response ? error.response.data : error.message,
    );
  }
}

runTest();
