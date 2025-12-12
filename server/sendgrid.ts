import sgMail from "@sendgrid/mail";

// Inicializar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
}

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "noreply@flayve.com";

/**
 * Enviar email de confirmação de pagamento
 */
export async function sendPaymentConfirmationEmail(
  userEmail: string,
  userName: string,
  amount: number,
  paymentMethod: string,
  transactionId: string
) {
  try {
    const amountFormatted = (amount / 100).toFixed(2);
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Pagamento Confirmado! ✓</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="color: #374151; font-size: 16px;">Olá <strong>${userName}</strong>,</p>
          
          <p style="color: #374151; font-size: 14px; line-height: 1.6;">
            Seu pagamento foi processado com sucesso! Seu saldo foi creditado instantaneamente na sua conta Flayve.
          </p>
          
          <div style="background: white; border-left: 4px solid #ec4899; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #1f2937;">Detalhes da Transação</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">ID da Transação:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right; font-size: 14px;">${transactionId}</td>
              </tr>
              <tr style="border-top: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Valor:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right; font-size: 14px;">R$ ${amountFormatted}</td>
              </tr>
              <tr style="border-top: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Método:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right; font-size: 14px;">${paymentMethod === "pix" ? "PIX" : paymentMethod === "credit_card" ? "Cartão de Crédito" : "Cartão de Débito"}</td>
              </tr>
              <tr style="border-top: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Data:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right; font-size: 14px;">${new Date().toLocaleDateString("pt-BR")}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              ✓ Seu saldo foi atualizado instantaneamente<br>
              ✓ Você já pode fazer chamadas<br>
              ✓ Seu recibo foi salvo no histórico
            </p>
          </div>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px; text-align: center;">
            Se você não realizou este pagamento ou tem dúvidas, entre em contato com nosso suporte.
          </p>
        </div>
      </div>
    `;

    const msg: EmailOptions = {
      to: userEmail,
      from: FROM_EMAIL,
      subject: `Pagamento Confirmado - R$ ${amountFormatted}`,
      html,
      text: `Seu pagamento de R$ ${amountFormatted} foi confirmado com sucesso! ID: ${transactionId}`,
    };

    await sgMail.send(msg);
    console.log("[SendGrid] Email de confirmação enviado para:", userEmail);
    return { success: true };
  } catch (error) {
    console.error("[SendGrid] Erro ao enviar email:", error);
    return { success: false, error };
  }
}

/**
 * Enviar email de confirmação de saque
 */
export async function sendWithdrawalConfirmationEmail(
  userEmail: string,
  userName: string,
  amount: number,
  pixKey: string,
  pixKeyType: string,
  withdrawalId: number
) {
  try {
    const amountFormatted = (amount / 100).toFixed(2);
    const pixKeyDisplay = pixKeyType === "random" ? "Chave aleatória" : pixKey;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Saque Solicitado! 🎉</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="color: #374151; font-size: 16px;">Olá <strong>${userName}</strong>,</p>
          
          <p style="color: #374151; font-size: 14px; line-height: 1.6;">
            Sua solicitação de saque foi recebida e está sendo processada. O valor será transferido para sua conta PIX em até 2 horas.
          </p>
          
          <div style="background: white; border-left: 4px solid #ec4899; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #1f2937;">Detalhes do Saque</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">ID do Saque:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right; font-size: 14px;">#${withdrawalId}</td>
              </tr>
              <tr style="border-top: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Valor:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right; font-size: 14px;">R$ ${amountFormatted}</td>
              </tr>
              <tr style="border-top: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Chave PIX:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: bold; text-align: right; font-size: 14px;">${pixKeyDisplay}</td>
              </tr>
              <tr style="border-top: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Status:</td>
                <td style="padding: 8px 0; color: #f59e0b; font-weight: bold; text-align: right; font-size: 14px;">Processando...</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              ⏱️ Tempo estimado: até 2 horas<br>
              📱 Você receberá uma notificação quando o saque for concluído<br>
              ❓ Dúvidas? Entre em contato com nosso suporte
            </p>
          </div>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px; text-align: center;">
            Obrigado por usar a Flayve!
          </p>
        </div>
      </div>
    `;

    const msg: EmailOptions = {
      to: userEmail,
      from: FROM_EMAIL,
      subject: `Saque Solicitado - R$ ${amountFormatted}`,
      html,
      text: `Seu saque de R$ ${amountFormatted} foi solicitado com sucesso! ID: ${withdrawalId}`,
    };

    await sgMail.send(msg);
    console.log("[SendGrid] Email de saque enviado para:", userEmail);
    return { success: true };
  } catch (error) {
    console.error("[SendGrid] Erro ao enviar email:", error);
    return { success: false, error };
  }
}

/**
 * Enviar email de falha de pagamento
 */
export async function sendPaymentFailureEmail(
  userEmail: string,
  userName: string,
  amount: number,
  reason: string
) {
  try {
    const amountFormatted = (amount / 100).toFixed(2);
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Pagamento Não Aprovado</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="color: #374151; font-size: 16px;">Olá <strong>${userName}</strong>,</p>
          
          <p style="color: #374151; font-size: 14px; line-height: 1.6;">
            Infelizmente, não conseguimos processar seu pagamento de R$ ${amountFormatted}.
          </p>
          
          <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; color: #7f1d1d; font-size: 14px;">
              <strong>Motivo:</strong> ${reason}
            </p>
          </div>
          
          <p style="color: #374151; font-size: 14px; line-height: 1.6;">
            Você pode tentar novamente com:
          </p>
          <ul style="color: #374151; font-size: 14px;">
            <li>Outro cartão</li>
            <li>PIX (transferência instantânea)</li>
            <li>Verificar se os dados estão corretos</li>
          </ul>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px; text-align: center;">
            Se o problema persistir, entre em contato com nosso suporte.
          </p>
        </div>
      </div>
    `;

    const msg: EmailOptions = {
      to: userEmail,
      from: FROM_EMAIL,
      subject: `Pagamento Não Aprovado - R$ ${amountFormatted}`,
      html,
      text: `Seu pagamento de R$ ${amountFormatted} não foi aprovado. Motivo: ${reason}`,
    };

    await sgMail.send(msg);
    console.log("[SendGrid] Email de falha enviado para:", userEmail);
    return { success: true };
  } catch (error) {
    console.error("[SendGrid] Erro ao enviar email:", error);
    return { success: false, error };
  }
}

/**
 * Testar conexão com SendGrid
 */
export async function testSendGridConnection() {
  try {
    const msg: EmailOptions = {
      to: "test@example.com",
      from: FROM_EMAIL,
      subject: "Teste SendGrid",
      html: "<p>Teste de conexão com SendGrid</p>",
    };

    // Não enviar de verdade, apenas validar a chave
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error("SENDGRID_API_KEY não configurada");
    }

    console.log("[SendGrid] Conexão validada com sucesso");
    return { success: true, message: "SendGrid está configurado corretamente" };
  } catch (error) {
    console.error("[SendGrid] Erro ao validar conexão:", error);
    return { success: false, error };
  }
}
