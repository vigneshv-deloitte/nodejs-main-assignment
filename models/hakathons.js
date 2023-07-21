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
    required: true,
  },
});

const Hackathon = mongoose.model('Hackathon', hackathonSchema);

export default Hackathon