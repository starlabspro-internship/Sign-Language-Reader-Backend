import mongoose from 'mongoose';

const { Schema } = mongoose;

const SignSchema = new Schema({
    name: { type: String, required: true},
    signImage: { type: String, required: true},
})

const Sign = mongoose.model('Sign', SignSchema);
export default Sign;