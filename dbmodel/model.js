import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
  mentorid: {
    type: 'string',
    required: true,
  },
  mentorname: {
    type: 'string',
    required: true
  },
  studentsId: [
    {
      type: String,
      ref: 'students',
    }
  ]
});

const mentor = mongoose.model('mentors', mentorSchema);

const studentSchema = new mongoose.Schema({
    studentid: {
      type: 'string',
      required: true,
    },
    studentname: {
      type: 'string',
      required: true
    },
    mentorId: 
      {
        type: String,
        ref: 'students',
      }
      ,
  previousMentorId: {
    type: String,
    ref: 'mentors',
  }
    
  });
  
  const student = mongoose.model('students', studentSchema);

export{
    mentor,
    student
}
