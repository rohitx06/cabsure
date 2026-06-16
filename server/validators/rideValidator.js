const { z } = require("zod");

const rideSchema = z.object({
  pickup_area: z.string().min(2),
  app_name: z.enum(["Uber", "Rapido"]),
  ride_type: z.enum(["Auto", "Bike", "Mini", "Sedan", "SUV", "Cab"]),
  status: z.enum(["accepted", "rejected", "cancelled", "no_driver"]),
  wait_time: z.number().min(0),
  day_of_week: z.string(),
  request_time: z.string(),
});

module.exports = {
  rideSchema,
};
