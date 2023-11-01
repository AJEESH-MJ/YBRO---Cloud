import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
    try{ 
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }catch(error){
        throw new Error('Hashing failed', error);
    }
}

export const comparePassword = async (password, hashedPassword) => {
    try{
        return await bcrypt.compare(password, hashedPassword);
    }catch(error){
        throw new Error('Comparing failed', error);
    }
}