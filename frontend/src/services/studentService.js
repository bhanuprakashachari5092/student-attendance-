import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

export const studentService = {
    async getStudents() {
        try {
            const response = await axios.get(`${API_URL}/students`);
            // Map MongoDB _id to id for frontend compatibility
            return response.data.data.map(student => ({
                ...student,
                id: student._id
            }));
        } catch (error) {
            console.error('Error fetching students:', error);
            return [];
        }
    },

    async addStudent(student) {
        try {
            const response = await axios.post(`${API_URL}/students`, student);
            const newStudent = response.data.data;
            return {
                ...newStudent,
                id: newStudent._id
            };
        } catch (error) {
            console.error('Error adding student:', error);
            throw error;
        }
    },

    async updateStudent(id, updatedData) {
        try {
            const response = await axios.put(`${API_URL}/students/${id}`, updatedData);
            const updatedStudent = response.data.data;
            return {
                ...updatedStudent,
                id: updatedStudent._id
            };
        } catch (error) {
            console.error('Error updating student:', error);
            throw error;
        }
    },

    async deleteStudent(id) {
        try {
            await axios.delete(`${API_URL}/students/${id}`);
            return true;
        } catch (error) {
            console.error('Error deleting student:', error);
            throw error;
        }
    }
};
