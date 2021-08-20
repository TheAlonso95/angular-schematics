import {
	SchematicTestRunner,
	UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';

describe('master-detail', () => {
	const schematicRunner = new SchematicTestRunner(
		'schematics',
		path.join(__dirname, './../collection.json')
	);

	const workspaceOptions: Record<string, string> = {
		name: 'workspace',
		newProjectRoot: 'projects',
		version: '0.5.0',
	};

	const appOptions: Record<string, string> = {
		name: 'schematest',
	};

	const schemaOptions: Record<string, string> = {
		name: 'foo',
	};

	let appTree: UnitTestTree;

	beforeEach(async () => {
		appTree = await schematicRunner
			.runExternalSchematicAsync(
				'@schematics/angular',
				'workspace',
				workspaceOptions
			)
			.toPromise();
		appTree = await schematicRunner
			.runExternalSchematicAsync(
				'@schematics/angular',
				'application',
				appOptions,
				appTree
			)
			.toPromise();
	});

	it('works', (done) => {
		schematicRunner
			.runSchematicAsync('master-detail', schemaOptions, appTree)
			.toPromise()
			.then((tree) => {
				const appComponent = tree.readContent(
					'/projects/schematest/src/app/components/master.component.ts'
				);
				expect(appComponent).toContain(`name = '${schemaOptions.name}'`);
				done();
			}, done.fail);
	});
});
