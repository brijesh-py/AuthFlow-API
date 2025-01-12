const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const UserModel = require("../models/user.model");
const { verifyAccountMail, forgotPasswordMail } = require("../mail");

class UserService {
  constructor() {
    this.userModel = UserModel;
  }
  sanitize(user) {
    if (!user) return null;

    return {
      _id: user?._id,
      name: user?.name,
      email: user?.email,
      avatar: user?.avatar,
      role: user?.role,
      isVerified: user?.isVerified,
    };
  }
  randomToken(len = 32) {
    return crypto.randomBytes(len).toString("hex");
  }
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
  async findUser({ email }) {
    const user = await this.userModel.findOne({ email });
    return this.sanitize(user);
  }
  async findOnyById(_id) {
    const user = await this.userModel.findById(_id);
    return this.sanitize(user);
  }
  async createUser({ name, email, password, avatar, role }) {
    const hashedPassword = await this.hashPassword(password);
    const verifyToken = this.randomToken();
    const verifyTokenExpires =
      Date.now() + parseInt(process.env.ACCOUNT_VERIFY_EXPIRE_TIME) * 60 * 1000;
    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      avatar,
      role,
      verificationToken: verifyToken,
      verifyTokenExpires,
      isVerified: false,
    });
    await verifyAccountMail(email, verifyToken);
    return this.sanitize(user);
  }
  async generateVerificationToken({ email }) {
    const user = await this.userModel.findOne({ email });
    if (!user) return null;
    const verifyToken = this.randomToken();
    user.verificationToken = verifyToken;
    user.verifyTokenExpires =
      Date.now() + parseInt(process.env.ACCOUNT_VERIFY_EXPIRE_TIME) * 60 * 1000;
    await user.save();
    await verifyAccountMail(email, verifyToken);
    return this.sanitize(user);
  }
  async verifyAccount({ token }) {
    const user = await this.userModel.findOne({
      verificationToken: token,
      verifyTokenExpires: { $gt: Date.now() },
    });
    if (!user) return null;
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save();
    return this.sanitize(user);
  }
  async updateProfile(_id, { name, role, avatar }) {
    const user = await this.userModel.findById(_id);
    if (!user) return null;
    user.name = name;
    user.role = role;
    user.avatar = avatar;
    await user.save();
    return this.sanitize(user);
  }
  async updatePassword(_id, { oldPassword, password }) {
    const user = await this.userModel.findById(_id);
    if (!user) return null;
    const isPasswordValid = await this.comparePassword(
      oldPassword,
      user.password
    );
    if (!isPasswordValid) return null;
    const hashedPassword = await this.hashPassword(password);
    user.password = hashedPassword;
    await user.save();
    return this.sanitize(user);
  }
  async forgotPassword({ email }) {
    const resetToken = this.randomToken();
    const resetTokenExpires =
      Date.now() + parseInt(process.env.ACCOUNT_VERIFY_EXPIRE_TIME) * 60 * 1000;

    const user = await this.userModel.findOne({ email });
    if (!user) return null;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();
    await forgotPasswordMail(email, resetToken);
    return this.sanitize(user);
  }
  async resetPassword({ token, password }) {
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return null;
    const hashedPassword = await this.hashPassword(password);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return this.sanitize(user);
  }
  async createGoogleUser({ id, name, email, picture }) {
    const user = await this.userModel.create({
      name,
      email,
      googleId: id,
      avatar: picture,
      isVerified: true,
    });
    return this.sanitize(user);
  }
  async createGithubUser({ id, name, email, avatar_url }) {
    const user = await this.userModel.create({
      name,
      email,
      githubId: id,
      avatar: avatar_url,
      isVerified: true,
    });
    return this.sanitize(user);
  }
  async logUser({ email, password }) {
    const user = await this.userModel.findOne({ email });
    if (!user) return null;
    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) return null;
    return this.sanitize(user);
  }
}

module.exports = new UserService();
