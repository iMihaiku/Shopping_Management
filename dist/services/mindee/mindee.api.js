"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapearReceipt = mapearReceipt;
exports.mapearInvoice = mapearInvoice;
const mindee = __importStar(require("mindee"));
async function mapearReceipt(bytes, filename) {
    const mindeeClient = new mindee.Client({
        apiKey: process.env.MINDEE_TOKEN_RECEIPT
    });
    const inputSource = mindeeClient.docFromBuffer(bytes, filename);
    try {
        const response = await mindeeClient.parse(mindee.product.ReceiptV5, inputSource);
        console.log(response);
        return response.document.inference.prediction.lineItems;
    }
    catch (error) {
        console.error(error);
    }
}
async function mapearInvoice(bytes, filename) {
    const mindeeClient = new mindee.Client({
        apiKey: process.env.MINDEE_TOKEN_INVOICE
    });
    const inputSource = mindeeClient.docFromBuffer(bytes, filename);
    try {
        const response = await mindeeClient.parse(mindee.product.InvoiceV4, inputSource);
        console.log(response);
        return response.document.inference.prediction.lineItems;
    }
    catch (error) {
        console.error(error);
    }
}
