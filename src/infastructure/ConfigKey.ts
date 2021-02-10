export enum ConfigKey {
  AllowedOrigins = "ALLOWED_ORIGINS",
  ListenPort = "LISTEN_PORT",
  LogFile = "LOG_FILE",
  LogLevel = "LOG_LEVEL",
  IsSwaggerEnabled = "IS_SWAGGER_ENABLED",

  JwtAudience = "JWT_AUDIENCE",
  JwtIssuer = "JWT_ISSUER",
  JwtSecretKeyFile = "JWT_SECRET_KEY_FILE",
  JwtSigningAlgorithm = "JWT_SIGNING_ALGORITHM",

  MongoDbConnectionString = "MONGO_DB_CONNECTION_STRING",
  RedisMode = "REDIS_MODE",
  RedisHosts = "REDIS_HOSTS",

  JobCacheKeepMinutes = "JOB_CACHE_KEEP_MINUTES",
  JobCacheMaxEntries = "JOB_CACHE_MAX_ENTRIES",
  JobProgressReportThreshold = "JOB_PROGRESS_REPORT_THRESHOLD",
}

export const configDefaultMap: Map<ConfigKey, string | undefined> = new Map([
  [ConfigKey.AllowedOrigins, "*"],
  [ConfigKey.ListenPort, "8080"],
  [ConfigKey.LogFile, "combined.log"],
  [ConfigKey.LogLevel, "info"],
  [ConfigKey.IsSwaggerEnabled, String(true)],

  [ConfigKey.JwtSigningAlgorithm, "RS256"],

  [ConfigKey.JobCacheKeepMinutes, "120"],
  [ConfigKey.JobCacheMaxEntries, "30"],
  [ConfigKey.JobProgressReportThreshold, "0.05"],

  [ConfigKey.RedisMode, "Single"],
  [ConfigKey.RedisHosts, JSON.stringify({ host: "localhost", port: 6379 })],
]);
