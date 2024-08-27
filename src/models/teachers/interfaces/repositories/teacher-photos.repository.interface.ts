import { IPhoto } from '../../../../common/interfaces';
import { TeacherPhoto } from '../../entities/teacher-photo.entity';

export interface ITeacherPhotosRepository {
  create(params: IPhoto): TeacherPhoto;
  uploadPhoto(path: string): Promise<TeacherPhoto>;
  findPhotosByUser(userId: string): Promise<TeacherPhoto[]>;
}
