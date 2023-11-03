import express from "express";


import { mentor as mentormodel,student as studentmodel } from "./dbmodel/model.js";

import dbconnect from "./dbmodel/mongoose-connection.js";

const app = express();

const port = 3200;

app.use(express.static("public"));

app.use(express.json());

await dbconnect();



///creating mentor
app.post('/mentors',async (req,res)=>{
    try{
      const mentor = new mentormodel(req.body)
      await mentor.save();
      res.send({msg:"mentor created successfully"})
    }
    catch(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    } 
  });
  
  
  app.get('/mentors',  async(req,res)=>{
    try{
       res.send(await mentormodel.find({},{_id:1,__v:0}));
    }
    catch(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    } 
  });

  ///creating student
app.post('/students',async (req,res)=>{
    try{
      const student = new studentmodel(req.body)
      await student.save();
      res.send({msg:"student created successfully"})
    }
    catch(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    } 
  });
  
  
  app.get('/students',  async(req,res)=>{
    try{
       res.send(await studentmodel.find({},{_id:1,__v:0}));
    }
    catch(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    } 
  });

  //Assigning a student to a mentor
app.post('/assign-students/:mentorid', async (req, res) => {
  try {
    const { mentorid } = req.params;
    const {studentid} = req.body

    const mentor = await mentormodel.findOne({ mentorid });
    
     // Check if the mentor is available or not
    if (!mentor) {
      res.status(404).send('Mentor not found.');
      return;
    }
    // Check if the student is available or not
    if (!studentid) {
      res.status(404).send('Student not found.');
      return;
    }
    // Check if the student is already assigned to the current mentor
    if (mentor.studentsId.includes(studentid)) {
      res.status(400).send('Student is already assigned to this mentor.');
      return;
    }
    // Check if the student is already assigned to any mentor
    const existingMentor = await mentormodel.findOne({ studentsId: studentid });

    if (existingMentor && existingMentor.mentorid !== mentorid) {
      res.status(400).send('Student is already assigned to a different mentor.');
      return;
    }

    mentor.studentsId.push(studentid)
    await mentor.save();

  //to return mentorid in students table while assigning 
    const student = await studentmodel.findOne({ studentid });
    student.mentorId = mentorid;
    await student.save();

    res.send({ msg: 'Students assigned to mentor successfully' });
  } 
  catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

//Assigning or changing mentor for particular student
app.put('/assign-mentor/:studentid', async (req, res) => {
  try {
    const { studentid } = req.params;
    const { newMentorId } = req.body;

    const studentdetail = await studentmodel.findOne({ studentid });

    if (!studentdetail) {
      res.status(404).send('Student not found.');
      return;
    }

    // Check if the new mentor exists
    const newMentor = await mentormodel.findOne({ mentorid: newMentorId });

    if (!newMentor) {
      res.status(404).send('New mentor not found.');
      return;
    }
    
    studentdetail.previousMentorId = studentdetail.mentorId;

    // If the student is already assigned to a mentor, remove them from the mentor's students list
    if (studentdetail.mentorId) {
      const previousMentor = await mentormodel.findOne({ mentorid: studentdetail.mentorId });
      if (previousMentor) {
        previousMentor.studentsId = previousMentor.studentsId.filter(s => s !== studentdetail.studentid);
        await previousMentor.save();
      }
    }

    // Updates the student's mentor to the new mentors
    studentdetail.mentorId = newMentorId;
    await studentdetail.save();

    // Adding student to the new mentor's students list
    newMentor.studentsId.push(studentdetail.studentid);
    await newMentor.save();

    res.send({ msg: 'Mentor assigned to student successfully', student: studentdetail.studentid, mentor: newMentorId });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

//Fetching all students of particular mentor
app.get('/mentor-students/:mentorid', async (req, res) => {
  try {
    const { mentorid } = req.params;

    const mentor = await mentormodel.findOne({ mentorid });

    if (!mentor) {
      res.status(404).send('Mentor not found.');
      return;
    }
    const studentIds = mentor.studentsId;

    // Fetch the student names for the IDs
    const studentsData = await studentmodel.find({ studentid: { $in: studentIds } }, { _id: 0, studentid: 1, studentname: 1 });

    res.send({ mentorId: mentor.mentorid, mentorName:mentor.mentorname, students: studentsData });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

//To fetch Previous mentor of particular student
app.get('/previous-mentor/:studentid', async (req, res) => {
  try {
    const { studentid } = req.params;

    const student = await studentmodel.findOne({ studentid });

    if (!student) {
      res.status(404).send('Student not found.');
      return;
    }
  //  const previousMentor= null;
    res.send({
      studentId: student.studentid,
      studentName: student.studentname,
      previousMentorId: student.previousMentorId ? student.previousMentorId : 'No previous mentor'
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
    console.log('Application Started on port 3200');
      });
