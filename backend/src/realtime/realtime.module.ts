import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { ItemsModule } from '../items/items.module';
import { AuthModule } from '../auth/auth.module';

@Module({ imports: [ItemsModule, AuthModule], providers: [EventsGateway] })
export class RealtimeModule {}
