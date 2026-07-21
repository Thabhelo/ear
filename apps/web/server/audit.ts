
type PaymentWebHookAuditInput={
    sessionId?:string,
    stripeEventId?:string,
    stripeEventType?:string,
}
type PaymentWebHookAuditRecord={
    timestamp: string;
    correlationId: string;
    level: "info";
    component:"payment-webhook";
    auditEventType: "payment_webhook_received";
    sessionId:string | null;
    stripeEventId:string | null;
    stripeEventType:string | null;
};
export function auditPaymentWebHookReceived(
    input:PaymentWebHookAuditInput,):
    PaymentWebHookAuditRecord{
    const auditRecord: PaymentWebHookAuditRecord={   
    timestamp:new Date().toISOString(),
    correlationId:crypto.randomUUID(),
    level: "info",
    component:"payment-webhook",
    auditEventType: "payment_webhook_received",
    sessionId: input.sessionId ?? null,
    stripeEventId: input.stripeEventId ?? null,
    stripeEventType: input.stripeEventType ?? null,
  };
 console.info(JSON.stringify(auditRecord));
 return auditRecord;
 }