import mongoose from 'mongoose';
import assignmentSchema from './AssignmentSchema';

const assignmentModel = mongoose.model('Assignment',assignmentSchema);

export default assignmentModel;