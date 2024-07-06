import express from "express";
import createError from "http-errors";
import Booking from "../models/booking.js";
import Timeslot from "../models/slots_booking.js";

const bookingRouter = express.Router();

// Lấy danh sách tất cả các booking
bookingRouter.get("/", async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
      .populate("service_type timeslot")
      .exec();
    if (bookings.length === 0) {
      throw createError(404, "Không tìm thấy dịch vụ");
    }
    res.send(bookings);
  } catch (error) {
    next(error);
  }
});

// Thêm booking mới
bookingRouter.post("/", async (req, res, next) => {
  try {
    const {
      service_type,
      customer_name,
      phone_number,
      email,
      address,
      appointment_date,
      timeslotId,
      order_status,
      pet_info,
    } = req.body;

    const timeslot = await Timeslot.findById(timeslotId);
    if (!timeslot) {
      return res.status(400).json({ error: "Timeslot not found" });
    }
    if (timeslot.availableSlots <= 0) {
      return res
        .status(400)
        .json({ error: "No available slots for this timeslot" });
    }

    const newBooking = new Booking({
      service_type,
      customer_name,
      phone_number,
      email,
      address,
      appointment_date,
      timeslot: timeslotId,
      order_status,
      pet_info,
    });

    const savedBooking = await newBooking.save();

    timeslot.availableSlots -= 1;
    await timeslot.save();

    res.status(201).json(savedBooking);
  } catch (error) {
    next(error);
  }
});

// Sửa thông tin booking theo ID
bookingRouter.put("/:id", async (req, res, next) => {
  try {
    const {
      service_type,
      customer_name,
      phone_number,
      email,
      address,
      appointment_date,
      timeslotId,
      order_status,
      pet_info,
    } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        service_type,
        customer_name,
        phone_number,
        email,
        address,
        appointment_date,
        timeslot: timeslotId,
        order_status,
        pet_info,
      },
      { new: true }
    );
    if (!booking) {
      throw createError(404, "Không tìm thấy booking");
    }

    res.send(booking);
  } catch (error) {
    next(error);
  }
});

// Xóa booking theo ID
bookingRouter.delete("/:id", async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      throw createError(404, "Không tìm thấy booking");
    }

    const timeslot = await Timeslot.findById(booking.timeslot);
    if (!timeslot) {
      throw createError(404, "Timeslot not found for the deleted booking");
    }

    timeslot.availableSlots += 1;
    await timeslot.save();

    res.send(booking);
  } catch (error) {
    next(error);
  }
});

export default bookingRouter;
