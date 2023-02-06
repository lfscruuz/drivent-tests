import { Router } from "express";
import { getHotels, getUniqueHotelById } from "@/controllers";
import { authenticateToken } from "@/middlewares";

const hotelsRouter = Router();

hotelsRouter
.all("/*", authenticateToken)
.get("/", getHotels)
.get("/:id", getUniqueHotelById)

export {hotelsRouter};