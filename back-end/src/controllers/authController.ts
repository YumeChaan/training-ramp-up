import { Request, Response } from "express";
import { User, validateUser, generateAuthToken } from "../models/userModel";
import { AppDataSource } from "../configs/dbConfig";
import {
  registerStudent,
  loginService,
  handleRefreshTokenService,
} from "../services/userServices";
const generateOutput = require("../utils/outputFactory");
const userRepository = AppDataSource.getRepository(User);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function login(req: Request, res: Response) {
  //validating the user
  const error1 = validateUser(req.body);
  if (error1)
    return res
      .status(200)
      .send(generateOutput(400, "validation error1", error1.message));
  try {
    let user = await loginService(req);
    const payload = { email: user.email, userRole: user.userRole };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30s",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    res
      .cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ accessToken: accessToken });
  } catch (err) {
    return res.status(500).send(generateOutput(500, "error", err.message));
  }
}

async function handleRefreshToken(req: Request, res: Response) {
  try {
    const accessToken = await handleRefreshTokenService(req);
    res.status(200).json({ accessToken: accessToken });
  } catch (err) {
    return res.status(500).send(generateOutput(500, "error", err.message));
  }
}

async function logout(req: Request, res: Response) {
  const cookies = req.cookies;
  if (!cookies.jwt)
    return res.status(401).send(generateOutput(401, "error", "Unauthorized"));
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(200).send(generateOutput(200, "success", "Logout successfully!"));
}

module.exports = { login, handleRefreshToken, logout };