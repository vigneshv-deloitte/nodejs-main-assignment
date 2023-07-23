import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  hackathons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hackathon',
  }],
});


const Company = mongoose.model('Company', companySchema);

export default Company
