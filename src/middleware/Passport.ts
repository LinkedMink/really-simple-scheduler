import { Request } from "express";
import { PassportStatic } from "passport";
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions as JwtStrategyOptions, VerifiedCallback } from "passport-jwt";

import { config } from "../infastructure/Config";
import { ConfigKey } from "../infastructure/ConfigKey";

export interface IJwtPayload {
  aud: string;
  claims: string[];
  email: string;
  exp: number;
  iat: number;
  iss: string;
  sub: string;
}

export const addJwtStrategy = (passport: PassportStatic): void => {
  const options: JwtStrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.getFileBuffer(ConfigKey.JwtSecretKeyFile),
    audience: config.getString(ConfigKey.JwtAudience),
    issuer: config.getString(ConfigKey.JwtIssuer),
    algorithms: [config.getString(ConfigKey.JwtSigningAlgorithm)],
    passReqToCallback: true,
  };

  passport.use(new JwtStrategy(options, (req: Request, jwtPayload: IJwtPayload, done: VerifiedCallback) => {
    if (jwtPayload.exp && Date.now() / 1000 > jwtPayload.exp) {
      return done("JWT Expired");
    }

    req.user = jwtPayload;
    return done(null, jwtPayload);
  }));
};
