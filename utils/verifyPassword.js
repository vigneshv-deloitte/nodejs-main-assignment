import bcrypt from "bcrypt";

export const verifyPassword=async(password, hashedPassword)=>{
    try {
        return await bcrypt.compare(password, hashedPassword);
      } catch (error) {
        return false;
      }
}