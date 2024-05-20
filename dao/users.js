import User from "../models/user.js"

const fetAllUser = async () =>{
    try {
        return await User.find({}).exec()
    } catch (error) {
        throw new Error(error.toString())
    }
}

export default {fetAllUser}