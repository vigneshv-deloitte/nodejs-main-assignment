import express from 'express';
import { getAllParticipants, getParticipantById, updateParticipant, deleteParticipant, getParticipantsByCriteria } from '../controllers/participantController.js';

const participantRouter = express.Router();


participantRouter.get('/',getAllParticipants);

participantRouter.get('/search', getParticipantsByCriteria);

participantRouter.get('/:id',getParticipantById);

participantRouter.patch('/:id', updateParticipant);

participantRouter.delete('/:id', deleteParticipant);


export default participantRouter;
