import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hackathon_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hackathon',
    required: true,
  },
  experience_level: {
    type: String,
    enum: [
      'Entry-level',
      'Intermediate',
      'Mid-level',
      'Senior or executive-level',
    ],
    required: true,
  },
  technology_stack: {
    type: String,
    enum: [
      'Python',
      'Java',
      'Javascript',
      'C',
    ],
    required: true,
  },
  business_unit: {
    type: String,
    required: true,
  },
});

const Participant = mongoose.model('Participant', participantSchema);

export default Participant