import express from "express";
import createError from "http-errors";
import Timeslot from "../models/slots_booking.js";

const slot_bookingRouter = express.Router();

// Lấy tất cả các timeslot
slot_bookingRouter.get("/", async (req, res, next) => {
  try {
    const slots = await Timeslot.find({}).exec();
    if (slots.length === 0) {
      throw createError(404, "Không tìm thấy timeslot nào");
    }
    res.send(slots);
  } catch (error) {
    next(error);
  }
});

// Thêm timeslot mới
slot_bookingRouter.post("/", async (req, res, next) => {
  try {
    const { time, availableBarbers } = req.body;
    const newSlot = new Timeslot({
      time,
      availableBarbers,
    });
    const savedSlot = await newSlot.save();
    res.status(201).send(savedSlot);
  } catch (error) {
    next(error);
  }
});

// Sửa timeslot theo ID
slot_bookingRouter.put("/:id", async (req, res, next) => {
  try {
    const { availableBarbers } = req.body;
    const updatedSlot = await Timeslot.findByIdAndUpdate(
      req.params.id,
      { availableBarbers },
      { new: true }
    );
    if (!updatedSlot) {
      throw createError(404, "Không tìm thấy timeslot");
    }
    res.send(updatedSlot);
  } catch (error) {
    next(error);
  }
});

// Xóa timeslot theo ID
slot_bookingRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletedSlot = await Timeslot.findByIdAndDelete(req.params.id);
    if (!deletedSlot) {
      throw createError(404, "Không tìm thấy timeslot");
    }
    res.send(deletedSlot);
  } catch (error) {
    next(error);
  }
});

export default slot_bookingRouter;
