import Hackathon from "../models/hakathons.js";
import Participant from "../models/participants.js";

export const createHackathon = async (req, res) => {
  try {
    const {
      company_id,
      name,
      start_date,
      end_date,
      max_participants,
      registration_open,
      registration_start_date,
      registration_end_date,
      technology_stack,
    } = req.body;

    
    const hackathon = await Hackathon.create({
      company_id,
      name,
      start_date,
      end_date,
      max_participants,
      registration_open,
      registration_start_date,
      registration_end_date,
      technology_stack,
    });
    res.status(201).json(hackathon);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};


export const getAllHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find();
    const hackathonsWithParticipants = await Promise.all(
      hackathons.map(async (hackathon) => {
        const participants = await Participant.find({ hackathon_id: hackathon._id });
        return { ...hackathon.toObject(), participants };
      })
    );
    res.json(hackathonsWithParticipants);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getHackathonById = async (req, res) => {
  try {
    const { id } = req.params;
    const hackathon = await Hackathon.findById(id);
    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }
    const participants = await Participant.find({ hackathon_id: hackathon._id });
    const hackathonWithParticipants = { ...hackathon.toObject(), participants };
    res.json(hackathonWithParticipants);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateHackathonById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      start_date,
      end_date,
      max_participants,
      registration_open,
      registration_start_date,
      registration_end_date,
      technology_stack,
    } = req.body;

    const hackathon = await Hackathon.findByIdAndUpdate(
      id,
      {
        name,
        start_date,
        end_date,
        max_participants,
        registration_open,
        registration_start_date,
        registration_end_date,
        technology_stack,
      },
      { new: true }
    );

    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }

    res.json(hackathon);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const deleteHackathonById = async (req, res) => {
  try {
    const { id } = req.params;
    const hackathon = await Hackathon.findByIdAndDelete(id);
    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }
    res.json({ message: 'Hackathon deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




export const registerForHackathon = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const { user_id, experience_level, technology_stack, business_unit } = req.body;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon || !hackathon.registration_open) {
      return res.status(404).json({ error: 'Hackathon not found or registration is closed' });
    }

    const currentDate = new Date();

    if (currentDate > hackathon.registration_end_date) {
      return res.status(400).json({ error: 'Registration date has already passed' });
    }

    const totalRegisteredParticipants = await Participant.countDocuments({
      hackathon_id: hackathonId,
    });

    if (totalRegisteredParticipants >= hackathon.max_participants) {
      await Hackathon.findByIdAndUpdate(hackathonId, { registration_open: false });
      return res.status(400).json({ error: 'Hackathon registration is full' });
    }

    const participant = await Participant.create({
      user_id,
      hackathon_id: hackathonId,
      experience_level,
      technology_stack,
      business_unit,
    });

    if (totalRegisteredParticipants + 1 === hackathon.max_participants) {
      await Hackathon.findByIdAndUpdate(hackathonId, { registration_open: false });
    }

    res.status(201).json({ message: 'Registered for the hackathon successfully', participant });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
