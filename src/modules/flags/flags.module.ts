import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlagsService } from './flags.service';
import { FlagsController } from './flags.controller';
import { Flag } from './entities/flag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Flag])],
  controllers: [FlagsController],
  providers: [FlagsService],
  exports: [FlagsService],
})
export class FlagsModule {}