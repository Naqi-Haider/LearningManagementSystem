import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student',
  },
  profileImage: {
    type: String,
    default: '',
  },
}, { timestamps: true });

// Simple password comparison (no hashing)
userSchema.methods.comparePassword = function (candidatePassword) {
  return this.password === candidatePassword;
};

export default mongoose.model('User', userSchema);
