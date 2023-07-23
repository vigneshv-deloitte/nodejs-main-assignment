import express from 'express';
import {registerUser, loginUser, getAllUsers, getUserById, updateUserById, deleteUserById} from "../controllers/usersController.js"
import verifyAuthentication from "../utils/jwtAuthentication.js"

const userRouter= express.Router();

userRouter.post('/register', registerUser);

userRouter.post('/login', loginUser);

userRouter.get('/', getAllUsers);

userRouter.get('/:id', getUserById);

userRouter.patch('/:id',verifyAuthentication, updateUserById);

userRouter.delete('/:id',verifyAuthentication, deleteUserById);

export default userRouter;