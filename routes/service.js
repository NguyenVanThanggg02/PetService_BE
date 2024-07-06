import express from "express";
import createError from "http-errors";
import Service from "../models/service.js";

const serviceRouter = express.Router();

serviceRouter.get("/", async (req, res, next) => {
  try {
    const service = await Service.find({}).exec();
    if (service.length === 0) {
      throw createError(404, "Không tìm thấy dịch vụ ");
    }
    res.send(service);
  } catch (error) {
    next(error);
  }
});

export default serviceRouter;
