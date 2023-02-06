import { notFoundError } from "@/errors";
import hotelRepostiroy from "@/repositories/hotel-repository"
import { Hotel } from "@prisma/client";
import { exclude } from "@/utils/prisma-utils";

async function getAllHotels() {
    const hotel = await hotelRepostiroy.findMany();
    if (!hotel) {
        throw notFoundError()
    }
    return hotel
}

async function getHotelById(id: number){
    const hotel = await hotelRepostiroy.findUnique(id);
    if (!hotel){
        throw notFoundError()
    }
    return hotel
}
const hotelsService = {
    getAllHotels,
    getHotelById
}

export default hotelsService