import Participant from "../models/participants.js";


export const getAllParticipants = async (req, res) => {
  try {
    const participants = await Participant.find();
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getParticipantById = async (req, res) => {
  try {
    const { id } = req.params;
    const participant = await Participant.findById(id);
    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }
    res.json(participant);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getParticipantsByCriteria = async (req, res) => {
    console.log("--------------")
  try {
    const { experience_level, technology_stack, business_unit } = req.query;

    const query = {};
    if (experience_level) {
      query.experience_level = experience_level;
    }
    if (technology_stack) {
      query.technology_stack = technology_stack;
    }
    if (business_unit) {
      query.business_unit = business_unit;
    }

    const participants = await Participant.find(query);
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const updateParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const { experience_level, technology_stack, business_unit } = req.body;

    const participant = await Participant.findById(id);
    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    if (experience_level) {
      participant.experience_level = experience_level;
    }
    if (technology_stack) {
      participant.technology_stack = technology_stack;
    }
    if (business_unit) {
      participant.business_unit = business_unit;
    }

    await participant.save();

    res.json({ message: 'Participant updated successfully', participant });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const deleteParticipant = async (req, res) => {
    try {
      const { id } = req.params;
  
      const participant = await Participant.findById(id);
      if (!participant) {
        return res.status(404).json({ error: 'Participant not found' });
      }
  
      await Participant.deleteOne({ _id: id });
  
      res.json({ message: 'Participant deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
