import { Controller, Body, UseGuards, Request, Post } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Post('submit')
  async submitJob(@Body() job: any) {
    return this.jobsService.submitJob(job);
  }
}
