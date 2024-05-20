import User from "../models/user.js"

const fetChAllUsers = async () =>{
    try {
        const users = await User.find({}).exec()
        return users
    } catch (error) {
        throw new Error(error.toString())
    }
}

export default {fetChAllUsers}