import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from './../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/models/auth/dtos';
import { UpdateUserDto } from '../src/models/users/dtos';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
    await app.listen(3000);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3000');
  });
  afterAll(async () => {
    await app.close();
  });
  describe('Auth', () => {
    const dto: AuthDto = { email: 'aa@ss.com', password: '123Ax@@' };
    describe('SingUp', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('should throw if  no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Login', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('should throw if  no body provided', () => {
        return pactum.spec().post('/auth/login').withBody({}).expectStatus(400);
      });
      it('should login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get me', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withBearerToken('$S{userAt}')
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: UpdateUserDto = { firstName: 'ali' };
        return pactum
          .spec()
          .patch('/users/me')
          .withBearerToken('$S{userAt}')
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .inspect();
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {});

    describe('Get bookmarks', () => {});

    describe('Get bookmark by id', () => {});

    describe('Edit bookmark by id', () => {});

    describe('Delete bookmark by id', () => {});
  });
});
