import mongoose from 'mongoose';
 
const { Schema } = mongoose;

  const submissionSchema = new Schema({
    _id:  String,
  });

  export default submissionSchema;