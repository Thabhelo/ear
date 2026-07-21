
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
    audit_event_type: "payment_webhook_received ";
    session_id:string | null;
    stripe_event_id:string | null;
    stripe_event_type:string | null;
};
export function auditPaymentWebHookReceived(
    input:PaymentWebHookAuditInput,):
    PaymentWebHookAuditRecord{
    const auditRecord: PaymentWebHookAuditRecord={   
    timestamp:new Date().toISOString(),
    correlationId:crypto.randomUUID(),
    level: "info",
    component:"payment-webhook",
    audit_event_type : "payment_webhook_received",
    session_id: input.sessionId ?? null,
    stripe_event_id: input.stripeEventId ?? null,
    stripe_event_type: input.stripeEventType ?? null,
  };
 console.info(JSON.stringify(auditRecord));
 return auditRecord;
 }