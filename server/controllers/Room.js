const { createRoom, getRooms } = require('../services/Room');




const getRoomsController = async (req, res) => {
    try {
        const hotelId = req.params.hotelId;
        const rooms = await getRooms(hotelId);
        res.json(rooms);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const createRoomController = async (req, res) => {
    try {
        const roomData = req.body;
        const newRoom = await createRoom(roomData);
        res.json(newRoom);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    createRoomController,
    getRoomsController
}