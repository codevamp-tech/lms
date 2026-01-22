export class CreateCertificateDto {
  userId: string;
  courseId: string;
  name: string;
  courseName: string;
}

export class UpdateCertificateDto {
  status?: 'active' | 'revoked' | 'expired';
  certificateURL?: string;
  description?: string;
}

export class CertificateResponseDto {
  certificateId: string;
  fileName: string;
  filePath: string;
  issuedDate: Date;
  status: string;
  userName: string;
  courseName: string;
}
