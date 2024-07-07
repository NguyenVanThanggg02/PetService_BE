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
// tính tổng tiền tất cả services ở trạng thái completed
bookingRouter.get("/revenue-services", async (req, res, next) => {
  try {
    const completedBookings = await Booking.find({ order_status: "completed" })
      .populate("service_type")
      .exec();

    const totalAmount = completedBookings.reduce((total, booking) => {
      if (booking.service_type && booking.service_type.price) {
        return total + booking.service_type.price;
      }
      return total;
    }, 0);

    res.status(200).json({ totalAmount });
  } catch (error) {
    next(error);
  }
});

// tổng dịch vụ đã book
bookingRouter.get("/total-services", async (req, res) => {
  try {
    const totalservicesBooked = await Booking.countDocuments({
      order_status: { $ne: "canceled" },
    });
    return res.status(200).json({ totalservicesBooked });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  lấy số lượng giống male và female
// bookingRouter.get('/pet-breeds', async (req, res) => {
//   try {
//     const result = await Pet.aggregate([
//       {
//         $group: {
//           _id: "$breed",
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     // Tính toán số lượng đực và cái
//     const { maleCount, femaleCount } = result.reduce((counts, item) => {
//       if (item._id === 'Đực') {
//         counts.maleCount += item.count;
//       } else if (item._id === 'Cái') {
//         counts.femaleCount += item.count;
//       }
//       return counts;
//     }, { maleCount: 0, femaleCount: 0 });

//     return res.status(200).json({ maleCount, femaleCount });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// });

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
