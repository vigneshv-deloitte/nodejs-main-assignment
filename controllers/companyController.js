import Company from "../models/companies.js";
import Hackathon from "../models/hakathons.js";
import jwtSign from "../utils/jwtSign.js";
import bcrypt from "bcrypt";
import { verifyPassword } from "../utils/verifyPassword.js";

export const createCompany = async (req, res) => {
  try {
    let { name, password } = req.body;
    const minLength = 8;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);

    if (password.length < minLength || !hasLowerCase || !hasUpperCase || !hasDigit) {

      return res.status(400).json({
        message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.",
      });
    }
    password= await bcrypt.hash(password, 10);
    const company = await Company.create({ name, password });
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    const companiesWithHackathons = await Promise.all(
      companies.map(async (company) => {
        const hackathons = await Hackathon.find({ company_id: company._id });
        return { ...company.toObject(), hackathons };
      })
    );
    res.json(companiesWithHackathons);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    const hackathons = await Hackathon.find({ company_id: id});
    const companyWithHackathons = { ...company.toObject(), hackathons };
    res.json(companyWithHackathons);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name} = req.body;
    const company = await Company.findByIdAndUpdate(id, { name }, { new: true });
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByIdAndDelete(id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const loginCompany = async (req, res) => {
    try {
      const { name, password } = req.body;
      const company = await Company.findOne({ name });
      const id= company._id;
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }
  
      const isPasswordValid = await verifyPassword(password, company.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const token = jwtSign({ id });
  
      res.json({ message: 'Logged in successfully', token });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };