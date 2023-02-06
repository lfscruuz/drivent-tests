import hotelsService from "@/services/hotels-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: Request, res: Response){

    try {
        const result = await hotelsService.getAllHotels()
        res.status(httpStatus.OK).send(result)
    } catch (error) {
        return res.sendStatus(httpStatus.NO_CONTENT)
    }
}
export async function getUniqueHotelById(req: Request, res: Response){
    const {id} = req.params
    try {
        const result = await hotelsService.getHotelById(Number(id));
        res.status(httpStatus.OK).send(result)
    } catch (error) {
        return res.sendStatus(httpStatus.NO_CONTENT)
    }
}