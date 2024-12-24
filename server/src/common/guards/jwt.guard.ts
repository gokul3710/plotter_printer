import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  // Override the `canActivate` method to handle WebSocket context
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient(); // Get WebSocket client from the context

    const authHeader = client.handshake.headers.authorization; // Extract the Authorization header from the WebSocket handshake

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization header missing or invalid');
    }


    const token = authHeader.split(' ')[1]; // Extract the token part from the Bearer header


    try {
      // Verify the token with JwtService

      if(!token){
        throw new Error('Authorization header missing or invalid');
      }

      const decoded = this.jwtService.verify(token);
      client.user = decoded; // Attach user data to the WebSocket client object
      return true; // Token is valid
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Override the `handleRequest` method to handle any errors or customize the user data
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new Error('User authentication failed');
    }
    return user;
  }
}
