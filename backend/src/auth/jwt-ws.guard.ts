import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtWsGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const client: any = context.switchToWs().getClient();
    const token = client.handshake?.auth?.token ||
      (client.handshake?.headers?.authorization?.split(' ')[1]);
    if (!token) throw new UnauthorizedException('Missing token');
    try {
      const payload = this.jwt.verify(token);
      client.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
