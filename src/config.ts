import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string;
  currentUserName?: string;
};

// ====== helpers (nieeksportowane) ======

function getConfigFilePath(): string {
  return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config): void {
  const rawConfig = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };

  fs.writeFileSync(
    getConfigFilePath(),
    JSON.stringify(rawConfig, null, 2),
    { encoding: "utf-8" }
  );
}

function validateConfig(rawConfig: any): Config {
  if (
    typeof rawConfig !== "object" ||
    rawConfig === null ||
    typeof rawConfig.db_url !== "string"
  ) {
    throw new Error("Invalid config file");
  }

  const cfg: Config = {
    dbUrl: rawConfig.db_url,
  };

  if (rawConfig.current_user_name) {
    if (typeof rawConfig.current_user_name !== "string") {
      throw new Error("Invalid current_user_name");
    }
    cfg.currentUserName = rawConfig.current_user_name;
  }

  return cfg;
}

// ====== exported functions ======

export function readConfig(): Config {
  const filePath = getConfigFilePath();
  const data = fs.readFileSync(filePath, { encoding: "utf-8" });
  const rawConfig = JSON.parse(data);
  return validateConfig(rawConfig);
}

export function setUser(userName: string): void {
  const cfg = readConfig();
  cfg.currentUserName = userName;
  writeConfig(cfg);
}
