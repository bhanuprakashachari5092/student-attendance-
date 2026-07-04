import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

export const attendanceService = {
    async getAttendanceByDate(date) {
        try {
            const response = await axios.get(`${API_URL}/attendance/${date}`);
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching attendance by date:', error);
            return [];
        }
    },

    async saveAttendance(date, records) {
        try {
            const response = await axios.post(`${API_URL}/attendance`, { date, records });
            return response.data.success;
        } catch (error) {
            console.error('Error saving attendance:', error);
            return false;
        }
    },

    async getSummary(date) {
        try {
            const response = await axios.get(`${API_URL}/attendance/${date}/summary`);
            return response.data.data || { present: 0, absent: 0, holiday: 0 };
        } catch (error) {
            console.error('Error fetching attendance summary:', error);
            return { present: 0, absent: 0, holiday: 0 };
        }
    },

    async getAllAttendance() {
        try {
            const response = await axios.get(`${API_URL}/attendance`);
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching all attendance:', error);
            return [];
        }
    },

    sendAbsentNotification(studentName, parentPhone, date) {
        const formattedDate = new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });

        const text = `Hello,

This is a notification from the Tuition Centre.

Your child *${studentName}* was absent today.

Date: ${formattedDate}

Please ensure regular attendance.

Thank you.`;

        const encodedText = encodeURIComponent(text);
        const url = `https://wa.me/${parentPhone}?text=${encodedText}`;

        window.open(url, "_blank");
    }
};
