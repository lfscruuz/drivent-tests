import app, { init } from "@/app"
import { prisma } from "@/config"
import httpStatus from "http-status"
import supertest from "supertest"
import { generateValidToken } from "../helpers"

beforeAll(async () => {
    await init();
    await prisma.room.deleteMany({})
    await prisma.hotel.deleteMany({})
})

beforeEach(async () => {
    await prisma.room.deleteMany({})
    await prisma.hotel.deleteMany({})
})

const server = supertest(app)

describe("GET /hotels", () => {
    describe("unauthorized cases", () => {
        it("should respond with status 401 if there's no token", async () => {
            const { status } = await server.get("/hotels");
            expect(status).toBe(httpStatus.UNAUTHORIZED);
        })
        it("should respond with status 401 if token is invalid", async () => {
            const { status } = await server.get("/hotels").set("Authorization", "Bearer XXX");
            expect(status).toBe(httpStatus.UNAUTHORIZED);
        })
    })
    describe("returns ok", () => {
        it("should respond with status 200 when token is valid", async () => {
            await prisma.hotel.create({
                data: {
                    name: "hotel1",
                    image: "image1",
                    createdAt: new Date,
                    updatedAt: new Date
                }
            })
            const result = await prisma.hotel.count()

            const token = await generateValidToken();
            const { status, body } = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(result).toBe(1)
            expect(status).toBe(200)
        })
    })
})

describe("GET /hotels/:id", () => {
    describe("unauthorized cases", () => {
        it("should respond with status 401 if there's no token", async () => {
            const { status } = await server.get("/hotels/1");
            expect(status).toBe(httpStatus.UNAUTHORIZED);
        })
        it("should respond with status 401 if token is invalid", async () => {
            const { status } = await server.get("/hotels/1").set("Authorization", "Bearer XXX");
            expect(status).toBe(httpStatus.UNAUTHORIZED);
        })
    })
    describe("not found cases", () => {
        it("should respond with status 204 if no content", async () => {
            const token = await generateValidToken();

            const { status } = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
            expect(status).toBe(httpStatus.NO_CONTENT)
        })
        it("should respond with status 200 if id found", async () => {
            await prisma.hotel.create({
                data: {
                    id: 5000,
                    name: "hotel1",
                    image: "image1"
                }
            })
            await prisma.room.create({
                data: {
                    id: 5000,
                    name: "hotel1",
                    capacity: 1,
                    hotelId: 5000
                }
            })

            const token = await generateValidToken();
            const { body, status } = await server.get("/hotels/5000").set("Authorization", `Bearer ${token}`);

            expect(status).toBe(httpStatus.OK)
            expect(body).toMatchObject({
                id: 5000,
                name: "hotel1",
                image: "image1",
                Rooms: [{
                    id: 5000,
                    name: "hotel1",
                    capacity: 1,
                    hotelId: 5000
                }]
            })
        })
    })
})