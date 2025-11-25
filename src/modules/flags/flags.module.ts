import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlagsService } from './flags.service';
import { Flag } from './entities/flag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Flag])],
  providers: [FlagsService],
  exports: [FlagsService],
})
export class FlagsModule {}
