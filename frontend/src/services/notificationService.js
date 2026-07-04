export const notificationService = {
    /**
     * Sends an attendance report to a student's phone via WhatsApp.
     * @param {Object} student - The student object
     * @param {Object} reportData - Data regarding their attendance
     * @param {string} date - The date of the report
     */
    sendAttendanceReport(student, reportData, date) {
        const formattedDate = new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });

        const status = reportData.status || "Unknown";
        const phone = student.phone || student.parentPhone || "919876543210";

        const text = `Hello from the Tuition Centre,
This is the attendance report for *${student.name}*.

Date: ${formattedDate}
Status: *${status.toUpperCase()}*

Thank you for your cooperation!`;

        const encodedText = encodeURIComponent(text);
        const url = `https://wa.me/${phone}?text=${encodedText}`;

        window.open(url, "_blank");
    },

    /**
     * Sends a marks report to a student's phone via WhatsApp.
     * @param {Object} student - The student object
     * @param {Object} marksData - Data regarding their test marks
     */
    sendMarksReport(student, marksEntry) {
        const phone = student.phone || student.parentPhone || "919876543210";
        const formattedDate = new Date(marksEntry.date).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });

        let marksText = "";
        let total = 0;
        let subjectsCount = 0;
        
        if (marksEntry.marks) {
            for (const [subject, mark] of Object.entries(marksEntry.marks)) {
                marksText += `- ${subject.charAt(0).toUpperCase() + subject.slice(1)}: *${mark}*\n`;
                total += Number(mark) || 0;
                subjectsCount++;
            }
        }

        const text = `Hello from the Tuition Centre,
This is the marks report for *${student.name}* for the test: *${marksEntry.testName}* (${formattedDate}).

Marks Details:
${marksText}
Total Marks: *${total}*

Feel free to reach out if you have any questions. Thank you!`;

        const encodedText = encodeURIComponent(text);
        const url = `https://wa.me/${phone}?text=${encodedText}`;

        window.open(url, "_blank");
    }
};
