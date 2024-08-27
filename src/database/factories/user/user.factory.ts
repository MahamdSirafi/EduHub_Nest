import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../../models/users/entities/user.entity';
import { UserPhoto } from '../../../models/users';
import { defaultPhoto } from '../../../common/constants';
import { Role } from '../../../models/roles';
import { ROLE } from '../../../common/enums';
import { Wallet } from '../../../models/users/entities/wallet.entity';

export const userFactory = setSeederFactory(User, async (faker) =>
  User.create({
    name: faker.person.firstName(),
    email: faker.internet.email().toLowerCase(),
    password: process.env.USER_PASSWORD,
    role: await Role.findOneBy({ name: ROLE.USER }),
    photos: [UserPhoto.create({ ...defaultPhoto })],
    wallet: Wallet.create(),
  }),
);
