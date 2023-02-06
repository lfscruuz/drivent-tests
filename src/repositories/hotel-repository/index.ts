import {prisma} from "@/config";
import { Hotel } from "@prisma/client";

async function findMany(){
    return prisma.hotel.findMany();
}
async function findUnique(id: number){
    return prisma.hotel.findUnique({
        where:{
            id
        },
        include: {
            Rooms: true
        }
    })
}
const hotelRepostiroy = {
    findMany,
    findUnique
};

export default hotelRepostiroy;