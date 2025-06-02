import { DataSource } from 'typeorm';
import { UserEntity } from '../user/model/user.entity';
import users from './users.json';

export async function seedDatabase(dataSource: DataSource) {
  // Example: Seed users
  const userRepository = dataSource.getRepository(UserEntity);

  // Clear existing data (optional)
  await userRepository.delete({});

  // Remove the 'role' property since UserEntity does not support it
  //const usersToInsert = users.map(({ role, ...user }) => user);

  await userRepository.save(users);
}
