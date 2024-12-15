import { Controller, Post, UseInterceptors, UploadedFile, Body, Req, Headers } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JobsService } from './jobs.service';
import { CreatePrintJobDto } from './dto/create-print-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('submit')
  @UseInterceptors(FileInterceptor('file'))
  async submitJob(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreatePrintJobDto,
    @Headers() headers: { [key: string]: string },
  ) {
    const job = {
      fileName: file.originalname,
      filePath: file.path,
      settings: body.settings,
      printerName: body.printerName,
      clientId: headers['x-client-id'],
    };
    return this.jobsService.submitJob(job);
  }
}