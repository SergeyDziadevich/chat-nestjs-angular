import { seedDatabase } from './seed-collection';

import { AppDataSource } from './data-source';

AppDataSource.initialize().then(async (dataSource) => {
  await seedDatabase(dataSource);
  process.exit(0);
});
