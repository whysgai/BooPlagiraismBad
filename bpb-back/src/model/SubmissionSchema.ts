import mongoose from 'mongoose';
 
const { Schema } = mongoose;

  const submissionSchema = new Schema({
    _id:  String,
    name: String,
    files: [String]
  });

  export default submissionSchema;