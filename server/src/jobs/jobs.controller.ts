import { Controller, Post, UseInterceptors, UploadedFile, Body, Req, Headers, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JobsService } from './jobs.service';
import { CreatePrintJobDto } from './dto/create-print-job.dto';
import { UserGuard } from 'src/common/guards/user.guard';
import { User } from 'src/common/decorators/user.decorator';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('submit')
  @UseGuards(UserGuard)
  @UseInterceptors(FileInterceptor('file'))
  async submitJob(
    @User() userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreatePrintJobDto,
  ) {
    const job = {
      fileName: file.originalname,
      filePath: file.path,
      settings: body.settings,
      printerName: body.printerName,
      userId: userId
    };
    return this.jobsService.submitJob(job);
  }
}