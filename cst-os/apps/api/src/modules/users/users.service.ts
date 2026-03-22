import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException(`User with email ${dto.email} already exists`);
    }
    return this.prisma.user.create({ data: dto });
  }

  async findAll(query: QueryUsersDto) {
    const { role, status, search, department, page = 1, limit = 25 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      ...(role && { role }),
      ...(status && { status }),
      ...(department && { department }),
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fullName: 'asc' },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          orgLevel: true,
          status: true,
          department: true,
          capacityHoursPerWeek: true,
          skills: true,
          profilePhotoUrl: true,
          dateJoined: true,
          managerId: true,
          reportsToId: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        manager: {
          select: { id: true, fullName: true, email: true, role: true },
        },
        directReports: {
          select: { id: true, fullName: true, email: true, role: true },
        },
        managedClients: {
          select: { id: true, companyName: true, status: true },
          take: 10,
        },
      },
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByGoogleId(googleId: string) {
    return this.prisma.user.findUnique({ where: { googleId } });
  }

  async upsertFromGoogle(profile: {
    googleId: string;
    email: string;
    fullName: string;
    profilePhotoUrl?: string;
  }) {
    return this.prisma.user.upsert({
      where: { googleId: profile.googleId },
      create: {
        googleId: profile.googleId,
        email: profile.email,
        fullName: profile.fullName,
        profilePhotoUrl: profile.profilePhotoUrl,
      },
      update: {
        fullName: profile.fullName,
        profilePhotoUrl: profile.profilePhotoUrl,
      },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);
    return this.prisma.user.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }

  async getOrgChart() {
    return this.prisma.user.findMany({
      where: { status: 'active' },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        orgLevel: true,
        department: true,
        profilePhotoUrl: true,
        managerId: true,
        reportsToId: true,
      },
      orderBy: { fullName: 'asc' },
    });
  }

  // ERPNext-style export: returns all users as flat array for CSV
  async exportAll() {
    return this.prisma.user.findMany({
      orderBy: { fullName: 'asc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        orgLevel: true,
        status: true,
        department: true,
        capacityHoursPerWeek: true,
        skills: true,
        dateJoined: true,
        managerId: true,
      },
    });
  }
}
