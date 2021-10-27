import { Injectable } from '@nestjs/common';
import { User } from './user.model';

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    new User(1, 'john', 'changeme'),
    new User(2, 'maria', 'guess'),
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async getAll(): Promise<User[]> {
    return [...this.users];
  }

  async insertUser(username, password){
    const userId = this.users.length + 1;
    const user = new User(userId, username, password)
    this.users.push(user);
    return userId;
  }
}