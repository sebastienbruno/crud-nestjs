import { User } from '../../schemas/user.schema'
import * as bcrypt from 'bcrypt';

export const userStub = (): User => {
    const hash = bcrypt.hashSync('password', 10);
      
  return {
    username: 'testusername',
    password: hash,
  }
}