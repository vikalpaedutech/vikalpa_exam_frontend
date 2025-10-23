// Using Axios for Room APIs

import axios from 'axios';
const BaseURL = process.env.REACT_APP_API_BASE_URL;

console.log("i am insdie service")

class RoomService {
    

    
    // 1. POST - Create a new room
    createRoom(formData) {
        const url = `${BaseURL}/api/create-room`;
        return axios.post(url, formData);
    }

    // 2. GET - Get rooms by gender (male/female)
    getRoomsByGender(gender) {
        const url = `${BaseURL}/api/rooms/${gender}`;
        return axios.get(url);
    }

    // 3. GET - Get room details by room number
    getRoomByRoomNo(roomNo) {
        const url = `${BaseURL}/api/room/${roomNo}`;
        return axios.get(url);
    }

    // 4. PUT - Update room occupancy
    updateRoomOccupancy(roomNo, updatedData) {
        const url = `${BaseURL}/api/update-occupancy/${roomNo}`;
        return axios.put(url, updatedData);
    }

    // 5. POST - Assign a student to a room and bed
    assignStudentToRoom(formData) {
        const url = `${BaseURL}/api/assign-student`;
        return axios.post(url, formData);
    }

    // 6. GET - Check room availability (exhausted or not)
    checkRoomAvailability(roomNo) {
        const url = `${BaseURL}/api/check-room-availability/${roomNo}`;
        return axios.get(url);
    }

    // 7. GET - Get available rooms separately for Male and Female
    getAvailableRoomsByGender() {
        const url = `${BaseURL}/api/available-rooms`;
        return axios.get(url);
    }




    //Updating occupancy of roomrs

putOccupancyOfRooms (roomNo, updatedOccupancy) {
    console.log(roomNo)
    const url = `${BaseURL}/api/update-occupied/${roomNo}`;
    console.log(url)
    return axios.put(url, updatedOccupancy);
    
}
}




// Create an instance of RoomService
const roomServiceInstance = new RoomService();

// Export the instance
export default roomServiceInstance;
