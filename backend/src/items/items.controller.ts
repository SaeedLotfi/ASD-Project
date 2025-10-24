import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ItemsService } from './items.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('items')
@UseGuards(AuthGuard('jwt'))
export class ItemsController {
  constructor(private items: ItemsService) {}
  @Get() list() { 
    return this.items.all();
  }
  @Post() create(@Body('name') name: string, @Req() req: any) {
    return this.items.create(name, req.user.sub);
  }
}
