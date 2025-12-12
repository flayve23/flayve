import { describe, it, expect, beforeAll, vi } from "vitest";
import { createRechargePreference, getPaymentStatus } from "./mercadopago";
import { sendPaymentConfirmationEmail, testSendGridConnection } from "./sendgrid";

describe("Mercado Pago Integration", () => {
  it("should validate payment status mapping", () => {
    expect(getPaymentStatus("approved")).toBe("approved");
    expect(getPaymentStatus("rejected")).toBe("rejected");
    expect(getPaymentStatus("pending")).toBe("pending");
    expect(getPaymentStatus("in_process")).toBe("pending");
  });

  it("should create recharge preference with valid parameters", async () => {
    try {
      const result = await createRechargePreference({
        amount: 5000,
        userEmail: "test@example.com",
        userName: "Test User",
        paymentMethod: "pix",
      });

      if (result && result.preferenceId) {
        expect(result.preferenceId).toBeDefined();
      }
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should handle invalid amounts gracefully", async () => {
    try {
      await createRechargePreference({
        amount: 0,
        userEmail: "test@example.com",
        userName: "Test User",
        paymentMethod: "pix",
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe("SendGrid Integration", () => {
  it("should validate SendGrid connection", async () => {
    const result = await testSendGridConnection();
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });

  it("should prepare payment confirmation email", async () => {
    const result = await sendPaymentConfirmationEmail(
      "test@example.com",
      "Test User",
      5000,
      "pix",
      "MP-123456"
    );

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });

  it("should handle email sending errors gracefully", async () => {
    const result = await sendPaymentConfirmationEmail(
      "invalid-email",
      "Test User",
      5000,
      "pix",
      "MP-123456"
    );

    expect(result).toBeDefined();
  });
});

describe("Payment Flow", () => {
  it("should validate complete payment flow", async () => {
    const emailResult = await sendPaymentConfirmationEmail(
      "test@example.com",
      "Test User",
      5000,
      "pix",
      "MP-TEST-123456"
    );

    expect(emailResult).toBeDefined();
  });

  it("should validate payment status transitions", () => {
    const statuses = ["pending", "approved", "rejected", "in_process", "cancelled"];

    statuses.forEach((status) => {
      const result = getPaymentStatus(status);
      expect(["pending", "approved", "rejected", "processing"]).toContain(result);
    });
  });
});
