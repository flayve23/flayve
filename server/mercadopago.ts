import {
  MercadoPagoConfig,
  Preference,
  Payment,
} from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
});

/**
 * Criar preferência de pagamento para recarga de saldo
 * Retorna URL para redirecionar o usuário
 */
export async function createRechargePreference(
  userId: number,
  amount: number, // em centavos
  userEmail: string | null | undefined,
  userName: string | null | undefined
) {
  try {
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: `balance_recharge_${userId}`,
            title: `Recarga de Saldo - R$ ${(amount / 100).toFixed(2)}`,
            description: `Recarga de saldo para a plataforma Flayve`,
            quantity: 1,
            unit_price: amount / 100, // Mercado Pago usa reais, não centavos
            currency_id: "BRL",
          },
        ],
        payer: {
          email: userEmail || "viewer@flayve.com",
          name: userName || "Viewer",
        },
        back_urls: {
          success: `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/balance-success`,
          failure: `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/balance-failure`,
          pending: `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/balance-pending`,
        },
        auto_return: "approved",
        notification_url: `${process.env.VITE_BACKEND_URL || "http://localhost:3000"}/api/webhooks/mercadopago`,
        metadata: {
          user_id: userId,
          type: "balance_recharge",
        },
      },
    });

    return {
      preferenceId: result.id,
      initPoint: result.init_point,
      sandboxInitPoint: result.sandbox_init_point,
    };
  } catch (error) {
    console.error("[Mercado Pago] Erro ao criar preferência:", error);
    throw error;
  }
}

/**
 * Obter informações de um pagamento
 */
export async function getPaymentInfo(paymentId: string) {
  try {
    const payment = new Payment(client);
    const result = await payment.get({ id: paymentId });
    return result;
  } catch (error) {
    console.error("[Mercado Pago] Erro ao obter pagamento:", error);
    throw error;
  }
}

/**
 * Criar transferência Pix para streamer (usando API de pagamentos)
 */
export async function createPixTransfer(
  streamerId: number,
  amount: number, // em centavos
  pixKey: string,
  pixKeyType: "cpf" | "email" | "phone" | "random",
  description: string
) {
  try {
    // Nota: Para transferências Pix, usamos a API de pagamentos
    // Em produção, você precisaria usar a API de transferências do Mercado Pago
    // Por enquanto, vamos simular a transferência
    
    console.log(
      `[Mercado Pago] Simulando transferência Pix para ${pixKey} (${pixKeyType}): R$ ${(amount / 100).toFixed(2)}`
    );

    return {
      transferId: `transfer_${Date.now()}_${streamerId}`,
      status: "pending",
      amount: amount / 100,
      pixKey,
      pixKeyType,
      description,
    };
  } catch (error) {
    console.error("[Mercado Pago] Erro ao criar transferência Pix:", error);
    throw error;
  }
}

/**
 * Obter informações de uma transferência
 */
export async function getTransferInfo(transferId: string) {
  try {
    console.log(`[Mercado Pago] Obtendo informações da transferência: ${transferId}`);
    return {
      id: transferId,
      status: "pending",
    };
  } catch (error) {
    console.error("[Mercado Pago] Erro ao obter transferência:", error);
    throw error;
  }
}

/**
 * Verificar status de um pagamento
 */
export function getPaymentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "pending",
    approved: "approved",
    authorized: "approved",
    in_process: "processing",
    in_mediation: "processing",
    rejected: "rejected",
    cancelled: "cancelled",
    refunded: "refunded",
    charged_back: "rejected",
  };

  return statusMap[status] || "pending";
}

/**
 * Verificar status de uma transferência
 */
export function getTransferStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "pending",
    processing: "processing",
    success: "completed",
    failed: "failed",
    cancelled: "cancelled",
  };

  return statusMap[status] || "pending";
}
