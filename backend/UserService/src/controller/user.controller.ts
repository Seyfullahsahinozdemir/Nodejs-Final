import { Request, Response, NextFunction } from "express";
import UserModel from "../data/user/user.data";
import CustomResponse from "../utils/custom.response";
import * as bcrypt from "bcrypt";
import OtpModel from "../data/user/otp.data";
import { otpGenerate } from "../email/otp.generator";
import { emailSend } from "../email/email.sender";
import { generateToken } from "../utils/jwt.utils";
import MovieModel from "../data/movie/movie.data";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const existingUser = await UserModel.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    if (existingUser) {
      return new CustomResponse(
        null,
        "Username or email already using"
      ).error400(res);
    }

    const salt = bcrypt.genSaltSync(10);

    const hash = bcrypt.hashSync(req.body.password, salt);

    const createdUser = await UserModel.create({
      username: req.body.username,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hash,
      preferences: {
        gender: null,
        phone: null,
        address: null,
        about: null,
        birthDate: null,
      },
    });

    if (createdUser) {
      return new CustomResponse(null, "success").created(res);
    }

    return new CustomResponse(null, "failed").error500(res);
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
      isDeleted: false,
    });

    if (!user) {
      return new CustomResponse(null, "User not found").error404(res);
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return new CustomResponse(null, "User not found").error404(res);
    }
    const otpData = otpGenerate();
    const emailText =
      "Otp login is active, please use the code to login: " + otpData.otp;

    const otp = await OtpModel.create({
      email: user.email,
      otp: otpData.otp,
      target: "login",
      expirationTime: otpData.expirationTime,
    });

    if (otp) {
      emailSend(user.email, "Otp Login", emailText, res);
      return new CustomResponse(null, "Check your email to login.").success(
        res
      );
    }
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const verifyForLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  OtpModel.find({ email: req.body.email, target: "login" }).then((value) => {
    if (value.length > 0) {
      value.sort((a, b) =>
        Date.parse(a.expirationTime) > Date.parse(b.expirationTime) ? -1 : 1
      );

      if (
        req.body.otpCode == value[0].otp &&
        Date.parse(value[0].expirationTime) > new Date().getTime()
      ) {
        OtpModel.deleteMany({ email: req.body.email, target: "login" }).then(
          (responseOtpDelete) => {
            if (responseOtpDelete) {
              UserModel.findOne({
                email: req.body.email,
                isDeleted: false,
              }).then((response) => {
                if (response) {
                  const token = generateToken({
                    userId: response._id.toString(),
                    username: response.username,
                    email: response.email,
                    isAdmin: response.isAdmin,
                  });
                  return new CustomResponse(
                    { token, isAdmin: response.isAdmin },
                    "Login success"
                  ).success(res);
                }
              });
            } else {
              return new CustomResponse(
                null,
                "Invalid otp code, check otp code"
              ).error500(res);
            }
          }
        );
      } else {
        return new CustomResponse(
          null,
          "Invalid otp code, check otp code"
        ).error500(res);
      }
    } else {
      return new CustomResponse(
        null,
        "Invalid otp code, check otp code"
      ).error500(res);
    }
  });
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.findOne({ _id: req.body.userId });

    if (!user) {
      return new CustomResponse(null, "Not found").error404(res);
    }

    if (user.isAdmin) {
      return new CustomResponse(null, "Cannot delete admin").error500(res);
    }

    user.isDeleted = true;
    user.save();
    return new CustomResponse(null, "User updated success").success(res);
  } catch (error) {
    return new CustomResponse(null, "Cannot delete").error500(res);
  }
};

export const getProfileByUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.findOne({
      username: req.params.username,
    }).populate("favorites");

    if (user) {
      const { password, ...userWithoutPassword } = user.toObject();

      return new CustomResponse(userWithoutPassword, "profile info").success(
        res
      );
    } else {
      return new CustomResponse(null, "Not found").error404(res);
    }
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await MovieModel.find();

    const user = await UserModel.findOne({
      isDeleted: false,
      _id: req.user.id,
    }).populate("favorites");

    if (user) {
      const { password, ...userWithoutPassword } = user.toObject();

      return new CustomResponse(userWithoutPassword, "profile info").success(
        res
      );
    } else {
      return new CustomResponse(null, "Not found").error404(res);
    }
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pageIndex = parseInt(req.query.pageIndex as string);
    const pageSize = parseInt(req.query.pageSize as string);

    const users = await UserModel.find()
      .skip(pageIndex * pageSize)
      .limit(pageSize);
    return new CustomResponse(users, "users info").success(res);
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.findOne({
      _id: req.user.id,
      isDeleted: false,
    });

    if (!user) {
      return new CustomResponse(null, "User not found").error404(res);
    }

    const otpData = otpGenerate();
    const emailText = "Reset password otp code: " + otpData.otp;

    const otp = await OtpModel.create({
      email: user.email,
      otp: otpData.otp,
      target: "reset-password",
      expirationTime: otpData.expirationTime,
    });

    if (otp) {
      emailSend(user.email, "Reset Password", emailText, res);
      return new CustomResponse(
        null,
        "Check your email to reset password"
      ).success(res);
    }
  } catch (error) {
    console.error(error);
    return new CustomResponse(null, "failed").error500(res);
  }
};

export const verifyForResetPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("heree");
  OtpModel.find({ email: req.user.email, target: "reset-password" }).then(
    (value) => {
      if (value.length > 0) {
        value.sort((a, b) =>
          Date.parse(a.expirationTime) > Date.parse(b.expirationTime) ? -1 : 1
        );
        console.log("heree");

        if (
          req.body.otpCode == value[0].otp &&
          Date.parse(value[0].expirationTime) > new Date().getTime()
        ) {
          console.log("heree");

          OtpModel.deleteMany({
            email: req.user.email,
            target: "reset-password",
          }).then((responseOtpDelete) => {
            console.log("heree");

            if (responseOtpDelete) {
              UserModel.findOne({
                email: req.user.email,
                isDeleted: false,
              }).then((response) => {
                console.log("heree");

                if (response) {
                  const salt = bcrypt.genSaltSync(10);
                  const hash = bcrypt.hashSync(req.body.password, salt);
                  response.password = hash;
                  response.save();
                  return new CustomResponse(
                    null,
                    "Reset password success"
                  ).success(res);
                }
              });
            } else {
              return new CustomResponse(
                null,
                "Invalid otp code, check otp code"
              ).error500(res);
            }
          });
        } else {
          return new CustomResponse(
            null,
            "Invalid otp code, check otp code"
          ).error500(res);
        }
      } else {
        return new CustomResponse(
          null,
          "Invalid otp code, check otp code"
        ).error500(res);
      }
    }
  );
};

export const updatePreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedPreferences = {
      gender: req.body.gender,
      phone: req.body.phone,
      address: req.body.address,
      about: req.body.about,
      birthDate: req.body.birthDate,
    };

    const updatedData = {
      preferences: updatedPreferences,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user.id,
      updatedData,
      { new: true }
    );

    if (!updatedUser) {
      return new CustomResponse(null, "User not found").error404(res);
    }

    return new CustomResponse(null, "Updated successful").success(res);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
