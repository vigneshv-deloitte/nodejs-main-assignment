import express from "express";
import { createCompany, getAllCompanies, getCompanyById, updateCompanyById, deleteCompanyById, loginCompany } from "../controllers/companyController.js";
import verifyAuthentication from "../utils/jwtAuthentication.js"
const companyRouter = express.Router();

companyRouter.post('/', createCompany);

companyRouter.post('/login', loginCompany);

companyRouter.get('/', getAllCompanies);

companyRouter.get('/:id', getCompanyById);

companyRouter.patch('/:id',verifyAuthentication, updateCompanyById);

companyRouter.delete('/:id',verifyAuthentication, deleteCompanyById);

export default companyRouter