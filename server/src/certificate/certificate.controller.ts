import { Controller, Post, Body, Res, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { CertificateService } from './certificate.service';
import { UpdateCertificateDto } from './dto/certificate.dto';

@Controller('certificate')
export class CertificateController {
  constructor(private readonly service: CertificateService) { }

  @Post('generate')
  async generate(@Body() body: { userId: string; name?: string; course: string; courseId: string }, @Res() res: Response) {
    const { buffer, fileName } = await this.service.generateCertificate({
      userId: body.userId,
      name: body.name,
      course: body.course,
      courseId: body.courseId,
    });

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', buffer.length);

    // Send the PDF buffer directly to client
    return res.send(buffer);
  }

  // Get certificate by ID
  @Get(':certificateId')
  async getCertificate(@Param('certificateId') certificateId: string) {
    const certificate = await this.service.getCertificateById(certificateId);
    return { data: certificate };
  }

  // Get all certificates for a user
  @Get('user/:userId')
  async getUserCertificates(@Param('userId') userId: string) {
    const certificates = await this.service.getUserCertificates(userId);
    return { data: certificates };
  }

  // Get all certificates for a course
  @Get('course/:courseId')
  async getCourseCertificates(@Param('courseId') courseId: string) {
    const certificates = await this.service.getCourseCertificates(courseId);
    return { data: certificates };
  }

  // Update certificate
  @Put('update/:certificateId')
  async updateCertificate(
    @Param('certificateId') certificateId: string,
    @Body() updateDto: UpdateCertificateDto
  ) {
    const certificate = await this.service.updateCertificate(certificateId, updateDto);
    return { data: certificate, message: 'Certificate updated successfully' };
  }

  // Revoke certificate
  @Put('revoke/:certificateId')
  async revokeCertificate(
    @Param('certificateId') certificateId: string,
    @Body() body: { reason?: string }
  ) {
    const certificate = await this.service.revokeCertificate(certificateId, body.reason);
    return { data: certificate, message: 'Certificate revoked successfully' };
  }

  // Delete certificate
  @Delete(':certificateId')
  async deleteCertificate(@Param('certificateId') certificateId: string) {
    const result = await this.service.deleteCertificate(certificateId);
    return result;
  }

  // Download certificate PDF
  @Get('download/:certificateId')
  async downloadCertificate(
    @Param('certificateId') certificateId: string,
    @Res() res: Response
  ) {
    const certificate = await this.service.getCertificateById(certificateId);
    return res.download(certificate.filePath, certificate.fileName);
  }
}
