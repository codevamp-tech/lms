// Example: How to integrate certificate generation with course completion

// In course-progress.service.ts or wherever you mark courses as completed:

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CertificateService } from '../certificate/certificate.service';

@Injectable()
export class CourseProgressService {
  constructor(
    @InjectModel('CourseProgress')
    private readonly courseProgressModel: Model<any>,
    private certificateService: CertificateService, // Add this
    // ... other dependencies
  ) { }

  async markCourseComplete(userId: string, courseId: string) {
    // Your existing logic to update CourseProgress
    const courseProgress = await this.courseProgressModel.findOneAndUpdate(
      { userId, courseId },
      { completed: true, completedDate: new Date() },
      { new: true }
    ).populate('userId').populate('courseId');

    // Optional: Generate certificate immediately instead of waiting for scheduled task
    if (courseProgress && courseProgress.userId && courseProgress.courseId) {
      try {
        await this.certificateService.generateCertificate({
          userId: courseProgress.userId._id.toString(),
          name: courseProgress.userId.name || courseProgress.userId.email,
          course: courseProgress.courseId.courseTitle,
          courseId: courseProgress.courseId._id.toString(),
        });

        // Optionally send email notification
        // await this.emailService.sendCertificateReady(userId);
      } catch (error) {
        console.error('Error generating certificate:', error);
        // Don't fail the course completion if certificate generation fails
      }
    }

    return courseProgress;
  }
}

// ============================================
// AUTOMATIC GENERATION (Already Implemented)
// ============================================
// The CertificateService.autoGenerateCertificates() method runs every hour
// and automatically generates certificates for any completed courses without certificates.
//
// This means you have TWO options:
//
// Option 1: IMMEDIATE GENERATION (above)
// - Generate certificate immediately when course is marked complete
// - User gets certificate right away
// - Requires updating course-progress service
//
// Option 2: AUTOMATIC HOURLY GENERATION (already implemented)
// - Scheduled task runs every hour
// - Finds all completed courses without certificates
// - Generates them automatically
// - No code changes needed
// - Set it and forget it!
//
// Recommendation: Use Option 2 (already implemented)
// It's already running and will auto-generate certificates.
// The scheduled task checks every hour and generates any missing certificates.
// ============================================

// If you want IMMEDIATE generation, add to course-progress.service.ts constructor:
/*
constructor(
  @InjectModel('CourseProgress')
  private readonly courseProgressModel: Model<CourseProgress>,
  @InjectModel('Course')
  private readonly courseModel: Model<Course>,
  @InjectModel('CoursePurchase')
  private readonly coursePurchaseModel: Model<CoursePurchase>,
  private certificateService: CertificateService, // ADD THIS LINE
) { }
*/

// Then update the method that marks course as complete to call:
/*
await this.certificateService.generateCertificate({
  userId: userId,
  name: userName,
  course: courseName,
  courseId: courseId,
});
*/
