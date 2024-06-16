import express from "express";
import axios from "axios";
import crypto from "crypto";
import { orderController } from "../controllers/index.js";

const orderRouter = express.Router();

// orderRouter.post("/", async (req, res) => {
//   //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
//   //parameters
//   var accessKey = "F8BBA842ECF85";
//   var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
//   var orderInfo = "pay with MoMo";
//   var partnerCode = "MOMO";
//   var redirectUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
//   var ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
//   var requestType = "payWithMethod";
//   var amount = "50000";
//   var orderId = partnerCode + new Date().getTime();
//   var requestId = orderId;
//   var extraData = "";
//   var orderGroupId = "";
//   var autoCapture = true;
//   var lang = "vi";

//   //before sign HMAC SHA256 with format
//   //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
//   var rawSignature =
//     "accessKey=" +
//     accessKey +
//     "&amount=" +
//     amount +
//     "&extraData=" +
//     extraData +
//     "&ipnUrl=" +
//     ipnUrl +
//     "&orderId=" +
//     orderId +
//     "&orderInfo=" +
//     orderInfo +
//     "&partnerCode=" +
//     partnerCode +
//     "&redirectUrl=" +
//     redirectUrl +
//     "&requestId=" +
//     requestId +
//     "&requestType=" +
//     requestType;
//   //puts raw signature
//   console.log("--------------------RAW SIGNATURE----------------");
//   console.log(rawSignature);
//   //signature
//   var signature = crypto
//     .createHmac("sha256", secretKey)
//     .update(rawSignature)
//     .digest("hex");
//   console.log("--------------------SIGNATURE----------------");
//   console.log(signature);

//   //json object send to MoMo endpoint
//   const requestBody = JSON.stringify({
//     partnerCode: partnerCode,
//     partnerName: "Test",
//     storeId: "MomoTestStore",
//     requestId: requestId,
//     amount: amount,
//     orderId: orderId,
//     orderInfo: orderInfo,
//     redirectUrl: redirectUrl,
//     ipnUrl: ipnUrl,
//     lang: lang,
//     requestType: requestType,
//     autoCapture: autoCapture,
//     extraData: extraData,
//     orderGroupId: orderGroupId,
//     signature: signature,
//   });

//   const options = {
//     method: "POST",
//     url: "https://test-payment.momo.vn/v2/gateway/api/create",
//     headers: {
//       "Content-Type": "application/json",
//       "Content-Length": Buffer.byteLength(requestBody),
//     },
//     data: requestBody,
//   };
//   let result;
//   try {
//     result = await axios(options);
//     return res.status(200).json(result.data);
//   } catch (error) {
//     return res.status(500).json({ status: 500, message: "server error" });
//   }
// });

orderRouter.post('/create',orderController.createOrder );
orderRouter.get('/orders', orderController.getOrders);




export default orderRouter