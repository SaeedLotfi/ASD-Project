import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}
  all() { return this.prisma.item.findMany(); }
  create(name: string, userId: string) { return this.prisma.item.create({ data: { name, userId } }); }
  updateCoords(id: string, x: number, y: number) {
    return this.prisma.item.update({ where: { id }, data: { x, y } });
  }
}
