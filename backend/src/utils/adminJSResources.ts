import { DatabaseMetadata } from '@adminjs/sql';

export const getAdminJSResources = (db: DatabaseMetadata) => [
  {
    resource: db.table('enrolled_users'),
    schema: 'public',
    options: {}
  },
  {
    resource: db.table('submissions'),
    schema: 'public',
    options: {}
  },
  {
    resource: db.table('locations'),
    schema: 'public',
    options: {}
  },
  {
    resource: db.table('tags'),
    schema: 'public',
    options: {}
  }
];
