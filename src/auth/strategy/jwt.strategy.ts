import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { User } from "../entities/auth.entity";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService, private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
        })
    }

    async validate(payload: { sub: number; email: string }): Promise<User> {
        try {
            const user = await this.authService.validateUser({ userId: payload.sub, email: payload.email });
            if (!user) {
                throw new UnauthorizedException('User not found');
            }
            delete user.hash
            return user;
        } catch (error) {
            throw new UnauthorizedException('User not found');
        }
    }
    

}