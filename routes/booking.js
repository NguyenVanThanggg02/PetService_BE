import express from "express";
import createError from "http-errors";
import Booking from "../models/booking.js";
import Timeslot from "../models/slots_booking.js";

const bookingRouter = express.Router();


// tổng dịch vụ đã book
bookingRouter.get("/total-services", async (req, res) => {
  try {
    const totalservicesBooked = await Booking.countDocuments({
      order_status: { $ne: "Cancel" },
    });
    return res.status(200).json({ totalservicesBooked });
  } catch (error) {
    res.status(500).json({ message:error.toString() });
  }
});
// tính tổng tiền tất cả services ở trạng thái completed
bookingRouter.get("/revenue-services", async (req, res, next) => {
  try {
    const completedBookings = await Booking.find({ order_status: "Completed" })
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



// tổng tiền theo từng loại dịch vụ
bookingRouter.get("/revenue-by-service-type", async (req, res, next) => {
  try {
    const completedBookings = await Booking.find({ order_status: "Completed" })
      .populate("service_type")
      .exec();
    const revenueByServiceType = completedBookings.reduce(
      (accumulator, booking) => {
        const serviceName = booking.service_type.name;
        const servicePrice = booking.service_type.price;

        if (!accumulator[serviceName]) {
          accumulator[serviceName] = 0;
        }

        accumulator[serviceName] += servicePrice;
        return accumulator;
      },
      {}
    );

    res.status(200).json({ revenueByServiceType });
  } catch (error) {
    next(error);
  }
});


//  lấy số lượng giống đực và cái làm dịch vụ
bookingRouter.get("/pet-breeds", async (req, res) => {
  try {
    const bookings = await Booking.find();
    const { maleCount, femaleCount } = bookings.reduce(
      (count, boking) => {
        const breed = boking.pet_info.breed;
        if (breed === "Đực") {
          count.maleCount++;
        } else if (breed === "Cái") {
          count.femaleCount++;
        }
        return count;
      },
      { maleCount: 0, femaleCount: 0 }
    );
    return res.status(200).json({ maleCount, femaleCount });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// Lấy danh sách tất cả các booking theo user
bookingRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId }).populate("service_type");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Lấy thông tin booking theo ID và userID
bookingRouter.get("/detail/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({ _id: id })
      .populate("service_type")
      .populate("timeslot");
    if (!booking) {
      throw createError(404, "Không tìm thấy booking");
    }
    res.send(booking);
  } catch (error) {
    next(error);
  }
});
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
// Cập nhật trạng thái booking và lý do nếu chuyển thành 'cancel'
bookingRouter.put("/update-status/:id", async (req, res, next) => {
  try {
    const { cancel_reason } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { order_status: "Cancel", cancel_reason },
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
// Lấy danh sách booking theo userId và trạng thái
bookingRouter.get("/:userId/:status", async (req, res, next) => {
  try {
    const { userId, status } = req.params;
    const bookings = await Booking.find({ userId, order_status: status })
      .populate("service_type timeslot")
      .exec();

    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
});

// Thêm booking mới
bookingRouter.post("/", async (req, res, next) => {
  try {
    const {
      userId,
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

    if (!userId) {
      return res.status(400).json({ error: "Missing userId in request body" });
    }

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
      userId,
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

//cập nhật trạng thái lịch

bookingRouter.put("/status/:id", async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { order_status: req.body.order_status },
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

export default bookingRouter;
