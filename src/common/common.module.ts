import { Module, Global } from '@nestjs/common';
import { Judge0Service } from './services/judge0.service';

@Global()
@Module({
  providers: [Judge0Service],
  exports: [Judge0Service],
})
export class CommonModule {}
