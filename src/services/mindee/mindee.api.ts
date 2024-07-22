import * as mindee from 'mindee'

export async function mapearReceipt(
  bytes: Buffer,
  filename: string,
  endpoint: any
): Promise<any> {
  if (!endpoint) {
    endpoint = process.env.MINDEE_TOKEN_RECEIPT
  }
  const mindeeClient = new mindee.Client({
    apiKey: endpoint
  })
  const inputSource = mindeeClient.docFromBuffer(bytes, filename)
  try {
    const response = await mindeeClient.parse(
      mindee.product.ReceiptV5,
      inputSource
    )
    return response.document.inference.prediction.lineItems
  } catch (error) {
    console.error(error)
  }
}

export async function mapearInvoice(
  bytes: Buffer,
  filename: string,
  endpoint: any
): Promise<any> {
  if (!endpoint) {
    endpoint = process.env.MINDEE_TOKEN_INVOICE
  }
  const mindeeClient = new mindee.Client({
    apiKey: endpoint
  })
  const inputSource = mindeeClient.docFromBuffer(bytes, filename)
  try {
    const response = await mindeeClient.parse(
      mindee.product.InvoiceV4,
      inputSource
    )
    return response.document.inference.prediction.lineItems
  } catch (error) {
    console.error(error)
  }
}
