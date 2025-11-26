import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChoicesService } from './choices.service';
import { Choice } from './entities/choice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Choice])],
  providers: [ChoicesService],
  exports: [ChoicesService],
})
export class ChoicesModule {}
