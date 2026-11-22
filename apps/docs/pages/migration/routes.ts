import { MigrationOptimusDemo } from './optimus';
import { MigrationPrimengDemo } from './primeng';
import { MigrationUpdateDemo } from './update';
import { MigrationV22Demo } from './v22';

export default [
    {
        path: 'primeng',
        component: MigrationPrimengDemo
    },
    {
        path: 'optimus',
        component: MigrationOptimusDemo
    },
    {
        path: 'update',
        component: MigrationUpdateDemo
    },
    {
        path: 'v22',
        component: MigrationV22Demo
    }
];
