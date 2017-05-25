import Hoodie from '@hoodie/client';
import PouchDB from 'pouchdb';

const hoodie = new Hoodie({
  url: 'http://localhost:8080',
  PouchDB
});

export default hoodie;
