import { Module } from '@nestjs/common';
import { PackingService } from './pack.service';
import { PackingController } from './pack.controller';


@Module({
    providers: [PackingService],
    controllers: [PackingController],
})
export class PackingModule { }