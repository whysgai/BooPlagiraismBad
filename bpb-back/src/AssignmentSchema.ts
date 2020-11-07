import mongoose from 'mongoose';
 
const { Schema } = mongoose;

  const assignmentSchema = new Schema({
    _id:  String,
  });

  export default assignmentSchema;