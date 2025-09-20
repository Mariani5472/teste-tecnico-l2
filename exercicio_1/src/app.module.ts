import { Module } from '@nestjs/common';
import packModule = require('./packing/pack.module');

@Module({
    imports: [packModule.PackingModule],
})
export class AppModule { }