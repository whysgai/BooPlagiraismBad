import mongoose from 'mongoose';
import submissionSchema from './SubmissionSchema';

const submissionModel = mongoose.model('Submission',submissionSchema);

export default submissionModel;