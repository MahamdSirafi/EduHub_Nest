import { ROLE } from '../../../common/enums';

export type ITeacher = {
  name: string;

  email: string;

  password: string;

  role?: ROLE.Teacher;
};
