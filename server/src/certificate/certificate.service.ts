import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Certificate } from './schemas/certificate.schema';
import { CourseProgress } from '../course-progress/schemas/course-progress.schema';
import { CoursePurchase } from '../course-purchase/schemas/course-purchase.schema';
import { CreateCertificateDto, UpdateCertificateDto } from './dto/certificate.dto';
import { User } from '../users/schemas/user.schema';
import { uploadPDFToCloudinary } from 'utils/cloudinary';

const PDFDocument = require('pdfkit');

@Injectable()
export class CertificateService {
  private readonly logger = new Logger(CertificateService.name);

  constructor(
    @InjectModel('Certificate') private certificateModel: Model<Certificate>,
    @InjectModel('CourseProgress') private courseProgressModel: Model<CourseProgress>,
    @InjectModel('CoursePurchase') private coursePurchaseModel: Model<CoursePurchase>,
    @InjectModel('User') private userModel: Model<User>,
  ) { }

  async generateCertificate(payload: {
    userId: string;
    name?: string;
    course: string;
    courseId?: string;
  }): Promise<{ certId: string; fileName: string; buffer: Buffer; certificate: any }> {
    // Fetch user details if name is not provided or just to be safe
    let studentName = payload.name;
    if (!studentName || studentName.trim() === '') {
      try {
        const user = await this.userModel.findById(payload.userId);
        if (user) {
          studentName = user.name;
        } else {
          studentName = 'Student'; // Fallback
        }
      } catch (error) {
        this.logger.error(`Error fetching user ${payload.userId} for certificate`, error);
        studentName = 'Student';
      }
    }
    const certId = uuidv4();
    const fileName = `certificate-${certId}.pdf`;
    const issuedDate = new Date();

    // Generate PDF in memory using buffer
    const chunks: Buffer[] = [];
    // A4 Landscape: 841.89 x 595.28 points
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 50 });

    // Collect PDF data into buffer
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));

    // ---- Paths & Assets ----
    // Found in src/MrLogo.png
    const logoPath = path.join(process.cwd(), 'src', 'MrLogo.png');

    this.logger.log(`Using Logo Path: ${logoPath}`);

    let logoToUse = '';
    if (fs.existsSync(logoPath)) {
      logoToUse = logoPath;
    } else {
      this.logger.warn(`Logo not found at ${logoPath}`);
    }

    // ---- Colors (Based on Reference) ----
    const darkBlue = '#1e3a8a';    // Main text
    const accentBlue = '#3b82f6';  // Light blue accent/corner
    const goldColor = '#d97706';   // Name color
    const grayColor = '#4b5563';   // Body text

    // ---- Content ----

    // 1. Top-Left Corner Accent (L-Shape)
    doc.save()
      .moveTo(50, 100)
      .lineTo(50, 50)
      .lineTo(100, 50)
      .lineWidth(4)
      .strokeColor(accentBlue) // Light blue
      .stroke()
      .restore();

    // 2. Bottom-Right Corner Accent (L-Shape Mirrored)
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    doc.save()
      .moveTo(pageWidth - 50, pageHeight - 100)
      .lineTo(pageWidth - 50, pageHeight - 50)
      .lineTo(pageWidth - 100, pageHeight - 50)
      .lineWidth(4)
      .strokeColor(accentBlue) // Light blue
      .stroke()
      .restore();

    let yPos = 60;

    // 3. Logo (Centered)
    if (logoToUse) {
      const logoWidth = 80; // Slightly smaller for this design
      const xPos = (doc.page.width - logoWidth) / 2;
      doc.image(logoToUse, xPos, yPos, { width: logoWidth });
      yPos += 90; // Logo height + spacing
    } else {
      yPos += 50;
    }

    // 4. "EDUCATIONAL ACHIEVEMENT" (Small Caps)
    doc.fillColor(accentBlue)
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('EDUCATIONAL ACHIEVEMENT', 0, yPos, {
        align: 'center',
        characterSpacing: 2 // Tracking
      });

    yPos += 20;

    // 5. "Certificate" (Slightly smaller than massive)
    doc.fillColor(darkBlue)
      .fontSize(50) // Very Large
      .font('Helvetica-Bold')
      .text('Certificate', 0, yPos, {
        align: 'center',
        characterSpacing: 0 // Explicitly set char spacing here instead of chaining
      });

    yPos += 55;

    // 6. "of Completion"
    doc.fillColor(accentBlue)
      .fontSize(18)
      .font('Helvetica')
      .text('of Completion', 0, yPos, { align: 'center' });

    yPos += 50;

    // 7. "This is to certify that"
    doc.fillColor(grayColor)
      .fontSize(12)
      .font('Helvetica')
      .text('This is to certify that', 0, yPos, { align: 'center' });

    yPos += 30;

    // 8. Student Name (Gold, Italic)
    doc.fillColor(goldColor)
      .fontSize(42)
      .font('Helvetica-BoldOblique')
      .text(studentName, 0, yPos, { align: 'center' });

    yPos += 50;

    // 9. Decorative Divider (Line with Vector Diamond)
    const lineY = yPos + 10;
    const centerX = doc.page.width / 2;
    const lineWidth = 200;

    doc.save()
      .strokeColor('#e5e7eb') // Light gray line
      .lineWidth(1)
      .moveTo(centerX - lineWidth, lineY)
      .lineTo(centerX - 6, lineY) // Left line
      .moveTo(centerX + 6, lineY)
      .lineTo(centerX + lineWidth, lineY) // Right line
      .stroke();

    // Draw Center Diamond (Vector)
    doc.fillColor('#9ca3af') // darker gray for diamond
      .moveTo(centerX, lineY - 4) // Top
      .lineTo(centerX + 4, lineY) // Right
      .lineTo(centerX, lineY + 4) // Bottom
      .lineTo(centerX - 4, lineY) // Left
      .fill()
      .restore();

    yPos += 40;

    // 10. "has successfully completed the course"
    doc.fillColor(grayColor)
      .fontSize(12)
      .font('Helvetica')
      .text('has successfully completed the course', 0, yPos, { align: 'center' });

    yPos += 30;

    // 11. Course Name
    doc.fillColor(darkBlue)
      .fontSize(24)
      .font('Helvetica-Bold')
      .text(payload.course, 0, yPos, { align: 'center' });

    yPos += 60;

    // 12. Footer (Date & ID)
    doc.fontSize(10)
      .font('Helvetica')
      .fillColor(grayColor)
      .text(`Issued on: ${issuedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 0, null, { align: 'center' });

    doc.moveDown(0.5);
    doc.fillColor('#9ca3af') // light gray
      .text(`Certificate ID: ${certId}`, { align: 'center' });

    doc.end();

    // Wait for PDF to finish generating
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
    });

    // Save certificate record to database (without file path since it's streamed directly)
    const certificate = await this.certificateModel.create({
      userId: payload.userId,
      courseId: payload.courseId,
      userName: studentName,
      courseName: payload.course,
      certificateId: certId,
      fileName,
      filePath: '', // No local file stored
      issuedDate,
      status: 'active',
      certificateURL: '', // No cloud URL - direct download
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year validity
    });

    this.logger.log(`Certificate generated for user ${payload.userId} - Cert ID: ${certId}`);

    return {
      certId,
      fileName,
      buffer,
      certificate: certificate.toObject(),
    };
  }



  // Get certificate by ID
  async getCertificateById(certificateId: string) {
    const certificate = await this.certificateModel.findOne({
      certificateId,
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return certificate;
  }

  // Get all certificates for a user
  async getUserCertificates(userId: string) {
    const certificates = await this.certificateModel
      .find({ userId })
      .sort({ issuedDate: -1 });

    return certificates;
  }

  // Get all certificates for a course
  async getCourseCertificates(courseId: string) {
    const certificates = await this.certificateModel
      .find({ courseId })
      .populate('userId', 'name email')
      .sort({ issuedDate: -1 });

    return certificates;
  }

  // Update certificate status
  async updateCertificate(
    certificateId: string,
    updateDto: UpdateCertificateDto
  ) {
    const certificate = await this.certificateModel.findOneAndUpdate(
      { certificateId },
      updateDto,
      { new: true }
    );

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    this.logger.log(`Certificate ${certificateId} updated - Status: ${updateDto.status}`);
    return certificate;
  }

  // Revoke certificate
  async revokeCertificate(certificateId: string, reason?: string) {
    const certificate = await this.certificateModel.findOneAndUpdate(
      { certificateId },
      { status: 'revoked', description: reason || 'Certificate revoked' },
      { new: true }
    );

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    this.logger.log(`Certificate ${certificateId} revoked - Reason: ${reason}`);
    return certificate;
  }

  // Check and mark expired certificates
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async markExpiredCertificates() {
    this.logger.debug('Running certificate expiry check...');

    try {
      const result = await this.certificateModel.updateMany(
        {
          status: 'active',
          expiryDate: { $lt: new Date() }
        },
        { status: 'expired' }
      );

      if (result.modifiedCount > 0) {
        this.logger.log(`Marked ${result.modifiedCount} certificates as expired`);
      }
    } catch (error) {
      this.logger.error('Error marking expired certificates:', error);
    }
  }

  // Delete certificate and file
  async deleteCertificate(certificateId: string) {
    const certificate = await this.certificateModel.findOneAndDelete({
      certificateId,
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    // Delete the PDF file
    if (fs.existsSync(certificate.filePath)) {
      fs.unlinkSync(certificate.filePath);
      this.logger.log(`Deleted certificate file: ${certificate.filePath}`);
    }

    this.logger.log(`Certificate ${certificateId} deleted`);
    return { message: 'Certificate deleted successfully' };
  }
}
