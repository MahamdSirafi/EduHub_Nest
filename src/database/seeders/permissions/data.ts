import { Action, Entities, ROLE } from '../../../common/enums';
import { IPermission } from '../../../models/permissions';

type pp = { roles?: any[] } & IPermission;
export const permissions: pp[] = [
  {
    action: Action.Manage,
    subject: Entities.User,
    roles: [ROLE.ADMIN],
  },
  {
    action: Action.Manage,
    subject: Entities.Statistics,
    roles: [ROLE.ADMIN],
  },
  {
    action: Action.Manage,
    subject: Entities.Wallet,
    roles: [ROLE.ADMIN, ROLE.Teacher],
  },
  { action: Action.Read, subject: Entities.Admin, roles: [ROLE.ADMIN] },
  { action: Action.Manage, subject: Entities.All, roles: [ROLE.SUPER_ADMIN] },
];
