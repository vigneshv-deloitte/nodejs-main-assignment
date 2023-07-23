import User from "../models/users.js";
import Participant from "../models/participants.js";
import bcrypt from "bcrypt";
import { verifyPassword } from "../utils/verifyPassword.js";
import jwtSign from "../utils/jwtSign.js";

export const registerUser = async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      full_name,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await verifyPassword(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userId= user._id;
    const token = jwtSign({userId})

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    const usersWithHackathons = await Promise.all(
        users.map(async (user) => {
          const registeredHackathons = await Participant.find({ user_id: user._id })
            .populate('hackathon_id', 'name start_date end_date technology_stack');
          return { ...user.toObject(), registeredHackathons };
        })
      );
      res.json(usersWithHackathons);
 
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const registeredHackathons = await Participant.find({ user_id: user._id })
      .populate('hackathon_id', 'name start_date end_date technology_stack');
    const userWithHackathons = { ...user.toObject(), registeredHackathons };
    res.json(userWithHackathons);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, full_name } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if(email){
        user.email= email
    }
    if(full_name){
        user.full_name = full_name;
    }
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
