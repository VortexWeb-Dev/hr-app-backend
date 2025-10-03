const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const requestRoutes = require('./routes/requestRoutes'); 
const agentRoutes = require('./routes/agentcourseRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const courseRoutes = require('./routes/courseRoutes');
const directoryRoutes = require('./routes/directoryRoutes');
const documentsRoutes = require('./routes/documentRoutes'); 
const eventsRoutes = require('./routes/eventRoutes');
const hrAttendanceRoutes = require('./routes/hrattendanceRoutes');
const hrRoutes = require('./routes/hrRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const offboarding = require('./routes/offboardingRoutes'); 
const onboarding = require('./routes/onboardingRoutes');   
const trainingPathRoutes = require('./routes/trainingPathRoutes');
const userRoutes = require('./routes/userRoutes'); 


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Test route
app.get('/api', (req, res) => {
    res.send('HR App Backend is running!');
});

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/hr', hrRoutes);                             
app.use('/api/hr/attendance', hrAttendanceRoutes);         
app.use('/api/events', eventsRoutes);                      
app.use('/api/training-paths', trainingPathRoutes);         
app.use('/api/onboarding', onboarding);              
app.use('/api/offboarding', offboarding);           
app.use('/api/documents', documentsRoutes);                
app.use('/api/approvals', approvalRoutes);                 
app.use('/api/directory', directoryRoutes);   
app.use('/api/leave', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/users', userRoutes); 


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
