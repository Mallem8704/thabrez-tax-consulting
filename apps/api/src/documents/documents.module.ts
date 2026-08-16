import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { StorageService } from './storage.service';
import { VirusScannerService } from './virus-scanner.service';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, StorageService, VirusScannerService],
  exports: [DocumentsService, StorageService, VirusScannerService],
})
export class DocumentsModule {}
