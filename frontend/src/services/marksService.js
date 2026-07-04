import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

export const marksService = {
    async getMarksHistory() {
        try {
            const response = await axios.get(`${API_URL}/marks`);
            return response.data.data.map(mark => ({
                ...mark,
                id: mark._id
            }));
        } catch (error) {
            console.error('Error fetching marks history:', error);
            return [];
        }
    },

    async addMarksEntry(entry) {
        try {
            const response = await axios.post(`${API_URL}/marks`, entry);
            const newEntry = response.data.data;
            return {
                ...newEntry,
                id: newEntry._id
            };
        } catch (error) {
            console.error('Error saving marks:', error);
            throw error;
        }
    },

    async getMarksByStudent(studentId) {
        try {
            const response = await axios.get(`${API_URL}/marks/student/${studentId}`);
            return response.data.data.map(mark => ({
                ...mark,
                id: mark._id
            }));
        } catch (error) {
            console.error('Error fetching marks for student:', error);
            return [];
        }
    }
};
