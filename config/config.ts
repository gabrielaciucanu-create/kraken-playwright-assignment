import * as fs from "fs";
import * as path from "path";
import { parse } from "yaml";

const configPath = path.join(__dirname, "config.yaml");
const configContent = fs.readFileSync(configPath, "utf-8");
const config = parse(configContent) as {
  baseUrl: string;
  users: {
    userA: { username: string; email: string; password: string };
    userB: { username: string; email: string; password: string };
  };
};

export const BASE_URL = process.env.BASE_URL ?? config.baseUrl;
export const USER_A = config.users.userA;
export const USER_B = config.users.userB;
export default config;
