export class UserProfileDto {
  FirstName: string;
  LastName: string;
  address?: string;
  gender: string;
  CIN?: string;
  DOB: Date;
}

export class SessionDto {
  id: string;
  userId: string;
  userAgent?: string;
  ipAddress?: string;
  lastActivity: Date;
  createdAt: Date;
  isActive: boolean;
}

export class AuditLogDto {
  id: string;
  userId?: string;
  action: string;
  resource?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}
