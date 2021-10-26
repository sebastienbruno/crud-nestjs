import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      //useFactory: async (configService: ConfigService) => ({
        secretOrKey: 'secret', //configService.get<string>('JWT_SECRET'),
      //}),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}