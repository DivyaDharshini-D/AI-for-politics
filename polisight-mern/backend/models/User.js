const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Never returned in queries by default
    },
    plan: {
      type: String,
      enum: ['Free', 'Pro', 'Enterprise'],
      default: 'Free',
    },
    preferences: {
      theme:  { type: String, enum: ['dark', 'light'], default: 'dark' },
      accent: { type: String, enum: ['blue', 'purple', 'green', 'amber', 'red'], default: 'blue' },
    },
    savedArticles: [
      {
        articleId:   String,
        title:       String,
        url:         String,
        source:      String,
        publishedAt: String,
        savedAt:     { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method — compare plain password with hash
userSchema.methods.matchPassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// Instance method — return safe public profile (no password)
userSchema.methods.toProfile = function () {
  return {
    id:          this._id,
    name:        this.name,
    email:       this.email,
    plan:        this.plan,
    preferences: this.preferences,
    joinedAt:    this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
