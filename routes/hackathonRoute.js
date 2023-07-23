import express from 'express';
import { createHackathon, getAllHackathons, getHackathonByQuery, updateHackathonById, deleteHackathonById, registerForHackathon } from '../controllers/hackathonController.js';
import verifyAuthentication from "../utils/jwtAuthentication.js"

const hackathonRouter = express.Router();

hackathonRouter.post('/',verifyAuthentication, createHackathon);

hackathonRouter.get('/', getAllHackathons);

hackathonRouter.get('/getByQuery', getHackathonByQuery);

hackathonRouter.patch('/:id',verifyAuthentication, updateHackathonById);

hackathonRouter.delete('/:id',verifyAuthentication, deleteHackathonById);

hackathonRouter.post('/:hackathonId/register',verifyAuthentication, registerForHackathon);


export default hackathonRouter