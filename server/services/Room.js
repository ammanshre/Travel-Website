const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const Inventory = require('../models/Inventory');

const createRoom = async (roomData) => {
    const { hotelId, type, price, quantity, amenities, images, description, name
     } = roomData;
    try {
        const newRoom = new Room({
            hotel: hotelId,
            name,
            type,
            price,
            quantity,
            amenities,
            images,
            description
        });

        const savedRoom = await newRoom.save();

        const hotel = await Hotel.findById(hotelId);
        hotel.rooms.push(savedRoom._id);
        if (!hotel.cheapestPrice || hotel.cheapestPrice > price) {
            hotel.cheapestPrice = price;
        }
        await hotel.save();

        const newInventory = new Inventory({
            room: savedRoom._id,
            datesBooked: [],
            availableQuantity: quantity,
            reservedQuantity: 0
        });

        const savedInventory = await newInventory.save();

        savedRoom.inventory.push(savedInventory._id);
        await savedRoom.save();

        return savedRoom;
    } catch (error) {
        throw new Error('Failed to create room: ' + error.message);
    }
};

const getRooms = async (hotelId) => {
    try {
        const rooms = await Room.find({ hotel: hotelId }).populate('inventory');
        return rooms;
    } catch (error) {
        throw new Error('Failed to get rooms: ' + error.message);
    }
};


module.exports = {
    createRoom,
    getRooms
}