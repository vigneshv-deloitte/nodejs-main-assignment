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
      min_experience_level
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
      min_experience_level
    });
    res.status(201).json(hackathon);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getAllHackathons = async (req, res) => {
  try {
    const { category, page = 1, perPage = 10 } = req.query;
    let hackathons = [];

    const currentDate = new Date();

    switch (category) {
      case 'past':
        hackathons = await Hackathon.find({ end_date: { $lt: currentDate } });
        break;

      case 'active':
        hackathons = await Hackathon.find({
          start_date: { $lte: currentDate },
          end_date: { $gte: currentDate },
        });
        break;

      case 'upcoming':
        hackathons = await Hackathon.find({ start_date: { $gt: currentDate } });
        break;

      default:
        hackathons = await Hackathon.find();
        break;
    }

    const totalHackathons = hackathons.length;

    hackathons = hackathons.slice((page - 1) * perPage, page * perPage);

    const hackathonsWithParticipants = await Promise.all(
      hackathons.map(async (hackathon) => {
        const participants = await Participant.find({ hackathon_id: hackathon._id });
        return { ...hackathon.toObject(), participants };
      })
    );

    res.json({ totalHackathons, currentPage: page, totalPages: Math.ceil(totalHackathons / perPage), hackathons: hackathonsWithParticipants });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getHackathonByQuery = async(req, res) => {
  try {
    const { id, name, companyName, technologyStack } = req.query;

    if (id) {
      const hackathon = await Hackathon.findById(id);
      if (!hackathon) {
        return res.status(404).json({ error: 'Hackathon not found' });
      }
      const participants = await Participant.find({ hackathon_id: hackathon._id });
      const hackathonWithParticipants = { ...hackathon.toObject(), participants };
      return res.json(hackathonWithParticipants);
    }

    const query = {};
    if (name) {
      query.name = { $regex: new RegExp(name, 'i') };
    }
    if (companyName) {
      query.company_id = { $regex: new RegExp(companyName, 'i') };
    }
    if (technologyStack) {
      query.technology_stack = { $regex: new RegExp(technologyStack, 'i') };
    }

    const hackathons = await Hackathon.find(query);
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
    const experience_levels=[
      "Entry-level",
      "Intermediate",
      "Mid-level",
      "Senior or executive-level"
    ]
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
    if(experience_levels.indexOf(hackathon.min_experience_level)>experience_levels.indexOf(experience_level)){
      return res.status(400).json({ error: `Minimum experience level for this hackathon is ${hackathon.min_experience_level}` });
    }
    if(hackathon.technology_stack===technology_stack){
      return res.status(400).json({ error: `Required tech stack for this hackathon is ${hackathon.technology_stack}` });
    }

    const participantRegisteredHackathons = await Participant.find({
      user_id,
    }).populate('hackathon_id');

    for (const participantHackathon of participantRegisteredHackathons) {
      if(participantHackathon.hackathon_id){
      const { start_date, end_date } = participantHackathon.hackathon_id;
      if (
        start_date <= hackathon.end_date &&
        end_date >= hackathon.start_date
      ) {
        return res.status(400).json({ error: 'Cannot register for overlapping hackathons' });
      }
    }
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

