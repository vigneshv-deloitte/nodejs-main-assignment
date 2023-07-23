import mongoose from "mongoose";

const hackathonSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  max_participants: {
    type: Number,
    required: true,
  },
  registration_open: {
    type: Boolean,
    default: false,
  },
  registration_start_date: {
    type: Date,
    required: true,
  },
  registration_end_date: {
    type: Date,
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
  min_experience_level: {
    type: String,
    enum: [
      'Entry-level',
      'Intermediate',
      'Mid-level',
      'Senior or executive-level',
    ],
    required: true,
  },
});

const Hackathon = mongoose.model('Hackathon', hackathonSchema);

export default Hackathon